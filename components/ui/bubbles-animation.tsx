"use client"

import type React from "react"
import { useEffect, useState } from "react"

interface Bubble {
  id: number
  size: number
  left: number
  animationDuration: number
  animationDelay: number
  opacity: number
  bubbleType: number
  rotationSpeed: number
  swayAmount: number
}

export default function BubblesAnimation() {
  const [bubbles, setBubbles] = useState<Bubble[]>([])

  // Generate random bubbles
  useEffect(() => {
    const generateBubbles = () => {
      const newBubbles: Bubble[] = []
      const bubbleCount = 20 // Increased count for more realistic effect

      for (let i = 0; i < bubbleCount; i++) {
        newBubbles.push({
          id: i,
          size: Math.random() * 80 + 30, // 30px to 110px
          left: Math.random() * 100, // 0% to 100%
          animationDuration: Math.random() * 12 + 10, // 10s to 22s
          animationDelay: Math.random() * 8, // 0s to 8s delay
          opacity: Math.random() * 0.7 + 0.3, // 0.3 to 1.0
          bubbleType: Math.floor(Math.random() * 4), // 4 different bubble types
          rotationSpeed: Math.random() * 20 + 10, // 10s to 30s rotation
          swayAmount: Math.random() * 30 + 20, // 20px to 50px sway
        })
      }

      setBubbles(newBubbles)
    }

    generateBubbles()
  }, [])

  // Create realistic SVG bubble component
  const BubbleSVG = ({ size, type, opacity }: { size: number; type: number; opacity: number }) => {
    const gradientId = `bubble-gradient-${type}`
    const highlightId = `bubble-highlight-${type}`

    // Different bubble color schemes
    const colorSchemes = [
      { base: "#E0F2FE", highlight: "#FFFFFF", shadow: "#0EA5E9" }, // Light blue
      { base: "#F0F9FF", highlight: "#FFFFFF", shadow: "#3B82F6" }, // Very light blue
      { base: "#DBEAFE", highlight: "#FFFFFF", shadow: "#60A5FA" }, // Pale blue
      { base: "#FAFAFA", highlight: "#FFFFFF", shadow: "#94A3B8" }, // White with blue tint
    ]

    const colors = colorSchemes[type] || colorSchemes[0]

    return (
      <svg width={size} height={size} viewBox="0 0 100 100" style={{ opacity }}>
        <defs>
          {/* Main bubble gradient */}
          <radialGradient id={gradientId} cx="30%" cy="30%" r="70%">
            <stop offset="0%" stopColor={colors.highlight} stopOpacity="0.9" />
            <stop offset="30%" stopColor={colors.base} stopOpacity="0.7" />
            <stop offset="70%" stopColor={colors.base} stopOpacity="0.5" />
            <stop offset="100%" stopColor={colors.shadow} stopOpacity="0.3" />
          </radialGradient>

          {/* Highlight gradient */}
          <radialGradient id={highlightId} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Main bubble circle */}
        <circle
          cx="50"
          cy="50"
          r="48"
          fill={`url(#${gradientId})`}
          stroke={colors.shadow}
          strokeWidth="0.5"
          strokeOpacity="0.3"
        />

        {/* Main highlight */}
        <ellipse cx="35" cy="30" rx="12" ry="18" fill={`url(#${highlightId})`} transform="rotate(-20 35 30)" />

        {/* Secondary highlight */}
        <circle cx="25" cy="25" r="4" fill="#FFFFFF" opacity="0.6" />

        {/* Small reflection */}
        <circle cx="70" cy="35" r="2" fill="#FFFFFF" opacity="0.4" />
      </svg>
    )
  }

  return (
    <>
      <style jsx>{`
        @keyframes bubbleFloat {
          0% {
            transform: translateY(100vh) translateX(0px) scale(0.5) rotate(0deg);
            opacity: 0;
          }
          5% {
            opacity: 1;
            transform: translateY(95vh) translateX(0px) scale(1) rotate(10deg);
          }
          95% {
            opacity: 1;
          }
          100% {
            transform: translateY(-120px) translateX(var(--sway-amount)) scale(0.3) rotate(360deg);
            opacity: 0;
          }
        }

        @keyframes bubbleSway {
          0%, 100% {
            transform: translateX(0px);
          }
          25% {
            transform: translateX(var(--sway-quarter));
          }
          50% {
            transform: translateX(0px);
          }
          75% {
            transform: translateX(calc(var(--sway-quarter) * -1));
          }
        }

        @keyframes bubbleRotate {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        .bubble-container {
          position: absolute;
          pointer-events: none;
          animation: bubbleFloat var(--duration) infinite linear;
          filter: drop-shadow(0 0 10px rgba(8, 144, 241, 0.2));
        }

        .bubble-svg {
          animation: 
            bubbleSway var(--sway-duration) infinite ease-in-out,
            bubbleRotate var(--rotation-duration) infinite linear;
          transform-origin: center center;
        }
      `}</style>

      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        {bubbles.map((bubble) => (
          <div
            key={bubble.id}
            className="bubble-container"
            style={
              {
                "--duration": `${bubble.animationDuration}s`,
                "--sway-amount": `${(Math.random() - 0.5) * bubble.swayAmount}px`,
                "--sway-quarter": `${bubble.swayAmount / 4}px`,
                "--sway-duration": `${bubble.animationDuration * 0.3}s`,
                "--rotation-duration": `${bubble.rotationSpeed}s`,
                left: `${bubble.left}%`,
                animationDelay: `${bubble.animationDelay}s`,
              } as React.CSSProperties & { [key: string]: string }
            }
          >
            <div className="bubble-svg">
              <BubbleSVG size={bubble.size} type={bubble.bubbleType} opacity={bubble.opacity} />
            </div>
          </div>
        ))}
      </div>
    </>
  )
}
