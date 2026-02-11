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
}

const getHeaders = () => {
    const token = localStorage.getItem("sociaverse_token")
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
    }
}
