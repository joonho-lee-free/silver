"use client";

import { useEffect, useMemo, useState } from "react";
import {
  collection,
  limit,
  onSnapshot,
  orderBy,
  query,
  Timestamp,
} from "firebase/firestore";
import { db } from "../../lib/firebaseClient";

type PublicLead = {
  id: string;
  displayName: string;
  displayPhone: string;
  displayRegion: string;
  inquiryType: string;
  createdAt: Timestamp;
};

type HighlightStyle = { bg: string; border: string };

type Props = {
  highlightStyles?: ReadonlyArray<HighlightStyle>;
};

function timeAgo(ts: Timestamp) {
  const diff = Date.now() - ts.toMillis();
  const min = Math.floor(diff / 60000);
  if (min < 1) return "방금 전";
  if (min < 60) return `${min}분 전`;
  const h = Math.floor(min / 60);
  if (h < 24) return `${h}시간 전`;
  return `${Math.floor(h / 24)}일 전`;
}

function rotateLeft<T>(arr: T[], k: number) {
  if (arr.length === 0) return arr;
  const n = arr.length;
  const m = ((k % n) + n) % n;
  return arr.slice(m).concat(arr.slice(0, m));
}

/** 🔹 성명 분리: 앞 2글자 normal / 나머지 bold */
function SplitName({ name, active }: { name: string; active: boolean }) {
  if (!active) return <span>{name}</span>;

  const head = name.slice(0, 2);
  const tail = name.slice(2);

  return (
    <>
      <span className="font-normal">{head}</span>
      {tail && <span className="font-bold">{tail}</span>}
    </>
  );
}

// ✅ 기본 최신 강조 팔레트(섹션에서 안 내려주면 이걸 사용)
const DEFAULT_HIGHLIGHT_STYLES: ReadonlyArray<HighlightStyle> = [
  { bg: "bg-indigo-50/70", border: "border-indigo-500" },
  { bg: "bg-sky-50/70", border: "border-sky-500" },
  { bg: "bg-emerald-50/70", border: "border-emerald-500" },
  { bg: "bg-amber-50/70", border: "border-amber-500" },
  { bg: "bg-rose-50/70", border: "border-rose-500" },
];

export default function RecentLeads({ highlightStyles }: Props) {
  const palette =
    highlightStyles && highlightStyles.length > 0
      ? highlightStyles
      : DEFAULT_HIGHLIGHT_STYLES;

  const [rows, setRows] = useState<PublicLead[]>([]);
  const [shift, setShift] = useState(0);

  /** ✅ Firestore 최근 10개: public_leads만 조회 */
  useEffect(() => {
    const q = query(
      collection(db, "public_leads"),
      orderBy("createdAt", "desc"),
      limit(10)
    );

    const unsub = onSnapshot(q, (snap) => {
      const list: PublicLead[] = snap.docs.map((d) => {
        const data = d.data() as any;
        return {
          id: d.id,
          displayName: data.displayName ?? "-",
          displayPhone: data.displayPhone ?? "-",
          displayRegion: data.displayRegion ?? "미정",
          inquiryType: data.inquiryType ?? "기타 문의",
          createdAt: data.createdAt,
        };
      });

      setRows(list);
      setShift(0);
    });

    return () => unsub();
  }, []);

  const viewRows = useMemo(() => rotateLeft(rows, shift), [rows, shift]);

  /** ✅ 최신(맨 위) 강조색: 섹션 팔레트(또는 기본 팔레트)로 순환 */
  const highlight = useMemo(() => {
    const safeLen = palette.length || 1;
    return palette[shift % safeLen] || palette[0];
  }, [palette, shift]);

  /** 롤링 */
  useEffect(() => {
    if (rows.length <= 1) return;

    const timer = setInterval(() => {
      setShift((prev) => (prev + 1) % rows.length);
    }, 2200);

    return () => clearInterval(timer);
  }, [rows.length]);

  return (
    <div className="w-full rounded-2xl border border-gray-200 bg-white p-4 md:p-5">
      {/* 헤더 */}
      <div className="mb-3 flex items-start justify-between">
        <h3 className="text-base font-bold text-gray-900">최근 문의</h3>
        <p className="text-xs text-gray-500">
          비식별 처리(성명/연락처) + 유형만 표시
        </p>
      </div>

      {/* 표 */}
      <div className="overflow-hidden rounded-xl border border-gray-200">
        <table className="w-full table-fixed">
          <thead className="bg-gray-50 text-xs font-semibold text-gray-600">
            <tr>
              <th className="px-3 py-2 text-left">성명</th>
              <th className="px-3 py-2 text-left">연락처</th>
              <th className="px-3 py-2 text-left">지역</th>
              <th className="px-3 py-2 text-left">문의내용</th>
              <th className="px-3 py-2 text-right">시간</th>
            </tr>
          </thead>

          <tbody className="divide-y text-sm text-gray-800">
            {viewRows.map((r, idx) => {
              const isActive = idx === 0;
              const base = "px-3 py-2";

              return (
                <tr
                  key={r.id}
                  className={[
                    "transition-colors duration-300",
                    isActive ? highlight.bg : "bg-white hover:bg-gray-50",
                  ].join(" ")}
                >
                  <td
                    className={[
                      base,
                      isActive ? `border-l-4 ${highlight.border} pl-2` : "",
                    ].join(" ")}
                  >
                    <SplitName name={r.displayName} active={isActive} />
                  </td>

                  <td className={`${base} ${isActive ? "font-bold" : ""}`}>
                    {r.displayPhone}
                  </td>

                  <td className={`${base} ${isActive ? "font-bold" : ""}`}>
                    {r.displayRegion}
                  </td>

                  <td className={`${base} ${isActive ? "font-bold" : ""}`}>
                    {r.inquiryType}
                  </td>

                  <td
                    className={`${base} ${
                      isActive ? "font-bold" : ""
                    } text-right text-gray-600`}
                  >
                    {r.createdAt ? timeAgo(r.createdAt) : "-"}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <p className="mt-2 text-[11px] text-gray-500">
        * 지금 바로 무료상담 신청하세요!!
      </p>
    </div>
  );
}
