"use client";

import Hero from "../_components/Hero";
import Footer from "../_components/Footer";
import BodyCardsSection from "./BodyCardsSection";
import RecentLeadsSection from "./RecentLeadsSection";
import InstagramSection from "./InstagramSection";

const KAKAO_CHAT_URL = "http://pf.kakao.com/_TWfbG";
const CALL_PHONE = "051-714-3396";
const HERO_IMAGE_SRC = "/images/hero-a.png";

type SearchParams = {
  sent?: string;
  error?: string;
};

export default function HomeClient({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const sent = searchParams.sent === "1";
  const error = searchParams.error;

  return (
    <main className="min-h-screen bg-white text-gray-900">
      {/* HERO */}
      <Hero
        kakaoChatUrl={KAKAO_CHAT_URL}
        callPhone={CALL_PHONE}
        heroImageSrc={HERO_IMAGE_SRC}
        leadAnchorId="sms-lead"
      />

      {/* 본문 카드 */}
      <BodyCardsSection />

      {/* 최근 문의 */}
      <RecentLeadsSection />

      {/* 문자 상담 요청 */}
      <section
        id="sms-lead"
        className="mx-auto w-full max-w-6xl px-4 pb-24 md:px-8"
      >
        <div className="group rounded-2xl border border-gray-800 bg-gradient-to-br from-gray-900 to-gray-800 p-5 text-white shadow-lg md:p-7">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-green-500/15 px-3 py-1 text-xs font-semibold text-green-400">
                <span aria-hidden>💬</span>
                <span>즉시 접수</span>
              </div>
              <h2 className="mt-3 text-lg font-bold md:text-xl">방문요양/등급신청 상담요청</h2>
              <p className="mt-1 text-sm text-gray-300">
                작성 즉시 담당자 휴대폰으로 문자 접수됩니다
              </p>
            </div>

            <div
              className="flex h-10 w-10 items-center justify-center rounded-2xl bg-green-500 text-white shadow-sm"
              aria-hidden
            >
              📲
            </div>
          </div>

          {sent && (
            <div className="mb-4 rounded-xl border border-green-400/30 bg-green-500/15 px-4 py-3 text-sm text-green-300">
              접수 완료! 곧 연락드릴게요 🙂
            </div>
          )}

          {error && (
            <div className="mb-4 rounded-xl border border-red-400/30 bg-red-500/15 px-4 py-3 text-sm text-red-300">
              접수에 실패했어요. 잠시 후 다시 시도해주세요. (error: {error})
            </div>
          )}

          <form action="/api/sms-lead" method="post" className="grid gap-3">
            <div className="grid gap-3 md:grid-cols-2">
              <input
                name="storeName"
                required
                maxLength={40}
                placeholder="보호자(성명)"
                className="rounded-xl border border-gray-700 bg-gray-900 px-3 py-2 text-sm text-white placeholder-gray-400 outline-none focus:ring-2 focus:ring-green-500"
              />

              <input
                name="phone"
                required
                inputMode="numeric"
                placeholder="연락처 (하이픈 없이)"
                className="rounded-xl border border-gray-700 bg-gray-900 px-3 py-2 text-sm text-white placeholder-gray-400 outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            <textarea
              name="message"
              rows={4}
              maxLength={300}
              placeholder="요청 내용 (방문요양/방문목용/등급신청동)"
              className="rounded-xl border border-gray-700 bg-gray-900 px-3 py-2 text-sm text-white placeholder-gray-400 outline-none focus:ring-2 focus:ring-green-500"
            />

            <label className="flex items-start gap-2 text-sm text-gray-300">
              <input type="checkbox" required className="mt-1 accent-green-500" />
              개인정보 수집·이용에 동의합니다
            </label>

            <button
              type="submit"
              className="mt-2 inline-flex items-center justify-center rounded-xl bg-green-500 px-4 py-3 text-sm font-semibold text-gray-900 shadow-md"
            >
              문자로 접수하기
            </button>

            <p className="text-xs text-gray-400">* 과도한 반복 접수는 제한될 수 있습니다.</p>
          </form>
        </div>
      </section>

      {/* ✅ 문자상담요청 폼 “바로 밑” 새 섹션 */}
      <InstagramSection />

      <Footer />
    </main>
  );
}
