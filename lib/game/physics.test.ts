import { describe, expect, it } from "vitest";
import {
  bounceBallOffWalls,
  calculateTrailColor,
  checkPaddleCollision,
  checkPixelCollisions,
  updatePaddlePositions,
  type Ball,
  type Paddle,
} from "./physics";
import type { Pixel } from "./pixel-matrix";

describe("physics", () => {
  it("bounces ball off canvas boundaries correctly", () => {
    const ball: Ball = { x: -2, y: 10, dx: -4, dy: 2, radius: 5 };
    const res = bounceBallOffWalls(ball, 800, 600);

    expect(res.bouncedX).toBe(true);
    expect(ball.dx).toBe(4);
    expect(ball.x).toBe(5);

    ball.y = 605;
    ball.dy = 3;
    const resY = bounceBallOffWalls(ball, 800, 600);
    expect(resY.bouncedY).toBe(true);
    expect(ball.dy).toBe(3);
    expect(ball.y).toBe(595);
  });

  it("handles paddle collisions for vertical and horizontal paddles", () => {
    const ball: Ball = { x: 10, y: 50, dx: -5, dy: 0, radius: 5 };
    const verticalPaddle: Paddle = {
      x: 0,
      y: 30,
      width: 10,
      height: 40,
      targetY: 30,
      isVertical: true,
    };

    const hitVertical = checkPaddleCollision(ball, verticalPaddle);
    expect(hitVertical).toBe(true);
    expect(ball.dx).toBe(5);

    const horizontalPaddle: Paddle = {
      x: 30,
      y: 0,
      width: 50,
      height: 10,
      targetY: 30,
      isVertical: false,
    };
    ball.x = 50;
    ball.y = 8;
    ball.dy = -5;

    const hitHorizontal = checkPaddleCollision(ball, horizontalPaddle);
    expect(hitHorizontal).toBe(true);
    expect(ball.dy).toBe(5);
  });

  it("updates paddle target and position towards ball", () => {
    const ball: Ball = { x: 400, y: 300, dx: 0, dy: 0, radius: 5 };
    const paddle: Paddle = {
      x: 0,
      y: 0,
      width: 10,
      height: 50,
      targetY: 0,
      isVertical: true,
    };

    updatePaddlePositions([paddle], ball, 800, 600, 0.5);
    expect(paddle.targetY).toBe(300 - 25);
    expect(paddle.y).toBe(137.5);
  });

  it("detects pixel collisions and deflects ball velocity", () => {
    const ball: Ball = { x: 102, y: 102, dx: 4, dy: 0, radius: 5 };
    const pixels: Pixel[] = [
      { x: 105, y: 100, size: 10, hit: false },
      { x: 200, y: 200, size: 10, hit: false },
    ];

    const hits = checkPixelCollisions(ball, pixels);
    expect(hits).toHaveLength(1);
    expect(hits[0].hitPixel.hit).toBe(true);
    expect(ball.dx).toBe(-4);
  });

  it("computes trail color for pulse, gradient and rainbow", () => {
    const pulse = calculateTrailColor(0.2, "pulse", 1000);
    expect(pulse).toContain("rgba(255");

    const gradient = calculateTrailColor(0.5, "gradient");
    expect(gradient).toContain("rgba(255");

    const rainbow = calculateTrailColor(0.1, "rainbow", 500);
    expect(rainbow).toContain("hsla(");
  });
});
