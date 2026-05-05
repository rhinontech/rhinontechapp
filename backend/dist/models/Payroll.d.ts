import { Model, Optional } from "sequelize";
export type PayrollStatus = "draft" | "processed" | "paid";
interface PayrollAttributes {
    id: string;
    month: number;
    year: number;
    status: PayrollStatus;
    totalGross: number;
    totalNet: number;
    processedById?: string;
    processedAt?: Date;
    createdAt?: Date;
    updatedAt?: Date;
}
interface PayrollCreationAttributes extends Optional<PayrollAttributes, "id" | "totalGross" | "totalNet" | "status"> {
}
export declare class Payroll extends Model<PayrollAttributes, PayrollCreationAttributes> implements PayrollAttributes {
    id: string;
    month: number;
    year: number;
    status: PayrollStatus;
    totalGross: number;
    totalNet: number;
    processedById?: string;
    processedAt?: Date;
    createdAt: Date;
    updatedAt: Date;
}
export {};
//# sourceMappingURL=Payroll.d.ts.map