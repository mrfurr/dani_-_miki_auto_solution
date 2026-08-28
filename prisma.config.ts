import "dotenv/config";
import { defineConfig } from "prisma/config";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";

// Use DIRECT_URL for migrations (bypasses pgBouncer transaction-mode pooler)
const migrationConnectionString = process.env["DIRECT_URL"] || process.env["DATABASE_URL"]!;

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: migrationConnectionString,
  },
});
