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
import {
  DEFAULT_GAME_SPACING,
  layoutTextPixels,
  type Pixel,
} from "@/lib/game/pixel-matrix";
import {
  generateExplosionParticles,
  stepParticles,
  type Particle,
} from "@/lib/game/particles";
import {
  bounceBallOffWalls,
  checkPaddleCollision,
  checkPixelCollisions,
  updatePaddlePositions,
  calculateTrailColor,
  type Ball,
  type Paddle,
} from "@/lib/game/physics";

export { PIXEL_MAP } from "@/lib/game/pixel-matrix";

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

const GAME_CONFIG: GameConfig = {
  colors: {
    default: "#FFFFFF",
    hit: "#333333",
    background: "#000000",
    ball: "#FFFFFF",
    paddle: "#FFFFFF",
  },
  spacing: DEFAULT_GAME_SPACING,
};

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
    const layout = layoutTextPixels({
      canvasWidth: canvas.width,
      canvasHeight: canvas.height,
      scale,
      firstLineText: trailConfigRef.current.firstLineText,
      secondLineText: trailConfigRef.current.secondLineText,
      spacing: GAME_CONFIG.spacing,
    });

    const BASE_BALL_SPEED = layout.adjustedLargePixelSize * 0.2;

    return {
      scale,
      LARGE_PIXEL_SIZE: 8 * scale,
      SMALL_PIXEL_SIZE: 4 * scale,
      scaleFactor: layout.scaleFactor,
      adjustedLargePixelSize: layout.adjustedLargePixelSize,
      adjustedSmallPixelSize: layout.adjustedSmallPixelSize,
      BALL_SPEED: BASE_BALL_SPEED,
    };
  }, []);

  // Update the ref when state changes
  useEffect(() => {
    trailConfigRef.current = trailConfig;

    const scaling = calculateScalingValues();
    if (gameStateRef.current.ball && scaling) {
      gameStateRef.current.ball.radius =
        (scaling.adjustedLargePixelSize / 2) * trailConfig.ballSize;

      const currentSpeed = scaling.BALL_SPEED * trailConfig.ballSpeed;
      const dx = gameStateRef.current.ball.dx;
      const dy = gameStateRef.current.ball.dy;
      const currentMagnitude = Math.sqrt(dx * dx + dy * dy);
      if (currentMagnitude > 0) {
        gameStateRef.current.ball.dx = (dx / currentMagnitude) * currentSpeed;
        gameStateRef.current.ball.dy = (dy / currentMagnitude) * currentSpeed;
      }
    }
  }, [trailConfig, calculateScalingValues]);

  const initializeGame = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const scaling = calculateScalingValues();
    if (!scaling) return;

    gameStateRef.current.pixels = [];
    gameStateRef.current.trailPoints = [];

    const layout = layoutTextPixels({
      canvasWidth: canvas.width,
      canvasHeight: canvas.height,
      scale: gameStateRef.current.scale,
      firstLineText: trailConfigRef.current.firstLineText,
      secondLineText: trailConfigRef.current.secondLineText,
      spacing: GAME_CONFIG.spacing,
    });
    gameStateRef.current.pixels = layout.pixels;

    const randomEdge = Math.floor(Math.random() * 4);
    let ballStartX: number;
    let ballStartY: number;

    switch (randomEdge) {
      case 0:
        ballStartX = canvas.width * (0.2 + Math.random() * 0.6);
        ballStartY = canvas.height * 0.1;
        break;
      case 1:
        ballStartX = canvas.width * 0.9;
        ballStartY = canvas.height * (0.2 + Math.random() * 0.6);
        break;
      case 2:
        ballStartX = canvas.width * (0.2 + Math.random() * 0.6);
        ballStartY = canvas.height * 0.9;
        break;
      default:
        ballStartX = canvas.width * 0.1;
        ballStartY = canvas.height * (0.2 + Math.random() * 0.6);
        break;
    }

    const baseAngle = (randomEdge * 90 + 90) * (Math.PI / 180);
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
      const currentParticles = gameStateRef.current.particles;
      const newParticles = generateExplosionParticles({
        x,
        y,
        size,
        vx,
        vy,
        quality: config.particleQuality,
        intensity: config.particleIntensity,
        maxParticles: config.maxParticles,
        currentParticleCount: currentParticles.length,
      });

      if (newParticles.length > 0) {
        currentParticles.push(...newParticles);
      }
    },
    [],
  );

  const updateParticles = useCallback(() => {
    gameStateRef.current.particles = stepParticles(
      gameStateRef.current.particles,
      trailConfigRef.current.maxParticles,
    );
  }, []);

  const updateGame = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ball = gameStateRef.current.ball;
    const paddles = gameStateRef.current.paddles;
    const config = trailConfigRef.current;

    updateParticles();

    ball.x += ball.dx;
    ball.y += ball.dy;

    gameStateRef.current.trailPoints.push({
      x: ball.x,
      y: ball.y,
      age: 0,
      color: calculateTrailColor(0, config.mode),
    });

    gameStateRef.current.trailPoints.forEach((point) => {
      point.age += config.fadeSpeed;
    });

    gameStateRef.current.trailPoints = gameStateRef.current.trailPoints
      .filter((point) => point.age < 1)
      .slice(0, config.maxLength);

    bounceBallOffWalls(ball, canvas.width, canvas.height);

    paddles.forEach((paddle) => {
      checkPaddleCollision(ball, paddle);
    });

    updatePaddlePositions(paddles, ball, canvas.width, canvas.height);

    const hitResults = checkPixelCollisions(ball, gameStateRef.current.pixels);
    if (hitResults.length > 0 && config.particleEffects) {
      const hit = hitResults[0].hitPixel;
      createExplosion(
        hit.x + hit.size / 2,
        hit.y + hit.size / 2,
        hit.size,
        ball.dx,
        ball.dy,
      );
    }
  }, [createExplosion, updateParticles]);

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
      const lifeRatio = Math.min(1, Math.max(0, particle.life / particle.maxLife));
      ctx.fillStyle = particle.color;
      ctx.globalAlpha = 0.2 + lifeRatio * 0.8;
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.size * (0.6 + lifeRatio), 0, Math.PI * 2);
      ctx.fill();
    });

    ctx.globalCompositeOperation = "source-over";
    dust.forEach((particle) => {
      const lifeRatio = Math.min(1, Math.max(0, particle.life / particle.maxLife));
      ctx.fillStyle = particle.color;
      ctx.globalAlpha = 0.14 + lifeRatio * 0.3;
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.globalAlpha = 1;

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

  useEffect(() => {
    initializeGameRef.current = initializeGame;
  }, [initializeGame]);

  useEffect(() => {
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    return () => {
      window.removeEventListener("resize", resizeCanvas);
    };
  }, [resizeCanvas]);

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
    gameLoopRef.current = requestAnimationFrame(gameLoop);

    return () => {
      document.removeEventListener("pointerdown", handleClickOutside);
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current);
      }
    };
  }, [isPaused, showSettings, updateGame, drawGame]);

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

      return {
        ...prev,
        particleQuality,
        maxParticles: nextMaxParticles,
      };
    });
  };

  const handleApplyText = () => {
    updateURL(trailConfig.firstLineText, trailConfig.secondLineText);
    initializeGame();
    setShowSettings(false);
    setStatusMessage("Text updated");
  };

  const handleResetDefaults = () => {
    setTrailConfig({ ...DEFAULT_TRAIL_CONFIG });
    updateURL(DEFAULT_TRAIL_CONFIG.firstLineText, DEFAULT_TRAIL_CONFIG.secondLineText);
    initializeGame();
    setStatusMessage("Settings reset to default");
  };

  if (error) {
    return (
      <div className={styles.errorContainer} role="alert" aria-live="assertive">
        <h2 className={styles.errorHeading}>Something went wrong</h2>
        <p className={styles.errorMessage}>{error}</p>
        <button
          onClick={() => {
            setError(null);
            initializeGame();
          }}
          className={styles.errorButton}
        >
          Reload Game
        </button>
      </div>
    );
  }

  return (
    <div className={styles.gameContainer} role="region" aria-label="Game Arena">
      <div className="sr-only" role="status" aria-live="polite">
        {statusMessage}
      </div>

      <div className={styles.gameControls}>
        <Button
          onClick={() => {
            setIsPaused((prev) => {
              const next = !prev;
              setStatusMessage(next ? "Game paused" : "Game resumed");
              return next;
            });
          }}
          variant="secondary"
          size="sm"
          className="bg-gray-800/80 text-white hover:bg-gray-700/80"
          aria-label={isPaused ? "Resume game" : "Pause game"}
        >
          {isPaused ? "Resume" : "Pause"}
        </Button>
        <Button
          onClick={() => {
            initializeGame();
            setStatusMessage("Game reset");
          }}
          variant="secondary"
          size="sm"
          className="bg-gray-800/80 text-white hover:bg-gray-700/80"
          aria-label="Reset game"
        >
          Reset
        </Button>
      </div>

      <canvas
        ref={canvasRef}
        className={styles.canvas}
        tabIndex={0}
        aria-label="Pong game canvas showing ball, paddles, and bricks"
      />

      <Button
        ref={settingsButtonRef}
        variant="ghost"
        size="icon"
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
