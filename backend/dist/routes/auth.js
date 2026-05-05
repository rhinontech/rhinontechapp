"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const models_1 = require("../models");
const env_1 = require("../config/env");
const authenticate_1 = require("../middleware/authenticate");
const router = (0, express_1.Router)();
router.post("/login", async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        res.status(400).json({ message: "Email and password are required" });
        return;
    }
    const user = await models_1.User.findOne({
        where: { companyEmail: email, status: "active" },
        include: [{ model: models_1.Role, as: "role", include: [{ model: models_1.Permission }] }],
    });
    if (!user) {
        res.status(401).json({ message: "Invalid email or password" });
        return;
    }
    const valid = await bcryptjs_1.default.compare(password, user.passwordHash);
    if (!valid) {
        res.status(401).json({ message: "Invalid email or password" });
        return;
    }
    const role = user.role;
    const permissions = (role.Permissions || []).map((p) => `${p.resource}:${p.action}`);
    const token = jsonwebtoken_1.default.sign({
        userId: user.id,
        roleSlug: role.slug,
        permissions,
        fullName: user.fullName,
        companyEmail: user.companyEmail,
    }, env_1.env.jwtSecret, { expiresIn: env_1.env.jwtExpiresIn });
    res.json({ token, roleSlug: role.slug, permissions, fullName: user.fullName });
});
router.post("/logout", (_req, res) => {
    res.json({ message: "Logged out" });
});
router.get("/me", authenticate_1.authenticate, (req, res) => {
    res.json(req.user);
});
exports.default = router;
//# sourceMappingURL=auth.js.map