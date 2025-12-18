"use server";

import { db } from "@/db/client";
import {
  activities,
  programmingActivities,
  submissions,
  grades,
  courses,
} from "@/db/schema";
import { eq } from "drizzle-orm";
import { auth } from "@/auth";
import { JUDGE0_LANGUAGE_IDS } from "@/lib/judge0";
import { checkIsExpired } from "@/lib/utils";

export async function submitSolution(
  activityId: number,
  code: string,
  language: string
) {
  const session = await auth();
  if (!session?.user) {
    return { error: "No autorizado" };
  }

  const studentId = parseInt(session.user.id);

  // 1. Get activity details and test cases
  const activity = await db.query.activities.findFirst({
    where: eq(activities.id, activityId),
    with: {
      programmingActivity: true,
    },
  });

  if (!activity || !activity.programmingActivity) {
    return { error: "Actividad no encontrada o no es de programación" };
  }

  // Check expiries
  const course = await db.query.courses.findFirst({
    where: eq(courses.id, activity.courseId),
  });

  if (course && checkIsExpired(course.fechaFin)) {
    return { error: "El curso ha finalizado, no se aceptan más envíos" };
  }

  if (checkIsExpired(activity.fechaLimite)) {
    return { error: "La actividad ha finalizado, no se aceptan más envíos" };
  }

  const { casosPrueba, tiempoLimite, memoriaLimite } =
    activity.programmingActivity;
  const languageId = JUDGE0_LANGUAGE_IDS[language];

  if (!languageId) {
    return { error: "Lenguaje no soportado" };
  }

  // 2. Create submission record in DB (processing state)
  const [newSubmission] = await db
    .insert(submissions)
    .values({
      activityId,
      studentId,
      lenguaje: language,
      codigoFuente: code,
      estado: "processing",
      resultado: [],
      puntuacion: 0,
    })
    .returning();

  // 3. Return submission data and test case info for client-side execution
  return {
    success: true,
    submissionId: newSubmission.id,
    testCases: casosPrueba,
    languageId,
    tiempoLimite,
    memoriaLimite,
    activityId,
    courseId: activity.courseId,
    totalPoints: activity.puntuacionTotal,
  };
}

export async function getSubmissions(activityId: number) {
  const session = await auth();
  if (!session?.user) return [];

  const isTeacher =
    session.user.role === "teacher" || session.user.role === "admin";
  const userId = parseInt(session.user.id);

  const whereClause = isTeacher
    ? eq(submissions.activityId, activityId)
    : eq(submissions.studentId, userId); // Students only see their own

  // Note: We might need to join with users to get student names for teachers
  // But for now let's just return the submissions

  const subs = await db.query.submissions.findMany({
    where: (submissions, { and, eq }) =>
      and(
        eq(submissions.activityId, activityId),
        isTeacher ? undefined : eq(submissions.studentId, userId)
      ),
    with: {
      student: true,
    },
    orderBy: (submissions, { desc }) => [desc(submissions.createdAt)],
  });

  return subs;
}
