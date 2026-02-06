"use client"

import { MarketplaceProvider } from "@/context/marketplace-context"
import { ToastProvider } from "@/components/ui/custom-toast"

export default function MarketplaceLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <MarketplaceProvider>
            <ToastProvider>
                {children}
            </ToastProvider>
        </MarketplaceProvider>
    )
}
