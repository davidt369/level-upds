import { NextRequest, NextResponse } from "next/server";

const JUDGE0_API_URL = process.env.JUDGE0_API_URL || process.env.JUDGE0_URL || "https://ce.judge0.com";

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ token: string }> }
) {
    try {
        const { token } = await params;

        const response = await fetch(
            `${JUDGE0_API_URL}/submissions/${token}?base64_encoded=false&fields=stdout,stderr,status,message,compile_output,time,memory`,
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );

        if (!response.ok) {
            return NextResponse.json(
                { error: "Failed to fetch result" },
                { status: response.status }
            );
        }

        const data = await response.json();
        return NextResponse.json(data);
    } catch (error: any) {
        console.error("[Judge0 API] Result fetch error:", error);
        return NextResponse.json(
            { error: "Failed to fetch result" },
            { status: 500 }
        );
    }
}
