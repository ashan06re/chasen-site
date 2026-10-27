import { cmsMetadata } from "@/lib/cmsMetadata";
import type { Metadata } from "next";
import { pageAlternates } from "@/lib/i18n";
import LegalPageContent, { type LegalDocument } from "@/components/LegalPageContent";
import Footer from "@/components/Footer";

export async function generateMetadata() { return cmsMetadata("/terms", "ja", defaultMetadata); }
const defaultMetadata: Metadata = {
  title: "サイトのご利用について",
  description: "茶筅 Chasen ウェブサイトのご利用条件・免責事項・著作権について。",
  alternates: pageAlternates("/terms", "ja"),
};

// TODO: 正式な事業者名・所在地が確定したら「運営者」セクションに追記する
const CONTACT_EMAIL = "hello@chasenco.com";
const UPDATED = "2026年10月27日 改定";

const ja: LegalDocument = {
  title: "サイトのご利用について",
  label: "Terms of Use",
  updated: UPDATED,
  intro:
    "本ページは、茶筅（Chasen）が運営するウェブサイト（以下「当サイト」）のご利用条件を定めるものです。当サイトをご利用いただいた場合、本条件にご同意いただいたものとみなします。",
  sections: [
    {
      heading: "1. 掲載情報について",
      body: [
        "当サイトに掲載しているメニュー、価格、営業時間、店舗情報等は、掲載時点のものです。仕入れ状況や季節により、予告なく変更・終了する場合があります。",
        "最新の情報については、各店舗へ直接お問い合わせいただくか、公式SNSをご確認ください。",
      ],
    },
    {
      heading: "2. 免責事項",
      body: [
        "当店は、当サイトに掲載する情報の正確性に努めていますが、その完全性・有用性を保証するものではありません。",
        "当サイトのご利用により生じた損害について、当店は法令上の責任を負う場合を除き、責任を負いかねます。",
        "当サイトからリンクする外部サイトの内容については、当店は責任を負いません。",
      ],
    },
    {
      heading: "3. 著作権・商標",
      body: [
        "当サイトに掲載されている文章、写真、動画、ロゴ、デザイン等の著作権は、当店または正当な権利者に帰属します。",
        "権利者の許可なく、複製、転載、改変、販売等を行うことを禁じます。引用の範囲を超えるご利用をご希望の場合は、下記までご相談ください。",
      ],
    },
    {
      heading: "4. ご予約について",
      body: [
        "お席のご予約は、予約案内ページに記載した店舗ごとの受付先をご利用ください。玉手箱をお楽しみいただくための事前予約は必須ではありません。",
        "京都店の申込みフォームをご案内している場合、フォームの送信だけでは予約は確定しません。店舗で空席を確認し、確定のメールをお送りした時点で成立します。通常のフォーム受付は日本時間6:00〜22:00未満、回答は12時間以内を目安としています。停止中やお急ぎの場合は店舗へお電話ください。",
        "京都店のフォームで申し込んだ予約の変更・取消は、店舗からのメールへ返信するか、お急ぎの場合は店舗へお電話ください。変更は空席を再確認してご案内します。新しいフォームの送信だけでは元の予約は変更・取消されません。",
        "熊本店のホットペッパーグルメ経由の予約は、予約先の確定・変更・取消の案内に従ってください。",
      ],
    },
    {
      heading: "5. 禁止事項",
      body: [
        "当サイトのご利用にあたり、法令または公序良俗に違反する行為、当店や第三者の権利を侵害する行為、当サイトの運営を妨げる行為を禁じます。",
      ],
    },
    {
      heading: "6. 個人情報の取り扱い",
      body: [
        "個人情報の取り扱いについては、別途定める「プライバシーポリシー」をご確認ください。",
      ],
    },
    {
      heading: "7. 本条件の変更",
      body: [
        "当店は、本条件を予告なく変更することがあります。変更後の内容は、本ページに掲載した時点から効力を生じます。",
      ],
    },
    {
      heading: "8. お問い合わせ",
      body: [`茶筅（Chasen）　メール: ${CONTACT_EMAIL}`],
    },
  ],
};

const en: LegalDocument = {
  title: "Terms of Use",
  label: "Terms of Use",
  updated: "Updated October 27, 2026",
  intro:
    "These terms govern your use of the website operated by Chasen (“the Site”). By using the Site, you are deemed to have agreed to these terms.",
  sections: [
    {
      heading: "1. Information on the Site",
      body: [
        "Menus, prices, opening hours and store information published on the Site are accurate as of the time of posting and may change or end without notice depending on supply and season.",
        "For the latest information, please contact the store directly or check our official social media.",
      ],
    },
    {
      heading: "2. Disclaimer",
      body: [
        "While we strive for accuracy, we do not warrant the completeness or usefulness of information on the Site.",
        "Except where liability is imposed by law, we accept no responsibility for damages arising from use of the Site, or for the content of external sites linked from it.",
      ],
    },
    {
      heading: "3. Copyright and Trademarks",
      body: [
        "Text, photographs, video, logos and designs on the Site belong to Chasen or their rightful owners.",
        "Reproduction, redistribution, modification or sale without permission is prohibited. For use beyond fair quotation, please contact us.",
      ],
    },
    {
      heading: "4. Reservations",
      body: [
        "Please use the booking channel listed for your shop on our reservations page. Advance booking is not required to enjoy Tamatebako.",
        "When a Kyoto request form is offered, submitting it does not confirm a reservation. Your reservation is confirmed when the shop checks availability and sends you a confirmation email. The form normally accepts requests from 06:00 until before 22:00 Japan time, and we aim to respond within 12 hours. Please call the shop if the form is paused or your request is urgent.",
        "To change or cancel a Kyoto form reservation, reply to the shop’s email or call the shop for urgent requests. Changes are subject to another availability check. Submitting a new form does not change or cancel an existing reservation.",
        "For Kumamoto bookings made through Hot Pepper Gourmet, follow the confirmation, change and cancellation instructions provided by that service.",
      ],
    },
    {
      heading: "5. Prohibited Conduct",
      body: [
        "You may not use the Site in any way that violates law or public order, infringes the rights of Chasen or third parties, or interferes with the operation of the Site.",
      ],
    },
    {
      heading: "6. Personal Information",
      body: ["Please see our Privacy Policy for how we handle personal information."],
    },
    {
      heading: "7. Changes to These Terms",
      body: [
        "We may change these terms without prior notice. Changes take effect when posted on this page.",
      ],
    },
    {
      heading: "8. Contact",
      body: [`Chasen — Email: ${CONTACT_EMAIL}`],
    },
  ],
};

export default function TermsPage() {
  return (
    <>
      <LegalPageContent ja={ja} en={en} />
      <Footer />
    </>
  );
}
export const revalidate = 60;
