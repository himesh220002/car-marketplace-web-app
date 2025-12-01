import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "postgresql",
  schema: "./configs/schema.ts",
  out: "./drizzle",
  dbCredentials: {
    url:'postgresql://neondb_owner:npg_cColxIFp05iX@ep-small-truth-a1po4d2c-pooler.ap-southeast-1.aws.neon.tech/car-marketplace?sslmode=require',
    
  },
});
