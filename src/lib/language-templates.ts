export interface LanguageConfig {
    pre?: string;
    post?: string;
    userStart: string;
}

export const LANGUAGE_CONFIGS: Record<string, LanguageConfig> = {
    javascript: {
        pre: `const fs = require('fs');
const input = fs.readFileSync(0, 'utf-8').trim();
`,
        userStart: `const fs = require('fs');
const input = fs.readFileSync(0, 'utf-8').trim();

/**
 * ==========================================
 * AYUDA:
 * - La variable 'input' ya contiene toda la entrada de texto.
 * - console.log para imprimir la respuesta.
 * ==========================================
 */

// Tu solución abajo:
console.log("Hola, " + input);`
    },
    python: {
        pre: `import sys
try:
    input_data = sys.stdin.read().strip()
except EOFError:
    input_data = ""
`,
        userStart: `import sys

# Lectura de entrada
try:
    input_data = sys.stdin.read().strip()
except EOFError:
    input_data = ""

"""
==========================================
AYUDA:
- La variable 'input_data' ya contiene la entrada.
- print() para imprimir la respuesta.
==========================================
"""

# Tu solución abajo:
print(f"Hola, {input_data}")`
    },
    php: {
        pre: `<?php
$input = trim(fgets(STDIN));
`,
        post: `?>`,
        userStart: `<?php
$input = trim(fgets(STDIN));

/*
 * ==========================================
 * AYUDA:
 * - La variable '$input' ya contiene la entrada.
 * - echo para imprimir la respuesta.
 * ==========================================
 */

// Tu solución abajo:
echo "Hola, " . $input;
?>`
    },
    java: {
        pre: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        String input = scanner.hasNextLine() ? scanner.nextLine() : "";
`,
        post: `    }
}`,
        userStart: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        String input = scanner.hasNextLine() ? scanner.nextLine() : "";

        /*
         * ==========================================
         * AYUDA:
         * - 'input' contiene la entrada.
         * - System.out.println para imprimir.
         * ==========================================
         */

        // Tu solución abajo:
        System.out.println("Hola, " + input);
    }
}`
    }
};

// Deprecated: Compatibility map
export const LANGUAGE_TEMPLATES: Record<string, string> = {
    javascript: LANGUAGE_CONFIGS.javascript.userStart,
    python: LANGUAGE_CONFIGS.python.userStart,
    php: LANGUAGE_CONFIGS.php.userStart,
    java: LANGUAGE_CONFIGS.java.userStart
};

export function applyTemplate(userCode: string, language: string): string {
    const config = LANGUAGE_CONFIGS[language];
    if (!config) return userCode;

    const trimmed = userCode.trim();

    // Smart detection: 
    // If the user submits the FULL script (which they might, since we expose it in userStart),
    // we should NOT inject the template again.

    // PHP: Starts with <?php
    if (language === 'php' && trimmed.startsWith('<?php')) return userCode;

    // Java: Defines class Main
    if (language === 'java' && trimmed.includes('class Main')) return userCode;

    // Python: Imports sys and reads stdin (heuristic)
    if (language === 'python' && trimmed.includes('import sys') && trimmed.includes('sys.stdin')) return userCode;

    // JS: Requires fs (heuristic)
    if (language === 'javascript' && (trimmed.includes("require('fs')") || trimmed.includes("readFileSync"))) return userCode;

    let fullCode = "";
    if (config.pre) fullCode += config.pre + "\n";
    fullCode += userCode;
    if (config.post) fullCode += "\n" + config.post;

    return fullCode;
}

export function stripTemplate(fullCode: string, language: string): string {
    const config = LANGUAGE_CONFIGS[language];
    if (!config) return fullCode;

    let userCode = fullCode;

    if (config.pre && userCode.startsWith(config.pre)) {
        userCode = userCode.substring(config.pre.length);
    } else if (config.pre) {
        // Attempt fuzzy match or trim if exact match fails (e.g. whitespace diffs)
        const trimmedPre = config.pre.trim();
        if (userCode.trim().startsWith(trimmedPre)) {
            // This is a bit risky but handles copy-paste whitespace issues. 
            // Ideally we just check strictly. For now let's try strict first, and maybe trim leading newlines.
            userCode = userCode.replace(config.pre, '');
        }
    }

    if (config.post && userCode.endsWith(config.post)) {
        userCode = userCode.substring(0, userCode.length - config.post.length);
    }

    return userCode.trim();
}
