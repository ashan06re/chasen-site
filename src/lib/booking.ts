export interface BookingSetting { store: '高台寺店'|'熊本店'; mode: '電話・お問い合わせ'|'外部予約サイト'|'受付停止'; url?: string; urlEn?: string; note: string; noteEn: string }
export function safeBookingUrl(value: unknown): string | undefined {
  if(typeof value!=='string')return;
  try { const url=new URL(value); if(url.protocol==='https:'&&!url.username&&!url.password)return url.href; } catch { /* Unsafe or incomplete URLs are never published. */ }
}
export const DEFAULT_BOOKING: BookingSetting[] = ['高台寺店','熊本店'].map(store=>({store:store as BookingSetting['store'],mode:'電話・お問い合わせ',note:'空席・ご来店については、店舗へお電話ください。',noteEn:'Please call the shop for availability and booking enquiries.'}));

export function bookingHref(setting: BookingSetting, lang: 'ja' | 'en') {
  if (setting.mode === '受付停止') return undefined;
  return lang === 'en' ? safeBookingUrl(setting.urlEn) || safeBookingUrl(setting.url) : safeBookingUrl(setting.url);
}
