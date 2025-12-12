import {
  pgTable,
  serial,
  varchar,
  integer,
  text,
  timestamp,
  jsonb,
  date,
  unique,
  foreignKey,
  boolean,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// Tabla de Usuarios
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  password: varchar("password", { length: 255 }).notNull(),
  role: varchar("role", { length: 20 }).notNull().default("student"), // 'student' | 'teacher' | 'admin'
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Tabla de Cursos
export const courses = pgTable("courses", {
  id: serial("id").primaryKey(),
  docenteId: integer("docente_id")
    .notNull()
    .references(() => users.id, { onDelete: "restrict" }),
  nombre: varchar("nombre", { length: 255 }).notNull(),
  descripcion: text("descripcion"),
  estado: varchar("estado", { length: 20 }).notNull().default("activo"), // 'activo' | 'inactivo' | 'archivado'
  fechaInicio: date("fecha_inicio"),
  fechaFin: date("fecha_fin"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Tabla de Inscripciones
export const enrollments = pgTable(
  "enrollments",
  {
    id: serial("id").primaryKey(),
    userId: integer("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    courseId: integer("course_id")
      .notNull()
      .references(() => courses.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [
    unique("enrollments_user_course_unique").on(table.userId, table.courseId),
  ]
);

// Tabla de Actividades
export const activities = pgTable("activities", {
  id: serial("id").primaryKey(),
  courseId: integer("course_id")
    .notNull()
    .references(() => courses.id, { onDelete: "cascade" }),
  docenteId: integer("docente_id")
    .notNull()
    .references(() => users.id, { onDelete: "restrict" }),
  titulo: varchar("titulo", { length: 255 }).notNull(),
  descripcion: text("descripcion"),
  tipo: varchar("tipo", { length: 20 }).notNull(), // 'theory' | 'code'
  fechaLimite: timestamp("fecha_limite"),
  puntuacionTotal: integer("puntuacion_total").notNull().default(100),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Tabla de Actividades de Programación
export const programmingActivities = pgTable("programming_activities", {
  id: serial("id").primaryKey(),
  activityId: integer("activity_id")
    .notNull()
    .unique()
    .references(() => activities.id, { onDelete: "cascade" }),
  lenguaje: varchar("lenguaje", { length: 50 }).notNull(), // 'cpp' | 'python' | 'javascript' | 'java'
  tiempoLimite: integer("tiempo_limite").notNull().default(1000), // milisegundos
  memoriaLimite: integer("memoria_limite").notNull().default(262144), // KB
  casosPrueba: jsonb("casos_prueba").notNull(), // Array de test cases
});

// Tabla de Envíos
export const submissions = pgTable("submissions", {
  id: serial("id").primaryKey(),
  activityId: integer("activity_id")
    .notNull()
    .references(() => activities.id, { onDelete: "cascade" }),
  studentId: integer("student_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  lenguaje: varchar("lenguaje", { length: 50 }),
  codigoFuente: text("codigo_fuente").notNull(),
  resultado: jsonb("resultado"), // Array de resultados de test cases
  estado: varchar("estado", { length: 20 }).notNull().default("pending"), // 'pending' | 'processing' | 'done'
  puntuacion: integer("puntuacion").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Tabla de Calificaciones
export const grades = pgTable("grades", {
  id: serial("id").primaryKey(),
  submissionId: integer("submission_id")
    .notNull()
    .references(() => submissions.id, { onDelete: "cascade" }),
  studentId: integer("student_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  activityId: integer("activity_id")
    .notNull()
    .references(() => activities.id, { onDelete: "cascade" }),
  courseId: integer("course_id")
    .notNull()
    .references(() => courses.id, { onDelete: "cascade" }),
  score: integer("score").notNull().default(0),
  verdict: varchar("verdict", { length: 20 }).notNull().default("failed"), // 'passed' | 'failed' | 'partial'
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ============================================================================
// RELACIONES (Para queries más fáciles con Drizzle)
// ============================================================================

export const usersRelations = relations(users, ({ many }) => ({
  coursesAsTeacher: many(courses),
  enrollments: many(enrollments),
  activitiesCreated: many(activities),
  submissions: many(submissions),
  grades: many(grades),
}));

export const coursesRelations = relations(courses, ({ one, many }) => ({
  teacher: one(users, {
    fields: [courses.docenteId],
    references: [users.id],
  }),
  enrollments: many(enrollments),
  activities: many(activities),
  grades: many(grades),
}));

export const enrollmentsRelations = relations(enrollments, ({ one }) => ({
  user: one(users, {
    fields: [enrollments.userId],
    references: [users.id],
  }),
  course: one(courses, {
    fields: [enrollments.courseId],
    references: [courses.id],
  }),
}));

export const activitiesRelations = relations(activities, ({ one, many }) => ({
  course: one(courses, {
    fields: [activities.courseId],
    references: [courses.id],
  }),
  teacher: one(users, {
    fields: [activities.docenteId],
    references: [users.id],
  }),
  programmingActivity: one(programmingActivities),
  submissions: many(submissions),
  grades: many(grades),
}));

export const programmingActivitiesRelations = relations(
  programmingActivities,
  ({ one }) => ({
    activity: one(activities, {
      fields: [programmingActivities.activityId],
      references: [activities.id],
    }),
  })
);

export const submissionsRelations = relations(submissions, ({ one, many }) => ({
  activity: one(activities, {
    fields: [submissions.activityId],
    references: [activities.id],
  }),
  student: one(users, {
    fields: [submissions.studentId],
    references: [users.id],
  }),
  grade: one(grades),
}));

export const gradesRelations = relations(grades, ({ one }) => ({
  submission: one(submissions, {
    fields: [grades.submissionId],
    references: [submissions.id],
  }),
  student: one(users, {
    fields: [grades.studentId],
    references: [users.id],
  }),
  activity: one(activities, {
    fields: [grades.activityId],
    references: [activities.id],
  }),
  course: one(courses, {
    fields: [grades.courseId],
    references: [courses.id],
  }),
}));
