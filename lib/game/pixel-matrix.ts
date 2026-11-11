export type PixelRow = (0 | 1)[];
export type LetterMatrix = PixelRow[];
export type PixelMap = Record<string, LetterMatrix>;

export interface Pixel {
  x: number;
  y: number;
  size: number;
  hit: boolean;
}

export interface GameSpacingConfig {
  letter: number;
  word: number;
}

export const DEFAULT_GAME_SPACING: GameSpacingConfig = {
  letter: 1,
  word: 3,
};

export const PIXEL_MAP: PixelMap = {
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

export function calculateWordWidth(
  word: string,
  pixelSize: number,
  spacing: GameSpacingConfig = DEFAULT_GAME_SPACING,
): number {
  if (!word) return 0;
  const widthSum = word.split("").reduce((acc, letter) => {
    const letterWidth = PIXEL_MAP[letter.toUpperCase() as keyof typeof PIXEL_MAP]?.[0]?.length ?? 0;
    return acc + letterWidth * pixelSize + spacing.letter * pixelSize;
  }, 0);
  return widthSum - spacing.letter * pixelSize;
}

export function calculateTextLineWidth(
  line: string,
  pixelSize: number,
  spacing: GameSpacingConfig = DEFAULT_GAME_SPACING,
): number {
  const words = line.split(" ");
  return words.reduce((acc, word, idx) => {
    const wordWidth = calculateWordWidth(word, pixelSize, spacing);
    const spacingWidth = idx > 0 ? spacing.word * pixelSize : 0;
    return acc + wordWidth + spacingWidth;
  }, 0);
}

export interface TextLayoutOptions {
  canvasWidth: number;
  canvasHeight: number;
  scale: number;
  firstLineText: string;
  secondLineText: string;
  spacing?: GameSpacingConfig;
}

export interface TextLayoutResult {
  scaleFactor: number;
  adjustedLargePixelSize: number;
  adjustedSmallPixelSize: number;
  pixels: Pixel[];
}

export function layoutTextPixels({
  canvasWidth,
  canvasHeight,
  scale,
  firstLineText,
  secondLineText,
  spacing = DEFAULT_GAME_SPACING,
}: TextLayoutOptions): TextLayoutResult {
  const LARGE_PIXEL_SIZE = 8 * scale;
  const SMALL_PIXEL_SIZE = 4 * scale;

  const totalWidthLarge = calculateTextLineWidth(firstLineText, LARGE_PIXEL_SIZE, spacing);
  const totalWidthSmall = calculateTextLineWidth(secondLineText, SMALL_PIXEL_SIZE, spacing);
  const maxContentWidth = Math.max(totalWidthLarge, totalWidthSmall, 1);
  const scaleFactor = (canvasWidth * 0.8) / maxContentWidth;

  const adjustedLargePixelSize = LARGE_PIXEL_SIZE * scaleFactor;
  const adjustedSmallPixelSize = SMALL_PIXEL_SIZE * scaleFactor;

  const largeTextHeight = 5 * adjustedLargePixelSize;
  const smallTextHeight = 5 * adjustedSmallPixelSize;
  const spaceBetweenLines = 5 * adjustedLargePixelSize;
  const totalTextHeight = largeTextHeight + spaceBetweenLines + smallTextHeight;

  let startY = (canvasHeight - totalTextHeight) / 2;
  const pixels: Pixel[] = [];
  const lines = [firstLineText, secondLineText];

  lines.forEach((lineText, lineIndex) => {
    const pixelSize = lineIndex === 0 ? adjustedLargePixelSize : adjustedSmallPixelSize;
    const totalLineWidth = calculateTextLineWidth(lineText, pixelSize, spacing);
    let startX = (canvasWidth - totalLineWidth) / 2;

    lineText.split(" ").forEach((subWord) => {
      subWord.split("").forEach((rawChar) => {
        const char = rawChar.toUpperCase();
        const matrix = PIXEL_MAP[char as keyof typeof PIXEL_MAP];
        if (matrix) {
          for (let row = 0; row < matrix.length; row++) {
            for (let col = 0; col < matrix[row].length; col++) {
              if (matrix[row][col]) {
                pixels.push({
                  x: startX + col * pixelSize,
                  y: startY + row * pixelSize,
                  size: pixelSize,
                  hit: false,
                });
              }
            }
          }
          startX += (matrix[0].length + spacing.letter) * pixelSize;
        }
      });
      startX += spacing.word * pixelSize;
    });

    startY += lineIndex === 0 ? largeTextHeight + spaceBetweenLines : 0;
  });

  return {
    scaleFactor,
    adjustedLargePixelSize,
    adjustedSmallPixelSize,
    pixels,
  };
}
