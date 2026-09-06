import { CUTS } from './storyScript';
export { imageControls } from './imageFraming';

export const PLACEMENTS = ['入口の物語','湯の物語','窓辺の物語','茶園の物語','一服の物語','京都の店舗パネル','熊本の店舗パネル','ブランドの画像','店舗紹介の見出し'] as const;
export interface Artwork {
  src: string; mobileSrc?: string; depth?: string; aspect: number; alt: string; altEn: string; motion: boolean;
}
export interface StoryScene extends Artwork { id: string; label: string; ja: string; en: string; detail: string; detailEn: string }
export interface Experience {
  scenes: StoryScene[]; kyoto: Artwork; kumamoto: Artwork; brand: Artwork;
  shopHeading: { ja: string; en: string; detail: string; detailEn: string };
}
export interface Appearance { menuAspect: string; priceNote: string; operator: string; compact: boolean; artNote: string; artNoteEn: string }
export const DEFAULT_APPEARANCE: Appearance = {
  menuAspect: '7 / 5', priceNote: '', operator: '茶筅 Chasen', compact: true,
  artNote: '物語の背景画は、店舗と商品をもとにしたイメージです。商品については各店のお品書きをご覧ください。',
  artNoteEn: 'Story illustrations are inspired by our shops and sweets. See each shop’s menu for product details.',
};
export function registeredArt(id: string): Artwork {
  if (id === 'brand-v1') return { src:'/story-art/brand-v1.webp',aspect:1500/1049,alt:'茶筅の印が入った木枡を描いた絵',altEn:'A painting of Chasen’s wooden masu boxes',motion:false };
  return { src: `/story-art/${id}.webp`, mobileSrc: `/story-art/${id}-mobile.webp`, depth: `/story-art/${id}-depth.webp`, aspect: 1.5, alt: '茶筅の背景画', altEn: 'A Chasen illustration', motion: true };
}
export function defaultExperience(): Experience {
  return {
    scenes: CUTS.map(cut=>({...cut,...registeredArt(cut.id==='02'?'02-v2':cut.id==='05'?'05-v3':cut.id),alt:cut.detail,altEn:cut.detailEn})),
    kyoto:{...registeredArt('03'),alt:'高台寺店の窓辺を描いた背景画',altEn:"A painted view of Kodaiji’s window counter"},
    kumamoto:{...registeredArt('06'),alt:'熊本店の抹茶の宝箱を描いた背景画',altEn:"A painted view of Kumamoto’s matcha treasure box"},
    brand:registeredArt('brand-v1'),
    shopHeading:{ja:'この続きは、\nお店で。',en:'Two places.\nOne Chasen moment.',detail:'京都と熊本。\nそれぞれの街で、お茶と甘いものを。',detailEn:'Kyoto and Kumamoto.\nFind your place for tea and sweets.'},
  };
}
