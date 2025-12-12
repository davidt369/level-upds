import { getGlobalRanking } from "@/actions/ranking-actions";
import { LeaderboardTable } from "@/components/rankings/leaderboard-table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy } from "lucide-react";

export const metadata = {
    title: "Ranking Global | Level UPDS",
};

export default async function RankingsPage() {
    const rankings = await getGlobalRanking(50); // Top 50

    return (
        <div className="space-y-6 container mx-auto py-6">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold tracking-tight">Ranking Global</h1>
                <p className="text-muted-foreground">
                    Los mejores estudiantes de toda la plataforma. ¡Sigue aprendiendo para subir de nivel!
                </p>
            </div>

            <div className="grid gap-6">
                <Card className="border-t-4 border-t-yellow-500 shadow-sm">
                    <CardHeader>
                        <div className="flex justify-between items-center">
                            <div>
                                <CardTitle className="text-xl flex items-center gap-2">
                                    <Trophy className="h-5 w-5 text-yellow-500" />
                                    Tabla de Clasificación
                                </CardTitle>
                                <CardDescription>
                                    Actualizado en tiempo real basado en la suma de puntajes de todas las actividades.
                                </CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <LeaderboardTable data={rankings} type="Global" />
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
