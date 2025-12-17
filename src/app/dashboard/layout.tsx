import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { DashboardClientLayout } from "@/components/dashboard/dashboard-layout-client";
import type { Metadata } from "next"
import { UserButton } from "@/components/auth/user-button";
import { ModeToggle } from "@/components/ui/mode-toggle";
export const metadata: Metadata = {
    title: {
        default: "Level UPDS - Evaluación Automática de Programación",
        template: "%s | Level UPDS",
    },
    description:
        "Plataforma moderna para la evaluación automática de ejercicios de programación en la UPDS. Mejora tu aprendizaje con retroalimentación inmediata, Juez en Línea (Judge0) y métricas de rendimiento.",
    keywords: [
        "UPDS",
        "Programación",
        "Evaluación Automática",
        "Judge0",
        "Educación",
        "Ingeniería de Sistemas",
        "Cochabamba",
        "Bolivia",
        "Online Judge",
        "Aprender a programar",
    ],
    authors: [{ name: "UPDS Cochabamba" }],
    creator: "UPDS Ingeniería de Sistemas",
    publisher: "Universidad Privada Domingo Savio",
    icons: {
        icon: [
            {
                url: "/bg-upds.png",
                media: "(prefers-color-scheme: light)",
            },
            {
                url: "/bg-upds.png",
                media: "(prefers-color-scheme: dark)",
            },
            {
                url: "/bg-upds.png",
                type: "image/svg+xml",
            },
        ],
        apple: "/bg-upds.png",
    },
    openGraph: {
        type: "website",
        locale: "es_BO",
        url: "https://levelupds.edu.bo",
        title: "Level UPDS - Plataforma de Evaluación Automática",
        description:
            "Moderniza el aprendizaje de programación con retroalimentación instantánea y entornos estandarizados.",
        siteName: "Level UPDS",
    },
    robots: {
        index: true,
        follow: true,
    },
}

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await auth();

    if (!session?.user) {
        redirect("/auth/login");
    }

    return (
        <DashboardClientLayout
            role={session.user.role}
            user={{
                name: session.user.name,
                email: session.user.email,
                image: session.user.image,
            }}
            actions={
                <div className="ml-auto flex items-center space-x-2">
                    <ModeToggle />
                    <UserButton />
                </div>
            }
        >
            {children}
        </DashboardClientLayout>
    );
}
