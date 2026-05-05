"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const models_1 = require("../models");
const authenticate_1 = require("../middleware/authenticate");
const router = (0, express_1.Router)();
router.use(authenticate_1.authenticate);
router.get("/", async (_req, res) => {
    const roles = await models_1.Role.findAll({ include: [models_1.Permission] });
    res.json(roles);
});
router.post("/", (0, authenticate_1.authorize)("settings:write"), async (req, res) => {
    const { name, slug } = req.body;
    if (!name || !slug) {
        res.status(400).json({ message: "name and slug are required" });
        return;
    }
    const role = await models_1.Role.create({ name, slug });
    res.status(201).json(role);
});
router.delete("/:id", (0, authenticate_1.authorize)("settings:write"), async (req, res) => {
    const role = await models_1.Role.findByPk(req.params.id);
    if (!role) {
        res.status(404).json({ message: "Role not found" });
        return;
    }
    await role.destroy();
    res.json({ message: "Role deleted" });
});
// Assign permissions to a role
router.put("/:id/permissions", (0, authenticate_1.authorize)("settings:write"), async (req, res) => {
    const role = await models_1.Role.findByPk(req.params.id);
    if (!role) {
        res.status(404).json({ message: "Role not found" });
        return;
    }
    const { permissionIds } = req.body;
    await role.setPermissions(permissionIds);
    const updated = await models_1.Role.findByPk(req.params.id, { include: [models_1.Permission] });
    res.json(updated);
});
exports.default = router;
//# sourceMappingURL=roles.js.map