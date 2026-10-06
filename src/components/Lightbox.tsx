import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export type LightboxImage = { src: string; alt?: string; caption?: string };

type LightboxApi = { open: (images: LightboxImage[], index?: number) => void };

const LightboxContext = createContext<LightboxApi>({ open: () => {} });

export const useLightbox = () => useContext(LightboxContext);

/**
 * Full-screen photo viewer. Components can open a gallery with useLightbox().open(...);
 * any other meaningful <img> inside the portfolio (non-empty alt, not inside a button
 * or link, no data-no-zoom) opens on its own when clicked.
 */
export const LightboxProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isVi } = useLanguage();
  const [images, setImages] = useState<LightboxImage[]>([]);
  const [index, setIndex] = useState(0);
  const touchX = useRef<number | null>(null);
  const isOpen = images.length > 0;

  const open = useCallback((list: LightboxImage[], i = 0) => {
    if (!list.length) return;
    setImages(list);
    setIndex(Math.min(Math.max(i, 0), list.length - 1));
  }, []);
  const close = useCallback(() => setImages([]), []);
  const step = useCallback(
    (d: number) => setIndex((i) => (images.length ? (i + d + images.length) % images.length : 0)),
    [images.length]
  );

  // Click-to-zoom for plain images anywhere in the main content.
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const img = (e.target as HTMLElement | null)?.closest?.('img');
      if (!img || e.defaultPrevented) return;
      if (!img.closest('#portfolio-main-content')) return;
      if (img.closest('button, a, [data-no-zoom]') || !img.getAttribute('alt')) return;
      open([{ src: img.currentSrc || img.src, alt: img.alt, caption: img.alt }]);
    };
    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, [open]);

  // Keyboard + body scroll lock while open.
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
      else if (e.key === 'ArrowRight') step(1);
      else if (e.key === 'ArrowLeft') step(-1);
    };
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', onKey);
    };
  }, [isOpen, close, step]);

  const current = images[index];
  const many = images.length > 1;

  return (
    <LightboxContext.Provider value={{ open }}>
      {children}
      <AnimatePresence>
        {isOpen && current && (
          <motion.div
            key="lightbox"
            role="dialog"
            aria-modal="true"
            aria-label={current.alt || (isVi ? 'Xem ảnh' : 'Photo viewer')}
            className="fixed inset-0 z-[200] flex flex-col bg-[#1A0F0C]/92 backdrop-blur-sm select-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={close}
            onTouchStart={(e) => (touchX.current = e.touches[0].clientX)}
            onTouchEnd={(e) => {
              if (touchX.current === null) return;
              const dx = e.changedTouches[0].clientX - touchX.current;
              touchX.current = null;
              if (many && Math.abs(dx) > 50) step(dx < 0 ? 1 : -1);
            }}
          >
            {/* Top bar */}
            <div className="flex items-center justify-between px-4 py-3 text-[#F4F0E6]/80 text-xs tracking-[0.14em] uppercase">
              <span>{many ? `${index + 1} / ${images.length}` : ''}</span>
              <button
                type="button"
                onClick={close}
                aria-label={isVi ? 'Đóng' : 'Close'}
                className="p-2 rounded-full hover:bg-white/10 text-[#F4F0E6] transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Photo */}
            <div className="relative flex-1 min-h-0 flex items-center justify-center px-3 sm:px-16">
              <AnimatePresence mode="wait" initial={false}>
                <motion.img
                  key={current.src}
                  src={current.src}
                  alt={current.alt || ''}
                  onClick={(e) => e.stopPropagation()}
                  className="max-w-full max-h-full object-contain shadow-[0_10px_40px_rgba(0,0,0,0.5)] bg-[#F4F0E6]/5"
                  initial={{ opacity: 0, scale: 0.97 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.97 }}
                  transition={{ duration: 0.18 }}
                  draggable={false}
                />
              </AnimatePresence>

              {many && (
                <>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      step(-1);
                    }}
                    aria-label={isVi ? 'Ảnh trước' : 'Previous photo'}
                    className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 p-2 sm:p-3 rounded-full bg-black/35 hover:bg-[#8E3A44] text-[#F4F0E6] transition-colors"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      step(1);
                    }}
                    aria-label={isVi ? 'Ảnh tiếp theo' : 'Next photo'}
                    className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 p-2 sm:p-3 rounded-full bg-black/35 hover:bg-[#8E3A44] text-[#F4F0E6] transition-colors"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>
                </>
              )}
            </div>

            {/* Caption + thumbnails */}
            <div className="px-4 pt-3 pb-4 text-center" onClick={(e) => e.stopPropagation()}>
              {current.caption && (
                <p className="m-0 mx-auto max-w-[70ch] font-serif italic text-[#F4F0E6] text-[clamp(0.95rem,1.2vw,1.1rem)] leading-snug">
                  {current.caption}
                </p>
              )}
              {many && (
                <div className="mt-3 flex justify-center gap-2 overflow-x-auto pb-1">
                  {images.map((img, i) => (
                    <button
                      key={img.src + i}
                      type="button"
                      onClick={() => setIndex(i)}
                      aria-label={`${isVi ? 'Ảnh' : 'Photo'} ${i + 1}`}
                      className={`shrink-0 w-14 h-10 sm:w-16 sm:h-12 overflow-hidden border-2 transition-all ${
                        i === index ? 'border-[#E8D4AE] opacity-100' : 'border-transparent opacity-50 hover:opacity-90'
                      }`}
                    >
                      <img src={img.src} alt="" className="w-full h-full object-cover" draggable={false} />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </LightboxContext.Provider>
  );
};
