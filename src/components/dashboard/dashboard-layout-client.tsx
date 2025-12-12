"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { AppSidebar } from "@/components/dashboard/app-sidebar";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, PanelLeftClose, PanelLeftOpen, LogOut, User } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { signOut } from "next-auth/react";
import { ModeToggle } from "../ui/mode-toggle";

interface DashboardClientLayoutProps {
    children: React.ReactNode;
    role: string;
    user: {
        name?: string | null;
        email?: string | null;
        image?: string | null;
    };
    actions?: React.ReactNode;
}

export function DashboardClientLayout({ children, role, user, actions }: DashboardClientLayoutProps) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const pathname = usePathname();
    const isActivityPage = pathname?.includes("/activities/");

    return (
        <div className="h-screen w-full overflow-hidden flex flex-col">
            {/* Header */}
            <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <div className="flex h-14 items-center gap-4 px-4 md:px-6">
                    {/* Cloud/Mobile Toggle */}
                    <div className="flex items-center gap-2">
                        <Sheet>
                            <SheetTrigger asChild>
                                <Button variant="ghost" size="icon" className="md:hidden">
                                    <Menu className="h-5 w-5" />
                                    <span className="sr-only">Toggle menu</span>
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="left" className="p-0 text-white w-64 border-r-[#2d2d2d] bg-[#0b0b0b]">
                                <AppSidebar role={role} />
                            </SheetContent>
                        </Sheet>

                        {/* Desktop Sidebar Toggle */}
                        <Button
                            variant="ghost"
                            size="icon"
                            className="hidden md:flex"
                            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                        >
                            {isSidebarOpen ? (
                                <PanelLeftClose className="h-5 w-5" />
                            ) : (
                                <PanelLeftOpen className="h-5 w-5" />
                            )}
                        </Button>

                        <div className="flex items-center gap-2 font-bold text-xl tracking-tight hidden md:flex">
                            <Image
                                src="/upds-logo.png"
                                alt="Logo"
                                width={42}
                                height={42}
                            />
                            Level UPDS
                        </div>
                    </div>

                    <div className="flex flex-1 items-center justify-end gap-4">
                        <div className="ml-auto flex items-center space-x-2">
                            {actions || (
                                <>
                                    <ModeToggle />

                                </>
                            )}
                        </div>
                    </div>
                </div>
            </header>

            <div className="flex flex-1 overflow-hidden">
                {/* Desktop Sidebar */}
                <aside
                    className={cn(
                        "hidden md:flex flex-col border-r h-[calc(100vh-3.5rem)] transition-all duration-300 ease-in-out fixed left-0 top-14 z-40 bg-background",
                        isSidebarOpen ? "w-64 translate-x-0" : "w-0 -translate-x-full opacity-0"
                    )}
                >
                    <div className="h-full overflow-hidden w-64">
                        <AppSidebar role={role} />
                    </div>
                </aside>

                {/* Main Content */}
                <main
                    className={cn(
                        "flex-1 overflow-y-auto p-2 my-6 md:p-2 bg-muted/10 h-[calc(100vh-3.5rem)] transition-all duration-300 ease-in-out",
                        isSidebarOpen ? "md:ml-64" : "md:ml-0"
                    )}
                >
                    <div className={cn(
                        "w-full h-full mx-auto space-y-3",
                        !isActivityPage && "max-w-7xl"
                    )}>
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
