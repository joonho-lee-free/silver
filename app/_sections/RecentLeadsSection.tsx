"use client";

import RecentLeads from "../_components/RecentLeads";

export default function RecentLeadsSection() {
  // ✅ 섹션에서 정책(강조색 팔레트)을 결정 → 컴포넌트로 전달
  const highlightStyles = [
    { bg: "bg-indigo-50/70", border: "border-indigo-500" },
    { bg: "bg-sky-50/70", border: "border-sky-500" },
    { bg: "bg-emerald-50/70", border: "border-emerald-500" },
    { bg: "bg-amber-50/70", border: "border-amber-500" },
    { bg: "bg-rose-50/70", border: "border-rose-500" },
  ] as const;

  return (
    <section className="mx-auto w-full max-w-6xl px-2 pb-12 sm:px-4 md:px-8">
      {/* ✅ RecentLeads(내부 표 카드) 폭/폰트 모바일 최적화: 로직은 그대로 */}
      <style jsx global>{`
        .ss-recent-leads > * {
          width: 100% !important;
          max-width: none !important;
          margin-left: 0 !important;
          margin-right: 0 !important;
        }
        .ss-recent-leads *[class*="max-w"] {
          max-width: none !important;
        }
        .ss-recent-leads table {
          width: 100% !important;
          table-layout: fixed;
          border-collapse: separate;
          border-spacing: 0;
        }
        .ss-recent-leads th,
        .ss-recent-leads td {
          white-space: normal;
          word-break: keep-all;
        }
        @media (max-width: 640px) {
          .ss-recent-leads table th,
          .ss-recent-leads table td {
            font-size: 10px !important;
            line-height: 1.25 !important;
            padding: 8px 6px !important;
          }
          .ss-recent-leads th:nth-child(1),
          .ss-recent-leads td:nth-child(1) {
            width: 14%;
          }
          .ss-recent-leads th:nth-child(2),
          .ss-recent-leads td:nth-child(2) {
            width: 26%;
            word-break: break-all;
          }
          .ss-recent-leads th:nth-child(3),
          .ss-recent-leads td:nth-child(3) {
            width: 14%;
          }
          .ss-recent-leads th:nth-child(4),
          .ss-recent-leads td:nth-child(4) {
            width: 28%;
          }
          .ss-recent-leads th:nth-child(5),
          .ss-recent-leads td:nth-child(5) {
            width: 18%;
            white-space: nowrap;
            text-align: right;
          }
        }
      `}</style>

      <div className="group rounded-2xl border border-indigo-100 bg-indigo-50/40 p-4 ring-1 ring-indigo-100 transition-all duration-200 ease-out hover:-translate-y-1 hover:border-indigo-200 hover:bg-indigo-50/60 hover:shadow-lg hover:shadow-indigo-100/50 hover:ring-indigo-200 sm:p-5 md:p-8">
        {/* 헤더 */}
        <div className="mb-4 flex items-center justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-indigo-100 px-3 py-1 text-xs font-semibold text-indigo-800">
              <span aria-hidden>🟢</span>
              <span>상담신청현황</span>
            </div>
            <h2 className="mt-3 text-lg font-bold md:text-xl">최근 문의 현황</h2>
            <p className="mt-1 text-sm text-gray-600">
              실제 접수된 문의가 실시간으로 표시됩니다
            </p>
          </div>

          <div
            className="flex h-10 w-10 items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-sm transition-transform duration-200 group-hover:scale-105"
            aria-hidden
          >
            📩
          </div>
        </div>

        {/* ✅ RecentLeads 출력(로직 그대로) + 정책(강조색)만 섹션에서 내려줌 */}
        <div className="ss-recent-leads">
          <RecentLeads highlightStyles={highlightStyles} />
        </div>

        <div className="mt-5 h-1 w-full rounded-full bg-indigo-200" aria-hidden />
      </div>
    </section>
  );
}
