"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Star, ShieldCheck, User as UserIcon, MapPin, CheckCircle, Package, ArrowLeft, Loader2, MessageCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useMarketplace } from "@/context/marketplace-context"
import { marketplaceApi, SellerReview, Listing } from "@/services/marketplace"
import Link from "next/link"
import Image from "next/image"
import { useToast } from "@/components/ui/custom-toast"
import { ProductCard } from "@/components/marketplace/product-card"
import { useRouter } from "next/navigation"

export default function SellerProfilePage({ params }: { params: { username: string } }) {
    const { username } = params
    const { toast } = useToast()
    const router = useRouter()

    const [seller, setSeller] = useState<any>(null)
    const [listings, setListings] = useState<Listing[]>([])
    const [reviews, setReviews] = useState<SellerReview[]>([])
    const [isLoading, setIsLoading] = useState(true)

    // Tabs state
    const [activeTab, setActiveTab] = useState<"listings" | "reviews">("listings")

    // Review form state
    const [reviewForm, setReviewForm] = useState(false)
    const [rating, setRating] = useState(0)
    const [hoverRating, setHoverRating] = useState(0)
    const [comment, setComment] = useState("")
    const [isSubmitting, setIsSubmitting] = useState(false)

    useEffect(() => {
        const fetchProfiles = async () => {
            setIsLoading(true)
            try {
                // Fetch public user profile
                const token = localStorage.getItem('sociaverse_token')
                const headers: any = {}
                if (token) headers['Authorization'] = `Token ${token}`

                const profileUrl = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/users/u/${username}/`
                const [profileRes, listingsData, reviewsData] = await Promise.all([
                    fetch(profileUrl, { headers }),
                    marketplaceApi.getListings({ seller: username, status: 'active' }),
                    marketplaceApi.getSellerReviews(username).catch(() => [])
                ])

                if (!profileRes.ok) throw new Error("Seller not found")

                const profileData = await profileRes.json()
                setSeller(profileData)
                setListings(listingsData)
                setReviews(reviewsData)
            } catch (error) {
                console.error("Failed to load seller profile", error)
                toast({ type: "error", title: "User Not Found", message: "This seller profile does not exist or we couldn't load it." })
            } finally {
                setIsLoading(false)
            }
        }
        fetchProfiles()
    }, [username, toast])

    const handleSubmitReview = async (e: React.FormEvent) => {
        e.preventDefault()
        if (rating === 0) {
            toast({ type: "error", title: "Rating Required", message: "Please select a star rating." })
            return
        }

        setIsSubmitting(true)
        try {
            const newReview = await marketplaceApi.createSellerReview(username, { rating, comment })
            setReviews(prev => [newReview, ...prev])
            setReviewForm(false)
            setRating(0)
            setComment("")
            toast({ type: "success", title: "Review Submitted", message: "Thank you for sharing your experience!" })
        } catch (error: any) {
            toast({ type: "error", title: "Cannot submit review", message: error.message || "Something went wrong." })
        } finally {
            setIsSubmitting(false)
        }
    }

    if (isLoading) {
        return (
            <div className="min-h-screen bg-slate-950 flex items-center justify-center">
                <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
            </div>
        )
    }

    if (!seller) {
        return (
            <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 text-center">
                <UserIcon className="w-20 h-20 text-slate-800 mb-6" />
                <h1 className="text-2xl font-bold text-white mb-2">Seller Not Found</h1>
                <p className="text-slate-400 mb-8 max-w-sm">We couldn't locate the profile you're looking for. They may have changed their username or deleted their account.</p>
                <Button asChild className="rounded-full bg-blue-600 hover:bg-blue-500 text-white">
                    <Link href="/marketplace">Return to Marketplace</Link>
                </Button>
            </div>
        )
    }

    const avgRating = reviews.length > 0 ? (reviews.reduce((a, b) => a + b.rating, 0) / reviews.length).toFixed(1) : "0.0"

    const handleInquire = async () => {
        try {
            await marketplaceApi.contactSeller(listings.length > 0 ? listings[0].id : 0)
        } catch (e) {
            // fail silently or redirect manually
        }
        const params = new URLSearchParams({
            seller: seller.username,
            sellerName: seller.first_name ? `${seller.first_name} ${seller.last_name || ''}` : seller.username,
        })
        router.push(`/chat?${params.toString()}`)
    }

    return (
        <div className="min-h-screen bg-slate-950 pb-24 px-4 md:px-6 lg:px-8 text-slate-100 font-sans">
            <div className="max-w-6xl mx-auto pt-6">

                {/* Back Button */}
                <Button asChild variant="ghost" className="rounded-full w-10 h-10 p-0 bg-slate-900 border border-slate-800 hover:bg-slate-800 mb-6">
                    <Link href="/marketplace">
                        <ArrowLeft className="w-5 h-5 text-slate-300" />
                    </Link>
                </Button>

                {/* Seller Header Banner */}
                <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800/80 rounded-3xl p-8 mb-8 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-[80px] pointer-events-none" />

                    <div className="flex flex-col md:flex-row gap-8 items-start relative z-10">
                        {/* Avatar */}
                        <div className="relative">
                            <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-slate-950 shadow-2xl bg-slate-800 flex items-center justify-center text-4xl font-bold text-slate-500">
                                {seller.profile_picture ? (
                                    <Image src={seller.profile_picture} alt={seller.username} fill className="object-cover" />
                                ) : seller.username[0].toUpperCase()}
                            </div>
                            {seller.is_verified && (
                                <div className="absolute bottom-2 right-2 bg-blue-500 text-white p-1 rounded-full border-2 border-slate-950 shadow-lg" title="Verified Seller">
                                    <CheckCircle className="w-5 h-5" />
                                </div>
                            )}
                        </div>

                        {/* Info */}
                        <div className="flex-1">
                            <h1 className="text-3xl font-black text-white mb-1 flex items-center gap-3">
                                {seller.first_name ? `${seller.first_name} ${seller.last_name || ''}` : seller.username}
                                {seller.is_verified && <ShieldCheck className="w-6 h-6 text-emerald-500" />}
                            </h1>
                            <p className="text-slate-400 text-lg mb-4">@{seller.username}</p>

                            <div className="flex flex-wrap items-center gap-6 mb-6">
                                <div className="flex items-center gap-2">
                                    <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                                    <span className="font-bold text-lg text-white">{avgRating}</span>
                                    <span className="text-slate-400 text-sm">({reviews.length} reviews)</span>
                                </div>
                                {(seller.college || listings[0]?.location) && (
                                    <div className="flex items-center gap-1.5 text-slate-400">
                                        <MapPin className="w-5 h-5" />
                                        <span>{seller.college || listings[0]?.location || 'Campus Unspecified'}</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Action Base */}
                        <div className="flex flex-col gap-3 min-w-[200px]">
                            <Button onClick={handleInquire} className="w-full rounded-full h-12 bg-blue-600 hover:bg-blue-500 text-white font-bold shadow-[0_0_20px_rgba(37,99,235,0.2)]">
                                <MessageCircle className="w-5 h-5 mr-2" /> Message Seller
                            </Button>
                            <Button
                                onClick={() => { setActiveTab("reviews"); setReviewForm(true) }}
                                variant="outline"
                                className="w-full rounded-full h-12 border-slate-700 bg-slate-800 text-slate-300 hover:bg-slate-700 font-semibold"
                            >
                                <Star className="w-4 h-4 mr-2 text-yellow-500" /> Write a Review
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Tabs Config */}
                <div className="flex items-center gap-2 mb-8 border-b border-slate-800">
                    <button
                        onClick={() => setActiveTab("listings")}
                        className={`px-6 py-4 font-bold text-sm uppercase tracking-wider relative transition-colors ${activeTab === 'listings' ? 'text-blue-400' : 'text-slate-500 hover:text-slate-300'}`}
                    >
                        Active Listings ({listings.length})
                        {activeTab === 'listings' && <motion.div layoutId="tab-indicator" className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500" />}
                    </button>
                    <button
                        onClick={() => setActiveTab("reviews")}
                        className={`px-6 py-4 font-bold text-sm uppercase tracking-wider relative transition-colors ${activeTab === 'reviews' ? 'text-blue-400' : 'text-slate-500 hover:text-slate-300'}`}
                    >
                        Reviews ({reviews.length})
                        {activeTab === 'reviews' && <motion.div layoutId="tab-indicator" className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500" />}
                    </button>
                </div>

                <AnimatePresence mode="wait">
                    {activeTab === "listings" && (
                        <motion.div key="listings" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                            {listings.length === 0 ? (
                                <div className="text-center py-20 bg-slate-900/40 rounded-3xl border border-slate-800/60 border-dashed">
                                    <Package className="w-16 h-16 text-slate-700 mx-auto mb-4" />
                                    <h3 className="text-xl font-bold text-slate-300 mb-2">No active listings</h3>
                                    <p className="text-slate-500">This seller currently has no items for sale.</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                                    {listings.map(listing => (
                                        <ProductCard key={listing.id} product={listing} />
                                    ))}
                                </div>
                            )}
                        </motion.div>
                    )}

                    {activeTab === "reviews" && (
                        <motion.div key="reviews" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="max-w-3xl">

                            {/* Review Form */}
                            <AnimatePresence>
                                {reviewForm && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0, overflow: 'hidden' }}
                                        animate={{ opacity: 1, height: 'auto', overflow: 'visible' }}
                                        exit={{ opacity: 0, height: 0, overflow: 'hidden' }}
                                        className="mb-8"
                                    >
                                        <div className="bg-slate-900 border border-blue-500/30 rounded-3xl p-6 shadow-[0_0_30px_rgba(37,99,235,0.05)] relative">
                                            <h3 className="text-lg font-bold text-white mb-4">Rate your experience</h3>
                                            <form onSubmit={handleSubmitReview} className="space-y-4">
                                                <div className="flex items-center gap-1 mb-2">
                                                    {[1, 2, 3, 4, 5].map((star) => (
                                                        <button
                                                            key={star}
                                                            type="button"
                                                            onClick={() => setRating(star)}
                                                            onMouseEnter={() => setHoverRating(star)}
                                                            onMouseLeave={() => setHoverRating(0)}
                                                            className="p-1 focus:outline-none transition-transform hover:scale-110 active:scale-95"
                                                        >
                                                            <Star
                                                                className={`w-8 h-8 transition-colors duration-200 ${(hoverRating || rating) >= star ? 'text-yellow-400 fill-yellow-400' : 'text-slate-700'}`}
                                                            />
                                                        </button>
                                                    ))}
                                                </div>
                                                <Textarea
                                                    placeholder="Share details of your experience with this seller (optional)"
                                                    value={comment}
                                                    onChange={(e) => setComment(e.target.value)}
                                                    className="bg-slate-950/50 border-slate-800 rounded-xl min-h-[100px] resize-none focus-visible:ring-blue-500/50"
                                                />
                                                <div className="flex gap-3 justify-end pt-2">
                                                    <Button type="button" variant="ghost" onClick={() => setReviewForm(false)} className="rounded-full text-slate-400 hover:text-white">Cancel</Button>
                                                    <Button type="submit" disabled={isSubmitting || rating === 0} className="rounded-full bg-blue-600 hover:bg-blue-500 px-6 font-bold shadow-lg shadow-blue-500/25">
                                                        {isSubmitting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Star className="w-4 h-4 mr-2 fill-current" />}
                                                        Submit Review
                                                    </Button>
                                                </div>
                                            </form>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* Reviews List */}
                            {reviews.length === 0 ? (
                                <div className="text-center py-16 bg-slate-900/40 rounded-3xl border border-slate-800/60">
                                    <ShieldCheck className="w-12 h-12 text-slate-700 mx-auto mb-4" />
                                    <h3 className="text-lg font-bold text-slate-300 mb-2">No reviews yet</h3>
                                    <p className="text-slate-500 mb-6">Be the first to share your experience with this seller.</p>
                                    {!reviewForm && (
                                        <Button onClick={() => setReviewForm(true)} variant="outline" className="rounded-full border-slate-700 text-slate-300 bg-slate-900">
                                            Write a Review
                                        </Button>
                                    )}
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {reviews.map((review) => (
                                        <div key={review.id} className="bg-slate-900/40 border border-slate-800 p-6 rounded-2xl flex gap-4">
                                            <div className="w-12 h-12 rounded-full overflow-hidden bg-slate-800 flex-shrink-0 border border-slate-700">
                                                {review.reviewer_avatar ? (
                                                    <Image src={review.reviewer_avatar} alt={review.reviewer_username} width={48} height={48} className="object-cover w-full h-full" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-slate-500 font-bold uppercase">{review.reviewer_username[0]}</div>
                                                )}
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex justify-between items-start mb-1">
                                                    <h4 className="font-bold text-slate-200">@{review.reviewer_username}</h4>
                                                    <span className="text-xs text-slate-500">{new Date(review.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                                                </div>
                                                <div className="flex gap-0.5 mb-3">
                                                    {[1, 2, 3, 4, 5].map(star => (
                                                        <Star key={star} className={`w-3.5 h-3.5 ${star <= review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-slate-700'}`} />
                                                    ))}
                                                </div>
                                                {review.comment && (
                                                    <p className="text-slate-400 text-sm leading-relaxed">{review.comment}</p>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>

            </div>
        </div>
    )
}
