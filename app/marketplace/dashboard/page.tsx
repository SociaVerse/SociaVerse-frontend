"use client"

import { useEffect, useState, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Store, Loader2, IndianRupee, Tag, CheckCircle2, RotateCcw, Image as ImageIcon, MapPin, Phone, User as UserIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { marketplaceApi, Listing, SellerOrder } from "@/services/marketplace"
import { api } from "@/services/api"
import { ProductCard } from "@/components/marketplace/product-card"
import { SellItemSheet } from "@/components/marketplace/sell-item-sheet"
import { useToast } from "@/components/ui/custom-toast"
import { useAuth } from "@/components/auth-provider"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { EditItemSheet } from "@/components/marketplace/edit-item-sheet"

export default function SellerDashboardPage() {
    const { toast, confirm } = useToast()
    const { user, checkAuth } = useAuth()
    const [listings, setListings] = useState<Listing[]>([])
    const [orders, setOrders] = useState<SellerOrder[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [activeTab, setActiveTab] = useState<"active" | "sold" | "orders">("active")
    const [editingListing, setEditingListing] = useState<Listing | null>(null)

    const fetchDashboardData = async () => {
        setLoading(true)
        setError(null)
        try {
            const [listingData, orderData] = await Promise.all([
                marketplaceApi.getMyListings(),
                marketplaceApi.getSellerOrders()
            ])
            setListings(listingData)
            setOrders(orderData)
        } catch (err: unknown) {
            const msg = err instanceof Error ? err.message : "Failed to load dashboard."
            setError(msg.includes("401") ? "Please log in to view your dashboard." : "Failed to load your dashboard.")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchDashboardData()
    }, [])

    const activeListings = useMemo(() => listings.filter(l => l.status === "active"), [listings])
    const soldListings = useMemo(() => listings.filter(l => l.status === "sold"), [listings])

    const totalEarnings = useMemo(() => {
        // Only sum INR for simplicity, or sum generally
        return soldListings.reduce((sum, item) => sum + Number(item.price), 0)
    }, [soldListings])

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: "INR",
            maximumFractionDigits: 0,
        }).format(amount)
    }

    const handleDelete = async (id: number) => {
        const ok = await confirm({
            title: "Delete listing?",
            description: "Are you sure you want to permanently delete this listing?",
            variant: "danger",
            confirmText: "Delete",
        })
        if (!ok) return
        try {
            await marketplaceApi.deleteListing(id)
            setListings(prev => prev.filter(l => l.id !== id))
            toast({ type: "info", title: "Listing deleted" })
        } catch {
            toast({ type: "error", title: "Error", message: "Failed to delete" })
        }
    }

    const handleMarkSold = async (id: number) => {
        try {
            await marketplaceApi.markSold(id)
            setListings(prev => prev.map(l => l.id === id ? { ...l, status: "sold" } : l))
            toast({ type: "success", title: "Marked as sold! 🎉" })
        } catch {
            toast({ type: "error", title: "Error", message: "Failed to update" })
        }
    }

    const handleBump = async (id: number) => {
        try {
            const res = await marketplaceApi.bumpListing(id)
            setListings(prev => {
                const updated = prev.filter(l => l.id !== id)
                const bumped = prev.find(l => l.id === id)
                if (bumped) {
                    updated.unshift({ ...bumped, created_at: new Date().toISOString() })
                }
                return updated
            })
            toast({ type: "success", title: "Listing Bumped 🚀", message: res.message })
        } catch (err: unknown) {
            const msg = err instanceof Error ? err.message : "Failed to bump listing"
            toast({ type: "warning", title: "Premium Access Required", message: msg })
        }
    }

    const [isOnboarding, setIsOnboarding] = useState(false)
    const [upiId, setUpiId] = useState(user?.default_upi_id || "")
    const [qrFile, setQrFile] = useState<File | null>(null)

    const handleSellerOnboard = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!upiId) {
            toast({ type: "error", title: "UPI ID Required" })
            return
        }
        setIsOnboarding(true)
        try {
            const formData = new FormData()
            formData.append("default_upi_id", upiId)
            if (qrFile) {
                formData.append("upi_qr_code", qrFile)
            }
            const res = await marketplaceApi.onboardSeller(formData)
            await checkAuth()
            toast({ type: "success", title: "Setup Complete", message: "You can now receive payments directly!" })
        } catch (err: unknown) {
            const msg = err instanceof Error ? err.message : "Failed to save details"
            toast({ type: "error", title: "Setup Failed", message: msg })
        } finally {
            setIsOnboarding(false)
        }
    }

    const isFullyOnboarded = !!user?.default_upi_id && !!user?.upi_qr_code;

    return (
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-8 md:py-12 pb-24">
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-8">
                <div>
                    <h1 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-400 mb-2">
                        My Shop 🏪
                    </h1>
                    <p className="text-slate-400 text-sm md:text-base mb-4">
                        Manage your active listings and track your sales.
                    </p>

                    {!isFullyOnboarded ? (
                        <div className="bg-orange-500/10 border border-orange-500/20 rounded-xl p-5 max-w-lg mb-8">
                            <h3 className="text-orange-400 font-bold mb-2 flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
                                Action Required: Set Up Payment Details
                            </h3>
                            <p className="text-sm text-slate-300 mb-4">Before you can sell, you must provide your UPI ID and payment QR code so buyers can pay you directly.</p>
                            <form onSubmit={handleSellerOnboard} className="space-y-4">
                                <div>
                                    <Label className="text-slate-300">Default UPI ID</Label>
                                    <Input
                                        placeholder="username@bank"
                                        value={upiId}
                                        onChange={(e) => setUpiId(e.target.value)}
                                        className="bg-slate-900 border-slate-700 mt-1"
                                        required
                                    />
                                </div>
                                <div>
                                    <Label className="text-slate-300">UPI QR Code (Image)</Label>
                                    <Input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => setQrFile(e.target.files?.[0] || null)}
                                        className="bg-slate-900 border-slate-700 mt-1"
                                        required={!user?.upi_qr_code}
                                    />
                                </div>
                                <Button
                                    type="submit"
                                    disabled={isOnboarding}
                                    className="bg-blue-600 hover:bg-blue-500 text-white rounded-lg w-full font-semibold"
                                >
                                    {isOnboarding ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                                    {isOnboarding ? "Saving..." : "Save Payment Details"}
                                </Button>
                            </form>
                        </div>
                    ) : (
                        <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-3 max-w-sm flex items-center gap-3 mb-8">
                            <div className="bg-emerald-500/20 p-2 rounded-full">
                                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                            </div>
                            <div>
                                <p className="text-sm font-bold text-emerald-400">Payments Ready</p>
                                <p className="text-xs text-slate-400">UPI ID: <span className="font-mono">{user.default_upi_id}</span></p>
                            </div>
                        </div>
                    )}
                </div>
                <div>
                    {!isFullyOnboarded ? (
                        <div className="group relative">
                            <SellItemSheet onSuccess={fetchDashboardData} />
                            <div className="absolute inset-0 bg-slate-900/50 cursor-not-allowed z-10 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <span className="text-white text-xs font-bold px-2 py-1 bg-slate-800 rounded">Setup Payments First</span>
                            </div>
                        </div>
                    ) : (
                        <SellItemSheet onSuccess={fetchDashboardData} />
                    )}
                </div>
            </div>

            {error ? (
                <div className="flex flex-col items-center justify-center py-24 text-center">
                    <Store className="w-16 h-16 text-slate-700 mb-4" />
                    <h3 className="text-xl font-bold text-slate-300 mb-2">Oops!</h3>
                    <p className="text-slate-500 mb-6 max-w-sm">{error}</p>
                    {error.includes("log in") && (
                        <Link href="/login">
                            <Button className="bg-blue-600 hover:bg-blue-500 text-white rounded-xl">Go to Login</Button>
                        </Link>
                    )}
                </div>
            ) : loading ? (
                <div className="flex justify-center py-24"><Loader2 className="w-8 h-8 text-blue-500 animate-spin" /></div>
            ) : (
                <>
                    {/* Metrics Header */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 flex flex-col justify-center items-center text-center">
                            <Tag className="w-6 h-6 text-blue-400 mb-2" />
                            <div className="text-2xl font-bold text-white mb-0.5">{activeListings.length}</div>
                            <div className="text-xs text-slate-400 font-medium">Active Items</div>
                        </div>
                        <div className="bg-emerald-900/20 border border-emerald-500/30 rounded-2xl p-4 flex flex-col justify-center items-center text-center">
                            <CheckCircle2 className="w-6 h-6 text-emerald-400 mb-2" />
                            <div className="text-2xl font-bold text-white mb-0.5">{soldListings.length}</div>
                            <div className="text-xs text-emerald-400/70 font-medium">Items Sold</div>
                        </div>
                        <div className="bg-amber-900/20 border border-amber-500/30 rounded-2xl p-4 flex flex-col justify-center items-center text-center col-span-2 md:col-span-2">
                            <IndianRupee className="w-6 h-6 text-amber-400 mb-2" />
                            <div className="text-3xl font-bold text-amber-400 mb-0.5">{formatCurrency(totalEarnings)}</div>
                            <div className="text-xs text-amber-500/70 font-medium">Total Earnings</div>
                        </div>
                    </div>

                    {/* Tab Bar */}
                    <div className="flex flex-wrap items-center gap-4 border-b border-slate-800 mb-6">
                        <button
                            onClick={() => setActiveTab("active")}
                            className={cn("pb-3 text-sm font-semibold transition-colors relative",
                                activeTab === "active" ? "text-blue-400" : "text-slate-400 hover:text-slate-300"
                            )}>
                            Active Listings ({activeListings.length})
                            {activeTab === "active" && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-500 rounded-t-full" />}
                        </button>
                        <button
                            onClick={() => setActiveTab("sold")}
                            className={cn("pb-3 text-sm font-semibold transition-colors relative",
                                activeTab === "sold" ? "text-emerald-400" : "text-slate-400 hover:text-slate-300"
                            )}>
                            Sold History ({soldListings.length})
                            {activeTab === "sold" && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-emerald-500 rounded-t-full" />}
                        </button>
                        <button
                            onClick={() => setActiveTab("orders")}
                            className={cn("pb-3 text-sm font-semibold transition-colors relative",
                                activeTab === "orders" ? "text-amber-400" : "text-slate-400 hover:text-slate-300"
                            )}>
                            Received Orders ({orders.length})
                            {activeTab === "orders" && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-amber-500 rounded-t-full" />}
                        </button>
                    </div>

                    {/* Content */}
                    {activeTab === "orders" ? (
                        <div className="space-y-4">
                            {orders.length === 0 ? (
                                <div className="py-16 text-center text-slate-500 text-sm">No orders received yet.</div>
                            ) : (
                                orders.map(order => (
                                    <div key={order.id} className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 md:p-6 hover:border-slate-700 transition-colors">
                                        <div className="flex flex-col md:flex-row justify-between gap-4 mb-4 pb-4 border-b border-slate-800/50">
                                            <div>
                                                <div className="font-mono text-xs text-slate-500 mb-1">Order #{order.id} • {new Date(order.created_at).toLocaleDateString()}</div>
                                                <div className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-emerald-600">
                                                    {formatCurrency(Number(order.total_amount))}
                                                </div>
                                            </div>
                                            <div className="bg-slate-800/50 rounded-lg p-3 max-w-sm w-full space-y-2">
                                                <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Delivery Info</h4>
                                                <div className="flex items-start gap-2 text-sm text-slate-300">
                                                    <UserIcon className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
                                                    <span>{order.delivery_name}</span>
                                                </div>
                                                <div className="flex items-start gap-2 text-sm text-slate-300">
                                                    <Phone className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
                                                    <span>{order.delivery_phone}</span>
                                                </div>
                                                <div className="flex items-start gap-2 text-sm text-slate-300">
                                                    <MapPin className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
                                                    <span>{order.delivery_address}</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div>
                                            <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Items Purchased</h4>
                                            <div className="space-y-3">
                                                {order.items.map(item => (
                                                    <div key={item.id} className="flex gap-4 items-center bg-slate-950/30 rounded-lg p-3">
                                                        {item.listing.images?.[0] ? (
                                                            // eslint-disable-next-line @next/next/no-img-element
                                                            <img src={item.listing.images[0].image} alt="item" className="w-12 h-12 object-cover rounded-md" />
                                                        ) : (
                                                            <div className="w-12 h-12 bg-slate-800 rounded-md flex justify-center items-center"><ImageIcon className="w-5 h-5 text-slate-600" /></div>
                                                        )}
                                                        <div className="flex-1 min-w-0">
                                                            <h5 className="text-sm font-semibold truncate text-slate-200">{item.listing.title}</h5>
                                                            <p className="text-xs text-slate-400">Qty: {item.quantity} × {formatCurrency(Number(item.price_at_purchase))}</p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="mt-4 pt-4 border-t border-slate-800/50 flex flex-col sm:flex-row items-center justify-between gap-4">
                                            <div className="text-sm text-slate-400">
                                                UTR / Transaction ID: <span className="font-mono text-emerald-400 font-bold ml-2">{order.upi_transaction_id || "N/A"}</span>
                                            </div>
                                            <div className="px-3 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full text-xs font-semibold">
                                                {order.status.toUpperCase()}
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                            <AnimatePresence mode="popLayout">
                                {(activeTab === "active" ? activeListings : soldListings).length === 0 ? (
                                    <div className="col-span-full py-16 text-center text-slate-500 text-sm">
                                        No {activeTab} listings found.
                                    </div>
                                ) : (
                                    (activeTab === "active" ? activeListings : soldListings).map(listing => (
                                        <ProductCard
                                            key={listing.id}
                                            product={listing}
                                            onDelete={() => handleDelete(listing.id)}
                                            onEdit={() => setEditingListing(listing)}
                                            onBump={() => handleBump(listing.id)}
                                        />
                                    ))
                                )}
                            </AnimatePresence>
                        </div>
                    )}

                    {/* Edit Sheet */}
                    <EditItemSheet
                        open={!!editingListing}
                        onOpenChange={(open) => {
                            if (!open) setEditingListing(null)
                        }}
                        listing={editingListing}
                        onSuccess={() => {
                            setEditingListing(null)
                            fetchDashboardData()
                        }}
                    />
                </>
            )}
        </div>
    )
}
