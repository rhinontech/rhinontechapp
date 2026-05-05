import { Model, Optional } from "sequelize";
export type PayslipStatus = "draft" | "paid";
interface PayslipAttributes {
    id: string;
    payrollId: string;
    userId: string;
    basicSalary: number;
    hra: number;
    ta: number;
    medicalAllowance: number;
    otherAllowances: number;
    grossPay: number;
    pfEmployee: number;
    pfEmployer: number;
    tds: number;
    professionalTax: number;
    otherDeductions: number;
    totalDeductions: number;
    netPay: number;
    paymentDate?: Date;
    status: PayslipStatus;
    createdAt?: Date;
    updatedAt?: Date;
}
interface PayslipCreationAttributes extends Optional<PayslipAttributes, "id" | "hra" | "ta" | "medicalAllowance" | "otherAllowances" | "pfEmployer" | "tds" | "professionalTax" | "otherDeductions" | "status"> {
}
export declare class Payslip extends Model<PayslipAttributes, PayslipCreationAttributes> implements PayslipAttributes {
    id: string;
    payrollId: string;
    userId: string;
    basicSalary: number;
    hra: number;
    ta: number;
    medicalAllowance: number;
    otherAllowances: number;
    grossPay: number;
    pfEmployee: number;
    pfEmployer: number;
    tds: number;
    professionalTax: number;
    otherDeductions: number;
    totalDeductions: number;
    netPay: number;
    paymentDate?: Date;
    status: PayslipStatus;
    createdAt: Date;
    updatedAt: Date;
}
export {};
//# sourceMappingURL=Payslip.d.ts.map