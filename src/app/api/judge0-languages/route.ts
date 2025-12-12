import { NextResponse } from 'next/server';

export async function GET() {
    const RAPIDAPI_KEY = process.env.RAPIDAPI_KEY || '4fa3226638mshc8d70c7332308aep1e48d0jsna090a0e54a3c';

    try {
        const response = await fetch('https://judge0-extra-ce.p.rapidapi.com/languages', {
            headers: {
                'X-RapidAPI-Key': RAPIDAPI_KEY,
                'X-RapidAPI-Host': 'judge0-extra-ce.p.rapidapi.com',
            },
        });

        const languages = await response.json();

        // Formatear para mejor visualización
        const formatted = languages.map((lang: any) => ({
            id: lang.id,
            name: lang.name,
        }));

        return NextResponse.json({
            total: languages.length,
            languages: formatted.sort((a: any, b: any) => a.id - b.id),
        });
    } catch (error) {
        return NextResponse.json({
            error: 'Error fetching languages',
            details: error instanceof Error ? error.message : 'Unknown error',
        }, { status: 500 });
    }
}
