"use client"

import Link from "next/link";
import { usePathname } from "next/navigation";

export function Footer() {
    const pathname = usePathname();

    // Hide footer on app-like views
    if (pathname?.startsWith('/community') || pathname?.startsWith('/chat')) {
        return null;
    }

    const footerLinks = [
        { href: "/terms", label: "Terms of Service" },
        { href: "/privacy-policy", label: "Privacy Policy" },
        { href: "/child-safety", label: "CSAM Policy" },
        { href: "/features", label: "Features" },
        { href: "/team", label: "About the Team" },
        { href: "/account-delete", label: "Help & Support" },
    ];

    return (
        <footer className="w-full bg-black border-t border-zinc-900 z-10 mt-auto relative">
            <div className="max-w-6xl mx-auto px-6 py-12">
                {/* Top row - Brand */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
                    <div>
                        <span className="text-lg font-black text-white tracking-wider">SOCIAVERSE</span>
                        <p className="text-zinc-600 text-xs mt-1 max-w-xs">Where your voice matters. Anonymous posting, discussions, and polls with exciting rewards.</p>
                    </div>
                </div>

                {/* Links grid */}
                <div className="flex flex-wrap gap-x-8 gap-y-3 mb-8">
                    {footerLinks.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className="text-sm text-zinc-500 hover:text-red-500 transition-colors duration-200"
                        >
                            {link.label}
                        </Link>
                    ))}
                </div>

                {/* Divider */}
                <div className="h-px bg-zinc-900 mb-6" />

                {/* Bottom row */}
                <div className="flex flex-col sm:flex-row justify-between items-center gap-3 text-xs text-zinc-700">
                    <span>© {new Date().getFullYear()} SociaVerse. All rights reserved.</span>
                    <span>Made with conviction.</span>
                </div>
            </div>
        </footer>
    );
}
