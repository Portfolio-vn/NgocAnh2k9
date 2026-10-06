import React from 'react';
import { Expand } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { LightboxImage, useLightbox } from './Lightbox';

export type GalleryPhoto = { src: string; en: string; vi: string };

/**
 * Card photo that opens the lightbox, followed by a strip of small snapshots
 * from the same event. The first photo is the card's main image.
 */
export const CardGallery: React.FC<{
  photos: GalleryPhoto[];
  position?: string;
  frameClassName: string;
  maxThumbs?: number;
}> = ({ photos, position, frameClassName, maxThumbs = 4 }) => {
  const { isVi } = useLanguage();
  const { open } = useLightbox();
  const list: LightboxImage[] = photos.map((p) => ({ src: p.src, alt: isVi ? p.vi : p.en, caption: isVi ? p.vi : p.en }));
  const [main, ...rest] = list;
  const thumbs = rest.slice(0, maxThumbs);
  const hidden = rest.length - thumbs.length;
  const label = isVi ? 'Xem ảnh lớn' : 'View photo';

  return (
    <>
      <button
        type="button"
        onClick={() => open(list, 0)}
        aria-label={`${label}: ${main.alt}`}
        className={`group relative block mx-auto overflow-hidden bg-[#FFFDF8] shadow-[0_2px_5px_rgba(60,40,20,0.2)] cursor-zoom-in ${frameClassName}`}
      >
        <span className="block w-full h-full overflow-hidden">
          <img
            src={main.src}
            alt={main.alt}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
            style={{ objectPosition: position }}
          />
        </span>
        <span className="absolute right-[6%] bottom-[6%] flex items-center gap-1 rounded-full bg-[#2E1A16]/70 text-[#F4F0E6] text-[10px] font-semibold tracking-[0.08em] px-2 py-1 opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 transition-opacity">
          <Expand className="w-3 h-3" />
          {list.length > 1 ? `${list.length} ${isVi ? 'ảnh' : 'photos'}` : label}
        </span>
      </button>

      {thumbs.length > 0 && (
        <div className="mt-3 flex justify-center gap-[clamp(5px,0.6vw,9px)]">
          {thumbs.map((t, i) => {
            const isLast = i === thumbs.length - 1 && hidden > 0;
            return (
              <button
                key={t.src}
                type="button"
                onClick={() => open(list, i + 1)}
                aria-label={`${label}: ${t.alt}`}
                className={`relative w-[clamp(38px,3.4vw,54px)] aspect-square overflow-hidden bg-[#FFFDF8] p-[3px] shadow-[0_1px_3px_rgba(60,40,20,0.25)] cursor-zoom-in transition-transform hover:-translate-y-0.5 hover:rotate-0 ${
                  ['-rotate-[3deg]', 'rotate-[2deg]', '-rotate-[1deg]', 'rotate-[3deg]'][i % 4]
                }`}
              >
                <img src={t.src} alt="" className="w-full h-full object-cover" />
                {isLast && (
                  <span className="absolute inset-[3px] flex items-center justify-center bg-[#2E1A16]/60 text-[#F4F0E6] text-xs font-semibold">
                    +{hidden}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}
    </>
  );
};
