const getBaseUrl = () => {
    return `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api`;
};

const API_URL = getBaseUrl();

// ── Types ────────────────────────────────────────────────────────────────────

export interface NoteAuthor {
    id: number;
    username: string;
    first_name: string;
    last_name: string;
    profile_picture?: string;
    college?: string;
    is_verified?: boolean;
}

export interface StudyNote {
    id: number;
    title: string;
    content: string;
    pdf_url: string;
    pdf_name: string;
    pdf_size: number;
    author: NoteAuthor;
    subject: string;
    branch: string;
    semester: number;
    college: string;
    likes_count: number;
    comments_count: number;
    saves_count: number;
    views: number;
    is_liked: boolean;
    is_saved: boolean;
    visibility: 'global' | 'university';
    created_at: string;
    updated_at: string;
}

export interface NoteComment {
    id: number;
    author: NoteAuthor;
    note: number;
    parent: number | null;
    content: string;
    created_at: string;
    updated_at: string;
    replies_count: number;
    is_author: boolean;
}

export interface PaginatedResponse<T> {
    count: number;
    next: string | null;
    previous: string | null;
    results: T[];
}

// ── Auth helper ──────────────────────────────────────────────────────────────

async function fetchWithAuth(url: string, options: RequestInit = {}) {
    const token = typeof window !== 'undefined' ? localStorage.getItem('sociaverse_token') : null;
    const headers: Record<string, string> = {
        ...(options.headers as Record<string, string> || {}),
        ...(token ? { Authorization: `Token ${token}` } : {}),
    };

    // Don't set Content-Type for FormData — browser sets it with boundary
    if (!(options.body instanceof FormData)) {
        headers['Content-Type'] = 'application/json';
    }

    const response = await fetch(`${API_URL}${url}`, { ...options, headers });
    return response;
}

// ── API ──────────────────────────────────────────────────────────────────────

export interface GetNotesParams {
    search?: string;
    branch?: string;
    semester?: string;
    subject?: string;
    sort?: 'newest' | 'trending' | 'most_liked' | 'most_saved';
    pdf_only?: boolean;
    username?: string;
    visibility?: 'global' | 'university';
    page?: number;
}

export const studyhubApi = {
    getNotes: async (params: GetNotesParams = {}): Promise<PaginatedResponse<StudyNote>> => {
        const searchParams = new URLSearchParams();
        if (params.search) searchParams.set('search', params.search);
        if (params.branch) searchParams.set('branch', params.branch);
        if (params.semester) searchParams.set('semester', params.semester);
        if (params.subject) searchParams.set('subject', params.subject);
        if (params.sort) searchParams.set('sort', params.sort);
        if (params.pdf_only) searchParams.set('pdf_only', 'true');
        if (params.username) searchParams.set('username', params.username);
        if (params.visibility) searchParams.set('visibility', params.visibility);
        if (params.page) searchParams.set('page', String(params.page));

        const qs = searchParams.toString();
        const response = await fetchWithAuth(`/studyhub/notes/${qs ? `?${qs}` : ''}`);
        if (!response.ok) throw new Error('Failed to fetch notes');
        return response.json();
    },

    getNote: async (id: number): Promise<StudyNote> => {
        const response = await fetchWithAuth(`/studyhub/notes/${id}/`);
        if (!response.ok) throw new Error('Failed to fetch note');
        return response.json();
    },

    createNote: async (data: FormData): Promise<StudyNote> => {
        const response = await fetchWithAuth('/studyhub/notes/', {
            method: 'POST',
            body: data,
        });
        if (!response.ok) {
            const err = await response.json().catch(() => ({}));
            throw new Error(err.detail || 'Failed to create note');
        }
        return response.json();
    },

    updateNote: async (id: number, data: FormData): Promise<StudyNote> => {
        const response = await fetchWithAuth(`/studyhub/notes/${id}/`, {
            method: 'PATCH',
            body: data,
        });
        if (!response.ok) throw new Error('Failed to update note');
        return response.json();
    },

    deleteNote: async (id: number): Promise<void> => {
        const response = await fetchWithAuth(`/studyhub/notes/${id}/`, { method: 'DELETE' });
        if (!response.ok) throw new Error('Failed to delete note');
    },

    likeNote: async (id: number): Promise<{ status: 'liked' | 'unliked' }> => {
        const response = await fetchWithAuth(`/studyhub/notes/${id}/like/`, { method: 'POST' });
        if (!response.ok) throw new Error('Failed to like note');
        return response.json();
    },

    saveNote: async (id: number): Promise<{ status: 'saved' | 'unsaved' }> => {
        const response = await fetchWithAuth(`/studyhub/notes/${id}/save/`, { method: 'POST' });
        if (!response.ok) throw new Error('Failed to save note');
        return response.json();
    },

    getComments: async (noteId: number): Promise<NoteComment[]> => {
        const response = await fetchWithAuth(`/studyhub/notes/${noteId}/comments/`);
        if (!response.ok) throw new Error('Failed to fetch comments');
        return response.json();
    },

    addComment: async (noteId: number, content: string, parentId?: number): Promise<NoteComment> => {
        const body: Record<string, unknown> = { content };
        if (parentId) body.parent_id = parentId;

        const response = await fetchWithAuth(`/studyhub/notes/${noteId}/comments/`, {
            method: 'POST',
            body: JSON.stringify(body),
        });
        if (!response.ok) throw new Error('Failed to add comment');
        return response.json();
    },

    deleteComment: async (commentId: number): Promise<void> => {
        const response = await fetchWithAuth(`/studyhub/comments/${commentId}/`, { method: 'DELETE' });
        if (!response.ok) throw new Error('Failed to delete comment');
    },

    getSavedNotes: async (page: number = 1): Promise<PaginatedResponse<StudyNote>> => {
        const response = await fetchWithAuth(`/studyhub/saved/?page=${page}`);
        if (!response.ok) throw new Error('Failed to fetch saved notes');
        return response.json();
    },
};
