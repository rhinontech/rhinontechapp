import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../config/database";

interface CampaignTemplateAttributes {
  id: string;
  name: string;
  subject?: string;
  body: string;
  aiInstructions?: string;
  createdById: string;
  createdAt?: Date;
  updatedAt?: Date;
}

interface CampaignTemplateCreationAttributes extends Optional<CampaignTemplateAttributes, "id" | "subject" | "aiInstructions"> {}

export class CampaignTemplate extends Model<CampaignTemplateAttributes, CampaignTemplateCreationAttributes> implements CampaignTemplateAttributes {
  declare id: string;
  declare name: string;
  declare subject: string;
  declare body: string;
  declare aiInstructions: string;
  declare createdById: string;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

CampaignTemplate.init(
  {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    name: { type: DataTypes.STRING, allowNull: false },
    subject: { type: DataTypes.STRING, allowNull: true },
    body: { type: DataTypes.TEXT, allowNull: false },
    aiInstructions: { type: DataTypes.TEXT, allowNull: true },
    createdById: { type: DataTypes.UUID, allowNull: false },
  },
  { sequelize, tableName: "campaign_templates", timestamps: true }
);
