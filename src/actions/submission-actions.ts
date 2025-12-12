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
import {
  JUDGE0_LANGUAGE_IDS,
  createSubmission,
  getSubmissionResult,
  Judge0Response,
} from "@/lib/judge0";
import { revalidatePath } from "next/cache";
import { checkIsExpired } from "@/lib/utils";

// Helper to delay execution
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

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
  const now = new Date();

  // Need to fetch course to check fechaFin
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

  // 2. Create submission record in DB (pending state)
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
    .returning({ id: submissions.id });

  try {
    const results: any[] = [];
    let passedCases = 0;
    const totalCases = (casosPrueba as any[]).length;

    // 3. Execute each test case against Judge0
    // Note: In a production env, this should be a background job or use Judge0 batch submission
    for (const testCase of casosPrueba as any[]) {
      const token = await createSubmission({
        source_code: code,
        language_id: languageId,
        stdin: testCase.input,
        expected_output: testCase.expected,
        cpu_time_limit: tiempoLimite ? tiempoLimite / 1000 : 2, // Convert ms to seconds
        // memory_limit: memoriaLimite // Judge0 usually expects KB, check API docs.
      });

      // Poll for result
      let result: Judge0Response | null = null;
      let attempts = 0;
      while (attempts < 10) {
        await delay(1000); // Wait 1s
        const res = await getSubmissionResult(token);
        if (res.status.id >= 3) {
          // 3+ means finished (Accepted, WA, Error, etc.)
          result = res;
          break;
        }
        attempts++;
      }

      if (!result) {
        results.push({ status: "Timeout", message: "Judge0 polling timeout" });
        continue;
      }

      // Check if passed
      // Status ID 3 is Accepted
      const isAccepted = result.status.id === 3;
      if (isAccepted) passedCases++;

      results.push({
        input: testCase.input,
        expected: testCase.expected,
        actual: result.stdout,
        status: result.status.description,
        time: result.time,
        memory: result.memory,
        stderr: result.stderr,
        compile_output: result.compile_output,
      });
    }

    // 4. Calculate score
    const score = Math.round(
      (passedCases / totalCases) * activity.puntuacionTotal
    );
    const finalStatus = passedCases === totalCases ? "completed" : "partial";

    // 5. Update submission
    await db
      .update(submissions)
      .set({
        resultado: results,
        estado: finalStatus,
        puntuacion: score,
      })
      .where(eq(submissions.id, newSubmission.id));

    // 6. Update or Create Grade
    // Check if grade exists
    const existingGrade = await db.query.grades.findFirst({
      where: (grades, { and, eq }) =>
        and(eq(grades.studentId, studentId), eq(grades.activityId, activityId)),
    });

    if (existingGrade) {
      // Only update if score is higher
      if (score > existingGrade.score) {
        await db
          .update(grades)
          .set({
            score,
            submissionId: newSubmission.id,
            verdict: finalStatus === "completed" ? "passed" : "failed",
          })
          .where(eq(grades.id, existingGrade.id));
      }
    } else {
      await db.insert(grades).values({
        studentId,
        activityId,
        courseId: activity.courseId,
        submissionId: newSubmission.id,
        score,
        verdict: finalStatus === "completed" ? "passed" : "failed",
      });
    }

    revalidatePath(
      `/dashboard/courses/${activity.courseId}/activities/${activityId}`
    );
    return {
      success: true,
      submissionId: newSubmission.id,
      submission: {
        id: newSubmission.id,
        estado: finalStatus,
        puntuacion: score,
        resultado: results,
        lenguaje: language,
        codigoFuente: code,
        // formatted date for immediate display if needed, but not strictly required by the view usually
        createdAt: new Date(),
      }
    };
  } catch (error) {
    console.error("Submission error:", error);
    await db
      .update(submissions)
      .set({
        estado: "error",
        resultado: [{ error: "Internal Server Error during evaluation" }],
      })
      .where(eq(submissions.id, newSubmission.id));

    return { error: "Error procesando el envío" };
  }
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
