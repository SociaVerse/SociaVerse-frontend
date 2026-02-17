import { useEffect, useRef, useState, useCallback } from 'react'

interface Message {
    message: string
    sender_id: number
    reply_to?: string
    audio_url?: string
    duration?: number
    waveform?: number[]
}

export function useChatWebSocket(conversationId: number | null) {
    const [messages, setMessages] = useState<Message[]>([])
    const [status, setStatus] = useState<"connecting" | "connected" | "disconnected">("disconnected")
    const ws = useRef<WebSocket | null>(null)

    const [revealData, setRevealData] = useState<any>(null)

    useEffect(() => {
        if (!conversationId) return

        const token = localStorage.getItem("sociaverse_token")


        // Derive WS URL from API URL
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
        const wsProtocol = apiUrl.startsWith('https') ? 'wss' : 'ws';
        const wsHost = apiUrl.replace(/^https?:\/\//, '');

        const wsUrl = `${wsProtocol}://${wsHost}/ws/chat/${conversationId}/?token=${token}`;

        const socket = new WebSocket(wsUrl);

        setStatus("connecting")

        socket.onopen = () => {
            console.log("WebSocket Connected")
            setStatus("connected")
        }

        socket.onmessage = (event) => {
            const data = JSON.parse(event.data)

            if (data.type === 'profile_revealed') {
                setRevealData(data.participants)
            } else {
                // data structure from consumer: { message: string, sender_id: number }
                setMessages(prev => [...prev, data])
            }
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

    return { messages, sendMessage, status, setMessages, revealData }
}
