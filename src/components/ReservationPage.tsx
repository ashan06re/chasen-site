"use client";
import Link from 'next/link';
import Header from './Header';
import { useLang } from '@/lib/langContext';
import type { StoreInfo } from '@/data/storeContent';
import type { BookingSetting } from '@/lib/booking';
import { bookingHref } from '@/lib/booking';

export default function ReservationPage({settings,stores}:{settings:BookingSetting[];stores:StoreInfo[]}) {
  const {lang,localize}=useLang();const en=lang==='en';
  return <><Header initialDark reservationUrl="/reserve" reservationUrlEn="/en/reserve"/><main className="editorial-page reservation-page"><section className="editorial-wrap editorial-section">
    <p className="eyebrow">YOUR NEXT CHASEN MOMENT</p><h1>{en?'A table. A little time for tea.':'次の一服を、茶筅で。'}</h1><p className="editorial-body">{en?'Choose your shop below. Booking arrangements may differ by location.':'ご希望の店舗をお選びください。受付方法は店舗ごとにご案内しています。'}</p>
    <div className="reservation-shops">{settings.map((setting,i)=>{const store=stores[i];const closed=setting.mode==='受付停止';const url=bookingHref(setting,lang);const external=setting.mode==='外部予約サイト';return <article key={setting.store} id={store.slug}>
      <p className="eyebrow">0{i+1} / {store.area.toUpperCase()}</p><h2>{en?store.nameEn||store.name:store.name}</h2><p className="reservation-hours">{store.hours}</p>
      <p className="editorial-body">{closed?(en?'Reservations are currently paused.':'現在、ご予約の受付を休止しています。'):en?setting.noteEn:setting.note}</p>
      <div className="reservation-actions">{!closed&&external&&url&&<a className="editorial-button" href={url} target="_blank" rel="noopener noreferrer">{en?'Check availability & book':'空席を確認・予約する'} ↗</a>}
      {!closed&&store.tel&&<a className={external&&url?'editorial-text-link':'editorial-button'} href={`tel:${store.tel.replace(/[^+\d]/g,'')}`}>{en?'Call the shop':'店舗に電話する'}<span>{store.tel}</span></a>}
      {!closed&&!external&&url&&<a className="editorial-text-link" href={url} target="_blank" rel="noopener noreferrer">{en?'Send an enquiry (not a confirmed booking)':'フォームで相談する（予約確定ではありません）'} ↗</a>}
      <Link className="editorial-text-link" href={localize(`/stores/${store.slug}/menu`)}>{en?'Explore the menu':'お品書きを見る'} →</Link></div>
    </article>;})}</div>
    <div className="reservation-help"><h2>{en?'Changing an existing reservation?':'ご予約の変更・キャンセルについて'}</h2><p>{en?'Please use the link in your booking confirmation, or contact the shop directly. A new enquiry does not cancel an existing reservation.':'予約確定メールの案内、またはご予約先の店舗へ直接ご連絡ください。新しいフォームを送信しても、元の予約の変更・キャンセルにはなりません。'}</p></div>
  </section></main></>;
}
