import { Router, Response } from "express";
import bcrypt from "bcryptjs";
import { User, Role } from "../models";
import { authenticate, authorize, AuthRequest } from "../middleware/authenticate";

const router = Router();

router.use(authenticate);

router.get("/", authorize("employees:read"), async (_req: AuthRequest, res: Response) => {
  const employees = await User.findAll({
    include: [{ model: Role, as: "role" }],
    attributes: { exclude: ["passwordHash"] },
  });
  res.json(employees);
});

router.get("/:id", authorize("employees:read"), async (req: AuthRequest, res: Response) => {
  const employee = await User.findByPk(req.params.id, {
    include: [{ model: Role, as: "role" }],
    attributes: { exclude: ["passwordHash"] },
  });
  if (!employee) {
    res.status(404).json({ message: "Employee not found" });
    return;
  }
  res.json(employee);
});

const employeeEditableFields = [
  "fullName",
  "personalEmail",
  "roleId",
  "department",
  "status",
  "dateOfBirth",
  "pan",
  "employmentType",
  "compensationType",
  "workSchedule",
  "remotePosition",
  "workLocation",
  "paymentFrequency",
  "legalName",
  "roleTitle",
  "annualCompensation",
  "annualVariablePay",
  "pastPayrollFinancialYear",
  "pastTaxableSalary",
  "pastTdsDeducted",
  "bankAccountNumber",
  "bankIfscCode",
  "bankBeneficiaryName",
  "pfUanNumber",
  "esicIpNumber",
  "labourWelfareFundEnabled",
  "npsEnabled",
  "professionalTaxEnabled",
  "basicSalary",
  "hra",
  "ta",
  "medicalAllowance",
  "otherAllowances",
] as const;

function employeePayload(body: Record<string, any>) {
  const payload: Record<string, any> = {};
  for (const field of employeeEditableFields) {
    if (body[field] !== undefined) payload[field] = body[field];
  }
  if (body.joiningDate) payload.joiningDate = new Date(body.joiningDate);
  if (body.dateOfBirth) payload.dateOfBirth = new Date(body.dateOfBirth);
  return payload;
}

router.post("/", authorize("employees:write"), async (req: AuthRequest, res: Response) => {
  const { fullName, personalEmail, roleId, department, joiningDate, password } = req.body;

  if (!fullName || !personalEmail || !roleId || !department || !joiningDate || !password) {
    res.status(400).json({ message: "All fields are required" });
    return;
  }

  // Enforce one superadmin
  const role = await Role.findByPk(roleId);
  if (role?.slug === "superadmin") {
    const existing = await User.findOne({ include: [{ model: Role, as: "role", where: { slug: "superadmin" } }] });
    if (existing) {
      res.status(400).json({ message: "A Super Admin already exists. Only one superadmin is allowed." });
      return;
    }
  }

  const firstName = fullName.split(" ")[0].toLowerCase();
  const companyEmail = `${firstName}@rhinontech.in`;

  const passwordHash = await bcrypt.hash(password, 10);

  const employee = await User.create({
    fullName,
    personalEmail,
    roleId,
    department,
    joiningDate: new Date(joiningDate),
    companyEmail,
    passwordHash,
    status: req.body.status ?? "active",
    ...employeePayload(req.body),
  });

  res.status(201).json({
    ...employee.toJSON(),
    passwordHash: undefined,
  });
});

router.put("/:id", authorize("employees:write"), async (req: AuthRequest, res: Response) => {
  const employee = await User.findByPk(req.params.id);
  if (!employee) {
    res.status(404).json({ message: "Employee not found" });
    return;
  }
  // Enforce one superadmin — if changing someone else's role TO superadmin, block it
  if (req.body.roleId) {
    const role = await Role.findByPk(req.body.roleId);
    if (role?.slug === "superadmin" && employee.roleId !== req.body.roleId) {
      const existing = await User.findOne({ include: [{ model: Role, as: "role", where: { slug: "superadmin" } }] });
      if (existing && existing.id !== employee.id) {
        res.status(400).json({ message: "A Super Admin already exists. Only one superadmin is allowed." });
        return;
      }
    }
  }
  await employee.update(employeePayload(req.body));
  res.json({ ...employee.toJSON(), passwordHash: undefined });
});

// Offboard — mark inactive
router.post("/:id/offboard", authorize("employees:write"), async (req: AuthRequest, res: Response) => {
  const employee = await User.findByPk(req.params.id);
  if (!employee) {
    res.status(404).json({ message: "Employee not found" });
    return;
  }
  await employee.update({ status: "inactive" });
  res.json({ message: "Employee offboarded", id: employee.id });
});

export default router;
