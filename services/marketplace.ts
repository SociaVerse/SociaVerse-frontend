const getApiUrl = () =>
    `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api`;

function getAuthHeaders(isMultipart = false): HeadersInit {
    const token = typeof window !== 'undefined' ? localStorage.getItem('sociaverse_token') : null;
    const headers: HeadersInit = {};
    if (token) headers['Authorization'] = `Token ${token}`;
    if (!isMultipart) headers['Content-Type'] = 'application/json';
    return headers;
}

// ── Types ──────────────────────────────────────────────────────────────────────

export interface ListingImage {
    id: number;
    image: string;
    order: number;
}

export interface Seller {
    id: number;
    username: string;
    full_name: string;
    profile_picture: string | null;
    is_verified: boolean;
    college: string;
    average_rating?: number;
}

export interface Listing {
    id: number;
    seller: Seller;
    title: string;
    description: string;
    price: string;
    currency: string;
    category: string;
    condition: string;
    status: string;
    is_negotiable: boolean;
    quantity: number;
    location: string;
    upi_id: string;
    views_count: number;
    saves_count: number;
    is_saved: boolean;
    is_owner: boolean;
    images: ListingImage[];
    created_at: string;
    updated_at: string;
}

export interface ListingFilters {
    search?: string;
    category?: string;
    condition?: string;
    status?: string;
    currency?: string;
    min_price?: string;
    max_price?: string;
    seller?: string;
    ordering?: string;
}

export interface CartItem {
    id: number;
    listing: Listing;
    quantity: number;
    added_at: string;
}

export interface Cart {
    id: number;
    items: CartItem[];
    total_price: number;
}

export interface SellerReview {
    id: number;
    reviewer_username: string;
    reviewer_avatar: string;
    rating: number;
    comment: string;
    created_at: string;
}

export interface OrderItem {
    id: number;
    listing: Listing;
    price_at_purchase: string;
    quantity: number;
}

export interface SellerOrder {
    id: number;
    total_amount: string;
    currency: string;
    status: string;
    delivery_name: string;
    delivery_phone: string;
    delivery_address: string;
    upi_transaction_id: string;
    created_at: string;
    items: OrderItem[];
}

export interface CreateListingPayload {
    title: string;
    description: string;
    price: string;
    currency: string;
    category: string;
    condition: string;
    is_negotiable: boolean;
    quantity: number;
    location?: string;
    upi_id?: string;
    images: File[];
}

export interface UpdateListingPayload {
    title?: string;
    description?: string;
    price?: string;
    currency?: string;
    category?: string;
    condition?: string;
    is_negotiable?: boolean;
    location?: string;
    upi_id?: string;
    new_images?: File[];
    deleted_image_ids?: number[];
}

// ── API Functions ──────────────────────────────────────────────────────────────

export const marketplaceApi = {
    /** Fetch all listings with optional filters */
    getListings: async (filters: ListingFilters = {}): Promise<Listing[]> => {
        const params = new URLSearchParams();
        Object.entries(filters).forEach(([k, v]) => { if (v) params.set(k, v); });
        const res = await fetch(`${getApiUrl()}/marketplace/listings/?${params.toString()}`, {
            headers: getAuthHeaders(),
        });
        if (!res.ok) throw new Error('Failed to fetch listings');
        return res.json();
    },

    /** Fetch a single listing by ID */
    getListing: async (id: number | string): Promise<Listing> => {
        const res = await fetch(`${getApiUrl()}/marketplace/listings/${id}/`, {
            headers: getAuthHeaders(),
        });
        if (!res.ok) throw new Error('Listing not found');
        return res.json();
    },

    /** Create a new listing with images */
    createListing: async (payload: CreateListingPayload): Promise<Listing> => {
        const formData = new FormData();
        formData.append('title', payload.title);
        formData.append('description', payload.description);
        formData.append('price', payload.price);
        formData.append('currency', payload.currency);
        formData.append('category', payload.category);
        formData.append('condition', payload.condition);
        formData.append('is_negotiable', String(payload.is_negotiable));
        if (payload.location) formData.append('location', payload.location);
        if (payload.upi_id) formData.append('upi_id', payload.upi_id);
        payload.images.forEach(img => formData.append('uploaded_images', img));

        const res = await fetch(`${getApiUrl()}/marketplace/listings/`, {
            method: 'POST',
            headers: getAuthHeaders(true),
            body: formData,
        });
        if (!res.ok) {
            const err = await res.json().catch(() => ({}));
            throw new Error(JSON.stringify(err) || 'Failed to create listing');
        }
        return res.json();
    },

    /** Edit an existing listing */
    updateListing: async (id: number | string, payload: UpdateListingPayload): Promise<Listing> => {
        const formData = new FormData();
        if (payload.title) formData.append('title', payload.title);
        if (payload.description) formData.append('description', payload.description);
        if (payload.price) formData.append('price', payload.price);
        if (payload.currency) formData.append('currency', payload.currency);
        if (payload.category) formData.append('category', payload.category);
        if (payload.condition) formData.append('condition', payload.condition);
        if (payload.location !== undefined) formData.append('location', payload.location || '');
        if (payload.upi_id !== undefined) formData.append('upi_id', payload.upi_id || '');
        if (payload.is_negotiable !== undefined) formData.append('is_negotiable', String(payload.is_negotiable));

        payload.new_images?.forEach(img => formData.append('uploaded_images', img));
        payload.deleted_image_ids?.forEach(id => formData.append('deleted_image_ids', id.toString()));

        const res = await fetch(`${getApiUrl()}/marketplace/listings/${id}/`, {
            method: 'PATCH',
            headers: getAuthHeaders(true),
            body: formData,
        });
        if (!res.ok) throw new Error('Failed to update listing');
        return res.json();
    },

    /** Delete a listing */
    deleteListing: async (id: number | string): Promise<void> => {
        const res = await fetch(`${getApiUrl()}/marketplace/listings/${id}/`, {
            method: 'DELETE',
            headers: getAuthHeaders(),
        });
        if (!res.ok) throw new Error('Failed to delete listing');
    },

    /** Mark a listing as sold */
    markSold: async (id: number | string): Promise<{ status: string; listing_id: number }> => {
        const res = await fetch(`${getApiUrl()}/marketplace/listings/${id}/mark-sold/`, {
            method: 'POST',
            headers: getAuthHeaders(),
        });
        if (!res.ok) throw new Error('Failed to mark as sold');
        return res.json();
    },

    /** Toggle save/unsave a listing */
    toggleSave: async (id: number | string): Promise<{ status: 'saved' | 'unsaved' }> => {
        const res = await fetch(`${getApiUrl()}/marketplace/listings/${id}/save/`, {
            method: 'POST',
            headers: getAuthHeaders(),
        });
        if (!res.ok) throw new Error('Failed to toggle save');
        return res.json();
    },

    /** Get listings saved by the current user */
    getSavedListings: async (): Promise<Listing[]> => {
        const res = await fetch(`${getApiUrl()}/marketplace/listings/saved/`, {
            headers: getAuthHeaders(),
        });
        if (!res.ok) throw new Error('Failed to fetch saved listings');
        return res.json();
    },

    /** Get listings created by the current user */
    getMyListings: async (): Promise<Listing[]> => {
        const res = await fetch(`${getApiUrl()}/marketplace/listings/mine/`, {
            headers: getAuthHeaders(),
        });
        if (!res.ok) throw new Error('Failed to fetch my listings');
        return res.json();
    },

    /** Report a listing */
    reportListing: async (id: number | string, reason: string, details?: string): Promise<void> => {
        const res = await fetch(`${getApiUrl()}/marketplace/listings/${id}/report/`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify({ reason, details: details || '' }),
        });
        if (!res.ok) {
            const err = await res.json().catch(() => ({}));
            throw new Error(err.error || 'Failed to report listing');
        }
    },

    /** Bump a listing (Premium only) */
    bumpListing: async (id: number | string): Promise<{ message: string; listing_id: number }> => {
        const res = await fetch(`${getApiUrl()}/marketplace/listings/${id}/bump/`, {
            method: 'POST',
            headers: getAuthHeaders(),
        });
        if (!res.ok) {
            const err = await res.json().catch(() => ({}));
            throw new Error(err.error || 'Failed to bump listing, you may need Premium.');
        }
        return res.json();
    },

    /** Contact Seller and Initialize Chat */
    contactSeller: async (id: number | string): Promise<{ status: string; conversation: any }> => {
        const res = await fetch(`${getApiUrl()}/marketplace/listings/${id}/contact/`, {
            method: 'POST',
            headers: getAuthHeaders(),
        });
        if (!res.ok) {
            const err = await res.json().catch(() => ({}));
            throw new Error(err.error || 'Failed to initiate chat with seller.');
        }
        return res.json();
    },

    /** Get cart */
    getCart: async (): Promise<Cart> => {
        const res = await fetch(`${getApiUrl()}/marketplace/cart/`, {
            headers: getAuthHeaders(),
        });
        if (!res.ok) throw new Error('Failed to fetch cart');
        return res.json();
    },

    /** Add to cart */
    addToCart: async (listing_id: number | string): Promise<Cart> => {
        const res = await fetch(`${getApiUrl()}/marketplace/cart/`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify({ listing_id }),
        });
        if (!res.ok) {
            const err = await res.json().catch(() => ({}));
            throw new Error(err.error || 'Failed to add to cart');
        }
        return res.json();
    },

    /** Remove from cart */
    removeFromCart: async (listing_id: number | string): Promise<Cart> => {
        const res = await fetch(`${getApiUrl()}/marketplace/cart/`, {
            method: 'DELETE',
            headers: getAuthHeaders(),
            body: JSON.stringify({ listing_id }),
        });
        if (!res.ok) throw new Error('Failed to remove from cart');
        return res.json();
    },

    updateCartItemQuantity: async (itemId: number, quantity: number): Promise<Cart> => {
        const res = await fetch(`${getApiUrl()}/marketplace/cart/items/${itemId}/`, {
            method: 'PATCH',
            headers: getAuthHeaders(),
            body: JSON.stringify({ quantity }),
        });
        if (!res.ok) throw new Error('Failed to update quantity');
        return res.json();
    },

    /** Checkout */
    checkout: async (payload: { delivery_name: string; delivery_phone: string; delivery_address: string; seller_username: string; upi_transaction_id: string }): Promise<any> => {
        const res = await fetch(`${getApiUrl()}/marketplace/checkout/`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify(payload),
        });
        if (!res.ok) {
            const err = await res.json().catch(() => ({}));
            throw new Error(err.error || 'Checkout failed');
        }
        return res.json();
    },

    /** Verify Razorpay Payment */
    verifyPayment: async (payload: { razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature: string }): Promise<any> => {
        const res = await fetch(`${getApiUrl()}/marketplace/razorpay/verify-payment/`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify(payload),
        });
        if (!res.ok) {
            const err = await res.json().catch(() => ({}));
            throw new Error(err.error || 'Payment verification failed');
        }
        return res.json();
    },

    /** Get Seller Reviews */
    getSellerReviews: async (username: string): Promise<SellerReview[]> => {
        const res = await fetch(`${getApiUrl()}/marketplace/sellers/${username}/reviews/`, {
            headers: getAuthHeaders(),
        });
        if (!res.ok) throw new Error('Failed to fetch reviews');
        return res.json();
    },

    /** Post Seller Review */
    createSellerReview: async (username: string, payload: { rating: number; comment: string }): Promise<SellerReview> => {
        const res = await fetch(`${getApiUrl()}/marketplace/sellers/${username}/reviews/`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify(payload),
        });
        if (!res.ok) {
            const err = await res.json().catch(() => ({}));
            throw new Error(err.error || err[0] || 'Failed to submit review. You might have already reviewed them or cannot review yourself.');
        }
        return res.json();
    },

    getSellerOrders: async (): Promise<SellerOrder[]> => {
        const res = await fetch(`${getApiUrl()}/marketplace/dashboard/orders/`, {
            headers: getAuthHeaders(),
        });
        if (!res.ok) throw new Error('Failed to fetch orders');
        return res.json();
    },

    /** Onboard Seller */
    onboardSeller: async (payload: FormData): Promise<any> => {
        const token = typeof window !== 'undefined' ? localStorage.getItem('sociaverse_token') : null;
        const headers: HeadersInit = {};
        if (token) headers['Authorization'] = `Token ${token}`;

        // Use the core users profile endpoint which accepts multipart/form-data
        const res = await fetch(`${getApiUrl()}/users/me/`, {
            method: 'PATCH',
            headers: headers,
            body: payload,
        });
        if (!res.ok) {
            const err = await res.json().catch(() => ({}));
            throw new Error(err.error || 'Onboarding failed');
        }
        return res.json();
    },
};
