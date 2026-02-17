"use client";

import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { WelcomeScreen, AuthLoadingScreen } from "./loading-screen";

export default function PageTransition({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const [showWelcome, setShowWelcome] = useState(false);
    const [showAuthLoading, setShowAuthLoading] = useState(false);

    useEffect(() => {
        // Check if user has visited before in this session
        const hasVisited = sessionStorage.getItem("hasVisited");

        if (!hasVisited) {
            setShowWelcome(true);
            sessionStorage.setItem("hasVisited", "true");
        }
    }, []);

    useEffect(() => {
        // Trigger Auth Loading Screen for Login/Signup
        if (pathname === "/login" || pathname === "/signup") {
            setShowAuthLoading(true);
            const timer = setTimeout(() => {
                setShowAuthLoading(false);
            }, 1000); // 1s delay for effect
            return () => clearTimeout(timer);
        } else {
            setShowAuthLoading(false);
        }
    }, [pathname]);

    const handleWelcomeComplete = () => {
        setTimeout(() => {
            setShowWelcome(false);
        }, 500);
    };

    return (
        <>
            <AnimatePresence mode="wait">
                {showWelcome && <WelcomeScreen onComplete={handleWelcomeComplete} key="welcome-screen" />}
                {!showWelcome && showAuthLoading && <AuthLoadingScreen key="auth-loading" />}
            </AnimatePresence>

            <motion.div
                key={pathname}
                initial={{ opacity: 0, y: 20 }}
                animate={{
                    opacity: 1,
                    y: 0
                }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="h-full w-full"
            >
                {children}
            </motion.div>
        </>
    );
}
