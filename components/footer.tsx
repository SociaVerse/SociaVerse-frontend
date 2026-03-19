"use client"

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeProvider } from "@/components/theme-provider";

export function Footer() {
    const isWaitlistMode = process.env.NEXT_PUBLIC_WAITLIST_MODE === 'true';
    const pathname = usePathname();

    // Hide footer on app-like views where we need 100vh layout without document scrolling
    if (pathname?.startsWith('/community') || pathname?.startsWith('/chat')) {
        return null;
    }

    return (
        <footer className="w-full py-10 bg-slate-950 border-t border-slate-900 z-10 text-sm mt-auto relative">
            <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center text-slate-500">
                <div className="flex items-center gap-2 mb-4 md:mb-0">
                    <span className="font-bold text-slate-300">SociaVerse</span>
                    <span>© {new Date().getFullYear()}</span>
                </div>
                <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 mt-4 md:mt-0">
                    <Link href="/features" className="hover:text-slate-300 transition-colors">Features</Link>
                    {!isWaitlistMode && (
                        <>
                            <Link href="/events" className="hover:text-slate-300 transition-colors">Events</Link>
                            <Link href="/explore" className="hover:text-slate-300 transition-colors">Explore</Link>
                        </>
                    )}
                    <Link href="/terms" className="hover:text-slate-300 transition-colors">Terms of Service</Link>
                    <Link href="/privacy-policy" className="hover:text-slate-300 transition-colors">Privacy Policy</Link>
                </div>
            </div>
        </footer>
    );
}
