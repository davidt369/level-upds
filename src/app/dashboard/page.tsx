import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { getStudentDashboard, getTeacherDashboard } from "@/actions/dashboard-actions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { BookOpen, CheckCircle, Clock, GraduationCap, Users, Calendar } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function DashboardPage() {
    const session = await auth();
    const role = session?.user?.role;

    if (role === "admin") {
        redirect("/dashboard/users");
    }

    if (role === "student") {
        const studentData = await getStudentDashboard();
        if (!studentData) return <div>Error cargando dashboard</div>;

        return <StudentDashboardView data={studentData} userName={session?.user?.name} />;
    }

    if (role === "teacher") {
        const teacherData = await getTeacherDashboard();
        if (!teacherData) return <div>Error cargando dashboard</div>;

        return <TeacherDashboardView data={teacherData} userName={session?.user?.name} />;
    }

    return <div>Rol no reconocido</div>;
}

function StudentDashboardView({ data, userName }: { data: any, userName?: string | null }) {
    const { stats, upcomingActivities } = data;

    return (
        <div className="space-y-8">
            <div>
                <h2 id="dashboard-welcome" className="text-3xl font-bold tracking-tight">¡Hola, {userName?.split(' ')[0]}!</h2>
                <p className="text-muted-foreground">Aquí tienes un resumen de tu progreso.</p>
            </div>

            {/* Stats Cards */}
            <div id="student-stats" className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Cursos Inscritos</CardTitle>
                        <BookOpen className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.enrolledCourses}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Actividades Completadas</CardTitle>
                        <CheckCircle className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.completedActivities}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Promedio General</CardTitle>
                        <GraduationCap className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.averageScore} pts</div>
                    </CardContent>
                </Card>
            </div>

            {/* Upcoming Deadlines */}
            <div id="upcoming-deadlines" className="space-y-4">
                <h3 className="text-xl font-semibold flex items-center gap-2">
                    <Clock className="h-5 w-5 text-yellow-600" />
                    Vencen Pronto
                </h3>
                {upcomingActivities.length === 0 ? (
                    <Card className="bg-muted/50 border-dashed">
                        <CardContent className="py-8 text-center text-muted-foreground">
                            No tienes actividades pendientes próximas a vencer. ¡Bien hecho!
                        </CardContent>
                    </Card>
                ) : (
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {upcomingActivities.map((activity: any) => (
                            <Card key={activity.id} className="hover:shadow-md transition-shadow border-l-4 border-l-yellow-500">
                                <CardHeader className="pb-2">
                                    <div className="flex justify-between items-start">
                                        <CardTitle className="text-base line-clamp-1">{activity.titulo}</CardTitle>
                                    </div>
                                    <p className="text-xs text-muted-foreground line-clamp-1">{activity.courseName}</p>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                                        <Calendar className="h-4 w-4" />
                                        <span>
                                            {format(new Date(activity.fechaLimite), "PPP", { locale: es })}
                                        </span>
                                    </div>
                                    <Button asChild size="sm" className="w-full">
                                        <Link href={`/dashboard/courses/${activity.courseId}/activities/${activity.id}`}>
                                            Resolver Ahora
                                        </Link>
                                    </Button>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

function TeacherDashboardView({ data, userName }: { data: any, userName?: string | null }) {
    const { stats, recentActivities } = data;

    return (
        <div className="space-y-8">
            <div>
                <h2 id="teacher-welcome" className="text-3xl font-bold tracking-tight">Bienvenido, Profe {userName?.split(' ')[0]}</h2>
                <p className="text-muted-foreground">Gestión académica y seguimiento.</p>
            </div>

            {/* Stats Cards */}
            <div id="teacher-stats" className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Cursos Activos</CardTitle>
                        <BookOpen className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.activeCourses}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Estudiantes</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.totalStudents}</div>
                    </CardContent>
                </Card>
            </div>

            {/* Recent Activities */}
            <div id="recent-activities" className="space-y-4">
                <h3 className="text-xl font-semibold">Actividades Creadas Recientemente</h3>
                <div className="rounded-md border bg-card">
                    {recentActivities.map((activity: any, index: number) => (
                        <div key={activity.id} className={`p-4 flex justify-between items-center ${index !== recentActivities.length - 1 ? 'border-b' : ''}`}>
                            <div>
                                <p className="font-medium">{activity.titulo}</p>
                                <p className="text-sm text-muted-foreground">{activity.courseName}</p>
                            </div>
                            <div className="text-sm text-muted-foreground">
                                {format(new Date(activity.createdAt), "dd MMM yyyy", { locale: es })}
                            </div>
                        </div>
                    ))}
                    {recentActivities.length === 0 && (
                        <div className="p-8 text-center text-muted-foreground">
                            No has creado actividades recientemente.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
