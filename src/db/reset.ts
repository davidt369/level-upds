
import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import { db } from "./client";
import {
    users,
    courses,
    enrollments,
    activities,
    programmingActivities,
    submissions,
    grades,
} from "./schema";
import { sql } from "drizzle-orm";

const reset = async () => {
    try {
        console.log("🔥 Reseteando base de datos...");

        // Borrar en orden inverso de dependencias para evitar violaciones de FK

        // 1. Tablas dependientes de todo (hojas)
        console.log("  🗑️  Limpiando grades...");
        await db.delete(grades);

        console.log("  🗑️  Limpiando submissions...");
        await db.delete(submissions);

        console.log("  🗑️  Limpiando programming_activities...");
        await db.delete(programmingActivities);

        // 2. Tablas intermedias
        console.log("  🗑️  Limpiando activities...");
        await db.delete(activities);

        console.log("  🗑️  Limpiando enrollments...");
        await db.delete(enrollments);

        // 3. Tablas padre
        console.log("  🗑️  Limpiando courses...");
        await db.delete(courses);

        console.log("  🗑️  Limpiando users...");
        await db.delete(users);

        console.log("\n✅ Base de datos limpiada exitosamente\n");
        process.exit(0);
    } catch (error) {
        console.error("❌ Error reseteando la base de datos:", error);
        process.exit(1);
    }
};

reset();
