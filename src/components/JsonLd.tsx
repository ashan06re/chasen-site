/** 構造化データ（JSON-LD）をページに埋め込むサーバーコンポーネント */
export default function JsonLd({ data }: { data: object | object[] }) {
  return (
    <script
      type="application/ld+json"
      // JSON.stringify した値のみを渡す（外部入力はNotion由来のテキストのみ）
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  );
}
