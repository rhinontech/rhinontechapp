import app from "./app";
import { env } from "./config/env";
import { sequelize } from "./config/database";
import { syncDatabase } from "./models";
import { Attendance } from "./models/Attendance";
import { Op } from "sequelize";
import cron from "node-cron";
import axios from "axios";

async function autoClockOut() {
  const today = new Date().toISOString().split("T")[0];
  // Set clock-out to 22:00 local time expressed as UTC
  const clockOutTime = new Date(`${today}T22:00:00`);

  const [count] = await Attendance.update(
    { clockOut: clockOutTime, note: "Auto clocked out at 10:00 PM" },
    {
      where: {
        date: today,
        clockIn: { [Op.ne]: null } as any,
        clockOut: null as any,
      },
    }
  );

  if (count > 0) {
    console.log(`[Cron] Auto clocked out ${count} employee(s) at 10:00 PM.`);
  }
}

async function start() {
  await sequelize.authenticate();
  console.log("Database connected");

  await syncDatabase();
  console.log("Models synced");

  app.listen(env.port, () => {
    console.log(`Server running on http://localhost:${env.port}`);

    // Auto clock-out: runs every day at 10:00 PM
    cron.schedule("0 22 * * *", async () => {
      console.log("[Cron] Running auto clock-out...");
      try {
        await autoClockOut();
      } catch (err: any) {
        console.error("[Cron] Auto clock-out failed:", err.message);
      }
    });

    // Schedule outreach campaign engine (runs every day at 9:00 AM)
    cron.schedule("0 9 * * *", async () => {
      console.log("[Cron] Running outreach campaign engine...");
      try {
        await axios.get(`http://localhost:${env.port}/campaigns/cron/run`, {
          headers: { Authorization: `Bearer ${env.cronSecret}` }
        });
        console.log("[Cron] Outreach engine run completed successfully.");
      } catch (err: any) {
        console.error("[Cron] Outreach engine run failed:", err.message);
      }
    });
  });
}

start().catch((err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});
