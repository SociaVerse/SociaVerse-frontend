import Link from "next/link";
import { ThemeProvider } from "@/components/theme-provider";

export function Footer() {
    const isWaitlistMode = process.env.NEXT_PUBLIC_WAITLIST_MODE === 'true';

    return (
        <footer className="w-full py-10 bg-slate-950 border-t border-slate-900 z-10 text-sm mt-auto relative">
            <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center text-slate-500">
                <div className="flex items-center gap-2 mb-4 md:mb-0">
                    <span className="font-bold text-slate-300">SociaVerse</span>
                    <span>© {new Date().getFullYear()}</span>
                </div>
                <div className="flex gap-6">
                    <Link href="/features" className="hover:text-slate-300 transition-colors">Features</Link>
                    {!isWaitlistMode && (
                        <>
                            <Link href="/events" className="hover:text-slate-300 transition-colors">Events</Link>
                            <Link href="/explore" className="hover:text-slate-300 transition-colors">Explore</Link>
                        </>
                    )}
                </div>
            </div>
        </footer>
    );
}
