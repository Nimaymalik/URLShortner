"use client";

import React, { useMemo, useState } from "react";

export interface LinkRow {
    code: string;
    url: string;
    click_count: number;
    last_clicked_at: string | null;
    created_at: string;
}

interface Props {
    links: LinkRow[];
    onDeleted: (code: string) => void;
}

export default function LinksTable({ links, onDeleted }: Props) {
    const [filter, setFilter] = useState("");
    const [deleting, setDeleting] = useState<string | null>(null);

    const filtered = useMemo(() => {
        const f = filter.trim().toLowerCase();
        if (!f) return links;
        return links.filter(
            (l) =>
                l.code.toLowerCase().includes(f) ||
                l.url.toLowerCase().includes(f)
        );
    }, [filter, links]);

    const handleDelete = async (code: string) => {
        if (!confirm(`Delete /${code}?`)) return;
        setDeleting(code);
        try {
            const res = await fetch(`/api/links/${code}`, { method: "DELETE" });
            if (res.ok) {
                onDeleted(code);
            } else {
                alert("Failed to delete");
            }
        } finally {
            setDeleting(null);
        }
    };

    return (
        <section className="bg-white/5 backdrop-blur-xl border border-white/10 shadow-xl rounded-2xl p-6">
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <h2 className="text-lg font-semibold text-white">Your Links</h2>
                <div className="relative w-full max-w-xs">
                    <input
                        type="text"
                        placeholder="Search links..."
                        className="bg-white/5 border border-white/10 text-white placeholder:text-slate-400 focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all duration-300 w-full rounded-xl px-4 py-2 pl-10 text-sm outline-none"
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                    />
                    <svg className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </div>
            </div>

            <div className="overflow-hidden rounded-xl border border-white/5 bg-black/20">
                <div className="overflow-x-auto">
                    <table className="min-w-full text-left text-sm">
                        <thead className="bg-white/5 text-xs uppercase tracking-wider text-slate-400">
                            <tr>
                                <th className="px-6 py-4 font-medium">Short Link</th>
                                <th className="px-6 py-4 font-medium">Target URL</th>
                                <th className="px-6 py-4 font-medium text-right">Clicks</th>
                                <th className="px-6 py-4 font-medium">Last Activity</th>
                                <th className="px-6 py-4 font-medium"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {filtered.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                                        <div className="flex flex-col items-center gap-2">
                                            <svg className="h-8 w-8 opacity-20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                                            </svg>
                                            <p>No links found</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                            {filtered.map((link) => (
                                <tr key={link.code} className="group transition-colors hover:bg-white/5">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <a
                                                href={`/${link.code}`}
                                                className="flex items-center gap-1 font-medium text-blue-400 transition-colors hover:text-blue-300"
                                                target="_blank"
                                            >
                                                <span className="opacity-50">/</span>
                                                {link.code}
                                            </a>
                                            <button
                                                onClick={() => {
                                                    const url = `${window.location.origin}/${link.code}`;
                                                    navigator.clipboard.writeText(url);
                                                }}
                                                className="opacity-0 group-hover:opacity-100 rounded p-1 text-slate-500 hover:text-blue-400 transition-all"
                                                title="Copy short link"
                                            >
                                                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                                </svg>
                                            </button>
                                            <a
                                                href={`/code/${link.code}`}
                                                className="opacity-0 group-hover:opacity-100 rounded p-1 text-slate-500 hover:text-purple-400 transition-all"
                                                title="View stats"
                                            >
                                                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                                </svg>
                                            </a>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="max-w-xs truncate text-slate-300 sm:max-w-md">
                                            <a
                                                href={link.url}
                                                target="_blank"
                                                className="transition-colors hover:text-white hover:underline"
                                            >
                                                {link.url}
                                            </a>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <span className="inline-flex items-center rounded-full bg-white/5 px-2.5 py-0.5 text-xs font-medium text-slate-300">
                                            {link.click_count}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-slate-400">
                                        {link.last_clicked_at
                                            ? new Date(link.last_clicked_at).toLocaleDateString(undefined, {
                                                month: 'short',
                                                day: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })
                                            : "—"}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button
                                            onClick={() => handleDelete(link.code)}
                                            disabled={deleting === link.code}
                                            className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-red-500/10 hover:text-red-400 disabled:opacity-50"
                                            title="Delete link"
                                        >
                                            {deleting === link.code ? (
                                                <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                                </svg>
                                            ) : (
                                                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                </svg>
                                            )}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </section>
    );
}
