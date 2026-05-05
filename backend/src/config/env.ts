import dotenv from "dotenv";
dotenv.config();

export const env = {
  port: parseInt(process.env.PORT || "5000", 10),
  databaseUrl: process.env.DATABASE_URL || "",
  jwtSecret: process.env.JWT_SECRET || "rhinon-dev-secret-change-in-production",
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "7d",
  frontendUrl: process.env.FRONTEND_URL || "http://localhost:4200",
  slack: {
    botToken: process.env.SLACK_BOT_TOKEN || "",
  },
  github: {
    token: process.env.GITHUB_TOKEN || "",
    org: process.env.GITHUB_ORG || "",
  },
};
