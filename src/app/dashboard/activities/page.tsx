import { getStudentActivities } from "@/actions/activity-actions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Calendar, CheckCircle2, Clock, Code, FileText, ArrowRight } from "lucide-react";
import Link from "next/link";

export const metadata = {
    title: "Mis Actividades | Level UPDS",
};

export default async function ActivitiesPage() {
    const activities = await getStudentActivities();

    const pendingActivities = activities.filter(a => a.gradeScore === null);
    const historyActivities = activities.filter(a => a.gradeScore !== null);

    return (
        <div className="space-y-6 container mx-auto py-6">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold tracking-tight">Mis Actividades</h1>
                <p className="text-muted-foreground">
                    Gestiona tus tareas pendientes y revisa tu historial de aprendizaje.
                </p>
            </div>

            <Tabs defaultValue="pending" className="w-full">
                <TabsList className="grid w-full grid-cols-2 lg:w-[400px]">
                    <TabsTrigger value="pending">Pendientes ({pendingActivities.length})</TabsTrigger>
                    <TabsTrigger value="history">Historial ({historyActivities.length})</TabsTrigger>
                </TabsList>

                <TabsContent value="pending" className="mt-6 space-y-4">
                    {pendingActivities.length === 0 ? (
                        <div className="text-center py-12 border rounded-lg border-dashed bg-muted/20">
                            <CheckCircle2 className="mx-auto h-12 w-12 text-primary/50" />
                            <h3 className="mt-4 text-lg font-semibold">¡Todo al día!</h3>
                            <p className="text-muted-foreground">No tienes actividades pendientes por ahora.</p>
                        </div>
                    ) : (
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                            {pendingActivities.map((activity) => (
                                <ActivityCard key={activity.id} activity={activity} />
                            ))}
                        </div>
                    )}
                </TabsContent>

                <TabsContent value="history" className="mt-6 space-y-4">
                    {historyActivities.length === 0 ? (
                        <div className="text-center py-12 border rounded-lg border-dashed text-muted-foreground">
                            Aún no has completado ninguna actividad.
                        </div>
                    ) : (
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                            {historyActivities.map((activity) => (
                                <ActivityCard key={activity.id} activity={activity} isHistory />
                            ))}
                        </div>
                    )}
                </TabsContent>
            </Tabs>
        </div>
    );
}

function ActivityCard({ activity, isHistory = false }: { activity: any, isHistory?: boolean }) {
    return (
        <Card className="flex flex-col h-full hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
                <div className="flex justify-between items-start gap-2">
                    <Badge variant={activity.tipo === 'code' ? 'default' : 'secondary'} className="mb-2">
                        {activity.tipo === 'code' ? 'Programación' : 'Teórica'}
                    </Badge>
                    {isHistory && (
                        <Badge
                            variant="secondary"
                            className={activity.gradeVerdict === 'passed'
                                ? "bg-green-100 text-green-800 hover:bg-green-200 border-transparent"
                                : "bg-red-100 text-red-800 hover:bg-red-200 border-transparent"
                            }
                        >
                            {activity.gradeVerdict === 'passed' ? 'Aprobado' : 'Fallido'}
                        </Badge>
                    )}
                </div>
                <CardTitle className="line-clamp-1">{activity.titulo}</CardTitle>
                <CardDescription className="line-clamp-1">{activity.courseName}</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 pb-3">
                <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                    {activity.description || "Sin descripción disponible."}
                </p>
                <div className="flex flex-col gap-2 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                        <TrophyIcon score={activity.puntuacionTotal} />
                        <span>Valor: {activity.puntuacionTotal} pts</span>
                    </div>
                    {activity.fechaLimite && (
                        <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4" />
                            <span>
                                {isHistory ? "Entregado el: " : "Vence: "}
                                {isHistory && activity.submittedAt
                                    ? format(new Date(activity.submittedAt), "PPP", { locale: es })
                                    : format(new Date(activity.fechaLimite), "PPP", { locale: es })
                                }
                            </span>
                        </div>
                    )}
                    {isHistory && (
                        <div className="mt-2 font-bold text-lg text-primary">
                            Nota: {activity.gradeScore}/{activity.puntuacionTotal}
                        </div>
                    )}
                </div>
            </CardContent>
            <CardFooter className="pt-0">
                <Button asChild className="w-full" variant={isHistory ? "outline" : "default"}>
                    <Link href={`/dashboard/courses/${activity.courseId}/activities/${activity.id}`}>
                        {isHistory ? "Ver Detalles" : "Comenzar Actividad"}
                        <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                </Button>
            </CardFooter>
        </Card>
    );
}

function TrophyIcon({ score }: { score: number }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-4 w-4"
        >
            <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
            <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
            <path d="M4 22h16" />
            <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
            <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
            <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
        </svg>
    )
}
