"use client"

import { FC, useEffect, useRef } from 'react'

interface MiniChartProps {
  trend: "up" | "down"
}

export const MiniChart: FC<MiniChartProps> = ({ trend }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    ctx.clearRect(0, 0, canvas.width, canvas.height)

    const data = []
    let value = 50
    for (let i = 0; i < 10; i++) {
      if (trend === "up") {
        value += Math.random() * 10 - 3
      } else {
        value -= Math.random() * 10 - 3
      }
      value = Math.max(10, Math.min(90, value))
      data.push(value)
    }

    ctx.beginPath()
    ctx.moveTo(0, canvas.height - (data[0] / 100) * canvas.height)
    for (let i = 1; i < data.length; i++) {
      const x = (i / (data.length - 1)) * canvas.width
      const y = canvas.height - (data[i] / 100) * canvas.height
      ctx.lineTo(x, y)
    }

    ctx.strokeStyle =
      trend === "up"
        ? "#10b981"
        : "#ef4444"
    ctx.lineWidth = 2
    ctx.stroke()

    ctx.lineTo(canvas.width, canvas.height)
    ctx.lineTo(0, canvas.height)
    ctx.closePath()
    ctx.fillStyle =
      trend === "up"
        ? "rgba(16, 185, 129, 0.1)"
        : "rgba(239, 68, 68, 0.1)"
    ctx.fill()
  }, [trend])

  return <canvas ref={canvasRef} width={60} height={30} style={{ marginBottom: "12px" }}  />
}

