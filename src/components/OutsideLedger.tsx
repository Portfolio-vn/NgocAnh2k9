import React, { useMemo } from 'react';
import { Expand, ImageIcon } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { seeded } from './ScrapbookBackdrop';
import { useLightbox } from './Lightbox';

// Photos for each part; the first is shown on the card, all open in the lightbox.
// An empty list shows an empty photo slot until a real photo is added.
const PHOTOS: Record<'photography' | 'music' | 'life', { src: string; en: string; vi: string }[]> = {
  photography: [
    { src: '/gallery/photography/hanoi-skyline.jpg', en: 'Hanoi skyline, a photo I took', vi: 'Toàn cảnh Hà Nội, một bức ảnh mình chụp' }
  ],
  music: [
    { src: '/gallery/piano/zhongsin-performance.jpg', en: 'Playing piano at the Zhongsin International Music Competition', vi: 'Biểu diễn piano tại cuộc thi âm nhạc quốc tế Zhongsin' },
    { src: '/gallery/piano/zhongsin-programme-cover.jpg', en: 'Programme of the 19th Zhongsin International Music Competition, Singapore 2025', vi: 'Cuốn chương trình Cuộc thi Âm nhạc Quốc tế Zhongsin lần thứ 19, Singapore 2025' }
  ],
  life: [
    { src: '/gallery/photography/friends.jpg', en: 'A moment with friends', vi: 'Một khoảnh khắc cùng bạn bè' }
  ]
};

const CONTENT = {
  en: {
    title: 'Beyond Academics',
    photoSoon: 'Photo coming soon',
    parts: [
      { key: 'photography', name: 'Photography', body: "I like taking photos of things I might otherwise walk straight past. Looking through the camera gives me a reason to stop and notice them.", alt: 'A photo I took' },
      { key: 'music', name: 'Music', body: "I make time for music too. Playing and learning at my own pace feels different from the work I do for school, and I like having that in my week.", alt: 'Playing piano at the Zhongsin International Music Competition' },
      { key: 'life', name: 'Life Beyond School', body: "Then there are the ordinary days with friends. Some of my favourite memories come from those days, so I wanted to leave a little space for them here too.", alt: 'A moment with friends' }
    ] as const
  },
  vi: {
    title: 'Ngoài Học thuật',
    photoSoon: 'Ảnh sắp được cập nhật',
    parts: [
      { key: 'photography', name: 'Nhiếp ảnh', body: "Mình thích chụp lại những thứ bình thường có khi đi qua chẳng để ý. Cầm máy lên, tự nhiên mình có lý do để dừng lại nhìn kỹ hơn một chút.", alt: "Một bức ảnh mình chụp" },
      { key: 'music', name: 'Âm nhạc', body: "Mình còn dành thời gian cho âm nhạc nữa. Ngồi chơi đàn, tập theo nhịp của mình là một cảm giác khá khác với lúc học bài, và mình thích có khoảng thời gian đó trong tuần.", alt: 'Biểu diễn piano tại cuộc thi âm nhạc quốc tế Zhongsin' },
      { key: 'life', name: 'Ngoài giờ học', body: "Còn đây là những ngày rất bình thường với bạn bè. Có nhiều kỷ niệm mình thích chỉ đơn giản như vậy, nên mình cũng muốn dành một góc trong này cho chúng.", alt: 'Một khoảnh khắc cùng bạn bè' }
    ] as const
  }
};

// Burgundy band with a wavy, ripped bottom edge showing white paper fibres.
const rippedBottom = (seed: number, base: number, amp: number) => {
  const rand = seeded(seed);
  const n = 90;
  let drift = 0;
  const pts = ['0% 0%', '100% 0%'];
  for (let i = n; i >= 0; i--) {
    drift = Math.max(-1, Math.min(1, drift + (rand() - 0.5) * 0.5));
    const t = i / n;
    const wave = Math.sin(t * Math.PI * 2.2 + 0.6) * 0.6 + drift * 0.4;
    pts.push(`${t * 100}% ${base + wave * amp + (rand() - 0.5) * 1.6}%`);
  }
  return `polygon(${pts.join(',')})`;
};

const tornBottom = (seed: number) => {
  const rand = seeded(seed);
  const pts = ['0% 0%', '100% 0%'];
  const steps = 60;
  for (let i = steps; i >= 0; i--) pts.push(`${(i / steps) * 100}% ${86 + (rand() - 0.5) * 8}%`);
  return `polygon(${pts.join(',')})`;
};

const Stripes: React.FC<{ className: string }> = ({ className }) => (
  <div
    className={`absolute w-[clamp(44px,4vw,76px)] h-[clamp(36px,3.4vw,58px)] ${className}`}
    style={{ background: 'repeating-linear-gradient(90deg, #D8B98C 0 4px, #C9A574 4px 6px, #E2C79E 6px 9px)' }}
    aria-hidden="true"
  />
);

// Kraft tape with a faint leaf line pattern, as in the template.
const LeafTape: React.FC<{ className: string }> = ({ className }) => (
  <span
    className={`absolute w-[clamp(90px,11vw,180px)] h-[clamp(34px,3.6vw,56px)] bg-[#B8946A] z-10 shadow-[0_1px_2px_rgba(60,30,20,0.25)] ${className}`}
    style={{
      backgroundImage:
        'repeating-linear-gradient(60deg, transparent 0 9px, rgba(46,26,22,0.35) 9px 10px), repeating-linear-gradient(-60deg, transparent 0 9px, rgba(46,26,22,0.25) 9px 10px)'
    }}
    aria-hidden="true"
  />
);

/** Outside the Ledger: photography, music and life beyond school, three photos on a burgundy band. */
export const OutsideLedger: React.FC = () => {
  const { isVi } = useLanguage();
  const { open } = useLightbox();
  const c = isVi ? CONTENT.vi : CONTENT.en;
  const bandClip = useMemo(() => rippedBottom(71, 90, 4), []);
  const fibreClip = useMemo(() => rippedBottom(71, 93, 4.4), []);
  const bannerClip = useMemo(() => tornBottom(83), []);

  return (
    <section
      id="outside"
      className="relative w-full min-h-[calc(100svh-3.5rem)] flex items-center justify-center bg-[#C9A97E] bg-[url('/landing/collage.jpg')] bg-cover bg-[position:4%_50%] lg:bg-center px-3 py-6 sm:px-6 sm:py-8 lg:px-[2.5%] lg:py-[2.5%] overflow-hidden select-none"
    >
      {/* Board */}
      <div className="relative w-full max-w-[1600px] min-h-[min(calc(100svh-3.5rem-5vw),860px)] bg-[#E9E7E3] shadow-[0_6px_22px_rgba(40,25,10,0.45)] p-[clamp(12px,2.2%,34px)] pl-[clamp(20px,6%,96px)] flex">
        <div className="absolute top-0 bottom-0 left-[3.2%] w-[3px] bg-[#8E3A44]/45" aria-hidden="true" />
        <Stripes className="-top-[3px] right-[2.5%] z-10" />
        <Stripes className="-bottom-[3px] right-[2.5%] z-10" />

        {/* Ruled sheet */}
        <div
          className="relative flex-1 bg-[#F4F0E6] shadow-[0_3px_10px_rgba(40,10,10,0.18)] px-[clamp(16px,3.5%,64px)] pt-[clamp(20px,2%,30px)] pb-[clamp(24px,3%,44px)] flex flex-col"
          style={{
            backgroundImage:
              'repeating-linear-gradient(180deg, transparent 0 calc(3.2rem - 1px), rgba(150,120,100,0.14) calc(3.2rem - 1px) 3.2rem)'
          }}
        >
          {/* Binder slots either side of the banner */}
          <div className="hidden md:flex absolute top-[clamp(18px,2.6%,34px)] left-[4%] right-[4%] justify-between pointer-events-none" aria-hidden="true">
            {[0, 1].map((side) => (
              <span key={side} className="flex gap-[1.2vw]">
                {[0, 1, 2].map((k) => (
                  <span key={k} className="block w-[clamp(40px,5vw,90px)] h-[clamp(10px,1.1vw,18px)] rounded-[3px] bg-[#8E3A44]/80" />
                ))}
              </span>
            ))}
          </div>

          {/* Paper clip */}
          <svg viewBox="0 0 40 100" className="absolute -top-[4%] left-[4%] w-[clamp(22px,2.4vw,40px)] z-10" aria-hidden="true">
            <path d="M14 72 V20 a8 8 0 0 1 16 0 V80 a12 12 0 0 1 -24 0 V30" fill="none" stroke="#3A2620" strokeWidth="4" strokeLinecap="round" />
          </svg>

          {/* Torn title banner with tape */}
          <div className="relative mx-auto w-full max-w-[620px]">
            <span className="absolute -top-[clamp(8px,1vw,16px)] left-1/2 -translate-x-1/2 rotate-[2deg] w-[34%] h-[clamp(24px,2.6vw,40px)] bg-[#B8946A] z-10" aria-hidden="true" />
            <div className="[filter:drop-shadow(0_3px_4px_rgba(60,40,20,0.2))]">
              <div className="bg-[#E8D4AE] px-6 pt-[clamp(20px,2.4vw,34px)] pb-[clamp(26px,3vw,44px)] text-center" style={{ clipPath: bannerClip }}>
                <h2 className="m-0 font-serif italic font-semibold text-[#2E1A16] leading-[1.05] tracking-[-0.01em] text-[clamp(2.1rem,3.8vw,3.8rem)]">
                  {c.title}
                </h2>
              </div>
            </div>
          </div>

          {/* Burgundy band */}
          <div className="relative flex-1 mt-[clamp(28px,3.4vw,52px)] flex flex-col">
            <LeafTape className="-top-[clamp(14px,1.6vw,24px)] -left-[1.5%] -rotate-[32deg]" />
            <LeafTape className="-top-[clamp(14px,1.6vw,24px)] -right-[1.5%] rotate-[32deg]" />
            <div className="relative flex-1 flex flex-col">
              {/* White fibre showing under the ripped edge */}
              <div className="absolute inset-0 bg-[#FBF9F5]" style={{ clipPath: fibreClip }} aria-hidden="true" />
              <div className="relative flex-1 bg-[#8E3A44] px-[clamp(16px,4%,72px)] pt-[clamp(26px,3vw,46px)] pb-[clamp(56px,7vw,110px)]" style={{ clipPath: bandClip }}>
                <ul className="m-0 p-0 list-none grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-[5%]">
                  {c.parts.map((part, i) => {
                    const photos = PHOTOS[part.key].map((p) => ({ src: p.src, alt: isVi ? p.vi : p.en, caption: isVi ? p.vi : p.en }));
                    const src = photos[0]?.src;
                    return (
                      <li key={part.key} className="min-w-0 text-center">
                        <div
                          className={`mx-auto w-full max-w-[380px] bg-[#FFFDF8] p-[4%] shadow-[0_4px_12px_rgba(30,10,10,0.35)] ${
                            ['-rotate-[1.5deg]', 'rotate-[1deg]', '-rotate-[0.6deg]'][i]
                          }`}
                        >
                          <div className="aspect-[4/3] overflow-hidden bg-[#E6DCC9] flex items-center justify-center">
                            {src ? (
                              <button
                                type="button"
                                onClick={() => open(photos, 0)}
                                aria-label={`${isVi ? 'Xem ảnh lớn' : 'View photo'}: ${part.alt}`}
                                className="group relative block w-full h-full cursor-zoom-in"
                              >
                                <img src={src} alt={part.alt} className="w-full h-full object-cover object-[35%_60%] transition-transform duration-500 group-hover:scale-[1.04]" />
                                <span className="absolute right-[5%] bottom-[5%] flex items-center gap-1 rounded-full bg-[#2E1A16]/70 text-[#F4F0E6] text-[10px] font-semibold tracking-[0.08em] px-2 py-1 opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 transition-opacity">
                                  <Expand className="w-3 h-3" />
                                  {photos.length > 1 ? `${photos.length} ${isVi ? 'ảnh' : 'photos'}` : isVi ? 'Xem ảnh lớn' : 'View photo'}
                                </span>
                              </button>
                            ) : (
                              <span className="flex flex-col items-center gap-1.5 text-[#3D2A24]/50 text-[10px] uppercase tracking-[0.14em] px-2">
                                <ImageIcon className="w-5 h-5" strokeWidth={1.4} />
                                {c.photoSoon}
                              </span>
                            )}
                          </div>
                        </div>
                        <h3 className="mt-[clamp(16px,1.8vw,26px)] m-0 font-serif italic font-semibold text-[#F4F0E6] leading-none text-[clamp(1.45rem,2.1vw,2.2rem)]">
                          {part.name}
                        </h3>
                        <p className="mt-2.5 m-0 mx-auto max-w-[32ch] text-[clamp(0.88rem,0.98vw,1rem)] leading-[1.6] text-[#F4F0E6]/88">{part.body}</p>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
