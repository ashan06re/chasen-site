"use client";
import Link from 'next/link';
import Header from './Header';
import {useLang} from '@/lib/langContext';
import type {StoreInfo} from '@/data/storeContent';

export default function MenuUpcoming({info,infoEn}: {info: StoreInfo;infoEn?:StoreInfo}) {
  const {lang,localize}=useLang();
  const en=lang==='en';
  const currentInfo=en&&infoEn?infoEn:info;
  return <><Header initialDark reservationUrl="/reserve" reservationUrlEn="/en/reserve" />
    <main className="editorial-page"><section className="editorial-wrap menu-upcoming">
      <nav className="menu-breadcrumb" aria-label={en?'Breadcrumb':'パンくずリスト'}>
        <Link href={localize('/')}>Chasen</Link><span aria-hidden>/</span>
        <Link href={localize(`/stores/${currentInfo.slug}`)}>{currentInfo.name}</Link>
      </nav>
      <p className="eyebrow">MENU · COMING SOON</p>
      <h1>{en?'A little more time.':'お品書きは、ただいま準備中です。'}</h1>
      <p className="editorial-body">{en?'We are updating our online menu. Please check back soon. For the menu available today, please contact the shop.':'新しいお品書きを整えています。\n公開まで、もうしばらくお待ちください。\n本日のお品書きについては、店舗へお問い合わせください。'}</p>
      <div className="editorial-actions"><Link className="editorial-button" href={localize(`/stores/${currentInfo.slug}`)}>{en?'Shop information & contact':'店舗情報・お問い合わせ'} ↗</Link>
      <Link className="editorial-text-link" href={localize(`/reserve#${currentInfo.slug}`)}>{en?'Reservations':'ご予約のご案内'} ↗</Link></div>
    </section></main></>;
}
