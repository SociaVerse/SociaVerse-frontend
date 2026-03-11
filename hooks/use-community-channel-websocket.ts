import { useEffect, useRef, useState, useCallback } from 'react'

export interface CommunityMessage {
    id: number
    content: string
    sender_username: string
    sender_avatar: string
    created_at: string
}

export function useCommunityChannelWebSocket(channelId: string | null) {
    const [liveMessages, setLiveMessages] = useState<CommunityMessage[]>([])
    const [status, setStatus] = useState<'connecting' | 'connected' | 'disconnected'>('disconnected')
    const ws = useRef<WebSocket | null>(null)

    useEffect(() => {
        if (!channelId) return

        const token = localStorage.getItem('sociaverse_token')
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
        const wsProtocol = apiUrl.startsWith('https') ? 'wss' : 'ws'
        const wsHost = apiUrl.replace(/^https?:\/\//, '')
        const wsUrl = `${wsProtocol}://${wsHost}/ws/community/channel/${channelId}/?token=${token}`

        const socket = new WebSocket(wsUrl)
        setStatus('connecting')
        setLiveMessages([]) // reset on channel change

        socket.onopen = () => setStatus('connected')

        socket.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data)
                if (data.type === 'message') {
                    setLiveMessages(prev => [...prev, {
                        id: data.id,
                        content: data.content,
                        sender_username: data.sender_username,
                        sender_avatar: data.sender_avatar,
                        created_at: data.created_at,
                    }])
                }
            } catch { /* ignore malformed */ }
        }

        socket.onclose = () => setStatus('disconnected')
        socket.onerror = () => setStatus('disconnected')

        ws.current = socket
        return () => { socket.close() }
    }, [channelId])

    const sendMessage = useCallback((content: string) => {
        if (ws.current && ws.current.readyState === WebSocket.OPEN) {
            ws.current.send(JSON.stringify({ message: content }))
        }
    }, [])

    return { liveMessages, sendMessage, status }
}
