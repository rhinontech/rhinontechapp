"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const sequelize_1 = require("sequelize");
const models_1 = require("../models");
const authenticate_1 = require("../middleware/authenticate");
const router = (0, express_1.Router)();
router.use(authenticate_1.authenticate);
const folders = new Set(["inbox", "sent", "drafts", "archive", "trash"]);
router.get("/", (0, authenticate_1.authorize)("inbox:read"), async (req, res) => {
    const { folder = "inbox", search, starred } = req.query;
    const where = {};
    if (typeof folder === "string" && folders.has(folder)) {
        where.folder = folder;
    }
    if (starred === "true") {
        where.isStarred = true;
    }
    if (typeof search === "string" && search.trim()) {
        const term = `%${search.trim()}%`;
        where[sequelize_1.Op.or] = [
            { fromName: { [sequelize_1.Op.iLike]: term } },
            { fromEmail: { [sequelize_1.Op.iLike]: term } },
            { subject: { [sequelize_1.Op.iLike]: term } },
            { snippet: { [sequelize_1.Op.iLike]: term } },
            { body: { [sequelize_1.Op.iLike]: term } },
        ];
    }
    const emails = await models_1.InboxEmail.findAll({
        where,
        order: [["sentAt", "DESC"]],
    });
    res.json(emails);
});
router.get("/:id", (0, authenticate_1.authorize)("inbox:read"), async (req, res) => {
    const email = await models_1.InboxEmail.findByPk(req.params.id);
    if (!email) {
        res.status(404).json({ message: "Email not found" });
        return;
    }
    if (!email.isRead) {
        await email.update({ isRead: true });
    }
    const thread = await models_1.InboxEmail.findAll({
        where: { threadKey: email.threadKey },
        order: [["sentAt", "ASC"]],
    });
    res.json({ ...email.toJSON(), isRead: true, thread });
});
router.post("/", (0, authenticate_1.authorize)("inbox:write"), async (req, res) => {
    const { toEmails, ccEmails = [], subject, body, folder = "sent" } = req.body;
    if (!Array.isArray(toEmails) || toEmails.length === 0 || !subject || !body) {
        res.status(400).json({ message: "To, subject and body are required" });
        return;
    }
    const sentAt = new Date();
    const email = await models_1.InboxEmail.create({
        threadKey: `thread-${sentAt.getTime()}`,
        folder: folder === "drafts" ? "drafts" : "sent",
        fromName: req.user?.fullName || "Rhinon",
        fromEmail: req.user?.companyEmail || "admin@rhinontech.in",
        toEmails,
        ccEmails,
        subject,
        body,
        snippet: body.slice(0, 160),
        isRead: true,
        isStarred: false,
        hasAttachment: false,
        sentAt,
    });
    res.status(201).json(email);
});
router.post("/:id/reply", (0, authenticate_1.authorize)("inbox:write"), async (req, res) => {
    const { body } = req.body;
    if (!body || typeof body !== "string" || !body.trim()) {
        res.status(400).json({ message: "Reply body is required" });
        return;
    }
    const original = await models_1.InboxEmail.findByPk(req.params.id);
    if (!original) {
        res.status(404).json({ message: "Email not found" });
        return;
    }
    const reply = await models_1.InboxEmail.create({
        threadKey: original.threadKey,
        folder: "sent",
        fromName: req.user?.fullName || "Rhinon",
        fromEmail: req.user?.companyEmail || "admin@rhinontech.in",
        toEmails: [original.fromEmail],
        ccEmails: [],
        subject: original.subject.startsWith("Re:") ? original.subject : `Re: ${original.subject}`,
        body: body.trim(),
        snippet: body.trim().slice(0, 160),
        isRead: true,
        isStarred: false,
        hasAttachment: false,
        sentAt: new Date(),
    });
    res.status(201).json(reply);
});
router.patch("/:id", (0, authenticate_1.authorize)("inbox:write"), async (req, res) => {
    const email = await models_1.InboxEmail.findByPk(req.params.id);
    if (!email) {
        res.status(404).json({ message: "Email not found" });
        return;
    }
    const updates = {};
    if (typeof req.body.folder === "string") {
        if (!folders.has(req.body.folder)) {
            res.status(400).json({ message: "Invalid folder" });
            return;
        }
        updates.folder = req.body.folder;
    }
    if (typeof req.body.isRead === "boolean") {
        updates.isRead = req.body.isRead;
    }
    if (typeof req.body.isStarred === "boolean") {
        updates.isStarred = req.body.isStarred;
    }
    await email.update(updates);
    res.json(email);
});
exports.default = router;
//# sourceMappingURL=inbox.js.map