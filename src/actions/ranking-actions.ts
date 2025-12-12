"use server";

import { db } from "@/db/client";
import { users, grades, enrollments } from "@/db/schema";
import { desc, eq, sql, and } from "drizzle-orm";
import { auth } from "@/auth";

export interface RankingEntry {
    userId: number;
    userName: string;
    email: string;
    totalScore: number;
    activitiesCompleted: number;
    position: number;
}

export async function getGlobalRanking(limit = 10): Promise<RankingEntry[]> {
    try {
        // Aggregate sum of scores from all grades grouped by user
        const ranking = await db
            .select({
                userId: users.id,
                userName: users.name,
                email: users.email,
                // Use coalesce to handle users with no grades (null sum)
                totalScore: sql<number>`coalesce(sum(${grades.score}), 0)`,
                activitiesCompleted: sql<number>`count(${grades.id})`,
            })
            .from(users)
            .leftJoin(grades, eq(users.id, grades.studentId))
            .where(eq(users.role, "student")) // Filter only students
            .groupBy(users.id, users.name, users.email)
            .orderBy(sql`coalesce(sum(${grades.score}), 0) desc`)
            .limit(limit);

        // Map to add position
        return ranking.map((entry, index) => ({
            ...entry,
            totalScore: Number(entry.totalScore),
            activitiesCompleted: Number(entry.activitiesCompleted),
            position: index + 1,
        }));
    } catch (error) {
        console.error("Error fetching global ranking:", error);
        return [];
    }
}

export async function getCourseRanking(
    courseId: number,
    limit = 20
): Promise<RankingEntry[]> {
    try {
        // Aggregate sum of scores but only for a specific course
        // We first select all enrolled students, then join their grades for this course

        const ranking = await db
            .select({
                userId: users.id,
                userName: users.name,
                email: users.email,
                totalScore: sql<number>`coalesce(sum(${grades.score}), 0)`,
                activitiesCompleted: sql<number>`count(${grades.id})`,
            })
            .from(users)
            .innerJoin(enrollments, eq(users.id, enrollments.userId)) // Ensure enrolled
            .leftJoin(
                grades,
                and(
                    eq(users.id, grades.studentId),
                    eq(grades.courseId, courseId)
                )
            )
            .where(eq(enrollments.courseId, courseId))
            .groupBy(users.id, users.name, users.email)
            .orderBy(sql`coalesce(sum(${grades.score}), 0) desc`)
            .limit(limit);

        return ranking.map((entry, index) => ({
            ...entry,
            totalScore: Number(entry.totalScore),
            activitiesCompleted: Number(entry.activitiesCompleted),
            position: index + 1,
        }));
    } catch (error) {
        console.error("Error fetching course ranking:", error);
        return [];
    }
}
