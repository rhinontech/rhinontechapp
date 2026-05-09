import { Role } from "./Role";
import { Permission } from "./Permission";
import { User } from "./User";
import { InboxConversation } from "./InboxConversation";
import { InboxMessage } from "./InboxMessage";
import { InboxEmail } from "./InboxEmail";
import { Payroll } from "./Payroll";
import { Payslip } from "./Payslip";
import { Task } from "./Task";
import { Attendance } from "./Attendance";
import { Project } from "./Project";
import { ClientRequest } from "./ClientRequest";
import { Lead } from "./Lead";
import { CampaignTemplate } from "./CampaignTemplate";
import { Campaign } from "./Campaign";
import { CampaignActivity } from "./CampaignActivity";
import { DataTypes } from "sequelize";
import { sequelize } from "../config/database";

// RolePermission join table
const RolePermission = sequelize.define(
  "RolePermission",
  {
    roleId: { type: DataTypes.UUID, allowNull: false },
    permissionId: { type: DataTypes.UUID, allowNull: false },
  },
  { tableName: "role_permissions", timestamps: false }
);

// Role <-> Permission
Role.belongsToMany(Permission, { through: RolePermission, foreignKey: "roleId" });
Permission.belongsToMany(Role, { through: RolePermission, foreignKey: "permissionId" });

// User <-> Role
User.belongsTo(Role, { foreignKey: "roleId", as: "role" });
Role.hasMany(User, { foreignKey: "roleId" });

// Inbox
InboxConversation.belongsTo(User, { foreignKey: "assignedToUserId", as: "assignee" });
User.hasMany(InboxConversation, { foreignKey: "assignedToUserId", as: "assignedConversations" });
InboxConversation.hasMany(InboxMessage, { foreignKey: "conversationId", as: "messages", onDelete: "CASCADE" });
InboxMessage.belongsTo(InboxConversation, { foreignKey: "conversationId", as: "conversation" });

// Payroll
Payroll.hasMany(Payslip, { foreignKey: "payrollId", as: "payslips", onDelete: "CASCADE" });
Payslip.belongsTo(Payroll, { foreignKey: "payrollId", as: "payroll" });
Payslip.belongsTo(User, { foreignKey: "userId", as: "employee" });
User.hasMany(Payslip, { foreignKey: "userId", as: "payslips" });
Payroll.belongsTo(User, { foreignKey: "processedById", as: "processedBy" });

// Tasks — two separate associations to User
Task.belongsTo(User, { foreignKey: "assigneeId", as: "assignee" });
Task.belongsTo(User, { foreignKey: "createdById", as: "creator" });
User.hasMany(Task, { foreignKey: "assigneeId", as: "assignedTasks" });
User.hasMany(Task, { foreignKey: "createdById", as: "createdTasks" });

// Work projects and client requests
Project.belongsTo(User, { foreignKey: "createdById", as: "creator" });
User.hasMany(Project, { foreignKey: "createdById", as: "createdProjects" });
Task.belongsTo(Project, { foreignKey: "projectId", as: "project" });
Project.hasMany(Task, { foreignKey: "projectId", as: "tasks" });
ClientRequest.belongsTo(Project, { foreignKey: "projectId", as: "project" });
Project.hasMany(ClientRequest, { foreignKey: "projectId", as: "clientRequests" });
ClientRequest.belongsTo(User, { foreignKey: "createdById", as: "creator" });
User.hasMany(ClientRequest, { foreignKey: "createdById", as: "createdClientRequests" });

// Attendance
Attendance.belongsTo(User, { foreignKey: "userId", as: "user" });
User.hasMany(Attendance, { foreignKey: "userId", as: "attendance" });

// Outreach Associations
Campaign.belongsTo(CampaignTemplate, { foreignKey: "templateId", as: "template" });
CampaignTemplate.hasMany(Campaign, { foreignKey: "templateId", as: "campaigns" });

Campaign.belongsTo(User, { foreignKey: "createdById", as: "creator" });
User.hasMany(Campaign, { foreignKey: "createdById", as: "createdCampaigns" });

CampaignTemplate.belongsTo(User, { foreignKey: "createdById", as: "creator" });
User.hasMany(CampaignTemplate, { foreignKey: "createdById", as: "createdTemplates" });

Lead.belongsTo(Campaign, { foreignKey: "campaignId", as: "campaign" });
Campaign.hasMany(Lead, { foreignKey: "campaignId", as: "leads" });

CampaignActivity.belongsTo(Lead, { foreignKey: "leadId", as: "lead" });
Lead.hasMany(CampaignActivity, { foreignKey: "leadId", as: "activities" });

CampaignActivity.belongsTo(Campaign, { foreignKey: "campaignId", as: "campaign" });
Campaign.hasMany(CampaignActivity, { foreignKey: "campaignId", as: "activities" });

export {
  Role, Permission, RolePermission,
  User,
  InboxConversation, InboxMessage, InboxEmail,
  Payroll, Payslip,
  Task,
  Attendance,
  Project,
  ClientRequest,
  Lead,
  CampaignTemplate,
  Campaign,
  CampaignActivity,
};

export async function syncDatabase(force = false) {
  await sequelize.sync({ force, alter: !force });
}
