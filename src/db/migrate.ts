import { migrate } from "drizzle-orm/postgres-js/migrator";
import { queryClient, db } from "./client";

export async function runMigrations() {
  try {
    console.log("Starting migrations...");
    await migrate(db, { migrationsFolder: "./src/db/migrations" });
    console.log("✅ Migrations completed successfully!");
  } catch (error) {
    console.error("❌ Migration failed:", error);
    throw error;
  } finally {
    await queryClient.end();
  }
}

// Si se ejecuta directamente
if (require.main === module) {
  runMigrations().catch(console.error);
}
