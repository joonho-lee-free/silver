// app/_sections/ProcessSection.tsx
"use client";

export default function ProcessSection() {
  return (
    <div className="group rounded-2xl border border-rose-100 bg-rose-50/40 p-6 ring-1 ring-rose-100 transition-all duration-200 ease-out hover:-translate-y-1 hover:border-rose-200 hover:bg-rose-50/60 hover:shadow-lg hover:shadow-rose-100/50 hover:ring-rose-200 active:translate-y-0 md:p-8">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full bg-rose-100 px-3 py-1 text-xs font-semibold text-rose-900">
            <span aria-hidden>🧾</span>
            <span>이용 안내</span>
          </div>
          <h2 className="mt-3 text-lg font-bold md:text-xl">
           방문요양 이용 절차
          </h2>
          <p className="mt-1 text-sm text-gray-600">
            처음 상담부터 <span className="font-semibold text-gray-800">서비스 시작까지</span>
            &nbsp;복잡하지 않게 <span className="font-semibold text-gray-800">안내해 드립니다.</span>
          </p>
        </div>

        <div
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-rose-600 text-white shadow-sm transition-transform duration-200 ease-out group-hover:scale-105"
          aria-hidden
        >
          🧾
        </div>
      </div>

      {/* 텍스트 절차 안내 */}
      <ol className="mt-4 grid gap-2 text-sm text-gray-800 md:grid-cols-2">
        <li>1️⃣ <strong>상담 신청</strong> (전화, 문자, 카카오톡으로)</li>
        <li>
            2️⃣ <strong>어르신 상태 확인</strong> (어르신의 건강 상태와 생활 환경을 간단히 확인합니다)</li>

        <li>3️⃣ <strong>요양보호사 매칭</strong> (어르신 상황에 맞는 요양보호사를 배정합니다.)</li>
        <li>4️⃣ <strong>방문요양 시작</strong>(일정에 맞춰 방문요양 서비스를 시작합니다.)</li>
      </ol>

      <p className="mt-3 text-sm text-gray-600">
        ※ 필요한 서류와 절차는 상담 과정에서 자세히 안내해드립니다.
      </p>

      <div
        className="mt-5 h-1 w-full rounded-full bg-rose-200 transition-opacity duration-200 group-hover:opacity-90"
        aria-hidden
      />
    </div>
  );
}
