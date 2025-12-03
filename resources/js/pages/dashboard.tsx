import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import Can from '@/components/can';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { Head, usePage } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
    },
];

export default function Dashboard() {
    const { auth } = usePage<{ auth: { user: { name: string } } }>().props;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                {/* Saludo personalizado - visible para todos */}
                <div className="mb-4">
                    <h1 className="text-3xl font-bold">
                        ¡Bienvenido, {auth.user.name}!
                    </h1>
                    <p className="text-muted-foreground mt-1">
                        Este es tu panel de control principal
                    </p>
                </div>

                {/* Tarjetas de estadísticas - diferentes para cada rol */}
                <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                    {/* Panel de Administrador */}
                    <Can role="admin">
                        <div className="relative aspect-video overflow-hidden rounded-xl border border-red-500 bg-red-50 dark:bg-red-950/20 p-6">
                            <div className="relative z-10">
                                <h3 className="text-lg font-semibold text-red-900 dark:text-red-100">
                                    Panel de Admin
                                </h3>
                                <p className="text-sm text-red-700 dark:text-red-300 mt-2">
                                    Gestiona usuarios y configuraciones
                                </p>
                                <a 
                                    href="/admin/users" 
                                    className="mt-4 inline-block bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
                                >
                                    Ir a Gestión
                                </a>
                            </div>
                            <PlaceholderPattern className="absolute inset-0 size-full stroke-red-900/10 dark:stroke-red-100/10" />
                        </div>
                    </Can>

                    {/* Panel de Profesor */}
                    <Can role="teacher">
                        <div className="relative aspect-video overflow-hidden rounded-xl border border-blue-500 bg-blue-50 dark:bg-blue-950/20 p-6">
                            <div className="relative z-10">
                                <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100">
                                    Crear Problemas
                                </h3>
                                <p className="text-sm text-blue-700 dark:text-blue-300 mt-2">
                                    Diseña nuevos ejercicios y evaluaciones
                                </p>
                                <a 
                                    href="/teacher/problems/create" 
                                    className="mt-4 inline-block bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                                >
                                    Nuevo Problema
                                </a>
                            </div>
                            <PlaceholderPattern className="absolute inset-0 size-full stroke-blue-900/10 dark:stroke-blue-100/10" />
                        </div>
                    </Can>

                    {/* Panel de Estudiante */}
                    <Can role="student">
                        <div className="relative aspect-video overflow-hidden rounded-xl border border-green-500 bg-green-50 dark:bg-green-950/20 p-6">
                            <div className="relative z-10">
                                <h3 className="text-lg font-semibold text-green-900 dark:text-green-100">
                                    Mi Progreso
                                </h3>
                                <p className="text-sm text-green-700 dark:text-green-300 mt-2">
                                    Revisa tus estadísticas y logros
                                </p>
                                <a 
                                    href="/student/progress" 
                                    className="mt-4 inline-block bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
                                >
                                    Ver Progreso
                                </a>
                            </div>
                            <PlaceholderPattern className="absolute inset-0 size-full stroke-green-900/10 dark:stroke-green-100/10" />
                        </div>
                    </Can>

                    {/* Tarjetas universales - visibles para todos */}
                    <div className="relative aspect-video overflow-hidden rounded-xl border border-sidebar-border/70 dark:border-sidebar-border p-6">
                        <div className="relative z-10">
                            <h3 className="text-lg font-semibold">
                                Problemas Disponibles
                            </h3>
                            <p className="text-sm text-muted-foreground mt-2">
                                Explora todos los desafíos
                            </p>
                            <a 
                                href="/problems" 
                                className="mt-4 inline-block bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 transition-colors"
                            >
                                Ver Problemas
                            </a>
                        </div>
                        <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
                    </div>

                    <div className="relative aspect-video overflow-hidden rounded-xl border border-sidebar-border/70 dark:border-sidebar-border p-6">
                        <div className="relative z-10">
                            <h3 className="text-lg font-semibold">
                                Mi Perfil
                            </h3>
                            <p className="text-sm text-muted-foreground mt-2">
                                Actualiza tu información
                            </p>
                            <a 
                                href="/profile" 
                                className="mt-4 inline-block bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 transition-colors"
                            >
                                Editar Perfil
                            </a>
                        </div>
                        <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
                    </div>
                </div>

                {/* Área de contenido principal */}
                <div className="relative min-h-[100vh] flex-1 overflow-hidden rounded-xl border border-sidebar-border/70 md:min-h-min dark:border-sidebar-border p-6">
                    <div className="relative z-10 space-y-6">
                        <h2 className="text-2xl font-semibold">Contenido Específico por Rol</h2>

                        {/* Contenido exclusivo para Administradores */}
                        <Can role="admin">
                            <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-lg p-6">
                                <h3 className="text-xl font-semibold text-red-900 dark:text-red-100 mb-3">
                                    📊 Estadísticas del Sistema (Admin)
                                </h3>
                                <ul className="space-y-2 text-red-800 dark:text-red-200">
                                    <li>• Total de usuarios: (Aquí irían los datos reales)</li>
                                    <li>• Problemas creados: (Aquí irían los datos reales)</li>
                                    <li>• Actividad reciente: (Aquí irían los datos reales)</li>
                                </ul>
                            </div>
                        </Can>

                        {/* Contenido exclusivo para Profesores */}
                        <Can role="teacher">
                            <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
                                <h3 className="text-xl font-semibold text-blue-900 dark:text-blue-100 mb-3">
                                    📝 Mis Problemas Creados (Teacher)
                                </h3>
                                <p className="text-blue-800 dark:text-blue-200">
                                    Lista de problemas que has creado y estadísticas de resolución...
                                </p>
                            </div>
                        </Can>

                        {/* Contenido exclusivo para Estudiantes */}
                        <Can role="student">
                            <div className="bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-lg p-6">
                                <h3 className="text-xl font-semibold text-green-900 dark:text-green-100 mb-3">
                                    🎯 Mis Últimos Intentos (Student)
                                </h3>
                                <p className="text-green-800 dark:text-green-200">
                                    Historial de tus últimas soluciones enviadas...
                                </p>
                            </div>
                        </Can>

                        {/* Contenido visible para todos los roles */}
                        <div className="bg-neutral-50 dark:bg-neutral-950/20 border border-neutral-200 dark:border-neutral-800 rounded-lg p-6">
                            <h3 className="text-xl font-semibold mb-3">
                                🌟 Anuncios Generales
                            </h3>
                            <p className="text-muted-foreground">
                                Este contenido es visible para todos los usuarios autenticados, 
                                independientemente de su rol.
                            </p>
                        </div>

                        {/* Ejemplo de contenido basado en múltiples roles */}
                        <Can role={["admin", "teacher"]}>
                            <div className="bg-purple-50 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-800 rounded-lg p-6">
                                <h3 className="text-xl font-semibold text-purple-900 dark:text-purple-100 mb-3">
                                    👥 Panel de Gestión (Admin & Teacher)
                                </h3>
                                <p className="text-purple-800 dark:text-purple-200">
                                    Este contenido solo es visible para administradores y profesores.
                                </p>
                            </div>
                        </Can>
                    </div>
                    <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
                </div>
            </div>
        </AppLayout>
    );
}
