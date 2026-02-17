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
    getPosts: async (): Promise<Post[]> => {
        const response = await fetchWithAuth('/posts/');
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

    createPost: async (content: string, images: File[]): Promise<Post> => {
        const formData = new FormData();
        formData.append('content', content);
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
    }
};
