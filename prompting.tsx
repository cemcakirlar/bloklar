"use client"

import type React from "react"

import { useEffect, useRef, useState, useCallback } from "react"

const COLOR = "#FFFFFF"
const HIT_COLOR = "#333333"
const BACKGROUND_COLOR = "#000000"
const BALL_COLOR = "#FFFFFF"
const PADDLE_COLOR = "#FFFFFF"
const LETTER_SPACING = 1
const WORD_SPACING = 3

const PIXEL_MAP = {
  P: [
    [1, 1, 1, 1],
    [1, 0, 0, 1],
    [1, 1, 1, 1],
    [1, 0, 0, 0],
    [1, 0, 0, 0],
  ],
  R: [
    [1, 1, 1, 1],
    [1, 0, 0, 1],
    [1, 1, 1, 1],
    [1, 0, 1, 0],
    [1, 0, 0, 1],
  ],
  O: [
    [1, 1, 1, 1],
    [1, 0, 0, 1],
    [1, 0, 0, 1],
    [1, 0, 0, 1],
    [1, 1, 1, 1],
  ],
  M: [
    [1, 0, 0, 0, 1],
    [1, 1, 0, 1, 1],
    [1, 0, 1, 0, 1],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
  ],
  T: [
    [1, 1, 1, 1, 1],
    [0, 0, 1, 0, 0],
    [0, 0, 1, 0, 0],
    [0, 0, 1, 0, 0],
    [0, 0, 1, 0, 0],
  ],
  I: [
    [1, 1, 1],
    [0, 1, 0],
    [0, 1, 0],
    [0, 1, 0],
    [1, 1, 1],
  ],
  N: [
    [1, 0, 0, 0, 1],
    [1, 1, 0, 0, 1],
    [1, 0, 1, 0, 1],
    [1, 0, 0, 1, 1],
    [1, 0, 0, 0, 1],
  ],
  G: [
    [1, 1, 1, 1, 1],
    [1, 0, 0, 0, 0],
    [1, 0, 1, 1, 1],
    [1, 0, 0, 0, 1],
    [1, 1, 1, 1, 1],
  ],
  S: [
    [1, 1, 1, 1],
    [1, 0, 0, 0],
    [1, 1, 1, 1],
    [0, 0, 0, 1],
    [1, 1, 1, 1],
  ],
  A: [
    [0, 1, 1, 0],
    [1, 0, 0, 1],
    [1, 1, 1, 1],
    [1, 0, 0, 1],
    [1, 0, 0, 1],
  ],
  L: [
    [1, 0, 0, 0],
    [1, 0, 0, 0],
    [1, 0, 0, 0],
    [1, 0, 0, 0],
    [1, 1, 1, 1],
  ],
  Y: [
    [1, 0, 0, 0, 1],
    [0, 1, 0, 1, 0],
    [0, 0, 1, 0, 0],
    [0, 0, 1, 0, 0],
    [0, 0, 1, 0, 0],
  ],
  U: [
    [1, 0, 0, 1],
    [1, 0, 0, 1],
    [1, 0, 0, 1],
    [1, 0, 0, 1],
    [1, 1, 1, 1],
  ],
  D: [
    [1, 1, 1, 0],
    [1, 0, 0, 1],
    [1, 0, 0, 1],
    [1, 0, 0, 1],
    [1, 1, 1, 0],
  ],
  E: [
    [1, 1, 1, 1],
    [1, 0, 0, 0],
    [1, 1, 1, 1],
    [1, 0, 0, 0],
    [1, 1, 1, 1],
  ],
  C: [
    [1, 1, 1, 1],
    [1, 0, 0, 0],
    [1, 0, 0, 0],
    [1, 0, 0, 0],
    [1, 1, 1, 1],
  ],
}

interface Pixel {
  x: number
  y: number
  size: number
  hit: boolean
}

interface Ball {
  x: number
  y: number
  dx: number
  dy: number
  radius: number
}

interface Paddle {
  x: number
  y: number
  width: number
  height: number
  targetY: number
  isVertical: boolean
}

interface TrailPoint {
  x: number
  y: number
  age: number
  color: string
}

interface TrailConfig {
  width: number
  maxLength: number
  fadeSpeed: number
  mode: "rainbow" | "gradient" | "pulse"
}

// Default trail configuration
const DEFAULT_TRAIL_CONFIG: TrailConfig = {
  width: 1,
  maxLength: 30,
  fadeSpeed: 0.02,
  mode: "rainbow",
}

export function PromptingIsAllYouNeed() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const pixelsRef = useRef<Pixel[]>([])
  const ballRef = useRef<Ball>({ x: 0, y: 0, dx: 0, dy: 0, radius: 0 })
  const paddlesRef = useRef<Paddle[]>([])
  const scaleRef = useRef(1)
  const trailPointsRef = useRef<TrailPoint[]>([])
  const trailConfigRef = useRef<TrailConfig>({ ...DEFAULT_TRAIL_CONFIG })
  const gameLoopRef = useRef<number | null>(null)
  const settingsPanelRef = useRef<HTMLDivElement>(null)
  const settingsButtonRef = useRef<HTMLButtonElement>(null)
  const initializeGameRef = useRef<() => void>()

  // Use state for trail configuration to make it reactive with UI
  const [trailConfig, setTrailConfig] = useState<TrailConfig>({ ...DEFAULT_TRAIL_CONFIG })

  // State for settings panel visibility
  const [showSettings, setShowSettings] = useState(false)

  // Update the ref when state changes
  useEffect(() => {
    trailConfigRef.current = trailConfig
  }, [trailConfig])

  const getTrailColor = useCallback((age: number, mode: "rainbow" | "gradient" | "pulse"): string => {
    const opacity = Math.max(0.2, 1 - age)

    if (mode === "rainbow") {
      const hue = (Date.now() / 20 + age * 50) % 360
      return `hsla(${hue}, 100%, 60%, ${opacity})`
    } else if (mode === "gradient") {
      return `rgba(255, ${Math.floor(255 * (1 - age))}, ${Math.floor(255 * age)}, ${opacity})`
    } else if (mode === "pulse") {
      // Pulse mode
      const intensity = (Math.sin(Date.now() / 300) + 1) / 2
      return `rgba(255, ${Math.floor(100 + 155 * intensity)}, ${Math.floor(100 + 155 * (1 - intensity))}, ${opacity})`
    }

    // Default fallback
    return `rgba(255, 255, 255, ${opacity})`
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      scaleRef.current = Math.min(canvas.width / 1000, canvas.height / 1000)
      initializeGame()
    }

    const initializeGame = () => {
      const scale = scaleRef.current
      const LARGE_PIXEL_SIZE = 8 * scale
      const SMALL_PIXEL_SIZE = 4 * scale
      const BALL_SPEED = 6 * scale

      // Clear existing pixels and trail
      pixelsRef.current = []
      trailPointsRef.current = []

      const words = ["CEM", "IS ALL YOU NEED"]

      const calculateWordWidth = (word: string, pixelSize: number) => {
        return (
          word.split("").reduce((width, letter) => {
            const letterWidth = PIXEL_MAP[letter as keyof typeof PIXEL_MAP]?.[0]?.length ?? 0
            return width + letterWidth * pixelSize + LETTER_SPACING * pixelSize
          }, 0) -
          LETTER_SPACING * pixelSize
        )
      }

      const totalWidthLarge = calculateWordWidth(words[0], LARGE_PIXEL_SIZE)
      const totalWidthSmall = words[1].split(" ").reduce((width, word, index) => {
        return width + calculateWordWidth(word, SMALL_PIXEL_SIZE) + (index > 0 ? WORD_SPACING * SMALL_PIXEL_SIZE : 0)
      }, 0)
      const totalWidth = Math.max(totalWidthLarge, totalWidthSmall)
      const scaleFactor = (canvas.width * 0.8) / totalWidth

      const adjustedLargePixelSize = LARGE_PIXEL_SIZE * scaleFactor
      const adjustedSmallPixelSize = SMALL_PIXEL_SIZE * scaleFactor

      const largeTextHeight = 5 * adjustedLargePixelSize
      const smallTextHeight = 5 * adjustedSmallPixelSize
      const spaceBetweenLines = 5 * adjustedLargePixelSize
      const totalTextHeight = largeTextHeight + spaceBetweenLines + smallTextHeight

      let startY = (canvas.height - totalTextHeight) / 2

      words.forEach((word, wordIndex) => {
        const pixelSize = wordIndex === 0 ? adjustedLargePixelSize : adjustedSmallPixelSize
        const totalWidth =
          wordIndex === 0
            ? calculateWordWidth(word, adjustedLargePixelSize)
            : words[1].split(" ").reduce((width, w, index) => {
                return (
                  width +
                  calculateWordWidth(w, adjustedSmallPixelSize) +
                  (index > 0 ? WORD_SPACING * adjustedSmallPixelSize : 0)
                )
              }, 0)

        let startX = (canvas.width - totalWidth) / 2

        if (wordIndex === 1) {
          word.split(" ").forEach((subWord) => {
            subWord.split("").forEach((letter) => {
              const pixelMap = PIXEL_MAP[letter as keyof typeof PIXEL_MAP]
              if (!pixelMap) return

              for (let i = 0; i < pixelMap.length; i++) {
                for (let j = 0; j < pixelMap[i].length; j++) {
                  if (pixelMap[i][j]) {
                    const x = startX + j * pixelSize
                    const y = startY + i * pixelSize
                    pixelsRef.current.push({ x, y, size: pixelSize, hit: false })
                  }
                }
              }
              startX += (pixelMap[0].length + LETTER_SPACING) * pixelSize
            })
            startX += WORD_SPACING * adjustedSmallPixelSize
          })
        } else {
          word.split("").forEach((letter) => {
            const pixelMap = PIXEL_MAP[letter as keyof typeof PIXEL_MAP]
            if (!pixelMap) return

            for (let i = 0; i < pixelMap.length; i++) {
              for (let j = 0; j < pixelMap[i].length; j++) {
                if (pixelMap[i][j]) {
                  const x = startX + j * pixelSize
                  const y = startY + i * pixelSize
                  pixelsRef.current.push({ x, y, size: pixelSize, hit: false })
                }
              }
            }
            startX += (pixelMap[0].length + LETTER_SPACING) * pixelSize
          })
        }
        startY += wordIndex === 0 ? largeTextHeight + spaceBetweenLines : 0
      })

      // Initialize ball position near the top right corner
      const ballStartX = canvas.width * 0.9
      const ballStartY = canvas.height * 0.1

      ballRef.current = {
        x: ballStartX,
        y: ballStartY,
        dx: -BALL_SPEED,
        dy: BALL_SPEED,
        radius: adjustedLargePixelSize / 2,
      }

      const paddleWidth = adjustedLargePixelSize
      const paddleLength = 10 * adjustedLargePixelSize

      paddlesRef.current = [
        {
          x: 0,
          y: canvas.height / 2 - paddleLength / 2,
          width: paddleWidth,
          height: paddleLength,
          targetY: canvas.height / 2 - paddleLength / 2,
          isVertical: true,
        },
        {
          x: canvas.width - paddleWidth,
          y: canvas.height / 2 - paddleLength / 2,
          width: paddleWidth,
          height: paddleLength,
          targetY: canvas.height / 2 - paddleLength / 2,
          isVertical: true,
        },
        {
          x: canvas.width / 2 - paddleLength / 2,
          y: 0,
          width: paddleLength,
          height: paddleWidth,
          targetY: canvas.width / 2 - paddleLength / 2,
          isVertical: false,
        },
        {
          x: canvas.width / 2 - paddleLength / 2,
          y: canvas.height - paddleWidth,
          width: paddleLength,
          height: paddleWidth,
          targetY: canvas.width / 2 - paddleLength / 2,
          isVertical: false,
        },
      ]
    }

    // Store the initializeGame function in a ref so we can call it from UI
    initializeGameRef.current = initializeGame

    const updateGame = () => {
      const ball = ballRef.current
      const paddles = paddlesRef.current
      const config = trailConfigRef.current

      ball.x += ball.dx
      ball.y += ball.dy

      // Add new point to trail
      trailPointsRef.current.push({
        x: ball.x,
        y: ball.y,
        age: 0,
        color: getTrailColor(0, config.mode),
      })

      // Update age of existing trail points
      trailPointsRef.current.forEach((point) => {
        point.age += config.fadeSpeed
      })

      // Remove old trail points
      trailPointsRef.current = trailPointsRef.current.filter((point) => point.age < 1).slice(0, config.maxLength)

      if (ball.y - ball.radius < 0 || ball.y + ball.radius > canvas.height) {
        ball.dy = -ball.dy
      }
      if (ball.x - ball.radius < 0 || ball.x + ball.radius > canvas.width) {
        ball.dx = -ball.dx
      }

      paddles.forEach((paddle) => {
        if (paddle.isVertical) {
          if (
            ball.x - ball.radius < paddle.x + paddle.width &&
            ball.x + ball.radius > paddle.x &&
            ball.y > paddle.y &&
            ball.y < paddle.y + paddle.height
          ) {
            ball.dx = -ball.dx
          }
        } else {
          if (
            ball.y - ball.radius < paddle.y + paddle.height &&
            ball.y + ball.radius > paddle.y &&
            ball.x > paddle.x &&
            ball.x < paddle.x + paddle.width
          ) {
            ball.dy = -ball.dy
          }
        }
      })

      paddles.forEach((paddle) => {
        if (paddle.isVertical) {
          paddle.targetY = ball.y - paddle.height / 2
          paddle.targetY = Math.max(0, Math.min(canvas.height - paddle.height, paddle.targetY))
          paddle.y += (paddle.targetY - paddle.y) * 0.1
        } else {
          paddle.targetY = ball.x - paddle.width / 2
          paddle.targetY = Math.max(0, Math.min(canvas.width - paddle.width, paddle.targetY))
          paddle.x += (paddle.targetY - paddle.x) * 0.1
        }
      })

      pixelsRef.current.forEach((pixel) => {
        if (
          !pixel.hit &&
          ball.x + ball.radius > pixel.x &&
          ball.x - ball.radius < pixel.x + pixel.size &&
          ball.y + ball.radius > pixel.y &&
          ball.y - ball.radius < pixel.y + pixel.size
        ) {
          pixel.hit = true
          const centerX = pixel.x + pixel.size / 2
          const centerY = pixel.y + pixel.size / 2
          if (Math.abs(ball.x - centerX) > Math.abs(ball.y - centerY)) {
            ball.dx = -ball.dx
          } else {
            ball.dy = -ball.dy
          }
        }
      })
    }

    const drawGame = () => {
      if (!ctx) return

      ctx.fillStyle = BACKGROUND_COLOR
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Draw trail - draw in reverse order so newest points appear on top
      const config = trailConfigRef.current
      for (let i = trailPointsRef.current.length - 1; i >= 0; i--) {
        const point = trailPointsRef.current[i]
        const size = ballRef.current.radius * (1 - point.age * 0.7)
        ctx.fillStyle = point.color
        ctx.beginPath()
        ctx.arc(point.x, point.y, size * config.width, 0, Math.PI * 2)
        ctx.fill()
      }

      pixelsRef.current.forEach((pixel) => {
        ctx.fillStyle = pixel.hit ? HIT_COLOR : COLOR
        ctx.fillRect(pixel.x, pixel.y, pixel.size, pixel.size)
      })

      ctx.fillStyle = BALL_COLOR
      ctx.beginPath()
      ctx.arc(ballRef.current.x, ballRef.current.y, ballRef.current.radius, 0, Math.PI * 2)
      ctx.fill()

      ctx.fillStyle = PADDLE_COLOR
      paddlesRef.current.forEach((paddle) => {
        ctx.fillRect(paddle.x, paddle.y, paddle.width, paddle.height)
      })
    }

    const gameLoop = () => {
      updateGame()
      drawGame()
      gameLoopRef.current = requestAnimationFrame(gameLoop)
    }

    // Handle clicks outside the settings panel
    const handleClickOutside = (event: MouseEvent) => {
      // Check if settings panel is shown and the click is outside both the panel and the settings button
      if (
        showSettings &&
        settingsPanelRef.current &&
        settingsButtonRef.current &&
        !settingsPanelRef.current.contains(event.target as Node) &&
        !settingsButtonRef.current.contains(event.target as Node)
      ) {
        setShowSettings(false)
      }
    }

    resizeCanvas()
    window.addEventListener("resize", resizeCanvas)
    document.addEventListener("mousedown", handleClickOutside)

    // Start the game loop
    gameLoopRef.current = requestAnimationFrame(gameLoop)

    return () => {
      window.removeEventListener("resize", resizeCanvas)
      document.removeEventListener("mousedown", handleClickOutside)
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current)
      }
    }
  }, [getTrailColor]) // Don't depend on showSettings to prevent game reset

  // Handler functions for trail configuration changes
  const handleModeChange = (mode: "rainbow" | "gradient" | "pulse") => {
    setTrailConfig((prev) => ({ ...prev, mode }))
  }

  const handleLengthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number.parseInt(e.target.value)
    setTrailConfig((prev) => ({ ...prev, maxLength: value }))
  }

  const handleFadeSpeedChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number.parseFloat(e.target.value)
    setTrailConfig((prev) => ({ ...prev, fadeSpeed: value }))
  }

  const handleWidthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number.parseFloat(e.target.value)
    setTrailConfig((prev) => ({ ...prev, width: value }))
  }

  const handleResetDefaults = () => {
    setTrailConfig({ ...DEFAULT_TRAIL_CONFIG })
  }

  const handleResetGame = () => {
    if (initializeGameRef.current) {
      initializeGameRef.current()
    }
  }

  return (
    <div className="relative w-full h-full">
      <canvas
        ref={canvasRef}
        className="fixed top-0 left-0 w-full h-full"
        aria-label="Prompting Is All You Need: Fullscreen Pong game with pixel text"
      />

      {/* Settings toggle button */}
      <button
        ref={settingsButtonRef}
        className="fixed top-4 right-4 z-10 bg-gray-800 text-white p-2 rounded-full shadow-lg hover:bg-gray-700 transition-colors"
        onClick={() => setShowSettings(!showSettings)}
        aria-label={showSettings ? "Close settings" : "Open settings"}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
          />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      </button>

      {/* Settings panel */}
      {showSettings && (
        <div
          ref={settingsPanelRef}
          className="fixed top-16 right-4 z-10 bg-gray-900 bg-opacity-90 text-white p-4 rounded-lg shadow-lg w-64"
        >
          <h2 className="text-xl font-bold mb-4">Trail Settings</h2>

          <div className="mb-4">
            <h3 className="text-sm font-medium mb-2">Color Mode</h3>
            <div className="flex space-x-1">
              <button
                className={`px-2 py-1 text-xs rounded ${trailConfig.mode === "rainbow" ? "bg-blue-600" : "bg-gray-700"}`}
                onClick={() => handleModeChange("rainbow")}
              >
                Rainbow
              </button>
              <button
                className={`px-2 py-1 text-xs rounded ${trailConfig.mode === "gradient" ? "bg-blue-600" : "bg-gray-700"}`}
                onClick={() => handleModeChange("gradient")}
              >
                Gradient
              </button>
              <button
                className={`px-2 py-1 text-xs rounded ${trailConfig.mode === "pulse" ? "bg-blue-600" : "bg-gray-700"}`}
                onClick={() => handleModeChange("pulse")}
              >
                Pulse
              </button>
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Trail Length: {trailConfig.maxLength}</label>
            <input
              type="range"
              min="5"
              max="50"
              value={trailConfig.maxLength}
              onChange={handleLengthChange}
              className="w-full"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Fade Speed: {trailConfig.fadeSpeed.toFixed(2)}</label>
            <input
              type="range"
              min="0.01"
              max="0.1"
              step="0.01"
              value={trailConfig.fadeSpeed}
              onChange={handleFadeSpeedChange}
              className="w-full"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Trail Width: {trailConfig.width.toFixed(1)}</label>
            <input
              type="range"
              min="0.5"
              max="3"
              step="0.1"
              value={trailConfig.width}
              onChange={handleWidthChange}
              className="w-full"
            />
          </div>

          <div className="flex space-x-2">
            <button
              onClick={handleResetDefaults}
              className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-1 px-2 rounded text-sm"
            >
              Reset Settings
            </button>
            <button
              onClick={handleResetGame}
              className="flex-1 bg-blue-700 hover:bg-blue-600 text-white py-1 px-2 rounded text-sm"
            >
              Reset Game
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default PromptingIsAllYouNeed

