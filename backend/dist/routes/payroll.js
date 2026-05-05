"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const models_1 = require("../models");
const authenticate_1 = require("../middleware/authenticate");
const router = (0, express_1.Router)();
router.use(authenticate_1.authenticate);
// ═══════════════════════════════════════════════════════════════════════════════
// EMPLOYEE routes  (require payslips:read)
// ═══════════════════════════════════════════════════════════════════════════════
// My payslips
router.get("/me/payslips", (0, authenticate_1.authorize)("payslips:read"), async (req, res) => {
    const payslips = await models_1.Payslip.findAll({
        where: { userId: req.user.userId },
        include: [{ model: models_1.Payroll, as: "payroll", attributes: ["month", "year", "status"] }],
        order: [
            [{ model: models_1.Payroll, as: "payroll" }, "year", "DESC"],
            [{ model: models_1.Payroll, as: "payroll" }, "month", "DESC"],
        ],
    });
    res.json(payslips);
});
// Single payslip
router.get("/me/payslips/:id", (0, authenticate_1.authorize)("payslips:read"), async (req, res) => {
    const payslip = await models_1.Payslip.findOne({
        where: { id: req.params.id, userId: req.user.userId },
        include: [
            { model: models_1.Payroll, as: "payroll", attributes: ["month", "year", "status"] },
            {
                model: models_1.User,
                as: "employee",
                attributes: ["fullName", "companyEmail", "department", "joiningDate"],
                include: [{ model: models_1.Role, as: "role", attributes: ["name"] }],
            },
        ],
    });
    if (!payslip) {
        res.status(404).json({ message: "Payslip not found" });
        return;
    }
    res.json(payslip);
});
// ═══════════════════════════════════════════════════════════════════════════════
// ADMIN routes  (require payroll:write)
// ═══════════════════════════════════════════════════════════════════════════════
// List all employees with their salary structure
router.get("/admin/employees", (0, authenticate_1.authorize)("payroll:write"), async (_req, res) => {
    const employees = await models_1.User.findAll({
        where: { status: "active" },
        attributes: [
            "id", "fullName", "companyEmail", "department", "joiningDate",
            "employmentType", "workLocation",
            "basicSalary", "hra", "ta", "medicalAllowance", "otherAllowances",
        ],
        include: [{ model: models_1.Role, as: "role", attributes: ["name", "slug"] }],
        order: [["fullName", "ASC"]],
    });
    res.json(employees);
});
// Get single employee's full profile + salary (for admin edit)
router.get("/admin/employees/:userId", (0, authenticate_1.authorize)("payroll:write"), async (req, res) => {
    const user = await models_1.User.findByPk(req.params.userId, {
        attributes: { exclude: ["passwordHash"] },
        include: [{ model: models_1.Role, as: "role", attributes: ["name", "slug"] }],
    });
    if (!user) {
        res.status(404).json({ message: "Employee not found" });
        return;
    }
    res.json(user);
});
// Set / update an employee's salary structure
router.put("/admin/employees/:userId/salary", (0, authenticate_1.authorize)("payroll:write"), async (req, res) => {
    const { basicSalary, hra = 0, ta = 0, medicalAllowance = 0, otherAllowances = 0 } = req.body;
    if (!basicSalary || basicSalary <= 0) {
        res.status(400).json({ message: "basicSalary is required and must be > 0" });
        return;
    }
    const user = await models_1.User.findByPk(req.params.userId);
    if (!user) {
        res.status(404).json({ message: "Employee not found" });
        return;
    }
    await user.update({ basicSalary, hra, ta, medicalAllowance, otherAllowances });
    res.json({ message: "Salary updated", basicSalary, hra, ta, medicalAllowance, otherAllowances });
});
// Update employee HR details (employment type, PAN, etc.)
router.put("/admin/employees/:userId/details", (0, authenticate_1.authorize)("payroll:write"), async (req, res) => {
    const allowed = ["pan", "employmentType", "compensationType", "workSchedule", "remotePosition", "workLocation", "paymentFrequency", "department"];
    const update = {};
    for (const key of allowed) {
        if (req.body[key] !== undefined)
            update[key] = req.body[key];
    }
    const user = await models_1.User.findByPk(req.params.userId);
    if (!user) {
        res.status(404).json({ message: "Employee not found" });
        return;
    }
    await user.update(update);
    res.json({ message: "Details updated" });
});
// List all payroll runs
router.get("/admin/runs", (0, authenticate_1.authorize)("payroll:write"), async (_req, res) => {
    const runs = await models_1.Payroll.findAll({
        order: [["year", "DESC"], ["month", "DESC"]],
        include: [{ model: models_1.User, as: "processedBy", attributes: ["fullName"] }],
    });
    res.json(runs);
});
// List all payslips for admins, optionally filtered by payroll run
router.get("/admin/payslips", (0, authenticate_1.authorize)("payroll:write"), async (req, res) => {
    const where = typeof req.query.run === "string" ? { payrollId: req.query.run } : {};
    const payslips = await models_1.Payslip.findAll({
        where,
        include: [
            { model: models_1.Payroll, as: "payroll", attributes: ["id", "month", "year", "status"] },
            { model: models_1.User, as: "employee", attributes: ["id", "fullName", "companyEmail", "department"] },
        ],
        order: [
            [{ model: models_1.Payroll, as: "payroll" }, "year", "DESC"],
            [{ model: models_1.Payroll, as: "payroll" }, "month", "DESC"],
            [{ model: models_1.User, as: "employee" }, "fullName", "ASC"],
        ],
    });
    res.json(payslips);
});
// Get any payslip for admins
router.get("/admin/payslips/:id", (0, authenticate_1.authorize)("payroll:write"), async (req, res) => {
    const payslip = await models_1.Payslip.findByPk(req.params.id, {
        include: [
            { model: models_1.Payroll, as: "payroll", attributes: ["month", "year", "status"] },
            {
                model: models_1.User,
                as: "employee",
                attributes: ["fullName", "companyEmail", "department", "joiningDate"],
                include: [{ model: models_1.Role, as: "role", attributes: ["name"] }],
            },
        ],
    });
    if (!payslip) {
        res.status(404).json({ message: "Payslip not found" });
        return;
    }
    res.json(payslip);
});
// Get a single payroll run with all payslips
router.get("/admin/runs/:id", (0, authenticate_1.authorize)("payroll:write"), async (req, res) => {
    const payroll = await models_1.Payroll.findByPk(req.params.id, {
        include: [{
                model: models_1.Payslip,
                as: "payslips",
                include: [{ model: models_1.User, as: "employee", attributes: ["id", "fullName", "companyEmail", "department"] }],
            }],
    });
    if (!payroll) {
        res.status(404).json({ message: "Payroll not found" });
        return;
    }
    res.json(payroll);
});
// Auto-run payroll for a month — generates payslips for all active employees with salary set
router.post("/admin/run", (0, authenticate_1.authorize)("payroll:write"), async (req, res) => {
    const { month, year } = req.body;
    if (!month || !year) {
        res.status(400).json({ message: "month and year are required" });
        return;
    }
    const exists = await models_1.Payroll.findOne({ where: { month, year } });
    if (exists) {
        res.status(409).json({ message: `Payroll for this period already exists (status: ${exists.status})` });
        return;
    }
    // Fetch all active employees who have a salary configured
    const employees = await models_1.User.findAll({
        where: { status: "active" },
        attributes: ["id", "basicSalary", "hra", "ta", "medicalAllowance", "otherAllowances"],
    });
    const eligible = employees.filter((e) => e.basicSalary && Number(e.basicSalary) > 0);
    if (eligible.length === 0) {
        res.status(400).json({ message: "No active employees have a salary structure configured." });
        return;
    }
    const payroll = await models_1.Payroll.create({ month, year, processedById: req.user.userId });
    let totalGross = 0;
    let totalNet = 0;
    for (const emp of eligible) {
        const basicSalary = Number(emp.basicSalary);
        const hra = Number(emp.hra ?? 0);
        const ta = Number(emp.ta ?? 0);
        const medicalAllowance = Number(emp.medicalAllowance ?? 0);
        const otherAllowances = Number(emp.otherAllowances ?? 0);
        const grossPay = basicSalary + hra + ta + medicalAllowance + otherAllowances;
        const pfEmployee = Math.round(basicSalary * 0.12 * 100) / 100;
        const pfEmployer = pfEmployee;
        const professionalTax = 200; // ₹200/month standard
        const tds = 0; // simplified; can be calculated from annual income
        const otherDeductions = 0;
        const totalDeductions = pfEmployee + professionalTax + tds + otherDeductions;
        const netPay = grossPay - totalDeductions;
        await models_1.Payslip.create({
            payrollId: payroll.id,
            userId: emp.id,
            basicSalary,
            hra,
            ta,
            medicalAllowance,
            otherAllowances,
            grossPay,
            pfEmployee,
            pfEmployer,
            tds,
            professionalTax,
            otherDeductions,
            totalDeductions,
            netPay,
            status: "draft",
        });
        totalGross += grossPay;
        totalNet += netPay;
    }
    await payroll.update({ totalGross, totalNet });
    res.status(201).json({
        message: `Payroll run complete. ${eligible.length} payslips generated.`,
        payroll: { id: payroll.id, month, year, status: payroll.status, totalGross, totalNet, count: eligible.length },
    });
});
// Mark payroll run as paid (all payslips → paid)
router.post("/admin/runs/:id/pay", (0, authenticate_1.authorize)("payroll:write"), async (req, res) => {
    const payroll = await models_1.Payroll.findByPk(req.params.id);
    if (!payroll) {
        res.status(404).json({ message: "Payroll not found" });
        return;
    }
    if (payroll.status === "paid") {
        res.status(400).json({ message: "Already paid" });
        return;
    }
    const paymentDate = new Date();
    await models_1.Payslip.update({ status: "paid", paymentDate }, { where: { payrollId: payroll.id } });
    await payroll.update({ status: "paid", processedById: req.user.userId, processedAt: paymentDate });
    res.json({ message: "Payroll marked as paid" });
});
exports.default = router;
//# sourceMappingURL=payroll.js.map