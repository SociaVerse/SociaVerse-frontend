"use client"

import React, {
    createContext,
    useContext,
    useState,
    useEffect,
    useCallback,
    ReactNode,
} from "react"
import { marketplaceApi, Listing, ListingFilters, CreateListingPayload, Cart } from "@/services/marketplace"

// Re-export Listing as Product for backwards compat
export type Product = Listing
export type { Listing, ListingFilters, CreateListingPayload, Cart }

interface MarketplaceContextType {
    listings: Listing[]
    isLoading: boolean
    error: string | null
    filters: ListingFilters
    setFilters: (f: ListingFilters) => void
    refetch: () => Promise<void>
    createListing: (payload: CreateListingPayload) => Promise<Listing>
    deleteListing: (id: number | string) => Promise<void>
    markSold: (id: number | string) => Promise<void>
    toggleSave: (id: number | string) => Promise<{ status: string }>

    cart: Cart | null
    addToCart: (listing_id: number | string) => Promise<void>
    removeFromCart: (listing_id: number | string) => Promise<void>
    updateCartItemQuantity: (itemId: number, quantity: number) => Promise<void>
    checkout: (payload: any) => Promise<any>
}

const MarketplaceContext = createContext<MarketplaceContextType | undefined>(undefined)

export function MarketplaceProvider({ children }: { children: ReactNode }) {
    const [listings, setListings] = useState<Listing[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [filters, setFilters] = useState<ListingFilters>({})
    const [cart, setCart] = useState<Cart | null>(null)

    const fetchListings = useCallback(async () => {
        setIsLoading(true)
        setError(null)
        try {
            const [data, cartData] = await Promise.all([
                marketplaceApi.getListings(filters),
                marketplaceApi.getCart().catch(() => null) // Ignore error if not logged in
            ])
            setListings(data)
            if (cartData) setCart(cartData)
        } catch (err) {
            setError("Failed to load listings. Is the server running?")
            console.error(err)
        } finally {
            setIsLoading(false)
        }
    }, [filters])

    useEffect(() => {
        fetchListings()
    }, [fetchListings])

    const createListing = useCallback(async (payload: CreateListingPayload): Promise<Listing> => {
        const newListing = await marketplaceApi.createListing(payload)
        setListings(prev => [newListing, ...prev])
        return newListing
    }, [])

    const deleteListing = useCallback(async (id: number | string): Promise<void> => {
        await marketplaceApi.deleteListing(id)
        setListings(prev => prev.filter(l => String(l.id) !== String(id)))
    }, [])

    const markSold = useCallback(async (id: number | string): Promise<void> => {
        await marketplaceApi.markSold(id)
        setListings(prev =>
            prev.map(l => (String(l.id) === String(id) ? { ...l, status: "sold" } : l))
        )
    }, [])

    const toggleSave = useCallback(async (id: number | string): Promise<{ status: string }> => {
        const result = await marketplaceApi.toggleSave(id)
        setListings(prev =>
            prev.map(l =>
                String(l.id) === String(id)
                    ? {
                        ...l,
                        is_saved: result.status === "saved",
                        saves_count: result.status === "saved" ? l.saves_count + 1 : l.saves_count - 1,
                    }
                    : l
            )
        )
        return result
    }, [])

    const addToCart = useCallback(async (listing_id: number | string) => {
        const updatedCart = await marketplaceApi.addToCart(listing_id)
        setCart(updatedCart)
    }, [])

    const removeFromCart = useCallback(async (listing_id: number | string) => {
        const updatedCart = await marketplaceApi.removeFromCart(listing_id)
        setCart(updatedCart)
    }, [])

    const checkout = useCallback(async (payload: any) => {
        const order = await marketplaceApi.checkout(payload)
        setCart(null) // clear cart locally
        return order
    }, [])

    const updateCartItemQuantity = useCallback(async (itemId: number, quantity: number) => {
        const updatedCart = await marketplaceApi.updateCartItemQuantity(itemId, quantity)
        setCart(updatedCart)
    }, [])

    return (
        <MarketplaceContext.Provider
            value={{
                listings,
                isLoading,
                error,
                filters,
                setFilters,
                refetch: fetchListings,
                createListing,
                deleteListing,
                markSold,
                toggleSave,
                cart,
                addToCart,
                removeFromCart,
                updateCartItemQuantity,
                checkout,
            }}
        >
            {children}
        </MarketplaceContext.Provider>
    )
}

export function useMarketplace() {
    const ctx = useContext(MarketplaceContext)
    if (!ctx) throw new Error("useMarketplace must be used within MarketplaceProvider")
    return ctx
}
