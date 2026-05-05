"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Payslip = exports.Payroll = exports.InboxEmail = exports.InboxMessage = exports.InboxConversation = exports.User = exports.RolePermission = exports.Permission = exports.Role = void 0;
exports.syncDatabase = syncDatabase;
const Role_1 = require("./Role");
Object.defineProperty(exports, "Role", { enumerable: true, get: function () { return Role_1.Role; } });
const Permission_1 = require("./Permission");
Object.defineProperty(exports, "Permission", { enumerable: true, get: function () { return Permission_1.Permission; } });
const User_1 = require("./User");
Object.defineProperty(exports, "User", { enumerable: true, get: function () { return User_1.User; } });
const InboxConversation_1 = require("./InboxConversation");
Object.defineProperty(exports, "InboxConversation", { enumerable: true, get: function () { return InboxConversation_1.InboxConversation; } });
const InboxMessage_1 = require("./InboxMessage");
Object.defineProperty(exports, "InboxMessage", { enumerable: true, get: function () { return InboxMessage_1.InboxMessage; } });
const InboxEmail_1 = require("./InboxEmail");
Object.defineProperty(exports, "InboxEmail", { enumerable: true, get: function () { return InboxEmail_1.InboxEmail; } });
const Payroll_1 = require("./Payroll");
Object.defineProperty(exports, "Payroll", { enumerable: true, get: function () { return Payroll_1.Payroll; } });
const Payslip_1 = require("./Payslip");
Object.defineProperty(exports, "Payslip", { enumerable: true, get: function () { return Payslip_1.Payslip; } });
const sequelize_1 = require("sequelize");
const database_1 = require("../config/database");
// RolePermission join table
const RolePermission = database_1.sequelize.define("RolePermission", {
    roleId: { type: sequelize_1.DataTypes.UUID, allowNull: false },
    permissionId: { type: sequelize_1.DataTypes.UUID, allowNull: false },
}, { tableName: "role_permissions", timestamps: false });
exports.RolePermission = RolePermission;
// Associations
Role_1.Role.belongsToMany(Permission_1.Permission, { through: RolePermission, foreignKey: "roleId" });
Permission_1.Permission.belongsToMany(Role_1.Role, { through: RolePermission, foreignKey: "permissionId" });
User_1.User.belongsTo(Role_1.Role, { foreignKey: "roleId", as: "role" });
Role_1.Role.hasMany(User_1.User, { foreignKey: "roleId" });
InboxConversation_1.InboxConversation.belongsTo(User_1.User, { foreignKey: "assignedToUserId", as: "assignee" });
User_1.User.hasMany(InboxConversation_1.InboxConversation, { foreignKey: "assignedToUserId", as: "assignedConversations" });
InboxConversation_1.InboxConversation.hasMany(InboxMessage_1.InboxMessage, { foreignKey: "conversationId", as: "messages", onDelete: "CASCADE" });
InboxMessage_1.InboxMessage.belongsTo(InboxConversation_1.InboxConversation, { foreignKey: "conversationId", as: "conversation" });
// Payroll associations
Payroll_1.Payroll.hasMany(Payslip_1.Payslip, { foreignKey: "payrollId", as: "payslips", onDelete: "CASCADE" });
Payslip_1.Payslip.belongsTo(Payroll_1.Payroll, { foreignKey: "payrollId", as: "payroll" });
Payslip_1.Payslip.belongsTo(User_1.User, { foreignKey: "userId", as: "employee" });
User_1.User.hasMany(Payslip_1.Payslip, { foreignKey: "userId", as: "payslips" });
Payroll_1.Payroll.belongsTo(User_1.User, { foreignKey: "processedById", as: "processedBy" });
async function syncDatabase(force = false) {
    await database_1.sequelize.sync({ force, alter: !force });
}
//# sourceMappingURL=index.js.map