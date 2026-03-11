"use client"

import { useState, useRef, useCallback, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
    ShoppingBag, Plus, Banknote, AlignLeft, X, Upload,
    MapPin, Type, Loader2
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
    Sheet, SheetContent, SheetTitle, SheetDescription, SheetTrigger, SheetFooter,
} from "@/components/ui/sheet"
import { useToast } from "@/components/ui/custom-toast"
import { marketplaceApi, Listing } from "@/services/marketplace"
import Image from "next/image"

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

const CURRENCIES = ["INR", "USD", "EUR", "GBP"]
const MAX_IMAGES = 10
const MAX_FILE_SIZE_MB = 8

interface EditItemSheetProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    listing: Listing | null;
    onSuccess?: () => void;
}

export function EditItemSheet({ open, onOpenChange, listing, onSuccess }: EditItemSheetProps) {
    const { toast } = useToast()
    const [isSubmitting, setIsSubmitting] = useState(false)

    const [form, setForm] = useState({
        title: "",
        description: "",
        price: "",
        currency: "INR",
        category: "other",
        condition: "good",
        is_negotiable: true,
        location: "",
        upi_id: "",
    })

    // Existing images (URLs)
    const [existingImages, setExistingImages] = useState<{ id: number; image: string }[]>([])
    // New Images (Files)
    const [imageFiles, setImageFiles] = useState<File[]>([])
    const [imagePreviews, setImagePreviews] = useState<string[]>([])
    const fileInputRef = useRef<HTMLInputElement>(null)

    // Images to delete
    const [imagesToDelete, setImagesToDelete] = useState<number[]>([])

    useEffect(() => {
        if (open && listing) {
            setForm({
                title: listing.title,
                description: listing.description,
                price: listing.price.toString(),
                currency: listing.currency,
                category: listing.category,
                condition: listing.condition,
                is_negotiable: listing.is_negotiable,
                location: listing.location || "",
                upi_id: listing.upi_id || "",
            })
            setExistingImages(listing.images || [])
            setImageFiles([])
            setImagePreviews([])
            setImagesToDelete([])
        }
    }, [open, listing])

    const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target
        setForm(prev => ({
            ...prev,
            [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
        }))
    }

    const handleFileSelect = useCallback((files: FileList | null) => {
        if (!files) return
        const newFiles = Array.from(files)
        const totalCount = existingImages.length + imageFiles.length
        const remaining = MAX_IMAGES - totalCount
        const toAdd = newFiles.slice(0, remaining)

        const oversized = toAdd.filter(f => f.size > MAX_FILE_SIZE_MB * 1024 * 1024)
        if (oversized.length > 0) {
            toast({ type: "warning", title: "File too large", message: `Max file size is ${MAX_FILE_SIZE_MB}MB.` })
        }

        const valid = toAdd.filter(f => f.size <= MAX_FILE_SIZE_MB * 1024 * 1024)
        setImageFiles(prev => [...prev, ...valid])
        valid.forEach(f => {
            const reader = new FileReader()
            reader.onload = e => setImagePreviews(prev => [...prev, e.target?.result as string])
            reader.readAsDataURL(f)
        })
    }, [existingImages.length, imageFiles.length, toast])

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault()
        handleFileSelect(e.dataTransfer.files)
    }

    const removeNewImage = (idx: number) => {
        setImageFiles(prev => prev.filter((_, i) => i !== idx))
        setImagePreviews(prev => prev.filter((_, i) => i !== idx))
    }

    const removeExistingImage = (id: number) => {
        setExistingImages(prev => prev.filter(img => img.id !== id))
        setImagesToDelete(prev => [...prev, id])
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!listing || !form.title || !form.price || !form.description) return
        setIsSubmitting(true)
        try {
            await marketplaceApi.updateListing(listing.id, {
                ...form,
                new_images: imageFiles, // Note: Need to make sure updateListing handles this
                deleted_image_ids: imagesToDelete
            })
            onOpenChange(false)
            toast({ type: "success", title: "Updated! 🎉", message: "Your item details were updated." })
            if (onSuccess) onSuccess()
        } catch (err: unknown) {
            const errorMessage = err instanceof Error ? err.message : "Something went wrong."
            toast({ type: "error", title: "Failed to update", message: errorMessage })
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent className="bg-slate-950 border-l border-white/10 text-slate-100 sm:max-w-lg w-full overflow-y-auto p-0 gap-0">
                <div className="relative p-6 pt-12 overflow-hidden bg-gradient-to-br from-blue-900/20 to-purple-900/20 border-b border-white/10">
                    <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-blue-500 to-purple-500" />
                    <SheetTitle className="text-2xl font-bold text-white mb-1">Sell an Item</SheetTitle>
                    <SheetDescription className="text-slate-400">Fill in the details and upload photos.</SheetDescription>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-5">
                    {/* Title */}
                    <div className="space-y-1.5">
                        <Label className="text-slate-300 font-medium">Item Title *</Label>
                        <div className="relative">
                            <Type className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                            <Input name="title" value={form.title} onChange={handleFormChange} required
                                placeholder="What are you selling?"
                                className="pl-10 bg-slate-900/50 border-slate-700 focus-visible:ring-blue-500/50 focus-visible:border-blue-500 h-11" />
                        </div>
                    </div>

                    {/* Price + Currency */}
                    <div className="space-y-1.5">
                        <Label className="text-slate-300 font-medium">Price *</Label>
                        <div className="flex gap-2">
                            <select name="currency" value={form.currency} onChange={handleFormChange}
                                className="w-24 h-11 bg-slate-900/50 border border-slate-700 rounded-md px-2 text-sm text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer text-center font-bold">
                                {CURRENCIES.map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                            <div className="relative flex-1">
                                <Banknote className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                                <Input name="price" type="number" value={form.price} onChange={handleFormChange} required min="1"
                                    placeholder="0.00"
                                    className="pl-10 bg-slate-900/50 border-slate-700 focus-visible:ring-green-500/50 focus-visible:border-green-500 h-11 font-mono" />
                            </div>
                        </div>
                        <label className="flex items-center gap-2 text-sm text-slate-400 cursor-pointer pt-1">
                            <input type="checkbox" name="is_negotiable" checked={form.is_negotiable}
                                onChange={handleFormChange} className="rounded border-slate-600 bg-slate-800 accent-blue-500" />
                            Price is negotiable
                        </label>
                    </div>

                    {/* Category + Condition */}
                    <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1.5">
                            <Label className="text-slate-300 font-medium">Category</Label>
                            <select name="category" value={form.category} onChange={handleFormChange}
                                className="w-full h-11 bg-slate-900/50 border border-slate-700 rounded-md px-3 text-sm text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer">
                                {CATEGORIES.filter(c => c.value).map(c =>
                                    <option key={c.value} value={c.value}>{c.emoji} {c.label}</option>
                                )}
                            </select>
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-slate-300 font-medium">Condition</Label>
                            <select name="condition" value={form.condition} onChange={handleFormChange}
                                className="w-full h-11 bg-slate-900/50 border border-slate-700 rounded-md px-3 text-sm text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer">
                                {CONDITIONS.filter(c => c.value).map(c =>
                                    <option key={c.value} value={c.value}>{c.label}</option>
                                )}
                            </select>
                        </div>
                    </div>

                    {/* Location & UPI ID */}
                    <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1.5">
                            <Label className="text-slate-300 font-medium">Location <span className="text-slate-500 font-normal text-xs">(optional)</span></Label>
                            <div className="relative">
                                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                                <Input name="location" value={form.location} onChange={handleFormChange}
                                    placeholder="Hostel Block C..."
                                    className="pl-10 bg-slate-900/50 border-slate-700 focus-visible:ring-purple-500/50 focus-visible:border-purple-500 h-11" />
                            </div>
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-slate-300 font-medium flex items-center gap-1.5 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
                                UPI ID <span className="text-slate-500 font-normal text-xs">(optional)</span>
                            </Label>
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-slate-500">₹</span>
                                <Input name="upi_id" value={form.upi_id} onChange={handleFormChange}
                                    placeholder="username@ybl"
                                    className="pl-8 bg-slate-900/50 border-slate-700 focus-visible:ring-blue-500/50 focus-visible:border-blue-500 h-11 font-mono text-sm" />
                            </div>
                        </div>
                    </div>

                    {/* Description */}
                    <div className="space-y-1.5">
                        <Label className="text-slate-300 font-medium">Description *</Label>
                        <div className="relative">
                            <AlignLeft className="absolute left-3 top-3.5 w-4 h-4 text-slate-500" />
                            <Textarea name="description" value={form.description} onChange={handleFormChange} required
                                placeholder="Describe condition, specs, why you're selling..."
                                className="pl-10 min-h-[120px] bg-slate-900/50 border-slate-700 focus-visible:ring-purple-500/50 focus-visible:border-purple-500 resize-none leading-relaxed pt-3.5" />
                        </div>
                    </div>

                    {/* Image Upload */}
                    <div className="space-y-2">
                        <div className="flex justify-between items-center">
                            <Label className="text-slate-300 font-medium">Photos ({existingImages.length + imageFiles.length}/{MAX_IMAGES})</Label>
                        </div>

                        {/* Drop zone */}
                        {existingImages.length + imageFiles.length < MAX_IMAGES && (
                            <div
                                onDrop={handleDrop}
                                onDragOver={e => e.preventDefault()}
                                onClick={() => fileInputRef.current?.click()}
                                className="border-2 border-dashed border-slate-700 hover:border-blue-500/60 rounded-xl p-6 text-center cursor-pointer transition-colors bg-slate-900/30 hover:bg-blue-900/10"
                            >
                                <Upload className="w-7 h-7 text-slate-500 mx-auto mb-2" />
                                <p className="text-sm text-slate-400">Drop photos here or <span className="text-blue-400">browse</span></p>
                                <p className="text-xs text-slate-600 mt-1">JPG, PNG, WEBP • Max {MAX_FILE_SIZE_MB}MB each</p>
                            </div>
                        )}
                        <input ref={fileInputRef} type="file" accept="image/*" multiple className="hidden"
                            onChange={e => handleFileSelect(e.target.files)} />

                        {/* Previews */}
                        {(existingImages.length > 0 || imagePreviews.length > 0) && (
                            <div className="grid grid-cols-4 gap-2 mt-3">
                                <AnimatePresence>
                                    {/* Existing Images */}
                                    {existingImages.map((img, idx) => (
                                        <motion.div key={`existing-${img.id}`}
                                            initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }}
                                            className="relative aspect-square rounded-lg overflow-hidden border border-slate-700 group/img">
                                            <Image src={img.image} alt={`existing-${idx}`} fill className="object-cover" />
                                            {idx === 0 && (
                                                <div className="absolute bottom-0 left-0 right-0 bg-blue-600/80 text-[8px] text-white text-center py-0.5 font-bold">MAIN</div>
                                            )}
                                            <button type="button" onClick={() => removeExistingImage(img.id)}
                                                className="absolute top-1 right-1 bg-black/70 text-white p-0.5 rounded-full opacity-0 group-hover/img:opacity-100 transition-opacity hover:bg-red-600">
                                                <X className="w-2.5 h-2.5" />
                                            </button>
                                        </motion.div>
                                    ))}

                                    {/* New Images */}
                                    {imagePreviews.map((src, idx) => (
                                        <motion.div key={`new-${idx}`}
                                            initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }}
                                            className="relative aspect-square rounded-lg overflow-hidden border border-blue-500/50 group/img">
                                            <Image src={src} alt={`new-${idx}`} fill className="object-cover" />
                                            {existingImages.length === 0 && idx === 0 && (
                                                <div className="absolute bottom-0 left-0 right-0 bg-blue-600/80 text-[8px] text-white text-center py-0.5 font-bold">MAIN</div>
                                            )}
                                            <div className="absolute top-1 left-1 bg-blue-600/80 text-[8px] text-white px-1 py-0.5 rounded font-bold">NEW</div>
                                            <button type="button" onClick={() => removeNewImage(idx)}
                                                className="absolute top-1 right-1 bg-black/70 text-white p-0.5 rounded-full opacity-0 group-hover/img:opacity-100 transition-opacity hover:bg-red-600">
                                                <X className="w-2.5 h-2.5" />
                                            </button>
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                            </div>
                        )}
                    </div>

                    <SheetFooter className="pt-2">
                        <Button type="submit" disabled={isSubmitting}
                            className="w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white rounded-xl text-base font-bold shadow-lg shadow-blue-500/20 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed">
                            {isSubmitting ? (
                                <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Saving...</>
                            ) : (
                                "Save Changes"
                            )}
                        </Button>
                    </SheetFooter>
                </form>
            </SheetContent>
        </Sheet>
    )
}
