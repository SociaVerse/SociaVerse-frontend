"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronLeft, ChevronRight, GraduationCap, Users, Calendar, BookOpen } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const features = [
    {
        title: "Connect with Peers",
        description: "Find and connect with students from your campus and beyond. Build your network early.",
        icon: <Users className="h-12 w-12 text-blue-400" />,
        image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=1000"
    },
    {
        title: "Share Resources",
        description: "Access a vast library of notes, assignments, and study materials shared by top students.",
        icon: <BookOpen className="h-12 w-12 text-indigo-400" />,
        image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&q=80&w=1000"
    },
    {
        title: "Campus Events",
        description: "Never miss out on hackathons, workshops, and cultural fests happening around you.",
        icon: <Calendar className="h-12 w-12 text-purple-400" />,
        image: "https://images.unsplash.com/photo-1523580494863-6f3031224c94?auto=format&fit=crop&q=80&w=1000"
    },
    {
        title: "Student Community",
        description: "Join communities based on your interests, major, or hobbies. Find your tribe.",
        icon: <GraduationCap className="h-12 w-12 text-pink-400" />,
        image: "https://images.unsplash.com/photo-1529390079861-591de354faf5?auto=format&fit=crop&q=80&w=1000"
    }
]

export function LandingCarousel() {
    const [currentIndex, setCurrentIndex] = React.useState(0)
    const [direction, setDirection] = React.useState(0)

    const slideVariants = {
        enter: (direction: number) => ({
            x: direction > 0 ? 1000 : -1000,
            opacity: 0
        }),
        center: {
            zIndex: 1,
            x: 0,
            opacity: 1
        },
        exit: (direction: number) => ({
            zIndex: 0,
            x: direction < 0 ? 1000 : -1000,
            opacity: 0
        })
    }

    const swipeConfidenceThreshold = 10000
    const swipePower = (offset: number, velocity: number) => {
        return Math.abs(offset) * velocity
    }

    const paginate = (newDirection: number) => {
        setDirection(newDirection)
        setCurrentIndex((prevIndex) => (prevIndex + newDirection + features.length) % features.length)
    }

    // Auto-advance
    React.useEffect(() => {
        const timer = setInterval(() => {
            paginate(1)
        }, 5000)
        return () => clearInterval(timer)
    }, [currentIndex])

    return (
        <div className="relative w-full max-w-5xl mx-auto h-[500px] md:h-[600px] overflow-hidden rounded-3xl shadow-2xl border border-slate-800/50 bg-slate-900/50 backdrop-blur-sm">
            <AnimatePresence initial={false} custom={direction}>
                <motion.div
                    key={currentIndex}
                    custom={direction}
                    variants={slideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{
                        x: { type: "spring", stiffness: 300, damping: 30 },
                        opacity: { duration: 0.2 }
                    }}
                    drag="x"
                    dragConstraints={{ left: 0, right: 0 }}
                    dragElastic={1}
                    onDragEnd={(e, { offset, velocity }) => {
                        const swipe = swipePower(offset.x, velocity.x)

                        if (swipe < -swipeConfidenceThreshold) {
                            paginate(1)
                        } else if (swipe > swipeConfidenceThreshold) {
                            paginate(-1)
                        }
                    }}
                    className="absolute inset-0 w-full h-full flex flex-col md:flex-row"
                >
                    {/* Image Section */}
                    <div className="w-full md:w-1/2 h-1/2 md:h-full relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent z-10 md:bg-gradient-to-r" />
                        <img
                            src={features[currentIndex].image}
                            alt={features[currentIndex].title}
                            className="w-full h-full object-cover"
                        />
                    </div>

                    {/* Content Section */}
                    <div className="w-full md:w-1/2 h-1/2 md:h-full p-8 md:p-12 flex flex-col justify-center items-start bg-slate-900/80 backdrop-blur-md">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="mb-6 p-4 rounded-2xl bg-slate-800/50 border border-slate-700/50"
                        >
                            {features[currentIndex].icon}
                        </motion.div>

                        <motion.h3
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="text-3xl md:text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400"
                        >
                            {features[currentIndex].title}
                        </motion.h3>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                            className="text-lg text-slate-400 mb-8 leading-relaxed"
                        >
                            {features[currentIndex].description}
                        </motion.p>

                        <div className="flex gap-2 mt-auto">
                            {features.map((_, index) => (
                                <div
                                    key={index}
                                    className={cn(
                                        "h-2 rounded-full transition-all duration-300",
                                        index === currentIndex ? "w-8 bg-blue-500" : "w-2 bg-slate-700"
                                    )}
                                />
                            ))}
                        </div>
                    </div>
                </motion.div>
            </AnimatePresence>

            {/* Navigation Buttons */}
            <div className="absolute top-1/2 left-4 -translate-y-1/2 z-20 hidden md:block">
                <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-full bg-slate-900/50 hover:bg-slate-800 text-white backdrop-blur-sm border border-slate-700/50 h-12 w-12"
                    onClick={() => paginate(-1)}
                >
                    <ChevronLeft className="h-6 w-6" />
                </Button>
            </div>
            <div className="absolute top-1/2 right-4 -translate-y-1/2 z-20 hidden md:block">
                <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-full bg-slate-900/50 hover:bg-slate-800 text-white backdrop-blur-sm border border-slate-700/50 h-12 w-12"
                    onClick={() => paginate(1)}
                >
                    <ChevronRight className="h-6 w-6" />
                </Button>
            </div>
        </div>
    )
}
