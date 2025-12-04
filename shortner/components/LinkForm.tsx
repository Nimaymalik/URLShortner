"use client";

import React, { useState } from "react";

interface Props {
    onCreated: () => void;
}

export default function LinkForm({ onCreated }: Props) {
    const [url, setUrl] = useState("");
    const [code, setCode] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [successCode, setSuccessCode] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSuccessCode(null);

        if (!url.trim()) {
            setError("URL is required");
            return;
        }

        setLoading(true);
        try {
            const res = await fetch("/api/links", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    url: url.trim(),
                    code: code.trim() || undefined,
                }),
            });

            if (!res.ok) {
                const data = await res.json().catch(() => ({}));
                setError(data.error || "Failed to create link");
            } else {
                const data = await res.json();
                setSuccessCode(data.code);
                setUrl("");
                setCode("");
                onCreated();
            }
        } catch (err) {
            console.error(err);
            setError("Network error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="bg-white/5 backdrop-blur-xl border border-white/10 shadow-xl rounded-2xl p-6 md:p-8"
        >
            <div className="mb-6 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-white">Create Short Link</h2>
                <div className="h-2 w-2 animate-pulse rounded-full bg-emerald-500 shadow-[0_0_10px_#10B981]"></div>
            </div>

            <div className="space-y-5">
                <div className="space-y-2">
                    <label className="text-xs font-medium uppercase tracking-wider text-slate-400">Target URL</label>
                    <div className="relative">
                        <input
                            type="url"
                            className="bg-white/5 border border-white/10 text-white placeholder:text-slate-400 focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all duration-300 w-full rounded-xl px-4 py-3 text-sm outline-none"
                            placeholder="https://example.com/very/long/url"
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                        />
                        <div className="absolute right-3 top-3 text-slate-500">
                            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                            </svg>
                        </div>
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-xs font-medium uppercase tracking-wider text-slate-400">
                        Custom code <span className="text-slate-600">(optional)</span>
                    </label>
                    <div className="relative">
                        <span className="absolute left-4 top-3 text-slate-500">/</span>
                        <input
                            type="text"
                            className="bg-white/5 border border-white/10 text-white placeholder:text-slate-400 focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all duration-300 w-full rounded-xl px-4 py-3 pl-8 text-sm outline-none"
                            placeholder="custom-alias"
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                        />
                    </div>
                    <p className="text-[11px] text-slate-500">
                        Leave empty to auto-generate a random code.
                    </p>
                </div>

                {error && (
                    <div className="flex items-center gap-2 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                        <svg className="h-5 w-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {error}
                    </div>
                )}

                {successCode && (
                    <div className="flex items-center gap-2 rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">
                        <svg className="h-5 w-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span>Short link created: <code className="font-bold text-white">/{successCode}</code></span>
                    </div>
                )}

                <button
                    type="submit"
                    disabled={loading}
                    className="group relative w-full overflow-hidden rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 px-4 py-3.5 text-sm font-semibold text-white shadow-lg shadow-purple-500/25 transition-all hover:shadow-purple-500/40 disabled:opacity-70"
                >
                    <span className="relative z-10 flex items-center justify-center gap-2">
                        {loading ? (
                            <>
                                <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                </svg>
                                Creating...
                            </>
                        ) : (
                            <>
                                Shorten URL
                                <svg className="h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                </svg>
                            </>
                        )}
                    </span>
                    <div className="absolute inset-0 -z-0 bg-gradient-to-r from-emerald-500 to-blue-500 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
                </button>
            </div>
        </form>
    );
}
