import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import App from "./App";

describe("App", () => {
  it("renders safe fallback when canvas context is unavailable", () => {
    render(<App />);
    expect(screen.getByRole("alert")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /reload game/i })).toBeInTheDocument();
  });
});
