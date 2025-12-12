"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { format } from "date-fns";
import { toast } from "sonner";
import { es } from "date-fns/locale";
import { useState } from "react";
import { deleteCourse } from "@/actions/course-actions";
import { CourseDialog } from "./course-dialog";
import { EnrollmentDialog } from "./enrollment-dialog";
import { parseDate, checkIsExpired } from "@/lib/utils";
import Link from "next/link";

export type Course = {
    id: number;
    nombre: string;
    descripcion: string | null;
    estado: string;
    fechaInicio: string | null;
    fechaFin: string | null;
    createdAt: Date;
    docenteName?: string | null;
};

export const columns: ColumnDef<Course>[] = [
    {
        accessorKey: "nombre",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Nombre
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        cell: ({ row }) => {
            return (
                <Link href={`/dashboard/courses/${row.original.id}`} className="hover:underline font-medium">
                    {row.getValue("nombre")}
                </Link>
            )
        }
    },
    {
        accessorKey: "docenteName",
        header: "Docente",
        cell: ({ row }) => row.getValue("docenteName") || "Desconocido",
    },
    {
        accessorKey: "estado",
        header: "Estado",
        cell: ({ row }) => {
            const estado = row.getValue("estado") as string;
            return (
                <Badge variant={estado === "activo" ? "default" : "secondary"}>
                    {estado.charAt(0).toUpperCase() + estado.slice(1)}
                </Badge>
            );
        },
    },
    {
        accessorKey: "fechaInicio",
        header: "Fecha Inicio",
        cell: ({ row }) => {
            const dateStr = row.getValue("fechaInicio") as string;
            const date = parseDate(dateStr);
            return date ? format(date, "PPP", { locale: es }) : "-";
        },
    },
    {
        accessorKey: "fechaFin",
        header: "Fecha Fin",
        cell: ({ row }) => {
            const dateStr = row.getValue("fechaFin") as string;
            const date = parseDate(dateStr);
            return date ? format(date, "PPP", { locale: es }) : "-";
        },
    },
    {
        id: "actions",
        cell: ({ row }) => {
            const course = row.original;
            const [open, setOpen] = useState(false);
            const [showEnrollments, setShowEnrollments] = useState(false);
            const [deleteOpen, setDeleteOpen] = useState(false);

            const handleDelete = async () => {
                const result = await deleteCourse(course.id);
                if (result.error) {
                    toast.error(result.error);
                } else {
                    toast.success(result.success);
                }
                setDeleteOpen(false);
            };

            const isExpired = checkIsExpired(course.fechaFin);

            // Allow clicking delete, backend validates permissions
            const isDisabled = false;

            return (
                <>
                    <CourseDialog open={open} onOpenChange={setOpen} courseToEdit={course} />
                    <EnrollmentDialog
                        courseId={course.id}
                        open={showEnrollments}
                        onOpenChange={setShowEnrollments}
                        isExpired={!!isExpired}
                    />
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Abrir menú</span>
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                            <DropdownMenuItem onClick={() => setOpen(true)}>
                                <Pencil className="mr-2 h-4 w-4" /> Editar
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => setShowEnrollments(true)}>
                                Ver Estudiantes
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                                className="text-red-600 focus:text-red-600"
                                onClick={(e) => {
                                    setDeleteOpen(true);
                                }}
                            >
                                <Trash2 className="mr-2 h-4 w-4" /> Eliminar
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>

                    <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>¿Estás seguro absolumante?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    Esta acción no se puede deshacer. Eliminará permanentemente el curso
                                    y todos sus datos asociados, incluyendo actividades y calificaciones.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                <AlertDialogAction
                                    className="bg-red-600 hover:bg-red-700"
                                    onClick={handleDelete}
                                >
                                    Eliminar
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </>
            );
        },
    },
];
