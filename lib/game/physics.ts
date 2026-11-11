import type { Pixel } from "./pixel-matrix";

export interface Ball {
  x: number;
  y: number;
  dx: number;
  dy: number;
  radius: number;
}

export interface Paddle {
  x: number;
  y: number;
  width: number;
  height: number;
  targetY: number;
  isVertical: boolean;
}

export interface WallBounceResult {
  bouncedX: boolean;
  bouncedY: boolean;
}

export function bounceBallOffWalls(
  ball: Ball,
  canvasWidth: number,
  canvasHeight: number,
): WallBounceResult {
  let bouncedX = false;
  let bouncedY = false;

  if (ball.y - ball.radius < 0) {
    ball.y = ball.radius;
    ball.dy = -Math.abs(ball.dy);
    bouncedY = true;
  } else if (ball.y + ball.radius > canvasHeight) {
    ball.y = canvasHeight - ball.radius;
    ball.dy = Math.abs(ball.dy);
    bouncedY = true;
  }

  if (ball.x - ball.radius < 0) {
    ball.x = ball.radius;
    ball.dx = Math.abs(ball.dx);
    bouncedX = true;
  } else if (ball.x + ball.radius > canvasWidth) {
    ball.x = canvasWidth - ball.radius;
    ball.dx = -Math.abs(ball.dx);
    bouncedX = true;
  }

  return { bouncedX, bouncedY };
}

export function checkPaddleCollision(ball: Ball, paddle: Paddle): boolean {
  if (paddle.isVertical) {
    const hitsX =
      ball.x - ball.radius < paddle.x + paddle.width && ball.x + ball.radius > paddle.x;
    const hitsY = ball.y > paddle.y && ball.y < paddle.y + paddle.height;
    if (hitsX && hitsY) {
      ball.dx = -ball.dx;
      return true;
    }
  } else {
    const hitsY =
      ball.y - ball.radius < paddle.y + paddle.height && ball.y + ball.radius > paddle.y;
    const hitsX = ball.x > paddle.x && ball.x < paddle.x + paddle.width;
    if (hitsY && hitsX) {
      ball.dy = -ball.dy;
      return true;
    }
  }
  return false;
}

export function updatePaddlePositions(
  paddles: Paddle[],
  ball: Ball,
  canvasWidth: number,
  canvasHeight: number,
  smoothing: number = 0.1,
): void {
  paddles.forEach((paddle) => {
    if (paddle.isVertical) {
      paddle.targetY = ball.y - paddle.height / 2;
      paddle.targetY = Math.max(0, Math.min(canvasHeight - paddle.height, paddle.targetY));
      paddle.y += (paddle.targetY - paddle.y) * smoothing;
    } else {
      paddle.targetY = ball.x - paddle.width / 2;
      paddle.targetY = Math.max(0, Math.min(canvasWidth - paddle.width, paddle.targetY));
      paddle.x += (paddle.targetY - paddle.x) * smoothing;
    }
  });
}

export interface PixelHitResult {
  hitPixel: Pixel;
  hitIndex: number;
}

export function checkPixelCollisions(ball: Ball, pixels: Pixel[]): PixelHitResult[] {
  const hits: PixelHitResult[] = [];

  for (let i = 0; i < pixels.length; i++) {
    const pixel = pixels[i];
    if (pixel.hit) continue;

    const collision =
      ball.x + ball.radius > pixel.x &&
      ball.x - ball.radius < pixel.x + pixel.size &&
      ball.y + ball.radius > pixel.y &&
      ball.y - ball.radius < pixel.y + pixel.size;

    if (collision) {
      pixel.hit = true;
      const centerX = pixel.x + pixel.size / 2;
      const centerY = pixel.y + pixel.size / 2;

      if (Math.abs(ball.x - centerX) > Math.abs(ball.y - centerY)) {
        ball.dx = -ball.dx;
      } else {
        ball.dy = -ball.dy;
      }

      hits.push({ hitPixel: pixel, hitIndex: i });
      break;
    }
  }

  return hits;
}

export function calculateTrailColor(
  age: number,
  mode: "rainbow" | "gradient" | "pulse",
  now: number = Date.now(),
): string {
  const opacity = Math.max(0.2, 1 - age);

  if (mode === "rainbow") {
    const hue = (now / 20 + age * 50) % 360;
    return `hsla(${hue}, 100%, 60%, ${opacity})`;
  }
  if (mode === "gradient") {
    return `rgba(255, ${Math.floor(255 * (1 - age))}, ${Math.floor(255 * age)}, ${opacity})`;
  }
  if (mode === "pulse") {
    const intensity = (Math.sin(now / 300) + 1) / 2;
    return `rgba(255, ${Math.floor(100 + 155 * intensity)}, ${Math.floor(100 + 155 * (1 - intensity))}, ${opacity})`;
  }

  return `rgba(255, 255, 255, ${opacity})`;
}
