"use client"

import { useState, useRef, useCallback, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
    Search, Filter, ShoppingBag, Plus, Banknote, AlignLeft, X, Upload,
    ImageIcon, CheckCircle2, SlidersHorizontal, ChevronDown, Loader2,
    MapPin, Type, RotateCcw,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ProductCard } from "@/components/marketplace/product-card"
import {
    Sheet, SheetContent, SheetTitle, SheetDescription, SheetTrigger, SheetFooter,
} from "@/components/ui/sheet"
import { cn } from "@/lib/utils"
import { useToast } from "@/components/ui/custom-toast"
import { useMarketplace } from "@/context/marketplace-context"
import Image from "next/image"
import Link from "next/link"

// ── Constants ─────────────────────────────────────────────────────────────────

const CATEGORIES = [
    { value: "", label: "All", emoji: "🏪" },
    { value: "electronics", label: "Electronics", emoji: "💻" },
    { value: "books", label: "Books", emoji: "📚" },
    { value: "clothing", label: "Clothing", emoji: "👕" },
    { value: "furniture", label: "Furniture", emoji: "🪑" },
    { value: "vehicles", label: "Vehicles", emoji: "🛵" },
    { value: "sports", label: "Sports", emoji: "⚽" },
    { value: "services", label: "Services", emoji: "🛠️" },
    { value: "stationery", label: "Stationery", emoji: "✏️" },
    { value: "other", label: "Other", emoji: "📦" },
]

const CONDITIONS = [
    { value: "", label: "Any condition" },
    { value: "new", label: "New" },
    { value: "like_new", label: "Like New" },
    { value: "good", label: "Good" },
    { value: "fair", label: "Fair" },
]

const SORT_OPTIONS = [
    { value: "", label: "Newest" },
    { value: "price", label: "Price: Low → High" },
    { value: "-price", label: "Price: High → Low" },
]

const CURRENCIES = ["INR", "USD", "EUR", "GBP"]

const MAX_IMAGES = 10
const MAX_FILE_SIZE_MB = 8

// ── Main Component ─────────────────────────────────────────────────────────────

export default function MarketplaceComingSoonPage() {
    return (
        <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-6 text-center relative overflow-hidden">
            {/* Ambient glows with animation */}
            <motion.div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none"
                animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div
                className="absolute top-1/4 right-1/4 w-[300px] h-[300px] bg-blue-500/10 rounded-full blur-[100px] pointer-events-none"
                animate={{ scale: [1, 1.5, 1], opacity: [0.3, 0.6, 0.3] }}
                transition={{ duration: 5, delay: 1, repeat: Infinity, ease: "easeInOut" }}
            />

            <motion.div
                className="relative z-10 flex flex-col items-center"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
            >
                <motion.div
                    className="w-20 h-20 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center mb-8 shadow-2xl overflow-hidden relative"
                    whileHover={{ scale: 1.05 }}
                    transition={{ type: "spring", stiffness: 300 }}
                >
                    <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/20 to-blue-500/20 animate-pulse" />
                    <ShoppingBag className="w-10 h-10 text-emerald-400 relative z-10" />
                </motion.div>

                <motion.h1
                    className="text-4xl sm:text-6xl font-black mb-4 tracking-tight"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                >
                    Marketplace <span className="text-emerald-400">V2</span>
                </motion.h1>

                <motion.p
                    className="text-slate-400 text-lg sm:text-xl max-w-xl mx-auto mb-8 leading-relaxed"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                >
                    We are completely revamping the marketplace experience for a better peer-to-peer ecosystem. Get ready for seamless trading, advanced filtering, and instant checkouts coming in Version 2!
                </motion.p>

                <motion.div
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-sm font-bold shadow-lg shadow-emerald-900/20"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.6 }}
                >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Launching Soon</span>
                </motion.div>
            </motion.div>
        </div>
    )
}

function OldMarketplacePage() {
    const { toast, confirm } = useToast()
    const {
        listings, isLoading, error, filters, setFilters,
        createListing, deleteListing, markSold, toggleSave, cart
    } = useMarketplace()

    // ── Sheet state ────────────────────────────────────────────────────────────
    const [sheetOpen, setSheetOpen] = useState(false)
    const [filterOpen, setFilterOpen] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)

    // ── Local search (debounced) ───────────────────────────────────────────────
    const [searchInput, setSearchInput] = useState(filters.search || "")
    useEffect(() => {
        const t = setTimeout(() => setFilters({ ...filters, search: searchInput || undefined }), 400)
        return () => clearTimeout(t)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchInput])


    const handleDelete = async (id: number) => {
        const ok = await confirm({
            title: "Remove listing?",
            description: "This will permanently remove your listing from the marketplace.",
            confirmText: "Remove",
            variant: "danger",
        })
        if (!ok) return
        try {
            await deleteListing(id)
            toast({ type: "info", title: "Listing removed" })
        } catch {
            toast({ type: "error", title: "Error", message: "Could not delete listing." })
        }
    }

    const handleMarkSold = async (id: number) => {
        try {
            await markSold(id)
            toast({ type: "success", title: "Marked as sold!", message: "Your item is now marked as sold." })
        } catch {
            toast({ type: "error", title: "Error", message: "Could not mark as sold." })
        }
    }

    const handleSave = async (id: number) => {
        try {
            const result = await toggleSave(id)
            toast({
                type: "info",
                title: result.status === "saved" ? "Saved to wishlist 💛" : "Removed from wishlist",
            })
        } catch {
            toast({ type: "error", title: "Error", message: "Please log in to save items." })
        }
    }

    const clearFilters = () => {
        setFilters({})
        setSearchInput("")
    }

    const hasActiveFilters = !!(filters.category || filters.condition || filters.min_price || filters.max_price || filters.search || filters.ordering)

    return (
        <div className="min-h-screen bg-slate-950 pb-24 px-4 md:px-6 lg:px-8">
            {/* ── Header ─────────────────────────────────────────────────────── */}
            <div className="max-w-7xl mx-auto mb-8">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
                    <div>
                        <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-400 via-rose-400 to-orange-400 mb-3 tracking-tight">
                            The Stash 🎒
                        </h1>
                        <p className="text-slate-400 text-base max-w-xl">
                            Student-exclusive marketplace. Cop deals on campus before they're gone.
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        <Button asChild variant="outline" className="border-slate-800 bg-slate-900/50 hover:bg-slate-800 text-slate-300 relative h-12 w-12 rounded-full p-0 transition-transform hover:scale-105 active:scale-95">
                            <Link href="/marketplace/cart">
                                <ShoppingBag className="w-5 h-5" />
                                {cart && cart.items.length > 0 && (
                                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-slate-950 shadow-md">
                                        {cart.items.length}
                                    </span>
                                )}
                            </Link>
                        </Button>
                        <Button asChild className="h-12 rounded-full bg-slate-100 text-slate-900 hover:bg-white font-bold px-6 shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:scale-105 transition-all">
                            <Link href="/marketplace/create">
                                <Plus className="w-4 h-4 mr-2" />
                                Sell Item
                            </Link>
                        </Button>
                    </div>
                </motion.div>

                {/* ── Category Tabs ──────────────────────────────────────────── */}
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
                    className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                    {CATEGORIES.map(cat => (
                        <button key={cat.value}
                            onClick={() => setFilters({ ...filters, category: cat.value || undefined })}
                            className={cn(
                                "flex-shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all border",
                                filters.category === cat.value || (!filters.category && !cat.value)
                                    ? "bg-blue-600 text-white border-blue-500 shadow-md shadow-blue-500/20"
                                    : "bg-slate-900/50 text-slate-400 border-slate-800 hover:border-slate-600 hover:text-slate-200"
                            )}>
                            <span>{cat.emoji}</span>
                            <span>{cat.label}</span>
                        </button>
                    ))}
                </motion.div>

                {/* ── Search + Filter Bar ─────────────────────────────────────── */}
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}
                    className="mt-4 p-2 bg-slate-900/50 border border-slate-800 rounded-2xl flex flex-col md:flex-row gap-2">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                        <Input
                            value={searchInput}
                            onChange={e => setSearchInput(e.target.value)}
                            placeholder="Search for items, textbooks, electronics..."
                            className="pl-9 bg-transparent border-none focus-visible:ring-0 text-slate-200 placeholder:text-slate-500 h-10 text-sm"
                        />
                    </div>
                    <div className="flex gap-2">
                        {/* Filter panel toggle */}
                        <Button variant="ghost" onClick={() => setFilterOpen(!filterOpen)}
                            className={cn("text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl text-sm h-10",
                                filterOpen && "bg-slate-800 text-white")}>
                            <SlidersHorizontal className="w-4 h-4 mr-1.5" /> Filters
                            {hasActiveFilters && <span className="ml-1.5 w-2 h-2 rounded-full bg-blue-500 inline-block" />}
                        </Button>
                        {/* Sort */}
                        <div className="relative group">
                            <Button variant="ghost" className="text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl text-sm h-10">
                                Sort <ChevronDown className="w-3.5 h-3.5 ml-1" />
                            </Button>
                            <div className="absolute right-0 top-full mt-1 bg-slate-900 border border-slate-800 rounded-xl p-1 z-40 hidden group-hover:block min-w-[180px] shadow-xl">
                                {SORT_OPTIONS.map(opt => (
                                    <button key={opt.value} onClick={() => setFilters({ ...filters, ordering: opt.value || undefined })}
                                        className={cn("w-full text-left px-3 py-2 text-sm rounded-lg transition-colors",
                                            filters.ordering === opt.value ? "bg-blue-600 text-white" : "text-slate-300 hover:bg-slate-800")}>
                                        {opt.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                        {hasActiveFilters && (
                            <Button variant="ghost" onClick={clearFilters}
                                className="text-red-400 hover:text-red-300 hover:bg-red-900/20 rounded-xl text-sm h-10">
                                <RotateCcw className="w-3.5 h-3.5 mr-1" /> Clear
                            </Button>
                        )}
                    </div>
                </motion.div>

                {/* ── Expanded Filter Panel ──────────────────────────────────── */}
                <AnimatePresence>
                    {filterOpen && (
                        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden">
                            <div className="mt-3 p-4 bg-slate-900/40 border border-slate-800 rounded-2xl grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div>
                                    <Label className="text-slate-400 text-xs mb-2 block">Condition</Label>
                                    <select value={filters.condition || ""} onChange={e => setFilters({ ...filters, condition: e.target.value || undefined })}
                                        className="w-full h-9 bg-slate-900 border border-slate-700 rounded-lg px-2.5 text-sm text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500">
                                        {CONDITIONS.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <Label className="text-slate-400 text-xs mb-2 block">Currency</Label>
                                    <select value={filters.currency || ""} onChange={e => setFilters({ ...filters, currency: e.target.value || undefined })}
                                        className="w-full h-9 bg-slate-900 border border-slate-700 rounded-lg px-2.5 text-sm text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500">
                                        <option value="">Any</option>
                                        {CURRENCIES.map(c => <option key={c} value={c}>{c}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <Label className="text-slate-400 text-xs mb-2 block">Min Price</Label>
                                    <Input type="number" value={filters.min_price || ""} onChange={e => setFilters({ ...filters, min_price: e.target.value || undefined })}
                                        placeholder="0"
                                        className="h-9 bg-slate-900 border-slate-700 text-slate-200 text-sm focus-visible:ring-blue-500/50" />
                                </div>
                                <div>
                                    <Label className="text-slate-400 text-xs mb-2 block">Max Price</Label>
                                    <Input type="number" value={filters.max_price || ""} onChange={e => setFilters({ ...filters, max_price: e.target.value || undefined })}
                                        placeholder="Any"
                                        className="h-9 bg-slate-900 border-slate-700 text-slate-200 text-sm focus-visible:ring-blue-500/50" />
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* ── Results stats ──────────────────────────────────────────────── */}
            <div className="max-w-7xl mx-auto mb-4">
                {!isLoading && (
                    <p className="text-sm text-slate-500">
                        {listings.length} {listings.length === 1 ? "item" : "items"} found
                        {filters.search && <span> for "<span className="text-slate-300">{filters.search}</span>"</span>}
                    </p>
                )}
            </div>

            {/* ── Product Grid ───────────────────────────────────────────────── */}
            <div className="max-w-7xl mx-auto">
                {isLoading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                        {Array.from({ length: 8 }).map((_, i) => (
                            <div key={i} className="rounded-2xl bg-slate-900/60 border border-slate-800 overflow-hidden animate-pulse">
                                <div className="aspect-[4/3] bg-slate-800" />
                                <div className="p-4 space-y-3">
                                    <div className="h-4 bg-slate-800 rounded w-3/4" />
                                    <div className="h-3 bg-slate-800 rounded w-full" />
                                    <div className="h-3 bg-slate-800 rounded w-2/3" />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : error ? (
                    <div className="flex flex-col items-center justify-center py-24 text-center">
                        <div className="text-5xl mb-4">⚠️</div>
                        <h3 className="text-xl font-bold text-slate-300 mb-2">Connection Error</h3>
                        <p className="text-slate-500 mb-6 max-w-sm">{error}</p>
                        <Button onClick={() => window.location.reload()} variant="outline" className="border-slate-700 text-slate-300">
                            Retry
                        </Button>
                    </div>
                ) : listings.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-24 text-center">
                        <div className="text-6xl mb-4">🎒</div>
                        <h3 className="text-xl font-bold text-slate-300 mb-2">No items found</h3>
                        <p className="text-slate-500 mb-6 max-w-sm">
                            {hasActiveFilters ? "Try adjusting your filters." : "Be the first to list something!"}
                        </p>
                        {hasActiveFilters && (
                            <Button onClick={clearFilters} variant="outline" className="border-slate-700 text-slate-300">
                                Clear filters
                            </Button>
                        )}
                    </div>
                ) : (
                    <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                        <AnimatePresence>
                            {listings.map(listing => (
                                <ProductCard
                                    key={listing.id}
                                    product={listing}
                                    onDelete={listing.is_owner ? () => handleDelete(listing.id) : undefined}
                                    onEdit={listing.is_owner ? () => {
                                        toast({ type: "info", title: "Edit coming soon", message: "Edit functionality is being built." })
                                    } : undefined}
                                    onSave={!listing.is_owner ? () => handleSave(listing.id) : undefined}
                                />
                            ))}
                        </AnimatePresence>
                    </motion.div>
                )}
            </div>
        </div>
    )
}
