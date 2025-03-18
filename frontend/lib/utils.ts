import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function extractOutput(apiResponse: string): string {
  try {
    const parsedResponse = JSON.parse(apiResponse);
    let output = parsedResponse.output ?? "";
    output = output.replace(/```/g, "").replace(/^"|"$/g, "");

    const match = output.match(/$begin:math:display$([^$end:math:display$]+)\]/);
    if (match) {
      return match[1].replace(/'/g, "").trim();
    }

    return output.trim();
  } catch (error) {
    console.error("Invalid JSON:", error);
    return "";
  }
}
