import { createRef } from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { GameSettingsPanel } from "./game-settings-panel";
import { DEFAULT_TRAIL_CONFIG } from "@/lib/game/trail-config";

describe("GameSettingsPanel", () => {
  it("renders settings dialog and calls handlers on interaction", () => {
    const onResetDefaults = vi.fn();
    const onApplyText = vi.fn();
    const onFirstLineTextChange = vi.fn();
    const onSecondLineTextChange = vi.fn();
    const onModeChange = vi.fn();
    const onLengthChange = vi.fn();
    const onFadeSpeedChange = vi.fn();
    const onWidthChange = vi.fn();
    const onBallSizeChange = vi.fn();
    const onBallSpeedChange = vi.fn();
    const onParticleEffectsChange = vi.fn();
    const onParticleIntensityChange = vi.fn();
    const onParticleQualityChange = vi.fn();
    const ref = createRef<HTMLDivElement>();

    render(
      <GameSettingsPanel
        trailConfig={DEFAULT_TRAIL_CONFIG}
        onModeChange={onModeChange}
        onLengthChange={onLengthChange}
        onFadeSpeedChange={onFadeSpeedChange}
        onWidthChange={onWidthChange}
        onBallSizeChange={onBallSizeChange}
        onBallSpeedChange={onBallSpeedChange}
        onFirstLineTextChange={onFirstLineTextChange}
        onSecondLineTextChange={onSecondLineTextChange}
        onParticleEffectsChange={onParticleEffectsChange}
        onParticleIntensityChange={onParticleIntensityChange}
        onParticleQualityChange={onParticleQualityChange}
        onApplyText={onApplyText}
        onResetDefaults={onResetDefaults}
        settingsPanelRef={ref}
      />,
    );

    expect(screen.getByRole("dialog", { name: /game settings/i })).toBeInTheDocument();

    const resetButton = screen.getByRole("button", { name: /reset settings/i });
    fireEvent.click(resetButton);
    expect(onResetDefaults).toHaveBeenCalledTimes(1);

    // Text section
    const textTrigger = screen.getByRole("button", { name: /text settings/i });
    fireEvent.click(textTrigger);

    const firstLineInput = screen.getByDisplayValue(DEFAULT_TRAIL_CONFIG.firstLineText);
    fireEvent.change(firstLineInput, { target: { value: "NEW TEXT" } });
    expect(onFirstLineTextChange).toHaveBeenCalled();

    const secondLineInput = screen.getByDisplayValue(DEFAULT_TRAIL_CONFIG.secondLineText);
    fireEvent.change(secondLineInput, { target: { value: "NEW SECOND" } });
    expect(onSecondLineTextChange).toHaveBeenCalled();

    const applyButton = screen.getByRole("button", { name: /apply text/i });
    fireEvent.click(applyButton);
    expect(onApplyText).toHaveBeenCalledTimes(1);

    // Visual effects section
    const effectsTrigger = screen.getByRole("button", { name: /visual effects/i });
    fireEvent.click(effectsTrigger);

    const toggleParticleBtn = screen.getByRole("button", { name: /on/i });
    fireEvent.click(toggleParticleBtn);
    expect(onParticleEffectsChange).toHaveBeenCalledWith(false);

    const ultraQualityBtn = screen.getByRole("button", { name: /ultra/i });
    fireEvent.click(ultraQualityBtn);
    expect(onParticleQualityChange).toHaveBeenCalledWith("ultra");

    const pulseModeBtn = screen.getByRole("button", { name: /pulse/i });
    fireEvent.click(pulseModeBtn);
    expect(onModeChange).toHaveBeenCalledWith("pulse");
  });
});
