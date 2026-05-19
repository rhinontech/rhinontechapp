import { Router, Response } from "express";
import { Campaign, CampaignTemplate, Lead, CampaignActivity, User, InboxEmail } from "../models";
import { authenticate, authorize, AuthRequest } from "../middleware/authenticate";
import { env } from "../config/env";
import { generateAIEmailDraft, generateTemplateWithAI } from "../services/gemini";
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
    if (isCronAuthorized(req)) return next();
    // Also allow JWT-authenticated users to trigger manually
    return authenticate(req as AuthRequest, res as Response, next);
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

// POST /campaigns/generate - generate AI email draft for a lead
router.post("/generate", authorize("outreach:write"), async (req: AuthRequest, res: Response) => {
  const { leadId, templateId } = req.body;
  if (!leadId) {
    res.status(400).json({ message: "leadId is required" });
    return;
  }

  try {
    const lead = await Lead.findByPk(leadId);
    if (!lead) {
      res.status(404).json({ message: "Lead not found" });
      return;
    }

    let template = null;
    if (templateId) {
      template = await CampaignTemplate.findByPk(templateId);
    }

    const senderName = req.user!.fullName || "Rhinon Team";
    const draft = await generateAIEmailDraft(lead, template, "", senderName);
    res.json({ subject: draft.subject, body: draft.body });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
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

function fillPlaceholders(text: string, lead: any, senderName: string): string {
  return text
    .replace(/\{\{lead\.name\}\}/g, lead.name)
    .replace(/\{\{lead\.company\}\}/g, lead.company)
    .replace(/\{\{lead\.title\}\}/g, lead.title || "colleague")
    .replace(/\{\{sender\.name\}\}/g, senderName)
    .replace(/\[Your Name\]/gi, senderName)
    .replace(/\[your name\]/gi, senderName)
    .replace(/\[Sender Name\]/gi, senderName)
    .replace(/\[AI to fill[^\]]*\]/gi, "");
}

function toEmailHtml(plainText: string): string {
  const escaped = plainText
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
  const paragraphs = escaped
    .split(/\n\n+/)
    .map(p => `<p style="margin:0 0 16px 0;line-height:1.6">${p.replace(/\n/g, "<br>")}</p>`)
    .join("");
  return `<!DOCTYPE html>
<html><head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;background:#f4f4f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f5;padding:40px 0">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.06)">
        <tr><td style="background:#0f0f0f;padding:24px 32px">
          <span style="color:#ffffff;font-size:18px;font-weight:700;letter-spacing:-0.3px">Rhinon Tech</span>
        </td></tr>
        <tr><td style="padding:32px;color:#1a1a1a;font-size:15px">
          ${paragraphs}
        </td></tr>
        <tr><td style="padding:16px 32px 32px;border-top:1px solid #f0f0f0">
          <p style="margin:0;font-size:12px;color:#9ca3af">You received this email because you were identified as a potential match for our services. To unsubscribe, reply with "Unsubscribe".</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body></html>`;
}

// CRON ENGINE: GET /campaigns/cron/run
router.get("/cron/run", async (req, res) => {
  const logs: string[] = [];
  try {
    const activeCampaigns = await Campaign.findAll({
      where: { stage: "Active" },
      include: [{ model: CampaignTemplate, as: "template" }],
    });

    const allCampaigns = await Campaign.findAll({ attributes: ["id", "name", "stage"] });
    logs.push(`Total campaigns in DB: ${allCampaigns.length} — ${allCampaigns.map(c => `${c.name}(${c.stage})`).join(", ")}`);
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

      const campaignCreator = await User.findByPk(campaign.createdById);
      const senderName = campaignCreator?.fullName || "Rhinon Team";

      for (const lead of enrolledLeads) {
        try {
          let draftBody: string;
          let draftSubject: string;
          let usedAI = false;

          try {
            const aiDraft = await generateAIEmailDraft(lead, (campaign as any).template, "", senderName);
            draftBody = fillPlaceholders(aiDraft.body, lead, senderName);
            draftSubject = fillPlaceholders(aiDraft.subject, lead, senderName);
            usedAI = true;
          } catch (aiError: any) {
            logs.push(`   [AI Draft Skipped] Rate limit or error for ${lead.email} — using template fallback.`);
            const tmpl = (campaign as any).template;
            const rawBody = tmpl?.body || "Hi {{lead.name}},\n\nWe'd love to connect.\n\nBest,\n{{sender.name}}";
            draftBody = fillPlaceholders(rawBody, lead, senderName);
            draftSubject = fillPlaceholders(tmpl?.subject || `Optimizing ${lead.company}'s potential`, lead, senderName);
          }

          await lead.update({ aiDraft: draftBody, status: "Interested" });
          await CampaignActivity.create({
            leadId: lead.id,
            campaignId: campaign.id,
            type: "DraftGenerated",
            content: usedAI ? "AI personalized outreach draft generated." : "Template-based draft prepared (AI fallback).",
            generatedContent: draftBody,
          });
          logs.push(`   [Draft Ready] ${usedAI ? "AI" : "Template"} draft for ${lead.email}`);
        } catch (err: any) {
          logs.push(`   [Draft Error] Failed for ${lead.email}: ${err.message}`);
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

        // Always send from the configured SMTP account — Gmail rejects mismatched senders
        const creator = await User.findByPk(campaign.createdById);
        const fromEmail = process.env.GMAIL_USER || process.env.SMTP_FROM_EMAIL || "admin@rhinontech.in";

        for (const lead of leadsReadyToSend) {
          try {
            const tmpl = (campaign as any).template;
            const subject = tmpl?.subject
              ? tmpl.subject.replace(/\{\{lead\.name\}\}/g, lead.name).replace(/\{\{lead\.company\}\}/g, lead.company)
              : `Optimizing ${lead.company}'s potential`;
            const htmlBody = toEmailHtml(lead.aiDraft);
            await sendEmail({
              to: lead.email,
              from: fromEmail,
              subject,
              html: htmlBody,
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
            if (campaign.leadsProcessed < campaign.leadsTotal) {
              await campaign.increment("leadsProcessed");
            }

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

// DELETE /campaigns/:id - delete campaign and unenroll its leads
router.delete("/:id", authorize("outreach:write"), async (req: AuthRequest, res: Response) => {
  try {
    const campaign = await Campaign.findByPk(req.params.id);
    if (!campaign) {
      res.status(404).json({ message: "Campaign not found" });
      return;
    }
    // Unenroll leads before deleting
    await Lead.update({ campaignId: null, status: "New" }, { where: { campaignId: campaign.id } });
    await campaign.destroy();
    res.json({ message: "Campaign deleted" });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

// POST /campaigns/templates/generate - AI-generate a template from a prompt
router.post("/templates/generate", authorize("outreach:write"), async (req: AuthRequest, res: Response) => {
  const { prompt } = req.body;
  if (!prompt || !prompt.trim()) {
    res.status(400).json({ message: "prompt is required" });
    return;
  }
  try {
    const result = await generateTemplateWithAI(prompt.trim());
    if (result.error) {
      res.status(500).json({ message: result.error });
      return;
    }
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
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
