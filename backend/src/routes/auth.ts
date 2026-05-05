import { Router, Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User, Role, Permission } from "../models";
import { env } from "../config/env";
import { authenticate, AuthRequest } from "../middleware/authenticate";

const router = Router();

router.post("/login", async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({ message: "Email and password are required" });
    return;
  }

  const user = await User.findOne({
    where: { companyEmail: email, status: "active" },
    include: [{ model: Role, as: "role", include: [{ model: Permission }] }],
  });

  if (!user) {
    res.status(401).json({ message: "Invalid email or password" });
    return;
  }

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) {
    res.status(401).json({ message: "Invalid email or password" });
    return;
  }

  const role = (user as any).role as Role & { Permissions: Permission[] };
  const permissions = (role.Permissions || []).map(
    (p: any) => `${p.resource}:${p.action}`
  );

  const token = jwt.sign(
    {
      userId: user.id,
      roleSlug: role.slug,
      permissions,
      fullName: user.fullName,
      companyEmail: user.companyEmail,
    },
    env.jwtSecret,
    { expiresIn: env.jwtExpiresIn as jwt.SignOptions["expiresIn"] }
  );

  res.json({ token, roleSlug: role.slug, permissions, fullName: user.fullName });
});

router.post("/logout", (_req: Request, res: Response) => {
  res.json({ message: "Logged out" });
});

router.get("/me", authenticate, (req: AuthRequest, res: Response) => {
  res.json(req.user);
});

export default router;
