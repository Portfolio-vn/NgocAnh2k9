import React from 'react';
import { PageId } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { TRANSLATIONS } from '../data/translations';
import { PERSONAL_INFO } from '../data/portfolioData';
import { ScrapbookBackdrop } from './ScrapbookBackdrop';
import { PortraitFrame } from './PortraitFrame';
import { useLightbox } from './Lightbox';

const PORTRAITS = [
  '/profile/dsc-4647-opt.jpg',
  '/profile/dsc-4678-opt.jpg',
  '/profile/about-peach-opt.jpg',
  '/profile/closing-portrait.jpg'
];

interface AboutPageProps {
  onNavigate?: (page: PageId) => void;
  showSubtitle?: boolean;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onNavigate, showSubtitle = true }) => {
  const { language, isVi } = useLanguage();
  const t = TRANSLATIONS[language];
  const hasCv = Boolean(PERSONAL_INFO.cvUrl.trim());
  const { open } = useLightbox();
  const name = isVi ? 'Trần Ngọc Anh' : 'Tran Ngoc Anh';
  const openPortraits = (e: React.SyntheticEvent) => {
    e.preventDefault();
    open(PORTRAITS.map((src) => ({ src, alt: name, caption: name })), 0);
  };

  return (
    <section
      id="about"
      className="about-spread w-full min-h-[calc(100vh-3.5rem)] lg:min-h-screen bg-[#F7F4EF] text-[#292929] border-b border-[#292929]/10 flex flex-col justify-center px-6 sm:px-10 md:px-14 lg:px-16 xl:px-20 py-12 lg:py-16 xl:py-20 select-none relative overflow-hidden"
    >
      <ScrapbookBackdrop />
      <div className="about-layout max-w-6xl xl:max-w-7xl 2xl:max-w-[1500px] mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 xl:gap-16 items-stretch relative z-10">
        {/* Left Side: Large, Prominent Portrait Image */}
        <div className="about-photo lg:col-span-5 xl:col-span-5 w-full flex justify-center lg:justify-start">
          <div
            role="button"
            tabIndex={0}
            onClick={openPortraits}
            onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && openPortraits(e)}
            aria-label={`${isVi ? 'Xem ảnh lớn' : 'View photos'}: ${name}`}
            className="relative w-full max-w-lg lg:max-w-none aspect-[4/5] lg:aspect-auto lg:h-full lg:min-h-[520px] cursor-zoom-in"
          >
            <PortraitFrame
              src="/profile/dsc-4647-opt.jpg"
              alt={isVi ? 'Trần Ngọc Anh' : 'Tran Ngoc Anh'}
              imgClassName="object-[center_22%] contrast-[1.02]"
            />
          </div>
        </div>

        {/* Right Side: About content */}
        <div className="about-copy flex flex-col space-y-6 lg:col-span-7 lg:justify-center lg:space-y-8 xl:col-span-7">
          {/* Header, subtitle & primary credential */}
          <div className="section-heading">
            <span className="text-xs sm:text-sm font-mono text-[#676749] uppercase tracking-widest block font-medium">
              {t.about.sectionNum}
            </span>

            <h1 className="section-h1 font-bold tracking-tight text-[#292929] lg:whitespace-nowrap">
              {isVi ? 'Trần Ngọc Anh' : 'Tran Ngoc Anh'}
            </h1>

            {showSubtitle && (
              <p className="max-w-2xl text-lg font-normal leading-relaxed text-[#4E503B] sm:text-xl">
                {t.about.introSubtitle}
              </p>
            )}

            {/* Primary credential — left-aligned, strengthened from the old
                right-floated muted line */}
            <p className="text-xs font-mono font-semibold uppercase tracking-widest text-[#4F513B] sm:text-sm">
              {t.about.profileMeta}
            </p>
          </div>

          {/* Single divider between header and bio */}
          <div className="pt-6 border-t border-[#292929]/15">
            <div className="about-bio space-y-4 max-w-[65ch] text-[16px] font-normal leading-[1.6] text-[#292929]/85">
              {isVi ? (
                <>
                  <p>
                    Tôi thích bắt đầu một việc khi chưa biết phải làm thế nào.
                    Những năm học chuyên Hóa biến việc thử, quan sát rồi điều
                    chỉnh thành thói quen. Lần rõ nhất tôi mang thói quen ấy ra
                    khỏi phòng thí nghiệm là khi tham gia một cuộc thi kinh tế dù
                    chưa từng học bài bản, phần lớn chỉ để xem mình đi được bao
                    xa với một vấn đề hoàn toàn mới.
                  </p>
                  <p>
                    Trải nghiệm đó kéo tôi về phía những câu hỏi trong kinh
                    doanh, nơi một vấn đề có thể được đọc từ nhiều góc và hiếm
                    khi chỉ có một đáp án. Càng đi xa, tôi càng quan tâm đến cách
                    dữ liệu và công nghệ làm những vấn đề ấy sáng rõ hơn: kiểm
                    chứng điều ta vẫn mặc định, và giúp ta quyết định tốt hơn một
                    chút.
                  </p>
                </>
              ) : (
                <>
                  <p>
                    I like starting things before I know how to do them. Years
                    of studying Chemistry turned experimenting, observing and
                    adjusting into habit. The clearest time I carried that habit
                    outside the lab was entering an economics competition with
                    no formal background in the subject, mostly to see how far I
                    could get with a problem that was entirely new to me.
                  </p>
                  <p>
                    It pulled me toward business questions, where a problem can
                    be read from several angles and rarely has a single answer.
                    The further I go, the more I care about how data and
                    technology make those problems clearer: testing what we
                    assume, and helping us decide a little better.
                  </p>
                </>
              )}
            </div>
          </div>

          <div className="border-t border-[#292929]/15 pt-5 sm:pt-6">
            <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:gap-8">
              <a
                href={`mailto:${PERSONAL_INFO.email}`}
                className="border-b border-[#292929]/45 pb-0.5 text-base font-medium text-[#292929] transition-colors hover:border-[#5A6142] hover:text-[#5A6142] sm:text-[17px]"
              >
                Email: {PERSONAL_INFO.email}
              </a>

              {hasCv ? (
                <a
                  href={PERSONAL_INFO.cvUrl}
                  download
                  className="inline-flex items-center justify-center rounded-[4px] border border-[#292929]/35 px-5 py-2.5 text-xs font-mono font-medium uppercase tracking-wide text-[#292929] transition-colors hover:border-[#5A6142] hover:bg-[#5A6142] hover:text-[#F5F1E8]"
                >
                  {isVi ? 'Tải CV ↓' : 'Download CV ↓'}
                </a>
              ) : (
                <span title="Coming soon">
                  <button
                    type="button"
                    disabled
                    className="cursor-not-allowed rounded-[4px] border border-[#292929]/35 px-5 py-2.5 text-xs font-mono font-medium uppercase tracking-wide text-[#292929] opacity-40"
                  >
                    {isVi ? 'Tải CV ↓' : 'Download CV ↓'}
                  </button>
                </span>
              )}
            </div>
          </div>

          {/* Navigation to next section — left-aligned, underlined so it reads
              as a link rather than a footer note */}
          {onNavigate && (
            <div className="flex justify-start">
              <button
                onClick={() => onNavigate('honors')}
                className="group inline-flex items-center gap-2 text-xs sm:text-sm font-mono text-[#292929] hover:text-[#676749] cursor-pointer transition-colors font-medium border-b border-[#292929]/40 hover:border-[#676749] pb-0.5"
              >
                <span>{t.about.nextSection}</span>
                <span className="transition-transform duration-200 group-hover:translate-x-0.5">→</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
