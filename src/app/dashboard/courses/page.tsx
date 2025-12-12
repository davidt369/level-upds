import { getTeacherCourses } from "@/actions/course-actions";
import { columns } from "@/components/courses/columns";
import { DataTable } from "@/components/users/data-table";
import { CourseDialog } from "@/components/courses/course-dialog";

export default async function CoursesPage() {
    const courses = await getTeacherCourses();

    return (
        <section className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Gestión de Cursos</h2>
                    <p className="text-muted-foreground">Crea y administra tus cursos.</p>
                </div>
                <CourseDialog />
            </div>

            <DataTable
                columns={columns}
                data={courses}
                filterColumn="estado"
                filterOptions={[
                    { label: "Activo", value: "activo" },
                    { label: "Inactivo", value: "inactivo" },
                    { label: "Archivado", value: "archivado" },
                ]}
            />
        </section>
    )
}
