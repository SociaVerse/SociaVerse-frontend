"use client";
import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export const BackgroundBeams = ({ className }: { className?: string }) => {
    return (
        <div
            className={cn(
                "absolute top-0 left-0 w-full h-full overflow-hidden bg-black flex flex-col items-center justify-center pointer-events-none",
                className
            )}
        >
            <div className="absolute inset-0 bg-gradient-to-tr from-red-600/8 via-transparent to-rose-900/8 blur-3xl" />
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1 }}
                className="absolute inset-0 h-full w-full bg-black [mask-image:radial-gradient(transparent,white)] pointer-events-none"
            />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-red-600/10 rounded-full blur-[120px] mix-blend-screen animate-pulse duration-3000" />
            <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-rose-900/5 rounded-full blur-[100px] mix-blend-screen" />
            <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-red-950/8 rounded-full blur-[100px] mix-blend-screen" />
        </div>
    );
};
