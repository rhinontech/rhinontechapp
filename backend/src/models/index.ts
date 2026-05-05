import { Role } from "./Role";
import { Permission } from "./Permission";
import { User } from "./User";
import { InboxConversation } from "./InboxConversation";
import { InboxMessage } from "./InboxMessage";
import { InboxEmail } from "./InboxEmail";
import { Payroll } from "./Payroll";
import { Payslip } from "./Payslip";
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

// Associations
Role.belongsToMany(Permission, { through: RolePermission, foreignKey: "roleId" });
Permission.belongsToMany(Role, { through: RolePermission, foreignKey: "permissionId" });
User.belongsTo(Role, { foreignKey: "roleId", as: "role" });
Role.hasMany(User, { foreignKey: "roleId" });
InboxConversation.belongsTo(User, { foreignKey: "assignedToUserId", as: "assignee" });
User.hasMany(InboxConversation, { foreignKey: "assignedToUserId", as: "assignedConversations" });
InboxConversation.hasMany(InboxMessage, { foreignKey: "conversationId", as: "messages", onDelete: "CASCADE" });
InboxMessage.belongsTo(InboxConversation, { foreignKey: "conversationId", as: "conversation" });

// Payroll associations
Payroll.hasMany(Payslip, { foreignKey: "payrollId", as: "payslips", onDelete: "CASCADE" });
Payslip.belongsTo(Payroll, { foreignKey: "payrollId", as: "payroll" });
Payslip.belongsTo(User, { foreignKey: "userId", as: "employee" });
User.hasMany(Payslip, { foreignKey: "userId", as: "payslips" });
Payroll.belongsTo(User, { foreignKey: "processedById", as: "processedBy" });

export { Role, Permission, RolePermission, User, InboxConversation, InboxMessage, InboxEmail, Payroll, Payslip };

export async function syncDatabase(force = false) {
  await sequelize.sync({ force, alter: !force });
}
