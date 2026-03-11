"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import {
    ArrowLeft, MessageCircle, Share2, Heart, ShieldCheck, Clock,
    MapPin, ChevronLeft, ChevronRight, Eye, Tag, Flag, CheckCircle2,
    BadgeCheck, PackageCheck, Loader2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { marketplaceApi, Listing } from "@/services/marketplace"
import { cn } from "@/lib/utils"
import { useToast } from "@/components/ui/custom-toast"

const CONDITION_LABELS: Record<string, { label: string; color: string }> = {
    new: { label: "Brand New", color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/25" },
    like_new: { label: "Like New", color: "text-blue-400 bg-blue-500/10 border-blue-500/25" },
    good: { label: "Good", color: "text-yellow-400 bg-yellow-500/10 border-yellow-500/25" },
    fair: { label: "Fair", color: "text-orange-400 bg-orange-500/10 border-orange-500/25" },
}

const CATEGORY_EMOJI: Record<string, string> = {
    electronics: "💻", books: "📚", clothing: "👕", furniture: "🪑",
    vehicles: "🛵", services: "🛠️", sports: "⚽", stationery: "✏️", other: "📦",
}

export default function ProductDetailsPage() {
    const params = useParams()
    const router = useRouter()
    const { toast, confirm } = useToast()
    const [product, setProduct] = useState<Listing | null>(null)
    const [loading, setLoading] = useState(true)
    const [notFound, setNotFound] = useState(false)
    const [activeImageIndex, setActiveImageIndex] = useState(0)
    const [saving, setSaving] = useState(false)
    const [marking, setMarking] = useState(false)
    const [reportOpen, setReportOpen] = useState(false)
    const [reportReason, setReportReason] = useState("spam")
    const [submittingReport, setSubmittingReport] = useState(false)

    const id = params.id as string

    useEffect(() => {
        if (!id) return
        marketplaceApi.getListing(id)
            .then(setProduct)
            .catch(() => setNotFound(true))
            .finally(() => setLoading(false))
    }, [id])

    const handleSaveToggle = async () => {
        if (!product) return
        setSaving(true)
        try {
            const res = await marketplaceApi.toggleSave(product.id)
            setProduct(prev => prev ? {
                ...prev,
                is_saved: res.status === "saved",
                saves_count: res.status === "saved" ? prev.saves_count + 1 : prev.saves_count - 1,
            } : prev)
            toast({ type: "info", title: res.status === "saved" ? "Saved to wishlist 💛" : "Removed from wishlist" })
        } catch {
            toast({ type: "error", title: "Error", message: "Please log in to save items." })
        } finally {
            setSaving(false)
        }
    }

    const handleMarkSold = async () => {
        if (!product) return
        const ok = await confirm({
            title: "Mark as sold?",
            description: "This will move your listing out of the active marketplace. You can still see it in 'My Listings'.",
            confirmText: "Mark Sold",
            variant: "danger",
        })
        if (!ok) return
        setMarking(true)
        try {
            await marketplaceApi.markSold(product.id)
            setProduct(prev => prev ? { ...prev, status: "sold" } : prev)
            toast({ type: "success", title: "Marked as sold! 🎉", message: "Hope you got a great deal." })
        } catch {
            toast({ type: "error", title: "Error", message: "Could not mark as sold." })
        } finally {
            setMarking(false)
        }
    }

    const handleReport = async () => {
        if (!product) return
        setSubmittingReport(true)
        try {
            await marketplaceApi.reportListing(product.id, reportReason)
            setReportOpen(false)
            toast({ type: "success", title: "Report submitted", message: "Our team will review this listing." })
        } catch (err: unknown) {
            const msg = err instanceof Error ? err.message : "Error submitting report."
            toast({ type: "error", title: "Error", message: msg })
        } finally {
            setSubmittingReport(false)
        }
    }

    const handleShare = async () => {
        if (navigator.share) {
            await navigator.share({ title: product?.title, url: window.location.href })
        } else {
            navigator.clipboard.writeText(window.location.href)
            toast({ type: "info", title: "Link copied!", message: "Share it with a friend." })
        }
    }

    const handleInquire = async () => {
        if (!product || saving) return
        setSaving(true)

        try {
            await marketplaceApi.contactSeller(product.id)
            const p = new URLSearchParams({
                seller: product.seller.username,
                sellerName: product.seller.full_name || product.seller.username,
                product: product.title,
            })
            router.push(`/chat?${p.toString()}`)
        } catch (error) {
            console.error("Failed to contact seller:", error)
            const p = new URLSearchParams({
                seller: product.seller.username,
                sellerName: product.seller.full_name || product.seller.username,
                product: product.title,
            })
            router.push(`/chat?${p.toString()}`)
        } finally {
            setSaving(false)
        }
    }

    const formatPrice = (price: string, currency: string) =>
        new Intl.NumberFormat("en-IN", { style: "currency", currency, maximumFractionDigits: 0 }).format(Number(price))

    const formatDate = (iso: string) =>
        new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })

    if (loading) return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center">
            <div className="flex flex-col items-center gap-3">
                <Loader2 className="w-8 h-8 text-blue-400 animate-spin" />
                <p className="text-slate-400 text-sm">Loading listing...</p>
            </div>
        </div>
    )

    if (notFound || !product) return (
        <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-center p-6">
            <div className="text-6xl mb-4">🎒</div>
            <h1 className="text-2xl font-bold text-white mb-2">Item Not Found</h1>
            <p className="text-slate-400 mb-6">This listing may have been removed or sold.</p>
            <Link href="/marketplace">
                <Button variant="outline" className="border-slate-700 text-slate-300 hover:bg-slate-800">
                    Back to Marketplace
                </Button>
            </Link>
        </div>
    )

    const condition = CONDITION_LABELS[product.condition] || { label: product.condition, color: "text-slate-400 bg-slate-800 border-slate-700" }
    const isSold = product.status === "sold"

    return (
        <div className="min-h-screen bg-slate-950 pt-20 pb-24 px-4 md:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                {/* Back */}
                <Link href="/marketplace" className="inline-flex items-center text-slate-500 hover:text-white transition-colors mb-6 group text-sm">
                    <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                    Back to Marketplace
                </Link>

                <div className="grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-8 lg:gap-12">
                    {/* ── Left: Image Gallery ─────────────────────────────── */}
                    <div className="space-y-4">
                        {/* Main image */}
                        <div className="relative aspect-[4/3] bg-slate-900 rounded-2xl overflow-hidden border border-slate-800">
                            {isSold && (
                                <div className="absolute inset-0 bg-black/50 z-20 flex items-center justify-center">
                                    <div className="bg-black/80 text-white font-bold text-2xl px-8 py-3 rounded-full border border-white/20 rotate-[-12deg]">
                                        SOLD
                                    </div>
                                </div>
                            )}
                            <AnimatePresence mode="wait">
                                <motion.div key={activeImageIndex} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                    transition={{ duration: 0.25 }} className="absolute inset-0">
                                    {product.images.length > 0 ? (
                                        <Image
                                            src={product.images[activeImageIndex]?.image}
                                            alt={`${product.title} – photo ${activeImageIndex + 1}`}
                                            fill className="object-cover" priority
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-slate-600">
                                            <span className="text-6xl">{CATEGORY_EMOJI[product.category] || "📦"}</span>
                                        </div>
                                    )}
                                </motion.div>
                            </AnimatePresence>

                            {product.images.length > 1 && (
                                <>
                                    <button onClick={() => setActiveImageIndex(p => (p - 1 + product.images.length) % product.images.length)}
                                        className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 backdrop-blur text-white hover:bg-black/70 transition-colors z-10">
                                        <ChevronLeft className="w-5 h-5" />
                                    </button>
                                    <button onClick={() => setActiveImageIndex(p => (p + 1) % product.images.length)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 backdrop-blur text-white hover:bg-black/70 transition-colors z-10">
                                        <ChevronRight className="w-5 h-5" />
                                    </button>
                                    <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur text-xs text-white px-2.5 py-1 rounded-full z-10">
                                        {activeImageIndex + 1}/{product.images.length}
                                    </div>
                                </>
                            )}
                        </div>

                        {/* Thumbnails */}
                        {product.images.length > 1 && (
                            <div className="flex gap-2.5 overflow-x-auto pb-1 scrollbar-hide">
                                {product.images.map((img, idx) => (
                                    <button key={idx} onClick={() => setActiveImageIndex(idx)}
                                        className={cn("relative flex-shrink-0 w-18 h-18 w-[72px] h-[72px] rounded-lg overflow-hidden border-2 transition-all",
                                            activeImageIndex === idx ? "border-blue-500 ring-2 ring-blue-500/30" : "border-transparent opacity-50 hover:opacity-100")}>
                                        <Image src={img.image} alt={`thumb-${idx}`} fill className="object-cover" />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* ── Right: Details ─────────────────────────────────── */}
                    <div className="space-y-6">
                        {/* Title + Price + Actions */}
                        <div>
                            <div className="flex items-start justify-between gap-4">
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                                        <span className="text-xs text-slate-500">{CATEGORY_EMOJI[product.category]} {product.category}</span>
                                        <span className={cn("text-xs font-semibold px-2.5 py-0.5 rounded-full border", condition.color)}>
                                            {condition.label}
                                        </span>
                                        {product.is_negotiable && (
                                            <span className="text-xs text-slate-400 bg-slate-800 px-2 py-0.5 rounded-full border border-slate-700">Negotiable</span>
                                        )}
                                    </div>
                                    <h1 className="text-3xl font-bold text-white leading-tight">{product.title}</h1>
                                    <div className="text-3xl font-bold text-emerald-400 mt-2">
                                        {formatPrice(product.price, product.currency)}
                                    </div>
                                </div>

                                <div className="flex flex-col gap-2">
                                    <button onClick={handleShare}
                                        className="p-2.5 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors border border-slate-700">
                                        <Share2 className="w-4 h-4" />
                                    </button>
                                    {!product.is_owner && (
                                        <button onClick={handleSaveToggle} disabled={saving}
                                            className={cn("p-2.5 rounded-full border transition-colors",
                                                product.is_saved
                                                    ? "bg-red-500/20 border-red-500/40 text-red-400 hover:bg-red-500/30"
                                                    : "bg-slate-800 border-slate-700 text-slate-400 hover:text-red-400 hover:border-red-500/40")}>
                                            <Heart className={cn("w-4 h-4", product.is_saved && "fill-current", saving && "animate-pulse")} />
                                        </button>
                                    )}
                                </div>
                            </div>

                            {/* Stats */}
                            <div className="flex items-center gap-4 mt-3 text-xs text-slate-500">
                                <span className="flex items-center gap-1.5"><Eye className="w-3.5 h-3.5" /> {product.views_count} views</span>
                                <span className="flex items-center gap-1.5"><Heart className="w-3.5 h-3.5" /> {product.saves_count} saved</span>
                                <span>Listed {formatDate(product.created_at)}</span>
                            </div>
                        </div>

                        {/* Location */}
                        {product.location && (
                            <div className="flex items-center gap-2 text-sm text-slate-400">
                                <MapPin className="w-4 h-4 text-slate-500" />
                                {product.location}
                            </div>
                        )}

                        {/* Seller card */}
                        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between gap-4">
                            <div className="flex items-center gap-3">
                                <div className="relative w-12 h-12 flex-shrink-0">
                                    {product.seller.profile_picture ? (
                                        <Image src={product.seller.profile_picture} alt={product.seller.username}
                                            fill className="object-cover rounded-full border border-slate-700" />
                                    ) : (
                                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-lg font-bold text-white border border-slate-700">
                                            {product.seller.username[0].toUpperCase()}
                                        </div>
                                    )}
                                </div>
                                <div>
                                    <div className="flex items-center gap-1.5">
                                        <span className="text-white font-semibold text-sm">
                                            {product.is_owner ? "You" : (product.seller.full_name || product.seller.username)}
                                        </span>
                                        {product.seller.is_verified && (
                                            <BadgeCheck className="w-4 h-4 text-blue-400" />
                                        )}
                                    </div>
                                    <div className="text-xs text-slate-400">@{product.seller.username}</div>
                                    <div className="text-xs text-slate-500 mt-0.5">{product.seller.college}</div>
                                </div>
                            </div>
                            {!product.is_owner && !isSold && (
                                <Button onClick={handleInquire} className="flex-shrink-0 bg-blue-600 hover:bg-blue-500 text-white rounded-full text-sm h-9 px-4">
                                    <MessageCircle className="w-4 h-4 mr-1.5" /> Chat
                                </Button>
                            )}
                        </div>

                        {/* Description */}
                        <div className="space-y-2">
                            <h3 className="text-base font-semibold text-white">Description</h3>
                            <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-line">{product.description}</p>
                        </div>

                        {/* Trust badges */}
                        <div className="grid grid-cols-2 gap-3">
                            <div className="p-3.5 rounded-xl bg-slate-900/40 border border-slate-800 flex items-center gap-3">
                                <ShieldCheck className="w-7 h-7 text-blue-400 flex-shrink-0" />
                                <div>
                                    <div className="text-sm font-medium text-slate-200">Verified Student</div>
                                    <div className="text-xs text-slate-500">ID-checked seller</div>
                                </div>
                            </div>
                            <div className="p-3.5 rounded-xl bg-slate-900/40 border border-slate-800 flex items-center gap-3">
                                <Clock className="w-7 h-7 text-purple-400 flex-shrink-0" />
                                <div>
                                    <div className="text-sm font-medium text-slate-200">Quick Response</div>
                                    <div className="text-xs text-slate-500">Usually replies in 1h</div>
                                </div>
                            </div>
                        </div>

                        {/* Owner actions */}
                        {product.is_owner && !isSold && (
                            <Button onClick={handleMarkSold} disabled={marking} variant="outline"
                                className="w-full border-emerald-600/50 text-emerald-400 hover:bg-emerald-900/20 hover:text-emerald-300 rounded-xl h-11">
                                {marking ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <PackageCheck className="w-4 h-4 mr-2" />}
                                Mark as Sold
                            </Button>
                        )}

                        {/* Sold banner */}
                        {isSold && (
                            <div className="flex items-center gap-3 p-4 bg-emerald-900/20 border border-emerald-500/30 rounded-xl">
                                <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                                <p className="text-emerald-300 text-sm font-medium">This item has been sold.</p>
                            </div>
                        )}

                        {/* Buyer CTA */}
                        {!product.is_owner && !isSold && (
                            <div className="space-y-3">
                                {product.upi_id ? (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        <a href={`upi://pay?pa=${product.upi_id}&pn=${product.seller.full_name || product.seller.username}&am=${product.price}&cu=${product.currency}`}
                                            className="flex items-center justify-center w-full h-12 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white rounded-xl text-base font-bold shadow-lg shadow-emerald-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]">
                                            <BadgeCheck className="w-5 h-5 mr-2" /> Pay via UPI
                                        </a>
                                        <Button onClick={handleInquire} variant="outline"
                                            className="w-full h-12 border-slate-700 bg-slate-900/50 hover:bg-slate-800 text-white rounded-xl text-base font-bold transition-all">
                                            <MessageCircle className="w-5 h-5 mr-2" /> Chat with Seller
                                        </Button>
                                    </div>
                                ) : (
                                    <Button onClick={handleInquire}
                                        className="w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white rounded-xl text-base font-bold shadow-lg shadow-blue-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]">
                                        <MessageCircle className="w-5 h-5 mr-2" /> Chat with Seller
                                    </Button>
                                )}
                                {product.upi_id && (
                                    <p className="text-center text-xs text-slate-500 flex items-center justify-center gap-1.5 backdrop-blur py-1">
                                        <span className="text-slate-400 font-mono select-all bg-slate-900 px-2 py-0.5 rounded border border-slate-800">{product.upi_id}</span>
                                    </p>
                                )}
                            </div>
                        )}

                        {/* Report */}
                        {!product.is_owner && (
                            <div className="pt-2">
                                {!reportOpen ? (
                                    <button onClick={() => setReportOpen(true)}
                                        className="flex items-center gap-1.5 text-xs text-slate-600 hover:text-red-400 transition-colors">
                                        <Flag className="w-3 h-3" /> Report this listing
                                    </button>
                                ) : (
                                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}
                                        className="p-4 bg-slate-900/60 border border-slate-800 rounded-xl space-y-3">
                                        <p className="text-sm font-medium text-slate-300">Why are you reporting this?</p>
                                        <select value={reportReason} onChange={e => setReportReason(e.target.value)}
                                            className="w-full h-9 bg-slate-900 border border-slate-700 rounded-lg px-3 text-sm text-slate-200 focus:outline-none focus:ring-1 focus:ring-red-500">
                                            <option value="spam">Spam or misleading</option>
                                            <option value="prohibited">Prohibited item</option>
                                            <option value="scam">Potential scam</option>
                                            <option value="inappropriate">Inappropriate content</option>
                                            <option value="other">Other</option>
                                        </select>
                                        <div className="flex gap-2">
                                            <Button onClick={handleReport} disabled={submittingReport} size="sm"
                                                className="bg-red-600 hover:bg-red-500 text-white rounded-lg h-8 text-xs">
                                                {submittingReport ? <Loader2 className="w-3 h-3 animate-spin" /> : "Submit Report"}
                                            </Button>
                                            <Button onClick={() => setReportOpen(false)} size="sm" variant="ghost"
                                                className="text-slate-400 hover:text-white rounded-lg h-8 text-xs">
                                                Cancel
                                            </Button>
                                        </div>
                                    </motion.div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
