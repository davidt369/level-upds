"use client";

import { useEffect, useState } from "react";
import { driver } from "driver.js";
import "driver.js/dist/driver.css";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { HelpCircle } from "lucide-react";
import { tourSteps } from "@/config/tour-steps";

interface TourGuideProps {
    role?: string;
}

export function TourGuide({ role }: TourGuideProps) {
    const pathname = usePathname();
    const [hasTour, setHasTour] = useState(false);

    // Identify the correct tour key based on pathname pattern
    const getTourKey = (path: string) => {
        if (path === "/dashboard") return "/dashboard";
        if (path === "/dashboard/activities") return "/dashboard/activities";
        if (path === "/dashboard/courses") return "/dashboard/courses";
        if (path === "/dashboard/users") return "/dashboard/users";
        if (path.includes("/courses/") && path.split("/").length === 4) return "/courses-detail"; // /dashboard/courses/[id]
        if (path.includes("/activities/") && path.includes("/courses/")) return "/activity-code"; // /dashboard/courses/[id]/activities/[id]

        return null;
    };

    useEffect(() => {
        if (!role) return;

        const currentRole = role as keyof typeof tourSteps;
        const stepsConfig = tourSteps[currentRole];

        if (!stepsConfig) {
            setHasTour(false);
            return;
        }

        if (!pathname) return;

        const key = getTourKey(pathname);

        if (key && stepsConfig[key] && stepsConfig[key].length > 0) {
            setHasTour(true);
        } else {
            setHasTour(false);
        }

    }, [pathname, role]);

    const startTour = () => {
        if (!role || !pathname) return;

        const currentRole = role as keyof typeof tourSteps;
        const stepsConfig = tourSteps[currentRole];

        if (!stepsConfig) return;

        const key = getTourKey(pathname);
        if (!key) return;

        const steps = stepsConfig[key];

        if (steps) {
            const driverObj = driver({
                showProgress: true,
                steps: steps,
                nextBtnText: 'Siguiente',
                prevBtnText: 'Anterior',
                doneBtnText: 'Finalizar',
                overlayColor: 'rgba(0,0,0,0.6)',
            });

            driverObj.drive();
        }
    };

    if (!hasTour) return null;

    return (
        <Button
            variant="ghost"
            size="icon"
            onClick={startTour}
            title="Ver tour de ayuda"
        >
            <HelpCircle className="h-5 w-5 text-muted-foreground" />
            <span className="sr-only">Ayuda</span>
        </Button>
    );
}
