"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const models_1 = require("../models");
const authenticate_1 = require("../middleware/authenticate");
const router = (0, express_1.Router)();
router.use(authenticate_1.authenticate);
router.get("/", async (_req, res) => {
    const permissions = await models_1.Permission.findAll();
    res.json(permissions);
});
exports.default = router;
//# sourceMappingURL=permissions.js.map