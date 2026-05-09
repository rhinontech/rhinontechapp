import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../config/database";

export type LeadStatus = "New" | "Enriched" | "Enrolled" | "Emailed" | "Replied" | "Bounced" | "Unsubscribed" | "Interested";

interface LeadAttributes {
  id: string;
  name: string;
  company: string;
  title?: string;
  email: string;
  linkedinUrl?: string;
  status: LeadStatus;
  campaignId?: string | null;
  aiDraft?: string;
  source: string;
  notes?: string;
  addedAt: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

interface LeadCreationAttributes extends Optional<LeadAttributes, "id" | "title" | "linkedinUrl" | "campaignId" | "aiDraft" | "source" | "notes" | "addedAt"> {}

export class Lead extends Model<LeadAttributes, LeadCreationAttributes> implements LeadAttributes {
  declare id: string;
  declare name: string;
  declare company: string;
  declare title: string;
  declare email: string;
  declare linkedinUrl: string;
  declare status: LeadStatus;
  declare campaignId: string | null;
  declare aiDraft: string;
  declare source: string;
  declare notes: string;
  declare addedAt: Date;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

Lead.init(
  {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    name: { type: DataTypes.STRING, allowNull: false },
    company: { type: DataTypes.STRING, allowNull: false },
    title: { type: DataTypes.STRING, allowNull: true },
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    linkedinUrl: { type: DataTypes.STRING, allowNull: true },
    status: {
      type: DataTypes.ENUM("New", "Enriched", "Enrolled", "Emailed", "Replied", "Bounced", "Unsubscribed", "Interested"),
      defaultValue: "New",
      allowNull: false,
    },
    campaignId: { type: DataTypes.UUID, allowNull: true },
    aiDraft: { type: DataTypes.TEXT, allowNull: true },
    source: { type: DataTypes.STRING, defaultValue: "Manual", allowNull: false },
    notes: { type: DataTypes.TEXT, allowNull: true },
    addedAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW, allowNull: false },
  },
  { sequelize, tableName: "leads", timestamps: true }
);
