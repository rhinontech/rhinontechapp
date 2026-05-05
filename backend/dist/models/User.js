"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const sequelize_1 = require("sequelize");
const database_1 = require("../config/database");
class User extends sequelize_1.Model {
}
exports.User = User;
User.init({
    id: { type: sequelize_1.DataTypes.UUID, defaultValue: sequelize_1.DataTypes.UUIDV4, primaryKey: true },
    fullName: { type: sequelize_1.DataTypes.STRING, allowNull: false },
    personalEmail: { type: sequelize_1.DataTypes.STRING, allowNull: false, unique: true },
    companyEmail: { type: sequelize_1.DataTypes.STRING, unique: true },
    passwordHash: { type: sequelize_1.DataTypes.STRING, allowNull: false },
    roleId: { type: sequelize_1.DataTypes.UUID, allowNull: false },
    department: { type: sequelize_1.DataTypes.STRING, allowNull: false },
    status: { type: sequelize_1.DataTypes.ENUM("active", "inactive"), defaultValue: "active" },
    joiningDate: { type: sequelize_1.DataTypes.DATEONLY, allowNull: false },
    pan: { type: sequelize_1.DataTypes.STRING(10), allowNull: true },
    employmentType: { type: sequelize_1.DataTypes.STRING, allowNull: true, defaultValue: "Full-Time" },
    compensationType: { type: sequelize_1.DataTypes.STRING, allowNull: true, defaultValue: "Salaried" },
    workSchedule: { type: sequelize_1.DataTypes.STRING, allowNull: true, defaultValue: "Standard (Mon–Fri)" },
    remotePosition: { type: sequelize_1.DataTypes.BOOLEAN, allowNull: true, defaultValue: false },
    workLocation: { type: sequelize_1.DataTypes.STRING, allowNull: true },
    paymentFrequency: { type: sequelize_1.DataTypes.STRING, allowNull: true, defaultValue: "Monthly" },
    basicSalary: { type: sequelize_1.DataTypes.DECIMAL(12, 2), allowNull: true },
    hra: { type: sequelize_1.DataTypes.DECIMAL(12, 2), allowNull: true, defaultValue: 0 },
    ta: { type: sequelize_1.DataTypes.DECIMAL(12, 2), allowNull: true, defaultValue: 0 },
    medicalAllowance: { type: sequelize_1.DataTypes.DECIMAL(12, 2), allowNull: true, defaultValue: 0 },
    otherAllowances: { type: sequelize_1.DataTypes.DECIMAL(12, 2), allowNull: true, defaultValue: 0 },
}, { sequelize: database_1.sequelize, tableName: "users", timestamps: true });
//# sourceMappingURL=User.js.map