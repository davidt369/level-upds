"use server";

import { db } from "@/db/client";
import { activities, courses, enrollments, grades, submissions, users } from "@/db/schema";
import { auth } from "@/auth";
import { eq, and, desc, count, gt, isNull, sql } from "drizzle-orm";

export async function getStudentDashboard() {
    const session = await auth();
    if (!session?.user?.id) return null;
    const userId = parseInt(session.user.id);

    try {
        // 1. Get statistics
        const [enrolledCount] = await db
            .select({ count: count() })
            .from(enrollments)
            .where(eq(enrollments.userId, userId));

        const [completedCount] = await db
            .select({ count: count() })
            .from(grades)
            .where(eq(grades.studentId, userId));

        // Average score
        const [avgScoreResult] = await db
            .select({ avg: sql<number>`avg(${grades.score})` })
            .from(grades)
            .where(eq(grades.studentId, userId));

        const avgScore = avgScoreResult?.avg ? Math.round(Number(avgScoreResult.avg)) : 0;

        // 2. Get activities ending soon (pending only)
        // Find activities in enrolled courses, where user has NO grade, and deadline is future
        const now = new Date();

        const activitiesEndingSoon = await db
            .select({
                id: activities.id,
                titulo: activities.titulo,
                courseName: courses.nombre,
                fechaLimite: activities.fechaLimite,
                tipo: activities.tipo,
                courseId: courses.id
            })
            .from(activities)
            .innerJoin(courses, eq(activities.courseId, courses.id))
            .innerJoin(enrollments, and(
                eq(courses.id, enrollments.courseId),
                eq(enrollments.userId, userId)
            ))
            .leftJoin(grades, and(
                eq(activities.id, grades.activityId),
                eq(grades.studentId, userId)
            ))
            .where(and(
                isNull(grades.id), // No grade yet
                gt(activities.fechaLimite, now) // Future deadline
            ))
            .orderBy(activities.fechaLimite)
            .limit(5);

        return {
            stats: {
                enrolledCourses: enrolledCount.count,
                completedActivities: completedCount.count,
                averageScore: avgScore
            },
            upcomingActivities: activitiesEndingSoon
        };
    } catch (error) {
        console.error("Error fetching student dashboard:", error);
        return null;
    }
}

export async function getTeacherDashboard() {
    const session = await auth();
    if (!session?.user?.id) return null;
    const teacherId = parseInt(session.user.id);

    try {
        // 1. Active Courses count
        const [coursesCount] = await db
            .select({ count: count() })
            .from(courses)
            .where(eq(courses.docenteId, teacherId));

        // 2. Total Students enrolled in teacher's courses
        const [studentsCount] = await db
            .select({ count: count() })
            .from(enrollments)
            .innerJoin(courses, eq(enrollments.courseId, courses.id))
            .where(eq(courses.docenteId, teacherId));

        // 3. Recent activities created
        const recentActivities = await db
            .select({
                id: activities.id,
                titulo: activities.titulo,
                courseName: courses.nombre,
                createdAt: activities.createdAt
            })
            .from(activities)
            .innerJoin(courses, eq(activities.courseId, courses.id))
            .where(eq(courses.docenteId, teacherId))
            .orderBy(desc(activities.createdAt))
            .limit(5);

        return {
            stats: {
                activeCourses: coursesCount.count,
                totalStudents: studentsCount.count,
            },
            recentActivities
        };
    } catch (error) {
        console.error("Error fetching teacher dashboard:", error);
        return null;
    }
}
