import { db } from "./src/db/client";
import { users, courses } from "./src/db/schema";

async function main() {
  console.log("--- USERS ---");
  const allUsers = await db.select().from(users);
  console.table(
    allUsers.map((u) => ({
      id: u.id,
      name: u.name,
      email: u.email,
      role: u.role,
    }))
  );

  console.log("\n--- COURSES ---");
  const allCourses = await db.select().from(courses);
  console.table(
    allCourses.map((c) => ({
      id: c.id,
      nombre: c.nombre,
      docenteId: c.docenteId,
      estado: c.estado,
    }))
  );
}

main()
  .catch(console.error)
  .finally(() => process.exit(0));
