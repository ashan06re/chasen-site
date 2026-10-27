"use client";
import Link from 'next/link';
import Header from './Header';
import { useLang } from '@/lib/langContext';
import type { StoreInfo } from '@/data/storeContent';
import type { BookingSetting } from '@/lib/booking';
import { bookingHref } from '@/lib/booking';

export default function ReservationPage({settings,stores,storesEn}:{settings:BookingSetting[];stores:StoreInfo[];storesEn?:StoreInfo[]}) {
  const {lang,localize}=useLang();const en=lang==='en';
  const kyotoForm=settings.some(setting=>setting.store==='高台寺店'&&setting.mode==='電話・お問い合わせ'&&bookingHref(setting,lang));
  return <><Header initialDark reservationUrl="/reserve" reservationUrlEn="/en/reserve"/><main className="editorial-page reservation-page"><section className="editorial-wrap editorial-section">
    <p className="eyebrow">YOUR NEXT CHASEN MOMENT</p><h1>{en?'A table. A little time for tea.':'次の一服を、茶筅で。'}</h1><p className="editorial-body">{en?'Choose your shop below. Booking arrangements may differ by location.':'ご希望の店舗をお選びください。受付方法は店舗ごとにご案内しています。'}</p>
    <div className="reservation-shops">{settings.map((setting,i)=>{const store=en?(storesEn?.[i]??stores[i]):stores[i];const closed=setting.mode==='受付停止';const url=bookingHref(setting,lang);const external=setting.mode==='外部予約サイト';return <article key={setting.store} id={store.slug}>
      <p className="eyebrow">0{i+1} / {store.area.toUpperCase()}</p><h2>{store.name}</h2><p className="reservation-hours">{store.hours}</p>
      <p className="editorial-body">{closed?(en?'Reservations are currently paused.':'現在、ご予約の受付を休止しています。'):en?setting.noteEn:setting.note}</p>
      <div className="reservation-actions">{!closed&&external&&url&&<a className="editorial-button" href={url} target="_blank" rel="noopener noreferrer">{en?'Check availability & book':'空席を確認・予約する'} ↗</a>}
      {!closed&&store.tel&&<a className={external&&url?'editorial-text-link':'editorial-button'} href={`tel:${store.tel.replace(/[^+\d]/g,'')}`}>{en?'Call the shop':'店舗に電話する'}<span>{store.tel}</span></a>}
      {!closed&&!external&&url&&<a className="editorial-text-link" href={url} target="_blank" rel="noopener noreferrer">{en?'Send an enquiry (not a confirmed booking)':'フォームで相談する（予約確定ではありません）'} ↗</a>}
      <Link className="editorial-text-link" href={localize(`/stores/${store.slug}/menu`)}>{en?'Explore the menu':'お品書きを見る'} →</Link></div>
      {!closed&&!external&&url&&setting.store==='高台寺店'&&<div className="reservation-help">
        <h3>{en?'Request, availability check, confirmation':'お申込みから、予約確定まで'}</h3>
        <p>{en?'Submitting the form does not confirm a booking. We check availability at the shop, then email you. Your booking is confirmed when we send a confirmation email. We aim to respond within 12 hours; please call for urgent requests.':'フォームの送信だけでは予約は確定しません。店舗で空席を確認し、確定のメールをお送りした時点で予約成立となります。回答は12時間以内が目安です。お急ぎの場合は店舗へお電話ください。'}</p>
        <p>{en?'Form hours: 06:00–before 22:00 Japan time. Request a visit from today through 60 days ahead, at least 6 hours in advance, for 1–8 guests. For 9 or more guests, please contact the shop.':'フォーム受付は日本時間6:00〜22:00未満。当日から60日先まで、来店希望時刻の6時間前まで、1〜8名でお申込みいただけます。9名以上は店舗へご相談ください。'}</p>
        <Link className="editorial-text-link" href={localize('/privacy')}>{en?'How we handle your information':'個人情報の取り扱い'} →</Link>
      </div>}
    </article>;})}</div>
    <div className="reservation-help"><h2>{en?'Changing an existing reservation?':'ご予約の変更・キャンセルについて'}</h2><p>{kyotoForm?(en?'For a Kyoto request made through our form, reply to the shop’s email; for urgent requests, call the shop. For Kumamoto, follow the instructions in your Hot Pepper Gourmet confirmation or contact the shop. A new form submission does not change or cancel an existing reservation.':'京都店のフォームでお申込みの場合は、店舗からのメールへ返信してください。お急ぎの場合は店舗へお電話ください。熊本店はホットペッパーグルメの予約案内、または店舗へご連絡ください。新しいフォームの送信だけでは、元の予約の変更・キャンセルにはなりません。'):(en?'For Kyoto bookings, please call the shop. For Kumamoto, follow the instructions in your Hot Pepper Gourmet confirmation or contact the shop directly.':'京都店のご予約は店舗へお電話ください。熊本店はホットペッパーグルメの予約案内、または店舗へ直接ご連絡ください。')}</p><Link className="editorial-text-link" href={localize('/terms')}>{en?'Booking and website terms':'ご予約・サイトのご利用について'} →</Link></div>
  </section></main></>;
}
