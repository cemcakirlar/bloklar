import type React from "react";

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "./ui/accordion";
import type { ParticleQuality, TrailConfig, TrailMode } from "@/lib/game/trail-config";
import { SETTINGS_FIELD_IDS } from "@/lib/game/settings-field-ids";

interface SettingsPanelProps {
  trailConfig: TrailConfig;
  onModeChange: (mode: TrailMode) => void;
  onLengthChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onFadeSpeedChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onWidthChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBallSizeChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBallSpeedChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onFirstLineTextChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSecondLineTextChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onParticleEffectsChange: (enabled: boolean) => void;
  onParticleIntensityChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onParticleQualityChange: (quality: ParticleQuality) => void;
  onApplyText: () => void;
  onResetDefaults: () => void;
  settingsPanelRef: React.RefObject<HTMLDivElement | null>;
}

export function GameSettingsPanel({
  trailConfig,
  onModeChange,
  onLengthChange,
  onFadeSpeedChange,
  onWidthChange,
  onBallSizeChange,
  onBallSpeedChange,
  onFirstLineTextChange,
  onSecondLineTextChange,
  onParticleEffectsChange,
  onParticleIntensityChange,
  onParticleQualityChange,
  onApplyText,
  onResetDefaults,
  settingsPanelRef,
}: SettingsPanelProps) {
  return (
    <aside
      ref={settingsPanelRef}
      className="fixed top-16 right-4 z-10 max-h-[80vh] w-64 overflow-y-auto rounded-lg bg-gray-900 p-4 text-white shadow-lg"
      role="dialog"
      aria-label="Game settings"
    >
      <h2 className="mb-4 text-xl font-bold">Settings</h2>
      <Accordion type="single" collapsible className="w-full space-y-2">
        <AccordionItem value="text">
          <AccordionTrigger className="text-sm font-medium">Text Settings</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2 pt-2">
              <div>
                <label htmlFor={SETTINGS_FIELD_IDS.firstLine} className="mb-1 block text-xs">
                  First Line
                </label>
                <input
                  id={SETTINGS_FIELD_IDS.firstLine}
                  type="text"
                  value={trailConfig.firstLineText}
                  onChange={onFirstLineTextChange}
                  className="w-full rounded border border-gray-700 bg-gray-800 px-2 py-1 text-sm uppercase"
                  maxLength={20}
                  style={{ textTransform: "uppercase" }}
                />
              </div>
              <div>
                <label htmlFor={SETTINGS_FIELD_IDS.secondLine} className="mb-1 block text-xs">
                  Second Line
                </label>
                <input
                  id={SETTINGS_FIELD_IDS.secondLine}
                  type="text"
                  value={trailConfig.secondLineText}
                  onChange={onSecondLineTextChange}
                  className="w-full rounded border border-gray-700 bg-gray-800 px-2 py-1 text-sm uppercase"
                  maxLength={30}
                  style={{ textTransform: "uppercase" }}
                />
              </div>
              <button
                onClick={onApplyText}
                className="mt-2 w-full rounded bg-blue-600 px-4 py-1 text-sm text-white transition-colors hover:bg-blue-500"
              >
                Apply Text
              </button>
            </div>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="effects">
          <AccordionTrigger className="text-sm font-medium">Visual Effects</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4 pt-2">
              <div className="flex items-center justify-between">
                <span className="text-xs">Particle Effects</span>
                <button
                  onClick={() => onParticleEffectsChange(!trailConfig.particleEffects)}
                  aria-pressed={trailConfig.particleEffects}
                  className={`rounded px-3 py-1 text-xs transition-colors ${
                    trailConfig.particleEffects ? "bg-blue-600" : "bg-gray-700"
                  }`}
                >
                  {trailConfig.particleEffects ? "ON" : "OFF"}
                </button>
              </div>
              <div>
                <label
                  htmlFor={SETTINGS_FIELD_IDS.particleIntensity}
                  className="mb-1 block text-xs"
                >
                  Particle Intensity: {trailConfig.particleIntensity.toFixed(1)}x
                </label>
                <input
                  id={SETTINGS_FIELD_IDS.particleIntensity}
                  type="range"
                  min="0.6"
                  max="2.5"
                  step="0.1"
                  value={trailConfig.particleIntensity}
                  onChange={onParticleIntensityChange}
                  className="w-full"
                  disabled={!trailConfig.particleEffects}
                />
              </div>
              <div>
                <h3 className="mb-2 text-sm font-medium">Particle Quality</h3>
                <div className="flex space-x-1">
                  {(["medium", "high", "ultra"] as ParticleQuality[]).map((quality) => (
                    <button
                      key={quality}
                      className={`rounded px-2 py-1 text-xs ${trailConfig.particleQuality === quality ? "bg-blue-600" : "bg-gray-700"}`}
                      onClick={() => onParticleQualityChange(quality)}
                      aria-pressed={trailConfig.particleQuality === quality}
                      disabled={!trailConfig.particleEffects}
                    >
                      {quality[0].toUpperCase() + quality.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="mb-2 text-sm font-medium">Color Mode</h3>
                <div className="flex space-x-1">
                  {(["rainbow", "gradient", "pulse"] as TrailMode[]).map((mode) => (
                    <button
                      key={mode}
                      className={`rounded px-2 py-1 text-xs ${trailConfig.mode === mode ? "bg-blue-600" : "bg-gray-700"}`}
                      onClick={() => onModeChange(mode)}
                      aria-pressed={trailConfig.mode === mode}
                    >
                      {mode[0].toUpperCase() + mode.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="ball">
          <AccordionTrigger className="text-sm font-medium">Ball Settings</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4 pt-2">
              <div>
                <label htmlFor={SETTINGS_FIELD_IDS.ballSize} className="mb-1 block text-xs">
                  Ball Size: {trailConfig.ballSize.toFixed(1)}x
                </label>
                <input
                  id={SETTINGS_FIELD_IDS.ballSize}
                  type="range"
                  min="0.5"
                  max="2"
                  step="0.1"
                  value={trailConfig.ballSize}
                  onChange={onBallSizeChange}
                  className="w-full"
                />
              </div>
              <div>
                <label htmlFor={SETTINGS_FIELD_IDS.ballSpeed} className="mb-1 block text-xs">
                  Ball Speed: {trailConfig.ballSpeed.toFixed(1)}x
                </label>
                <input
                  id={SETTINGS_FIELD_IDS.ballSpeed}
                  type="range"
                  min="0.5"
                  max="10"
                  step="0.1"
                  value={trailConfig.ballSpeed}
                  onChange={onBallSpeedChange}
                  className="w-full"
                />
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="trail">
          <AccordionTrigger className="text-sm font-medium">Trail Settings</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4 pt-2">
              <div>
                <label htmlFor={SETTINGS_FIELD_IDS.trailLength} className="mb-1 block text-xs">
                  Trail Length: {trailConfig.maxLength}
                </label>
                <input
                  id={SETTINGS_FIELD_IDS.trailLength}
                  type="range"
                  min="5"
                  max="100"
                  value={trailConfig.maxLength}
                  onChange={onLengthChange}
                  className="w-full"
                />
              </div>
              <div>
                <label htmlFor={SETTINGS_FIELD_IDS.fadeSpeed} className="mb-1 block text-xs">
                  Fade Speed: {trailConfig.fadeSpeed.toFixed(2)}
                </label>
                <input
                  id={SETTINGS_FIELD_IDS.fadeSpeed}
                  type="range"
                  min="0.01"
                  max="0.1"
                  step="0.01"
                  value={trailConfig.fadeSpeed}
                  onChange={onFadeSpeedChange}
                  className="w-full"
                />
              </div>
              <div>
                <label htmlFor={SETTINGS_FIELD_IDS.trailWidth} className="mb-1 block text-xs">
                  Trail Width: {trailConfig.width.toFixed(1)}
                </label>
                <input
                  id={SETTINGS_FIELD_IDS.trailWidth}
                  type="range"
                  min="0.5"
                  max="3"
                  step="0.1"
                  value={trailConfig.width}
                  onChange={onWidthChange}
                  className="w-full"
                />
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
      <button
        onClick={onResetDefaults}
        className="mt-4 w-full rounded bg-gray-700 px-4 py-2 text-sm text-white transition-colors hover:bg-gray-600"
      >
        Reset Settings
      </button>
    </aside>
  );
}
