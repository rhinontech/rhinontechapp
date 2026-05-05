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

router.post("/", authorize("employees:write"), async (req: AuthRequest, res: Response) => {
  const { fullName, personalEmail, roleId, department, joiningDate, password } = req.body;

  if (!fullName || !personalEmail || !roleId || !department || !joiningDate || !password) {
    res.status(400).json({ message: "All fields are required" });
    return;
  }

  const firstName = fullName.split(" ")[0].toLowerCase();
  const companyEmail = `${firstName}@rhinontech.in`;

  const passwordHash = await bcrypt.hash(password, 10);

  const employee = await User.create({
    fullName,
    personalEmail,
    companyEmail,
    passwordHash,
    roleId,
    department,
    joiningDate: new Date(joiningDate),
    status: "active",
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
  const { fullName, roleId, department, status } = req.body;
  await employee.update({ fullName, roleId, department, status });
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
