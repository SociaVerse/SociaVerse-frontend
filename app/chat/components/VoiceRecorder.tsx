"use client"

import React, { useState, useEffect, useRef } from 'react'
import { Mic, StopCircle, Trash2, Send } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { motion, AnimatePresence } from 'framer-motion'

interface VoiceRecorderProps {
    onSend: (audioBlob: Blob, duration: number, waveform: number[]) => void
    onCancel: () => void
}

export function VoiceRecorder({ onSend, onCancel }: VoiceRecorderProps) {
    const [isRecording, setIsRecording] = useState(false)
    const [duration, setDuration] = useState(0)
    const [waveform, setWaveform] = useState<number[]>([])
    const [hasStarted, setHasStarted] = useState(false) // New state for manual start

    const mediaRecorderRef = useRef<MediaRecorder | null>(null)
    const chunksRef = useRef<Blob[]>([])
    const timerRef = useRef<NodeJS.Timeout | null>(null)
    const audioContextRef = useRef<AudioContext | null>(null)
    const analyserRef = useRef<AnalyserNode | null>(null)
    const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null)
    const animationFrameRef = useRef<number | null>(null)

    const isMountedRef = useRef(true)

    useEffect(() => {
        isMountedRef.current = true
        // startRecording() // REMOVED auto-start
        return () => {
            isMountedRef.current = false
            stopRecordingCleanup()
        }
    }, [])

    const startRecording = async () => {
        try {
            setHasStarted(true) // Set started state
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true })

            // Check if unmounted during await
            if (!isMountedRef.current) {
                stream.getTracks().forEach(track => track.stop())
                return
            }

            // Audio Context for Visualization
            const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
            audioContextRef.current = audioContext
            const analyser = audioContext.createAnalyser()
            analyserRef.current = analyser
            analyser.fftSize = 256
            const source = audioContext.createMediaStreamSource(stream)
            sourceRef.current = source
            source.connect(analyser)

            // Media Recorder
            const mediaRecorder = new MediaRecorder(stream)
            mediaRecorderRef.current = mediaRecorder
            chunksRef.current = []

            mediaRecorder.ondataavailable = (e) => {
                if (e.data.size > 0) chunksRef.current.push(e.data)
            }

            mediaRecorder.onstop = () => {
                // Determine blob type
                const blob = new Blob(chunksRef.current, { type: 'audio/webm' })
                // onSend logic handles elsewhere
            }

            mediaRecorder.start()
            setIsRecording(true)

            // Timer
            timerRef.current = setInterval(() => {
                setDuration(prev => prev + 1)
            }, 1000)

            // Visualizer Loop
            const updateWaveform = () => {
                if (!analyserRef.current || !isMountedRef.current) return
                const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount)
                analyserRef.current.getByteFrequencyData(dataArray)

                // Calculate average volume for this frame
                let sum = 0
                for (let i = 0; i < dataArray.length; i++) {
                    sum += dataArray[i]
                }
                const average = sum / dataArray.length

                // Add to waveform state (keep last 50 points)
                setWaveform(prev => {
                    const next = [...prev, average]
                    if (next.length > 50) return next.slice(next.length - 50)
                    return next
                })

                animationFrameRef.current = requestAnimationFrame(updateWaveform)
            }
            updateWaveform()

        } catch (err) {
            console.error("Failed to start recording", err)
            if (isMountedRef.current) onCancel() // Close if permission denied or error
        }
    }

    const stopRecordingCleanup = () => {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
            mediaRecorderRef.current.stop()
            mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop())
        }
        if (timerRef.current) {
            clearInterval(timerRef.current)
            timerRef.current = null
        }
        if (animationFrameRef.current) {
            cancelAnimationFrame(animationFrameRef.current)
            animationFrameRef.current = null
        }
        if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
            audioContextRef.current.close().catch(e => console.error("Error closing AudioContext:", e))
            audioContextRef.current = null
        }
    }

    const handleSend = () => {
        if (!mediaRecorderRef.current) return

        const recorder = mediaRecorderRef.current

        // Define what to do when recorder stops
        recorder.onstop = () => {
            const blob = new Blob(chunksRef.current, { type: 'audio/webm' })
            const finalWaveform = waveform.filter((_, i) => i % 2 === 0)
            onSend(blob, duration, finalWaveform)
            // Cleanup after sending data
            stopRecordingCleanup()
        }

        // Trigger stop
        recorder.stop()
        // Stop visuals/timer immediately to give feedback
        if (timerRef.current) clearInterval(timerRef.current)
        if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current)
    }

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60)
        const secs = seconds % 60
        return `${mins}:${secs.toString().padStart(2, '0')}`
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="flex items-center gap-4 bg-slate-900/80 backdrop-blur-xl border border-white/10 rounded-full p-2 pl-6 pr-2 w-full h-14"
        >
            {!hasStarted ? (
                /* Ready State */
                <div className="flex items-center justify-between w-full">
                    <span className="text-slate-400 text-sm ml-2">Click to record...</span>
                    <div className="flex items-center gap-2">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="text-red-500 hover:bg-red-500/10 rounded-full w-10 h-10 animate-pulse"
                            onClick={startRecording}
                        >
                            <div className="w-4 h-4 rounded-full bg-red-500 ml-0.5" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={onCancel} className="text-slate-400 hover:text-white rounded-full w-10 h-10">
                            <Trash2 className="w-5 h-5" />
                        </Button>
                    </div>
                </div>
            ) : (
                /* Recording State */
                <>
                    <div className="flex items-center gap-2 text-red-500 animate-pulse">
                        <div className="w-2 h-2 rounded-full bg-red-500" />
                        <span className="text-sm font-mono tabular-nums">{formatTime(duration)}</span>
                    </div>

                    {/* Visualizer Area */}
                    <div className="flex-1 h-8 flex items-center justify-center gap-[2px] overflow-hidden mask-linear-fade">
                        {waveform.map((val, i) => (
                            <motion.div
                                key={i}
                                className="w-1 bg-red-500/50 rounded-full"
                                style={{ height: Math.max(4, val / 255 * 32) }}
                            />
                        ))}
                    </div>

                    <div className="flex items-center gap-2">
                        <Button variant="ghost" size="icon" onClick={() => { stopRecordingCleanup(); onCancel(); }} className="text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-full w-10 h-10">
                            <Trash2 className="w-5 h-5" />
                        </Button>
                        <Button size="icon" onClick={handleSend} className="bg-blue-600 hover:bg-blue-500 text-white rounded-full w-10 h-10 shadow-lg shadow-blue-600/20">
                            <Send className="w-4 h-4 ml-0.5" />
                        </Button>
                    </div>
                </>
            )}
        </motion.div>
    )
}
