import { getStudentCourses, getAvailableCourses } from "@/actions/course-actions";
import { CourseCard } from "@/components/courses/course-card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default async function MyCoursesPage() {
    const myCourses = await getStudentCourses();
    const availableCourses = await getAvailableCourses();

    // Filter out courses that the student is already enrolled in from the available list
    const enrolledIds = new Set(myCourses.map(c => c.id));
    const notEnrolledCourses = availableCourses.filter(c => !enrolledIds.has(c.id));

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Mis Cursos</h2>
                <p className="text-muted-foreground">Accede a tus cursos y explora nuevos.</p>
            </div>

            <Tabs defaultValue="my-courses" className="w-full">
                <TabsList>
                    <TabsTrigger value="my-courses">Mis Inscripciones</TabsTrigger>
                    <TabsTrigger value="available">Disponibles</TabsTrigger>
                </TabsList>
                <TabsContent value="my-courses" className="mt-6">
                    {myCourses.length > 0 ? (
                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                            {myCourses.map((course) => (
                                <CourseCard key={course.id} course={course} isEnrolled={true} />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-10 text-muted-foreground">
                            No estás inscrito en ningún curso aún.
                        </div>
                    )}
                </TabsContent>
                <TabsContent value="available" className="mt-6">
                    {notEnrolledCourses.length > 0 ? (
                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                            {notEnrolledCourses.map((course) => (
                                <CourseCard key={course.id} course={course} isEnrolled={false} />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-10 text-muted-foreground">
                            No hay nuevos cursos disponibles por el momento.
                        </div>
                    )}
                </TabsContent>
            </Tabs>
        </div>
    )
}
