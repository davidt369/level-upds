import { getCourseActivities } from "@/actions/activity-actions";
import { getCourseRanking } from "@/actions/ranking-actions";
import { getCourseById } from "@/actions/course-actions";
import { ActivityDialog } from "@/components/activities/create-activity-dialog";
import { LeaderboardTable } from "@/components/rankings/leaderboard-table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Code, FileText, Calendar, Trophy } from "lucide-react";
import { auth } from "@/auth";
import Link from "next/link";
import { ActivityCardActions } from "@/components/activities/activity-card-actions";
import { checkIsExpired } from "@/lib/utils";

export default async function CourseDetailsPage({ params }: { params: Promise<{ courseId: string }> }) {
    const { courseId: courseIdStr } = await params;
    const courseId = parseInt(courseIdStr);

    // Fetch data in parallel
    const [activities, rankings, course] = await Promise.all([
        getCourseActivities(courseId),
        getCourseRanking(courseId),
        getCourseById(courseId)
    ]);

    const isCourseExpired = checkIsExpired(course?.fechaFin);

    const session = await auth();
    const isTeacher = session?.user?.role === "teacher" || session?.user?.role === "admin";
    const isAdmin = session?.user?.role === "admin";

    return (
        <div className="space-y-6">
            <div id="course-detail-header" className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Detalles del Curso</h2>
                    <p className="text-muted-foreground">Gestiona actividades y revisa el progreso.</p>
                </div>
                {/* Admin override: Pass !isCourseExpired if admin so they can see the button? 
                   Actually ActivityDialog disables internally based on isCourseExpired.
                   We should update ActivityDialog to accept isAdmin or handle it there.
                   For now, let's just pass isCourseExpired. The dialog is the one disabling the button.
                */}
                <div id="create-activity-button">
                    <ActivityDialog courseId={courseId} isCourseExpired={!!isCourseExpired && !isAdmin} />
                </div>
            </div>

            <Tabs id="course-tabs" defaultValue="content" className="w-full">
                <TabsList className="grid w-full grid-cols-2 lg:w-[400px]">
                    <TabsTrigger value="content">Contenido</TabsTrigger>
                    <TabsTrigger value="leaderboard">Ranking</TabsTrigger>
                </TabsList>

                <TabsContent value="content" className="mt-6">
                    <div className="grid gap-4">
                        {activities.length === 0 ? (
                            <div className="text-center py-10 text-muted-foreground border rounded-lg border-dashed">
                                No hay actividades creadas para este curso aún.
                            </div>
                        ) : (
                            activities.map((activity) => (
                                <Card key={activity.id}>
                                    <CardHeader className="pb-2">

                                        <div className="flex justify-between items-start">
                                            <div className="flex items-center gap-2">
                                                {activity.tipo === 'code' ?
                                                    <Code className="h-5 w-5 text-blue-500" /> :
                                                    <FileText className="h-5 w-5 text-green-500" />
                                                }
                                                <Link href={`/dashboard/courses/${courseId}/activities/${activity.id}`} className="hover:underline">
                                                    <CardTitle className="text-xl">{activity.titulo}</CardTitle>
                                                </Link>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Badge variant={activity.tipo === 'code' ? 'default' : 'secondary'}>
                                                    {activity.tipo === 'code' ? 'Programación' : 'Teórica'}
                                                </Badge>
                                                {isTeacher && (
                                                    <ActivityCardActions
                                                        activity={activity}
                                                        isCourseExpired={!!isCourseExpired}
                                                        isAdmin={isAdmin}
                                                    />
                                                )}
                                            </div>
                                        </div>
                                        <CardDescription className="line-clamp-2 mt-2">
                                            {activity.descripcion}
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="flex gap-4 text-sm text-muted-foreground mt-2">
                                            <div className="flex items-center gap-1">
                                                <Trophy className="h-4 w-4" />
                                                <span>{activity.puntuacionTotal} pts</span>
                                            </div>
                                            {activity.fechaLimite && (
                                                <div className="flex items-center gap-1">
                                                    <Calendar className="h-4 w-4" />
                                                    <span>Vence: {format(new Date(activity.fechaLimite), "PPP", { locale: es })}</span>
                                                </div>
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>
                            ))
                        )}
                    </div>
                </TabsContent>

                <TabsContent value="leaderboard" className="mt-6">
                    <Card id="course-leaderboard">
                        <CardHeader>
                            <CardTitle>Ranking del Curso</CardTitle>
                            <CardDescription>
                                Los estudiantes más destacados en este curso específico.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <LeaderboardTable data={rankings} type="Curso" />
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
