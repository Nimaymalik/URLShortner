// Here the validation of the URL logic is written
import { CODE_REGEX } from "./shortCode";

export function validateUrl(url: string): string {
    try {
        const u = new URL(url);
        if (u.protocol !== "http:" && u.protocol !== "https:") {
            throw new Error("Only http/https URLs are allowed");
        }
        return u.toString();
    } catch {
        throw new Error("Invalid URL");
    }
}

// validation of the shortcode
export function validateCustomCode(code: string) {
    if (!CODE_REGEX.test(code)) {
        throw new Error("Code must be 6–8 chars [A-Za-z0-9]");
    }
}
