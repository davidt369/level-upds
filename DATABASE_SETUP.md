# Guía de Configuración y Uso de Drizzle ORM

## 📋 Estructura de Base de Datos

Tu proyecto tiene las siguientes tablas principales:

### 1. **users** - Usuarios del sistema

- Estudiantes, profesores, administradores
- Almacena email, contraseña (hasheada), nombre y rol

### 2. **courses** - Cursos
3
- Creados por profesores (docenteId)
- Con fechas de inicio/fin y estado

### 3. **enrollments** - Inscripciones

- Relación muchos-a-muchos entre estudiantes y cursos
- Unique constraint: un estudiante no puede inscribirse dos veces al mismo curso

### 4. **activities** - Actividades

- Teóricas ("theory") o de programación ("code")
- Con fecha límite y puntuación total

### 5. **programming_activities** - Detalles de actividades de programación

- Lenguaje de programación, límites de tiempo y memoria
- Casos de prueba en formato JSONB

### 6. **submissions** - Envíos de actividades

- Código enviado por estudiantes
- Estado: pending, processing, done
- Resultados de test cases en formato JSONB

### 7. **grades** - Calificaciones

- Resultado final de una actividad para un estudiante
- Veredicto: passed, failed, partial

## 🚀 Primeros Pasos

### 1. Configurar la Base de Datos PostgreSQL

```bash
# Crear la base de datos (opcional si ya existe)
psql -U postgres -c "CREATE DATABASE level_upds;"
```

### 2. Configurar Variables de Entorno

Copia el archivo `.env.example` y renómbralo a `.env.local`:

```bash
cp .env.example .env.local
```

Actualiza los valores según tu configuración de PostgreSQL:

```env
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=tu_contraseña
DB_NAME=level_upds
```

### 3. Generar Migraciones

```bash
pnpm db:generate
```

Esto creará archivos SQL en `src/db/migrations/`.

### 4. Ejecutar Migraciones

```bash
pnpm db:push
```

O si prefieres migraciones tradicionales:

```bash
pnpm db:migrate
```

## 📁 Estructura de Archivos

```
src/db/
├── schema.ts          # Definición de tablas y relaciones
├── types.ts           # Tipos TypeScript inferidos de schema
├── queries.ts         # Funciones helper para queries comunes
├── client.ts          # Configuración de conexión Drizzle
├── config.ts          # Variables de configuración
└── migrations/        # Archivos SQL generados automáticamente
```

## 💻 Uso en Código

### Importar y usar queries

```typescript
import {
  createUser,
  getUserById,
  getCourseById,
  createEnrollment,
} from "@/db/queries";

// Crear un usuario
const user = await createUser({
  name: "Juan Pérez",
  email: "juan@example.com",
  password: "hashed_password",
  role: "student",
});

// Obtener un usuario
const userData = await getUserById(1);

// Inscribir a un estudiante en un curso
const enrollment = await createEnrollment({
  userId: 1,
  courseId: 5,
});
```

### Usar Drizzle directamente para queries complejas

```typescript
import { db } from "@/db/client";
import { courses, enrollments, users } from "@/db/schema";
import { eq, and } from "drizzle-orm";

// Query compleja con joins
const courseWithTeacher = await db
  .select()
  .from(courses)
  .leftJoin(users, eq(courses.docenteId, users.id))
  .where(eq(courses.id, 1));
```

## 🔍 Tipos TypeScript

Todos los tipos están generados automáticamente desde el schema:

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
} from "@/db/types";

// Usar tipos en funciones
async function handleUserCreation(userData: User): Promise<void> {
  // Tu lógica aquí
}
```

## 🛠 Herramientas Disponibles

### Drizzle Studio (UI para la BD)

```bash
pnpm db:studio
```

Abre una interfaz web donde puedes ver/editar datos directamente.

### Generar Migrations

```bash
pnpm db:generate
```

### Push directo a BD (sin archivos de migración)

```bash
pnpm db:push
```

### Drop de BD

```bash
pnpm db:drop
```

## 📝 Cambios en el Schema

1. Edita `src/db/schema.ts`
2. Ejecuta `pnpm db:generate` para crear el archivo de migración
3. Revisa el archivo SQL en `src/db/migrations/`
4. Ejecuta `pnpm db:push` para aplicar cambios

## 🔐 Seguridad

- **Hashing de contraseñas**: Asegúrate de usar bcrypt u otra librería para hashear contraseñas antes de guardar
- **SQL Injection**: Drizzle ORM previene esto automáticamente con prepared statements
- **Validación**: Valida datos en el servidor antes de guardarlos a la BD

## 📚 Recursos

- [Documentación Drizzle ORM](https://orm.drizzle.team/)
- [Drizzle Kit CLI](https://orm.drizzle.team/kit-docs/overview)
- [PostgreSQL Docs](https://www.postgresql.org/docs/)

## ⚠️ Notas Importantes

- Las fechas usan formato ISO 8601
- Los JSONs (casos de prueba, resultados) deben ser objetos/arrays válidos
- Las relaciones están definidas para facilitar queries con `.with()`
- Usa `eq()`, `and()`, `or()` de drizzle-orm para condiciones



objevito principapl, espesifico, justificacion tecnica, problematica , tipo de investigacion, cualitativo