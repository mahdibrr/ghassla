"use client"

import { useEffect, useState } from "react"
import { LoadingSpinner } from "@/components/ui/loading-spinner"

export const ActivityChart = () => {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // In a real app, we'd load real data here
    const timer = setTimeout(() => setLoading(false), 800)
    return () => clearTimeout(timer)
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-48">
        <LoadingSpinner size={24} className="text-[#0890F1]" />
      </div>
    )
  }

  return (
    <div className="h-48">
      {/* Chart Container */}
      <div className="relative h-full w-full">
        {/* Vertical grid lines */}
        <div className="absolute inset-0 grid grid-cols-7 w-full h-full">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="border-r border-gray-100 h-full" />
          ))}
        </div>

        {/* Horizontal grid lines */}
        <div className="absolute inset-0 grid grid-rows-4 w-full h-full">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="border-t border-gray-100 w-full" />
          ))}
        </div>

        {/* The chart line */}
        <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
          {/* Activity line */}
          <path
            d="M0,148 C20,100 40,120 80,90 C120,60 160,120 200,80 C240,40 280,60 320,50 C360,40 400,70 440,90 C480,110 520,60 560,70 C600,80 640,40 680,60 C720,80 760,30 800,10"
            fill="none"
            stroke="#0890F1"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="drop-shadow"
            style={{
              filter: "drop-shadow(0 1px 2px rgba(8, 144, 241, 0.3))",
              transform: "scale(0.96, 0.92)", // Scale down slightly to fit in the viewBox
              transformOrigin: "center",
            }}
          />

          {/* Fill below the line with gradient */}
          <path
            d="M0,148 C20,100 40,120 80,90 C120,60 160,120 200,80 C240,40 280,60 320,50 C360,40 400,70 440,90 C480,110 520,60 560,70 C600,80 640,40 680,60 C720,80 760,30 800,10 L800,148 L0,148 Z"
            fill="url(#blue-gradient)"
            opacity="0.2"
          />

          {/* Define the gradient */}
          <defs>
            <linearGradient id="blue-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#0890F1" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#0890F1" stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>

        {/* Data points */}
        <div className="absolute inset-0 flex justify-between items-end pb-6 px-2">
          {Array.from({ length: 7 }).map((_, index) => {
            // Calculate heights for data points (would be based on actual data)
            const heights = [60, 30, 70, 20, 50, 40, 80]
            const height = heights[index % heights.length]

            return (
              <div key={index} className="flex flex-col items-center" style={{ height: `${100 - height}%` }}>
                <div className="w-2.5 h-2.5 rounded-full bg-[#0890F1] mb-1 glow-dot"></div>
                <div className="text-xs text-gray-500">{`${index + 1}/4`}</div>
              </div>
            )
          })}
        </div>
      </div>

      <style jsx>{`
        .glow-dot {
          box-shadow: 0 0 5px rgba(8, 144, 241, 0.5);
        }
      `}</style>
    </div>
  )
}
