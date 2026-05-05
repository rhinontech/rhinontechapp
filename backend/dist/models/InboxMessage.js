"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InboxMessage = void 0;
const sequelize_1 = require("sequelize");
const database_1 = require("../config/database");
class InboxMessage extends sequelize_1.Model {
}
exports.InboxMessage = InboxMessage;
InboxMessage.init({
    id: {
        type: sequelize_1.DataTypes.UUID,
        defaultValue: sequelize_1.DataTypes.UUIDV4,
        primaryKey: true,
    },
    conversationId: {
        type: sequelize_1.DataTypes.UUID,
        allowNull: false,
    },
    senderType: {
        type: sequelize_1.DataTypes.ENUM("customer", "agent", "system"),
        allowNull: false,
    },
    senderName: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    body: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: false,
    },
}, {
    sequelize: database_1.sequelize,
    tableName: "inbox_messages",
    timestamps: true,
});
//# sourceMappingURL=InboxMessage.js.map