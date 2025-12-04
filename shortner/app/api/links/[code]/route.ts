// This is the page where we can Get and Delete the URL pasted by User
import { NextRequest, NextResponse } from "next/server";
import { dbQuery } from "@/lib/db";

interface Params {
    params: Promise<{ code: string }>;
}

export async function GET(req: NextRequest, { params }: Params) {
    const { code } = await params;

    const result = await dbQuery(
        `SELECT code, url, click_count, last_clicked_at, created_at
     FROM links
     WHERE code = $1`,
        [code]
    );

    if (result.rows.length === 0) {
        return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json(result.rows[0]);
}

export async function DELETE(req: NextRequest, { params }: Params) {
    const { code } = await params;

    const result = await dbQuery(
        `DELETE FROM links
     WHERE code = $1
     RETURNING code`,
        [code]
    );

    if (result.rows.length === 0) {
        return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    // After deletion, redirect /:code will 404 because row is gone.
    return NextResponse.json({ ok: true });
}
