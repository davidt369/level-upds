import { getActivityDetails } from "@/actions/activity-actions";
import { getSubmissions } from "@/actions/submission-actions";
import { ProgrammingActivityView } from "@/components/activities/programming-activity-view";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { db } from "@/db/client";
import { grades } from "@/db/schema";
import { eq, and } from "drizzle-orm";

export default async function ActivityPage({ params }: { params: Promise<{ courseId: string; activityId: string }> }) {
    const { courseId, activityId } = await params;
    const session = await auth();

    if (!session) {
        redirect("/auth/login");
    }

    const activity = await getActivityDetails(parseInt(activityId));

    if (!activity) {
        return <div>Actividad no encontrada</div>;
    }

    const submissions = await getSubmissions(parseInt(activityId));

    // Check if user has already passed this activity
    const existingGrade = await db.query.grades.findFirst({
        where: and(
            eq(grades.studentId, parseInt(session.user.id)),
            eq(grades.activityId, parseInt(activityId))
        )
    });

    const isCompleted = existingGrade?.verdict === 'passed';

    if (activity.tipo === 'code') {
        return (
            <div className="h-[calc(100vh-9rem)]">
                <ProgrammingActivityView
                    activity={activity}
                    submissions={submissions}
                    isCompleted={isCompleted}
                />
            </div>
        );
    }

    return (
        <div className="container mx-auto py-6">
            <h1 className="text-2xl font-bold">{activity.titulo}</h1>
            <div className="mt-4 prose dark:prose-invert">
                {activity.descripcion}
            </div>
            {/* Theory activity view implementation would go here */}
        </div>
    );
}
