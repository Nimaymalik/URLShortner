import { NextRequest, NextResponse } from "next/server";
import { dbQuery } from "@/lib/db";

interface Params {
    params: Promise<{ code: string }>;
}

export async function GET(req: NextRequest, { params }: Params) {
    const { code } = await params;

    console.log(`[REDIRECT] Attempting to redirect for code: ${code}`);

    try {
        const result = await dbQuery<{ url: string }>(
            `UPDATE links
         SET click_count = click_count + 1,
             last_clicked_at = now()
         WHERE code = $1
         RETURNING url`,
            [code]
        );

        console.log(`[REDIRECT] Query result:`, result.rows);

        if (result.rows.length === 0) {
            console.log(`[REDIRECT] Code not found: ${code}`);
            return new NextResponse("Not found", { status: 404 });
        }

        const target = result.rows[0].url;
        console.log(`[REDIRECT] Redirecting to: ${target}`);
        return NextResponse.redirect(target, { status: 302 });
    } catch (error) {
        console.error(`[REDIRECT] Error:`, error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
