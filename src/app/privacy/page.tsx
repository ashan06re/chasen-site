import type { Metadata } from "next";
import LegalPageContent, { type LegalDocument } from "@/components/LegalPageContent";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "プライバシーポリシー",
  description: "茶筅 Chasen における個人情報の取り扱いについて。",
  alternates: { canonical: "/privacy" },
  robots: { index: true, follow: true },
};

// TODO: 正式な事業者名・所在地が確定したら「事業者情報」セクションに追記する
const CONTACT_EMAIL = "chasen.ky01@gmail.com";
const UPDATED = "2026年9月2日 制定";

const ja: LegalDocument = {
  title: "プライバシーポリシー",
  label: "Privacy Policy",
  updated: UPDATED,
  intro:
    "茶筅（Chasen）（以下「当店」）は、お客様の個人情報を適切に保護することが社会的責務であると考え、個人情報の保護に関する法律その他の関係法令を遵守し、以下の方針に基づき個人情報を取り扱います。",
  sections: [
    {
      heading: "1. 取得する情報",
      body: [
        "当店は、ご予約・お問い合わせの際に、お名前、メールアドレス、電話番号、ご来店希望日時など、対応に必要な範囲の情報を取得します。",
        "また、ウェブサイトのご利用状況を把握するため、アクセスログ・端末情報・Cookie等の情報を取得する場合があります。これらは個人を特定する目的では利用しません。",
      ],
    },
    {
      heading: "2. 利用目的",
      body: [
        "取得した情報は、ご予約の確認および連絡、お問い合わせへの回答、店舗運営およびサービス改善のための分析、法令に基づく対応の目的でのみ利用します。",
        "ご本人の同意なく、上記の目的の範囲を超えて利用することはありません。",
      ],
    },
    {
      heading: "3. 第三者提供",
      body: [
        "当店は、次の場合を除き、取得した個人情報を第三者に提供しません。",
        "・ご本人の同意がある場合／法令に基づく場合／人の生命・身体・財産の保護に必要であり、ご本人の同意を得ることが困難な場合。",
      ],
    },
    {
      heading: "4. 外部サービスの利用",
      body: [
        "当店のウェブサイトは、予約フォームに Google フォーム、ホスティングに Vercel、コンテンツ管理に Notion を利用しています。これらのサービスを通じて送信された情報は、各社のプライバシーポリシーに従って取り扱われます。",
        "アクセス解析ツールを導入する場合も、個人を特定しない形での統計的な分析に限って利用します。",
      ],
    },
    {
      heading: "5. Cookie（クッキー）について",
      body: [
        "当サイトは、表示言語の設定など、快適にご利用いただくための情報をブラウザに保存する場合があります。ブラウザの設定によりこれらを無効にすることもできますが、一部機能が正しく動作しない場合があります。",
      ],
    },
    {
      heading: "6. 安全管理措置",
      body: [
        "当店は、取得した個人情報の漏えい、滅失またはき損の防止その他の安全管理のために、必要かつ適切な措置を講じます。",
      ],
    },
    {
      heading: "7. 開示・訂正・削除のご請求",
      body: [
        "ご本人からの個人情報の開示、訂正、利用停止、削除のご請求については、下記の窓口までご連絡ください。ご本人であることを確認のうえ、合理的な期間内に対応いたします。",
      ],
    },
    {
      heading: "8. お問い合わせ窓口",
      body: [
        `茶筅（Chasen） 個人情報お問い合わせ窓口　メール: ${CONTACT_EMAIL}`,
      ],
    },
    {
      heading: "9. 本ポリシーの変更",
      body: [
        "当店は、法令の改正やサービス内容の変更に応じて、本ポリシーを予告なく変更することがあります。変更後の内容は、本ページに掲載した時点から効力を生じます。",
      ],
    },
  ],
};

const en: LegalDocument = {
  title: "Privacy Policy",
  label: "Privacy Policy",
  updated: "Effective September 2, 2026",
  intro:
    "Chasen (“we”, “us”) respects your privacy and handles personal information in accordance with Japan’s Act on the Protection of Personal Information and other applicable laws, based on the policy set out below.",
  sections: [
    {
      heading: "1. Information We Collect",
      body: [
        "When you make a reservation or contact us, we collect the information needed to respond, such as your name, email address, phone number and preferred visit date and time.",
        "We may also collect access logs, device information and cookies to understand how our website is used. This information is not used to identify individuals.",
      ],
    },
    {
      heading: "2. Purpose of Use",
      body: [
        "We use collected information only to confirm and manage reservations, respond to inquiries, analyse and improve our stores and services, and comply with legal obligations.",
        "We will not use your information beyond these purposes without your consent.",
      ],
    },
    {
      heading: "3. Disclosure to Third Parties",
      body: [
        "We do not disclose personal information to third parties except with your consent, where required by law, or where necessary to protect life, health or property and obtaining consent is difficult.",
      ],
    },
    {
      heading: "4. External Services",
      body: [
        "Our website uses Google Forms for reservations, Vercel for hosting and Notion for content management. Information submitted through these services is handled in accordance with each provider’s privacy policy.",
      ],
    },
    {
      heading: "5. Cookies",
      body: [
        "We may store settings such as your display language in your browser to improve your experience. You may disable these in your browser settings, though some features may not work correctly.",
      ],
    },
    {
      heading: "6. Security",
      body: [
        "We take appropriate measures to prevent the loss, destruction, alteration or leakage of personal information we hold.",
      ],
    },
    {
      heading: "7. Access, Correction and Deletion",
      body: [
        "To request disclosure, correction, suspension of use or deletion of your personal information, please contact us at the address below. We will respond within a reasonable period after verifying your identity.",
      ],
    },
    {
      heading: "8. Contact",
      body: [`Chasen — Privacy Inquiries. Email: ${CONTACT_EMAIL}`],
    },
    {
      heading: "9. Changes to This Policy",
      body: [
        "We may update this policy in response to changes in law or in our services. Updates take effect when posted on this page.",
      ],
    },
  ],
};

export default function PrivacyPage() {
  return (
    <>
      <LegalPageContent ja={ja} en={en} />
      <Footer />
    </>
  );
}
