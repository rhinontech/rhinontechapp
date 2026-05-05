import { Model, Optional } from "sequelize";
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
interface UserCreationAttributes extends Optional<UserAttributes, "id" | "companyEmail" | "status"> {
}
export declare class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
    id: string;
    fullName: string;
    personalEmail: string;
    companyEmail: string;
    passwordHash: string;
    roleId: string;
    department: string;
    status: UserStatus;
    joiningDate: Date;
    createdAt: Date;
    updatedAt: Date;
}
export {};
//# sourceMappingURL=User.d.ts.map