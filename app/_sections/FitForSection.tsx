"use client";

import { useEffect, useState } from "react";

const FIT_IMAGES = [
  {
    src: "/images/fitforsection/fit-01.jpg",
    alt: "닭꼬치 굽는 장면",
    label: "혼자계시는 부모님",
  },
  {
    src: "/images/fitforsection/fit-02.jpg",
    alt: "야시장/행사 운영 분위기",
    label: "치매초기",
  },
  {
    src: "/images/fitforsection/fit-03.jpg",
    alt: "푸드트럭 운영 장면",
    label: "병원 퇴원 후 회복",
  },
  {
    src: "/images/fitforsection/fit-04.jpg",
    alt: "매장 운영 참고 이미지",
    label: "거동불편 집안일",
  },
] as const;

export default function FitForSection() {
  // ✅ 클릭한 이미지 확대(라이트박스)
  const [openImage, setOpenImage] = useState<string | null>(null);

  // ✅ ESC로 닫기 + 열려있을 때 배경 스크롤 방지
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
    <div className="group rounded-2xl border border-blue-100 bg-blue-50/40 p-6 ring-1 ring-blue-100 transition-all duration-200 ease-out hover:-translate-y-1 hover:border-blue-200 hover:bg-blue-50/60 hover:shadow-lg hover:shadow-blue-100/50 hover:ring-blue-200 active:translate-y-0 md:p-8">
      {/* ✅ 전역 CSS가 있어도 “한줄 4장” 절대 안 깨지게 강제 */}
      <style jsx global>{`
        .ss-fit-grid {
          display: grid !important;
          grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
          gap: 8px !important;
          align-items: stretch !important;
        }
        @media (min-width: 768px) {
          .ss-fit-grid {
            grid-template-columns: repeat(4, minmax(0, 1fr)) !important;
            gap: 12px !important;
          }
        }
        .ss-fit-grid > * {
          min-width: 0 !important;
          width: auto !important;
          max-width: none !important;
        }
      `}</style>

      {/* 헤더 */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-800">
            <span aria-hidden>🎯</span>
            <span>추천 대상</span>
          </div>
          <h2 className="mt-3 text-lg font-bold md:text-xl">
            이런 경우 방문요양이 필요합니다
          </h2>
        </div>
        

        <div
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-sm transition-transform duration-200 ease-out group-hover:scale-105"
          aria-hidden
        >
          🎯
        </div>
      </div>
      <p className="mt-4 text-base leading-relaxed text-gray-700 md:text-lg">
            <span className="font-semibold text-gray-900">
             부모님이 익숙한 집에서 생활을 유지하면서
            </span>
            <br />
            <span className="text-gray-600">
              일상 돌봄을 안전하게 받도록 돕는 서비스입니다
            </span>
          </p>

      {/* 안내데이터 */}
      <ul className="mt-4 grid gap-2 text-sm text-gray-800 md:grid-cols-2">
        <li><strong>✔ 혼자 계시는 부모님이 걱정될 때</strong><p>&nbsp;&nbsp;&nbsp;식사·안전·복약 등 일상 관리를 도와드립니다.</p></li>
        <li><strong>✔ 거동이 불편해 집안일이 힘드실 때</strong><p>&nbsp;&nbsp;&nbsp;이동 보조와 기본적인 생활 지원을 제공합니다.</p></li>
        <li><strong>✔ 치매 초기로 일상 점검이 필요할 때</strong><p>&nbsp;&nbsp;&nbsp;무리 없는 일상 복귀를 위해 돌봄을 연결합니다.</p></li>
        <li><strong>✔ 병원 퇴원 후 회복 기간에 도움이 필요할때</strong><p>&nbsp;&nbsp;&nbsp;필요 시간만큼 돌봄을 받아 부담을 줄일 수 있습니다.</p></li>
        <li><strong>✔요양원 입소는 아직 고민될 때</strong><p>&nbsp;&nbsp;&nbsp;먼저 집에서 시작해보는 돌봄 방법이 될 수 있습니다.</p></li>
      </ul>

      <p className="mt-3 text-sm text-gray-600">
        ※ 의료행위는 하지 않으며, <b>일상생활 보조 중심</b>으로 진행됩니다.
      </p>

      {/* ✅ 이미지 4장: PC 한줄 / 모바일 2x2 + 텍스트 오버레이 */}
      <div className="ss-fit-grid mt-4">
        {FIT_IMAGES.map((img) => (
          <div
            key={img.src}
            className="min-w-0 overflow-hidden rounded-xl border border-blue-100 bg-white/60 ring-1 ring-blue-100/60"
          >
            {/* 프레임(클리핑 마스크) */}
            <div className="relative w-full" style={{ aspectRatio: "4 / 3" }}>
              {/* 이미지 (✅ 클릭 시 확대) */}
              <img
                src={img.src}
                alt={img.alt}
                loading="lazy"
                onClick={() => setOpenImage(img.src)}
                className="absolute inset-0 h-full w-full cursor-zoom-in object-cover object-center"
              />

              {/* ✅ 텍스트가 안 묻히게: 어두운 그라데이션 레이어 */}
              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/55 to-transparent" />

              {/* ✅ 오른쪽 하단 텍스트 (흰색/볼드) + z-index */}
              <div className="absolute bottom-2 right-2 z-10 rounded-md bg-black/35 px-2 py-1 text-xs font-bold text-white backdrop-blur-sm md:bottom-3 md:right-3 md:text-sm">
                {img.label}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-5 h-1 w-full rounded-full bg-blue-200" aria-hidden />

      {/* ✅ 라이트박스(뉴스처럼 클릭하면 크게 보기) + 닫기 버튼 */}
      {openImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
          onClick={() => setOpenImage(null)} // ✅ 배경 클릭하면 닫힘
          role="dialog"
          aria-modal="true"
          aria-label="이미지 확대 보기"
        >
          {/* ✅ 중앙 컨테이너 (닫기 버튼 포함) */}
          <div
            className="relative"
            onClick={(e) => e.stopPropagation()} // ✅ 이미지 영역 클릭은 닫히지 않게
          >
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

            {/* ✅ 하단 힌트(선택): 뉴스처럼 안내 문구 */}
            <div className="mt-3 text-center text-xs text-white/80">
              배경을 누르거나 <b>ESC</b> 또는 <b>×</b>로 닫을 수 있어요.
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
