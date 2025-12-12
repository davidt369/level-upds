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
import {
  NewUser,
  NewCourse,
  NewEnrollment,
  NewActivity,
  NewProgrammingActivity,
  NewSubmission,
  NewGrade,
  type User,
  type Course,
  type Enrollment,
  type Activity,
  type ProgrammingActivity,
  type Submission,
  type Grade,
} from "./types";
import { eq, and, desc } from "drizzle-orm";

// ============================================================================
// USUARIOS
// ============================================================================

export async function createUser(data: NewUser): Promise<User> {
  const [user] = await db.insert(users).values(data).returning();
  return user;
}

export async function getUserById(id: number): Promise<User | null> {
  const [user] = await db.select().from(users).where(eq(users.id, id));
  return user || null;
}

export async function getUserByEmail(email: string): Promise<User | null> {
  const [user] = await db.select().from(users).where(eq(users.email, email));
  return user || null;
}

export async function getAllUsers(): Promise<User[]> {
  return db.select().from(users);
}

// ============================================================================
// CURSOS
// ============================================================================

export async function createCourse(data: NewCourse): Promise<Course> {
  const [course] = await db.insert(courses).values(data).returning();
  return course;
}

export async function getCourseById(id: number): Promise<Course | null> {
  const [course] = await db.select().from(courses).where(eq(courses.id, id));
  return course || null;
}

export async function getCoursesByTeacher(
  docenteId: number
): Promise<Course[]> {
  return db.select().from(courses).where(eq(courses.docenteId, docenteId));
}

export async function getAllCourses(): Promise<Course[]> {
  return db.select().from(courses);
}

export async function updateCourse(
  id: number,
  data: Partial<Omit<Course, "id">>
): Promise<Course | null> {
  const [course] = await db
    .update(courses)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(courses.id, id))
    .returning();
  return course || null;
}

// ============================================================================
// INSCRIPCIONES
// ============================================================================

export async function createEnrollment(
  data: NewEnrollment
): Promise<Enrollment> {
  const [enrollment] = await db.insert(enrollments).values(data).returning();
  return enrollment;
}

export async function getEnrollmentsByStudent(
  userId: number
): Promise<Course[]> {
  return db
    .select()
    .from(courses)
    .leftJoin(enrollments, eq(enrollments.courseId, courses.id))
    .where(eq(enrollments.userId, userId))
    .then((result) => result.map((r) => r.courses));
}

export async function getEnrollmentsByCourse(
  courseId: number
): Promise<User[]> {
  return db
    .select()
    .from(users)
    .leftJoin(enrollments, eq(enrollments.userId, users.id))
    .where(eq(enrollments.courseId, courseId))
    .then((result) => result.map((r) => r.users));
}

export async function isUserEnrolled(
  userId: number,
  courseId: number
): Promise<boolean> {
  const [result] = await db
    .select()
    .from(enrollments)
    .where(
      and(eq(enrollments.userId, userId), eq(enrollments.courseId, courseId))
    );
  return !!result;
}

// ============================================================================
// ACTIVIDADES
// ============================================================================

export async function createActivity(data: NewActivity): Promise<Activity> {
  const [activity] = await db.insert(activities).values(data).returning();
  return activity;
}

export async function getActivityById(id: number): Promise<Activity | null> {
  const [activity] = await db
    .select()
    .from(activities)
    .where(eq(activities.id, id));
  return activity || null;
}

export async function getActivitiesByCourse(
  courseId: number
): Promise<Activity[]> {
  return db.select().from(activities).where(eq(activities.courseId, courseId));
}

export async function getActivitiesByTeacher(
  docenteId: number
): Promise<Activity[]> {
  return db
    .select()
    .from(activities)
    .where(eq(activities.docenteId, docenteId));
}

export async function updateActivity(
  id: number,
  data: Partial<Omit<Activity, "id">>
): Promise<Activity | null> {
  const [activity] = await db
    .update(activities)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(activities.id, id))
    .returning();
  return activity || null;
}

// ============================================================================
// ACTIVIDADES DE PROGRAMACIÓN
// ============================================================================

export async function createProgrammingActivity(
  data: NewProgrammingActivity
): Promise<ProgrammingActivity> {
  const [progActivity] = await db
    .insert(programmingActivities)
    .values(data)
    .returning();
  return progActivity;
}

export async function getProgrammingActivityByActivityId(
  activityId: number
): Promise<ProgrammingActivity | null> {
  const [progActivity] = await db
    .select()
    .from(programmingActivities)
    .where(eq(programmingActivities.activityId, activityId));
  return progActivity || null;
}

// ============================================================================
// ENVÍOS
// ============================================================================

export async function createSubmission(
  data: NewSubmission
): Promise<Submission> {
  const [submission] = await db.insert(submissions).values(data).returning();
  return submission;
}

export async function getSubmissionById(
  id: number
): Promise<Submission | null> {
  const [submission] = await db
    .select()
    .from(submissions)
    .where(eq(submissions.id, id));
  return submission || null;
}

export async function getSubmissionsByActivity(
  activityId: number
): Promise<Submission[]> {
  return db
    .select()
    .from(submissions)
    .where(eq(submissions.activityId, activityId))
    .orderBy(desc(submissions.createdAt));
}

export async function getSubmissionsByStudent(
  studentId: number
): Promise<Submission[]> {
  return db
    .select()
    .from(submissions)
    .where(eq(submissions.studentId, studentId))
    .orderBy(desc(submissions.createdAt));
}

export async function getLatestSubmissionByStudentAndActivity(
  studentId: number,
  activityId: number
): Promise<Submission | null> {
  const [submission] = await db
    .select()
    .from(submissions)
    .where(
      and(
        eq(submissions.studentId, studentId),
        eq(submissions.activityId, activityId)
      )
    )
    .orderBy(desc(submissions.createdAt))
    .limit(1);
  return submission || null;
}

export async function updateSubmission(
  id: number,
  data: Partial<Omit<Submission, "id">>
): Promise<Submission | null> {
  const [submission] = await db
    .update(submissions)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(submissions.id, id))
    .returning();
  return submission || null;
}

// ============================================================================
// CALIFICACIONES
// ============================================================================

export async function createGrade(data: NewGrade): Promise<Grade> {
  const [grade] = await db.insert(grades).values(data).returning();
  return grade;
}

export async function getGradeById(id: number): Promise<Grade | null> {
  const [grade] = await db.select().from(grades).where(eq(grades.id, id));
  return grade || null;
}

export async function getGradesByStudent(studentId: number): Promise<Grade[]> {
  return db
    .select()
    .from(grades)
    .where(eq(grades.studentId, studentId))
    .orderBy(desc(grades.createdAt));
}

export async function getGradesByActivity(
  activityId: number
): Promise<Grade[]> {
  return db
    .select()
    .from(grades)
    .where(eq(grades.activityId, activityId))
    .orderBy(desc(grades.createdAt));
}

export async function getGradesBySubmission(
  submissionId: number
): Promise<Grade | null> {
  const [grade] = await db
    .select()
    .from(grades)
    .where(eq(grades.submissionId, submissionId));
  return grade || null;
}

export async function updateGrade(
  id: number,
  data: Partial<Omit<Grade, "id">>
): Promise<Grade | null> {
  const [grade] = await db
    .update(grades)
    .set(data)
    .where(eq(grades.id, id))
    .returning();
  return grade || null;
}
