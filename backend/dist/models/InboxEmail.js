"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InboxEmail = void 0;
const sequelize_1 = require("sequelize");
const database_1 = require("../config/database");
class InboxEmail extends sequelize_1.Model {
}
exports.InboxEmail = InboxEmail;
InboxEmail.init({
    id: {
        type: sequelize_1.DataTypes.UUID,
        defaultValue: sequelize_1.DataTypes.UUIDV4,
        primaryKey: true,
    },
    threadKey: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    folder: {
        type: sequelize_1.DataTypes.ENUM("inbox", "sent", "drafts", "archive", "trash"),
        allowNull: false,
        defaultValue: "inbox",
    },
    fromName: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    fromEmail: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    toEmails: {
        type: sequelize_1.DataTypes.ARRAY(sequelize_1.DataTypes.STRING),
        allowNull: false,
        defaultValue: [],
    },
    ccEmails: {
        type: sequelize_1.DataTypes.ARRAY(sequelize_1.DataTypes.STRING),
        allowNull: false,
        defaultValue: [],
    },
    subject: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    body: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: false,
    },
    snippet: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: false,
    },
    isRead: {
        type: sequelize_1.DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
    },
    isStarred: {
        type: sequelize_1.DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
    },
    hasAttachment: {
        type: sequelize_1.DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
    },
    sentAt: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: false,
    },
}, {
    sequelize: database_1.sequelize,
    tableName: "inbox_emails",
    timestamps: true,
});
//# sourceMappingURL=InboxEmail.js.map