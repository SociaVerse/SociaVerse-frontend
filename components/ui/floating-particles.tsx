"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export function FloatingParticles() {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {[...Array(20)].map((_, i) => (
                <motion.div
                    key={i}
                    className="absolute bg-blue-500/20 rounded-full blur-[1px]"
                    initial={{
                        x: Math.random() * 100 + "vw",
                        y: Math.random() * 100 + "vh",
                        scale: Math.random() * 0.5 + 0.5,
                        opacity: Math.random() * 0.5 + 0.2,
                    }}
                    animate={{
                        y: [null, Math.random() * 100 + "vh"],
                        opacity: [null, Math.random() * 0.5 + 0.2, 0],
                    }}
                    transition={{
                        duration: Math.random() * 20 + 20,
                        repeat: Infinity,
                        ease: "linear",
                    }}
                    style={{
                        width: Math.random() * 4 + 2 + "px",
                        height: Math.random() * 4 + 2 + "px",
                    }}
                />
            ))}
        </div>
    );
}
