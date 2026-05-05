"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InboxConversation = void 0;
const sequelize_1 = require("sequelize");
const database_1 = require("../config/database");
class InboxConversation extends sequelize_1.Model {
}
exports.InboxConversation = InboxConversation;
InboxConversation.init({
    id: {
        type: sequelize_1.DataTypes.UUID,
        defaultValue: sequelize_1.DataTypes.UUIDV4,
        primaryKey: true,
    },
    subject: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    status: {
        type: sequelize_1.DataTypes.ENUM("open", "in_progress", "resolved", "closed"),
        allowNull: false,
        defaultValue: "open",
    },
    priority: {
        type: sequelize_1.DataTypes.ENUM("low", "normal", "high", "urgent"),
        allowNull: false,
        defaultValue: "normal",
    },
    source: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    customerName: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    customerEmail: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    customerCompany: {
        type: sequelize_1.DataTypes.STRING,
    },
    customerLocation: {
        type: sequelize_1.DataTypes.STRING,
    },
    language: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        defaultValue: "English",
    },
    brand: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        defaultValue: "Rhinon",
    },
    externalId: {
        type: sequelize_1.DataTypes.STRING,
    },
    workspacePhoneNumber: {
        type: sequelize_1.DataTypes.STRING,
    },
    copilotUsed: {
        type: sequelize_1.DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
    },
    assignedToUserId: {
        type: sequelize_1.DataTypes.UUID,
    },
    teamInbox: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        defaultValue: "Support",
    },
    topics: {
        type: sequelize_1.DataTypes.ARRAY(sequelize_1.DataTypes.STRING),
        allowNull: false,
        defaultValue: [],
    },
    tags: {
        type: sequelize_1.DataTypes.ARRAY(sequelize_1.DataTypes.STRING),
        allowNull: false,
        defaultValue: [],
    },
    lastMessagePreview: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: false,
    },
    lastMessageAt: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: false,
    },
}, {
    sequelize: database_1.sequelize,
    tableName: "inbox_conversations",
    timestamps: true,
});
//# sourceMappingURL=InboxConversation.js.map