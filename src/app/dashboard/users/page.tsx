import { getUsers } from "@/actions/user-actions";
import { columns } from "@/components/users/columns";
import { DataTable } from "@/components/users/data-table";
import { UserDialog } from "@/components/users/user-dialog";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function UsersPage() {
    const session = await auth();

    if (session?.user?.role !== "admin") {
        redirect("/dashboard");
    }

    const users = await getUsers();

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold tracking-tight">Gestión de Usuarios</h2>
                <UserDialog />
            </div>
            <DataTable
                columns={columns}
                data={users}
                filterColumn="role"
                filterOptions={[
                    { label: "Estudiante", value: "student" },
                    { label: "Profesor", value: "teacher" },
                    { label: "Administrador", value: "admin" },
                ]}
            />
        </div>
    );
}
