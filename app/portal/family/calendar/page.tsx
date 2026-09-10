"use client";

import { useState, useEffect, useMemo } from "react";
import { Recipient, CareLog, Schedule } from "@/lib/types/erp";
import { getRecipients, getCareLogs, getSchedules, seedInitialErpData } from "@/lib/firebaseErp";
import PrintableCareCalendar from "@/components/PrintableCareCalendar";
import { Heart, User, Calendar as CalendarIcon, RefreshCw, FileText, Phone } from "@/lib/icons";

export default function FamilyCalendarPage() {
  const [recipients, setRecipients] = useState<Recipient[]>([]);
  const [careLogs, setCareLogs] = useState<CareLog[]>([]);
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [selectedRecipientId, setSelectedRecipientId] = useState<string>("");
  const [loading, setLoading] = useState(true);

  // Selected Year / Month
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth() + 1);

  const loadData = async () => {
    setLoading(true);
    try {
      let [rcList, logList, scList] = await Promise.all([
        getRecipients(),
        getCareLogs(),
        getSchedules(),
      ]);

      if (rcList.length === 0) {
        await seedInitialErpData();
        [rcList, logList, scList] = await Promise.all([
          getRecipients(),
          getCareLogs(),
          getSchedules(),
        ]);
      }

      setRecipients(rcList);
      setCareLogs(logList);
      setSchedules(scList);

      if (rcList.length > 0 && !selectedRecipientId) {
        setSelectedRecipientId(rcList[0].id);
      }
    } catch (err) {
      console.error("Error loading family calendar data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Currently Selected Recipient
  const selectedRecipient = useMemo(() => {
    return recipients.find((r) => r.id === selectedRecipientId) || recipients[0] || null;
  }, [recipients, selectedRecipientId]);

  // Filter logs for selected recipient and month
  const recipientLogs = useMemo(() => {
    if (!selectedRecipientId) return [];
    return careLogs.filter((log) => {
      if (log.recipientId !== selectedRecipientId) return false;
      const [logY, logM] = log.logDate.split("-").map(Number);
      return logY === year && logM === month;
    });
  }, [careLogs, selectedRecipientId, year, month]);

  const handleMonthChange = (newYear: number, newMonth: number) => {
    setYear(newYear);
    setMonth(newMonth);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Top Header Card (Hidden on Print) */}
      <div className="print:hidden bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 p-6 rounded-3xl text-white shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center space-x-2 bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs px-3 py-1 rounded-full font-semibold">
              <Heart className="w-3.5 h-3.5 text-emerald-400" />
              <span>실버링크 보호자 전용 케어 뷰어</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              우리 부모님 월간 케어 일지
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm">
              요양보호사님이 매일 기록한 식사, 약 복용, 현장 사진 및 특이사항을 달력으로 한눈에 확인하고 A4 가로 인쇄할 수 있습니다.
            </p>
          </div>

          <button
            onClick={loadData}
            className="self-start sm:self-center flex items-center space-x-2 bg-white/10 hover:bg-white/20 text-white px-3.5 py-2 rounded-xl text-xs font-semibold border border-white/20 transition cursor-pointer"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            <span>최신 기록 불러오기</span>
          </button>
        </div>

        {/* Recipient Selection Bar */}
        <div className="bg-slate-800/90 border border-slate-700/80 p-4 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center space-x-3">
            <User className="w-5 h-5 text-emerald-400 flex-shrink-0" />
            <div>
              <label className="block text-[11px] text-slate-400 font-medium">
                조회할 어르신 선택:
              </label>
              <select
                value={selectedRecipientId}
                onChange={(e) => setSelectedRecipientId(e.target.value)}
                className="bg-transparent text-white text-base font-bold focus:outline-none cursor-pointer"
              >
                {recipients.map((r) => (
                  <option key={r.id} value={r.id} className="bg-slate-900 text-white">
                    {r.name} 어르신 ({r.careLevel})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {selectedRecipient && (
            <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
              <span className="bg-slate-900/80 border border-slate-700 text-slate-300 px-3 py-1 rounded-lg">
                인정번호: {selectedRecipient.certNumber}
              </span>
              <span className="bg-slate-900/80 border border-slate-700 text-emerald-400 px-3 py-1 rounded-lg font-bold">
                본인부담율: {selectedRecipient.coPayRate}%
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Main Printable Care Calendar */}
      {loading ? (
        <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center text-slate-500 shadow-sm">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto text-emerald-600 mb-3" />
          <p className="font-bold text-sm">부모님의 월간 케어 일지를 불러오는 중입니다...</p>
        </div>
      ) : (
        <PrintableCareCalendar
          year={year}
          month={month}
          recipient={selectedRecipient}
          careLogs={recipientLogs}
          schedules={schedules}
          onMonthChange={handleMonthChange}
          showControls={true}
        />
      )}
    </div>
  );
}
