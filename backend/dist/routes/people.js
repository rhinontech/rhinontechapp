"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const models_1 = require("../models");
const authenticate_1 = require("../middleware/authenticate");
const router = (0, express_1.Router)();
router.use(authenticate_1.authenticate, (0, authenticate_1.authorize)("people:read"));
router.get("/", async (_req, res) => {
    const employees = await models_1.User.findAll({
        include: [{ model: models_1.Role, as: "role", attributes: ["name", "slug"] }],
        attributes: { exclude: ["passwordHash"] },
        order: [["fullName", "ASC"]],
    });
    res.json(employees);
});
router.get("/:id", async (req, res) => {
    const employee = await models_1.User.findByPk(req.params.id, {
        include: [{ model: models_1.Role, as: "role", attributes: ["name", "slug"] }],
        attributes: { exclude: ["passwordHash"] },
    });
    if (!employee) {
        res.status(404).json({ message: "Employee not found" });
        return;
    }
    res.json(employee);
});
exports.default = router;
//# sourceMappingURL=people.js.map