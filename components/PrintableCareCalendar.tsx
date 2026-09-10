"use client";

import { useState, useMemo } from "react";
import { Recipient, CareLog, Schedule } from "@/lib/types/erp";
import { Printer, ChevronLeft, ChevronRight, Heart, User, Calendar as CalendarIcon, CheckCircle2, Shield } from "@/lib/icons";
import CareDetailModal from "@/components/CareDetailModal";

export interface ExtendedCareLog extends CareLog {
  mealMenu?: string;
  medicationDetail?: string;
}

interface PrintableCareCalendarProps {
  year: number;
  month: number; // 1 ~ 12
  recipient: Recipient | null;
  caregiverName?: string;
  careLogs: ExtendedCareLog[];
  schedules?: Schedule[];
  onMonthChange?: (year: number, month: number) => void;
  showControls?: boolean;
}

export default function PrintableCareCalendar({
  year,
  month,
  recipient,
  caregiverName = "김영희 요양사",
  careLogs,
  schedules = [],
  onMonthChange,
  showControls = true,
}: PrintableCareCalendarProps) {
  // Modal State for Trade Statement Invoice
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedDateStr, setSelectedDateStr] = useState<string>("");
  const [selectedCareLog, setSelectedCareLog] = useState<ExtendedCareLog | null>(null);

  // Calendar Grid Calculation
  const calendarDays = useMemo(() => {
    const firstDay = new Date(year, month - 1, 1).getDay(); // 0=Sun, 1=Mon...
    const daysInMonth = new Date(year, month, 0).getDate();

    const days: ({ dayNum: number; dateStr: string } | null)[] = [];

    // Padding before 1st of month
    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }

    // Days of month
    for (let d = 1; d <= daysInMonth; d++) {
      const monthStr = month < 10 ? `0${month}` : `${month}`;
      const dayStr = d < 10 ? `0${d}` : `${d}`;
      days.push({
        dayNum: d,
        dateStr: `${year}-${monthStr}-${dayStr}`,
      });
    }

    return days;
  }, [year, month]);

  // Index logs by date string YYYY-MM-DD
  const logsByDate = useMemo(() => {
    const map: { [dateStr: string]: ExtendedCareLog[] } = {};
    careLogs.forEach((log) => {
      if (!map[log.logDate]) {
        map[log.logDate] = [];
      }
      map[log.logDate].push(log);
    });
    return map;
  }, [careLogs]);

  // Cell Click Handler to Open Trade Statement Invoice Modal
  const handleCellClick = (dateStr: string, log: ExtendedCareLog | null) => {
    setSelectedDateStr(dateStr);
    setSelectedCareLog(log);
    setModalOpen(true);
  };

  // Handle Prev/Next Month
  const handlePrevMonth = () => {
    if (!onMonthChange) return;
    if (month === 1) {
      onMonthChange(year - 1, 12);
    } else {
      onMonthChange(year, month - 1);
    }
  };

  const handleNextMonth = () => {
    if (!onMonthChange) return;
    if (month === 12) {
      onMonthChange(year + 1, 1);
    } else {
      onMonthChange(year, month + 1);
    }
  };

  // Trigger Print
  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  // Meal Status Badge Formatting
  const getMealBadge = (status: CareLog["mealStatus"]) => {
    switch (status) {
      case "전부 섭취":
        return { label: "완식 🍚", style: "bg-emerald-600 text-white font-bold" };
      case "반 이상 섭취":
        return { label: "보통 🍲", style: "bg-amber-500 text-white font-bold" };
      case "반 미만 섭취":
        return { label: "소량 🥣", style: "bg-rose-500 text-white font-bold" };
      case "미섭취":
        return { label: "미섭취 ❌", style: "bg-red-700 text-white font-bold" };
      default:
        return { label: status, style: "bg-slate-500 text-white font-bold" };
    }
  };

  return (
    <div className="printable-calendar-wrapper space-y-4">
      {/* Print CSS Media Overrides */}
      <style jsx global>{`
        @media print {
          @page {
            size: A4 landscape;
            margin: 6mm;
          }
          html, body {
            background: #ffffff !important;
            color: #000000 !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          .print\\:hidden,
          header,
          footer,
          .mobile-cta {
            display: none !important;
          }
          .printable-calendar-wrapper {
            margin: 0 !important;
            padding: 0 !important;
            width: 100% !important;
          }
          .print-card-outer {
            border: 1.5px solid #334155 !important;
            box-shadow: none !important;
            padding: 12px !important;
            border-radius: 0 !important;
          }
          .print-grid-cell {
            min-height: 110px !important;
            border: 1px solid #94a3b8 !important;
            padding: 4px !important;
          }
          .print-thumb {
            height: 44px !important;
          }
        }
      `}</style>

      {/* Action Bar (Hidden on Print) */}
      {showControls && (
        <div className="print:hidden bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <button
              onClick={handlePrevMonth}
              className="p-2 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-700 transition cursor-pointer"
              title="이전 달"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <div className="text-center sm:text-left">
              <h2 className="text-xl font-extrabold text-slate-900 flex items-center space-x-2">
                <CalendarIcon className="w-5 h-5 text-emerald-600 inline" />
                <span>{year}년 {month}월 케어·발주 월간 일지</span>
              </h2>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                💡 날짜 셀을 클릭하시면 해당 일자의 <strong className="text-emerald-700">거래명세표형 일일 케어 리포트 팝업</strong>을 열람할 수 있습니다.
              </p>
            </div>

            <button
              onClick={handleNextMonth}
              className="p-2 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-700 transition cursor-pointer"
              title="다음 달"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          <button
            onClick={handlePrint}
            className="w-full sm:w-auto flex items-center justify-center space-x-2 bg-emerald-600 hover:bg-emerald-700 text-white font-black px-6 py-3 rounded-xl shadow-lg transition cursor-pointer text-sm"
          >
            <Printer className="w-5 h-5" />
            <span>🖨️ A4 가로 출력하기 (window.print)</span>
          </button>
        </div>
      )}

      {/* Main Printable Document Card */}
      <div className="print-card-outer bg-white rounded-3xl border border-slate-200 shadow-lg p-5 sm:p-7 space-y-4">
        {/* Document Top Header Info Box */}
        <div className="border-b-2 border-slate-900 pb-3 flex flex-col sm:flex-row sm:items-end justify-between gap-3">
          <div>
            <div className="flex items-center space-x-2 text-xs font-mono text-emerald-700 font-extrabold uppercase tracking-wider mb-1">
              <Heart className="w-4 h-4 text-emerald-600 fill-emerald-100" />
              <span>SILVER LINK SENIOR CARE MONTHLY RECORD</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              {year}년 {month}월 월간 케어·식단 발주 일지
            </h1>
          </div>

          {/* Recipient & Caregiver Meta Summary Card */}
          {recipient && (
            <div className="bg-slate-50 border border-slate-300 p-3 rounded-2xl text-xs space-y-1 text-slate-800 font-medium">
              <div className="flex items-center space-x-3">
                <span>
                  <strong className="text-slate-900">대상 어르신:</strong> {recipient.name} 어르신 ({recipient.careLevel})
                </span>
                <span>|</span>
                <span>
                  <strong className="text-slate-900">생년월일:</strong> {recipient.birthDate || "1943-07-15"}
                </span>
              </div>
              <div className="flex items-center space-x-3 font-mono text-[11px] text-slate-600">
                <span>
                  <strong className="text-slate-900">인정번호:</strong> {recipient.certNumber}
                </span>
                <span>|</span>
                <span>
                  <strong className="text-slate-900">담당 요양사:</strong> {caregiverName}
                </span>
                <span>|</span>
                <span>
                  <strong className="text-slate-900">본인부담:</strong> {recipient.coPayRate}%
                </span>
              </div>
            </div>
          )}
        </div>

        {/* 7-Column Grid (Sun ~ Sat) */}
        <div className="overflow-x-auto">
          <div className="min-w-[760px]">
            {/* Weekday Table Headers */}
            <div className="grid grid-cols-7 border-b-2 border-slate-900 bg-slate-900 text-white text-center font-black text-xs py-2 rounded-t-xl">
              <div className="text-red-400">일 (Sun)</div>
              <div>월 (Mon)</div>
              <div>화 (Tue)</div>
              <div>수 (Wed)</div>
              <div>목 (Thu)</div>
              <div>금 (Fri)</div>
              <div className="text-blue-300">토 (Sat)</div>
            </div>

            {/* Calendar Grid Cells */}
            <div className="grid grid-cols-7 border-l border-t border-slate-300 bg-slate-200 gap-px border-b border-r border-slate-300">
              {calendarDays.map((item, idx) => {
                if (!item) {
                  return (
                    <div
                      key={`empty-${idx}`}
                      className="print-grid-cell bg-slate-50/60 min-h-[125px] p-1.5"
                    />
                  );
                }

                const dayOfWeek = idx % 7; // 0=Sun, 6=Sat
                const isSunday = dayOfWeek === 0;
                const isSaturday = dayOfWeek === 6;
                const dateLogs = logsByDate[item.dateStr] || [];
                const primaryLog = dateLogs[0] || null;

                return (
                  <div
                    key={item.dateStr}
                    onClick={() => handleCellClick(item.dateStr, primaryLog)}
                    className="print-grid-cell bg-white min-h-[130px] p-2 flex flex-col justify-between cursor-pointer hover:bg-emerald-50/80 hover:border-emerald-500 transition group shadow-2xs relative"
                    title="클릭 시 일일 거래명세표형 상세 팝업 열람"
                  >
                    {/* Date Number Header */}
                    <div className="flex items-center justify-between border-b border-slate-100 pb-1 mb-1">
                      <span
                        className={`font-black text-xs sm:text-sm font-mono ${
                          isSunday
                            ? "text-red-600"
                            : isSaturday
                            ? "text-blue-600"
                            : "text-slate-900"
                        }`}
                      >
                        {item.dayNum}일
                      </span>

                      {primaryLog && (
                        <span className="text-[9px] font-bold bg-slate-100 group-hover:bg-emerald-100 group-hover:text-emerald-900 text-slate-600 px-1 py-0.2 rounded font-mono transition">
                          {primaryLog.caregiverName.split(" ")[0]}
                        </span>
                      )}
                    </div>

                    {/* Daily Care Log Content */}
                    {primaryLog ? (
                      <div className="space-y-1 flex-1 flex flex-col justify-between">
                        {/* Meal & Medication Badges */}
                        <div className="space-y-1">
                          <div className="flex flex-wrap items-center gap-1">
                            {primaryLog.mealStatus && (
                              <span
                                className={`text-[9.5px] px-1.5 py-0.3 rounded shadow-2xs ${
                                  getMealBadge(primaryLog.mealStatus).style
                                }`}
                              >
                                {getMealBadge(primaryLog.mealStatus).label}
                              </span>
                            )}

                            {primaryLog.medicationStatus === "완료" && (
                              <span className="text-[9px] font-bold bg-blue-100 text-blue-900 border border-blue-300 px-1 py-0.2 rounded">
                                ✅ {primaryLog.medicationDetail || "복약완료"}
                              </span>
                            )}
                          </div>

                          {/* Meal Menu Subtext */}
                          {primaryLog.mealMenu && (
                            <div className="text-[9.5px] font-semibold text-slate-700 truncate leading-tight group-hover:text-emerald-900">
                              🍚 {primaryLog.mealMenu}
                            </div>
                          )}
                        </div>

                        {/* Photo Thumbnail */}
                        {primaryLog.photoUrl ? (
                          <div className="print-thumb relative my-0.5 rounded-lg overflow-hidden border border-slate-300 h-12 bg-slate-100 shadow-2xs">
                            <img
                              src={primaryLog.photoUrl}
                              alt="현장 케어 사진"
                              className="w-full h-full object-cover group-hover:scale-105 transition"
                            />
                          </div>
                        ) : (
                          <div className="hidden print:block text-[8px] text-slate-300 italic">
                            (사진 미첨부)
                          </div>
                        )}

                        {/* Special Notes (1-2 line ellipsis) */}
                        {primaryLog.notes && (
                          <p className="text-[10px] leading-tight text-slate-700 line-clamp-2 font-sans bg-slate-50 group-hover:bg-white p-1 rounded border border-slate-100 transition">
                            💬 {primaryLog.notes}
                          </p>
                        )}
                      </div>
                    ) : (
                      <div className="flex-1 flex flex-col items-center justify-center text-[10px] text-slate-300 italic">
                        <span>-</span>
                        <span className="text-[8.5px] text-slate-400 opacity-0 group-hover:opacity-100 transition font-sans">
                          클릭하여 명세서 열람
                        </span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Printable Footer Official Stamp Section */}
        <div className="border-t-2 border-slate-900 pt-3 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-600 font-mono gap-2">
          <div>
            발급기관: <strong className="text-slate-900">실버링크 장기요양센터</strong> | 출력일자: {new Date().toISOString().split("T")[0]}
          </div>
          <div className="flex items-center space-x-6">
            <span>담당 요양보호사 서명: _____________ (인)</span>
            <span>보호자/자녀 확인 서명: _____________ (인)</span>
          </div>
        </div>
      </div>

      {/* Trade Statement Invoice Modal Popup */}
      <CareDetailModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        dateStr={selectedDateStr}
        recipient={recipient}
        careLog={selectedCareLog}
        caregiverName={caregiverName}
      />
    </div>
  );
}
