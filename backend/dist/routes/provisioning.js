"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const models_1 = require("../models");
const authenticate_1 = require("../middleware/authenticate");
const env_1 = require("../config/env");
const router = (0, express_1.Router)();
router.use(authenticate_1.authenticate, (0, authenticate_1.authorize)("provisioning:read"));
router.post("/:id/slack", (0, authenticate_1.authorize)("provisioning:write"), async (req, res) => {
    const employee = await models_1.User.findByPk(req.params.id);
    if (!employee) {
        res.status(404).json({ message: "Employee not found" });
        return;
    }
    if (!env_1.env.slack.botToken) {
        res.status(503).json({ message: "Slack integration not configured" });
        return;
    }
    const slackRes = await fetch("https://slack.com/api/users.admin.invite", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${env_1.env.slack.botToken}`,
        },
        body: JSON.stringify({ email: employee.personalEmail }),
    });
    const slackData = await slackRes.json();
    if (!slackData.ok) {
        res.status(400).json({ message: `Slack invite failed: ${slackData.error}` });
        return;
    }
    res.json({ message: "Slack invite sent", email: employee.personalEmail });
});
router.post("/:id/github", (0, authenticate_1.authorize)("provisioning:write"), async (req, res) => {
    const employee = await models_1.User.findByPk(req.params.id);
    if (!employee) {
        res.status(404).json({ message: "Employee not found" });
        return;
    }
    if (!env_1.env.github.token || !env_1.env.github.org) {
        res.status(503).json({ message: "GitHub integration not configured" });
        return;
    }
    const { githubUsername } = req.body;
    if (!githubUsername) {
        res.status(400).json({ message: "githubUsername is required" });
        return;
    }
    const ghRes = await fetch(`https://api.github.com/orgs/${env_1.env.github.org}/invitations`, {
        method: "POST",
        headers: {
            Accept: "application/vnd.github+json",
            Authorization: `Bearer ${env_1.env.github.token}`,
            "X-GitHub-Api-Version": "2022-11-28",
        },
        body: JSON.stringify({ invitee_id: githubUsername }),
    });
    if (!ghRes.ok) {
        const err = await ghRes.json();
        res.status(400).json({ message: `GitHub invite failed: ${err.message}` });
        return;
    }
    res.json({ message: "GitHub org invite sent", username: githubUsername });
});
exports.default = router;
//# sourceMappingURL=provisioning.js.map