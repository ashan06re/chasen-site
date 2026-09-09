/** Named choices for editors; only known, contrast-corrected colors reach the UI. */
export const ACCENT_PALETTE: Record<string,string> = {
  '抹茶':'#3D6B35', '深緑':'#2A4D25', 'ほうじ茶':'#8B5E3C', '金茶':'#B8A882',
  '古金':'#75663F', '石色':'#6B6B5E', '墨':'#1A1A18', '白茶':'#F7F5F0',
};
export function accentColor(choice: string, legacy = '', fallback = '#3D6B35') {
  return (Object.hasOwn(ACCENT_PALETTE,choice) ? ACCENT_PALETTE[choice] : undefined) || Object.values(ACCENT_PALETTE).find(hex=>hex===legacy.toUpperCase()) || fallback;
}
