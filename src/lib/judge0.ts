// IDs for Judge0 Standard / Public (ce.judge0.com)
export const JUDGE0_LANGUAGE_IDS: Record<string, number> = {
  javascript: 63, // Node.js 12.14.0
  python: 71,     // Python 3.8.1
  java: 62,       // OpenJDK 13.0.1
  php: 68,        // PHP 7.4.1
};

export interface Judge0Submission {
  source_code: string;
  language_id: number;
  stdin?: string;
  expected_output?: string;
  cpu_time_limit?: number; // seconds
  memory_limit?: number; // KB
}

export interface Judge0Response {
  stdout: string | null;
  stderr: string | null;
  compile_output: string | null;
  message: string | null;
  exit_code: number;
  exit_signal: number;
  status: {
    id: number;
    description: string;
  };
  time: string;
  memory: number;
  token: string;
}

const JUDGE0_API_URL = (() => {
  // Prefer environment variable, fallback to public CE instance if not set to RapidAPI
  const envUrl = process.env.JUDGE0_API_URL || process.env.JUDGE0_URL;
  if (!envUrl) return "https://ce.judge0.com"; // Default to free instance

  return envUrl.startsWith("http") ? envUrl : `https://${envUrl}`;
})();

const JUDGE0_API_KEY =
  process.env.JUDGE0_API_KEY || process.env.RAPIDAPI_KEY;
const JUDGE0_API_HOST =
  process.env.JUDGE0_API_HOST ||
  process.env.RAPIDAPI_HOST ||
  "judge0-ce.p.rapidapi.com";

export async function createSubmission(
  submission: Judge0Submission
): Promise<string> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  // Only add RapidAPI headers if we are using a RapidAPI URL or if explicitly set and not using public instance
  const isPublicInstance = JUDGE0_API_URL.includes("judge0.com") && !JUDGE0_API_URL.includes("rapidapi");

  if (JUDGE0_API_KEY && !isPublicInstance) {
    headers["X-RapidAPI-Key"] = JUDGE0_API_KEY;
    headers["X-RapidAPI-Host"] = JUDGE0_API_HOST;
  }

  let lastError;

  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      if (attempt > 1) {
        console.log(`[Judge0] Retrying submission (attempt ${attempt}/3)...`);
        await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
      }

      console.log(`[Judge0] Creating submission at: ${JUDGE0_API_URL}/submissions`);
      // console.log(`[Judge0] Headers:`, JSON.stringify(headers, null, 2)); // Uncomment for deep debug

      const response = await fetch(
        `${JUDGE0_API_URL}/submissions?base64_encoded=false&wait=false`,
        {
          method: "POST",
          headers,
          body: JSON.stringify(submission),
        }
      );

      if (!response.ok) {
        const error = await response.text();
        // If it's a 5xx error (server error), we retry. Otherwise (4xx client error), we throw immediately.
        if (response.status >= 500) {
          throw new Error(`Judge0 Server Error (${response.status}): ${error}`);
        }
        throw new Error(`Judge0 API Error (${response.status}): ${error}`);
      }

      const data = await response.json();
      return data.token;

    } catch (error: any) {
      console.warn(`[Judge0] Attempt ${attempt} failed:`, error.message);
      lastError = error;
      // If it is NOT a timeout/server error (e.g. it's a 400 Bad Request), don't retry
      if (error.message && error.message.includes("Judge0 API Error")) {
        break;
      }
    }
  }

  throw lastError || new Error("Failed to create submission after retries");
}

export async function getSubmissionResult(
  token: string
): Promise<Judge0Response> {
  const headers: Record<string, string> = {};

  if (JUDGE0_API_KEY) {
    headers["X-RapidAPI-Key"] = JUDGE0_API_KEY;
    headers["X-RapidAPI-Host"] = JUDGE0_API_HOST;
  }

  const response = await fetch(
    `${JUDGE0_API_URL}/submissions/${token}?base64_encoded=false&fields=stdout,stderr,status,message,compile_output,time,memory`,
    {
      method: "GET",
      headers,
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch submission result");
  }

  return response.json();
}
