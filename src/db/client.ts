import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";
import { dbConfig } from "./config";

// Crear la conexión a PostgreSQL
const queryClient = postgres({
  host: dbConfig.host,
  port: dbConfig.port,
  user: dbConfig.user,
  password: dbConfig.password,
  database: dbConfig.database,
  ssl:
    dbConfig.host !== "localhost" && dbConfig.host !== "127.0.0.1"
      ? { rejectUnauthorized: false }
      : false,
});

// Inicializar Drizzle ORM
export const db = drizzle(queryClient, { schema });

// Exportar la conexión para migraciones
export { queryClient };
