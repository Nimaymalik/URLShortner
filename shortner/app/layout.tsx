// Entry point of the NEXT application where we import all components
import "./globals.css";
import type { Metadata } from "next";
import LayoutShell from "@/components/LayoutShell";

export const metadata: Metadata = {
    title: "ShortLink",
    description: "ShortLink take-home assignment using Next.js + Neon",
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
