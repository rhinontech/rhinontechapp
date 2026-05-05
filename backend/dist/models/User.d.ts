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
    pan?: string;
    employmentType?: string;
    compensationType?: string;
    workSchedule?: string;
    remotePosition?: boolean;
    workLocation?: string;
    paymentFrequency?: string;
    basicSalary?: number;
    hra?: number;
    ta?: number;
    medicalAllowance?: number;
    otherAllowances?: number;
    createdAt?: Date;
    updatedAt?: Date;
}
interface UserCreationAttributes extends Optional<UserAttributes, "id" | "companyEmail" | "status" | "pan" | "employmentType" | "compensationType" | "workSchedule" | "remotePosition" | "workLocation" | "paymentFrequency" | "basicSalary" | "hra" | "ta" | "medicalAllowance" | "otherAllowances"> {
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
    pan: string;
    employmentType: string;
    compensationType: string;
    workSchedule: string;
    remotePosition: boolean;
    workLocation: string;
    paymentFrequency: string;
    basicSalary: number;
    hra: number;
    ta: number;
    medicalAllowance: number;
    otherAllowances: number;
    createdAt: Date;
    updatedAt: Date;
}
export {};
//# sourceMappingURL=User.d.ts.map