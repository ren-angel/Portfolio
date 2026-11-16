export interface Rect { left: number; top: number; width: number; height: number }

/** Maps a pointer position on a CSS-scaled canvas to canvas pixel coordinates. */
export function toCanvasPoint(clientX: number, clientY: number, rect: Rect, width: number, height: number) {
  return { x: ((clientX - rect.left) / rect.width) * width, y: ((clientY - rect.top) / rect.height) * height };
}
