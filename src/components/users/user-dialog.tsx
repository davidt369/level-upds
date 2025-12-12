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
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { UserFormSchema } from "@/schemas/user";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { createUser, updateUser } from "@/actions/user-actions";
import { toast } from "sonner";
import { useState, useEffect } from "react";
import { Plus } from "lucide-react";

interface UserDialogProps {
    userToEdit?: any;
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
}

export function UserDialog({ userToEdit, open: controlledOpen, onOpenChange }: UserDialogProps) {
    const [internalOpen, setInternalOpen] = useState(false);
    const isControlled = controlledOpen !== undefined;
    const open = isControlled ? controlledOpen : internalOpen;
    const setOpen = isControlled ? onOpenChange : setInternalOpen;

    const form = useForm<z.infer<typeof UserFormSchema>>({
        resolver: zodResolver(UserFormSchema),
        defaultValues: {
            name: "",
            email: "",
            password: "",
            role: "student",
            isActive: true,
        },
    });

    useEffect(() => {
        if (userToEdit) {
            form.reset({
                id: userToEdit.id,
                name: userToEdit.name,
                email: userToEdit.email,
                role: userToEdit.role,
                isActive: userToEdit.isActive,
                password: "", // Don't populate password
            });
        } else {
            form.reset({
                name: "",
                email: "",
                password: "",
                role: "student",
                isActive: true,
            });
        }
    }, [userToEdit, form, open]);

    async function onSubmit(values: z.infer<typeof UserFormSchema>) {
        if (userToEdit) {
            const result = await updateUser(values);
            if (result.error) {
                toast.error(result.error);
            } else {
                toast.success(result.success);
                setOpen && setOpen(false);
            }
        } else {
            const result = await createUser(values);
            if (result.error) {
                toast.error(result.error);
            } else {
                toast.success(result.success);
                setOpen && setOpen(false);
            }
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            {!isControlled && (
                <DialogTrigger asChild>
                    <Button><Plus className="mr-2 h-4 w-4" /> Nuevo Usuario</Button>
                </DialogTrigger>
            )}
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{userToEdit ? "Editar Usuario" : "Crear Usuario"}</DialogTitle>
                    <DialogDescription>
                        {userToEdit ? "Modifica los datos del usuario." : "Ingresa los datos para el nuevo usuario."}
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Nombre</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Juan Perez" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input placeholder="tu@email.com" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Contraseña {userToEdit && "(Opcional)"}</FormLabel>
                                    <FormControl>
                                        <Input type="password" placeholder="******" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="role"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Rol</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Selecciona un rol" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="student">Estudiante</SelectItem>
                                            <SelectItem value="teacher">Profesor</SelectItem>
                                            <SelectItem value="admin">Administrador</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="isActive"
                            render={({ field }) => (
                                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                    <div className="space-y-0.5">
                                        <FormLabel className="text-base">Activo</FormLabel>
                                    </div>
                                    <FormControl>
                                        <Switch
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                        <DialogFooter>
                            <Button type="submit">{userToEdit ? "Guardar Cambios" : "Crear Usuario"}</Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
