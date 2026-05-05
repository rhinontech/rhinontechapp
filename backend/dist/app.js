"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const env_1 = require("./config/env");
const auth_1 = __importDefault(require("./routes/auth"));
const roles_1 = __importDefault(require("./routes/roles"));
const permissions_1 = __importDefault(require("./routes/permissions"));
const employees_1 = __importDefault(require("./routes/employees"));
const provisioning_1 = __importDefault(require("./routes/provisioning"));
const inbox_1 = __importDefault(require("./routes/inbox"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)({ origin: env_1.env.frontendUrl, credentials: true }));
app.use(express_1.default.json());
app.use("/auth", auth_1.default);
app.use("/roles", roles_1.default);
app.use("/permissions", permissions_1.default);
app.use("/employees", employees_1.default);
app.use("/provisioning", provisioning_1.default);
app.use("/inbox", inbox_1.default);
app.get("/health", (_req, res) => {
    res.json({ status: "ok" });
});
exports.default = app;
//# sourceMappingURL=app.js.map