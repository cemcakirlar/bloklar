import "@testing-library/jest-dom/vitest";

// Mock HTMLCanvasElement.getContext for jsdom
class MockCanvasRenderingContext2D {
  fillStyle: string | CanvasGradient | CanvasPattern = "#000000";
  globalAlpha = 1;
  globalCompositeOperation = "source-over";

  fillRect = () => {};
  clearRect = () => {};
  beginPath = () => {};
  arc = () => {};
  fill = () => {};
  stroke = () => {};
  save = () => {};
  restore = () => {};
}

if (typeof window !== "undefined") {
  // @ts-expect-error Mocking canvas 2d context for jsdom
  HTMLCanvasElement.prototype.getContext = function (contextType: string) {
    if (contextType === "2d") {
      return new MockCanvasRenderingContext2D();
    }
    return null;
  };
}
