# 🎓 LevelUpDS - Esquema de Base de Datos con Drizzle ORM

¡Hola! He completado la configuración completa de base de datos para tu proyecto Next.js. Aquí está todo lo que se ha generado:

## 📦 Lo que se ha instalado

```bash
✅ drizzle-orm       # ORM principal
✅ postgres          # Driver PostgreSQL
✅ dotenv            # Variables de entorno
✅ drizzle-kit       # CLI para migraciones
```

## 📂 Estructura de Archivos Creada

```
src/db/
├── schema.ts              # ⭐ Definición de todas las tablas y relaciones
├── types.ts               # 📋 Tipos TypeScript + Enums
├── queries.ts             # 🔧 Funciones helper para queries comunes
├── client.ts              # 🔌 Configuración de conexión Drizzle
├── config.ts              # ⚙️ Variables de configuración
├── migrate.ts             # 🚀 Script para ejecutar migraciones
├── examples.ts            # 💡 11 ejemplos de uso
└── migrations/
    └── 0000_acoustic_black_tom.sql  # ✨ SQL generado automáticamente
```

## 🚀 Próximos Pasos

### 1️⃣ Configurar las Variables de Entorno

Copia `.env.example` a `.env.local` y configura tu base de datos PostgreSQL:

```env
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=tu_contraseña
DB_NAME=level_upds
```

### 2️⃣ Crear la Base de Datos PostgreSQL

```bash
# Crear BD manualmente (si no existe)
psql -U postgres -c "CREATE DATABASE level_upds;"
```

### 3️⃣ Ejecutar las Migraciones

```bash
pnpm db:push
```

✅ ¡Base de datos lista!

## 📊 Estructura de la Base de Datos

### 7 Tablas Principales:

| Tabla                      | Descripción                        |
| -------------------------- | ---------------------------------- |
| **users**                  | Estudiantes, profesores, admins    |
| **courses**                | Cursos creados por profesores      |
| **enrollments**            | Inscripciones de estudiantes       |
| **activities**             | Actividades (teóricas o de código) |
| **programming_activities** | Detalles de actividades con tests  |
| **submissions**            | Envíos de código con resultados    |
| **grades**                 | Calificaciones finales             |

## 💻 Cómo Usar en Código

### Importar y crear datos

```typescript
import { createUser, createCourse, createEnrollment } from "@/db/queries";

// Crear un usuario
const user = await createUser({
  name: "Juan Pérez",
  email: "juan@example.com",
  password: "hashed_password",
  role: "student",
});

// Crear un curso
const course = await createCourse({
  docenteId: 1,
  nombre: "JavaScript Avanzado",
  descripcion: "Aprende conceptos avanzados",
  estado: "activo",
});

// Inscribir estudiante
await createEnrollment({
  userId: user.id,
  courseId: course.id,
});
```

### Queries más complejas

```typescript
import { db } from "@/db/client";
import { courses, users } from "@/db/schema";
import { eq } from "drizzle-orm";

// Obtener curso con profesor
const courseWithTeacher = await db
  .select()
  .from(courses)
  .leftJoin(users, eq(courses.docenteId, users.id))
  .where(eq(courses.id, 1));
```

## 🔗 Scripts Disponibles

```bash
pnpm db:generate    # Generar nuevas migraciones
pnpm db:migrate     # Ejecutar migraciones
pnpm db:push        # Push directo a BD (sin archivos)
pnpm db:studio      # Abrir Drizzle Studio UI
pnpm db:drop        # Eliminar BD
```

## 📝 Tipos TypeScript Disponibles

```typescript
import {
  type User,
  type Course,
  type Activity,
  type Submission,
  type Grade,
  UserRole,
  ActivityType,
  SubmissionStatus,
  GradeVerdict,
  ProgrammingLanguage,
  type TestCase,
  type SubmissionResult,
} from "@/db/types";
```

## 💡 11 Ejemplos de Uso

He incluido 11 ejemplos completos en `src/db/examples.ts`:

1. ✅ Crear usuario (registro)
2. ✅ Profesor crea curso
3. ✅ Obtener cursos del profesor
4. ✅ Crear actividad teórica
5. ✅ Crear actividad de programación con tests
6. ✅ Inscribir estudiante
7. ✅ Enviar código
8. ✅ Actualizar envío con resultados
9. ✅ Crear calificación
10. ✅ Obtener calificaciones de estudiante
11. ✅ Obtener envíos de estudiante

## 🔐 Seguridad

- ✅ Foreign keys con constraints
- ✅ Unique constraints donde corresponde
- ✅ SQL Injection prevention (Drizzle)
- ✅ Validated relationships

## 📚 Documentación Completa

Lee `DATABASE_SETUP.md` para:

- Guía completa de configuración
- Ejemplos de uso avanzado
- Mejores prácticas
- Troubleshooting

## ⚠️ Importante

1. **Hash de Contraseñas**: Usa `bcrypt` o similar

   ```typescript
   import bcrypt from "bcrypt";
   const hashedPassword = await bcrypt.hash(password, 10);
   ```

2. **Variables de Entorno**: Nunca commitees `.env.local`

3. **Migraciones**: Versionan automáticamente en `src/db/migrations/`

## 🎯 Próximo Paso Recomendado

Crea una ruta API para probar la BD:

```typescript
// app/api/users/route.ts
import { createUser } from "@/db/queries";

export async function POST(request: Request) {
  const data = await request.json();
  const user = await createUser(data);
  return Response.json(user);
}
```

## 📞 Recursos

- 📖 [Drizzle ORM Docs](https://orm.drizzle.team/)
- 📖 [PostgreSQL Docs](https://www.postgresql.org/docs/)
- 📖 [Next.js API Routes](https://nextjs.org/docs/api-routes/introduction)

---

**¡Tu base de datos está lista para guardar cursos, inscripciones, actividades, envíos y calificaciones! 🚀**

¿Preguntas? Revisa `DATABASE_SETUP.md` o los ejemplos en `src/db/examples.ts`
