import { Router, Response } from "express";
import { Payroll, Payslip, User, Role } from "../models";
import { authenticate, authorize, AuthRequest } from "../middleware/authenticate";

const router = Router();
router.use(authenticate);

// ── Admin: list all payroll runs ─────────────────────────────────────────────
router.get("/", authorize("payroll:read"), async (_req: AuthRequest, res: Response) => {
  const runs = await Payroll.findAll({
    order: [["year", "DESC"], ["month", "DESC"]],
    include: [{ model: User, as: "processedBy", attributes: ["fullName"] }],
  });
  res.json(runs);
});

// ── Admin: create a payroll run ───────────────────────────────────────────────
router.post("/", authorize("payroll:write"), async (req: AuthRequest, res: Response) => {
  const { month, year } = req.body;
  if (!month || !year) { res.status(400).json({ message: "month and year required" }); return; }

  const exists = await Payroll.findOne({ where: { month, year } });
  if (exists) { res.status(409).json({ message: "Payroll for this period already exists" }); return; }

  const payroll = await Payroll.create({ month, year });
  res.status(201).json(payroll);
});

// ── Admin: get payroll with all payslips ─────────────────────────────────────
router.get("/:id", authorize("payroll:read"), async (req: AuthRequest, res: Response) => {
  const payroll = await Payroll.findByPk(req.params.id, {
    include: [{
      model: Payslip, as: "payslips",
      include: [{ model: User, as: "employee", attributes: ["id", "fullName", "companyEmail", "department"] }],
    }],
  });
  if (!payroll) { res.status(404).json({ message: "Payroll not found" }); return; }
  res.json(payroll);
});

// ── Admin: add / update a payslip within a payroll run ───────────────────────
router.post("/:id/payslips", authorize("payroll:write"), async (req: AuthRequest, res: Response) => {
  const payroll = await Payroll.findByPk(req.params.id);
  if (!payroll) { res.status(404).json({ message: "Payroll not found" }); return; }
  if (payroll.status === "paid") { res.status(400).json({ message: "Cannot edit a paid payroll" }); return; }

  const {
    userId, basicSalary,
    hra = 0, ta = 0, medicalAllowance = 0, otherAllowances = 0,
    tds = 0, professionalTax = 0, otherDeductions = 0,
  } = req.body;

  const pfEmployee = Math.round(basicSalary * 0.12 * 100) / 100;
  const pfEmployer = Math.round(basicSalary * 0.12 * 100) / 100;
  const grossPay = basicSalary + hra + ta + medicalAllowance + otherAllowances;
  const totalDeductions = pfEmployee + tds + professionalTax + otherDeductions;
  const netPay = grossPay - totalDeductions;

  const [payslip] = await Payslip.findOrCreate({
    where: { payrollId: payroll.id, userId },
    defaults: { payrollId: payroll.id, userId, basicSalary, hra, ta, medicalAllowance, otherAllowances, grossPay, pfEmployee, pfEmployer, tds, professionalTax, otherDeductions, totalDeductions, netPay },
  });

  // recalculate totals
  const allSlips = await Payslip.findAll({ where: { payrollId: payroll.id } });
  const totalGross = allSlips.reduce((s, p) => s + Number(p.grossPay), 0);
  const totalNet = allSlips.reduce((s, p) => s + Number(p.netPay), 0);
  await payroll.update({ totalGross, totalNet });

  res.status(201).json(payslip);
});

// ── Admin: mark payroll as paid ───────────────────────────────────────────────
router.post("/:id/pay", authorize("payroll:write"), async (req: AuthRequest, res: Response) => {
  const payroll = await Payroll.findByPk(req.params.id);
  if (!payroll) { res.status(404).json({ message: "Payroll not found" }); return; }

  const paymentDate = new Date();
  await Payslip.update(
    { status: "paid", paymentDate },
    { where: { payrollId: payroll.id } }
  );
  await payroll.update({ status: "paid", processedById: req.user!.userId, processedAt: paymentDate });
  res.json({ message: "Payroll marked as paid" });
});

// ── Employee: my payslips ─────────────────────────────────────────────────────
router.get("/me/payslips", authorize("payslips:read"), async (req: AuthRequest, res: Response) => {
  const payslips = await Payslip.findAll({
    where: { userId: req.user!.userId },
    include: [{ model: Payroll, as: "payroll", attributes: ["month", "year", "status"] }],
    order: [[{ model: Payroll, as: "payroll" }, "year", "DESC"], [{ model: Payroll, as: "payroll" }, "month", "DESC"]],
  });
  res.json(payslips);
});

// ── Employee: single payslip ──────────────────────────────────────────────────
router.get("/me/payslips/:id", authorize("payslips:read"), async (req: AuthRequest, res: Response) => {
  const payslip = await Payslip.findOne({
    where: { id: req.params.id, userId: req.user!.userId },
    include: [
      { model: Payroll, as: "payroll", attributes: ["month", "year", "status"] },
      { model: User, as: "employee", attributes: ["fullName", "companyEmail", "department", "joiningDate"], include: [{ model: Role, as: "role", attributes: ["name"] }] },
    ],
  });
  if (!payslip) { res.status(404).json({ message: "Payslip not found" }); return; }
  res.json(payslip);
});

export default router;
