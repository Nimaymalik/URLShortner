// Tihs is the dashboard page
"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function LayoutShell({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

    return (
        <div className="min-h-screen flex flex-col">
            <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-[#0B0F19]/80 backdrop-blur-md">
                <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
                    <Link href="/" className="group flex items-center gap-2 transition-opacity hover:opacity-80">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg shadow-purple-500/20">
                            <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                            </svg>
                        </div>
                        <h1 className="text-xl font-bold tracking-tight text-white">
                            Short<span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-emerald-400">Link</span>
                        </h1>
                    </Link>
                    <nav className="flex gap-6 text-sm font-medium">
                        <Link
                            href="/"
                            className={
                                "transition-colors duration-200 " +
                                (pathname === "/" ? "text-white" : "text-slate-400 hover:text-white")
                            }
                        >
                            Dashboard
                        </Link>
                    </nav>
                </div>
            </header>
            <main className="mx-auto w-full max-w-5xl flex-1 px-6 pt-28 pb-12">{children}</main>
            <footer className="border-t border-white/5 py-8 text-center text-xs text-slate-500">
                <p>ShortLink URL Shortener</p>
            </footer>
        </div>
    );
}
