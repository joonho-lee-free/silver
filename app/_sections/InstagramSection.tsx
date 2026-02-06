"use client";

import InstagramEmbedGrid from "./InstagramEmbedGrid";

export default function InstagramSection() {
  // ✅ 여기에 "공개 게시물 URL" 9개를 직접 넣어야 실제 게시물이 뜹니다.
  // 형식 예) https://www.instagram.com/p/XXXXXXXXX/
  const postUrls = [
    "https://www.instagram.com/p/CzvoZctROEI/?img_index=1",
    // "https://www.instagram.com/p/POST_ID_2/",
    // "https://www.instagram.com/p/POST_ID_3/",
    // ...
  ];

  return (
    <section className="mx-auto w-full max-w-6xl px-4 pb-24 md:px-8">
      <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm md:p-7">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-700">
              <span aria-hidden>📷</span>
              <span>Instagram</span>
            </div>
            <h2 className="mt-3 text-lg font-bold md:text-xl">
              최근 인스타 게시물
            </h2>
            <p className="mt-1 text-sm text-gray-600">
              인스타 공개 게시물만 표시됩니다 (비공개/퍼가기 제한 게시물은 노출 불가)
            </p>
          </div>
        </div>

        <InstagramEmbedGrid postUrls={postUrls} />

        <div className="mt-4">
          <a
            href="https://www.instagram.com/"
            target="_blank"
            rel="noreferrer"
            className="text-sm font-semibold text-gray-800 underline underline-offset-4"
          >
            인스타그램에서 더보기
          </a>
        </div>
      </div>
    </section>
  );
}
