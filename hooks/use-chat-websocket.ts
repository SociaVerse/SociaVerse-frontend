import { useEffect, useRef, useState, useCallback } from 'react'

interface Message {
    id: string
    message: string
    sender_id: number
    timestamp: string
    reply_to?: string
    audio_url?: string
    duration?: number
    waveform?: number[]
}

export interface StatusUpdate {
    message_id: string
    user_id: number
    status: 'delivered' | 'read'
}

export interface PresenceStatus {
    status: 'online' | 'offline'
    last_seen: string | null
}

export function useChatWebSocket(conversationId: number | null, otherUserId?: number) {
    const [messages, setMessages] = useState<Message[]>([])
    const [statusUpdates, setStatusUpdates] = useState<StatusUpdate[]>([])
    const [status, setStatus] = useState<"connecting" | "connected" | "disconnected">("disconnected")
    const ws = useRef<WebSocket | null>(null)
    const [revealData, setRevealData] = useState<any>(null)
    const [presence, setPresence] = useState<PresenceStatus>({ status: 'offline', last_seen: null })
    const [isTyping, setIsTyping] = useState(false)
    const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null)

    useEffect(() => {
        setMessages([])
        setStatusUpdates([])
        if (!conversationId) return

        const token = localStorage.getItem("sociaverse_token")

        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
        const wsProtocol = apiUrl.startsWith('https') ? 'wss' : 'ws'
        const wsHost = apiUrl.replace(/^https?:\/\//, '')

        const wsUrl = `${wsProtocol}://${wsHost}/ws/chat/${conversationId}/?token=${token}`

        const socket = new WebSocket(wsUrl)
        setStatus("connecting")

        socket.onopen = () => {
            console.log("WebSocket Connected")
            setStatus("connected")
        }

        socket.onmessage = (event) => {
            const data = JSON.parse(event.data)

            if (data.type === 'profile_revealed') {
                setRevealData(data.participants)
            } else if (data.type === 'status_update') {
                setStatusUpdates(prev => [...prev.filter(s => s.message_id !== data.message_id || s.status !== data.status), data])
            } else if (data.type === 'presence') {
                // Only update presence for the other user
                if (!otherUserId || data.user_id === otherUserId) {
                    setPresence({ status: data.status, last_seen: data.last_seen })
                }
            } else if (data.type === 'typing') {
                if (!otherUserId || data.user_id === otherUserId) {
                    setIsTyping(data.is_typing)
                    // Auto-clear typing after 3s in case disconnect event is missed
                    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current)
                    if (data.is_typing) {
                        typingTimeoutRef.current = setTimeout(() => setIsTyping(false), 3000)
                    }
                }
            } else if (data.type === 'message') {
                setMessages(prev => [...prev, data])

                // Auto-ack delivery if not me
                try {
                    const myUser = JSON.parse(localStorage.getItem("sociaverse_user") || "{}")
                    if (data.sender_id !== myUser.id && data.id) {
                        socket.send(JSON.stringify({ type: 'message_delivered', message_id: data.id }))
                    }
                } catch (e) {
                    console.error("Failed to parse user for delivery ack", e)
                }
            } else {
                // Backward compat: old format without type
                setMessages(prev => [...prev, data])
            }
        }

        socket.onclose = () => {
            console.log("WebSocket Disconnected")
            setStatus("disconnected")
        }

        ws.current = socket

        return () => {
            if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current)
            socket.close()
        }
    }, [conversationId, otherUserId])

    const sendMessage = useCallback((text: string, replyToId?: string, extraData?: { audio_url?: string, duration?: number, waveform?: number[] }) => {
        if (ws.current && ws.current.readyState === WebSocket.OPEN) {
            ws.current.send(JSON.stringify({
                message: text,
                reply_to: replyToId,
                ...extraData
            }))
        } else {
            console.warn("WebSocket not ready. Queueing or ignoring message.")
        }
    }, [])

    const sendTyping = useCallback((isTyping: boolean) => {
        if (ws.current && ws.current.readyState === WebSocket.OPEN) {
            ws.current.send(JSON.stringify({ type: 'typing', is_typing: isTyping }))
        }
    }, [])

    const sendDeliveryAck = useCallback((messageId: string) => {
        if (ws.current && ws.current.readyState === WebSocket.OPEN) {
            ws.current.send(JSON.stringify({ type: 'message_delivered', message_id: messageId }))
        }
    }, [])

    const sendReadAck = useCallback((messageId: string) => {
        if (ws.current && ws.current.readyState === WebSocket.OPEN) {
            ws.current.send(JSON.stringify({ type: 'message_read', message_id: messageId }))
        }
    }, [])

    return { messages, sendMessage, sendTyping, sendDeliveryAck, sendReadAck, status, setMessages, statusUpdates, setStatusUpdates, revealData, presence, isTyping }
}
