"use client"

import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { MessageCircle, Tag, Trash2, Edit, User, Heart, CheckCircle, MapPin, Eye, RotateCcw, ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { useMarketplace, Listing } from "@/context/marketplace-context"
import { useState } from "react"

interface ProductCardProps {
    product: Listing
    onDelete?: () => void
    onEdit?: () => void
    onBump?: () => void
    onSave?: () => Promise<void>
}

const CONDITION_LABELS: Record<string, { label: string; color: string }> = {
    new: { label: "New", color: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30" },
    like_new: { label: "Like New", color: "bg-blue-500/20 text-blue-400 border-blue-500/30" },
    good: { label: "Good", color: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30" },
    fair: { label: "Fair", color: "bg-orange-500/20 text-orange-400 border-orange-500/30" },
}

const CATEGORY_EMOJI: Record<string, string> = {
    electronics: "💻",
    books: "📚",
    clothing: "👕",
    furniture: "🪑",
    vehicles: "🛵",
    services: "🛠️",
    sports: "⚽",
    stationery: "✏️",
    other: "📦",
}

export function ProductCard({ product, onDelete, onEdit, onBump, onSave }: ProductCardProps) {
    const router = useRouter()
    const { addToCart, removeFromCart, updateCartItemQuantity, cart } = useMarketplace()
    const [saving, setSaving] = useState(false)
    const [adding, setAdding] = useState(false)
    const [updatingQty, setUpdatingQty] = useState(false)

    const cartItem = cart?.items.find(item => item.listing.id === product.id)
    const inCart = !!cartItem

    const handleAddToCart = async (e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()
        if (adding || inCart) return
        setAdding(true)
        try {
            await addToCart(product.id)
        } catch (error) {
            console.error("Failed to add to cart bounds", error)
        } finally {
            setAdding(false)
        }
    }

    const handleUpdateQuantity = async (e: React.MouseEvent, change: number) => {
        e.preventDefault()
        e.stopPropagation()
        if (!cartItem || updatingQty) return

        const newQuantity = cartItem.quantity + change
        if (newQuantity <= 0) {
            setUpdatingQty(true)
            try { await removeFromCart(product.id) } finally { setUpdatingQty(false) }
            return
        }

        if (newQuantity > product.quantity) return

        setUpdatingQty(true)
        try {
            await updateCartItemQuantity(cartItem.id, newQuantity)
        } catch (error) {
            console.error("Failed to update quantity bounds", error)
        } finally {
            setUpdatingQty(false)
        }
    }

    const handleInquire = async (e: React.MouseEvent) => {
        e.preventDefault()
        if (saving) return;
        setSaving(true)

        try {
            // Initiate conversation on backend & trigger Notification
            const { marketplaceApi } = await import("@/services/marketplace");
            await marketplaceApi.contactSeller(product.id);

            // Redirect to chat
            const params = new URLSearchParams({
                seller: product.seller.username,
                sellerName: product.seller.full_name || product.seller.username,
                product: product.title,
            })
            router.push(`/chat?${params.toString()}`)
        } catch (error) {
            console.error("Failed to contact seller:", error);
            // Ignore error and redirect anyway so the user isn't stuck
            const params = new URLSearchParams({
                seller: product.seller.username,
                sellerName: product.seller.full_name || product.seller.username,
                product: product.title,
            })
            router.push(`/chat?${params.toString()}`)
        } finally {
            setSaving(false)
        }
    }

    const handleSave = async (e: React.MouseEvent) => {
        e.preventDefault()
        if (!onSave || saving) return
        setSaving(true)
        try { await onSave() } finally { setSaving(false) }
    }

    const formatPrice = (price: string, currency: string) => {
        return new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency,
            maximumFractionDigits: 0,
        }).format(Number(price))
    }

    const primaryImage = product.images[0]?.image || "/placeholder.jpg"
    const condition = CONDITION_LABELS[product.condition] || { label: product.condition, color: "bg-slate-500/20 text-slate-400 border-slate-500/30" }
    const categoryEmoji = CATEGORY_EMOJI[product.category] || "📦"
    const isSold = product.status === "sold" || product.quantity <= 0
    const isLowStock = !isSold && product.quantity > 0 && product.quantity < 5

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={isSold ? {} : { y: -4 }}
            transition={{ duration: 0.25 }}
            className={cn(
                "group relative bg-slate-900/60 backdrop-blur-sm border rounded-2xl overflow-hidden transition-all duration-300",
                product.is_owner
                    ? "border-blue-500/50 shadow-blue-500/5 hover:shadow-blue-500/20 hover:shadow-xl"
                    : "border-slate-800/60 hover:border-slate-700 hover:shadow-xl hover:shadow-black/30",
                isSold && "opacity-60"
            )}
        >
            {/* Sold Overlay */}
            {isSold && (
                <div className="absolute inset-0 z-30 flex items-center justify-center">
                    <div className="bg-black/70 text-white font-bold text-lg px-6 py-2 rounded-full border border-white/20 rotate-[-12deg]">
                        SOLD OUT
                    </div>
                </div>
            )}

            {/* Low Stock Badge */}
            {isLowStock && (
                <div className="absolute top-3 left-3 bg-orange-600/90 text-white text-[10px] font-bold px-3 py-1 rounded-full border border-orange-400/50 z-20 flex items-center gap-1 shadow-md shadow-orange-900/50">
                    🔥 ONLY {product.quantity} LEFT!
                </div>
            )}

            {/* Owner Badge */}
            {product.is_owner && !isSold && (
                <div className="absolute top-0 left-0 bg-blue-600 text-white text-[10px] font-bold px-3 py-1 rounded-br-xl z-20 flex items-center gap-1">
                    <User className="w-3 h-3" /> YOUR LISTING
                </div>
            )}

            {/* Save Button (non-owner) */}
            {!product.is_owner && !isSold && (
                <button
                    onClick={handleSave}
                    disabled={saving}
                    className={cn(
                        "absolute top-3 right-3 z-20 p-2 rounded-full backdrop-blur-md border transition-all duration-200",
                        product.is_saved
                            ? "bg-red-500/90 border-red-400/50 text-white"
                            : "bg-black/50 border-white/10 text-white/70 hover:bg-red-500/80 hover:text-white"
                    )}
                >
                    <Heart className={cn("w-3.5 h-3.5", product.is_saved && "fill-current")} />
                </button>
            )}

            {/* Image */}
            <Link href={`/marketplace/${product.id}`} className="block relative aspect-[5/4] sm:aspect-[4/3] overflow-hidden bg-slate-800">
                <Image
                    src={primaryImage}
                    alt={product.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                {/* Price badge */}
                <div className="absolute bottom-3 left-3 bg-black/70 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 flex items-center gap-1.5 z-10">
                    <Tag className="w-3 h-3 text-emerald-400" />
                    <span className="text-sm font-bold text-white">{formatPrice(product.price, product.currency)}</span>
                    {product.is_negotiable && (
                        <span className="text-[10px] text-slate-400">neg.</span>
                    )}
                </div>
                {/* Multi-image indicator */}
                {product.images.length > 1 && (
                    <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-md text-[10px] text-white px-2 py-0.5 rounded-full border border-white/10 z-10">
                        +{product.images.length - 1}
                    </div>
                )}
            </Link>

            {/* Content */}
            <div className="p-3 sm:p-4 space-y-2 sm:space-y-3">
                {/* Category + Condition badges */}
                <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[10px] sm:text-[11px] text-slate-500 flex items-center gap-1">
                        {categoryEmoji} {product.category}
                    </span>
                    <span className={cn(
                        "text-[9px] sm:text-[10px] font-semibold px-2 py-0.5 rounded-full border",
                        condition.color
                    )}>
                        {condition.label}
                    </span>
                    {product.seller.is_verified && (
                        <CheckCircle className="w-3.5 h-3.5 text-blue-400" />
                    )}
                </div>

                {/* Title + description */}
                <div>
                    <h3 className="text-sm sm:text-base font-bold text-slate-100 mb-1 line-clamp-1 group-hover:text-blue-400 transition-colors">
                        {product.title}
                    </h3>
                    <p className="text-[11px] sm:text-xs text-slate-500 line-clamp-2 leading-relaxed">
                        {product.description}
                    </p>
                </div>

                {/* Location */}
                {product.location && (
                    <div className="flex items-center gap-1 text-[10px] sm:text-[11px] text-slate-500">
                        <MapPin className="w-3 h-3" />
                        {product.location}
                    </div>
                )}

                {/* Stats row */}
                <div className="flex items-center gap-3 text-[10px] sm:text-[11px] text-slate-600">
                    <span className="flex items-center gap-1">
                        <Eye className="w-3 h-3" /> {product.views_count}
                    </span>
                    <span className="flex items-center gap-1">
                        <Heart className="w-3 h-3" /> {product.saves_count}
                    </span>
                </div>

                {/* Seller + Action */}
                <div className="pt-3 border-t border-slate-800/60 flex items-center justify-between gap-3">
                    <Link href={`/marketplace/seller/${product.seller.username}`} className="flex items-center gap-2 min-w-0 group/seller transition-transform hover:scale-105 active:scale-95">
                        <div className={cn(
                            "w-7 h-7 rounded-full flex-shrink-0 overflow-hidden flex items-center justify-center text-xs font-bold text-white border",
                            product.is_owner
                                ? "bg-gradient-to-br from-blue-600 to-indigo-600 border-blue-500/50"
                                : "bg-gradient-to-br from-slate-600 to-slate-700 border-slate-700 group-hover/seller:border-blue-500/50"
                        )}>
                            {product.seller.profile_picture ? (
                                <Image
                                    src={product.seller.profile_picture}
                                    alt={product.seller.username}
                                    width={28}
                                    height={28}
                                    className="object-cover w-full h-full"
                                />
                            ) : (
                                product.seller.username[0].toUpperCase()
                            )}
                        </div>
                        <div className="min-w-0">
                            <div className={cn("text-xs font-medium truncate", product.is_owner ? "text-blue-300" : "text-slate-300 group-hover/seller:text-blue-400")}>
                                {product.is_owner ? "You" : (product.seller.full_name || product.seller.username)}
                            </div>
                            <div className="text-[10px] text-slate-500 truncate group-hover/seller:text-slate-400">@{product.seller.username}</div>
                            {product.seller.average_rating !== undefined && product.seller.average_rating > 0 && (
                                <div className="text-[10px] text-yellow-500 font-bold flex items-center gap-0.5 mt-0.5">
                                    ★ {product.seller.average_rating.toFixed(1)}
                                </div>
                            )}
                        </div>
                    </Link>

                    {product.is_owner ? (
                        <div className="flex items-center gap-1.5 flex-shrink-0">
                            {!isSold && onBump && (
                                <Button size="sm" variant="ghost" onClick={onBump} title="Bump to Top (Premium)"
                                    className="h-7 w-7 p-0 rounded-full text-amber-400 hover:text-amber-300 hover:bg-amber-900/20">
                                    <RotateCcw className="w-3.5 h-3.5" />
                                </Button>
                            )}
                            <Button size="sm" variant="ghost" onClick={onEdit} title="Edit Listing"
                                className="h-7 w-7 p-0 rounded-full text-slate-400 hover:text-white hover:bg-slate-800">
                                <Edit className="w-3.5 h-3.5" />
                            </Button>
                            <Button size="sm" variant="ghost" onClick={onDelete} title="Delete Listing"
                                className="h-7 w-7 p-0 rounded-full text-red-400 hover:text-red-300 hover:bg-red-900/20">
                                <Trash2 className="w-3.5 h-3.5" />
                            </Button>
                        </div>
                    ) : !isSold ? (
                        <div className="flex gap-2 items-center flex-shrink-0">
                            <Button size="sm" onClick={handleInquire} title="Message Seller"
                                className="h-7 w-7 p-0 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-all">
                                <MessageCircle className="w-3.5 h-3.5" />
                            </Button>

                            {cartItem ? (
                                <div className="flex items-center bg-slate-800 rounded-full border border-slate-700 h-7 overflow-hidden">
                                    <button
                                        onClick={(e) => handleUpdateQuantity(e, -1)}
                                        disabled={updatingQty}
                                        className="w-7 h-full flex items-center justify-center text-slate-300 hover:bg-slate-700 hover:text-white disabled:opacity-50 transition-colors"
                                    >-</button>
                                    <span className="text-xs font-semibold text-white px-1 min-w-[1.5rem] text-center">
                                        {updatingQty ? "..." : cartItem.quantity}
                                    </span>
                                    <button
                                        onClick={(e) => handleUpdateQuantity(e, 1)}
                                        disabled={updatingQty || cartItem.quantity >= product.quantity}
                                        className="w-7 h-full flex items-center justify-center text-slate-300 hover:bg-slate-700 hover:text-white disabled:opacity-50 transition-colors"
                                    >+</button>
                                </div>
                            ) : (
                                <Button size="sm" onClick={handleAddToCart} disabled={adding}
                                    className="flex-shrink-0 rounded-full border transition-all text-xs h-7 px-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white border-blue-500">
                                    <ShoppingCart className="w-3.5 h-3.5 mr-1" />
                                    Buy
                                </Button>
                            )}
                        </div>
                    ) : null}
                </div>
            </div>
        </motion.div>
    )
}
