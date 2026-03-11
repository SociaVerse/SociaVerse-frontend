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
    const messageQueueRef = useRef<string[]>([])
    const reconnectTimerRef = useRef<NodeJS.Timeout | null>(null)
    const reconnectCountRef = useRef(0)

    useEffect(() => {
        setMessages([])
        setStatusUpdates([])
        messageQueueRef.current = []
        reconnectCountRef.current = 0
        if (!conversationId) return

        let cleanedUp = false

        const connectWS = () => {
            if (cleanedUp) return

            const token = localStorage.getItem("sociaverse_token")
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
            const wsProtocol = apiUrl.startsWith('https') ? 'wss' : 'ws'
            const wsHost = apiUrl.replace(/^https?:\/\//, '')
            const wsUrl = `${wsProtocol}://${wsHost}/ws/chat/${conversationId}/?token=${token}`

            const socket = new WebSocket(wsUrl)
            if (!cleanedUp) setStatus("connecting")

            socket.onopen = () => {
                if (cleanedUp) return
                reconnectCountRef.current = 0
                setStatus("connected")
                // Flush any queued messages
                const queued = [...messageQueueRef.current]
                messageQueueRef.current = []
                queued.forEach(msg => {
                    if (socket.readyState === WebSocket.OPEN) socket.send(msg)
                })
            }

            socket.onmessage = (event) => {
                if (cleanedUp) return
                const data = JSON.parse(event.data)

                if (data.type === 'profile_revealed') {
                    setRevealData(data.participants)
                } else if (data.type === 'status_update') {
                    setStatusUpdates(prev => [...prev.filter(s => s.message_id !== data.message_id || s.status !== data.status), data])
                } else if (data.type === 'presence') {
                    if (!otherUserId || data.user_id === otherUserId) {
                        setPresence({ status: data.status, last_seen: data.last_seen })
                    }
                } else if (data.type === 'typing') {
                    if (!otherUserId || data.user_id === otherUserId) {
                        setIsTyping(data.is_typing)
                        if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current)
                        if (data.is_typing) {
                            typingTimeoutRef.current = setTimeout(() => setIsTyping(false), 3000)
                        }
                    }
                } else if (data.type === 'message') {
                    setMessages(prev => [...prev, data])
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
                if (cleanedUp) return
                setStatus("disconnected")
                // Exponential backoff reconnect (max 5 attempts, capped at 30s)
                if (reconnectCountRef.current < 5) {
                    const delay = Math.min(1000 * Math.pow(2, reconnectCountRef.current), 30000)
                    reconnectCountRef.current += 1
                    reconnectTimerRef.current = setTimeout(connectWS, delay)
                }
            }

            ws.current = socket
        }

        connectWS()

        return () => {
            cleanedUp = true
            if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current)
            if (reconnectTimerRef.current) clearTimeout(reconnectTimerRef.current)
            ws.current?.close()
            ws.current = null
        }
    }, [conversationId, otherUserId])

    const sendMessage = useCallback((text: string, replyToId?: string, extraData?: { audio_url?: string, duration?: number, waveform?: number[] }) => {
        const payload = JSON.stringify({
            message: text,
            reply_to: replyToId,
            ...extraData
        })
        if (ws.current && ws.current.readyState === WebSocket.OPEN) {
            ws.current.send(payload)
        } else {
            // Queue the message — it will be flushed once the connection opens
            messageQueueRef.current.push(payload)
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
