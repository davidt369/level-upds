"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarIcon, User } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { enrollInCourse, unenrollFromCourse } from "@/actions/course-actions";
import { toast } from "sonner";
import { useTransition } from "react";
import { parseDate } from "@/lib/utils";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface CourseCardProps {
    course: any;
    isEnrolled?: boolean;
}

export function CourseCard({ course, isEnrolled = false }: CourseCardProps) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();

    const handleEnroll = () => {
        startTransition(async () => {
            const result = await enrollInCourse(course.id);
            if (result.error) {
                toast.error(result.error);
            } else {
                toast.success(result.success);
                router.refresh();
            }
        });
    };

    const handleUnenroll = () => {
        startTransition(async () => {
            const result = await unenrollFromCourse(course.id);
            if (result.error) {
                toast.error(result.error);
            } else {
                toast.success(result.success);
                router.refresh();
            }
        });
    };

    const startDate = parseDate(course.fechaInicio);

    return (
        <Card className="flex flex-col h-full">
            <CardHeader>
                <div className="flex justify-between items-start">
                    <CardTitle className="text-xl">{course.nombre}</CardTitle>
                    <Badge variant={isEnrolled ? "secondary" : "default"}>
                        {isEnrolled ? "Inscrito" : "Disponible"}
                    </Badge>
                </div>
                <CardDescription className="line-clamp-2">
                    {course.descripcion || "Sin descripción"}
                </CardDescription>
            </CardHeader>
            <CardContent className="flex-1">
                <div className="space-y-2 text-sm text-muted-foreground">
                    <div className="flex items-center">
                        <User className="mr-2 h-4 w-4" />
                        <span>Docente: {course.docenteName || "Desconocido"}</span>
                    </div>
                    <div className="flex items-center">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        <span>Inicio: {startDate ? format(startDate, "PPP", { locale: es }) : "Por definir"}</span>
                    </div>
                </div>
            </CardContent>
            <CardFooter>
                {isEnrolled ? (
                    <div className="flex gap-2 w-full">
                        <Button className="flex-1" variant="outline" asChild>
                            <Link href={`/dashboard/courses/${course.id}`}>Ver Contenido</Link>
                        </Button>
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button
                                    className="flex-1"
                                    variant="destructive"
                                    disabled={isPending}
                                >
                                    {isPending ? "..." : "Salir"}
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        Esta acción cancelará tu inscripción al curso. Podrás volver a inscribirte más tarde si hay plazas disponibles.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                    <AlertDialogAction onClick={handleUnenroll}>Continuar</AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </div>
                ) : (
                    <Button className="w-full" onClick={handleEnroll} disabled={isPending}>
                        {isPending ? "Inscribiendo..." : "Inscribirse"}
                    </Button>
                )}
            </CardFooter>
        </Card>
    );
}
