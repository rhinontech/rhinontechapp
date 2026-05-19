import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../config/database";

export type CampaignStage = "Draft" | "Active" | "Paused" | "Completed";

interface CampaignAttributes {
  id: string;
  name: string;
  templateId?: string | null;
  stage: CampaignStage;
  dailyLimit: number;
  startDate: Date;
  runTime: string;
  scheduleDays: string[];
  leadsTotal: number;
  leadsProcessed: number;
  objective?: string;
  notes?: string;
  createdById: string;
  createdAt?: Date;
  updatedAt?: Date;
}

interface CampaignCreationAttributes extends Optional<CampaignAttributes, "id" | "templateId" | "stage" | "dailyLimit" | "startDate" | "runTime" | "scheduleDays" | "leadsTotal" | "leadsProcessed" | "objective" | "notes"> {}

export class Campaign extends Model<CampaignAttributes, CampaignCreationAttributes> implements CampaignAttributes {
  declare id: string;
  declare name: string;
  declare templateId: string | null;
  declare stage: CampaignStage;
  declare dailyLimit: number;
  declare startDate: Date;
  declare runTime: string;
  declare scheduleDays: string[];
  declare leadsTotal: number;
  declare leadsProcessed: number;
  declare objective: string;
  declare notes: string;
  declare createdById: string;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

Campaign.init(
  {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    name: { type: DataTypes.STRING, allowNull: false },
    templateId: { type: DataTypes.UUID, allowNull: true },
    stage: {
      type: DataTypes.ENUM("Draft", "Active", "Paused", "Completed"),
      defaultValue: "Draft",
      allowNull: false,
    },
    dailyLimit: { type: DataTypes.INTEGER, defaultValue: 50, allowNull: false },
    startDate: { type: DataTypes.DATE, defaultValue: DataTypes.NOW, allowNull: false },
    runTime: { type: DataTypes.STRING(5), defaultValue: "09:00", allowNull: false },
    scheduleDays: { type: DataTypes.ARRAY(DataTypes.STRING), defaultValue: ["Mon", "Tue", "Wed", "Thu", "Fri"], allowNull: false },
    leadsTotal: { type: DataTypes.INTEGER, defaultValue: 0, allowNull: false },
    leadsProcessed: { type: DataTypes.INTEGER, defaultValue: 0, allowNull: false },
    objective: { type: DataTypes.TEXT, allowNull: true },
    notes: { type: DataTypes.TEXT, allowNull: true },
    createdById: { type: DataTypes.UUID, allowNull: false },
  },
  { sequelize, tableName: "campaigns", timestamps: true }
);
