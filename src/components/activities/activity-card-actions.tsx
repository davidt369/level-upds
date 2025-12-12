"use client";

import { ActivityDialog } from "./create-activity-dialog";
import { deleteActivity } from "@/actions/activity-actions";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
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
import { MoreVertical, Pencil, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { checkIsExpired } from "@/lib/utils";

interface ActivityCardActionsProps {
    activity: any;
    isCourseExpired?: boolean;
    isAdmin?: boolean;
}

export function ActivityCardActions({ activity, isCourseExpired, isAdmin }: ActivityCardActionsProps) {
    const isActivityExpired = checkIsExpired(activity.fechaLimite);
    // If Admin, never expired effectively for UI actions.
    // Edit: Allowed unless course is expired (Activity expiry shouldn't block edit, e.g. to extend time).
    const canEdit = isAdmin || !isCourseExpired;
    // Delete: Allowed only if neither course nor activity is expired (as per user request "no puedo eliminar").
    const canDelete = isAdmin || (!isCourseExpired && !isActivityExpired);
    const [editOpen, setEditOpen] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);

    const handleDelete = async () => {
        const result = await deleteActivity(activity.id);
        if (result.error) {
            toast.error(result.error);
        } else {
            toast.success(result.success);
        }
        setDeleteOpen(false);
    };

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Abrir menú</span>
                        <MoreVertical className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuItem
                        onClick={(e) => {
                            if (!canEdit) e.preventDefault();
                            else setEditOpen(true);
                        }}
                        disabled={!canEdit}
                    >
                        <Pencil className="mr-2 h-4 w-4" /> {canEdit ? "Editar" : "Curso Finalizado"}
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        className={canDelete ? "text-red-600 focus:text-red-600" : ""}
                        onClick={(e) => {
                            if (!canDelete) e.preventDefault();
                            else setDeleteOpen(true);
                        }}
                        disabled={!canDelete}
                    >
                        <Trash2 className="mr-2 h-4 w-4" /> {canDelete ? "Eliminar" : "Finalizada"}
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            <ActivityDialog
                activityToEdit={activity}
                open={editOpen}
                onOpenChange={setEditOpen}
            />

            <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>¿Juras que quieres eliminar esto?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Esta acción eliminará la actividad y todas las entregas de los estudiantes asociadas.
                            No se puede deshacer.
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
}
