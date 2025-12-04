import { NextRequest, NextResponse } from "next/server";
import { dbQuery } from "@/lib/db";
import { generateCode } from "@/lib/shortCode";
import { validateCustomCode, validateUrl } from "@/lib/validations";

export async function GET() {
    const result = await dbQuery(
        `SELECT code, url, click_count, last_clicked_at, created_at
     FROM links
     ORDER BY created_at DESC`
    );

    return NextResponse.json(result.rows);
}

export async function POST(req: NextRequest) {
    let body;
    try {
        body = await req.json();
    } catch (jsonError) {
        console.error("[API] JSON parse error:", jsonError);
        return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
    }

    try {
        const rawUrl = String(body.url ?? "");
        const rawCode = body.code ? String(body.code) : null;

        if (!rawUrl) {
            return NextResponse.json({ error: "URL is required" }, { status: 400 });
        }

        let url;
        try {
            url = validateUrl(rawUrl);
        } catch (e: any) {
            console.error("[API] URL validation error:", e.message);
            return NextResponse.json({ error: e.message }, { status: 400 });
        }

        let code = rawCode;
        if (code) {
            try {
                validateCustomCode(code);
            } catch (e: any) {
                console.error("[API] Code validation error:", e.message);
                return NextResponse.json({ error: e.message }, { status: 400 });
            }
        } else {
            // generate until unique (few attempts)
            for (let i = 0; i < 5; i++) {
                const candidate = generateCode(6);
                const exists = await dbQuery<{ exists: boolean }>(
                    "SELECT EXISTS(SELECT 1 FROM links WHERE code = $1) AS exists",
                    [candidate]
                );
                if (!exists.rows[0].exists) {
                    code = candidate;
                    break;
                }
            }
            if (!code) {
                return NextResponse.json(
                    { error: "Failed to generate unique code" },
                    { status: 500 }
                );
            }
        }

        // Insert
        try {
            const inserted = await dbQuery(
                `INSERT INTO links (code, url)
         VALUES ($1, $2)
         RETURNING code, url, click_count, last_clicked_at, created_at`,
                [code, url]
            );
            console.log("[API] Link created successfully:", code);
            return NextResponse.json(inserted.rows[0], { status: 201 });
        } catch (e: any) {
            // unique violation
            if (e?.code === "23505") {
                return NextResponse.json(
                    { error: "Code already exists" },
                    { status: 409 }
                );
            }
            console.error("[API] Database error:", e);
            return NextResponse.json(
                { error: "Database error: " + e.message },
                { status: 500 }
            );
        }
    } catch (e: any) {
        console.error("[API] Unexpected error:", e);
        return NextResponse.json(
            { error: "Unexpected error: " + e.message },
            { status: 500 }
        );
    }
}
