"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Search, Filter, ShoppingBag, Plus, Banknote, Image as ImageIcon, Type, AlignLeft, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ProductCard } from "@/components/marketplace/product-card"
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
    SheetFooter,
    SheetClose,
} from "@/components/ui/sheet"
import { cn } from "@/lib/utils"
import { useToast } from "@/components/ui/custom-toast"
import { useMarketplace, Product } from "@/context/marketplace-context"

function MarketplaceContent() {
    const { toast, confirm } = useToast()
    const { products, addProduct, deleteProduct } = useMarketplace()
    const [open, setOpen] = useState(false)
    const [newProduct, setNewProduct] = useState({
        title: "",
        price: "",
        currency: "INR", // Default to INR based on context
        description: "",
        images: [] as string[],
        currentImageInput: ""
    })

    // Simulated current user 
    const currentUser = {
        name: "You",
        username: "current_user",
        avatar: "Y",
        online: true
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target
        setNewProduct(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const handleAddImage = () => {
        if (!newProduct.currentImageInput) return
        if (newProduct.images.length >= 10) {
            toast({ type: "warning", title: "Limit Reached", message: "Maximum 10 images per product." })
            return
        }

        setNewProduct(prev => ({
            ...prev,
            images: [...prev.images, prev.currentImageInput],
            currentImageInput: ""
        }))
    }

    const handleRemoveImage = (index: number) => {
        setNewProduct(prev => ({
            ...prev,
            images: prev.images.filter((_, i) => i !== index)
        }))
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()

        // Basic validation
        if (!newProduct.title || !newProduct.price || !newProduct.description) return

        // Use default image if none provided
        const finalImages = newProduct.images.length > 0
            ? newProduct.images
            : ["https://images.unsplash.com/photo-1550009158-9ebf69173e03?q=80&w=2601&auto=format&fit=crop"]

        const product: Product = {
            id: Date.now().toString(),
            title: newProduct.title,
            price: parseFloat(newProduct.price),
            currency: newProduct.currency,
            description: newProduct.description,
            images: finalImages,
            seller: currentUser
        }

        addProduct(product)
        setOpen(false)
        setNewProduct({
            title: "",
            price: "",
            currency: "INR",
            description: "",
            images: [],
            currentImageInput: ""
        })

        toast({
            type: "success",
            title: "Item Listed Successfully!",
            message: "Your item is now visible on the marketplace."
        })
    }

    const handleDelete = async (productId: string) => {
        const confirmed = await confirm({
            title: "Delete Item?",
            description: "Are you sure you want to delete this listing? This action cannot be undone.",
            confirmText: "Delete",
            variant: "danger"
        })

        if (confirmed) {
            deleteProduct(productId)
            toast({
                type: "info",
                title: "Item Deleted",
                message: "Your listing has been removed."
            })
        }
    }

    const handleEdit = () => {
        toast({
            type: "info",
            title: "Coming Soon",
            message: "Edit functionality will be available in the next update."
        })
    }

    return (
        <div className="min-h-screen bg-slate-950 pt-10 md:pt-24 pb-20 px-4 md:px-6 lg:px-8">

            {/* Header Section */}
            <div className="max-w-7xl mx-auto mb-12">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col md:flex-row md:items-end justify-between gap-6"
                >
                    <div>
                        <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-400 via-rose-400 to-orange-400 mb-4 tracking-tight">
                            The Stash 🎒
                        </h1>
                        <p className="text-slate-400 text-lg max-w-xl">
                            Verified student exclusives. Cop the best deals on campus before they're gone.
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        <Sheet open={open} onOpenChange={setOpen}>
                            <SheetTrigger asChild>
                                <Button className="rounded-full bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-500/20 transition-all hover:scale-105">
                                    <ShoppingBag className="w-4 h-4 mr-2" />
                                    Sell an Item
                                </Button>
                            </SheetTrigger>
                            <SheetContent className="bg-slate-950 border-l border-white/10 text-slate-100 sm:max-w-lg w-full overflow-y-auto p-0 gap-0">
                                {/* Customized Header */}
                                <div className="relative p-6 pt-12 overflow-hidden bg-gradient-to-br from-blue-900/20 to-purple-900/20 border-b border-white/10">
                                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-purple-500" />
                                    <SheetTitle className="text-3xl font-bold text-white mb-2">Sell an Item</SheetTitle>
                                    <SheetDescription className="text-slate-400 text-base">
                                        Turn your unused items into cash. listing takes less than a minute.
                                    </SheetDescription>
                                </div>

                                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                                    <div className="space-y-5">

                                        {/* Title Input */}
                                        <div className="space-y-2 group">
                                            <Label htmlFor="title" className="text-slate-300 font-medium group-focus-within:text-blue-400 transition-colors">Item Title</Label>
                                            <div className="relative">
                                                <Type className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-blue-500 transition-colors" />
                                                <Input
                                                    id="title"
                                                    name="title"
                                                    placeholder="What are you selling?"
                                                    className="pl-10 bg-slate-900/50 border-slate-700 focus-visible:ring-blue-500/50 focus-visible:border-blue-500 h-12 transition-all"
                                                    value={newProduct.title}
                                                    onChange={handleInputChange}
                                                    required
                                                />
                                            </div>
                                        </div>

                                        {/* Price Input with Currency */}
                                        <div className="space-y-2 group">
                                            <Label htmlFor="price" className="text-slate-300 font-medium group-focus-within:text-green-400 transition-colors">Price</Label>
                                            <div className="flex gap-2">
                                                <div className="relative w-24">
                                                    <select
                                                        name="currency"
                                                        value={newProduct.currency}
                                                        onChange={handleInputChange}
                                                        className="w-full h-12 bg-slate-900/50 border border-slate-700 rounded-md px-2 text-sm text-slate-200 focus:outline-none focus:ring-1 focus:ring-green-500 cursor-pointer appearance-none text-center font-bold"
                                                    >
                                                        <option value="USD">USD ($)</option>
                                                        <option value="INR">INR (₹)</option>
                                                        <option value="EUR">EUR (€)</option>
                                                        <option value="GBP">GBP (£)</option>
                                                        <option value="JPY">JPY (¥)</option>
                                                        <option value="AUD">AUD ($)</option>
                                                        <option value="CAD">CAD ($)</option>
                                                    </select>
                                                </div>
                                                <div className="relative flex-1">
                                                    <Banknote className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-green-500 transition-colors" />
                                                    <Input
                                                        id="price"
                                                        name="price"
                                                        type="number"
                                                        placeholder="0.00"
                                                        className="pl-10 bg-slate-900/50 border-slate-700 focus-visible:ring-green-500/50 focus-visible:border-green-500 h-12 transition-all font-mono"
                                                        value={newProduct.price}
                                                        onChange={handleInputChange}
                                                        required
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        {/* Description Input */}
                                        <div className="space-y-2 group">
                                            <Label htmlFor="description" className="text-slate-300 font-medium group-focus-within:text-purple-400 transition-colors">Description</Label>
                                            <div className="relative">
                                                <div className="absolute left-3 top-4 w-5 h-5 text-slate-500 group-focus-within:text-purple-500 transition-colors">
                                                    <AlignLeft className="w-5 h-5" />
                                                </div>
                                                <Textarea
                                                    id="description"
                                                    name="description"
                                                    placeholder="Describe the condition, specs, reason for selling..."
                                                    className="pl-10 min-h-[140px] bg-slate-900/50 border-slate-700 focus-visible:ring-purple-500/50 focus-visible:border-purple-500 resize-none transition-all leading-relaxed pt-3.5"
                                                    value={newProduct.description}
                                                    onChange={handleInputChange}
                                                    required
                                                />
                                            </div>
                                        </div>

                                        {/* Images Input */}
                                        <div className="space-y-3 group">
                                            <div className="flex justify-between items-center">
                                                <Label htmlFor="currentImageInput" className="text-slate-300 font-medium group-focus-within:text-pink-400 transition-colors">Images ({newProduct.images.length}/10)</Label>
                                            </div>

                                            <div className="relative flex gap-2">
                                                <div className="relative flex-1">
                                                    <ImageIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-pink-500 transition-colors" />
                                                    <Input
                                                        id="currentImageInput"
                                                        name="currentImageInput"
                                                        placeholder="https://example.com/image.jpg"
                                                        className="pl-10 bg-slate-900/50 border-slate-700 focus-visible:ring-pink-500/50 focus-visible:border-pink-500 h-12 transition-all"
                                                        value={newProduct.currentImageInput}
                                                        onChange={handleInputChange}
                                                        onKeyDown={(e) => {
                                                            if (e.key === 'Enter') {
                                                                e.preventDefault();
                                                                handleAddImage();
                                                            }
                                                        }}
                                                    />
                                                </div>
                                                <Button
                                                    type="button"
                                                    onClick={handleAddImage}
                                                    disabled={!newProduct.currentImageInput || newProduct.images.length >= 10}
                                                    className="bg-slate-800 text-slate-200 hover:bg-slate-700 h-12 px-4"
                                                >
                                                    Add
                                                </Button>
                                            </div>

                                            {/* Images Preview List */}
                                            {newProduct.images.length > 0 && (
                                                <div className="grid grid-cols-4 gap-2 mt-2">
                                                    <AnimatePresence>
                                                        {newProduct.images.map((img, idx) => (
                                                            <motion.div
                                                                key={idx}
                                                                initial={{ opacity: 0, scale: 0.8 }}
                                                                animate={{ opacity: 1, scale: 1 }}
                                                                exit={{ opacity: 0, scale: 0.8 }}
                                                                className="relative aspect-square rounded-lg overflow-hidden border border-slate-700 group/img"
                                                            >
                                                                <img src={img} alt={`Preview ${idx}`} className="w-full h-full object-cover" />
                                                                <button
                                                                    type="button"
                                                                    onClick={() => handleRemoveImage(idx)}
                                                                    className="absolute top-1 right-1 bg-black/60 text-white p-1 rounded-full opacity-0 group-hover/img:opacity-100 transition-opacity hover:bg-red-500"
                                                                >
                                                                    <X className="w-3 h-3" />
                                                                </button>
                                                            </motion.div>
                                                        ))}
                                                    </AnimatePresence>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <SheetFooter className="pt-6 flex flex-col gap-3 sm:flex-col sm:space-x-0">
                                        <Button
                                            type="submit"
                                            className="w-full h-14 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white rounded-xl text-lg font-bold shadow-lg shadow-blue-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
                                        >
                                            <Plus className="w-5 h-5 mr-2" />
                                            List for Sale
                                        </Button>
                                    </SheetFooter>
                                </form>
                            </SheetContent>
                        </Sheet>
                    </div>
                </motion.div>

                {/* Search & Filter Bar */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="mt-8 p-2 bg-slate-900/50 border border-slate-800 rounded-2xl flex flex-col md:flex-row gap-2"
                >
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                        <Input
                            placeholder="Search for items..."
                            className="pl-10 bg-transparent border-none focus-visible:ring-0 text-slate-200 placeholder:text-slate-500 h-11"
                        />
                    </div>
                    <div className="flex gap-2">
                        <Button variant="ghost" className="text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl">
                            <Filter className="w-4 h-4 mr-2" />
                            Filters
                        </Button>
                        <Button variant="ghost" className="text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl">
                            Sort by: Newest
                        </Button>
                    </div>
                </motion.div>
            </div>

            {/* Product Grid */}
            <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {products.map((product) => (
                    <ProductCard
                        key={product.id}
                        product={product}
                        isOwner={product.seller.username === currentUser.username}
                        onDelete={() => handleDelete(product.id)}
                        onEdit={handleEdit}
                    />
                ))}
            </div>

        </div>
    )
}

export default function MarketplacePage() {
    return <MarketplaceContent />
}
