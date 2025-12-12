"use client";

import { useState } from "react";
import { CodeEditor } from "./code-editor";
import { LANGUAGE_CONFIGS, applyTemplate, stripTemplate } from "@/lib/language-templates";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { submitSolution } from "@/actions/submission-actions";
import { toast } from "sonner";
import { Loader2, CheckCircle2, XCircle, Clock, AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";

interface ProgrammingActivityProps {
    activity: any;
    submissions: any[];
    isCompleted?: boolean;
}

export function ProgrammingActivityView({ activity, submissions, isCompleted = false }: ProgrammingActivityProps) {
    const latestSubmission = submissions[0];
    const initialLanguage = latestSubmission?.lenguaje || activity.programmingActivity?.lenguaje || "javascript";

    // Initialize with stripped code from latest submission OR the user starter template (which is already clean)
    const initialCode = latestSubmission?.codigoFuente
        ? stripTemplate(latestSubmission.codigoFuente, initialLanguage)
        : LANGUAGE_CONFIGS[initialLanguage]?.userStart || "";

    const [submissionState, setSubmissionState] = useState<any>(latestSubmission);
    const [code, setCode] = useState(initialCode);
    const [language, setLanguage] = useState(initialLanguage);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [activeTab, setActiveTab] = useState("instructions"); // Default tab
    const router = useRouter();

    const handleSubmit = async () => {
        if (!code) {
            toast.error("El código no puede estar vacío");
            return;
        }

        setIsSubmitting(true);
        try {
            // Apply template before submitting
            const fullCode = applyTemplate(code, language);
            const result = await submitSolution(activity.id, fullCode, language);
            if (result.error) {
                toast.error(result.error);
            } else {
                toast.success("Solución enviada correctamente");
                if (result.submission) {
                    setSubmissionState(result.submission);
                    setActiveTab("results"); // Switch to results tab
                }
                router.refresh();
            }
        } catch (error) {
            console.error(error);
            toast.error("Error crítico al procesar el envío. Por favor intenta nuevamente.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 h-full ">
            {/* Editor Column (60%) */}
            <div className="lg:col-span-3 flex flex-col h-full space-y-4 order-2 lg:order-1">
                <CodeEditor
                    language={language}
                    value={code}
                    onLanguageChange={(newLang) => {
                        setLanguage(newLang);
                        // Inject template automatically if switching language
                        // We always inject it as requested to ensure necessary imports are present
                        const config = LANGUAGE_CONFIGS[newLang as keyof typeof LANGUAGE_CONFIGS];
                        if (config) {
                            setCode(config.userStart);
                        }
                    }}
                    onChange={(value) => setCode(value || "")}
                    readOnly={isCompleted || isSubmitting}
                    className="flex-1 min-h-0"
                />
                <div className="flex justify-end">
                    <Button onClick={handleSubmit} disabled={isSubmitting || isCompleted}>
                        {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        {isCompleted ? "Actividad Completada" : "Enviar Solución"}
                    </Button>
                </div>
            </div>

            {/* Instructions/Results Column (40%) */}
            <div className="lg:col-span-2 space-y-6 flex flex-col h-full order-1 lg:order-2">
                <Card className="flex-1 flex flex-col overflow-hidden border-border bg-card/50">
                    <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col h-full overflow-hidden">
                        <div className="px-6 pt-6 border-b bg-background/50 backdrop-blur-sm z-10 shrink-0">
                            <TabsList className="w-full justify-start h-10 bg-transparent p-0 border-b border-transparent">
                                <TabsTrigger
                                    value="instructions"
                                    className="data-[state=active]:bg-background/80 data-[state=active]:shadow-sm rounded-t-lg border border-transparent data-[state=active]:border-border border-b-0 px-4 py-2"
                                >
                                    Instrucciones
                                </TabsTrigger>
                                <TabsTrigger
                                    value="results"
                                    disabled={!submissionState}
                                    className="data-[state=active]:bg-background/80 data-[state=active]:shadow-sm rounded-t-lg border border-transparent data-[state=active]:border-border border-b-0 px-4 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Resultados
                                </TabsTrigger>
                            </TabsList>
                        </div>

                        {/* TAB: INSTRUCCIONES */}
                        <TabsContent value="instructions" className="flex-1 overflow-y-auto p-6 gap-6 flex flex-col m-0 outline-none">
                            <div className="space-y-4 shrink-0">
                                <div className="flex justify-between items-start">
                                    <h2 className="text-2xl font-bold leading-tight">{activity.titulo}</h2>
                                    <div className="flex flex-col items-end gap-2">
                                        <Badge variant="outline">{activity.puntuacionTotal} pts</Badge>
                                        {isCompleted && (
                                            <Badge variant="default" className="bg-green-600 hover:bg-green-700">
                                                <CheckCircle2 className="mr-1 h-3 w-3" /> Completada
                                            </Badge>
                                        )}
                                    </div>
                                </div>
                                <div className="prose dark:prose-invert max-w-none text-muted-foreground whitespace-pre-wrap">
                                    {activity.descripcion}
                                </div>
                            </div>

                            {/* Details */}
                            <div className="grid grid-cols-2 gap-4 text-sm bg-muted/30 p-4 rounded-lg border">
                                <div className="flex items-center gap-2">
                                    <Clock className="h-4 w-4 text-blue-500" />
                                    <span>Tiempo: {activity.programmingActivity?.tiempoLimite}ms</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <AlertCircle className="h-4 w-4 text-yellow-500" />
                                    <span>Memoria: {activity.programmingActivity?.memoriaLimite}KB</span>
                                </div>
                            </div>

                            {/* Example Test Case Section */}
                            {activity.programmingActivity?.casosPrueba && activity.programmingActivity.casosPrueba.length > 0 && (
                                <div className="rounded-lg border bg-muted/40 p-4">
                                    <div className="flex items-center gap-2 mb-3">
                                        <Badge variant="outline" className="bg-background">Ejemplo</Badge>
                                        <h4 className="text-sm font-semibold">Entrada y Salida</h4>
                                    </div>
                                    <div className="grid gap-4 md:grid-cols-2">
                                        <div className="space-y-1.5">
                                            <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Entrada</div>
                                            <div className="rounded-md border bg-background p-3 font-mono text-sm shadow-sm overflow-x-auto">
                                                <pre>{activity.programmingActivity.casosPrueba[0].input || "(Entrada vacía)"}</pre>
                                            </div>
                                        </div>
                                        <div className="space-y-1.5">
                                            <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Salida Esperada</div>
                                            <div className="rounded-md border bg-background p-3 font-mono text-sm shadow-sm overflow-x-auto">
                                                <pre>{activity.programmingActivity.casosPrueba[0].expected || "(Salida vacía)"}</pre>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </TabsContent>

                        {/* TAB: RESULTADOS */}
                        <TabsContent value="results" className="flex-1 overflow-y-auto p-6 m-0">
                            {submissionState ? (
                                <div className="space-y-6">
                                    <div className="flex items-center justify-between border-b pb-4">
                                        <div>
                                            <h3 className="text-lg font-semibold">Estado del Envío</h3>
                                            <p className="text-sm text-muted-foreground">
                                                {submissionState.createdAt ? new Date(submissionState.createdAt).toLocaleString() : 'Reciente'}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <Badge className="mb-1" variant={submissionState.estado === 'completed' ? 'default' : 'destructive'}>
                                                {submissionState.estado === 'completed' ? 'Aprobado' : 'Fallido'}
                                            </Badge>
                                            <p className="text-sm font-medium">
                                                {submissionState.puntuacion} / {activity.puntuacionTotal} pts
                                            </p>
                                        </div>
                                    </div>

                                    {submissionState.resultado && Array.isArray(submissionState.resultado) && (
                                        <div className="space-y-3">
                                            <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Casos de Prueba</h4>
                                            <div className="grid gap-3">
                                                {submissionState.resultado.map((res: any, idx: number) => (
                                                    <div key={idx} className="p-4 border rounded-lg bg-card/50 transition-colors hover:bg-card">
                                                        <div className="flex items-center justify-between mb-2">
                                                            <span className="font-medium">Caso #{idx + 1}</span>
                                                            <div className="flex items-center gap-2">
                                                                <span className="text-xs text-muted-foreground flex items-center gap-1 bg-muted px-2 py-0.5 rounded-full">
                                                                    <Clock className="h-3 w-3" /> {res.time}s
                                                                </span>
                                                                {res.status === "Accepted" ? (
                                                                    <Badge variant="outline" className="bg-green-500/10 text-green-600 border-green-500/20">
                                                                        <CheckCircle2 className="mr-1 h-3 w-3" /> Aprobado
                                                                    </Badge>
                                                                ) : (
                                                                    <Badge variant="destructive" className="bg-red-500/10 text-red-600 border-red-500/20 shadow-none">
                                                                        <XCircle className="mr-1 h-3 w-3" /> {res.status || 'Fallido'}
                                                                    </Badge>
                                                                )}
                                                            </div>
                                                        </div>

                                                        {/* Error Details */}
                                                        {res.status !== "Accepted" && (
                                                            <div className="mt-3 text-xs bg-muted/50 p-3 rounded-md border space-y-3 font-mono">
                                                                {res.input && (
                                                                    <div>
                                                                        <span className="text-muted-foreground block mb-1 uppercase text-[10px]">Entrada</span>
                                                                        <div className="bg-background border p-2 rounded text-foreground overflow-x-auto">{res.input}</div>
                                                                    </div>
                                                                )}
                                                                <div className="grid grid-cols-2 gap-3">
                                                                    <div>
                                                                        <span className="text-muted-foreground block mb-1 uppercase text-[10px]">Esperado</span>
                                                                        <div className="bg-green-500/10 border-green-500/20 border p-2 rounded text-green-700 dark:text-green-300 overflow-x-auto">
                                                                            {res.expected}
                                                                        </div>
                                                                    </div>
                                                                    <div>
                                                                        <span className="text-muted-foreground block mb-1 uppercase text-[10px]">Obtenido</span>
                                                                        <div className="bg-red-500/10 border-red-500/20 border p-2 rounded text-red-700 dark:text-red-300 overflow-x-auto">
                                                                            {res.actual || "(Vacío)"}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                {res.stderr && (
                                                                    <div>
                                                                        <span className="text-muted-foreground block mb-1 uppercase text-[10px]">Error (Stderr)</span>
                                                                        <div className="text-red-500 whitespace-pre-wrap bg-red-950/10 p-2 rounded border border-red-500/20">{res.stderr}</div>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center h-full text-center p-8 text-muted-foreground space-y-4">
                                    <div className="p-4 rounded-full bg-muted">
                                        <CodeEditor className="h-8 w-8 text-muted-foreground opacity-50" readOnly />
                                        {/* Using generic icon substitute just for visual, ideally lucide icon */}
                                        <Clock className="h-8 w-8" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-lg">Sin resultados aún</h3>
                                        <p className="text-sm max-w-xs mx-auto mt-1">Envía tu solución para ver los resultados de los casos de prueba aquí.</p>
                                    </div>
                                </div>
                            )}
                        </TabsContent>
                    </Tabs>
                </Card>
            </div>
        </div>
    );
}
