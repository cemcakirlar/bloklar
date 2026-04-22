import type React from "react";

import { useEffect, useRef, useState, useCallback } from "react";
import { Button } from "./components/ui/button";
import { GameSettingsPanel } from "./components/game-settings-panel";
import { SettingsIcon } from "lucide-react";
import {
  DEFAULT_TRAIL_CONFIG,
  MAX_FIRST_LINE_LENGTH,
  MAX_SECOND_LINE_LENGTH,
  sanitizeDisplayText,
  type ParticleQuality,
  type TrailConfig,
  type TrailMode,
} from "@/lib/game/trail-config";

// Types for game configuration and state
type PixelRow = (0 | 1)[];
type LetterMatrix = PixelRow[];
type PixelMap = Record<string, LetterMatrix>;

interface Particle {
  kind: "spark" | "dust";
  x: number;
  y: number;
  dx: number;
  dy: number;
  size: number;
  baseSize: number;
  life: number;
  maxLife: number;
  color: string;
  drag: number;
  gravity: number;
  lifeDecay: number;
}

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

const PARTICLE_QUALITY_MULTIPLIER: Record<ParticleQuality, number> = {
  medium: 0.8,
  high: 1,
  ultra: 1.25,
};

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

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
  B: [
    [1, 1, 1, 1],
    [1, 0, 0, 1],
    [1, 1, 1, 1],
    [1, 0, 0, 1],
    [1, 1, 1, 1],
  ],
  F: [
    [1, 1, 1, 1],
    [1, 0, 0, 0],
    [1, 1, 1, 0],
    [1, 0, 0, 0],
    [1, 0, 0, 0],
  ],
  H: [
    [1, 0, 0, 1],
    [1, 0, 0, 1],
    [1, 1, 1, 1],
    [1, 0, 0, 1],
    [1, 0, 0, 1],
  ],
  J: [
    [0, 0, 1, 1],
    [0, 0, 0, 1],
    [0, 0, 0, 1],
    [1, 0, 0, 1],
    [0, 1, 1, 0],
  ],
  K: [
    [1, 0, 0, 1],
    [1, 0, 1, 0],
    [1, 1, 0, 0],
    [1, 0, 1, 0],
    [1, 0, 0, 1],
  ],
  Q: [
    [1, 1, 1, 1],
    [1, 0, 0, 1],
    [1, 0, 0, 1],
    [1, 0, 1, 1],
    [1, 1, 1, 1],
  ],
  V: [
    [1, 0, 0, 1],
    [1, 0, 0, 1],
    [1, 0, 0, 1],
    [0, 1, 1, 0],
    [0, 0, 0, 0],
  ],
  W: [
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [1, 0, 1, 0, 1],
    [1, 1, 0, 1, 1],
    [1, 0, 0, 0, 1],
  ],
  X: [
    [1, 0, 0, 1],
    [0, 1, 1, 0],
    [0, 1, 1, 0],
    [0, 1, 1, 0],
    [1, 0, 0, 1],
  ],
  Z: [
    [1, 1, 1, 1],
    [0, 0, 1, 0],
    [0, 1, 0, 0],
    [1, 0, 0, 0],
    [1, 1, 1, 1],
  ],
  "0": [
    [0, 1, 1, 0],
    [1, 0, 0, 1],
    [1, 0, 0, 1],
    [1, 0, 0, 1],
    [0, 1, 1, 0],
  ],
  "1": [
    [0, 1, 1, 0],
    [0, 0, 1, 0],
    [0, 0, 1, 0],
    [0, 0, 1, 0],
    [0, 1, 1, 1],
  ],
  "2": [
    [1, 1, 1, 0],
    [0, 0, 0, 1],
    [0, 1, 1, 0],
    [1, 0, 0, 0],
    [1, 1, 1, 1],
  ],
  "3": [
    [1, 1, 1, 0],
    [0, 0, 0, 1],
    [0, 1, 1, 0],
    [0, 0, 0, 1],
    [1, 1, 1, 0],
  ],
  "4": [
    [1, 0, 0, 1],
    [1, 0, 0, 1],
    [1, 1, 1, 1],
    [0, 0, 0, 1],
    [0, 0, 0, 1],
  ],
  "5": [
    [1, 1, 1, 1],
    [1, 0, 0, 0],
    [1, 1, 1, 0],
    [0, 0, 0, 1],
    [1, 1, 1, 0],
  ],
  "6": [
    [0, 1, 1, 0],
    [1, 0, 0, 0],
    [1, 1, 1, 0],
    [1, 0, 0, 1],
    [0, 1, 1, 0],
  ],
  "7": [
    [1, 1, 1, 1],
    [0, 0, 0, 1],
    [0, 0, 1, 0],
    [0, 1, 0, 0],
    [0, 1, 0, 0],
  ],
  "8": [
    [0, 1, 1, 0],
    [1, 0, 0, 1],
    [0, 1, 1, 0],
    [1, 0, 0, 1],
    [0, 1, 1, 0],
  ],
  "9": [
    [0, 1, 1, 0],
    [1, 0, 0, 1],
    [0, 1, 1, 1],
    [0, 0, 0, 1],
    [0, 1, 1, 0],
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
  particles: Particle[];
}

interface TrailPoint {
  x: number;
  y: number;
  age: number;
  color: string;
}

const styles = {
  gameContainer: `relative w-full h-full`,
  canvas: `fixed top-0 left-0 w-full h-full`,
  gameControls: `fixed top-4 left-4 flex gap-2 z-20`,
  settingsButton: `fixed top-4 right-4 z-10 bg-gray-800 text-white p-2 rounded-full shadow-lg hover:bg-gray-700 transition-colors`,
  errorContainer: `fixed inset-0 flex flex-col items-center justify-center bg-black/90 text-white p-4`,
  errorHeading: `text-2xl font-bold mb-4`,
  errorMessage: `mb-4`,
  errorButton: `px-6 py-3 bg-white/10 hover:bg-white/20 rounded-md transition-colors`,
};

function PromptingIsAllYouNeed() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gameStateRef = useRef<GameState>({
    ball: { x: 0, y: 0, dx: 0, dy: 0, radius: 0 },
    paddles: [],
    pixels: [],
    scale: 1,
    trailPoints: [],
    particles: [],
  });
  const trailConfigRef = useRef<TrailConfig>({ ...DEFAULT_TRAIL_CONFIG });
  const gameLoopRef = useRef<number | null>(null);
  const settingsPanelRef = useRef<HTMLDivElement>(null);
  const settingsButtonRef = useRef<HTMLButtonElement>(null);
  const initializeGameRef = useRef<() => void>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState("Game running");

  // Initialize trail config with URL parameters if they exist
  const [trailConfig, setTrailConfig] = useState<TrailConfig>(() => {
    const params = new URLSearchParams(window.location.search);
    const firstLine = sanitizeDisplayText(
      params.get("first") || DEFAULT_TRAIL_CONFIG.firstLineText,
      DEFAULT_TRAIL_CONFIG.firstLineText,
      MAX_FIRST_LINE_LENGTH,
    );
    const secondLine = sanitizeDisplayText(
      params.get("second") || DEFAULT_TRAIL_CONFIG.secondLineText,
      DEFAULT_TRAIL_CONFIG.secondLineText,
      MAX_SECOND_LINE_LENGTH,
    );

    return {
      ...DEFAULT_TRAIL_CONFIG,
      firstLineText: firstLine,
      secondLineText: secondLine,
    };
  });

  // Update URL when text changes
  const updateURL = useCallback((first: string, second: string) => {
    const url = new URL(window.location.href);
    url.searchParams.set("first", first);
    url.searchParams.set("second", second);
    window.history.replaceState({}, "", url.toString());
  }, []);

  // Handle keyboard controls
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      const target = e.target;
      if (target instanceof HTMLElement) {
        const tagName = target.tagName;
        if (
          tagName === "INPUT" ||
          tagName === "TEXTAREA" ||
          tagName === "SELECT" ||
          target.isContentEditable
        ) {
          return;
        }
      }

      switch (e.key) {
        case " ":
        case "Escape":
          e.preventDefault();
          setIsPaused((prev) => {
            const next = !prev;
            setStatusMessage(next ? "Game paused" : "Game resumed");
            return next;
          });
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
    const words = [trailConfigRef.current.firstLineText, trailConfigRef.current.secondLineText];
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

  const getTrailColor = useCallback(
    (age: number, mode: "rainbow" | "gradient" | "pulse"): string => {
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
    },
    [],
  );

  // Update the ref when state changes
  useEffect(() => {
    trailConfigRef.current = trailConfig;

    // Update ball radius and speed when settings change
    const scaling = calculateScalingValues();
    if (gameStateRef.current.ball && scaling) {
      gameStateRef.current.ball.radius =
        (scaling.adjustedLargePixelSize / 2) * trailConfig.ballSize;

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

    const words = [trailConfigRef.current.firstLineText, trailConfigRef.current.secondLineText];

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
      const pixelSize =
        wordIndex === 0 ? scaling.adjustedLargePixelSize : scaling.adjustedSmallPixelSize;
      const totalWidth =
        wordIndex === 0
          ? word.split(" ").reduce((width, w, index) => {
              return (
                width +
                calculateWordWidth(w, scaling.adjustedLargePixelSize) +
                (index > 0 ? GAME_CONFIG.spacing.word * scaling.adjustedLargePixelSize : 0)
              );
            }, 0)
          : words[1].split(" ").reduce((width, w, index) => {
              return (
                width +
                calculateWordWidth(w, scaling.adjustedSmallPixelSize) +
                (index > 0 ? GAME_CONFIG.spacing.word * scaling.adjustedSmallPixelSize : 0)
              );
            }, 0);

      let startX = (canvas.width - totalWidth) / 2;

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
        startX +=
          GAME_CONFIG.spacing.word *
          (wordIndex === 0 ? scaling.adjustedLargePixelSize : scaling.adjustedSmallPixelSize);
      });

      startY += wordIndex === 0 ? largeTextHeight + spaceBetweenLines : 0;
    });

    // Initialize ball position with random location along the edges
    const randomEdge = Math.floor(Math.random() * 4); // 0: top, 1: right, 2: bottom, 3: left
    let ballStartX, ballStartY;

    switch (randomEdge) {
      case 0: // top edge
        ballStartX = canvas.width * (0.2 + Math.random() * 0.6); // 20% to 80% of width
        ballStartY = canvas.height * 0.1;
        break;
      case 1: // right edge
        ballStartX = canvas.width * 0.9;
        ballStartY = canvas.height * (0.2 + Math.random() * 0.6);
        break;
      case 2: // bottom edge
        ballStartX = canvas.width * (0.2 + Math.random() * 0.6);
        ballStartY = canvas.height * 0.9;
        break;
      default: // left edge
        ballStartX = canvas.width * 0.1;
        ballStartY = canvas.height * (0.2 + Math.random() * 0.6);
        break;
    }

    // Generate random angle between -45 and 45 degrees from the perpendicular to the edge
    const baseAngle = (randomEdge * 90 + 90) * (Math.PI / 180); // Convert to radians
    const randomAngle = baseAngle + (Math.random() * 90 - 45) * (Math.PI / 180);

    const speed = scaling.BALL_SPEED * trailConfigRef.current.ballSpeed;
    const dx = Math.cos(randomAngle) * speed;
    const dy = Math.sin(randomAngle) * speed;

    gameStateRef.current.ball = {
      x: ballStartX,
      y: ballStartY,
      dx: dx,
      dy: dy,
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

  const createExplosion = useCallback(
    (x: number, y: number, size: number, vx: number, vy: number) => {
      const config = trailConfigRef.current;
      const qualityMultiplier = PARTICLE_QUALITY_MULTIPLIER[config.particleQuality];
      const speed = Math.hypot(vx, vy);
      const energy = clamp(speed / 6, 0.8, 2.2) * config.particleIntensity;
      const direction = Math.atan2(vy, vx);
      const coneSpread = Math.PI * (0.5 + Math.random() * 0.2);
      const sparkCount = Math.round((9 + Math.random() * 6) * energy * qualityMultiplier);
      const dustCount = Math.round((7 + Math.random() * 5) * energy * qualityMultiplier);
      const particles: Particle[] = [];

      const sparkColors = ["#FFE8B6", "#FFD27A", "#FFB347", "#FF9234", "#FF6B35"];
      const dustColors = ["#E0D6C5", "#D2C2A8", "#BDAE97", "#9E907E"];

      for (let i = 0; i < sparkCount; i++) {
        const angle = direction + (Math.random() - 0.5) * coneSpread;
        const sparkSpeed = (2.6 + Math.random() * 3.8) * energy;
        const baseSize = (size * (0.26 + Math.random() * 0.22)) / 2;
        particles.push({
          kind: "spark",
          x: x + (Math.random() - 0.5) * (size * 0.25),
          y: y + (Math.random() - 0.5) * (size * 0.25),
          dx: Math.cos(angle) * sparkSpeed,
          dy: Math.sin(angle) * sparkSpeed,
          size: baseSize,
          baseSize,
          life: 1,
          maxLife: 1,
          color: sparkColors[Math.floor(Math.random() * sparkColors.length)],
          drag: 0.985,
          gravity: 0.05 + Math.random() * 0.03,
          lifeDecay: 0.024 + Math.random() * 0.018,
        });
      }

      for (let i = 0; i < dustCount; i++) {
        const angle = direction + (Math.random() - 0.5) * (coneSpread * 1.25);
        const dustSpeed = (0.9 + Math.random() * 1.7) * energy;
        const baseSize = (size * (0.32 + Math.random() * 0.28)) / 2;
        particles.push({
          kind: "dust",
          x: x + (Math.random() - 0.5) * (size * 0.35),
          y: y + (Math.random() - 0.5) * (size * 0.35),
          dx: Math.cos(angle) * dustSpeed * 0.85,
          dy: Math.sin(angle) * dustSpeed - (0.18 + Math.random() * 0.2),
          size: baseSize,
          baseSize,
          life: 1,
          maxLife: 1,
          color: dustColors[Math.floor(Math.random() * dustColors.length)],
          drag: 0.95,
          gravity: 0.014 + Math.random() * 0.015,
          lifeDecay: 0.011 + Math.random() * 0.007,
        });
      }

      const currentParticles = gameStateRef.current.particles;
      const room = Math.max(0, config.maxParticles - currentParticles.length);
      if (room <= 0) return;
      if (particles.length <= room) {
        currentParticles.push(...particles);
      } else {
        currentParticles.push(...particles.slice(0, room));
      }
    },
    [],
  );

  const updateParticles = useCallback(() => {
    const maxParticles = trailConfigRef.current.maxParticles;
    if (gameStateRef.current.particles.length > maxParticles) {
      gameStateRef.current.particles = gameStateRef.current.particles.slice(-maxParticles);
    }

    gameStateRef.current.particles = gameStateRef.current.particles.filter((particle) => {
      particle.dx *= particle.drag;
      particle.dy = particle.dy * particle.drag + particle.gravity;
      if (particle.kind === "dust") {
        particle.dy -= 0.01;
      }

      particle.x += particle.dx;
      particle.y += particle.dy;

      particle.life -= particle.lifeDecay;
      const lifeRatio = clamp(particle.life / particle.maxLife, 0, 1);
      if (particle.kind === "spark") {
        particle.size = particle.baseSize * (0.65 + lifeRatio * 0.75);
      } else {
        particle.size = particle.baseSize * (0.9 + (1 - lifeRatio) * 0.45);
      }

      return particle.life > 0;
    });
  }, []);

  const updateGame = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ball = gameStateRef.current.ball;
    const paddles = gameStateRef.current.paddles;
    const config = trailConfigRef.current;

    // Update particles
    updateParticles();

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
        // Create explosion effect when pixel is hit only if particle effects are enabled
        if (trailConfigRef.current.particleEffects) {
          createExplosion(
            pixel.x + pixel.size / 2,
            pixel.y + pixel.size / 2,
            pixel.size,
            ball.dx,
            ball.dy,
          );
        }

        const centerX = pixel.x + pixel.size / 2;
        const centerY = pixel.y + pixel.size / 2;
        if (Math.abs(ball.x - centerX) > Math.abs(ball.y - centerY)) {
          ball.dx = -ball.dx;
        } else {
          ball.dy = -ball.dy;
        }
      }
    });
  }, [createExplosion, updateParticles, getTrailColor]);

  const drawGame = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!ctx || !canvas) return;

    ctx.fillStyle = GAME_CONFIG.colors.background;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const particles = gameStateRef.current.particles;
    const sparks = particles.filter((particle) => particle.kind === "spark");
    const dust = particles.filter((particle) => particle.kind === "dust");

    ctx.globalCompositeOperation = "lighter";
    sparks.forEach((particle) => {
      const lifeRatio = clamp(particle.life / particle.maxLife, 0, 1);
      ctx.fillStyle = particle.color;
      ctx.globalAlpha = 0.2 + lifeRatio * 0.8;
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.size * (0.6 + lifeRatio), 0, Math.PI * 2);
      ctx.fill();
    });

    ctx.globalCompositeOperation = "source-over";
    dust.forEach((particle) => {
      const lifeRatio = clamp(particle.life / particle.maxLife, 0, 1);
      ctx.fillStyle = particle.color;
      ctx.globalAlpha = 0.14 + lifeRatio * 0.3;
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.globalAlpha = 1;

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
    ctx.arc(
      gameStateRef.current.ball.x,
      gameStateRef.current.ball.y,
      gameStateRef.current.ball.radius,
      0,
      Math.PI * 2,
    );
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

    document.addEventListener("pointerdown", handleClickOutside);

    // Start the game loop
    gameLoopRef.current = requestAnimationFrame(gameLoop);

    // Cleanup
    return () => {
      document.removeEventListener("pointerdown", handleClickOutside);
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current);
      }
    };
  }, [isPaused, showSettings, updateGame, drawGame]);

  // Handler functions for trail configuration changes
  const handleModeChange = (mode: TrailMode) => {
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

  const handleFirstLineTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = sanitizeDisplayText(
      e.target.value,
      DEFAULT_TRAIL_CONFIG.firstLineText,
      MAX_FIRST_LINE_LENGTH,
    );
    setTrailConfig((prev) => ({ ...prev, firstLineText: value }));
  };

  const handleSecondLineTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = sanitizeDisplayText(
      e.target.value,
      DEFAULT_TRAIL_CONFIG.secondLineText,
      MAX_SECOND_LINE_LENGTH,
    );
    setTrailConfig((prev) => ({ ...prev, secondLineText: value }));
  };

  const handleParticleEffectsChange = (enabled: boolean) => {
    setTrailConfig((prev) => ({ ...prev, particleEffects: enabled }));
  };

  const handleParticleIntensityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number.parseFloat(e.target.value);
    setTrailConfig((prev) => ({ ...prev, particleIntensity: value }));
  };

  const handleParticleQualityChange = (particleQuality: ParticleQuality) => {
    setTrailConfig((prev) => {
      const nextMaxParticles =
        particleQuality === "ultra"
          ? Math.max(prev.maxParticles, 800)
          : particleQuality === "high"
            ? Math.max(prev.maxParticles, 650)
            : Math.min(prev.maxParticles, 500);
      return { ...prev, particleQuality, maxParticles: nextMaxParticles };
    });
  };

  const handleApplyText = useCallback(() => {
    if (initializeGameRef.current) {
      updateURL(trailConfig.firstLineText, trailConfig.secondLineText);
      initializeGameRef.current();
      setStatusMessage("Display text updated");
    }
  }, [trailConfig.firstLineText, trailConfig.secondLineText, updateURL]);

  const handleResetDefaults = () => {
    setTrailConfig({ ...DEFAULT_TRAIL_CONFIG });
    updateURL(DEFAULT_TRAIL_CONFIG.firstLineText, DEFAULT_TRAIL_CONFIG.secondLineText);
    if (initializeGameRef.current) {
      initializeGameRef.current();
    }
    setStatusMessage("Settings reset to defaults");
  };

  if (error) {
    return (
      <div role="alert" className={styles.errorContainer}>
        <h2 className={styles.errorHeading}>An error occurred</h2>
        <p className={styles.errorMessage}>{error}</p>
        <p className="mb-6 max-w-md text-center text-sm text-gray-300">
          A rendering error interrupted the game loop. Reloading restores the simulation and keeps
          the current URL-based text configuration.
        </p>
        <button className={styles.errorButton} onClick={() => window.location.reload()}>
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
      <p className="sr-only" aria-live="polite">
        {statusMessage}
      </p>
      <p className="sr-only">Keyboard shortcuts: Space or Escape to pause, R to reset game.</p>
      <div className={styles.gameControls} role="group" aria-label="Game controls">
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
          onClick={() =>
            setIsPaused((prev) => {
              const next = !prev;
              setStatusMessage(next ? "Game paused" : "Game resumed");
              return next;
            })
          }
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
        onClick={() =>
          setShowSettings((prev) => {
            const next = !prev;
            setStatusMessage(next ? "Settings opened" : "Settings closed");
            return next;
          })
        }
        aria-label={showSettings ? "Close settings" : "Open settings"}
      >
        <SettingsIcon className="h-6 w-6" />
      </Button>

      {showSettings && (
        <GameSettingsPanel
          trailConfig={trailConfig}
          onModeChange={handleModeChange}
          onLengthChange={handleLengthChange}
          onFadeSpeedChange={handleFadeSpeedChange}
          onWidthChange={handleWidthChange}
          onBallSizeChange={handleBallSizeChange}
          onBallSpeedChange={handleBallSpeedChange}
          onFirstLineTextChange={handleFirstLineTextChange}
          onSecondLineTextChange={handleSecondLineTextChange}
          onParticleEffectsChange={handleParticleEffectsChange}
          onParticleIntensityChange={handleParticleIntensityChange}
          onParticleQualityChange={handleParticleQualityChange}
          onApplyText={handleApplyText}
          onResetDefaults={handleResetDefaults}
          settingsPanelRef={settingsPanelRef}
        />
      )}
    </div>
  );
}

export function PromptingGame() {
  return <PromptingIsAllYouNeed />;
}
