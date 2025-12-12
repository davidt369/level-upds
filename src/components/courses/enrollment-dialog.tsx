"use client";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogClose,
} from "@/components/ui/dialog";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { useState, useEffect, useTransition } from "react";
import { getCourseEnrollments, manualEnrollStudent, searchStudentsNotEnrolled, removeStudentFromCourse } from "@/actions/course-actions";
import { toast } from "sonner";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Loader2, UserPlus, Trash2, Search, X, UserX, Calendar, Mail, User } from "lucide-react";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

interface EnrollmentDialogProps {
    courseId: number | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    isExpired?: boolean;
}

export function EnrollmentDialog({ courseId, open, onOpenChange, isExpired }: EnrollmentDialogProps) {
    const [students, setStudents] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [isEnrolling, startTransition] = useTransition();

    // Search state
    const [openCombobox, setOpenCombobox] = useState(false);
    const [searchResults, setSearchResults] = useState<any[]>([]);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        if (open && courseId) {
            loadStudents();
        }
    }, [open, courseId]);

    useEffect(() => {
        const delayDebounceFn = setTimeout(async () => {
            if (searchQuery.length > 1 && courseId) {
                const results = await searchStudentsNotEnrolled(courseId, searchQuery);
                setSearchResults(results);
            } else {
                setSearchResults([]);
            }
        }, 300);

        return () => clearTimeout(delayDebounceFn);
    }, [searchQuery, courseId]);

    async function loadStudents() {
        if (!courseId) return;
        setLoading(true);
        const data = await getCourseEnrollments(courseId);
        setStudents(data);
        setLoading(false);
    }

    const handleEnroll = (email: string) => {
        if (!courseId || !email) return;

        startTransition(async () => {
            const result = await manualEnrollStudent(courseId, email);
            if (result.error) {
                toast.error(result.error);
            } else {
                toast.success(result.success);
                setOpenCombobox(false);
                setSearchQuery("");
                loadStudents();
            }
        });
    };

    const handleRemove = (studentId: number) => {
        if (!courseId) return;

        // Optimistic update
        const studentToRemove = students.find(s => s.id === studentId);
        if (studentToRemove) {
            setStudents(prev => prev.filter(s => s.id !== studentId));
        }

        toast.promise(async () => {
            const result = await removeStudentFromCourse(courseId, studentId);
            if (result.error) {
                // Revert optimistic update on error
                if (studentToRemove) {
                    setStudents(prev => [...prev, studentToRemove].sort((a, b) => a.id - b.id));
                }
                throw new Error(result.error);
            }
            return result.success;
        }, {
            loading: 'Eliminando estudiante...',
            success: (data) => {
                return data;
            },
            error: (err) => {
                return err.message;
            },
        });
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[700px] p-0 gap-0 max-h-[90vh] flex flex-col">
                {/* Mobile Header */}
                <div className="lg:hidden sticky top-0 z-10 bg-background border-b px-4 py-3">
                    <div className="flex items-center justify-between">
                        <div>
                            <DialogTitle className="text-lg">Estudiantes Inscritos</DialogTitle>
                            <DialogDescription className="text-sm">
                                {students.length} estudiante{students.length !== 1 ? 's' : ''}
                            </DialogDescription>
                        </div>
                        <DialogClose asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                                <X className="h-4 w-4" />
                            </Button>
                        </DialogClose>
                    </div>
                </div>

                {/* Desktop Header */}
                <DialogHeader className="hidden lg:block px-6 pt-6">
                    <DialogTitle>Estudiantes Inscritos</DialogTitle>
                    <DialogDescription>
                        Gestiona los estudiantes inscritos en este curso.
                    </DialogDescription>
                </DialogHeader>

                {/* Search Section */}
                <div className="px-4 lg:px-6 pt-4 lg:pt-6">
                    <Popover open={openCombobox} onOpenChange={setOpenCombobox}>
                        <div className="relative">
                            <PopoverTrigger asChild>
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                                    <Button
                                        variant="outline"
                                        role="combobox"
                                        aria-expanded={openCombobox}
                                        className="w-full pl-10 pr-4 h-11 justify-start text-left font-normal"
                                        disabled={isExpired}
                                    >
                                        {searchQuery || (isExpired ? "Curso finalizado" : "Buscar estudiante...")}
                                    </Button>
                                </div>
                            </PopoverTrigger>
                            <PopoverContent
                                className="w-[calc(100vw-2rem)] sm:w-[400px] p-0 border-2"
                                align="start"
                                sideOffset={8}
                            >
                                <Command shouldFilter={false} className="rounded-lg">
                                    <div className="relative">
                                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                        <CommandInput
                                            placeholder="Buscar por email o nombre..."
                                            value={searchQuery}
                                            onValueChange={setSearchQuery}
                                            className="pl-10 h-12 border-b"
                                            autoFocus
                                        />
                                    </div>
                                    <CommandList className="max-h-[250px]">
                                        <CommandEmpty className="py-6 text-center text-muted-foreground">
                                            {searchQuery.length > 1 ? "No se encontraron estudiantes" : "Escribe para buscar"}
                                        </CommandEmpty>
                                        <CommandGroup>
                                            {searchResults.map((student) => (
                                                <CommandItem
                                                    key={student.id}
                                                    value={student.email}
                                                    onSelect={() => handleEnroll(student.email)}
                                                    className="py-3 px-4 cursor-pointer hover:bg-accent"
                                                >
                                                    <div className="flex items-center justify-between w-full">
                                                        <div className="flex flex-col flex-1 min-w-0">
                                                            <span className="font-medium truncate">{student.name}</span>
                                                            <span className="text-xs text-muted-foreground truncate">{student.email}</span>
                                                        </div>
                                                        <div className="flex items-center gap-2 ml-3">
                                                            {isEnrolling && <Loader2 className="h-4 w-4 animate-spin text-primary" />}
                                                            <UserPlus className="h-4 w-4 text-muted-foreground" />
                                                        </div>
                                                    </div>
                                                </CommandItem>
                                            ))}
                                        </CommandGroup>
                                    </CommandList>
                                </Command>
                            </PopoverContent>
                        </div>
                    </Popover>

                    {isExpired && (
                        <div className="mt-3 px-3 py-2 bg-yellow-50 border border-yellow-200 rounded-md">
                            <p className="text-sm text-yellow-800">
                                Curso finalizado. No se pueden inscribir nuevos alumnos.
                            </p>
                        </div>
                    )}
                </div>

                {/* Students List/Table */}
                <div className="flex-1 overflow-hidden px-4 lg:px-6 pb-4 lg:pb-6">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center h-full py-12">
                            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground mb-4" />
                            <p className="text-muted-foreground">Cargando estudiantes...</p>
                        </div>
                    ) : students.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full py-12">
                            <UserX className="h-12 w-12 text-muted-foreground mb-4" />
                            <h3 className="font-medium text-lg mb-2">No hay estudiantes inscritos</h3>
                            <p className="text-muted-foreground text-center max-w-sm">
                                {isExpired
                                    ? "Este curso ha finalizado y no tenía estudiantes inscritos."
                                    : "Comienza a inscribir estudiantes usando el buscador superior."
                                }
                            </p>
                        </div>
                    ) : (
                        <>
                            {/* Mobile Card List */}
                            <div className="lg:hidden space-y-3 overflow-y-auto h-full pb-2">
                                {students.map((student) => (
                                    <div
                                        key={student.id}
                                        className="border rounded-lg p-4 bg-card hover:bg-accent/50 transition-colors"
                                    >
                                        <div className="flex justify-between items-start mb-3">
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <User className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                                                    <h4 className="font-medium truncate">{student.name}</h4>
                                                </div>
                                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                    <Mail className="h-3 w-3 flex-shrink-0" />
                                                    <span className="truncate">{student.email}</span>
                                                </div>
                                            </div>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50 ml-2 flex-shrink-0"
                                                onClick={() => handleRemove(student.id)}
                                                disabled={isExpired}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                        <div className="flex items-center gap-2 text-xs text-muted-foreground pt-2 border-t">
                                            <Calendar className="h-3 w-3" />
                                            <span>
                                                {student.enrolledAt
                                                    ? format(new Date(student.enrolledAt), "dd/MM/yyyy", { locale: es })
                                                    : "Sin fecha"
                                                }
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Desktop Table */}
                            <div className="hidden lg:block border rounded-md overflow-hidden h-full">
                                <div className="overflow-auto h-full">
                                    <Table>
                                        <TableHeader className="sticky top-0 bg-background z-10">
                                            <TableRow>
                                                <TableHead className="w-1/3">Nombre</TableHead>
                                                <TableHead className="w-1/3">Email</TableHead>
                                                <TableHead className="w-1/4">Fecha Inscripción</TableHead>
                                                <TableHead className="w-[70px] text-right">Acciones</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {students.map((student) => (
                                                <TableRow key={student.id} className="hover:bg-accent/50">
                                                    <TableCell className="font-medium">
                                                        <div className="flex items-center gap-2">
                                                            <User className="h-4 w-4 text-muted-foreground" />
                                                            {student.name}
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="flex items-center gap-2">
                                                            <Mail className="h-4 w-4 text-muted-foreground" />
                                                            {student.email}
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="flex items-center gap-2">
                                                            <Calendar className="h-4 w-4 text-muted-foreground" />
                                                            {student.enrolledAt
                                                                ? format(new Date(student.enrolledAt), "dd MMM yyyy", { locale: es })
                                                                : "-"
                                                            }
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="text-right">
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50"
                                                            onClick={() => handleRemove(student.id)}
                                                            disabled={isExpired}
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </div>
                            </div>
                        </>
                    )}

                    {/* Student Count Badge */}
                    {!loading && students.length > 0 && (
                        <div className="mt-4 pt-3 border-t">
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-muted-foreground">
                                    Total: <span className="font-medium">{students.length}</span> estudiante{students.length !== 1 ? 's' : ''}
                                </span>
                                {isExpired && (
                                    <span className="text-sm text-muted-foreground">
                                        Solo lectura
                                    </span>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}