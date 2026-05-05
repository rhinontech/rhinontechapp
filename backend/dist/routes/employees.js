"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const models_1 = require("../models");
const authenticate_1 = require("../middleware/authenticate");
const router = (0, express_1.Router)();
router.use(authenticate_1.authenticate);
router.get("/", (0, authenticate_1.authorize)("employees:read"), async (_req, res) => {
    const employees = await models_1.User.findAll({
        include: [{ model: models_1.Role, as: "role" }],
        attributes: { exclude: ["passwordHash"] },
    });
    res.json(employees);
});
router.get("/:id", (0, authenticate_1.authorize)("employees:read"), async (req, res) => {
    const employee = await models_1.User.findByPk(req.params.id, {
        include: [{ model: models_1.Role, as: "role" }],
        attributes: { exclude: ["passwordHash"] },
    });
    if (!employee) {
        res.status(404).json({ message: "Employee not found" });
        return;
    }
    res.json(employee);
});
router.post("/", (0, authenticate_1.authorize)("employees:write"), async (req, res) => {
    const { fullName, personalEmail, roleId, department, joiningDate, password } = req.body;
    if (!fullName || !personalEmail || !roleId || !department || !joiningDate || !password) {
        res.status(400).json({ message: "All fields are required" });
        return;
    }
    const firstName = fullName.split(" ")[0].toLowerCase();
    const companyEmail = `${firstName}@rhinontech.in`;
    const passwordHash = await bcryptjs_1.default.hash(password, 10);
    const employee = await models_1.User.create({
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
router.put("/:id", (0, authenticate_1.authorize)("employees:write"), async (req, res) => {
    const employee = await models_1.User.findByPk(req.params.id);
    if (!employee) {
        res.status(404).json({ message: "Employee not found" });
        return;
    }
    const { fullName, roleId, department, status } = req.body;
    await employee.update({ fullName, roleId, department, status });
    res.json({ ...employee.toJSON(), passwordHash: undefined });
});
// Offboard — mark inactive
router.post("/:id/offboard", (0, authenticate_1.authorize)("employees:write"), async (req, res) => {
    const employee = await models_1.User.findByPk(req.params.id);
    if (!employee) {
        res.status(404).json({ message: "Employee not found" });
        return;
    }
    await employee.update({ status: "inactive" });
    res.json({ message: "Employee offboarded", id: employee.id });
});
exports.default = router;
//# sourceMappingURL=employees.js.map