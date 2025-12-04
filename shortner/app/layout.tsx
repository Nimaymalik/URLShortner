import "./globals.css";
import type { Metadata } from "next";
import LayoutShell from "@/components/LayoutShell";

export const metadata: Metadata = {
    title: "TinyLink — URL shortener",
    description: "TinyLink take-home assignment using Next.js + Neon",
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <body className="bg-slate-950 text-slate-50">
                <LayoutShell>{children}</LayoutShell>
            </body>
        </html>
    );
}
