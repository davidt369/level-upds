import {
  users,
  courses,
  enrollments,
  activities,
  programmingActivities,
  submissions,
  grades,
} from "./schema";

// Tipos para Usuarios
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

// Tipos para Cursos
export type Course = typeof courses.$inferSelect;
export type NewCourse = typeof courses.$inferInsert;

// Tipos para Inscripciones
export type Enrollment = typeof enrollments.$inferSelect;
export type NewEnrollment = typeof enrollments.$inferInsert;

// Tipos para Actividades
export type Activity = typeof activities.$inferSelect;
export type NewActivity = typeof activities.$inferInsert;

// Tipos para Actividades de Programación
export type ProgrammingActivity = typeof programmingActivities.$inferSelect;
export type NewProgrammingActivity = typeof programmingActivities.$inferInsert;

// Tipos para Envíos
export type Submission = typeof submissions.$inferSelect;
export type NewSubmission = typeof submissions.$inferInsert;

// Tipos para Calificaciones
export type Grade = typeof grades.$inferSelect;
export type NewGrade = typeof grades.$inferInsert;

// Enums para tipos comunes
export enum UserRole {
  STUDENT = "student",
  TEACHER = "teacher",
  ADMIN = "admin",
}

export enum CourseStatus {
  ACTIVE = "activo",
  INACTIVE = "inactivo",
  ARCHIVED = "archivado",
}

export enum ActivityType {
  THEORY = "theory",
  CODE = "code",
}

export enum SubmissionStatus {
  PENDING = "pending",
  PROCESSING = "processing",
  DONE = "done",
}

export enum GradeVerdict {
  PASSED = "passed",
  FAILED = "failed",
  PARTIAL = "partial",
}

export enum ProgrammingLanguage {
  CPP = "cpp",
  PYTHON = "python",
  JAVASCRIPT = "javascript",
  JAVA = "java",
}

// Tipos para casos de prueba
export interface TestCase {
  input: string;
  output: string;
  description?: string;
}

// Tipos para resultado de envío
export interface SubmissionResult {
  testCaseId: number;
  passed: boolean;
  expected: string;
  actual: string;
  error?: string;
  executionTime?: number; // ms
  memoryUsed?: number; // KB
}
