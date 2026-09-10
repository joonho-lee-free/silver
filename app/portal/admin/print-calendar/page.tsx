"use client";

import { useState, useEffect, useMemo } from "react";
import { Recipient, Caregiver, CareLog, Schedule } from "@/lib/types/erp";
import { getRecipients, getCaregivers, getCareLogs, getSchedules, seedInitialErpData } from "@/lib/firebaseErp";
import PrintableCareCalendar from "@/components/PrintableCareCalendar";
import { Printer, Filter, Users, User, Calendar as CalendarIcon, RefreshCw, CheckCircle2, FileText } from "@/lib/icons";

export default function AdminPrintCalendarPage() {
  const [recipients, setRecipients] = useState<Recipient[]>([]);
  const [caregivers, setCaregivers] = useState<Caregiver[]>([]);
  const [careLogs, setCareLogs] = useState<CareLog[]>([]);
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [selectedRecipientId, setSelectedRecipientId] = useState<string>("all");
  const [selectedCaregiverId, setSelectedCaregiverId] = useState<string>("all");

  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth() + 1);

  const loadData = async () => {
    setLoading(true);
    try {
      let [rcList, cgList, logList, scList] = await Promise.all([
        getRecipients(),
        getCaregivers(),
        getCareLogs(),
        getSchedules(),
      ]);

      if (rcList.length === 0) {
        await seedInitialErpData();
        [rcList, cgList, logList, scList] = await Promise.all([
          getRecipients(),
          getCaregivers(),
          getCareLogs(),
          getSchedules(),
        ]);
      }

      setRecipients(rcList);
      setCaregivers(cgList);
      setCareLogs(logList);
      setSchedules(scList);
    } catch (err) {
      console.error("Error loading admin print calendar data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Filtered recipients list for output
  const targetRecipients = useMemo(() => {
    return recipients.filter((r) => {
      if (selectedRecipientId !== "all" && r.id !== selectedRecipientId) {
        return false;
      }
      return true;
    });
  }, [recipients, selectedRecipientId]);

  const handleMonthChange = (newYear: number, newMonth: number) => {
    setYear(newYear);
    setMonth(newMonth);
  };

  const handlePrintAll = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Admin Controls Header (Hidden on Print) */}
      <div className="print:hidden bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-blue-600 font-semibold text-xs tracking-wider uppercase mb-1">
              <Printer className="w-4 h-4" />
              <span>Admin 공단 제출 및 보관용 월간 출력 센터</span>
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900">
              어르신별 월간 일지 캘린더 인쇄
            </h1>
            <p className="text-slate-500 text-xs sm:text-sm mt-1">
              공단 제출용 서류 및 보호자 전달용 월간 케어 일지 달력을 A4 가로(Landscape) 규격으로 일괄 인쇄합니다.
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={loadData}
              className="p-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 transition"
              title="새로고침"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            </button>
            <button
              onClick={handlePrintAll}
              className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white font-bold px-5 py-2.5 rounded-xl shadow-md transition cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>전체 일괄 인쇄 (window.print)</span>
            </button>
          </div>
        </div>

        {/* Filter Controls Bar */}
        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center space-x-1.5 text-xs font-bold text-slate-500">
              <Filter className="w-4 h-4 text-slate-400" />
              <span>필터 설정:</span>
            </div>

            {/* Recipient Filter */}
            <select
              value={selectedRecipientId}
              onChange={(e) => setSelectedRecipientId(e.target.value)}
              className="text-sm bg-white border border-slate-200 rounded-xl px-3.5 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 font-bold"
            >
              <option value="all">전체 수급자 ({recipients.length}명 전체 출력)</option>
              {recipients.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name} 어르신 ({r.careLevel})
                </option>
              ))}
            </select>

            {/* Year & Month Selectors */}
            <div className="flex items-center space-x-2 bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-sm font-bold">
              <input
                type="number"
                value={year}
                onChange={(e) => setYear(Number(e.target.value))}
                className="w-16 text-center focus:outline-none font-mono"
                min={2020}
                max={2030}
              />
              <span>년</span>
              <select
                value={month}
                onChange={(e) => setMonth(Number(e.target.value))}
                className="focus:outline-none cursor-pointer font-mono"
              >
                {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                  <option key={m} value={m}>
                    {m}월
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="text-xs font-mono text-slate-500">
            인쇄 대상: <span className="font-bold text-blue-600">{targetRecipients.length}</span>명 어르신
          </div>
        </div>
      </div>

      {/* Printable Calendar Views */}
      {loading ? (
        <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center text-slate-500 shadow-sm">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto text-blue-600 mb-3" />
          <p className="font-bold text-sm">인쇄용 일지 데이터를 불러오는 중입니다...</p>
        </div>
      ) : targetRecipients.length === 0 ? (
        <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center text-slate-400">
          <Users className="w-10 h-10 mx-auto text-slate-300 mb-2" />
          <p className="font-bold text-slate-600">선택한 조건의 수급자가 없습니다.</p>
        </div>
      ) : (
        <div className="space-y-8">
          {targetRecipients.map((rec) => {
            const recLogs = careLogs.filter((log) => {
              if (log.recipientId !== rec.id) return false;
              const [logY, logM] = log.logDate.split("-").map(Number);
              return logY === year && logM === month;
            });

            return (
              <div key={rec.id} className="page-break-after-always">
                <PrintableCareCalendar
                  year={year}
                  month={month}
                  recipient={rec}
                  careLogs={recLogs}
                  schedules={schedules}
                  onMonthChange={handleMonthChange}
                  showControls={selectedRecipientId !== "all"}
                />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
