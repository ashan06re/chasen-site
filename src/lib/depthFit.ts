/** UV scale equivalent to CSS object-fit. Cover must never expose letterboxes. */
export function depthFit(viewport: number, image: number, fit: 'cover' | 'contain'): [number, number] {
  if (!Number.isFinite(viewport) || viewport <= 0 || !Number.isFinite(image) || image <= 0) return [1, 1];
  const axis = fit === 'contain' ? Math.max : Math.min;
  return [axis(1, viewport / image), axis(1, image / viewport)];
}
