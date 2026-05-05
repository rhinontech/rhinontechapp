"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticate = authenticate;
exports.authorize = authorize;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const env_1 = require("../config/env");
function authenticate(req, res, next) {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
        res.status(401).json({ message: "No token provided" });
        return;
    }
    try {
        const payload = jsonwebtoken_1.default.verify(token, env_1.env.jwtSecret);
        req.user = payload;
        next();
    }
    catch {
        res.status(401).json({ message: "Invalid or expired token" });
    }
}
function authorize(...requiredPermissions) {
    return (req, res, next) => {
        const userPermissions = req.user?.permissions || [];
        const hasAll = requiredPermissions.every((p) => userPermissions.includes(p));
        if (!hasAll) {
            res.status(403).json({ message: "Insufficient permissions" });
            return;
        }
        next();
    };
}
//# sourceMappingURL=authenticate.js.map