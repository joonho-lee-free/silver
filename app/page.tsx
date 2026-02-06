// app/page.tsx
import type { Metadata } from "next";
import HomeClient from "./_sections/HomeClient";

export const metadata: Metadata = {
  // ✅ 메인 키워드(닭꼬치) 중심 타이틀
  title: "방문요양·방문목욕 | 돌봄서비스 - 하온노인복지",

  // ✅ 검색 결과 설명 (B2B 의도 명확)
  description:
    "어르신이 살던 곳에서 안전하고 편안한 돌봄을 제공, 장기요양등급 신청도움",

  // ✅ canonical (중복 URL 방지)
  alternates: {
    canonical: "https://haccp4553.vercel.app",
  },

  // ✅ 공유(카톡/네이버/페북 등)용 메타
  openGraph: {
    title: "방문요양·방문목욕 | 돌봄서비스 - 하온노인복지",
    description:
      "어르신이 살던 곳에서 안전하고 편안한 돌봄을 제공, 장기요양등급 신청도움",
    url: "https://haccp4553.vercel.app",
    siteName: "하온노인복지",
    type: "website",
    locale: "ko_KR",
  },

  // ✅ 키워드 보강 (검색엔진 신호)
  keywords: [
    "닭꼬치",
    "순살닭꼬치",
    "닭꼬치 도매",
    "닭꼬치 납품",
    "업소용 닭꼬치",
    "닭꼬치 공장",
    "닭꼬치 HACCP",
    "이가에프엔비",
  ],
};

type SearchParams = {
  sent?: string;
  error?: string;
};

export default async function Page({
  searchParams,
}: {
  searchParams?: Promise<SearchParams> | SearchParams;
}) {
  // ✅ 기존 searchParams 처리 로직 그대로 유지
  const sp: SearchParams =
    searchParams && typeof (searchParams as any)?.then === "function"
      ? await (searchParams as Promise<SearchParams>)
      : ((searchParams as SearchParams) ?? {});

  // ✅ 기존 HomeClient 연결 로직 그대로 유지
  return <HomeClient searchParams={sp} />;
}
