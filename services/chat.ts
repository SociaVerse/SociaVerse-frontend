const API_URL = "http://127.0.0.1:8000/api/chat"

interface User {
    id: number
    username: string
    email: string
    avatar?: string
    profile_picture?: string | null
}

export interface Conversation {
    id: number
    participants: User[]
    updated_at: string
}

export interface Message {
    id: string
    conversation_id: string
    sender_id: number
    content: string
    timestamp: string
    likes?: number[]
    starred_by?: number[]
    pinned_by?: number[]
    reply_to?: string
}

const getHeaders = () => {
    const token = typeof window !== 'undefined' ? localStorage.getItem("sociaverse_token") : null
    return {
        "Content-Type": "application/json",
        "Authorization": `Token ${token}`
    }
}

export const chatService = {
    startConversation: async (username: string): Promise<Conversation> => {
        const response = await fetch(`${API_URL}/start/`, {
            method: "POST",
            headers: getHeaders(),
            body: JSON.stringify({ username })
        })
        if (!response.ok) throw new Error("Failed to start conversation")
        return response.json()
    },

    getConversations: async (): Promise<Conversation[]> => {
        const response = await fetch(`${API_URL}/list/`, {
            headers: getHeaders()
        })
        if (!response.ok) throw new Error("Failed to fetch conversations")
        return response.json()
    },

    getMessages: async (conversationId: number): Promise<Message[]> => {
        const response = await fetch(`${API_URL}/${conversationId}/messages/`, {
            headers: getHeaders()
        })
        if (!response.ok) throw new Error("Failed to fetch messages")
        return response.json()
    },

    deleteMessage: async (messageId: string, deleteType: 'me' | 'everyone'): Promise<void> => {
        const response = await fetch(`${API_URL}/messages/${messageId}/delete/`, {
            method: 'DELETE',
            headers: getHeaders(),
            body: JSON.stringify({ delete_type: deleteType })
        })
        if (!response.ok) throw new Error("Failed to delete message")
    },

    performAction: async (messageId: string, action: 'like' | 'star' | 'pin' | 'report', data?: any): Promise<any> => {
        const response = await fetch(`${API_URL}/messages/${messageId}/${action}/`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify(data || {})
        })
        if (!response.ok) throw new Error(`Failed to ${action} message`)
        if (!response.ok) throw new Error(`Failed to ${action} message`)
        return response.json()
    },

    deleteConversation: async (conversationId: number): Promise<void> => {
        const response = await fetch(`${API_URL}/${conversationId}/delete/`, {
            method: 'DELETE',
            headers: getHeaders()
        })
        if (!response.ok) throw new Error("Failed to delete conversation")
    },

    blockUser: async (userId: number): Promise<void> => {
        const response = await fetch(`http://127.0.0.1:8000/api/users/block/${userId}/`, {
            method: 'POST',
            headers: getHeaders()
        })
        if (!response.ok) throw new Error("Failed to block user")
    },

    unblockUser: async (userId: number): Promise<void> => {
        const response = await fetch(`http://127.0.0.1:8000/api/users/block/${userId}/`, {
            method: 'DELETE',
            headers: getHeaders()
        })
        if (!response.ok) throw new Error("Failed to unblock user")
    },

    reportUser: async (userId: number, reason: string): Promise<void> => {
        const response = await fetch(`http://127.0.0.1:8000/api/users/report/${userId}/`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify({ reason })
        })
        if (!response.ok) throw new Error("Failed to report user")
    },

    muteConversation: async (conversationId: number): Promise<{ is_muted: boolean }> => {
        const response = await fetch(`${API_URL}/${conversationId}/mute/`, {
            method: 'POST',
            headers: getHeaders()
        })
        if (!response.ok) throw new Error("Failed to mute conversation")
        return response.json()
    }
}
