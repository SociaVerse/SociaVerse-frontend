"use client"

import { useState, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ShoppingBag, ArrowLeft, ArrowRight, MapPin, Phone, User, CheckCircle, ShieldCheck, CreditCard, Trash2, Tag, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useMarketplace } from "@/context/marketplace-context"
import Link from "next/link"
import Image from "next/image"
import { useToast } from "@/components/ui/custom-toast"
import { useRouter } from "next/navigation"
import Script from "next/script"

export default function CartPage() {
    const { cart, removeFromCart, updateCartItemQuantity, checkout } = useMarketplace()
    const { toast } = useToast()
    const router = useRouter()

    const [updatingItemId, setUpdatingItemId] = useState<number | null>(null)

    const [step, setStep] = useState<1 | 2 | 3>(1) // 1: Cart, 2: Payment/Delivery, 3: Success
    const [isProcessing, setIsProcessing] = useState(false)
    const [order, setOrder] = useState<any>(null)
    const [selectedSellerId, setSelectedSellerId] = useState<string | null>(null)

    // Checkout form state
    const [form, setForm] = useState({
        delivery_name: "",
        delivery_phone: "",
        delivery_address: "",
        upi_transaction_id: ""
    })

    const formatPrice = (price: string | number) => {
        return new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: "INR",
            maximumFractionDigits: 0,
        }).format(Number(price))
    }

    const groupedCart = useMemo<Record<string, { items: any[], total: number, seller: any }>>(() => {
        if (!cart?.items) return {}
        return cart.items.reduce((acc: Record<string, { items: any[], total: number, seller: any }>, item: any) => {
            const seller = item.listing.seller.username
            if (!acc[seller]) {
                acc[seller] = { items: [], total: 0, seller: item.listing.seller }
            }
            acc[seller].items.push(item)
            acc[seller].total += (Number(item.listing.price) * (item.quantity || 1))
            return acc
        }, {} as Record<string, { items: any[], total: number, seller: any }>)
    }, [cart])

    const handleCheckout = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!form.delivery_name || !form.delivery_phone || !form.delivery_address || !form.upi_transaction_id || !selectedSellerId) {
            toast({ type: "error", title: "Missing details", message: "Please fill in all details, including the UTR number." })
            return
        }

        setIsProcessing(true)
        try {
            const data = await checkout({
                ...form,
                seller_username: selectedSellerId
            })
            setOrder(data.order || data)
            setStep(3)
            toast({ type: "success", title: "Payment Verified!", message: "Your order has been successfully placed." })
        } catch (error: any) {
            toast({ type: "error", title: "Checkout Failed", message: error.message || "An unexpected error occurred." })
        } finally {
            setIsProcessing(false)
        }
    }

    const handleRemove = async (id: number) => {
        try {
            await removeFromCart(id)
            toast({ type: "info", title: "Removed from cart" })
        } catch (error) {
            toast({ type: "error", title: "Error removing item" })
        }
    }

    const handleUpdateQuantity = async (item: any, change: number) => {
        if (updatingItemId) return

        const newQuantity = (item.quantity || 1) + change
        if (newQuantity <= 0) {
            handleRemove(item.listing.id)
            return
        }

        if (newQuantity > item.listing.quantity) {
            toast({ type: "warning", title: "Stock Limit Reached", message: `Only ${item.listing.quantity} available in stock.` })
            return
        }

        setUpdatingItemId(item.id)
        try {
            await updateCartItemQuantity(item.id, newQuantity)
        } catch (error: any) {
            toast({ type: "error", title: "Update Failed", message: error.message || "Failed to update quantity." })
        } finally {
            setUpdatingItemId(null)
        }
    }

    return (
        <div className="min-h-screen bg-slate-950 pb-24 px-4 md:px-6 lg:px-8 text-slate-100 selection:bg-blue-500/30 font-sans">
            <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />
            {/* Background */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-600/10 rounded-full blur-[120px] opacity-30 animate-pulse" style={{ animationDuration: '8s' }} />
                <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-600/10 rounded-full blur-[120px] opacity-30 animate-pulse" style={{ animationDuration: '10s' }} />
            </div>

            <div className="max-w-6xl mx-auto pt-10 relative z-10">
                <div className="flex items-center gap-4 mb-8">
                    <Button asChild variant="ghost" className="rounded-full w-10 h-10 p-0 bg-slate-900 border border-slate-800 hover:bg-slate-800">
                        <Link href="/marketplace">
                            <ArrowLeft className="w-5 h-5 text-slate-300" />
                        </Link>
                    </Button>
                    <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                        <ShoppingBag className="w-8 h-8 text-blue-400" />
                        Checkout
                    </h1>
                </div>

                {/* Steps Config */}
                <div className="flex items-center justify-center mb-12 relative max-w-2xl mx-auto">
                    <div className="absolute left-0 right-0 top-1/2 h-0.5 bg-slate-800 -z-10" />
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${step >= 1 ? 'bg-blue-600 text-white shadow-[0_0_15px_rgba(37,99,235,0.5)]' : 'bg-slate-800 text-slate-400'} border-4 border-slate-950 transition-colors duration-500`}>1</div>
                    <div className="flex-1" />
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${step >= 2 ? 'bg-blue-600 text-white shadow-[0_0_15px_rgba(37,99,235,0.5)]' : 'bg-slate-800 text-slate-400'} border-4 border-slate-950 transition-colors duration-500`}>2</div>
                    <div className="flex-1" />
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${step === 3 ? 'bg-emerald-500 text-white shadow-[0_0_15px_rgba(16,185,129,0.5)]' : 'bg-slate-800 text-slate-400'} border-4 border-slate-950 transition-colors duration-500`}>3</div>
                </div>

                <AnimatePresence mode="wait">
                    {step === 1 && (
                        <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="max-w-4xl mx-auto space-y-6">
                            <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800/60 rounded-3xl p-6 lg:p-8">
                                <h2 className="text-xl font-bold text-white mb-6">Your Items</h2>

                                {!cart || cart.items.length === 0 ? (
                                    <div className="text-center py-12">
                                        <ShoppingBag className="w-16 h-16 text-slate-700 mx-auto mb-4" />
                                        <p className="text-slate-400 mb-6">Your cart is empty.</p>
                                        <Button asChild className="rounded-full bg-slate-800 hover:bg-slate-700 text-white">
                                            <Link href="/marketplace">Continue Shopping</Link>
                                        </Button>
                                    </div>
                                ) : (
                                    <div className="space-y-8">
                                        {Object.entries(groupedCart).map(([sellerUsername, group]) => (
                                            <div key={sellerUsername} className="bg-slate-950 border border-slate-800/80 rounded-2xl overflow-hidden p-0">
                                                <div className="bg-slate-900 px-5 py-3 border-b border-slate-800 flex justify-between items-center">
                                                    <div className="flex items-center gap-3">
                                                        {group.seller.profile_picture ? (
                                                            // eslint-disable-next-line @next/next/no-img-element
                                                            <img src={group.seller.profile_picture} alt="Avatar" className="w-8 h-8 rounded-full border border-slate-700 object-cover" />
                                                        ) : (
                                                            <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-xs font-bold font-mono border border-slate-700 text-slate-300">
                                                                {sellerUsername[0].toUpperCase()}
                                                            </div>
                                                        )}
                                                        <div>
                                                            <div className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Sold by</div>
                                                            <div className="text-sm font-bold text-slate-200">{group.seller.full_name || sellerUsername}</div>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="p-4 space-y-4">
                                                    {group.items.map((item) => (
                                                        <div key={item.id} className="flex flex-col sm:flex-row gap-4 p-4 rounded-xl bg-slate-900/40 border border-slate-800/60 group transition-colors hover:border-slate-700">
                                                            <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-lg overflow-hidden bg-slate-800 flex-shrink-0">
                                                                <Image
                                                                    src={item.listing.images[0]?.image || "/placeholder.jpg"}
                                                                    alt={item.listing.title}
                                                                    fill
                                                                    className="object-cover"
                                                                />
                                                            </div>
                                                            <div className="flex-1 flex flex-col justify-between">
                                                                <div>
                                                                    <div className="flex justify-between items-start gap-4">
                                                                        <h3 className="font-bold text-slate-100 line-clamp-1 group-hover:text-blue-400 transition-colors">{item.listing.title}</h3>
                                                                        <button onClick={() => handleRemove(item.listing.id)} className="text-slate-500 hover:text-red-400 transition-colors p-1" title="Remove">
                                                                            <Trash2 className="w-4 h-4" />
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                                <div className="flex items-center justify-between mt-4">
                                                                    <div className="flex items-center bg-slate-800 rounded-lg border border-slate-700 h-8 overflow-hidden">
                                                                        <button
                                                                            onClick={() => handleUpdateQuantity(item, -1)}
                                                                            disabled={updatingItemId === item.id}
                                                                            className="w-8 h-full flex items-center justify-center text-slate-300 hover:bg-slate-700 hover:text-white disabled:opacity-50 transition-colors"
                                                                        >-</button>
                                                                        <span className="text-xs font-semibold text-white px-2 min-w-[2rem] text-center">
                                                                            {updatingItemId === item.id ? "..." : (item.quantity || 1)}
                                                                        </span>
                                                                        <button
                                                                            onClick={() => handleUpdateQuantity(item, 1)}
                                                                            disabled={updatingItemId === item.id || (item.quantity || 1) >= item.listing.quantity}
                                                                            className="w-8 h-full flex items-center justify-center text-slate-300 hover:bg-slate-700 hover:text-white disabled:opacity-50 transition-colors"
                                                                        >+</button>
                                                                    </div>
                                                                    <div className="flex items-center gap-2">
                                                                        <span className="text-xs text-slate-500 line-through mr-1">{formatPrice(Number(item.listing.price) * (item.quantity || 1) * 1.2)}</span>
                                                                        <Tag className="w-3.5 h-3.5 text-emerald-400" />
                                                                        <span className="font-bold text-emerald-400">{formatPrice(Number(item.listing.price) * (item.quantity || 1))}</span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>

                                                <div className="bg-slate-900/50 px-5 py-4 border-t border-slate-800 flex flex-col sm:flex-row justify-between items-center gap-4">
                                                    <div>
                                                        <span className="text-slate-500 text-sm font-semibold mr-2 uppercase tracking-wide">Total:</span>
                                                        <span className="text-xl font-black text-white">{formatPrice(group.total)}</span>
                                                    </div>
                                                    <Button
                                                        onClick={() => {
                                                            setSelectedSellerId(sellerUsername)
                                                            setStep(2)
                                                        }}
                                                        className="w-full sm:w-auto bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-xl shadow-lg shadow-emerald-900/20 font-bold"
                                                    >
                                                        Checkout {group.seller.full_name || sellerUsername}
                                                    </Button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    )}

                    {step === 2 && selectedSellerId && groupedCart[selectedSellerId] && (
                        <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                            {/* LEFT PANE: PAYMENT INSTRUCTIONS (QR & UPI) */}
                            <div className="lg:col-span-6 space-y-6">
                                <Button onClick={() => setStep(1)} variant="ghost" className="text-slate-400 p-0 hover:bg-transparent hover:text-white flex items-center gap-2 h-auto mb-4">
                                    <ArrowLeft className="w-4 h-4" /> Back to Cart
                                </Button>

                                <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800/60 rounded-3xl p-6 lg:p-8">
                                    <div className="flex items-center justify-between mb-6">
                                        <h2 className="text-xl font-bold text-white flex items-center gap-2">
                                            <CreditCard className="text-blue-400" /> Pay {groupedCart[selectedSellerId].seller.full_name || selectedSellerId}
                                        </h2>
                                        <div className="text-2xl font-black text-emerald-400">{formatPrice(groupedCart[selectedSellerId].total)}</div>
                                    </div>

                                    {groupedCart[selectedSellerId].seller.upi_qr_code ? (
                                        <div className="bg-white p-4 rounded-2xl mx-auto w-64 h-64 flex items-center justify-center mb-6 shadow-xl shadow-blue-900/10">
                                            {/* eslint-disable-next-line @next/next/no-img-element */}
                                            <img src={groupedCart[selectedSellerId].seller.upi_qr_code} alt="UPI QR Code" className="w-full h-full object-contain" />
                                        </div>
                                    ) : (
                                        <div className="bg-slate-800 p-4 rounded-2xl mx-auto w-64 h-64 flex flex-col items-center justify-center mb-6 text-center border-2 border-dashed border-slate-700">
                                            <ShieldCheck className="w-12 h-12 text-slate-500 mb-2" />
                                            <p className="text-slate-400 text-sm font-bold">No QR Code provided.</p>
                                            <p className="text-slate-500 text-xs mt-1">Please pay using the UPI ID below.</p>
                                        </div>
                                    )}

                                    <div className="bg-slate-950 rounded-xl p-4 border border-slate-800 flex items-center justify-between">
                                        <div>
                                            <div className="text-xs text-slate-500 uppercase tracking-widest font-semibold mb-1">UPI ID</div>
                                            <div className="text-lg font-mono text-blue-400 font-bold break-all">
                                                {groupedCart[selectedSellerId].seller.default_upi_id || "Not provided"}
                                            </div>
                                        </div>
                                        <Button
                                            variant="ghost"
                                            className="bg-slate-800 text-white rounded-lg hover:bg-slate-700 shrink-0"
                                            onClick={() => {
                                                navigator.clipboard.writeText(groupedCart[selectedSellerId!].seller.default_upi_id || "");
                                                toast({ type: "success", title: "Copied!", message: "UPI ID copied to clipboard." })
                                            }}
                                        >
                                            Copy
                                        </Button>
                                    </div>

                                    <div className="mt-6 flex items-start gap-3 p-4 rounded-xl bg-orange-500/10 border border-orange-500/20 text-orange-200 text-xs leading-relaxed">
                                        <ShieldCheck className="w-5 h-5 text-orange-400 flex-shrink-0 mt-0.5" />
                                        <p>
                                            <strong>Direct P2P Payment.</strong> Make the payment using any UPI app. After payment, enter your exact delivery details and the 12-digit UTR (Reference Number) to complete the order.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* RIGHT PANE: CHECKOUT FORM */}
                            <div className="lg:col-span-6">
                                <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800/60 rounded-3xl p-6 lg:p-8">
                                    <h2 className="text-xl font-bold text-white mb-6">Delivery & UTR Details</h2>

                                    <form id="checkout-form" onSubmit={handleCheckout} className="space-y-5">
                                        <div className="space-y-1.5">
                                            <Label className="text-slate-400 text-xs ml-1 font-semibold uppercase tracking-wider">Full Name</Label>
                                            <div className="relative">
                                                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                                                <Input
                                                    required
                                                    value={form.delivery_name}
                                                    onChange={e => setForm({ ...form, delivery_name: e.target.value })}
                                                    placeholder="John Doe"
                                                    className="pl-10 h-12 bg-slate-950/50 border-slate-800 focus-visible:ring-blue-500/50 rounded-xl"
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-1.5">
                                            <Label className="text-slate-400 text-xs ml-1 font-semibold uppercase tracking-wider">Phone Number</Label>
                                            <div className="relative">
                                                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                                                <Input
                                                    required
                                                    type="tel"
                                                    value={form.delivery_phone}
                                                    onChange={e => setForm({ ...form, delivery_phone: e.target.value })}
                                                    placeholder="+91 9876543210"
                                                    className="pl-10 h-12 bg-slate-950/50 border-slate-800 focus-visible:ring-blue-500/50 rounded-xl"
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-1.5">
                                            <Label className="text-slate-400 text-xs ml-1 font-semibold uppercase tracking-wider">Delivery Details / Hostel Block</Label>
                                            <div className="relative">
                                                <MapPin className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
                                                <Textarea
                                                    required
                                                    value={form.delivery_address}
                                                    onChange={e => setForm({ ...form, delivery_address: e.target.value })}
                                                    placeholder="Hostel Block C, Room 402, Near the left wing..."
                                                    className="pl-10 min-h-[80px] bg-slate-950/50 border-slate-800 focus-visible:ring-blue-500/50 rounded-xl resize-none pt-2.5"
                                                />
                                            </div>
                                        </div>
                                        <div className="border border-slate-800 my-2"></div>
                                        <div className="space-y-1.5">
                                            <Label className="text-emerald-400 text-xs ml-1 font-black uppercase tracking-wider">12-Digit UTR Number</Label>
                                            <div className="relative">
                                                <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-500" />
                                                <Input
                                                    required
                                                    value={form.upi_transaction_id}
                                                    onChange={e => setForm({ ...form, upi_transaction_id: e.target.value })}
                                                    placeholder="123456789012"
                                                    className="pl-10 h-12 bg-emerald-950/20 border-emerald-500/30 text-emerald-100 focus-visible:ring-emerald-500/50 rounded-xl font-mono text-lg"
                                                />
                                            </div>
                                            <p className="text-[10px] text-slate-500 ml-1">You can find this Reference/UTR number in your UPI app transaction history after payment.</p>
                                        </div>

                                        <div className="mt-8 pt-4">
                                            <Button
                                                type="submit"
                                                disabled={isProcessing}
                                                className="w-full h-14 rounded-xl font-bold text-lg bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-500/25 transition-all hover:scale-[1.02]"
                                            >
                                                {isProcessing ? <Loader2 className="w-5 h-5 animate-spin" /> : "Verify Payment & Place Order"}
                                            </Button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {step === 3 && order && (
                        <motion.div key="step3" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="max-w-lg mx-auto text-center pt-8">
                            <div className="w-24 h-24 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-6 text-emerald-500 border-4 border-emerald-500">
                                <CheckCircle className="w-12 h-12" />
                            </div>
                            <h2 className="text-3xl font-black text-white mb-4">Payment Confirmed!</h2>
                            <p className="text-slate-400 text-lg mb-8 leading-relaxed">
                                Your escrow payment is secure. We've notified the sellers to prepare your items for delivery.
                            </p>

                            <div className="bg-slate-900/80 rounded-2xl p-6 border border-slate-800 text-left mb-8 max-w-sm mx-auto">
                                <p className="text-sm text-slate-500 mb-1">Order Summary</p>
                                <p className="text-white font-bold mb-4">Order #{order.id}</p>

                                <p className="text-sm text-slate-500 mb-1">Total Paid</p>
                                <p className="text-emerald-400 font-black text-xl mb-4">{formatPrice(order.total_amount)}</p>

                                <p className="text-sm text-slate-500 mb-1">Status</p>
                                <p className="text-blue-400 font-bold uppercase tracking-wider text-sm flex items-center gap-1.5"><ShieldCheck className="w-4 h-4" /> Funds in Escrow</p>
                            </div>

                            <Button asChild className="h-14 px-10 rounded-full font-bold text-lg bg-blue-600 hover:bg-blue-500 text-white shadow-[0_0_30px_rgba(37,99,235,0.3)] transition-all hover:scale-105">
                                <Link href="/marketplace">
                                    Return to The Stash
                                </Link>
                            </Button>
                        </motion.div>
                    )}
                </AnimatePresence>

            </div>
        </div>
    )
}
