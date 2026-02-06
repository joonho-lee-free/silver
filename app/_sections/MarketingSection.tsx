"use client";

import { useEffect, useState } from "react";

const MARKETING_IMAGES = [
  {
    src: "/images/marketingsection/marketing-01.jpg",
    alt: "프랜차이즈 홈페이지구축",
    label: "상담신청",
  },
  {
    src: "/images/marketingsection/marketing-02.jpg",
    alt: "신규가맹점 유치",
    label: "건강보험공단 서류신청",
  },
  {
    src: "/images/marketingsection/marketing-03.jpg",
    alt: "유통라인업",
    label: "방문조사",
  },
  {
    src: "/images/marketingsection/marketing-04.jpg",
    alt: "온라인홍보",
    label: "등급판정",
  },
] as const;

export default function MarketingSection() {
  // ✅ 추가: 클릭한 이미지 확대(라이트박스)
  const [openImage, setOpenImage] = useState<string | null>(null);

  // ✅ 추가: ESC로 닫기 + 열려있을 때 배경 스크롤 방지
  useEffect(() => {
    if (!openImage) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpenImage(null);
    };

    document.addEventListener("keydown", onKeyDown);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = prevOverflow;
    };
  }, [openImage]);

  return (
    <div className="group rounded-2xl border border-cyan-100 bg-cyan-50/40 p-6 ring-1 ring-cyan-100 transition-all duration-200 ease-out hover:-translate-y-1 hover:border-cyan-200 hover:bg-cyan-50/60 hover:shadow-lg hover:shadow-cyan-100/50 hover:ring-cyan-200 active:translate-y-0 md:p-8">
      {/* ✅ 그리드 강제 (전역 CSS 방어) */}
      <style jsx global>{`
        .ss-marketing-grid {
          display: grid !important;
          grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
          gap: 8px !important;
          align-items: stretch !important;
        }
        @media (min-width: 768px) {
          .ss-marketing-grid {
            grid-template-columns: repeat(4, minmax(0, 1fr)) !important;
            gap: 12px !important;
          }
        }
        .ss-marketing-grid > * {
          min-width: 0 !important;
          width: auto !important;
          max-width: none !important;
        }
      `}</style>

      {/* 헤더 */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full bg-cyan-100 px-3 py-1 text-xs font-semibold text-cyan-900">
            <span aria-hidden>📣</span>
            <span>신청절차</span>
          </div>

          <h2 className="mt-3 text-lg font-bold text-gray-900 md:text-xl">
            장기요양등급 신청 안내
          </h2>

          <p className="mt-2 text-sm text-gray-700">
            신청과정이 어려우면 하온이 함께 도와드립니다.
          </p>
        </div>

        <div
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-cyan-600 text-white shadow-sm transition-transform duration-200 ease-out group-hover:scale-105"
          aria-hidden
        >
          📣
        </div>
      </div>

      {/* 안내 문구 */}
      <ul className="mt-4 grid gap-3 text-sm text-gray-800 md:grid-cols-2">
        <li>1️⃣<strong>상담 및 신청 안내</strong><p>&nbsp;&nbsp;&nbsp;&nbsp;등급 신청 가능 여부와 필요 서류를 상담으로 안내</p> </li>
        <li>2️⃣<strong>국민건강보험공단 신청</strong><p>&nbsp;&nbsp;&nbsp;&nbsp;국민건강보험공단에 장기요양등급을 신청</p> </li>
        <li>3️⃣<strong>방문 조사 진행</strong><p>&nbsp;&nbsp;&nbsp;&nbsp;공단 조사원이 어르신 댁을 방문 생활 상태를 확인</p> </li>
        <li>4️⃣<strong>등급 판정</strong><p>&nbsp;&nbsp;&nbsp;&nbsp;심사를 거쳐 장기요양등급이 결정</p> </li>
      </ul>

      <p className="mt-3 text-sm text-gray-600">등급이 없더라도 상담부터 가능합니다 / 신청 과정이 어렵다면 함께 도와드립니다.</p>

      {/* 이미지 4장 + 오더 섹션과 동일한 오버레이 */}
      <div className="ss-marketing-grid mt-4">
        {MARKETING_IMAGES.map((img) => (
          <div
            key={img.src}
            className="min-w-0 overflow-hidden rounded-xl border border-cyan-100 bg-white/70 ring-1 ring-cyan-100/60"
          >
            <div className="relative w-full" style={{ aspectRatio: "4 / 3" }}>
              <img
                src={img.src}
                alt={img.alt}
                loading="lazy"
                onClick={() => setOpenImage(img.src)} // ✅ 클릭 시 확대
                className="absolute inset-0 h-full w-full cursor-zoom-in object-cover object-center"
              />

              {/* 하단 그라데이션 (오더 섹션 동일) */}
              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/55 to-transparent" />

              {/* 우측하단 칩 (오더 섹션과 동일) */}
              <div className="absolute bottom-2 right-2 z-10 rounded-md bg-black/35 px-2 py-1 text-xs font-bold text-white backdrop-blur-sm md:bottom-3 md:right-3 md:text-sm">
                {img.label}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div
        className="mt-5 h-1 w-full rounded-full bg-cyan-200 transition-opacity duration-200 group-hover:opacity-90"
        aria-hidden
      />

      {/* ✅ 추가: 라이트박스(뉴스처럼 크게 보기) + 닫기 버튼 */}
      {openImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
          onClick={() => setOpenImage(null)} // ✅ 배경 클릭하면 닫힘
          role="dialog"
          aria-modal="true"
          aria-label="이미지 확대 보기"
        >
          <div className="relative" onClick={(e) => e.stopPropagation()}>
            {/* ✅ 닫기 버튼 (우상단 X) */}
            <button
              type="button"
              onClick={() => setOpenImage(null)}
              className="absolute -right-3 -top-3 inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-gray-900 shadow-lg ring-1 ring-black/10 transition hover:bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
              aria-label="닫기"
            >
              <span className="text-xl leading-none">×</span>
            </button>

            {/* ✅ 확대 이미지 */}
            <img
              src={openImage}
              alt="확대 이미지"
              className="max-h-[90vh] max-w-[90vw] rounded-lg object-contain shadow-2xl"
            />

            {/* ✅ 안내 문구 */}
            <div className="mt-3 text-center text-xs text-white/80">
              배경을 누르거나 <b>ESC</b> 또는 <b>×</b>로 닫을 수 있어요.
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
