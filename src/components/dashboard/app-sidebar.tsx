"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
    Users,
    BookOpen,
    GraduationCap,
    LayoutDashboard,
    Settings,
    FileText,
    Trophy
} from "lucide-react";

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
    role: string;
    onNavigate?: () => void;
}

export function AppSidebar({ className, role, onNavigate }: SidebarProps) {
    const pathname = usePathname();

    const routes = [
        {
            label: "Dashboard",
            icon: LayoutDashboard,
            href: "/dashboard",
            roles: ["admin", "teacher", "student"],
        },
        {
            label: "Usuarios",
            icon: Users,
            href: "/dashboard/users",
            roles: ["admin"],
        },
        {
            label: "Cursos",
            icon: BookOpen,
            href: "/dashboard/courses",
            roles: ["admin", "teacher"],
        },
        {
            label: "Mis Cursos",
            icon: GraduationCap,
            href: "/dashboard/my-courses",
            roles: ["student"],
        },
        {
            label: "Actividades",
            icon: FileText,
            href: "/dashboard/activities",
            roles: ["teacher", "student"],
        },
        {
            label: "Ranking Global",
            icon: Trophy,
            href: "/dashboard/rankings",
            roles: ["admin", "teacher", "student"],
        },
        {
            label: "Configuración",
            icon: Settings,
            href: "/dashboard/settings",
            roles: ["admin", "teacher", "student"],
        },
    ];

    const filteredRoutes = routes.filter((route) => route.roles.includes(role));

    return (
        <div className={cn("flex flex-col h-full border-r bg-card", className)}>
            <div className="p-4 border-b">
                <div className="flex items-center gap-2 font-bold text-lg tracking-tight text-primary">
                    <div className="bg-primary text-primary-foreground rounded-lg p-1">
                        <Trophy className="h-4 w-4" />
                    </div>
                    Level UPDS
                </div>
            </div>

            <div className="flex-1 px-3 py-2 overflow-y-auto">
                <nav className="space-y-1">
                    <h3 className="mb-2 px-2 text-xs font-semibold text-muted-foreground tracking-wider uppercase">
                        Plataforma
                    </h3>
                    {filteredRoutes.map((route) => {
                        const isActive = (pathname?.startsWith(route.href) && route.href !== "/dashboard") || pathname === route.href;
                        return (
                            <Button
                                key={route.href}
                                variant={isActive ? "secondary" : "ghost"}
                                className={cn(
                                    "w-full justify-start transition-all duration-200 h-10 mb-1",
                                    isActive && "bg-primary/10 text-primary hover:bg-primary/15 font-semibold",
                                    !isActive && "text-muted-foreground hover:text-foreground"
                                )}
                                asChild
                                onClick={onNavigate}
                            >
                                <Link href={route.href}>
                                    <route.icon className={cn("mr-3 h-4 w-4",
                                        isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
                                    )} />
                                    {route.label}
                                </Link>
                            </Button>
                        );
                    })}
                </nav>
            </div>

            <div className="p-3 border-t bg-muted/20">
                <div className="rounded-lg bg-card border p-2 shadow-sm">
                    <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold shrink-0">
                            {role.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex flex-col overflow-hidden">
                            <span className="text-sm font-medium truncate capitalize">{role}</span>
                            <span className="text-xs text-muted-foreground truncate">Cuenta Activa</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
