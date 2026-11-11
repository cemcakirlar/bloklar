import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import App from "./App";

describe("App", () => {
  it("renders safe fallback when canvas context is unavailable", () => {
    const originalGetContext = HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext = () => null;

    render(<App />);
    expect(screen.getByRole("alert")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /reload game/i })).toBeInTheDocument();

    HTMLCanvasElement.prototype.getContext = originalGetContext;
  });

  it("renders game arena and controls when canvas is available", () => {
    render(<App />);

    expect(screen.getByRole("region", { name: /game arena/i })).toBeInTheDocument();
    const pauseButton = screen.getByRole("button", { name: /pause game/i });
    expect(pauseButton).toBeInTheDocument();

    fireEvent.click(pauseButton);
    expect(screen.getByRole("button", { name: /resume game/i })).toBeInTheDocument();

    const resetButton = screen.getByRole("button", { name: /reset game/i });
    fireEvent.click(resetButton);

    const settingsButton = screen.getByRole("button", { name: /open settings/i });
    fireEvent.click(settingsButton);
    expect(screen.getByRole("dialog", { name: /game settings/i })).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /close settings/i }));
  });

  it("handles keyboard events for pause and reset", () => {
    render(<App />);

    fireEvent.keyDown(window, { key: " " });
    expect(screen.getByRole("button", { name: /resume game/i })).toBeInTheDocument();

    fireEvent.keyDown(window, { key: " " });
    expect(screen.getByRole("button", { name: /pause game/i })).toBeInTheDocument();

    fireEvent.keyDown(window, { key: "r" });
  });
});
