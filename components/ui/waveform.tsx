"use client"

import React, { useEffect, useRef } from 'react'

interface WaveformProps {
    data: number[] // Array of amplitudes (0-255 or 0-1)
    progress?: number // 0 to 1
    color?: string
    barWidth?: number
    gap?: number
    height?: number
}

export function Waveform({
    data,
    progress = 0,
    color = '#3b82f6',
    barWidth = 2,
    gap = 1,
    height = 40
}: WaveformProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null)

    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return

        const ctx = canvas.getContext('2d')
        if (!ctx) return

        // Set dimensions (handle high DPI)
        const dpr = window.devicePixelRatio || 1
        // We'll calculate width based on data length but constrain it
        const totalWidth = data.length * (barWidth + gap)

        // Logical size
        canvas.style.width = `${totalWidth}px`
        canvas.style.height = `${height}px`

        // Actual size
        canvas.width = totalWidth * dpr
        canvas.height = height * dpr

        ctx.scale(dpr, dpr)
        ctx.clearRect(0, 0, totalWidth, height)

        // Draw bars
        data.forEach((value, index) => {
            const x = index * (barWidth + gap)
            // Normalize value: assuming input is 0-255 (Web Audio ByteFrequencyData)
            // If input is normalized (0-1), adjust accordingly. Let's assume normalized for flexibility or 0-255.
            // Let's assume 0-1 normalized for now, if >1 we clamp.
            let normalized = value > 1 ? value / 255 : value

            // Min height for visibility
            const barHeight = Math.max(normalized * height, 2)
            const y = (height - barHeight) / 2 // Center vertically

            // Determine color based on progress
            const progressX = totalWidth * progress
            if (x < progressX) {
                ctx.fillStyle = color
            } else {
                ctx.fillStyle = 'rgba(255, 255, 255, 0.2)' // dimmed color for future
            }

            // Rounded bars
            ctx.beginPath()
            ctx.roundRect(x, y, barWidth, barHeight, barWidth / 2)
            ctx.fill()
        })

    }, [data, progress, color, barWidth, gap, height])

    return <canvas ref={canvasRef} className="block" />
}
