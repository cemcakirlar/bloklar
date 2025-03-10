"use client";

import type React from "react";

import { useEffect, useRef, useState, useCallback } from "react";
import { Button } from "./components/ui/button";
import { SettingsIcon } from "lucide-react";

// Types for game configuration and state
type PixelRow = (0 | 1)[];
type LetterMatrix = PixelRow[];
type PixelMap = Record<string, LetterMatrix>;

interface GameConfig {
  colors: {
    default: string;
    hit: string;
    background: string;
    ball: string;
    paddle: string;
  };
  spacing: {
    letter: number;
    word: number;
  };
}

// Game configuration
const GAME_CONFIG: GameConfig = {
  colors: {
    default: "#FFFFFF",
    hit: "#333333",
    background: "#000000",
    ball: "#FFFFFF",
    paddle: "#FFFFFF",
  },
  spacing: {
    letter: 1,
    word: 3,
  },
};

// Pixel map with proper typing
const PIXEL_MAP: PixelMap = {
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
};

// Game state types
interface Ball {
  x: number;
  y: number;
  dx: number;
  dy: number;
  radius: number;
}

interface Paddle {
  x: number;
  y: number;
  width: number;
  height: number;
  targetY: number;
  isVertical: boolean;
}

interface Pixel {
  x: number;
  y: number;
  size: number;
  hit: boolean;
}

interface GameState {
  ball: Ball;
  paddles: Paddle[];
  pixels: Pixel[];
  scale: number;
  trailPoints: TrailPoint[];
}

interface TrailPoint {
  x: number;
  y: number;
  age: number;
  color: string;
}

interface TrailConfig {
  width: number;
  maxLength: number;
  fadeSpeed: number;
  mode: "rainbow" | "gradient" | "pulse";
  ballSize: number;
  ballSpeed: number;
}

// Default trail configuration
const DEFAULT_TRAIL_CONFIG: TrailConfig = {
  width: 1,
  maxLength: 50,
  fadeSpeed: 0.02,
  mode: "rainbow",
  ballSize: 1,
  ballSpeed: 1,
};

interface SettingsPanelProps {
  trailConfig: TrailConfig;
  onModeChange: (mode: "rainbow" | "gradient" | "pulse") => void;
  onLengthChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onFadeSpeedChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onWidthChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBallSizeChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBallSpeedChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onResetDefaults: () => void;
  settingsPanelRef: React.RefObject<HTMLDivElement | null>;
}

function SettingsPanel({
  trailConfig,
  onModeChange,
  onLengthChange,
  onFadeSpeedChange,
  onWidthChange,
  onBallSizeChange,
  onBallSpeedChange,
  onResetDefaults,
  settingsPanelRef,
}: SettingsPanelProps) {
  return (
    <div
      ref={settingsPanelRef}
      className={styles.settingsPanel}
    >
      <h2 className="text-xl font-bold mb-4">Settings</h2>

      <div className="mb-4">
        <h3 className="text-sm font-medium mb-2">Color Mode</h3>
        <div className="flex space-x-1">
          <button
            className={`px-2 py-1 text-xs rounded ${trailConfig.mode === "rainbow" ? "bg-blue-600" : "bg-gray-700"}`}
            onClick={() => onModeChange("rainbow")}
          >
            Rainbow
          </button>
          <button
            className={`px-2 py-1 text-xs rounded ${trailConfig.mode === "gradient" ? "bg-blue-600" : "bg-gray-700"}`}
            onClick={() => onModeChange("gradient")}
          >
            Gradient
          </button>
          <button
            className={`px-2 py-1 text-xs rounded ${trailConfig.mode === "pulse" ? "bg-blue-600" : "bg-gray-700"}`}
            onClick={() => onModeChange("pulse")}
          >
            Pulse
          </button>
        </div>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Ball Size: {trailConfig.ballSize.toFixed(1)}x</label>
        <input
          type="range"
          min="0.5"
          max="2"
          step="0.1"
          value={trailConfig.ballSize}
          onChange={onBallSizeChange}
          className="w-full"
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Ball Speed: {trailConfig.ballSpeed.toFixed(1)}x</label>
        <input
          type="range"
          min="0.5"
          max="10"
          step="0.1"
          value={trailConfig.ballSpeed}
          onChange={onBallSpeedChange}
          className="w-full"
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Trail Length: {trailConfig.maxLength}</label>
        <input
          type="range"
          min="5"
          max="100"
          value={trailConfig.maxLength}
          onChange={onLengthChange}
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
          onChange={onFadeSpeedChange}
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
          onChange={onWidthChange}
          className="w-full"
        />
      </div>

      <button
        onClick={onResetDefaults}
        className="w-full bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded text-sm transition-colors"
      >
        Reset Settings
      </button>
    </div>
  );
}

const styles = {
  gameContainer: `relative w-full h-full`,
  canvas: `fixed top-0 left-0 w-full h-full`,
  gameControls: `fixed top-4 left-4 flex gap-2 z-20`,
  settingsButton: `fixed top-4 right-4 z-10 bg-gray-800 text-white p-2 rounded-full shadow-lg hover:bg-gray-700 transition-colors`,
  // button: `px-4 py-2 bg-white/10 hover:bg-white/20 rounded-md text-white transition-colors`,
  errorContainer: `fixed inset-0 flex flex-col items-center justify-center bg-black/90 text-white p-4`,
  errorHeading: `text-2xl font-bold mb-4`,
  errorMessage: `mb-4`,
  errorButton: `px-6 py-3 bg-white/10 hover:bg-white/20 rounded-md transition-colors`,
  settingsPanel: `fixed top-16 right-4 z-10 bg-gray-900 bg-opacity-90 text-white p-4 rounded-lg shadow-lg w-64`,
};

export function PromptingIsAllYouNeed() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gameStateRef = useRef<GameState>({
    ball: { x: 0, y: 0, dx: 0, dy: 0, radius: 0 },
    paddles: [],
    pixels: [],
    scale: 1,
    trailPoints: [],
  });
  const trailConfigRef = useRef<TrailConfig>({ ...DEFAULT_TRAIL_CONFIG });
  const gameLoopRef = useRef<number | null>(null);
  const settingsPanelRef = useRef<HTMLDivElement>(null);
  const settingsButtonRef = useRef<HTMLButtonElement>(null);
  const initializeGameRef = useRef<() => void>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Handle keyboard controls
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      switch (e.key) {
        case " ":
        case "Escape":
          setIsPaused((prev) => !prev);
          break;
        case "r":
        case "R":
          if (initializeGameRef.current) {
            initializeGameRef.current();
          }
          break;
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, []);

  // Error boundary effect
  useEffect(() => {
    const handleError = (e: ErrorEvent) => {
      setError(e.message);
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current);
      }
    };

    window.addEventListener("error", handleError);
    return () => window.removeEventListener("error", handleError);
  }, []);

  // Clean up game loop on unmount
  useEffect(() => {
    return () => {
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current);
      }
    };
  }, []);

  // Use state for trail configuration to make it reactive with UI
  const [trailConfig, setTrailConfig] = useState<TrailConfig>({ ...DEFAULT_TRAIL_CONFIG });

  // State for settings panel visibility
  const [showSettings, setShowSettings] = useState(false);

  // Helper function to calculate common scaling values
  const calculateScalingValues = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return null;

    const scale = gameStateRef.current.scale;
    const LARGE_PIXEL_SIZE = 8 * scale;
    const SMALL_PIXEL_SIZE = 4 * scale;

    // Calculate total width for scaling
    const words = ["CEM", "IS ALL YOU NEED"];
    const calculateWordWidth = (word: string, pixelSize: number) => {
      return (
        word.split("").reduce((width, letter) => {
          const letterWidth = PIXEL_MAP[letter as keyof typeof PIXEL_MAP]?.[0]?.length ?? 0;
          return width + letterWidth * pixelSize + GAME_CONFIG.spacing.letter * pixelSize;
        }, 0) -
        GAME_CONFIG.spacing.letter * pixelSize
      );
    };

    const totalWidthLarge = calculateWordWidth(words[0], LARGE_PIXEL_SIZE);
    const totalWidthSmall = words[1].split(" ").reduce((width, word, index) => {
      return (
        width +
        calculateWordWidth(word, SMALL_PIXEL_SIZE) +
        (index > 0 ? GAME_CONFIG.spacing.word * SMALL_PIXEL_SIZE : 0)
      );
    }, 0);
    const totalWidth = Math.max(totalWidthLarge, totalWidthSmall);
    const scaleFactor = (canvas.width * 0.8) / totalWidth;

    const adjustedLargePixelSize = LARGE_PIXEL_SIZE * scaleFactor;
    const adjustedSmallPixelSize = SMALL_PIXEL_SIZE * scaleFactor;

    // Calculate base ball speed using adjusted pixel size for consistency
    const BASE_BALL_SPEED = adjustedLargePixelSize * 0.2;

    return {
      scale,
      LARGE_PIXEL_SIZE,
      SMALL_PIXEL_SIZE,
      scaleFactor,
      adjustedLargePixelSize,
      adjustedSmallPixelSize,
      BALL_SPEED: BASE_BALL_SPEED,
    };
  }, []);

  const getTrailColor = useCallback((age: number, mode: "rainbow" | "gradient" | "pulse"): string => {
    const opacity = Math.max(0.2, 1 - age);

    if (mode === "rainbow") {
      const hue = (Date.now() / 20 + age * 50) % 360;
      return `hsla(${hue}, 100%, 60%, ${opacity})`;
    } else if (mode === "gradient") {
      return `rgba(255, ${Math.floor(255 * (1 - age))}, ${Math.floor(255 * age)}, ${opacity})`;
    } else if (mode === "pulse") {
      // Pulse mode
      const intensity = (Math.sin(Date.now() / 300) + 1) / 2;
      return `rgba(255, ${Math.floor(100 + 155 * intensity)}, ${Math.floor(100 + 155 * (1 - intensity))}, ${opacity})`;
    }

    // Default fallback
    return `rgba(255, 255, 255, ${opacity})`;
  }, []);

  // Update the ref when state changes
  useEffect(() => {
    trailConfigRef.current = trailConfig;

    // Update ball radius and speed when settings change
    const scaling = calculateScalingValues();
    if (gameStateRef.current.ball && scaling) {
      gameStateRef.current.ball.radius = (scaling.adjustedLargePixelSize / 2) * trailConfig.ballSize;

      // Use the same base speed calculation as initialization
      const currentSpeed = scaling.BALL_SPEED * trailConfig.ballSpeed;

      // Maintain direction while updating speed
      const dx = gameStateRef.current.ball.dx;
      const dy = gameStateRef.current.ball.dy;
      const currentMagnitude = Math.sqrt(dx * dx + dy * dy);
      if (currentMagnitude > 0) {
        // Prevent division by zero
        gameStateRef.current.ball.dx = (dx / currentMagnitude) * currentSpeed;
        gameStateRef.current.ball.dy = (dy / currentMagnitude) * currentSpeed;
      }
    }
  }, [trailConfig, calculateScalingValues]);

  // Move functions outside useEffect
  const initializeGame = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const scaling = calculateScalingValues();
    if (!scaling) return;

    // Clear existing pixels and trail
    gameStateRef.current.pixels = [];
    gameStateRef.current.trailPoints = [];

    const words = ["CEM", "IS ALL YOU NEED"];

    const calculateWordWidth = (word: string, pixelSize: number) => {
      return (
        word.split("").reduce((width, letter) => {
          const letterWidth = PIXEL_MAP[letter as keyof typeof PIXEL_MAP]?.[0]?.length ?? 0;
          return width + letterWidth * pixelSize + GAME_CONFIG.spacing.letter * pixelSize;
        }, 0) -
        GAME_CONFIG.spacing.letter * pixelSize
      );
    };

    const largeTextHeight = 5 * scaling.adjustedLargePixelSize;
    const smallTextHeight = 5 * scaling.adjustedSmallPixelSize;
    const spaceBetweenLines = 5 * scaling.adjustedLargePixelSize;
    const totalTextHeight = largeTextHeight + spaceBetweenLines + smallTextHeight;

    let startY = (canvas.height - totalTextHeight) / 2;

    words.forEach((word, wordIndex) => {
      const pixelSize = wordIndex === 0 ? scaling.adjustedLargePixelSize : scaling.adjustedSmallPixelSize;
      const totalWidth =
        wordIndex === 0
          ? calculateWordWidth(word, scaling.adjustedLargePixelSize)
          : words[1].split(" ").reduce((width, w, index) => {
              return (
                width +
                calculateWordWidth(w, scaling.adjustedSmallPixelSize) +
                (index > 0 ? GAME_CONFIG.spacing.word * scaling.adjustedSmallPixelSize : 0)
              );
            }, 0);

      let startX = (canvas.width - totalWidth) / 2;

      if (wordIndex === 1) {
        word.split(" ").forEach((subWord) => {
          subWord.split("").forEach((letter) => {
            const pixelMap = PIXEL_MAP[letter as keyof typeof PIXEL_MAP];
            if (!pixelMap) return;

            for (let i = 0; i < pixelMap.length; i++) {
              for (let j = 0; j < pixelMap[i].length; j++) {
                if (pixelMap[i][j]) {
                  const x = startX + j * pixelSize;
                  const y = startY + i * pixelSize;
                  gameStateRef.current.pixels.push({ x, y, size: pixelSize, hit: false });
                }
              }
            }
            startX += (pixelMap[0].length + GAME_CONFIG.spacing.letter) * pixelSize;
          });
          startX += GAME_CONFIG.spacing.word * scaling.adjustedSmallPixelSize;
        });
      } else {
        word.split("").forEach((letter) => {
          const pixelMap = PIXEL_MAP[letter as keyof typeof PIXEL_MAP];
          if (!pixelMap) return;

          for (let i = 0; i < pixelMap.length; i++) {
            for (let j = 0; j < pixelMap[i].length; j++) {
              if (pixelMap[i][j]) {
                const x = startX + j * pixelSize;
                const y = startY + i * pixelSize;
                gameStateRef.current.pixels.push({ x, y, size: pixelSize, hit: false });
              }
            }
          }
          startX += (pixelMap[0].length + GAME_CONFIG.spacing.letter) * pixelSize;
        });
      }
      startY += wordIndex === 0 ? largeTextHeight + spaceBetweenLines : 0;
    });

    // Initialize ball position near the top right corner
    const ballStartX = canvas.width * 0.9;
    const ballStartY = canvas.height * 0.1;

    gameStateRef.current.ball = {
      x: ballStartX,
      y: ballStartY,
      dx: -scaling.BALL_SPEED * trailConfigRef.current.ballSpeed,
      dy: scaling.BALL_SPEED * trailConfigRef.current.ballSpeed,
      radius: (scaling.adjustedLargePixelSize / 2) * trailConfigRef.current.ballSize,
    };

    const paddleWidth = scaling.adjustedLargePixelSize;
    const paddleLength = 10 * scaling.adjustedLargePixelSize;

    gameStateRef.current.paddles = [
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
    ];
  }, [calculateScalingValues]);

  const updateGame = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ball = gameStateRef.current.ball;
    const paddles = gameStateRef.current.paddles;
    const config = trailConfigRef.current;

    ball.x += ball.dx;
    ball.y += ball.dy;

    // Add new point to trail
    gameStateRef.current.trailPoints.push({
      x: ball.x,
      y: ball.y,
      age: 0,
      color: getTrailColor(0, config.mode),
    });

    // Update age of existing trail points
    gameStateRef.current.trailPoints.forEach((point) => {
      point.age += config.fadeSpeed;
    });

    // Remove old trail points
    gameStateRef.current.trailPoints = gameStateRef.current.trailPoints
      .filter((point) => point.age < 1)
      .slice(0, config.maxLength);

    if (ball.y - ball.radius < 0 || ball.y + ball.radius > canvas.height) {
      ball.dy = -ball.dy;
    }
    if (ball.x - ball.radius < 0 || ball.x + ball.radius > canvas.width) {
      ball.dx = -ball.dx;
    }

    paddles.forEach((paddle) => {
      if (paddle.isVertical) {
        if (
          ball.x - ball.radius < paddle.x + paddle.width &&
          ball.x + ball.radius > paddle.x &&
          ball.y > paddle.y &&
          ball.y < paddle.y + paddle.height
        ) {
          ball.dx = -ball.dx;
        }
      } else {
        if (
          ball.y - ball.radius < paddle.y + paddle.height &&
          ball.y + ball.radius > paddle.y &&
          ball.x > paddle.x &&
          ball.x < paddle.x + paddle.width
        ) {
          ball.dy = -ball.dy;
        }
      }
    });

    paddles.forEach((paddle) => {
      if (paddle.isVertical) {
        paddle.targetY = ball.y - paddle.height / 2;
        paddle.targetY = Math.max(0, Math.min(canvas.height - paddle.height, paddle.targetY));
        paddle.y += (paddle.targetY - paddle.y) * 0.1;
      } else {
        paddle.targetY = ball.x - paddle.width / 2;
        paddle.targetY = Math.max(0, Math.min(canvas.width - paddle.width, paddle.targetY));
        paddle.x += (paddle.targetY - paddle.x) * 0.1;
      }
    });

    gameStateRef.current.pixels.forEach((pixel) => {
      if (
        !pixel.hit &&
        ball.x + ball.radius > pixel.x &&
        ball.x - ball.radius < pixel.x + pixel.size &&
        ball.y + ball.radius > pixel.y &&
        ball.y - ball.radius < pixel.y + pixel.size
      ) {
        pixel.hit = true;
        const centerX = pixel.x + pixel.size / 2;
        const centerY = pixel.y + pixel.size / 2;
        if (Math.abs(ball.x - centerX) > Math.abs(ball.y - centerY)) {
          ball.dx = -ball.dx;
        } else {
          ball.dy = -ball.dy;
        }
      }
    });
  }, [getTrailColor]);

  const drawGame = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!ctx || !canvas) return;

    ctx.fillStyle = GAME_CONFIG.colors.background;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw trail - draw in reverse order so newest points appear on top
    const config = trailConfigRef.current;
    for (let i = gameStateRef.current.trailPoints.length - 1; i >= 0; i--) {
      const point = gameStateRef.current.trailPoints[i];
      const size = gameStateRef.current.ball.radius * (1 - point.age * 0.7);
      ctx.fillStyle = point.color;
      ctx.beginPath();
      ctx.arc(point.x, point.y, size * config.width, 0, Math.PI * 2);
      ctx.fill();
    }

    gameStateRef.current.pixels.forEach((pixel) => {
      ctx.fillStyle = pixel.hit ? GAME_CONFIG.colors.hit : GAME_CONFIG.colors.default;
      ctx.fillRect(pixel.x, pixel.y, pixel.size, pixel.size);
    });

    ctx.fillStyle = GAME_CONFIG.colors.ball;
    ctx.beginPath();
    ctx.arc(gameStateRef.current.ball.x, gameStateRef.current.ball.y, gameStateRef.current.ball.radius, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = GAME_CONFIG.colors.paddle;
    gameStateRef.current.paddles.forEach((paddle) => {
      ctx.fillRect(paddle.x, paddle.y, paddle.width, paddle.height);
    });
  }, []);

  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    gameStateRef.current.scale = Math.min(canvas.width / 1000, canvas.height / 1000);
    initializeGame();
  }, [initializeGame]);

  // Store initializeGame in ref for UI access
  useEffect(() => {
    initializeGameRef.current = initializeGame;
  }, [initializeGame]);

  // Initial setup effect
  useEffect(() => {
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    return () => {
      window.removeEventListener("resize", resizeCanvas);
    };
  }, [resizeCanvas]);

  // Main game effect
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      setError("Canvas context not available");
      return;
    }

    const ctx = canvas.getContext("2d");
    if (!ctx) {
      setError("2D rendering context not available");
      return;
    }

    const gameLoop = () => {
      if (!isPaused) {
        updateGame();
      }
      drawGame();
      gameLoopRef.current = requestAnimationFrame(gameLoop);
    };

    // Handle clicks outside the settings panel
    const handleClickOutside = (event: MouseEvent) => {
      if (
        showSettings &&
        settingsPanelRef.current &&
        settingsButtonRef.current &&
        !settingsPanelRef.current.contains(event.target as Node) &&
        !settingsButtonRef.current.contains(event.target as Node)
      ) {
        setShowSettings(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    // Start the game loop
    gameLoopRef.current = requestAnimationFrame(gameLoop);

    // Cleanup
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current);
      }
    };
  }, [isPaused, showSettings, updateGame, drawGame]);

  // Handler functions for trail configuration changes
  const handleModeChange = (mode: "rainbow" | "gradient" | "pulse") => {
    setTrailConfig((prev) => ({ ...prev, mode }));
  };

  const handleLengthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number.parseInt(e.target.value);
    setTrailConfig((prev) => ({ ...prev, maxLength: value }));
  };

  const handleFadeSpeedChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number.parseFloat(e.target.value);
    setTrailConfig((prev) => ({ ...prev, fadeSpeed: value }));
  };

  const handleWidthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number.parseFloat(e.target.value);
    setTrailConfig((prev) => ({ ...prev, width: value }));
  };

  const handleBallSizeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number.parseFloat(e.target.value);
    setTrailConfig((prev) => ({ ...prev, ballSize: value }));
  };

  const handleBallSpeedChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number.parseFloat(e.target.value);
    setTrailConfig((prev) => ({ ...prev, ballSpeed: value }));
  };

  const handleResetDefaults = () => {
    setTrailConfig({ ...DEFAULT_TRAIL_CONFIG });
  };

  const handleResetGame = () => {
    if (initializeGameRef.current) {
      initializeGameRef.current();
    }
  };

  if (error) {
    return (
      <div
        role="alert"
        className={styles.errorContainer}
      >
        <h2 className={styles.errorHeading}>An error occurred</h2>
        <p className={styles.errorMessage}>{error}</p>
        <button
          className={styles.errorButton}
          onClick={() => window.location.reload()}
        >
          Reload Game
        </button>
      </div>
    );
  }

  return (
    <div className={styles.gameContainer}>
      <canvas
        ref={canvasRef}
        className={styles.canvas}
        role="img"
        aria-label="Prompting game canvas"
        tabIndex={0}
      />
      <div
        className={styles.gameControls}
        role="group"
        aria-label="Game controls"
      >
        <Button
          variant="destructive"
          size={"sm"}
          onClick={() => initializeGameRef.current?.()}
          aria-label="Reset game"
        >
          Reset
        </Button>
        <Button
          variant="outline"
          size={"sm"}
          onClick={() => setIsPaused((prev) => !prev)}
          aria-label={isPaused ? "Resume game" : "Pause game"}
        >
          {isPaused ? "Resume" : "Pause"}
        </Button>
      </div>
      <Button
        ref={settingsButtonRef}
        variant={"default"}
        size={"icon"}
        className={styles.settingsButton}
        onClick={() => setShowSettings(!showSettings)}
        aria-label={showSettings ? "Close settings" : "Open settings"}
      >
        <SettingsIcon className="h-6 w-6" />
      </Button>

      {showSettings && (
        <SettingsPanel
          trailConfig={trailConfig}
          onModeChange={handleModeChange}
          onLengthChange={handleLengthChange}
          onFadeSpeedChange={handleFadeSpeedChange}
          onWidthChange={handleWidthChange}
          onBallSizeChange={handleBallSizeChange}
          onBallSpeedChange={handleBallSpeedChange}
          onResetDefaults={handleResetDefaults}
          settingsPanelRef={settingsPanelRef}
        />
      )}
    </div>
  );
}

export default PromptingIsAllYouNeed;
