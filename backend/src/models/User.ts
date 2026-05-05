import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../config/database";

export type UserStatus = "active" | "inactive";

interface UserAttributes {
  id: string;
  fullName: string;
  personalEmail: string;
  companyEmail: string;
  passwordHash: string;
  roleId: string;
  department: string;
  status: UserStatus;
  joiningDate: Date;
  // HR / employment info
  pan?: string;
  employmentType?: string;
  compensationType?: string;
  workSchedule?: string;
  remotePosition?: boolean;
  workLocation?: string;
  paymentFrequency?: string;
  // Salary structure (monthly amounts, set by admin — used to auto-generate payslips)
  basicSalary?: number;
  hra?: number;
  ta?: number;
  medicalAllowance?: number;
  otherAllowances?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

interface UserCreationAttributes
  extends Optional<
    UserAttributes,
    | "id"
    | "companyEmail"
    | "status"
    | "pan"
    | "employmentType"
    | "compensationType"
    | "workSchedule"
    | "remotePosition"
    | "workLocation"
    | "paymentFrequency"
    | "basicSalary"
    | "hra"
    | "ta"
    | "medicalAllowance"
    | "otherAllowances"
  > {}

export class User
  extends Model<UserAttributes, UserCreationAttributes>
  implements UserAttributes
{
  declare id: string;
  declare fullName: string;
  declare personalEmail: string;
  declare companyEmail: string;
  declare passwordHash: string;
  declare roleId: string;
  declare department: string;
  declare status: UserStatus;
  declare joiningDate: Date;
  declare pan: string;
  declare employmentType: string;
  declare compensationType: string;
  declare workSchedule: string;
  declare remotePosition: boolean;
  declare workLocation: string;
  declare paymentFrequency: string;
  declare basicSalary: number;
  declare hra: number;
  declare ta: number;
  declare medicalAllowance: number;
  declare otherAllowances: number;
  declare createdAt: Date;
  declare updatedAt: Date;
}

User.init(
  {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    fullName: { type: DataTypes.STRING, allowNull: false },
    personalEmail: { type: DataTypes.STRING, allowNull: false, unique: true },
    companyEmail: { type: DataTypes.STRING, unique: true },
    passwordHash: { type: DataTypes.STRING, allowNull: false },
    roleId: { type: DataTypes.UUID, allowNull: false },
    department: { type: DataTypes.STRING, allowNull: false },
    status: { type: DataTypes.ENUM("active", "inactive"), defaultValue: "active" },
    joiningDate: { type: DataTypes.DATEONLY, allowNull: false },
    pan: { type: DataTypes.STRING(10), allowNull: true },
    employmentType: { type: DataTypes.STRING, allowNull: true, defaultValue: "Full-Time" },
    compensationType: { type: DataTypes.STRING, allowNull: true, defaultValue: "Salaried" },
    workSchedule: { type: DataTypes.STRING, allowNull: true, defaultValue: "Standard (Mon–Fri)" },
    remotePosition: { type: DataTypes.BOOLEAN, allowNull: true, defaultValue: false },
    workLocation: { type: DataTypes.STRING, allowNull: true },
    paymentFrequency: { type: DataTypes.STRING, allowNull: true, defaultValue: "Monthly" },
    basicSalary: { type: DataTypes.DECIMAL(12, 2), allowNull: true },
    hra: { type: DataTypes.DECIMAL(12, 2), allowNull: true, defaultValue: 0 },
    ta: { type: DataTypes.DECIMAL(12, 2), allowNull: true, defaultValue: 0 },
    medicalAllowance: { type: DataTypes.DECIMAL(12, 2), allowNull: true, defaultValue: 0 },
    otherAllowances: { type: DataTypes.DECIMAL(12, 2), allowNull: true, defaultValue: 0 },
  },
  { sequelize, tableName: "users", timestamps: true }
);
