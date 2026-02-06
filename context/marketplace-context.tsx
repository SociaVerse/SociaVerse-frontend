"use client"

import React, { createContext, useContext, useState, ReactNode } from "react"

export interface Product {
    id: string
    title: string
    price: number
    currency: string
    description: string
    images: string[]
    seller: {
        name: string
        username: string
        avatar: string
        online?: boolean
    }
}

// Initial Mock Data with multiple images structure
const MOCK_PRODUCTS: Product[] = [
    {
        id: "1",
        title: "iPad Pro 12.9 (2022)",
        price: 799,
        currency: "USD",
        description: "Like new condition, M2 chip, 256GB storage. Comes with Apple Pencil 2nd gen and Magic Keyboard case. Barely used for one semester.",
        images: [
            "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?q=80&w=2615&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1542393545-facac42e67e8?q=80&w=2603&auto=format&fit=crop"
        ],
        seller: {
            name: "Alex Rivera",
            username: "arivera",
            avatar: "A",
            online: true,
        },
    },
    {
        id: "2",
        title: "Calculus Early Transcendentals",
        price: 3500,
        currency: "INR",
        description: "8th Edition. Essential for MATH 101/102. Minimal highlighting, no missing pages. Saved me $150 compared to bookstore price!",
        images: ["https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=2574&auto=format&fit=crop"],
        seller: {
            name: "Sarah Chen",
            username: "schen_design",
            avatar: "S",
            online: false,
        },
    },
    {
        id: "3",
        title: "Sony WH-1000XM4",
        price: 180,
        currency: "USD",
        description: "Noise cancelling headphones, perfect for studying in the library. Battery life is still amazing. Ear pads recently replaced.",
        images: ["https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?q=80&w=2588&auto=format&fit=crop"],
        seller: {
            name: "Marcus Johnson",
            username: "mjohnson_dev",
            avatar: "M",
            online: true,
        },
    },
    {
        id: "4",
        title: "Dorm Mini Fridge",
        price: 4500,
        currency: "INR",
        description: "Compact fridge, fits perfectly under a lofted bed. Keeps drinks ice cold. Must pick up from North Hall before Friday.",
        images: ["https://images.unsplash.com/photo-1584568694244-14fbdf83bd30?q=80&w=2669&auto=format&fit=crop"],
        seller: {
            name: "Jessica Wu",
            username: "jesswu",
            avatar: "J",
            online: true,
        },
    },
    {
        id: "5",
        title: "Electric Scooter",
        price: 250,
        currency: "EUR",
        description: "Xiaomi Mi Scooter. Great for getting around campus quickly. Foldable design. Charger included. Some scratches but runs perfectly.",
        images: ["https://images.unsplash.com/photo-1556316384-12c35d30afa4?q=80&w=2574&auto=format&fit=crop"],
        seller: {
            name: "David Kim",
            username: "dkim_archi",
            avatar: "D",
            online: false,
        },
    },
    {
        id: "6",
        title: "Graphics Tablet",
        price: 85,
        currency: "USD",
        description: "Wacom Intuos Pro Medium. Perfect for digital art students. Pen nibs included. Selling because I upgraded to a Cintiq.",
        images: ["https://images.unsplash.com/photo-1563206767-5b1d472d9323?q=80&w=2574&auto=format&fit=crop"],
        seller: {
            name: "Design Club",
            username: "design_club",
            avatar: "D",
            online: true,
        },
    },
]

interface MarketplaceContextType {
    products: Product[]
    addProduct: (product: Product) => void
    deleteProduct: (id: string) => void
    // updateProduct could be added here
}

const MarketplaceContext = createContext<MarketplaceContextType | undefined>(undefined)

export function MarketplaceProvider({ children }: { children: ReactNode }) {
    const [products, setProducts] = useState<Product[]>(MOCK_PRODUCTS)

    const addProduct = (product: Product) => {
        setProducts(prev => [product, ...prev])
    }

    const deleteProduct = (id: string) => {
        setProducts(prev => prev.filter(p => p.id !== id))
    }

    return (
        <MarketplaceContext.Provider value={{ products, addProduct, deleteProduct }}>
            {children}
        </MarketplaceContext.Provider>
    )
}

export function useMarketplace() {
    const context = useContext(MarketplaceContext)
    if (context === undefined) {
        throw new Error("useMarketplace must be used within a MarketplaceProvider")
    }
    return context
}
