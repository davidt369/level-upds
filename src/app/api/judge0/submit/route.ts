import { NextRequest, NextResponse } from "next/server";

const JUDGE0_API_URL = process.env.JUDGE0_API_URL || process.env.JUDGE0_URL || "https://ce.judge0.com";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();

        console.log(`[Judge0 API] Submitting to: ${JUDGE0_API_URL}/submissions`);

        const response = await fetch(
            `${JUDGE0_API_URL}/submissions?base64_encoded=false&wait=false`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(body),
            }
        );

        if (!response.ok) {
            const error = await response.text();
            console.error(`[Judge0 API] Submission failed:`, error);
            return NextResponse.json(
                { error: `Judge0 Error: ${error}` },
                { status: response.status }
            );
        }

        const data = await response.json();
        console.log(`[Judge0 API] Submission created, token: ${data.token}`);

        return NextResponse.json(data);
    } catch (error: any) {
        console.error("[Judge0 API] Submission error:", error);
        return NextResponse.json(
            { error: "Failed to submit to Judge0" },
            { status: 500 }
        );
    }
}
