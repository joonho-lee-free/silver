"use client";

import { useMemo } from "react";
import { Recipient, CareLog, Schedule } from "@/lib/types/erp";
import { Printer, ChevronLeft, ChevronRight, Calendar, User, Heart, FileText, CheckCircle2 } from "@/lib/icons";

interface PrintableCareCalendarProps {
  year: number;
  month: number; // 1 ~ 12
  recipient: Recipient | null;
  careLogs: CareLog[];
  schedules?: Schedule[];
  onMonthChange?: (year: number, month: number) => void;
  showControls?: boolean;
}

export default function PrintableCareCalendar({
  year,
  month,
  recipient,
  careLogs,
  schedules = [],
  onMonthChange,
  showControls = true,
}: PrintableCareCalendarProps) {
  // Calendar Grid Calculation
  const calendarDays = useMemo(() => {
    const firstDay = new Date(year, month - 1, 1).getDay(); // 0=일, 1=월...
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
    const map: { [dateStr: string]: CareLog[] } = {};
    careLogs.forEach((log) => {
      if (!map[log.logDate]) {
        map[log.logDate] = [];
      }
      map[log.logDate].push(log);
    });
    return map;
  }, [careLogs]);

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

  // Badge Color Helper for Meal Status
  const getMealBadge = (status: CareLog["mealStatus"]) => {
    switch (status) {
      case "전부 섭취":
        return { label: "완식(100%)", style: "bg-emerald-100 text-emerald-900 border-emerald-300" };
      case "반 이상 섭취":
        return { label: "보통(50%+)", style: "bg-blue-100 text-blue-900 border-blue-300" };
      case "반 미만 섭취":
        return { label: "소량(50%-)", style: "bg-amber-100 text-amber-900 border-amber-300" };
      case "미섭취":
        return { label: "미섭취", style: "bg-red-100 text-red-900 border-red-300" };
      default:
        return { label: status, style: "bg-slate-100 text-slate-800 border-slate-300" };
    }
  };

  return (
    <div className="printable-calendar-wrapper space-y-4">
      {/* Printable Style Overrides */}
      <style jsx global>{`
        @media print {
          @page {
            size: A4 landscape;
            margin: 6mm;
          }
          body {
            background: white !important;
            color: black !important;
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
          .print-card {
            border: 1px solid #94a3b8 !important;
            box-shadow: none !important;
          }
          .print-grid-cell {
            min-height: 125px !important;
            border: 1px solid #cbd5e1 !important;
          }
        }
      `}</style>

      {/* Top Action Controls (Hidden on Print) */}
      {showControls && (
        <div className="print:hidden bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <button
              onClick={handlePrevMonth}
              className="p-2 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-700 transition"
              title="이전 달"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <div className="text-center sm:text-left">
              <h2 className="text-xl font-extrabold text-slate-900">
                {year}년 {month}월 월간 케어 일지
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                {recipient ? `${recipient.name} 어르신 (장기요양 ${recipient.careLevel})` : "수급자를 선택하세요"}
              </p>
            </div>

            <button
              onClick={handleNextMonth}
              className="p-2 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-700 transition"
              title="다음 달"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrint}
              className="flex items-center space-x-2 bg-slate-900 hover:bg-slate-800 text-white font-bold px-5 py-2.5 rounded-xl shadow-lg transition cursor-pointer"
            >
              <Printer className="w-5 h-5 text-emerald-400" />
              <span>🖨️ 월간 일지 달력 인쇄하기</span>
            </button>
          </div>
        </div>
      )}

      {/* Main Printable Document Container */}
      <div className="print-card bg-white rounded-2xl border border-slate-200 shadow-md p-4 sm:p-6 space-y-4">
        {/* Printable Document Title Header */}
        <div className="border-b-2 border-slate-900 pb-3 flex flex-col sm:flex-row sm:items-end justify-between gap-2">
          <div>
            <div className="flex items-center space-x-2 text-xs font-mono text-emerald-700 font-bold uppercase tracking-wider">
              <Heart className="w-4 h-4 text-emerald-600" />
              <span>SILVER LINK SENIOR CARE MONTHLY RECORD</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mt-0.5">
              {year}년 {month}월 케어·발주 월간 일지
            </h1>
          </div>

          {/* Recipient Document Info Box */}
          {recipient && (
            <div className="bg-slate-50 border border-slate-300 p-2.5 rounded-xl text-xs space-y-0.5 text-slate-800 font-mono">
              <div>
                <span className="font-bold text-slate-900">수급자명:</span> {recipient.name} 어르신 ({recipient.careLevel})
              </div>
              <div>
                <span className="font-bold text-slate-900">인정번호:</span> {recipient.certNumber} | <span className="font-bold text-slate-900">본인부담금:</span> {recipient.coPayRate}%
              </div>
            </div>
          )}
        </div>

        {/* 7-Column Monthly Calendar Grid (Sun ~ Sat) */}
        <div className="overflow-x-auto">
          <div className="min-w-[700px]">
            {/* Weekday Table Headers */}
            <div className="grid grid-cols-7 border-b border-slate-900 bg-slate-900 text-white text-center font-bold text-xs py-2">
              <div className="text-red-400">일 (Sun)</div>
              <div>월 (Mon)</div>
              <div>화 (Tue)</div>
              <div>수 (Wed)</div>
              <div>목 (Thu)</div>
              <div>금 (Fri)</div>
              <div className="text-blue-300">토 (Sat)</div>
            </div>

            {/* Calendar Grid Cells */}
            <div className="grid grid-cols-7 border-l border-t border-slate-300 bg-slate-100 gap-px">
              {calendarDays.map((item, idx) => {
                if (!item) {
                  return (
                    <div
                      key={`empty-${idx}`}
                      className="print-grid-cell bg-slate-50/50 min-h-[120px] p-1 border-r border-b border-slate-200"
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
                    className="print-grid-cell bg-white min-h-[125px] p-1.5 border-r border-b border-slate-300 flex flex-col justify-between hover:bg-slate-50/80 transition"
                  >
                    {/* Top Date Header */}
                    <div className="flex items-center justify-between mb-1 border-b border-slate-100 pb-1">
                      <span
                        className={`font-black text-sm font-mono ${
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
                        <span className="text-[9px] bg-slate-100 text-slate-600 px-1 py-0.2 rounded font-mono truncate max-w-[60px]">
                          {primaryLog.caregiverName.split(" ")[0]}
                        </span>
                      )}
                    </div>

                    {/* Day Content: Care Log details */}
                    {primaryLog ? (
                      <div className="space-y-1 flex-1 flex flex-col justify-between">
                        {/* Meal & Medication Badges */}
                        <div className="flex flex-wrap items-center gap-0.5">
                          {/* Meal Intake Badge */}
                          {primaryLog.mealStatus && (
                            <span
                              className={`text-[9px] font-bold px-1 py-0.2 rounded border ${
                                getMealBadge(primaryLog.mealStatus).style
                              }`}
                            >
                              {getMealBadge(primaryLog.mealStatus).label}
                            </span>
                          )}

                          {/* Medication Completion Badge */}
                          {primaryLog.medicationStatus === "완료" && (
                            <span className="text-[9px] font-bold bg-blue-50 text-blue-800 border border-blue-200 px-1 py-0.2 rounded inline-flex items-center">
                              ✓ 복약
                            </span>
                          )}
                        </div>

                        {/* Photo Thumbnail */}
                        {primaryLog.photoUrl ? (
                          <div className="relative my-0.5 rounded overflow-hidden border border-slate-300 h-11 bg-slate-100">
                            <img
                              src={primaryLog.photoUrl}
                              alt="케어 사진"
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ) : (
                          <div className="hidden print:block text-[9px] text-slate-300 italic">
                            (사진 미첨부)
                          </div>
                        )}

                        {/* Notes / Special Memos */}
                        {primaryLog.notes && (
                          <p className="text-[9.5px] leading-tight text-slate-700 line-clamp-2 font-sans">
                            {primaryLog.notes}
                          </p>
                        )}

                        {/* Physical Activity Tags Summary */}
                        {primaryLog.physicalActivity && primaryLog.physicalActivity.length > 0 && (
                          <div className="text-[8.5px] text-slate-500 font-medium truncate pt-0.5 border-t border-slate-100">
                            보조: {primaryLog.physicalActivity.slice(0, 2).join(", ")}
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="flex-1 flex items-center justify-center text-[10px] text-slate-300 italic">
                        -
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Printable Footer Stamp Section */}
        <div className="border-t border-slate-300 pt-3 flex items-center justify-between text-xs text-slate-600 font-mono">
          <div>
            발급기관: <span className="font-bold text-slate-900">실버링크 장기요양센터</span> | 인쇄일자: {new Date().toISOString().split("T")[0]}
          </div>
          <div className="flex items-center space-x-6">
            <span>담당 요양보호사 서명: _____________</span>
            <span>보호자 확인 서명: _____________</span>
          </div>
        </div>
      </div>
    </div>
  );
}
