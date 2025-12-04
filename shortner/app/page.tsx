"use client";

import React, { useEffect, useState } from "react";
import LinkForm from "@/components/LinkForm";
import LinksTable, { LinkRow } from "@/components/LinksTable";

export default function DashboardPage() {
    const [links, setLinks] = useState<LinkRow[]>([]);
    const [loading, setLoading] = useState(true);

    const loadLinks = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/links");
            const data = await res.json();
            setLinks(data);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadLinks();
    }, []);

    const handleDeleted = (code: string) => {
        setLinks((prev) => prev.filter((l) => l.code !== code));
    };

    return (
        <div className="space-y-8">
            <div className="flex flex-col gap-6 lg:flex-row">
                <div className="flex-1">
                    <LinkForm onCreated={loadLinks} />
                </div>
                <div className="flex-1 bg-white/5 backdrop-blur-xl border border-white/10 shadow-xl rounded-2xl p-6 md:p-8 text-sm text-slate-300">
                    <h2 className="mb-4 text-lg font-semibold text-white">
                        How it works
                    </h2>
                    <ul className="space-y-3 text-sm leading-relaxed">
                        <li className="flex gap-3">
                            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-500/20 text-xs font-bold text-blue-400">1</span>
                            <span>Paste a long URL and optionally choose a custom alias.</span>
                        </li>
                        <li className="flex gap-3">
                            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-purple-500/20 text-xs font-bold text-purple-400">2</span>
                            <span>We validate the URL and ensure the code is globally unique.</span>
                        </li>
                        <li className="flex gap-3">
                            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-500/20 text-xs font-bold text-emerald-400">3</span>
                            <span>
                                Share your short link: <code className="rounded bg-white/10 px-1.5 py-0.5 text-white">https://your-domain.com/&lt;code&gt;</code>.
                            </span>
                        </li>
                        <li className="flex gap-3">
                            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-pink-500/20 text-xs font-bold text-pink-400">4</span>
                            <span>Each visit redirects instantly and tracks click stats.</span>
                        </li>
                    </ul>
                </div>
            </div>

            {loading ? (
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 shadow-xl rounded-2xl p-12 text-center text-slate-400">
                    <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-2 border-white/10 border-t-blue-500"></div>
                    Loading links...
                </div>
            ) : (
                <LinksTable links={links} onDeleted={handleDeleted} />
            )}
        </div>
    );
}
