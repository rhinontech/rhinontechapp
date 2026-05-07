import express from "express";
import cors from "cors";
import { env } from "./config/env";
import authRoutes from "./routes/auth";
import rolesRoutes from "./routes/roles";
import permissionsRoutes from "./routes/permissions";
import employeesRoutes from "./routes/employees";
import provisioningRoutes from "./routes/provisioning";
import inboxRoutes from "./routes/inbox";
import payrollRoutes from "./routes/payroll";
import peopleRoutes from "./routes/people";
import tasksRoutes from "./routes/tasks";
import attendanceRoutes from "./routes/attendance";
import dashboardRoutes from "./routes/dashboard";

const app = express();

const allowedOrigins = [
  ...env.frontendUrls,
  "http://localhost:4200",
  "http://localhost:3000",
].filter(Boolean);
app.use(cors({ origin: (origin, cb) => cb(null, !origin || allowedOrigins.includes(origin)), credentials: true }));
app.use(express.json());

app.use("/auth", authRoutes);
app.use("/roles", rolesRoutes);
app.use("/permissions", permissionsRoutes);
app.use("/employees", employeesRoutes);
app.use("/provisioning", provisioningRoutes);
app.use("/inbox", inboxRoutes);
app.use("/payroll", payrollRoutes);
app.use("/people", peopleRoutes);
app.use("/tasks", tasksRoutes);
app.use("/attendance", attendanceRoutes);
app.use("/dashboard", dashboardRoutes);

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

export default app;
