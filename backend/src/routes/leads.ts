import { Router, Response } from "express";
import { Lead, Campaign, CampaignActivity } from "../models";
import { authenticate, authorize, AuthRequest } from "../middleware/authenticate";
import { enrichLeadWithAI } from "../services/gemini";
import { Op } from "sequelize";

const router = Router();

router.use(authenticate);

// GET /leads - list all leads
router.get("/", authorize("outreach:read"), async (req: AuthRequest, res: Response) => {
  const { status, campaignId, search } = req.query;
  const where: any = {};

  if (status) where.status = status;
  if (campaignId) where.campaignId = campaignId;
  if (search) {
    where[Op.or] = [
      { name: { [Op.iLike]: `%${search}%` } },
      { company: { [Op.iLike]: `%${search}%` } },
      { email: { [Op.iLike]: `%${search}%` } },
    ];
  }

  const leads = await Lead.findAll({
    where,
    include: [{ model: Campaign, as: "campaign", attributes: ["name"] }],
    order: [["addedAt", "DESC"]],
  });

  res.json(leads);
});

// POST /leads - create lead manually
router.post("/", authorize("outreach:write"), async (req: AuthRequest, res: Response) => {
  try {
    const lead = await Lead.create(req.body);
    res.status(201).json(lead);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
});

// GET /leads/:id - get single lead
router.get("/:id", authorize("outreach:read"), async (req: AuthRequest, res: Response) => {
  const lead = await Lead.findByPk(req.params.id, {
    include: [
      { model: Campaign, as: "campaign" },
      { model: CampaignActivity, as: "activities", order: [["timestamp", "DESC"]] }
    ],
  });

  if (!lead) {
    res.status(404).json({ message: "Lead not found" });
    return;
  }

  res.json(lead);
});

// PUT /leads/:id - update lead
router.put("/:id", authorize("outreach:write"), async (req: AuthRequest, res: Response) => {
  const lead = await Lead.findByPk(req.params.id);
  if (!lead) {
    res.status(404).json({ message: "Lead not found" });
    return;
  }

  await lead.update(req.body);
  res.json(lead);
});

// DELETE /leads/:id - delete lead
router.delete("/:id", authorize("outreach:write"), async (req: AuthRequest, res: Response) => {
  const lead = await Lead.findByPk(req.params.id);
  if (!lead) {
    res.status(404).json({ message: "Lead not found" });
    return;
  }

  await lead.destroy();
  res.json({ message: "Lead deleted" });
});

// POST /leads/:id/enrich - trigger AI enrichment
router.post("/:id/enrich", authorize("outreach:write"), async (req: AuthRequest, res: Response) => {
  const lead = await Lead.findByPk(req.params.id);
  if (!lead) {
    res.status(404).json({ message: "Lead not found" });
    return;
  }

  try {
    const enrichment = await enrichLeadWithAI(lead.name, lead.company);
    
    // Log Activity
    await CampaignActivity.create({
      leadId: lead.id,
      campaignId: lead.campaignId,
      type: "Enrichment",
      content: enrichment.potentialPainPoint || "Lead enriched with AI intel",
      generatedContent: JSON.stringify(enrichment),
    });

    // Update lead status if it was New
    if (lead.status === "New") {
      await lead.update({ status: "Enriched" });
    }

    res.json(enrichment);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
