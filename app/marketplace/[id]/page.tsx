"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowLeft, MessageCircle, Share2, Heart, ShieldCheck, Clock, MapPin, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useMarketplace } from "@/context/marketplace-context"
import { cn } from "@/lib/utils"

export default function ProductDetailsPage() {
    const params = useParams()
    const router = useRouter()
    const { products } = useMarketplace()
    const [activeImageIndex, setActiveImageIndex] = useState(0)

    const productId = params.id as string
    const product = products.find(p => p.id === productId)

    if (!product) {
        return (
            <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-center p-4">
                <h1 className="text-2xl font-bold text-white mb-2">Product Not Found</h1>
                <p className="text-slate-400 mb-6">The item you are looking for does not exist or has been removed.</p>
                <Link href="/marketplace">
                    <Button variant="outline">Return to Marketplace</Button>
                </Link>
            </div>
        )
    }

    const formatPrice = (price: number, currency: string) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: currency,
            maximumFractionDigits: 0,
        }).format(price)
    }

    const handleInquire = () => {
        const params = new URLSearchParams({
            seller: product.seller.username,
            sellerName: product.seller.name,
            product: product.title,
        })
        router.push(`/chat?${params.toString()}`)
    }

    const nextImage = () => {
        setActiveImageIndex((prev) => (prev + 1) % product.images.length)
    }

    const prevImage = () => {
        setActiveImageIndex((prev) => (prev - 1 + product.images.length) % product.images.length)
    }

    return (
        <div className="min-h-screen bg-slate-950 pt-24 pb-20 px-4 md:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <Link href="/marketplace" className="inline-flex items-center text-slate-400 hover:text-white transition-colors mb-6 group">
                    <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                    Back to Marketplace
                </Link>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
                    {/* Image Gallery */}
                    <div className="space-y-4">
                        <div className="relative aspect-[4/3] bg-slate-900 rounded-2xl overflow-hidden border border-slate-800">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={activeImageIndex}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.3 }}
                                    className="absolute inset-0"
                                >
                                    <Image
                                        src={product.images[activeImageIndex]}
                                        alt={`${product.title} - Image ${activeImageIndex + 1}`}
                                        fill
                                        className="object-cover"
                                        priority
                                    />
                                </motion.div>
                            </AnimatePresence>

                            {/* Navigation Arrows (only if multiple images) */}
                            {product.images.length > 1 && (
                                <>
                                    <button
                                        onClick={prevImage}
                                        className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 backdrop-blur text-white hover:bg-black/70 transition-colors"
                                    >
                                        <ChevronLeft className="w-5 h-5" />
                                    </button>
                                    <button
                                        onClick={nextImage}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 backdrop-blur text-white hover:bg-black/70 transition-colors"
                                    >
                                        <ChevronRight className="w-5 h-5" />
                                    </button>
                                </>
                            )}
                        </div>

                        {/* Thumbnails */}
                        {product.images.length > 1 && (
                            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                                {product.images.map((img, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setActiveImageIndex(idx)}
                                        className={cn(
                                            "relative flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all",
                                            activeImageIndex === idx ? "border-blue-500 ring-2 ring-blue-500/20" : "border-transparent opacity-60 hover:opacity-100"
                                        )}
                                    >
                                        <Image src={img} alt={`Thumbnail ${idx + 1}`} fill className="object-cover" />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Product Details */}
                    <div className="space-y-8">
                        <div>
                            <div className="flex justify-between items-start">
                                <div>
                                    <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">{product.title}</h1>
                                    <div className="text-2xl md:text-3xl font-bold text-emerald-400">
                                        {formatPrice(product.price, product.currency)}
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <Button variant="ghost" size="icon" className="rounded-full hover:bg-slate-800 text-slate-400 hover:text-white">
                                        <Share2 className="w-5 h-5" />
                                    </Button>
                                    <Button variant="ghost" size="icon" className="rounded-full hover:bg-slate-800 text-slate-400 hover:text-red-500">
                                        <Heart className="w-5 h-5" />
                                    </Button>
                                </div>
                            </div>

                            <div className="mt-6 p-4 rounded-xl bg-slate-900/50 border border-slate-800 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-lg font-bold text-white border border-slate-700">
                                        {product.seller.avatar}
                                    </div>
                                    <div>
                                        <div className="text-white font-medium">{product.seller.name}</div>
                                        <div className="text-sm text-slate-400">@{product.seller.username}</div>
                                    </div>
                                </div>
                                <Button onClick={handleInquire} className="bg-blue-600 hover:bg-blue-500 text-white rounded-full">
                                    <MessageCircle className="w-4 h-4 mr-2" />
                                    Chat with Seller
                                </Button>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-white">Description</h3>
                            <p className="text-slate-300 leading-relaxed whitespace-pre-line">
                                {product.description}
                            </p>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-4 rounded-xl bg-slate-900/30 border border-slate-800/50 flex items-center gap-3">
                                <ShieldCheck className="w-8 h-8 text-blue-400" />
                                <div>
                                    <div className="font-medium text-slate-200">Verified Student</div>
                                    <div className="text-xs text-slate-500">Safety verified</div>
                                </div>
                            </div>
                            <div className="p-4 rounded-xl bg-slate-900/30 border border-slate-800/50 flex items-center gap-3">
                                <Clock className="w-8 h-8 text-purple-400" />
                                <div>
                                    <div className="font-medium text-slate-200">Quick Response</div>
                                    <div className="text-xs text-slate-500">Usually replies in 1h</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
