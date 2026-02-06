import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { MessageCircle, Tag, Trash2, Edit, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { Product } from "@/context/marketplace-context"

interface ProductCardProps {
    product: Product
    isOwner?: boolean
    onDelete?: () => void
    onEdit?: () => void
}

export function ProductCard({ product, isOwner, onDelete, onEdit }: ProductCardProps) {
    const router = useRouter()

    const handleInquire = (e: React.MouseEvent) => {
        e.preventDefault() // Prevent Link navigation if wrapped
        // Redirect to chat with query params for the seller and product
        const params = new URLSearchParams({
            seller: product.seller.username,
            sellerName: product.seller.name,
            product: product.title,
        })
        router.push(`/chat?${params.toString()}`)
    }

    const formatPrice = (price: number, currency: string) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: currency,
            maximumFractionDigits: 0,
        }).format(price)
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -5 }}
            transition={{ duration: 0.3 }}
            className={cn(
                "group relative bg-slate-900/50 backdrop-blur-sm border rounded-2xl overflow-hidden hover:shadow-2xl transition-all",
                isOwner
                    ? "border-blue-500/50 shadow-blue-500/5 hover:shadow-blue-500/20"
                    : "border-slate-800/50 hover:shadow-blue-500/10"
            )}
        >
            {/* Owner Badge */}
            {isOwner && (
                <div className="absolute top-0 left-0 bg-blue-600 text-white text-[10px] font-bold px-3 py-1 rounded-br-xl z-20 flex items-center gap-1">
                    <User className="w-3 h-3" />
                    YOUR LISTING
                </div>
            )}

            {/* Product Image - Clickable to Details */}
            <Link href={`/marketplace/${product.id}`} className="block relative aspect-[4/3] overflow-hidden bg-slate-800 cursor-pointer">
                <Image
                    src={product.images[0]}
                    alt={product.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 flex items-center gap-1 z-10">
                    <Tag className="w-3 h-3 text-emerald-400" />
                    <span className="text-sm font-semibold text-white">{formatPrice(product.price, product.currency)}</span>
                </div>
            </Link>

            {/* Content */}
            <div className="p-5 space-y-4">
                <div>
                    <h3 className="text-xl font-bold text-slate-100 mb-1 group-hover:text-blue-400 transition-colors">
                        {product.title}
                    </h3>
                    <p className="text-sm text-slate-400 line-clamp-2">
                        {product.description}
                    </p>
                </div>

                {/* Seller Info & Action */}
                <div className="pt-4 border-t border-slate-800/50 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                        <div className="relative">
                            <div className={cn(
                                "w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white border border-slate-700",
                                isOwner ? "bg-gradient-to-br from-blue-600 to-indigo-600" : "bg-gradient-to-br from-slate-600 to-slate-700"
                            )}>
                                {product.seller.avatar}
                            </div>
                            {product.seller.online && !isOwner && (
                                <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 border-2 border-slate-900 rounded-full" />
                            )}
                        </div>
                        <div className="flex flex-col">
                            <span className={cn("text-xs font-medium", isOwner ? "text-blue-200" : "text-slate-300")}>
                                {isOwner ? "You" : product.seller.name}
                            </span>
                            <span className="text-[10px] text-slate-500">@{product.seller.username}</span>
                        </div>
                    </div>

                    {isOwner ? (
                        <div className="flex items-center gap-2">
                            <Button
                                size="sm"
                                variant="ghost"
                                onClick={onEdit}
                                className="h-8 w-8 p-0 rounded-full text-slate-400 hover:text-white hover:bg-slate-800"
                            >
                                <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                                size="sm"
                                variant="ghost"
                                onClick={onDelete}
                                className="h-8 w-8 p-0 rounded-full text-red-400 hover:text-red-300 hover:bg-red-900/20"
                            >
                                <Trash2 className="w-4 h-4" />
                            </Button>
                        </div>
                    ) : (
                        <Button
                            size="sm"
                            onClick={handleInquire}
                            className="rounded-full bg-slate-800 hover:bg-blue-600 text-slate-200 hover:text-white border border-slate-700 hover:border-blue-500 transition-all duration-300"
                        >
                            <MessageCircle className="w-4 h-4 mr-1.5" />
                            Inquire
                        </Button>
                    )}
                </div>
            </div>
        </motion.div>
    )
}
