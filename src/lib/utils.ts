import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function parseDate(dateString: string | null | undefined) {
  if (!dateString) return undefined;
  // Handle "YYYY-MM-DD" strings from Postgres DATE type to prevent timezone shifts
  if (
    typeof dateString === "string" &&
    dateString.match(/^\d{4}-\d{2}-\d{2}$/)
  ) {
    const [year, month, day] = dateString.split("-").map(Number);
    return new Date(year, month - 1, day);
  }
  return new Date(dateString);
}

/**
 * Checks if a date is expired, considering Bolivia Time (UTC-4).
 * A date is considered expired only after 23:59:59 of that date in Bolivia time.
 * @param dateStr The date string (e.g., ISO date or datetime)
 */
export function checkIsExpired(dateStr: string | Date | null | undefined): boolean {
  if (!dateStr) return false;

  let expiryBase: Date;

  // Explicitly handle YYYY-MM-DD string to avoid timezone parsing issues
  if (typeof dateStr === "string" && dateStr.match(/^\d{4}-\d{2}-\d{2}$/)) {
    const [year, month, day] = dateStr.split("-").map(Number);
    // Construct UTC midnight of that date: Date.UTC(2025, 11, 10) -> Dec 10 00:00 UTC
    expiryBase = new Date(Date.UTC(year, month - 1, day));
  } else {
    // Fallback for Date objects or full ISO strings
    const d = new Date(dateStr);
    // Use UTC components to normalize to that UTC date
    expiryBase = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
  }

  // Goal: Expiry is END OF DAY in Bolivia (UTC-4).
  // Dec 10 in Bolivia ends at Dec 11 00:00:00 Bolivia Time.
  // Bolivia (UTC-4) 00:00 = UTC 04:00.
  // So we want the deadline to be Dec 11 04:00:00 UTC.

  const deadline = new Date(expiryBase);
  // Add 1 day
  deadline.setUTCDate(deadline.getUTCDate() + 1);
  // Set to 04:00:00 UTC (Midnight Bolivia + 4 hours)
  deadline.setUTCHours(4, 0, 0, 0);

  const now = new Date();

  // Debug log (remove in prod if noisy, but useful now)
  // console.log("Expiry Check:", { input: dateStr, deadline: deadline.toISOString(), now: now.toISOString(), expired: now >= deadline });

  // If now is AFTER or EQUAL to deadline, it is expired.
  // deadline is Dec 11 04:00 UTC.
  // If now is Dec 9, now < deadline. Not expired.
  return now >= deadline;
}
