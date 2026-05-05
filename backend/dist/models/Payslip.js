"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Payslip = void 0;
const sequelize_1 = require("sequelize");
const database_1 = require("../config/database");
class Payslip extends sequelize_1.Model {
}
exports.Payslip = Payslip;
Payslip.init({
    id: { type: sequelize_1.DataTypes.UUID, defaultValue: sequelize_1.DataTypes.UUIDV4, primaryKey: true },
    payrollId: { type: sequelize_1.DataTypes.UUID, allowNull: false },
    userId: { type: sequelize_1.DataTypes.UUID, allowNull: false },
    basicSalary: { type: sequelize_1.DataTypes.DECIMAL(12, 2), allowNull: false },
    hra: { type: sequelize_1.DataTypes.DECIMAL(12, 2), defaultValue: 0 },
    ta: { type: sequelize_1.DataTypes.DECIMAL(12, 2), defaultValue: 0 },
    medicalAllowance: { type: sequelize_1.DataTypes.DECIMAL(12, 2), defaultValue: 0 },
    otherAllowances: { type: sequelize_1.DataTypes.DECIMAL(12, 2), defaultValue: 0 },
    grossPay: { type: sequelize_1.DataTypes.DECIMAL(12, 2), allowNull: false },
    pfEmployee: { type: sequelize_1.DataTypes.DECIMAL(12, 2), allowNull: false },
    pfEmployer: { type: sequelize_1.DataTypes.DECIMAL(12, 2), defaultValue: 0 },
    tds: { type: sequelize_1.DataTypes.DECIMAL(12, 2), defaultValue: 0 },
    professionalTax: { type: sequelize_1.DataTypes.DECIMAL(12, 2), defaultValue: 0 },
    otherDeductions: { type: sequelize_1.DataTypes.DECIMAL(12, 2), defaultValue: 0 },
    totalDeductions: { type: sequelize_1.DataTypes.DECIMAL(12, 2), allowNull: false },
    netPay: { type: sequelize_1.DataTypes.DECIMAL(12, 2), allowNull: false },
    paymentDate: { type: sequelize_1.DataTypes.DATEONLY, allowNull: true },
    status: { type: sequelize_1.DataTypes.ENUM("draft", "paid"), defaultValue: "draft" },
}, { sequelize: database_1.sequelize, tableName: "payslips", timestamps: true });
//# sourceMappingURL=Payslip.js.map