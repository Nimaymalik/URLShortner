// This is the stats page of the URL which the URL has created of the specific URL

import { dbQuery } from "@/lib/db";
import { notFound } from "next/navigation";

interface Props {
    params: Promise<{ code: string }>;
}

export const dynamic = "force-dynamic";

export default async function StatsPage({ params }: Props) {
    const { code } = await params;

    const result = await dbQuery(
        `SELECT code, url, click_count, last_clicked_at, created_at
     FROM links
     WHERE code = $1`,
        [code]
    );

    if (result.rows.length === 0) {
        notFound();
    }

    const link = result.rows[0];

    return (
        <div className="space-y-6">
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 shadow-xl rounded-2xl p-6 md:p-8">
                <h1 className="text-2xl font-bold text-white">
                    Stats for <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-emerald-400">/{link.code}</span>
                </h1>
                <div className="mt-4 flex flex-col gap-2 text-sm text-slate-300 sm:flex-row sm:items-center">
                    <span className="font-medium text-slate-400">Target URL:</span>
                    <a
                        href={link.url}
                        className="truncate text-blue-400 hover:text-blue-300 hover:underline"
                        target="_blank"
                    >
                        {link.url}
                    </a>
                </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
                <StatCard
                    label="Total clicks"
                    value={String(link.click_count)}
                    icon={
                        <svg className="h-5 w-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                    }
                />
                <StatCard
                    label="Last clicked"
                    value={
                        link.last_clicked_at
                            ? new Date(link.last_clicked_at).toLocaleString()
                            : "Never"
                    }
                    icon={
                        <svg className="h-5 w-5 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    }
                />
                <StatCard
                    label="Created at"
                    value={new Date(link.created_at).toLocaleString()}
                    icon={
                        <svg className="h-5 w-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                    }
                />
            </div>
        </div>
    );
}

function StatCard({ label, value, icon }: { label: string; value: string; icon: React.ReactNode }) {
    return (
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 shadow-xl rounded-2xl p-6 transition-transform hover:scale-[1.02]">
            <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/5">
                    {icon}
                </div>
                <div>
                    <div className="text-xs font-medium uppercase tracking-wider text-slate-400">
                        {label}
                    </div>
                    <div className="mt-0.5 text-lg font-bold text-white">
                        {value}
                    </div>
                </div>
            </div>
        </div>
    );
}
