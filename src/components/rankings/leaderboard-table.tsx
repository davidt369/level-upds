"use client";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Trophy, Medal } from "lucide-react";
import { cn } from "@/lib/utils";

interface RankingEntry {
    userId: number;
    userName: string;
    email: string;
    totalScore: number;
    activitiesCompleted: number;
    position: number;
}

interface LeaderboardTableProps {
    data: RankingEntry[];
    type?: "Global" | "Curso";
}

export function LeaderboardTable({ data, type = "Global" }: LeaderboardTableProps) {
    const getRankIcon = (position: number) => {
        switch (position) {
            case 1:
                return <Trophy className="h-5 w-5 text-yellow-500 fill-yellow-500/20" />;
            case 2:
                return <Medal className="h-5 w-5 text-gray-400 fill-gray-400/20" />;
            case 3:
                return <Medal className="h-5 w-5 text-amber-700 fill-amber-700/20" />;
            default:
                return <span className="font-mono text-muted-foreground w-5 text-center">{position}</span>;
        }
    };

    const getRowStyle = (position: number) => {
        if (position === 1) return "bg-yellow-500/5 hover:bg-yellow-500/10";
        if (position === 2) return "bg-gray-500/5 hover:bg-gray-500/10";
        if (position === 3) return "bg-amber-700/5 hover:bg-amber-700/10";
        return "";
    };

    if (data.length === 0) {
        return (
            <div className="text-center py-10 border rounded-lg border-dashed text-muted-foreground">
                No hay datos suficientes para mostrar el ranking aún.
            </div>
        );
    }

    return (
        <div className="rounded-md border bg-card">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[80px] text-center">Rango</TableHead>
                        <TableHead>Estudiante</TableHead>
                        <TableHead className="text-right">Actividades</TableHead>
                        <TableHead className="text-right">Puntaje Total</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {data.map((entry) => (
                        <TableRow key={entry.userId} className={cn(getRowStyle(entry.position))}>
                            <TableCell className="font-medium text-center">
                                <div className="flex justify-center items-center">
                                    {getRankIcon(entry.position)}
                                </div>
                            </TableCell>
                            <TableCell>
                                <div className="flex items-center gap-3">
                                    <Avatar className="h-9 w-9 border">
                                        <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${entry.userName}`} />
                                        <AvatarFallback>{entry.userName.substring(0, 2).toUpperCase()}</AvatarFallback>
                                    </Avatar>
                                    <div className="flex flex-col">
                                        <span className="font-medium">{entry.userName}</span>
                                        <span className="text-xs text-muted-foreground hidden sm:inline-block">
                                            {entry.email}
                                        </span>
                                    </div>
                                </div>
                            </TableCell>
                            <TableCell className="text-right">
                                <Badge variant="secondary" className="font-mono">
                                    {entry.activitiesCompleted}
                                </Badge>
                            </TableCell>
                            <TableCell className="text-right font-bold text-lg">
                                <span className="text-primary">{entry.totalScore}</span>
                                <span className="text-xs text-muted-foreground font-normal ml-1">pts</span>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}
