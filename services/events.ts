const getBaseUrl = () => {
    return `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api`;
};

const API_URL = getBaseUrl();

export interface Event {
    id: number;
    organizer_name: string;
    title: string;
    description: string;
    category: string;
    image: string | null;
    start_date: string;
    end_date: string;
    location: string;
    mode: string;
    participation_type: string;
    min_team_size: number;
    max_team_size: number;
    community: string;
    rules: string | null;
    prize: string | null;
    is_promoted: boolean;
    visibility: 'global' | 'university';
    attendees_count?: number;
}

export interface PaginatedResponse<T> {
    count: number;
    next: string | null;
    previous: string | null;
    results: T[];
}

async function fetchWithAuth(url: string, options: RequestInit = {}) {
    const token = typeof window !== 'undefined' ? localStorage.getItem('sociaverse_token') : null;
    const headers = {
        'Content-Type': 'application/json',
        ...options.headers,
        ...(token ? { 'Authorization': `Token ${token}` } : {}),
    };

    const response = await fetch(`${API_URL}${url}`, { ...options, headers });
    return response;
}

export const eventsApi = {
    getEvents: async (params: { visibility?: string, page?: number } = {}): Promise<PaginatedResponse<Event>> => {
        const queryParams = new URLSearchParams();
        if (params.visibility) queryParams.set('visibility', params.visibility);
        if (params.page) queryParams.set('page', params.page.toString());

        const qs = queryParams.toString();
        const response = await fetchWithAuth(`/events/${qs ? `?${qs}` : ''}`);
        if (!response.ok) throw new Error('Failed to fetch events');
        return response.json();
    }
};
