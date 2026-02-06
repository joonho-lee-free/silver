"use client";

import { useEffect, useState } from "react";

const ORDER_IMAGES = [
  { src: "/images/ordersection/order-01.jpg", alt: "앱 주문", label: "정부지원" },
  { src: "/images/ordersection/order-02.jpg", alt: "품목/수량 확인", label: "등급신청방법" },
  { src: "/images/ordersection/order-03.jpg", alt: "전용계좌 충전", label: "센타상담" },
  { src: "/images/ordersection/order-04.jpg", alt: "주문/배송 관리", label: "서비스제공" },
] as const;

export default function OrderGoSection() {
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
    <div className="group rounded-2xl border border-amber-100 bg-amber-50/40 p-6 ring-1 ring-amber-100 transition-all duration-200 ease-out hover:-translate-y-1 hover:border-amber-200 hover:bg-amber-50/60 hover:shadow-lg hover:shadow-amber-100/50 hover:ring-amber-200 active:translate-y-0 md:p-8">
      <style jsx global>{`
        .ss-order-grid {
          display: grid !important;
          grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
          gap: 8px !important;
          align-items: stretch !important;
        }
        @media (min-width: 768px) {
          .ss-order-grid {
            grid-template-columns: repeat(4, minmax(0, 1fr)) !important;
            gap: 12px !important;
          }
        }
        .ss-order-grid > * {
          min-width: 0 !important;
          width: auto !important;
          max-width: none !important;
        }
      `}</style>

      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-900">
            <span aria-hidden>📲</span>
            <span>등급 신청 안내</span>
          </div>
          <h2 className="mt-3 text-lg font-bold md:text-xl">
            장기요양등급 신청부터 도와드립니다
          </h2>
          <p>방문요양 이용을 위해 필요한 <strong>장기요양등급 신청 절차</strong>를 처음부터 안내해드립니다.</p>
        </div>

        <div
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-amber-600 text-white shadow-sm transition-transform duration-200 ease-out group-hover:scale-105"
          aria-hidden
        >
          📲
        </div>
      </div>

      <ul className="mt-4 grid gap-3 text-sm text-gray-800 md:grid-cols-2">
        <li>✔ 혼자 생활이 점점 어려워진 경우</li>
        <li>✔ 거동이 불편해 일상 도움이 필요한 경우</li>
        <li>✔ 치매가 의심되거나 진단을 받은 경우</li>
        <li>✔ 보호자의 지속적인 돌봄이 어려운 경우</li>
      </ul>

      <p className="mt-3 text-sm text-gray-900">
        등급 신청에는 비용이 들지 않습니다.
      </p>

      {/* ✅ 이미지 4장 + (추가) 클릭 시 확대 */}
      <div className="ss-order-grid mt-4">
        {ORDER_IMAGES.map((img) => (
          <div
            key={img.src}
            className="min-w-0 overflow-hidden rounded-xl border border-amber-100 bg-white/60 ring-1 ring-amber-100/60"
          >
            <div className="relative w-full" style={{ aspectRatio: "4 / 3" }}>
              <img
                src={img.src}
                alt={img.alt}
                loading="lazy"
                onClick={() => setOpenImage(img.src)} // ✅ 클릭 시 확대
                className="absolute inset-0 h-full w-full cursor-zoom-in object-cover object-center"
              />
              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/55 to-transparent" />
              <div className="absolute bottom-2 right-2 z-10 rounded-md bg-black/35 px-2 py-1 text-xs font-bold text-white backdrop-blur-sm md:bottom-3 md:right-3 md:text-sm">
                {img.label}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div
        className="mt-5 h-1 w-full rounded-full bg-amber-200 transition-opacity duration-200 group-hover:opacity-90"
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
