import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { DashboardClientLayout } from "@/components/dashboard/dashboard-layout-client";

import { UserButton } from "@/components/auth/user-button";
import { ModeToggle } from "@/components/ui/mode-toggle";

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
