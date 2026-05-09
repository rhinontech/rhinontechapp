import app from "./app";
import { env } from "./config/env";
import { sequelize } from "./config/database";
import { syncDatabase } from "./models";
import cron from "node-cron";
import axios from "axios";

async function start() {
  await sequelize.authenticate();
  console.log("Database connected");

  await syncDatabase();
  console.log("Models synced");

  app.listen(env.port, () => {
    console.log(`Server running on http://localhost:${env.port}`);

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
