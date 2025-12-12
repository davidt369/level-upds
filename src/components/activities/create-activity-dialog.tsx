"use client";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ActivityFormSchema } from "@/schemas/activity";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray } from "react-hook-form";
import { z } from "zod";
import { createActivity, updateActivity } from "@/actions/activity-actions";
import { toast } from "sonner";
import { useState, useEffect } from "react";
import { Plus, CalendarIcon, Trash2, Code, FileText, Loader2, Pencil } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { es } from "date-fns/locale";

interface ActivityDialogProps {
    courseId?: number; // Optional if editing, but usually needed for create
    activityToEdit?: any;
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
    isCourseExpired?: boolean;
}

export function ActivityDialog({ courseId, activityToEdit, open: controlledOpen, onOpenChange, isCourseExpired }: ActivityDialogProps) {
    const [internalOpen, setInternalOpen] = useState(false);
    const isControlled = controlledOpen !== undefined;
    const open = isControlled ? controlledOpen : internalOpen;
    const setOpen = isControlled ? onOpenChange! : setInternalOpen;

    const form = useForm<z.infer<typeof ActivityFormSchema>>({
        resolver: zodResolver(ActivityFormSchema) as any,
        defaultValues: {
            titulo: "",
            descripcion: "",
            tipo: "theory",
            puntuacionTotal: 100,
            lenguaje: "javascript",
            tiempoLimite: 1000,
            memoriaLimite: 262144,
            casosPrueba: [{ input: "", expected: "" }],
        },
    });

    useEffect(() => {
        if (activityToEdit) {
            form.reset({
                titulo: activityToEdit.titulo,
                descripcion: activityToEdit.descripcion || "",
                tipo: activityToEdit.tipo,
                fechaLimite: activityToEdit.fechaLimite ? new Date(activityToEdit.fechaLimite) : undefined,
                puntuacionTotal: activityToEdit.puntuacionTotal,
                lenguaje: activityToEdit.programmingActivity?.lenguaje || "javascript",
                tiempoLimite: activityToEdit.programmingActivity?.tiempoLimite || 1000,
                memoriaLimite: activityToEdit.programmingActivity?.memoriaLimite || 262144,
                casosPrueba: activityToEdit.programmingActivity?.casosPrueba || [{ input: "", expected: "" }],
            });
        } else {
            form.reset({
                titulo: "",
                descripcion: "",
                tipo: "theory",
                puntuacionTotal: 100,
                lenguaje: "javascript",
                tiempoLimite: 1000,
                memoriaLimite: 262144,
                casosPrueba: [{ input: "", expected: "" }],
            });
        }
    }, [activityToEdit, form, open]);

    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: "casosPrueba",
    });

    const activityType = form.watch("tipo");

    async function onSubmit(values: z.infer<typeof ActivityFormSchema>) {
        if (activityToEdit) {
            const result = await updateActivity(activityToEdit.id, values);
            if (result.error) {
                toast.error(result.error);
            } else {
                toast.success(result.success);
                setOpen(false);
            }
        } else {
            if (!courseId) return;
            const result = await createActivity(courseId, values);
            if (result.error) {
                toast.error(result.error);
            } else {
                toast.success(result.success);
                setOpen(false);
                form.reset();
            }
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            {!isControlled && (
                <DialogTrigger asChild>
                    <Button disabled={isCourseExpired}>
                        <Plus className="mr-2 h-4 w-4" />
                        {isCourseExpired ? "Curso Finalizado" : "Nueva Actividad"}
                    </Button>
                </DialogTrigger>
            )}
            <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>{activityToEdit ? "Editar Actividad" : "Crear Actividad"}</DialogTitle>
                    <DialogDescription>
                        {activityToEdit ? "Modifica los detalles de la actividad." : "Configura los detalles de la actividad o tarea de programación."}
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="titulo"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Título</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Ej: Tarea 1 - Variables" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="tipo"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Tipo de Actividad</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Selecciona un tipo" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="theory">
                                                    <div className="flex items-center"><FileText className="mr-2 h-4 w-4" /> Teórica</div>
                                                </SelectItem>
                                                <SelectItem value="code">
                                                    <div className="flex items-center"><Code className="mr-2 h-4 w-4" /> Programación</div>
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="puntuacionTotal"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Puntuación Máxima</FormLabel>
                                        <FormControl>
                                            <Input type="number" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <FormField
                            control={form.control}
                            name="descripcion"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Descripción / Enunciado</FormLabel>
                                    <FormControl>
                                        <Textarea placeholder="Describe lo que el estudiante debe realizar..." className="h-32" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="fechaLimite"
                            render={({ field }) => (
                                <FormItem className="flex flex-col">
                                    <FormLabel>Fecha Límite (Opcional)</FormLabel>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <FormControl>
                                                <Button
                                                    variant={"outline"}
                                                    className={cn(
                                                        "w-[240px] pl-3 text-left font-normal",
                                                        !field.value && "text-muted-foreground"
                                                    )}
                                                >
                                                    {field.value ? (
                                                        format(field.value, "PPP", { locale: es })
                                                    ) : (
                                                        <span>Seleccionar fecha</span>
                                                    )}
                                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                </Button>
                                            </FormControl>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0" align="start">
                                            <Calendar
                                                mode="single"
                                                selected={field.value}
                                                onSelect={field.onChange}
                                                disabled={(date) =>
                                                    date < new Date()
                                                }
                                                initialFocus
                                            />
                                        </PopoverContent>
                                    </Popover>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {activityType === "code" && (
                            <div className="space-y-4 border p-4 rounded-md bg-slate-50 dark:bg-slate-900">
                                <h3 className="font-medium flex items-center"><Code className="mr-2 h-4 w-4" /> Configuración de Judge0</h3>

                                <div className="grid grid-cols-3 gap-4">
                                    <FormField
                                        control={form.control}
                                        name="lenguaje"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Lenguaje</FormLabel>
                                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Lenguaje" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        <SelectItem value="javascript">JavaScript</SelectItem>
                                                        <SelectItem value="python">Python</SelectItem>
                                                        <SelectItem value="java">Java</SelectItem>
                                                        <SelectItem value="php">PHP</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="tiempoLimite"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Tiempo (ms)</FormLabel>
                                                <FormControl>
                                                    <Input type="number" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="memoriaLimite"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Memoria (KB)</FormLabel>
                                                <FormControl>
                                                    <Input type="number" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <div className="flex justify-between items-center">
                                        <FormLabel>Casos de Prueba</FormLabel>
                                        <Button type="button" variant="outline" size="sm" onClick={() => append({ input: "", expected: "" })}>
                                            <Plus className="h-4 w-4 mr-2" /> Agregar Caso
                                        </Button>
                                    </div>
                                    <div className="space-y-2">
                                        {fields.map((field, index) => (
                                            <div key={field.id} className="flex gap-2 items-start">
                                                <FormField
                                                    control={form.control}
                                                    name={`casosPrueba.${index}.input`}
                                                    render={({ field }) => (
                                                        <FormItem className="flex-1">
                                                            <FormControl>
                                                                <Textarea placeholder="Input" className="h-14 font-mono text-xs" {...field} />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                                <FormField
                                                    control={form.control}
                                                    name={`casosPrueba.${index}.expected`}
                                                    render={({ field }) => (
                                                        <FormItem className="flex-1">
                                                            <FormControl>
                                                                <Textarea placeholder="Output Esperado" className="h-14 font-mono text-xs" {...field} />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                                <Button type="button" variant="ghost" size="icon" onClick={() => remove(index)}>
                                                    <Trash2 className="h-4 w-4 text-destructive" />
                                                </Button>
                                            </div>
                                        ))}
                                    </div>
                                    <FormMessage>{form.formState.errors.casosPrueba?.root?.message}</FormMessage>
                                </div>
                            </div>
                        )}

                        <DialogFooter>
                            <Button type="submit" disabled={form.formState.isSubmitting}>
                                {form.formState.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                {activityToEdit ? "Guardar Cambios" : "Crear Actividad"}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
