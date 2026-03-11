"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Heart, Loader2, RefreshCcw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { marketplaceApi, Listing } from "@/services/marketplace"
import { ProductCard } from "@/components/marketplace/product-card"
import { useToast } from "@/components/ui/custom-toast"
import Link from "next/link"

export default function SavedListingsPage() {
    const { toast } = useToast()
    const [listings, setListings] = useState<Listing[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const fetchSaved = async () => {
        setLoading(true)
        setError(null)
        try {
            const data = await marketplaceApi.getSavedListings()
            setListings(data)
        } catch (err: unknown) {
            const msg = err instanceof Error ? err.message : "Failed to load"
            if (msg.includes("401")) {
                setError("Please log in to view your saved items.")
            } else {
                setError("Failed to load saved items.")
            }
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchSaved()
    }, [])

    const handleSaveToggle = async (id: number) => {
        try {
            const res = await marketplaceApi.toggleSave(id)
            if (res.status === "unsaved") {
                setListings(prev => prev.filter(l => l.id !== id))
                toast({ type: "info", title: "Removed from wishlist" })
            }
        } catch {
            toast({ type: "error", title: "Error", message: "Failed to unsave item." })
        }
    }

    return (
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-8 md:py-12 pb-24">
            <div className="flex items-end justify-between mb-8">
                <div>
                    <h1 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-400 to-rose-400 mb-2">
                        Your Wishlist 💛
                    </h1>
                    <p className="text-slate-400 text-sm md:text-base">
                        Items you've saved for later. Cop them before they sell out!
                    </p>
                </div>
                <Button variant="ghost" size="icon" onClick={fetchSaved} disabled={loading}
                    className="text-slate-400 hover:text-white rounded-full">
                    <RefreshCcw className={`w-5 h-5 ${loading ? "animate-spin" : ""}`} />
                </Button>
            </div>

            {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                    {Array.from({ length: 4 }).map((_, i) => (
                        <div key={i} className="rounded-2xl bg-slate-900/60 border border-slate-800 overflow-hidden animate-pulse">
                            <div className="aspect-[4/3] bg-slate-800" />
                            <div className="p-4 space-y-3">
                                <div className="h-4 bg-slate-800 rounded w-3/4" />
                                <div className="h-3 bg-slate-800 rounded w-full" />
                            </div>
                        </div>
                    ))}
                </div>
            ) : error ? (
                <div className="flex flex-col items-center justify-center py-24 text-center">
                    <Heart className="w-16 h-16 text-slate-700 mb-4" />
                    <h3 className="text-xl font-bold text-slate-300 mb-2">Oops!</h3>
                    <p className="text-slate-500 mb-6 max-w-sm">{error}</p>
                    {error.includes("log in") && (
                        <Link href="/login">
                            <Button className="bg-blue-600 hover:bg-blue-500 text-white rounded-xl">
                                Go to Login
                            </Button>
                        </Link>
                    )}
                </div>
            ) : listings.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-24 text-center">
                    <Heart className="w-16 h-16 text-slate-700 mb-4" />
                    <h3 className="text-xl font-bold text-slate-300 mb-2">Wishlist is empty</h3>
                    <p className="text-slate-500 mb-6 max-w-sm">
                        You haven't saved any items yet. Start exploring the marketplace to find sweet deals.
                    </p>
                    <Link href="/marketplace">
                        <Button className="bg-blue-600 hover:bg-blue-500 text-white rounded-xl">
                            Explore Marketplace
                        </Button>
                    </Link>
                </div>
            ) : (
                <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                    <AnimatePresence>
                        {listings.map(listing => (
                            <ProductCard
                                key={listing.id}
                                product={{ ...listing, is_saved: true }} // Force saved state true on this page
                                onSave={() => handleSaveToggle(listing.id)}
                            />
                        ))}
                    </AnimatePresence>
                </motion.div>
            )}
        </div>
    )
}
