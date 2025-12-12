"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { LoginSchema } from "@/schemas/auth";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useTransition, useState } from "react";
import { authenticate } from "@/actions/auth-actions";
import { toast } from "sonner";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";

export function LoginForm() {
    const [isPending, startTransition] = useTransition();
    const [showPassword, setShowPassword] = useState(false);

    const form = useForm<z.infer<typeof LoginSchema>>({
        resolver: zodResolver(LoginSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    function onSubmit(values: z.infer<typeof LoginSchema>) {
        startTransition(async () => {
            const formData = new FormData();
            formData.append("email", values.email);
            formData.append("password", values.password);

            try {
                const result = await authenticate(undefined, formData);
                if (result) {
                    toast.error(result);
                } else {
                    toast.success("Login exitoso");
                    // El redirect debería manejarse en el servidor con auth.js
                }
            } catch (error) {
                toast.error("Error en la conexión");
                console.error("Login error:", error);
            }
        });
    }

    return (
        <div className="flex flex-col gap-8 w-full max-w-md mx-auto p-6">
            {/* Encabezado */}
            <div className="flex flex-col items-center gap-3 text-center">

                <h1 className="text-3xl font-bold tracking-tight">Iniciar Sesión</h1>
                <p className="text-muted-foreground max-w-sm text-sm">
                    Ingresa tus credenciales para acceder a tu cuenta
                </p>
            </div>

            {/* Formulario */}
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    {/* Campo Email */}
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem className="space-y-2">
                                <FormLabel className="text-sm font-medium">Correo electrónico</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="nombre@ejemplo.com"
                                        {...field}
                                        disabled={isPending}
                                        className="h-11 px-4 text-base"
                                        type="email"
                                    />
                                </FormControl>
                                <FormMessage className="text-xs" />
                            </FormItem>
                        )}
                    />

                    {/* Campo Contraseña con botón mostrar/ocultar */}
                    <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                            <FormItem className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <FormLabel className="text-sm font-medium">Contraseña</FormLabel>
                                    {/* <Link
                                        href="/forgot-password"
                                        className="text-xs text-primary hover:text-primary/80 transition-colors"
                                    >
                                        ¿Olvidaste tu contraseña?
                                    </Link> */}
                                </div>
                                <FormControl>
                                    <div className="relative">
                                        <Input
                                            type={showPassword ? "text" : "password"}
                                            placeholder="••••••••"
                                            {...field}
                                            disabled={isPending}
                                            className="h-11 px-4 text-base pr-10"
                                        />
                                        <button
                                            type="button"
                                            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent text-muted-foreground"
                                            onClick={() => setShowPassword(!showPassword)}
                                            disabled={isPending}
                                        >
                                            {showPassword ? (
                                                <EyeOff className="h-4 w-4" />
                                            ) : (
                                                <Eye className="h-4 w-4" />
                                            )}
                                            <span className="sr-only">
                                                {showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                                            </span>
                                        </button>
                                    </div>
                                </FormControl>
                                <FormMessage className="text-xs" />
                            </FormItem>
                        )}
                    />

                    {/* Botón de envío */}
                    <Button
                        type="submit"
                        className="w-full h-11 text-base font-medium"
                        disabled={isPending}
                    >
                        {isPending ? (
                            <div className="flex items-center justify-center gap-2">
                                <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></div>
                                Iniciando sesión...
                            </div>
                        ) : (
                            "Ingresar a mi cuenta"
                        )}
                    </Button>
                </form>
            </Form>

            {/* Enlace a registro */}
            <div className="text-center pt-4 border-t">
                <p className="text-sm text-muted-foreground">
                    ¿No tienes una cuenta?{" "}
                    <Link
                        href="/register"
                        className="font-medium text-primary hover:text-primary/80 transition-colors"
                    >
                        Crear una cuenta
                    </Link>
                </p>
            </div>
        </div>
    );
}