/** Crop controls stay bounded even when a CMS editor enters an out-of-range value. */
export function imageControls(zoom?: number, x?: number, y?: number) {
  const bound = (value: number | undefined, min: number, max: number, fallback: number) =>
    typeof value === 'number' && Number.isFinite(value) ? Math.max(min, Math.min(max, value)) : fallback;
  return { zoom: bound(zoom, 100, 180, 100) / 100, x: bound(x, 0, 100, 50), y: bound(y, 0, 100, 50) };
}
