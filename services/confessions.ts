const getBaseUrl = () => {
    return `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api`;
};

const API_URL = getBaseUrl();

// ── Types ────────────────────────────────────────────────────────────────────

export interface Confession {
    id: number;
    content: string;
    college: string;
    created_at: string;
    upvotes_count: number;
    is_upvoted: boolean;
    reactions_summary: Record<string, number>;
}

export interface PaginatedConfessions {
    count: number;
    next: string | null;
    previous: string | null;
    results: Confession[];
}

// ── Auth helper ──────────────────────────────────────────────────────────────

async function fetchWithAuth(url: string, options: RequestInit = {}) {
    const token = typeof window !== 'undefined' ? localStorage.getItem('sociaverse_token') : null;
    const headers: Record<string, string> = {
        ...(options.headers as Record<string, string> || {}),
        ...(token ? { Authorization: `Token ${token}` } : {}),
    };

    if (!(options.body instanceof FormData)) {
        headers['Content-Type'] = 'application/json';
    }

    const response = await fetch(`${API_URL}${url}`, { ...options, headers });
    return response;
}

// ── API ──────────────────────────────────────────────────────────────────────

export const confessionsApi = {
    getConfessions: async (page: number = 1): Promise<PaginatedConfessions> => {
        const response = await fetchWithAuth(`/confessions/?page=${page}`);
        if (!response.ok) throw new Error('Failed to fetch confessions');
        return response.json();
    },

    getConfessionsByUrl: async (url: string): Promise<PaginatedConfessions> => {
        const token = typeof window !== 'undefined' ? localStorage.getItem('sociaverse_token') : null;
        const headers: Record<string, string> = {
            ...(token ? { Authorization: `Token ${token}` } : {}),
            'Content-Type': 'application/json',
        };
        const response = await fetch(url, { headers });
        if (!response.ok) throw new Error('Failed to fetch confessions');
        return response.json();
    },

    createConfession: async (content: string): Promise<Confession> => {
        const response = await fetchWithAuth('/confessions/', {
            method: 'POST',
            body: JSON.stringify({ content }),
        });
        if (!response.ok) {
            const err = await response.json().catch(() => ({}));
            throw new Error(err.detail || 'Failed to create confession');
        }
        return response.json();
    },

    upvoteConfession: async (id: number): Promise<{ status: 'upvoted' | 'removed' }> => {
        const response = await fetchWithAuth(`/confessions/${id}/upvote/`, {
            method: 'POST',
        });
        if (!response.ok) throw new Error('Failed to upvote confession');
        return response.json();
    },

    reactToConfession: async (id: number, reaction: string): Promise<{ status: string }> => {
        const response = await fetchWithAuth(`/confessions/${id}/react/`, {
            method: 'POST',
            body: JSON.stringify({ emoji: reaction }),
        });
        if (!response.ok) throw new Error('Failed to react to confession');
        return response.json();
    },
};
