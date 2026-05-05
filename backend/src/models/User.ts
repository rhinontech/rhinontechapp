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
  // Extended payroll / HR fields
  pan?: string;
  employmentType?: string;
  compensationType?: string;
  workSchedule?: string;
  remotePosition?: boolean;
  workLocation?: string;
  annualCompensation?: number;
  paymentFrequency?: string;
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
    | "annualCompensation"
    | "paymentFrequency"
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
  declare annualCompensation: number;
  declare paymentFrequency: string;
  declare createdAt: Date;
  declare updatedAt: Date;
}

User.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    fullName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    personalEmail: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    companyEmail: {
      type: DataTypes.STRING,
      unique: true,
    },
    passwordHash: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    roleId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    department: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM("active", "inactive"),
      defaultValue: "active",
    },
    joiningDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    pan: {
      type: DataTypes.STRING(10),
      allowNull: true,
    },
    employmentType: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: "Full-Time",
    },
    compensationType: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: "Salaried",
    },
    workSchedule: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: "Standard (Mon–Fri)",
    },
    remotePosition: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false,
    },
    workLocation: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    annualCompensation: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: true,
    },
    paymentFrequency: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: "Monthly",
    },
  },
  {
    sequelize,
    tableName: "users",
    timestamps: true,
  }
);
