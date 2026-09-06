// Immutable uploaded-file revisions, not row IDs or user-editable filenames.
// A replacement in the same CMS row must never retain an unrelated depth map.
const UPLOADED_ART: Readonly<Record<string, string>> = {
  ea764152a01a: '02-v2',
  '0af7d818a996': '05-v3',
  '87ca624c7165': 'brand-v1',
};
export function approvedAssetId(src: string): string | undefined {
  const upload = /^\/api\/notion-image\/[a-f0-9-]{36}\/0\/%E7%94%BB%E5%83%8F\/([a-f0-9]{12})$/.exec(src);
  if (upload) return UPLOADED_ART[upload[1]];
  const external = /^https:\/\/chasen-site(?:-git-redesign-ashan06re-2847s-projects|-eight)?\.vercel\.app\/story-art\/(0[1-6]|02-v2|05-v3|brand-v1)\.webp$/.exec(src);
  return external?.[1];
}
