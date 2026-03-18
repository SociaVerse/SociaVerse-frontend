const getBaseUrl = () => {
    return `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api`;
};

const API_URL = getBaseUrl();

export interface User {
    id: number;
    username: string;
    first_name: string;
    last_name: string;
    profile_picture?: string;
    is_verified?: boolean;
    default_upi_id?: string | null;
    college: string;
}

export interface Comment {
    id: number;
    author: User;
    content: string;
    created_at: string;
    replies: Comment[];
    is_author: boolean;
    parent: number | null;
}

export interface Post {
    id: number;
    author: User;
    content: string;
    images: { id: number, image: string }[];
    created_at: string;
    likes_count: number;
    comments_count: number;
    is_liked: boolean;
    visibility?: 'university' | 'global';
    university_id?: number | null;
}

async function fetchWithAuth(url: string, options: RequestInit = {}) {
    const token = localStorage.getItem('sociaverse_token');
    const headers = {
        'Content-Type': 'application/json',
        ...options.headers,
        ...(token ? { 'Authorization': `Token ${token}` } : {}),
    };

    const response = await fetch(`${API_URL}${url}`, {
        ...options,
        headers,
    });

    if (response.status === 401) {
        console.warn('Unauthorized request');
    }

    return response;
}

export const api = {
    getPosts: async (params: { visibility?: string, username?: string } = {}): Promise<any> => {
        const searchParams = new URLSearchParams();
        if (params.visibility) searchParams.append('visibility', params.visibility);
        if (params.username) searchParams.append('username', params.username);
        
        const queryString = searchParams.toString();
        const url = `/posts/${queryString ? `?${queryString}` : ''}`;
        
        const response = await fetchWithAuth(url);
        if (!response.ok) throw new Error('Failed to fetch posts');
        return response.json();
    },

    likePost: async (postId: number): Promise<{ status: 'liked' | 'unliked' }> => {
        const response = await fetchWithAuth(`/posts/${postId}/like/`, {
            method: 'POST',
        });
        if (!response.ok) throw new Error('Failed to like post');
        return response.json();
    },

    sharePost: async (postId: number): Promise<{ status: 'shared' }> => {
        const response = await fetchWithAuth(`/posts/${postId}/share/`, {
            method: 'POST',
        });
        if (!response.ok) throw new Error('Failed to share post');
        return response.json();
    },

    getComments: async (postId: number): Promise<Comment[]> => {
        const response = await fetchWithAuth(`/posts/${postId}/comments/`);
        if (!response.ok) throw new Error('Failed to fetch comments');
        return response.json();
    },

    addComment: async (postId: number, content: string): Promise<Comment> => {
        const response = await fetchWithAuth(`/posts/${postId}/comments/`, {
            method: 'POST',
            body: JSON.stringify({ content }),
        });
        if (!response.ok) throw new Error('Failed to add comment');
        return response.json();
    },

    updateComment: async (commentId: number, content: string): Promise<Comment> => {
        const response = await fetchWithAuth(`/posts/comments/${commentId}/`, {
            method: 'PATCH',
            body: JSON.stringify({ content }),
        });
        if (!response.ok) throw new Error('Failed to update comment');
        return response.json();
    },

    deleteComment: async (commentId: number): Promise<void> => {
        const response = await fetchWithAuth(`/posts/comments/${commentId}/`, {
            method: 'DELETE',
        });
        if (!response.ok) throw new Error('Failed to delete comment');
    },

    replyToComment: async (postId: number, parentId: number, content: string): Promise<Comment> => {
        const response = await fetchWithAuth(`/posts/${postId}/comments/`, {
            method: 'POST',
            body: JSON.stringify({ content, parent_id: parentId }),
        });
        if (!response.ok) throw new Error('Failed to reply to comment');
        return response.json();
    },

    createPost: async (content: string, images: File[], visibility: 'university' | 'global' = 'university'): Promise<Post> => {
        const formData = new FormData();
        formData.append('content', content);
        formData.append('visibility', visibility);
        images.forEach((image) => {
            formData.append('uploaded_images', image);
        });

        // We cannot use the default headers with Content-Type: application/json for FormData
        // fetch will automatically set the correct Content-Type with boundary for FormData
        const token = localStorage.getItem('sociaverse_token');
        const headers: HeadersInit = {};
        if (token) {
            headers['Authorization'] = `Token ${token}`;
        }

        const response = await fetch(`${API_URL}/posts/`, {
            method: 'POST',
            headers: headers,
            body: formData,
        });

        if (!response.ok) throw new Error('Failed to create post');
        return response.json();
    },

    savePost: async (postId: number): Promise<{ status: 'saved' | 'unsaved' }> => {
        const response = await fetchWithAuth(`/posts/${postId}/save/`, {
            method: 'POST',
        });
        if (!response.ok) throw new Error('Failed to save post');
        return response.json();
    },

    getUsers: async (): Promise<User[]> => {
        const response = await fetchWithAuth('/users/');
        if (!response.ok) throw new Error('Failed to fetch users');
        return response.json();
    },

    updateProfile: async (data: Partial<User>): Promise<User> => {
        const response = await fetchWithAuth('/users/profile/', {
            method: 'PATCH',
            body: JSON.stringify(data),
        });
        if (!response.ok) {
            const err = await response.json().catch(() => ({}));
            throw new Error(err.error || 'Failed to update profile');
        }
        return response.json();
    }
};
