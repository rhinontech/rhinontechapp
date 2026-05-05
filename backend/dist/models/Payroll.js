"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Payroll = void 0;
const sequelize_1 = require("sequelize");
const database_1 = require("../config/database");
class Payroll extends sequelize_1.Model {
}
exports.Payroll = Payroll;
Payroll.init({
    id: { type: sequelize_1.DataTypes.UUID, defaultValue: sequelize_1.DataTypes.UUIDV4, primaryKey: true },
    month: { type: sequelize_1.DataTypes.INTEGER, allowNull: false },
    year: { type: sequelize_1.DataTypes.INTEGER, allowNull: false },
    status: { type: sequelize_1.DataTypes.ENUM("draft", "processed", "paid"), defaultValue: "draft" },
    totalGross: { type: sequelize_1.DataTypes.DECIMAL(12, 2), defaultValue: 0 },
    totalNet: { type: sequelize_1.DataTypes.DECIMAL(12, 2), defaultValue: 0 },
    processedById: { type: sequelize_1.DataTypes.UUID, allowNull: true },
    processedAt: { type: sequelize_1.DataTypes.DATE, allowNull: true },
}, { sequelize: database_1.sequelize, tableName: "payrolls", timestamps: true });
//# sourceMappingURL=Payroll.js.map