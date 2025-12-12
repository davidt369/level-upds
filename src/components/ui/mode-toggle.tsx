"use client"

import * as React from "react"
import { Monitor, Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"

export function ModeToggle() {
    const { theme, setTheme } = useTheme()
    const [mounted, setMounted] = React.useState(false)

    React.useEffect(() => {
        setMounted(true)
    }, [])

    const toggleTheme = () => {
        if (theme === "light") {
            setTheme("dark")
        } else if (theme === "dark") {
            setTheme("system")
        } else {
            setTheme("light")
        }
    }

    if (!mounted) {
        return (
            <Button variant="outline" size="icon" disabled>
                <Sun className="h-[1.2rem] w-[1.2rem]" />
                <span className="sr-only">Toggle theme</span>
            </Button>
        )
    }

    const getIcon = () => {
        switch (theme) {
            case "dark":
                return <Moon className="h-[1.2rem] w-[1.2rem]" />
            case "system":
                return <Monitor className="h-[1.2rem] w-[1.2rem]" />
            default:
                return <Sun className="h-[1.2rem] w-[1.2rem]" />
        }
    }

    return (
        <Button
            variant="outline"
            size="icon"
            onClick={toggleTheme}
            title={`Current: ${theme}. Click to cycle themes`}
        >
            {getIcon()}
            <span className="sr-only">Toggle theme</span>
        </Button>
    )
}