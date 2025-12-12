"use client";

import { useTransition, useState } from "react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ModeToggle } from "@/components/ui/mode-toggle";
import { updateProfile, changePassword } from "@/actions/user-actions";
import { toast } from "sonner";
import { Loader2, User, Lock, Paintbrush } from "lucide-react";

export default function SettingsPage() {
    const { data: session, update } = useSession();
    const [isPending, startTransition] = useTransition();

    // Profile State
    const [name, setName] = useState(session?.user?.name || "");

    // Password State
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const handleProfileUpdate = (e: React.FormEvent) => {
        e.preventDefault();
        startTransition(async () => {
            const result = await updateProfile({ name });
            if (result.error) {
                toast.error(result.error);
            } else {
                toast.success(result.success);
                await update(); // Update session
            }
        });
    };

    const handlePasswordChange = (e: React.FormEvent) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            toast.error("Las nuevas contraseñas no coinciden");
            return;
        }
        if (newPassword.length < 6) {
            toast.error("La contraseña debe tener al menos 6 caracteres");
            return;
        }

        startTransition(async () => {
            const result = await changePassword(currentPassword, newPassword);
            if (result.error) {
                toast.error(result.error);
            } else {
                toast.success(result.success);
                setCurrentPassword("");
                setNewPassword("");
                setConfirmPassword("");
            }
        });
    };

    return (
        <div className="space-y-6 container mx-auto py-6 max-w-4xl">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold tracking-tight">Configuración</h1>
                <p className="text-muted-foreground">
                    Administra tu cuenta y preferencias personales.
                </p>
            </div>

            <Tabs defaultValue="profile" className="w-full">
                <TabsList className="grid w-full grid-cols-3 lg:w-[400px]">
                    <TabsTrigger value="profile">Perfil</TabsTrigger>
                    <TabsTrigger value="security">Seguridad</TabsTrigger>
                    <TabsTrigger value="appearance">Apariencia</TabsTrigger>
                </TabsList>

                {/* --- PROFILE SECTION --- */}
                <TabsContent value="profile" className="mt-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <User className="h-5 w-5" /> Información Personal
                            </CardTitle>
                            <CardDescription>
                                Actualiza tu nombre y visualiza tu información de cuenta.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleProfileUpdate} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="email">Correo Electrónico</Label>
                                    <Input
                                        id="email"
                                        value={session?.user?.email || ""}
                                        disabled
                                        className="bg-muted"
                                    />
                                    <p className="text-xs text-muted-foreground">
                                        El correo electrónico no se puede cambiar.
                                    </p>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="role">Rol</Label>
                                    <Input
                                        id="role"
                                        value={session?.user?.role === 'student' ? 'Estudiante' :
                                            session?.user?.role === 'teacher' ? 'Docente' : 'Admin'}
                                        disabled
                                        className="bg-muted"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="name">Nombre Completo</Label>
                                    <Input
                                        id="name"
                                        placeholder="Tu nombre"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        disabled={isPending}
                                    />
                                </div>
                                <div className="flex justify-end">
                                    <Button type="submit" disabled={isPending}>
                                        {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                        Guardar Cambios
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* --- SECURITY SECTION --- */}
                <TabsContent value="security" className="mt-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Lock className="h-5 w-5" /> Contraseña
                            </CardTitle>
                            <CardDescription>
                                Cambia tu contraseña de acceso de forma segura.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handlePasswordChange} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="current">Contraseña Actual</Label>
                                    <Input
                                        id="current"
                                        type="password"
                                        value={currentPassword}
                                        onChange={(e) => setCurrentPassword(e.target.value)}
                                        required
                                        disabled={isPending}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="new">Nueva Contraseña</Label>
                                    <Input
                                        id="new"
                                        type="password"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        required
                                        disabled={isPending}
                                        minLength={6}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="confirm">Confirmar Nueva Contraseña</Label>
                                    <Input
                                        id="confirm"
                                        type="password"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        required
                                        disabled={isPending}
                                        minLength={6}
                                    />
                                </div>
                                <div className="flex justify-end">
                                    <Button type="submit" disabled={isPending} variant="destructive">
                                        {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                        Actualizar Contraseña
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* --- APPEARANCE SECTION --- */}
                <TabsContent value="appearance" className="mt-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Paintbrush className="h-5 w-5" /> Apariencia
                            </CardTitle>
                            <CardDescription>
                                Personaliza cómo se ve la aplicación en tu dispositivo.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center justify-between p-4 border rounded-lg bg-card">
                                <div className="space-y-1">
                                    <p className="font-medium">Tema</p>
                                    <p className="text-sm text-muted-foreground">
                                        Selecciona entre tema claro, oscuro o del sistema.
                                    </p>
                                </div>
                                <ModeToggle />
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
