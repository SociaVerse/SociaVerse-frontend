import { useEffect, useRef, useState, useCallback } from 'react'

interface Message {
    message: string
    sender_id: number
    reply_to?: string
}

export function useChatWebSocket(conversationId: number | null) {
    const [messages, setMessages] = useState<Message[]>([])
    const [status, setStatus] = useState<"connecting" | "connected" | "disconnected">("disconnected")
    const ws = useRef<WebSocket | null>(null)

    useEffect(() => {
        if (!conversationId) return

        const token = localStorage.getItem("sociaverse_token")
        // Note: Browsers don't support headers in WebSocket constructor.
        // We'll rely on session cookies OR pass token in query param if needed.
        // For now, let's assume the backend handles AuthMiddlewareStack which uses Session.
        // If Token auth is strictly needed, we might need to pass ?token=... and handle it in consumers.py middleware.
        // Let's try standard connection first.

        // Update: Connect to the specific conversation room with Token
        const socket = new WebSocket(`ws://127.0.0.1:8000/ws/chat/${conversationId}/?token=${token}`)

        setStatus("connecting")

        socket.onopen = () => {
            console.log("WebSocket Connected")
            setStatus("connected")
        }

        socket.onmessage = (event) => {
            const data = JSON.parse(event.data)
            // data structure from consumer: { message: string, sender_id: number }
            setMessages(prev => [...prev, data])
        }

        socket.onclose = () => {
            console.log("WebSocket Disconnected")
            setStatus("disconnected")
        }

        ws.current = socket

        return () => {
            socket.close()
        }
    }, [conversationId])

    const sendMessage = useCallback((text: string, replyToId?: string) => {
        if (ws.current && ws.current.readyState === WebSocket.OPEN) {
            ws.current.send(JSON.stringify({ message: text, reply_to: replyToId }))
        } else {
            console.warn("WebSocket not ready. Queueing or ignoring message.")
            // Ideally queue messages here, but for now just warn
        }
    }, [])

    return { messages, sendMessage, status, setMessages }
}
