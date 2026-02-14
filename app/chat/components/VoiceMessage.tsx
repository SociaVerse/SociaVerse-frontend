"use client"

import React, { useState, useRef, useEffect } from 'react'
import { Play, Pause, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface VoiceMessageBubbleProps {
    audioUrl: string
    duration: number
    waveform: number[]
    isMe: boolean
}

export function VoiceMessageBubble({ audioUrl, duration, waveform = [], isMe }: VoiceMessageBubbleProps) {
    const [isPlaying, setIsPlaying] = useState(false)
    const [progress, setProgress] = useState(0)
    const [currentTime, setCurrentTime] = useState(0)
    const audioRef = useRef<HTMLAudioElement | null>(null)

    // Ensure URL is absolute if coming from backend
    const fullUrl = audioUrl?.startsWith('http') ? audioUrl : `http://127.0.0.1:8000${audioUrl}`

    useEffect(() => {
        const audio = new Audio(fullUrl)
        audioRef.current = audio

        audio.addEventListener('timeupdate', () => {
            setCurrentTime(audio.currentTime)
            setProgress(audio.currentTime / audio.duration)
        })

        audio.addEventListener('ended', () => {
            setIsPlaying(false)
            setProgress(0)
            setCurrentTime(0)
        })

        return () => {
            audio.pause()
            audio.remove()
        }
    }, [fullUrl])

    const togglePlay = () => {
        if (!audioRef.current) return

        if (isPlaying) {
            audioRef.current.pause()
        } else {
            audioRef.current.play()
        }
        setIsPlaying(!isPlaying)
    }

    // Fallback waveform if empty
    const displayWaveform = waveform.length > 0 ? waveform : Array.from({ length: 30 }, () => Math.random() * 255)

    const formatTime = (seconds: number) => {
        if (!seconds && seconds !== 0) return "--:--"
        const mins = Math.floor(seconds / 60)
        const secs = Math.floor(seconds % 60)
        return `${mins}:${secs.toString().padStart(2, '0')}`
    }

    return (
        <div className="flex items-center gap-3 min-w-[200px] py-1">
            <Button
                variant="ghost"
                size="icon"
                onClick={togglePlay}
                className={`w-10 h-10 rounded-full shrink-0 ${isMe ? 'bg-white/20 text-white hover:bg-white/30' : 'bg-slate-200/20 text-slate-200 hover:bg-slate-200/30'}`}
            >
                {isPlaying ? <Pause className="fill-current w-4 h-4" /> : <Play className="fill-current w-4 h-4 ml-0.5" />}
            </Button>

            <div className="flex flex-col gap-1 flex-1 min-w-0">
                {/* Visualizer */}
                <div className="h-8 flex items-center gap-[2px]">
                    {displayWaveform.map((val, i) => {
                        const percent = i / displayWaveform.length
                        const isPlayed = percent < progress
                        const barHeight = Math.max(4, (val / 255) * 24)

                        return (
                            <div
                                key={i}
                                className={`w-1 rounded-full ${isPlayed ? (isMe ? 'bg-white' : 'bg-blue-400') : (isMe ? 'bg-white/30' : 'bg-slate-500')}`}
                                style={{ height: barHeight }}
                            />
                        )
                    })}
                </div>
                <div className={`text-[10px] font-mono ${isMe ? 'text-blue-100' : 'text-slate-400'}`}>
                    {formatTime(isPlaying ? currentTime : duration)}
                </div>
            </div>
        </div>
    )
}
