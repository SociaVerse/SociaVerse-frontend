"use client";

import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { LoadingScreen } from "./loading-screen";

const getPageName = (path: string) => {
    if (path === "/") return "Home Base";
    if (path.startsWith("/feed")) return "Social Grid";
    if (path.startsWith("/games")) return "Arcade Zone";
    if (path.startsWith("/events")) return "Event Horizon";
    if (path.startsWith("/marketplace")) return "The Bazaar";
    if (path.startsWith("/profile")) return "Identity Core";
    if (path.startsWith("/socialink")) return "SociaLink Uplink";
    if (path.startsWith("/explore")) return "Discovery Module";
    if (path.startsWith("/community")) return "Community Nexus";
    if (path.startsWith("/settings")) return "Control Center";
    return "Unknown Sector";
};

export default function PageTransition({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const [isLoading, setIsLoading] = useState(false);
    const [destination, setDestination] = useState("");

    useEffect(() => {
        // When pathname changes, trigger loading
        setIsLoading(true);
        setDestination(getPageName(pathname));

        // Randomize loading time slightly to make it feel organic (1.5s - 2.5s)
        const randomDuration = Math.floor(Math.random() * (2500 - 1500 + 1)) + 1500;

        const timer = setTimeout(() => {
            setIsLoading(false);
        }, randomDuration);

        return () => clearTimeout(timer);
    }, [pathname]);

    return (
        <>
            <AnimatePresence mode="wait">
                {isLoading && <LoadingScreen destination={destination} key="loading-screen" />}
            </AnimatePresence>

            <motion.div
                key={pathname}
                initial={{ opacity: 0, y: 20 }}
                animate={{
                    opacity: isLoading ? 0 : 1,
                    y: isLoading ? 20 : 0
                }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="h-full w-full"
            >
                {children}
            </motion.div>
        </>
    );
}
