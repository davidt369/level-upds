"use server";

import { db } from "@/db/client";
import { submissions, grades } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

export async function updateSubmissionResults(
    submissionId: number,
    results: any[],
    totalPoints: number,
    activityId: number,
    courseId: number
) {
    const session = await auth();
    if (!session?.user) {
        return { error: "No autorizado" };
    }

    const studentId = parseInt(session.user.id);

    // Calculate score
    const passedCases = results.filter((r) => r.status === "Accepted").length;
    const totalCases = results.length;
    const score = Math.round((passedCases / totalCases) * totalPoints);
    const finalStatus = passedCases === totalCases ? "completed" : "partial";

    // Update submission
    await db
        .update(submissions)
        .set({
            resultado: results,
            estado: finalStatus,
            puntuacion: score,
        })
        .where(eq(submissions.id, submissionId));

    // Update or Create Grade
    const existingGrade = await db.query.grades.findFirst({
        where: and(
            eq(grades.studentId, studentId),
            eq(grades.activityId, activityId)
        ),
    });

    if (existingGrade) {
        // Only update if score is higher
        if (score > existingGrade.score) {
            await db
                .update(grades)
                .set({
                    score,
                    submissionId,
                    verdict: finalStatus === "completed" ? "passed" : "failed",
                })
                .where(eq(grades.id, existingGrade.id));
        }
    } else {
        await db.insert(grades).values({
            studentId,
            activityId,
            courseId,
            submissionId,
            score,
            verdict: finalStatus === "completed" ? "passed" : "failed",
        });
    }

    revalidatePath(`/dashboard/courses/${courseId}/activities/${activityId}`);

    return {
        success: true,
        score,
        status: finalStatus,
    };
}
