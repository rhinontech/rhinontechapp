import { Router, Response } from "express";
import { Campaign, CampaignTemplate, Lead, CampaignActivity, User, InboxEmail } from "../models";
import { authenticate, authorize, AuthRequest } from "../middleware/authenticate";
import { env } from "../config/env";
import { generateAIEmailDraft } from "../services/gemini";
import { sendEmail } from "../services/mailer";
import { Op } from "sequelize";

const router = Router();

// Internal/Cron auth check helper
const isCronAuthorized = (req: any) => {
  const authHeader = req.headers.get?.("Authorization") || req.headers["authorization"];
  return authHeader === `Bearer ${env.cronSecret}` || process.env.NODE_ENV === "development";
};

router.use((req, res, next) => {
  if (req.path === "/cron/run") {
    if (isCronAuthorized(req)) {
      return next();
    }
    return res.status(401).json({ error: "Unauthorized cron execution." });
  }
  authenticate(req as AuthRequest, res as Response, next);
});

// GET /campaigns - list all campaigns
router.get("/", authorize("outreach:read"), async (req: AuthRequest, res: Response) => {
  const campaigns = await Campaign.findAll({
    include: [{ model: CampaignTemplate, as: "template", attributes: ["name"] }],
    order: [["createdAt", "DESC"]],
  });
  res.json(campaigns);
});

// POST /campaigns - create campaign
router.post("/", authorize("outreach:write"), async (req: AuthRequest, res: Response) => {
  try {
    const campaign = await Campaign.create({
      ...req.body,
      createdById: req.user!.userId,
    });
    res.status(201).json(campaign);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
});

// GET /campaigns/templates - list templates
router.get("/templates", authorize("outreach:read"), async (req: AuthRequest, res: Response) => {
  const templates = await CampaignTemplate.findAll({
    order: [["name", "ASC"]],
  });
  res.json(templates);
});

// POST /campaigns/templates - create template
router.post("/templates", authorize("outreach:write"), async (req: AuthRequest, res: Response) => {
  try {
    const template = await CampaignTemplate.create({
      ...req.body,
      createdById: req.user!.userId,
    });
    res.status(201).json(template);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
});

// POST /campaigns/:id/enroll - enroll leads
router.post("/:id/enroll", authorize("outreach:write"), async (req: AuthRequest, res: Response) => {
  const { leadIds } = req.body;
  if (!Array.isArray(leadIds)) {
    res.status(400).json({ message: "leadIds must be an array" });
    return;
  }

  const campaign = await Campaign.findByPk(req.params.id);
  if (!campaign) {
    res.status(404).json({ message: "Campaign not found" });
    return;
  }

  await Lead.update(
    { campaignId: campaign.id, status: "Enrolled" },
    { where: { id: { [Op.in]: leadIds } } }
  );

  const newTotal = await Lead.count({ where: { campaignId: campaign.id } });
  await campaign.update({ leadsTotal: newTotal });

  res.json({ message: `${leadIds.length} leads enrolled` });
});

// CRON ENGINE: GET /campaigns/cron/run
router.get("/cron/run", async (req, res) => {
  const logs: string[] = [];
  try {
    const activeCampaigns = await Campaign.findAll({
      where: {
        stage: "Active",
        startDate: { [Op.lte]: new Date() },
      },
      include: [{ model: CampaignTemplate, as: "template" }],
    });

    logs.push(`Found ${activeCampaigns.length} active campaigns ready to process.`);

    for (const campaign of activeCampaigns) {
      logs.push(`\n--- Processing Campaign: ${campaign.name} ---`);

      // PHASE A: AI Draft Generation
      const enrolledLeads = await Lead.findAll({
        where: {
          campaignId: campaign.id,
          status: "Enrolled",
          aiDraft: { [Op.or]: [null, ""] } as any,
        },
        limit: 10,
      });

      for (const lead of enrolledLeads) {
        try {
          const draft = await generateAIEmailDraft(lead, (campaign as any).template);
          await lead.update({
            aiDraft: draft.body,
            status: "Interested",
          });

          await CampaignActivity.create({
            leadId: lead.id,
            campaignId: campaign.id,
            type: "DraftGenerated",
            content: "AI personalized outreach draft generated automatically.",
            generatedContent: draft.body,
          });
          logs.push(`   [AI Draft] Generated for ${lead.email}`);
        } catch (aiError: any) {
          logs.push(`   [AI Draft Error] Failed for ${lead.email}: ${aiError.message}`);
        }
      }

      // PHASE B: Email Dispatch
      const startOfDay = new Date();
      startOfDay.setHours(0, 0, 0, 0);

      const sentTodayCount = await CampaignActivity.count({
        where: {
          campaignId: campaign.id,
          type: "OutreachSent",
          timestamp: { [Op.gte]: startOfDay },
        },
      });

      const remainingDailyQuota = Math.max(0, campaign.dailyLimit - sentTodayCount);
      logs.push(`Daily Limit Check: ${sentTodayCount} sent today. Remaining: ${remainingDailyQuota}.`);

      if (remainingDailyQuota > 0) {
        const leadsReadyToSend = await Lead.findAll({
          where: {
            campaignId: campaign.id,
            status: "Interested",
            aiDraft: { [Op.ne]: null } as any,
          },
          limit: Math.min(20, remainingDailyQuota),
        });

        // Use the campaign creator's email or a default
        const creator = await User.findByPk(campaign.createdById);
        const fromEmail = creator?.companyEmail || "admin@rhinontech.in";

        for (const lead of leadsReadyToSend) {
          try {
            const subject = `Optimizing ${lead.company}'s potential`;
            await sendEmail({
              to: lead.email,
              from: fromEmail,
              subject,
              html: lead.aiDraft,
              text: lead.aiDraft,
            });

            // Archive to InboxEmail so it shows in "Sent" folder
            await InboxEmail.create({
              threadKey: `outreach-${campaign.id}-${lead.id}`,
              folder: "sent",
              fromName: creator?.fullName || "Rhinon Tech",
              fromEmail,
              toEmails: [lead.email],
              subject,
              body: lead.aiDraft,
              snippet: lead.aiDraft.slice(0, 160),
              ownerEmail: fromEmail,
              isRead: true,
              sentAt: new Date(),
            });

            await lead.update({ status: "Emailed" });
            await campaign.increment("leadsProcessed");

            await CampaignActivity.create({
              leadId: lead.id,
              campaignId: campaign.id,
              type: "OutreachSent",
              content: `Automated campaign outreach email delivered.`,
            });

            logs.push(`   [Email Sent] Delivered to ${lead.email}`);
          } catch (sendError: any) {
            logs.push(`   [Email Error] Failed to send to ${lead.email}: ${sendError.message}`);
          }
        }
      }

      // PHASE C: Auto-Completion Check
      const pendingLeads = await Lead.count({
        where: {
          campaignId: campaign.id,
          status: { [Op.in]: ["New", "Enrolled", "Enriched", "Interested"] },
        },
      });

      if (pendingLeads === 0 && campaign.leadsTotal > 0) {
        await campaign.update({ stage: "Completed" });
        logs.push(`Campaign finished! Marked as Completed.`);
      }
    }

    res.json({ success: true, logs });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// GET /campaigns/:id - get single campaign
router.get("/:id", authorize("outreach:read"), async (req: AuthRequest, res: Response) => {
  const campaign = await Campaign.findByPk(req.params.id, {
    include: [{ model: CampaignTemplate, as: "template" }],
  });
  if (!campaign) {
    res.status(404).json({ message: "Campaign not found" });
    return;
  }
  res.json(campaign);
});

// PUT /campaigns/:id - update campaign
router.put("/:id", authorize("outreach:write"), async (req: AuthRequest, res: Response) => {
  try {
    const campaign = await Campaign.findByPk(req.params.id);
    if (!campaign) {
      res.status(404).json({ message: "Campaign not found" });
      return;
    }
    await campaign.update(req.body);
    res.json(campaign);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
});

// GET /campaigns/templates/:id - get single template
router.get("/templates/:id", authorize("outreach:read"), async (req: AuthRequest, res: Response) => {
  const template = await CampaignTemplate.findByPk(req.params.id);
  if (!template) {
    res.status(404).json({ message: "Template not found" });
    return;
  }
  res.json(template);
});

// PUT /campaigns/templates/:id - update template
router.put("/templates/:id", authorize("outreach:write"), async (req: AuthRequest, res: Response) => {
  try {
    const template = await CampaignTemplate.findByPk(req.params.id);
    if (!template) {
      res.status(404).json({ message: "Template not found" });
      return;
    }
    await template.update(req.body);
    res.json(template);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE /campaigns/templates/:id - delete template
router.delete("/templates/:id", authorize("outreach:write"), async (req: AuthRequest, res: Response) => {
  try {
    const template = await CampaignTemplate.findByPk(req.params.id);
    if (!template) {
      res.status(404).json({ message: "Template not found" });
      return;
    }
    await template.destroy();
    res.json({ message: "Template deleted" });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
