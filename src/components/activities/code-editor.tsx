"use client";

import Editor, { Monaco } from "@monaco-editor/react";
import { Copy, RefreshCw, Terminal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { LANGUAGE_CONFIGS } from "@/lib/language-templates";

interface CodeEditorProps {
    initialCode?: string;
    language?: string;
    value?: string;
    onChange?: (value: string | undefined) => void;
    onLanguageChange?: (value: string) => void;
    readOnly?: boolean;
    className?: string;
}

export function CodeEditor({
    initialCode,
    language = "javascript",
    value,
    onChange,
    onLanguageChange,
    readOnly = false,
    className
}: CodeEditorProps) {

    const defaultCode = LANGUAGE_CONFIGS[language || "javascript"]?.userStart || "// Escribe tu código aquí";
    const effectiveCode = value ?? initialCode ?? defaultCode;

    const handleEditorWillMount = (monaco: Monaco) => {
        monaco.editor.defineTheme('one-dark-pro-darker', {
            base: 'vs-dark',
            inherit: true,
            rules: [
                { token: 'comment', foreground: '7f848e', fontStyle: 'italic' },
                { token: 'keyword', foreground: 'c678dd' },
                { token: 'identifier', foreground: 'abb2bf' },
                { token: 'string', foreground: '98c379' },
                { token: 'number', foreground: 'd19a66' },
                { token: 'type', foreground: 'e5c07b' },
                { token: 'class', foreground: 'e5c07b' },
                { token: 'function', foreground: '61afef' },
                { token: 'variable', foreground: 'e06c75' },
                { token: 'operator', foreground: '56b6c2' }
            ],
            colors: {
                'editor.background': '#0b0b0b', // Darker background
                'editor.foreground': '#abb2bf',
                'editor.lineHighlightBackground': '#1e1e1e',
                'editorCursor.foreground': '#528bff',
                'editorWhitespace.foreground': '#3b4048',
                'editorIndentGuide.background': '#3b4048',
                'editor.selectionBackground': '#3e4451',
            }
        });
        // Force dark theme application if needed, though 'theme' prop on Editor handles it.
        monaco.editor.setTheme('one-dark-pro-darker');
    };

    const handleCopy = () => {
        if (value) {
            navigator.clipboard.writeText(value);
            toast.success("Código copiado al portapapeles");
        }
    };

    return (
        <div className={cn("flex flex-col w-full h-full overflow-hidden rounded-lg border border-border shadow-sm bg-[#0b0b0b]", className)}>
            {/* Toolbar Professional */}
            <div className="flex items-center justify-between px-4 py-2 bg-[#161616] border-b border-[#2d2d2d]">
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 text-muted-foreground">
                        <Terminal className="h-4 w-4 text-blue-500" />
                        <span className="text-sm font-medium text-gray-300">Editor de Código</span>
                    </div>
                    {/* Divider */}
                    <div className="h-4 w-[1px] bg-[#333]" />

                    <Select disabled={readOnly} value={language} onValueChange={onLanguageChange}>
                        <SelectTrigger id="language-selector" className="w-[140px] h-8 bg-[#252525] border-[#333] text-gray-200 focus:ring-0 focus:ring-offset-0 hover:bg-[#2a2a2a] transition-colors">
                            <SelectValue placeholder="Lenguaje" />
                        </SelectTrigger>
                        <SelectContent className="bg-[#1e1e1e] border-[#333] text-gray-200">
                            <SelectItem value="javascript">JavaScript</SelectItem>
                            <SelectItem value="python">Python</SelectItem>
                            <SelectItem value="java">Java</SelectItem>
                            <SelectItem value="php">PHP</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="flex items-center gap-1">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-gray-400 hover:text-white hover:bg-[#2d2d2d]"
                        onClick={handleCopy}
                        title="Copiar código"
                    >
                        <Copy className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            {/* Editor Area */}
            <div className="flex-1 relative w-full">
                <Editor
                    height="100%"
                    width="100%"
                    defaultLanguage={language}
                    language={language}
                    value={effectiveCode}
                    theme="one-dark-pro-darker"
                    beforeMount={handleEditorWillMount}
                    onChange={onChange}
                    options={{
                        minimap: { enabled: false }, // Cleaner look
                        fontSize: 14,
                        fontFamily: "'JetBrains Mono', 'Fira Code', Consolas, monospace",
                        fontLigatures: true,
                        readOnly: readOnly,
                        scrollBeyondLastLine: true,
                        automaticLayout: true,
                        padding: { top: 16, bottom: 16 },
                        smoothScrolling: true,
                        cursorBlinking: "smooth",
                        cursorSmoothCaretAnimation: "on",
                        formatOnPaste: true,

                    }}
                />
            </div>

            {/* Status Bar / Footer */}
            <div className="flex items-center justify-between px-4 py-1 bg-[#161616] border-t border-[#2d2d2d] text-[10px] text-gray-500 font-mono">
                <div>
                    {language === 'javascript' ? 'Node.js' : language.charAt(0).toUpperCase() + language.slice(1)} Environment
                </div>
                <div className="flex gap-4">
                    <span>UTF-8</span>
                    <span>Ln {value?.split('\n').length || 1}</span>
                </div>
            </div>
        </div>
    );
}
