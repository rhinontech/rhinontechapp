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
  createdAt?: Date;
  updatedAt?: Date;
}

interface UserCreationAttributes
  extends Optional<UserAttributes, "id" | "companyEmail" | "status"> {}

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
  },
  {
    sequelize,
    tableName: "users",
    timestamps: true,
  }
);
