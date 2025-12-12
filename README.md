# 🎓 LevelUpDS - Plataforma de Cursos Online

Aplicación Next.js + TypeScript con base de datos PostgreSQL + Drizzle ORM para gestionar cursos, estudiantes, actividades de programación y calificaciones automáticas.

## 🚀 Quick Start

### 1. Instalar dependencias

```bash
pnpm install
```

### 2. Configurar base de datos

Copia `.env.example` a `.env.local` y actualiza tus credenciales PostgreSQL:

```env
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=tu_contraseña
DB_NAME=level_upds
```

### 3. Crear BD y ejecutar migraciones

```bash
# Crear BD PostgreSQL
psql -U postgres -c "CREATE DATABASE level_upds;"

# Ejecutar migraciones
pnpm db:push
```

### 4. Iniciar servidor de desarrollo

```bash
pnpm dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

---

## 📚 Documentación

- **[DATABASE_SETUP.md](./DATABASE_SETUP.md)** - Guía completa de configuración
- **[DATABASE_SCHEMA_SUMMARY.md](./DATABASE_SCHEMA_SUMMARY.md)** - Resumen del esquema
- **[INSTALLATION_COMPLETE.txt](./INSTALLATION_COMPLETE.txt)** - Detalles de instalación
- **[src/db/examples.ts](./src/db/examples.ts)** - 11 ejemplos de uso

---

## 💾 Base de Datos

**7 Tablas Principales:**

| Tabla                      | Descripción                                |
| -------------------------- | ------------------------------------------ |
| **users**                  | Usuarios (estudiantes, profesores, admins) |
| **courses**                | Cursos creados por profesores              |
| **enrollments**            | Inscripciones de estudiantes               |
| **activities**             | Actividades (teóricas o de programación)   |
| **programming_activities** | Detalles con casos de prueba               |
| **submissions**            | Envíos de código                           |
| **grades**                 | Calificaciones automáticas                 |

---

## 🛠️ Scripts Disponibles

```bash
pnpm dev              # Iniciar servidor de desarrollo
pnpm build            # Compilar para producción
pnpm start            # Ejecutar versión producción
pnpm lint             # Ejecutar linter (Biome)
pnpm format           # Formatear código

# Base de datos
pnpm db:generate      # Generar nuevas migraciones
pnpm db:push          # Push directo a BD
pnpm db:migrate       # Ejecutar migraciones
pnpm db:studio        # Abrir interfaz gráfica
pnpm db:drop          # Eliminar BD
```

---

## 💻 Usar en tu código

```typescript
import { createUser, getUserById, createCourse } from "@/db/queries";

// Crear usuario
const user = await createUser({
  name: "Juan Pérez",
  email: "juan@example.com",
  password: "hashed_password",
  role: "student",
});

// Obtener usuario
const userData = await getUserById(user.id);

// Crear curso
const course = await createCourse({
  docenteId: 1,
  nombre: "JavaScript Avanzado",
  descripcion: "Aprende conceptos avanzados",
});
```

---

## 📁 Estructura del Proyecto

```
src/
├── app/                    # Rutas y componentes Next.js
├── components/            # Componentes reutilizables
├── db/                    # Base de datos
│   ├── schema.ts          # Definición de tablas
│   ├── types.ts           # Tipos TypeScript
│   ├── queries.ts         # Funciones helper
│   ├── client.ts          # Conexión Drizzle
│   ├── examples.ts        # Ejemplos de uso
│   └── migrations/        # Archivos SQL
└── lib/                   # Utilidades
```

---

## 🔧 Tecnologías

- **Frontend:** Next.js 16, React 19, TypeScript
- **Backend:** Next.js API Routes
- **Database:** PostgreSQL + Drizzle ORM
- **Styling:** Tailwind CSS
- **UI Components:** Radix UI
- **Linting:** Biome

---

## 🔐 Seguridad

- ✅ Foreign keys y constraints
- ✅ SQL injection prevention (Drizzle)
- ✅ Type-safe queries
- ✅ Validación de datos
- ✅ Nunca commitear `.env.local`

---

## 📖 Learn More

- [Drizzle ORM Docs](https://orm.drizzle.team/)
- [Next.js Documentation](https://nextjs.org/docs)
- [PostgreSQL Docs](https://www.postgresql.org/docs/)
- [TypeScript Docs](https://www.typescriptlang.org/docs/)

---

## 📝 License

MIT

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
