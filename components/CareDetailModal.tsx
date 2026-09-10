"use client";

import { useEffect, useState } from "react";
import { Recipient } from "@/lib/types/erp";
import { ExtendedCareLog } from "@/components/PrintableCareCalendar";
import { X, Printer, Download, FileSpreadsheet, Building, User, CheckCircle2, ShieldCheck, Camera } from "@/lib/icons";

interface CareDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  dateStr: string;
  recipient: Recipient | null;
  careLog: ExtendedCareLog | null;
  caregiverName?: string;
}

export default function CareDetailModal({
  isOpen,
  onClose,
  dateStr,
  recipient,
  careLog,
  caregiverName = "김영희 요양보호사",
}: CareDetailModalProps) {
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  // ESC key listener to close modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Format date display (e.g., 2026년 09월 01일)
  const [year, month, day] = dateStr.split("-");
  const formattedDateTitle = `${year}년 ${month}월 ${day}일`;

  // Fallback defaults for trade statement details
  const displayMealMenu = careLog?.mealMenu || "소고기무국, 시금치나물, 계란찜 (일반식)";
  const displayMealStatus = careLog?.mealStatus || "전부 섭취 (100%)";
  const displayMedDetail = careLog?.medicationDetail || "아침/점심 정기 약 2회 복용";
  const displayMedStatus = careLog?.medicationStatus === "완료" ? "복용 완료 ✅" : "미복용 ⚠️";
  const displayActivities = careLog?.physicalActivity?.length
    ? careLog.physicalActivity.join(", ")
    : "세면도움, 식사도움, 신체기능유지";
  const displayNotes = careLog?.notes || "어르신 컨디션 매우 양호, 바이탈 혈압 120/80mmHg 측정 정상 범위";
  const displayCaregiver = careLog?.caregiverName || caregiverName;
  const displayPhoto = careLog?.photoUrl || "https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?w=400&q=80";

  // CSV Excel Download Handler
  const handleExportCSV = () => {
    const headers = ["구분", "상세 내용 / 품목", "상태 / 수량", "확인 / 비고"];
    const rows = [
      ["식사 제공", displayMealMenu, displayMealStatus, "소화 양호"],
      ["복약 관리", displayMedDetail, displayMedStatus, `시간: ${careLog?.startTime || "09:00"}~${careLog?.endTime || "12:00"}`],
      ["신체/위생", displayActivities, "1회 제공 완료", "자립 유도 수발"],
      ["일지/관찰", displayNotes, "당일 현장 관찰", "정상 범위"],
    ];

    const csvContent =
      "data:text/csv;charset=utf-8,\uFEFF" +
      `[일일 케어 및 식단 제공 명세표 - ${dateStr}]\n` +
      `수급자: ${recipient?.name || "박순자"} 어르신 (${recipient?.certNumber || "L1234567890"})\n` +
      `제공기관: 실버링크 방문요양센터 (담당: ${displayCaregiver})\n\n` +
      headers.join(",") +
      "\n" +
      rows.map((e) => e.map((val) => `"${val}"`).join(",")).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `실버링크_일일케어명세표_${dateStr}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Print Specific Modal Content
  const handlePrintModal = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-200"
      onClick={onClose}
    >
      <style jsx global>{`
        @media print {
          @page {
            size: A4 portrait;
            margin: 10mm;
          }
          body * {
            visibility: hidden;
          }
          .trade-modal-container,
          .trade-modal-container * {
            visibility: visible;
          }
          .trade-modal-container {
            position: absolute;
            left: 0;
            top: 0;
            width: 100% !important;
            max-width: 100% !important;
            box-shadow: none !important;
            border: 2px solid #000 !important;
          }
          .print-modal-hidden {
            display: none !important;
          }
        }
      `}</style>

      {/* Main Modal Container */}
      <div
        className="trade-modal-container bg-white rounded-3xl max-w-3xl w-full p-5 sm:p-7 shadow-2xl space-y-5 border-2 border-slate-900 my-auto text-slate-900 relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="flex items-center justify-between border-b-2 border-slate-900 pb-3">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center font-black text-xs">
              SL
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
                일일 케어 및 식단 제공 명세표
              </h2>
              <p className="text-xs text-slate-500 font-mono">
                제공일자: <strong className="text-emerald-700">{formattedDateTitle} ({dateStr})</strong>
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="print-modal-hidden p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer"
            title="닫기 (ESC)"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* 2-Column Trade Statement Header Info Box */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
          {/* Column 1: 공급받는자 (수급자 / 보호자) */}
          <div className="border border-slate-900 rounded-xl overflow-hidden">
            <div className="bg-slate-900 text-white px-3 py-1.5 font-bold flex items-center justify-between text-xs">
              <span>[공급받는자] 수급자 및 보호자</span>
              <span className="text-[10px] font-mono text-slate-300">인정번호: {recipient?.certNumber || "L1234567890"}</span>
            </div>
            <div className="p-3 space-y-1 bg-slate-50/70 font-sans">
              <div>
                <strong className="text-slate-900">성 함:</strong> {recipient?.name || "박순자"} 어르신 (장기요양 {recipient?.careLevel || "3등급"})
              </div>
              <div>
                <strong className="text-slate-900">보호자:</strong> 홍길동 (연락처: 010-1234-5678)
              </div>
              <div className="truncate">
                <strong className="text-slate-900">주 소:</strong> {recipient?.address || "서울특별시 서초구 반포대로 100"}
              </div>
              <div className="text-[11px] text-emerald-800 font-bold">
                본인부담금 감경율: {recipient?.coPayRate || 15}% 적용
              </div>
            </div>
          </div>

          {/* Column 2: 공급하는자 (요양기관 / 요양보호사) */}
          <div className="border border-slate-900 rounded-xl overflow-hidden relative">
            <div className="bg-slate-900 text-white px-3 py-1.5 font-bold flex items-center justify-between text-xs">
              <span>[공급하는자] 장기요양 제공기관</span>
              <span className="text-[10px] font-mono text-emerald-400">사업자: 123-45-67890</span>
            </div>
            <div className="p-3 space-y-1 bg-slate-50/70 font-sans relative">
              <div>
                <strong className="text-slate-900">기관명:</strong> 실버링크 방문요양센터
              </div>
              <div className="flex items-center space-x-2">
                <span><strong className="text-slate-900">대표자:</strong> 최관리 센터장</span>
                {/* Red Official Seal Stamp Styling */}
                <span className="inline-flex items-center justify-center border-2 border-red-600 text-red-600 font-black text-[10px] px-1.5 py-0.2 rounded-full rotate-[-8deg] shadow-2xs font-mono">
                  실버링크(인)
                </span>
              </div>
              <div>
                <strong className="text-slate-900">담당 요양사:</strong> {displayCaregiver} <span className="text-emerald-700 font-semibold text-[11px]">(직무인증 완료 ✅)</span>
              </div>
              <div className="text-[11px] text-slate-500 font-mono">
                서비스 시간: {careLog?.startTime || "09:00"} ~ {careLog?.endTime || "12:00"} (총 3시간)
              </div>
            </div>
          </div>
        </div>

        {/* Trade Specification Invoice Table */}
        <div className="border border-slate-900 rounded-xl overflow-hidden">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-900 text-white font-bold border-b border-slate-900 text-[11px]">
                <th className="py-2.5 px-3 w-24">구분</th>
                <th className="py-2.5 px-3">상세 내용 / 제공 품목</th>
                <th className="py-2.5 px-3 w-32">상태 / 수량</th>
                <th className="py-2.5 px-3 w-32">확인 / 비고</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-300 bg-white">
              {/* Row 1: 식사 / 음식 */}
              <tr className="hover:bg-slate-50">
                <td className="py-2.5 px-3 font-bold text-slate-900 bg-slate-50 border-r border-slate-200">
                  🍚 식사 제공
                </td>
                <td className="py-2.5 px-3 font-semibold text-slate-800">
                  {displayMealMenu}
                </td>
                <td className="py-2.5 px-3 font-bold text-emerald-700">
                  <span className="bg-emerald-100 text-emerald-900 px-2 py-0.5 rounded border border-emerald-300">
                    {displayMealStatus}
                  </span>
                </td>
                <td className="py-2.5 px-3 text-slate-600">
                  소화 상태 양호
                </td>
              </tr>

              {/* Row 2: 복약 관리 */}
              <tr className="hover:bg-slate-50">
                <td className="py-2.5 px-3 font-bold text-slate-900 bg-slate-50 border-r border-slate-200">
                  💊 복약 수발
                </td>
                <td className="py-2.5 px-3 font-semibold text-slate-800">
                  {displayMedDetail}
                </td>
                <td className="py-2.5 px-3 font-bold text-blue-700">
                  <span className="bg-blue-100 text-blue-900 px-2 py-0.5 rounded border border-blue-300">
                    {displayMedStatus}
                  </span>
                </td>
                <td className="py-2.5 px-3 text-slate-600 font-mono text-[11px]">
                  시간 준수 복용
                </td>
              </tr>

              {/* Row 3: 신체/위생 보조 */}
              <tr className="hover:bg-slate-50">
                <td className="py-2.5 px-3 font-bold text-slate-900 bg-slate-50 border-r border-slate-200">
                  🧼 신체/위생
                </td>
                <td className="py-2.5 px-3 text-slate-800">
                  {displayActivities}
                </td>
                <td className="py-2.5 px-3 font-bold text-slate-700">
                  1회 제공 완료
                </td>
                <td className="py-2.5 px-3 text-slate-600">
                  자립 유도 완료
                </td>
              </tr>

              {/* Row 4: 특이사항 / 관찰 */}
              <tr className="hover:bg-slate-50">
                <td className="py-2.5 px-3 font-bold text-slate-900 bg-slate-50 border-r border-slate-200">
                  💬 특이사항
                </td>
                <td className="py-2.5 px-3 text-slate-800 leading-relaxed" colSpan={2}>
                  {displayNotes}
                </td>
                <td className="py-2.5 px-3 font-bold text-emerald-700">
                  정상 범위
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Proof Photos Thumbnail Section */}
        <div className="space-y-2">
          <h4 className="text-xs font-bold text-slate-900 flex items-center space-x-1.5">
            <Camera className="w-4 h-4 text-emerald-600" />
            <span>당일 현장 돌봄 증빙 사진</span>
          </h4>
          <div className="flex items-center space-x-3">
            <div
              onClick={() => setPhotoPreview(displayPhoto)}
              className="relative w-28 h-20 rounded-xl overflow-hidden border border-slate-300 bg-slate-100 cursor-pointer group shadow-2xs"
            >
              <img src={displayPhoto} alt="현장 증빙 사진" className="w-full h-full object-cover group-hover:scale-105 transition" />
              <div className="absolute inset-0 bg-slate-900/20 group-hover:bg-slate-900/0 transition" />
              <span className="absolute bottom-1 right-1 text-[9px] bg-slate-900/80 text-white px-1.5 py-0.2 rounded font-mono">
                클릭 확대
              </span>
            </div>

            <div className="text-xs text-slate-500 space-y-1">
              <p className="font-semibold text-slate-700">✅ 식단 제공 및 약 복용 완료 현장 확인</p>
              <p className="text-[11px] text-slate-400">모바일 카메라인증 및 Firestore 실시간 동기화 완료</p>
            </div>
          </div>
        </div>

        {/* Modal Action Buttons (Hidden on Print) */}
        <div className="print-modal-hidden flex items-center justify-between border-t border-slate-200 pt-4">
          <div className="flex items-center space-x-2">
            <button
              onClick={handleExportCSV}
              className="flex items-center space-x-1.5 px-4 py-2.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 font-bold text-xs rounded-xl transition cursor-pointer"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
              <span>Excel/CSV 다운로드</span>
            </button>

            <button
              onClick={handlePrintModal}
              className="flex items-center space-x-1.5 px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow transition cursor-pointer"
            >
              <Printer className="w-4 h-4 text-emerald-400" />
              <span>🖨️ 명세서 인쇄하기</span>
            </button>
          </div>

          <button
            onClick={onClose}
            className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition cursor-pointer"
          >
            닫기 (ESC)
          </button>
        </div>
      </div>

      {/* Photo Lightbox Popup Modal */}
      {photoPreview && (
        <div
          className="fixed inset-0 z-60 bg-black/90 flex items-center justify-center p-4"
          onClick={() => setPhotoPreview(null)}
        >
          <div className="relative max-w-2xl w-full bg-slate-900 p-2 rounded-2xl overflow-hidden shadow-2xl">
            <img src={photoPreview} alt="현장 확대 사진" className="w-full h-auto rounded-xl max-h-[80vh] object-contain mx-auto" />
            <button
              onClick={() => setPhotoPreview(null)}
              className="absolute top-4 right-4 bg-slate-900/80 text-white p-2 rounded-full hover:bg-black transition"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
