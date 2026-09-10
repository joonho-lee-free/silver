"use client";

import { useState, useEffect, useMemo } from "react";
import { Recipient, Caregiver, Schedule } from "@/lib/types/erp";
import { getRecipients, getCaregivers, getCareLogs, getSchedules } from "@/lib/firebaseErp";
import PrintableCareCalendar, { ExtendedCareLog } from "@/components/PrintableCareCalendar";
import { Printer, Filter, Users, User, Calendar as CalendarIcon, RefreshCw, Sparkles } from "@/lib/icons";

// 🔴 High Quality Unsplash Photo URLs for Senior Care Mock Dataset
const MOCK_PHOTOS = {
  care: "https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?w=300&q=80",
  meal1: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=300&q=80",
  park: "https://images.unsplash.com/photo-1519331379826-f10be5486c6f?w=300&q=80",
  tea: "https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=300&q=80",
  porridge: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=300&q=80",
};

// 🔴 Rich September 2026 Embedded Mock Dataset for Park Soon-ja Senior
const PARK_SOON_JA_RECIPIENT: Recipient = {
  id: "rec-park-soonja",
  name: "박순자",
  birthDate: "1943-07-15",
  careLevel: "3등급",
  certNumber: "L1234567890",
  startDate: "2026-01-01",
  endDate: "2026-12-31",
  coPayRate: 15,
  phone: "010-9988-7766",
  address: "서울특별시 서초구 반포대로 100",
  notes: "독거 어르신, 당뇨 관리 및 소화 관리 필요",
};

const MOCK_SEPTEMBER_2026_LOGS: ExtendedCareLog[] = [
  {
    scheduleId: "sc-01",
    recipientId: "rec-park-soonja",
    recipientName: "박순자 어르신",
    caregiverId: "cg-01",
    caregiverName: "김영희 요양사",
    logDate: "2026-09-01",
    startTime: "09:00",
    endTime: "12:00",
    mealStatus: "전부 섭취",
    mealMenu: "소고기무국, 시금치나물",
    medicationStatus: "완료",
    medicationDetail: "아침/점심 완료",
    physicalActivity: ["세면도움", "식사도움", "신체기능유지"],
    photoUrl: MOCK_PHOTOS.care,
    notes: "컨디션 양호, 혈압 120/80 정상",
    createdAt: "2026-09-01T12:00:00Z",
  },
  {
    scheduleId: "sc-02",
    recipientId: "rec-park-soonja",
    recipientName: "박순자 어르신",
    caregiverId: "cg-01",
    caregiverName: "김영희 요양사",
    logDate: "2026-09-02",
    startTime: "09:00",
    endTime: "12:00",
    mealStatus: "반 이상 섭취",
    mealMenu: "단호박죽, 계란찜",
    medicationStatus: "완료",
    medicationDetail: "점심 완료",
    physicalActivity: ["외출동행", "몸청결"],
    photoUrl: MOCK_PHOTOS.park,
    notes: "오후 2시 동네 화단 20분 산책",
    createdAt: "2026-09-02T12:00:00Z",
  },
  {
    scheduleId: "sc-03",
    recipientId: "rec-park-soonja",
    recipientName: "박순자 어르신",
    caregiverId: "cg-01",
    caregiverName: "김영희 요양사",
    logDate: "2026-09-03",
    startTime: "09:00",
    endTime: "12:00",
    mealStatus: "반 미만 섭취",
    mealMenu: "입맛 저하, 숭늉",
    medicationStatus: "완료",
    medicationDetail: "아침 완료",
    physicalActivity: ["식사도움", "세면도움"],
    photoUrl: MOCK_PHOTOS.porridge,
    notes: "치통 호소, 유동식 위주 제공",
    createdAt: "2026-09-03T12:00:00Z",
  },
  {
    scheduleId: "sc-04",
    recipientId: "rec-park-soonja",
    recipientName: "박순자 어르신",
    caregiverId: "cg-01",
    caregiverName: "김영희 요양사",
    logDate: "2026-09-04",
    startTime: "09:00",
    endTime: "12:00",
    mealStatus: "전부 섭취",
    mealMenu: "조기구이, 콩나물국",
    medicationStatus: "완료",
    medicationDetail: "아침/점심 완료",
    physicalActivity: ["몸청결", "신체기능유지"],
    photoUrl: MOCK_PHOTOS.meal1,
    notes: "손톱 정형 및 족욕 수발 지원",
    createdAt: "2026-09-04T12:00:00Z",
  },
  {
    scheduleId: "sc-05",
    recipientId: "rec-park-soonja",
    recipientName: "박순자 어르신",
    caregiverId: "cg-01",
    caregiverName: "김영희 요양사",
    logDate: "2026-09-07",
    startTime: "09:00",
    endTime: "12:00",
    mealStatus: "전부 섭취",
    mealMenu: "된장찌개, 불고기",
    medicationStatus: "완료",
    medicationDetail: "아침/점심 완료",
    physicalActivity: ["식사도움", "말벗정서"],
    photoUrl: MOCK_PHOTOS.tea,
    notes: "기분 밝으시고 말벗 상대로 많은 대화 나눔",
    createdAt: "2026-09-07T12:00:00Z",
  },
  {
    scheduleId: "sc-06",
    recipientId: "rec-park-soonja",
    recipientName: "박순자 어르신",
    caregiverId: "cg-01",
    caregiverName: "김영희 요양사",
    logDate: "2026-09-08",
    startTime: "09:00",
    endTime: "12:00",
    mealStatus: "반 이상 섭취",
    mealMenu: "전복죽, 두부조림",
    medicationStatus: "완료",
    medicationDetail: "아침 완료",
    physicalActivity: ["외출동행", "신체기능유지"],
    photoUrl: MOCK_PHOTOS.park,
    notes: "보행 보조기 활용 복도 30분 운동",
    createdAt: "2026-09-08T12:00:00Z",
  },
  {
    scheduleId: "sc-07",
    recipientId: "rec-park-soonja",
    recipientName: "박순자 어르신",
    caregiverId: "cg-01",
    caregiverName: "김영희 요양사",
    logDate: "2026-09-09",
    startTime: "09:00",
    endTime: "12:00",
    mealStatus: "전부 섭취",
    mealMenu: "미역국, 멸치볶음",
    medicationStatus: "완료",
    medicationDetail: "아침/점심 완료",
    physicalActivity: ["식사도움", "몸청결"],
    photoUrl: MOCK_PHOTOS.tea,
    notes: "따뜻한 대추차 수분 섭취 수발",
    createdAt: "2026-09-09T12:00:00Z",
  },
  {
    scheduleId: "sc-08",
    recipientId: "rec-park-soonja",
    recipientName: "박순자 어르신",
    caregiverId: "cg-01",
    caregiverName: "김영희 요양사",
    logDate: "2026-09-10",
    startTime: "09:00",
    endTime: "12:00",
    mealStatus: "전부 섭취",
    mealMenu: "삼계탕, 깍두기",
    medicationStatus: "완료",
    medicationDetail: "아침/점심 완료",
    physicalActivity: ["식사도움", "신체기능유지"],
    photoUrl: MOCK_PHOTOS.meal1,
    notes: "기력 회복 영양식 전부 섭취함",
    createdAt: "2026-09-10T12:00:00Z",
  },
  {
    scheduleId: "sc-09",
    recipientId: "rec-park-soonja",
    recipientName: "박순자 어르신",
    caregiverId: "cg-01",
    caregiverName: "김영희 요양사",
    logDate: "2026-09-11",
    startTime: "09:00",
    endTime: "12:00",
    mealStatus: "반 이상 섭취",
    mealMenu: "계란국, 버섯볶음",
    medicationStatus: "완료",
    medicationDetail: "아침 완료",
    physicalActivity: ["체위변경", "몸청결"],
    photoUrl: MOCK_PHOTOS.care,
    notes: "체위 변경 및 가벼운 관절 스트레칭",
    createdAt: "2026-09-11T12:00:00Z",
  },
  {
    scheduleId: "sc-10",
    recipientId: "rec-park-soonja",
    recipientName: "박순자 어르신",
    caregiverId: "cg-01",
    caregiverName: "김영희 요양사",
    logDate: "2026-09-14",
    startTime: "09:00",
    endTime: "12:00",
    mealStatus: "전부 섭취",
    mealMenu: "갈비탕, 잡채",
    medicationStatus: "완료",
    medicationDetail: "아침/점심 완료",
    physicalActivity: ["식사도움", "복약수발"],
    photoUrl: MOCK_PHOTOS.meal1,
    notes: "소화 양호, 약 복용 수발 완수",
    createdAt: "2026-09-14T12:00:00Z",
  },
  {
    scheduleId: "sc-11",
    recipientId: "rec-park-soonja",
    recipientName: "박순자 어르신",
    caregiverId: "cg-01",
    caregiverName: "김영희 요양사",
    logDate: "2026-09-15",
    startTime: "09:00",
    endTime: "12:00",
    mealStatus: "반 이상 섭취",
    mealMenu: "야채죽, 동치미",
    medicationStatus: "완료",
    medicationDetail: "점심 완료",
    physicalActivity: ["외출동행"],
    photoUrl: MOCK_PHOTOS.park,
    notes: "동네 마실 15분 동행 수행",
    createdAt: "2026-09-15T12:00:00Z",
  },
  {
    scheduleId: "sc-12",
    recipientId: "rec-park-soonja",
    recipientName: "박순자 어르신",
    caregiverId: "cg-01",
    caregiverName: "김영희 요양사",
    logDate: "2026-09-16",
    startTime: "09:00",
    endTime: "12:00",
    mealStatus: "전부 섭취",
    mealMenu: "청국장, 계란말이",
    medicationStatus: "완료",
    medicationDetail: "아침/점심 완료",
    physicalActivity: ["세면도움", "몸청결"],
    photoUrl: MOCK_PHOTOS.care,
    notes: "얼굴 세면 및 피부 로션 도포 지원",
    createdAt: "2026-09-16T12:00:00Z",
  },
  {
    scheduleId: "sc-13",
    recipientId: "rec-park-soonja",
    recipientName: "박순자 어르신",
    caregiverId: "cg-01",
    caregiverName: "김영희 요양사",
    logDate: "2026-09-17",
    startTime: "09:00",
    endTime: "12:00",
    mealStatus: "전부 섭취",
    mealMenu: "북엇국, 애호박전",
    medicationStatus: "완료",
    medicationDetail: "아침/점심 완료",
    physicalActivity: ["식사도움", "신체기능유지"],
    photoUrl: MOCK_PHOTOS.tea,
    notes: "컨디션 최고조, 웃음 많으심",
    createdAt: "2026-09-17T12:00:00Z",
  },
  {
    scheduleId: "sc-14",
    recipientId: "rec-park-soonja",
    recipientName: "박순자 어르신",
    caregiverId: "cg-01",
    caregiverName: "김영희 요양사",
    logDate: "2026-09-18",
    startTime: "09:00",
    endTime: "12:00",
    mealStatus: "반 미만 섭취",
    mealMenu: "잣죽",
    medicationStatus: "완료",
    medicationDetail: "아침 완료",
    physicalActivity: ["휴식수발"],
    photoUrl: MOCK_PHOTOS.porridge,
    notes: "약간의 소화불량으로 경과 관찰",
    createdAt: "2026-09-18T12:00:00Z",
  },
  {
    scheduleId: "sc-15",
    recipientId: "rec-park-soonja",
    recipientName: "박순자 어르신",
    caregiverId: "cg-01",
    caregiverName: "김영희 요양사",
    logDate: "2026-09-21",
    startTime: "09:00",
    endTime: "12:00",
    mealStatus: "전부 섭취",
    mealMenu: "소고기미역국, 시금치",
    medicationStatus: "완료",
    medicationDetail: "아침/점심 완료",
    physicalActivity: ["식사도움", "몸청결"],
    photoUrl: MOCK_PHOTOS.meal1,
    notes: "주간 방문 요양 서비스 수발 완수",
    createdAt: "2026-09-21T12:00:00Z",
  },
  {
    scheduleId: "sc-16",
    recipientId: "rec-park-soonja",
    recipientName: "박순자 어르신",
    caregiverId: "cg-01",
    caregiverName: "김영희 요양사",
    logDate: "2026-09-22",
    startTime: "09:00",
    endTime: "12:00",
    mealStatus: "전부 섭취",
    mealMenu: "대구탕, 두부구이",
    medicationStatus: "완료",
    medicationDetail: "아침/점심 완료",
    physicalActivity: ["외출동행"],
    photoUrl: MOCK_PHOTOS.park,
    notes: "화단 정원 구경 산책 동행",
    createdAt: "2026-09-22T12:00:00Z",
  },
  {
    scheduleId: "sc-17",
    recipientId: "rec-park-soonja",
    recipientName: "박순자 어르신",
    caregiverId: "cg-01",
    caregiverName: "김영희 요양사",
    logDate: "2026-09-23",
    startTime: "09:00",
    endTime: "12:00",
    mealStatus: "반 이상 섭취",
    mealMenu: "단호박전복죽",
    medicationStatus: "완료",
    medicationDetail: "아침 완료",
    physicalActivity: ["식사도움"],
    photoUrl: MOCK_PHOTOS.porridge,
    notes: "약 복용 시간 준수 확인",
    createdAt: "2026-09-23T12:00:00Z",
  },
  {
    scheduleId: "sc-18",
    recipientId: "rec-park-soonja",
    recipientName: "박순자 어르신",
    caregiverId: "cg-01",
    caregiverName: "김영희 요양사",
    logDate: "2026-09-24",
    startTime: "09:00",
    endTime: "12:00",
    mealStatus: "전부 섭취",
    mealMenu: "황태국, 감자채볶음",
    medicationStatus: "완료",
    medicationDetail: "아침/점심 완료",
    physicalActivity: ["신체기능유지", "혈압체크"],
    photoUrl: MOCK_PHOTOS.care,
    notes: "혈압 125/82, 체온 36.5 정상",
    createdAt: "2026-09-24T12:00:00Z",
  },
  {
    scheduleId: "sc-19",
    recipientId: "rec-park-soonja",
    recipientName: "박순자 어르신",
    caregiverId: "cg-01",
    caregiverName: "김영희 요양사",
    logDate: "2026-09-25",
    startTime: "09:00",
    endTime: "12:00",
    mealStatus: "전부 섭취",
    mealMenu: "추어탕, 겉절이",
    medicationStatus: "완료",
    medicationDetail: "아침/점심 완료",
    physicalActivity: ["식사도움", "몸청결"],
    photoUrl: MOCK_PHOTOS.meal1,
    notes: "주말 전 건강 상태 양호 확인",
    createdAt: "2026-09-25T12:00:00Z",
  },
  {
    scheduleId: "sc-20",
    recipientId: "rec-park-soonja",
    recipientName: "박순자 어르신",
    caregiverId: "cg-01",
    caregiverName: "김영희 요양사",
    logDate: "2026-09-28",
    startTime: "09:00",
    endTime: "12:00",
    mealStatus: "전부 섭취",
    mealMenu: "사골곰탕, 석박지",
    medicationStatus: "완료",
    medicationDetail: "아침/점심 완료",
    physicalActivity: ["식사도움", "세면도움"],
    photoUrl: MOCK_PHOTOS.care,
    notes: "아침 식사 완식 후 기분 좋으심",
    createdAt: "2026-09-28T12:00:00Z",
  },
  {
    scheduleId: "sc-21",
    recipientId: "rec-park-soonja",
    recipientName: "박순자 어르신",
    caregiverId: "cg-01",
    caregiverName: "김영희 요양사",
    logDate: "2026-09-29",
    startTime: "09:00",
    endTime: "12:00",
    mealStatus: "반 이상 섭취",
    mealMenu: "잣죽, 계란찜",
    medicationStatus: "완료",
    medicationDetail: "아침 완료",
    physicalActivity: ["외출동행"],
    photoUrl: MOCK_PHOTOS.park,
    notes: "햇볕 쬐기 20분 정원 산책",
    createdAt: "2026-09-29T12:00:00Z",
  },
  {
    scheduleId: "sc-22",
    recipientId: "rec-park-soonja",
    recipientName: "박순자 어르신",
    caregiverId: "cg-01",
    caregiverName: "김영희 요양사",
    logDate: "2026-09-30",
    startTime: "09:00",
    endTime: "12:00",
    mealStatus: "전부 섭취",
    mealMenu: "소고기무국, 나물모듬",
    medicationStatus: "완료",
    medicationDetail: "아침/점심 완료",
    physicalActivity: ["식사도움", "몸청결", "신체기능유지"],
    photoUrl: MOCK_PHOTOS.meal1,
    notes: "9월 한 달 케어 성공적 완료",
    createdAt: "2026-09-30T12:00:00Z",
  },
];

export default function AdminPrintCalendarPage() {
  const [dbRecipients, setDbRecipients] = useState<Recipient[]>([]);
  const [dbCareLogs, setDbCareLogs] = useState<ExtendedCareLog[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [selectedRecipientId, setSelectedRecipientId] = useState<string>("rec-park-soonja");
  const [year, setYear] = useState(2026);
  const [month, setMonth] = useState(9);

  const loadData = async () => {
    setLoading(true);
    try {
      const [rcList, logList] = await Promise.all([
        getRecipients(),
        getCareLogs(),
      ]);

      setDbRecipients(rcList);
      setDbCareLogs(logList as ExtendedCareLog[]);
    } catch (err) {
      console.error("Error loading print calendar data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Combined Recipients (Including Embedded Mock Recipient)
  const allRecipients = useMemo(() => {
    const list = [PARK_SOON_JA_RECIPIENT];
    dbRecipients.forEach((r) => {
      if (r.id !== PARK_SOON_JA_RECIPIENT.id) {
        list.push(r);
      }
    });
    return list;
  }, [dbRecipients]);

  // Current Selected Recipient
  const activeRecipient = useMemo(() => {
    return allRecipients.find((r) => r.id === selectedRecipientId) || PARK_SOON_JA_RECIPIENT;
  }, [allRecipients, selectedRecipientId]);

  // Combined Care Logs for Active Recipient & Month
  const activeCareLogs = useMemo(() => {
    // Start with embedded mock logs if Park Soon-ja & Sept 2026
    let list: ExtendedCareLog[] = [];
    if (activeRecipient.id === PARK_SOON_JA_RECIPIENT.id && year === 2026 && month === 9) {
      list = [...MOCK_SEPTEMBER_2026_LOGS];
    }

    // Append Firestore logs if available
    dbCareLogs.forEach((log) => {
      if (log.recipientId === activeRecipient.id) {
        const [logY, logM] = log.logDate.split("-").map(Number);
        if (logY === year && logM === month) {
          list.push(log);
        }
      }
    });

    return list;
  }, [activeRecipient, year, month, dbCareLogs]);

  const handleMonthChange = (newYear: number, newMonth: number) => {
    setYear(newYear);
    setMonth(newMonth);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Top Admin Controls & Filter Bar (Hidden on Print) */}
      <div className="print:hidden bg-white p-6 sm:p-7 rounded-3xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center space-x-2 bg-blue-50 border border-blue-200 text-blue-700 text-xs px-3 py-1 rounded-full font-bold uppercase tracking-wider mb-1">
              <Printer className="w-3.5 h-3.5" />
              <span>실버링크 공단 제출 및 센터 행정용 인쇄 전용 뷰어</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              월간 일지 & 식단 발주 달력 인쇄
            </h1>
            <p className="text-slate-500 text-xs sm:text-sm mt-1">
              A4 가로 규격 출력에 최적화된 어르신별 월간 케어 일지 달력입니다. 상단 인쇄 버튼을 눌러 깔끔하게 출력하세요.
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={loadData}
              className="p-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 transition cursor-pointer"
              title="새로고침"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            </button>
            <button
              onClick={() => window.print()}
              className="flex items-center space-x-2 bg-emerald-600 hover:bg-emerald-700 text-white font-black px-6 py-3 rounded-xl shadow-lg transition cursor-pointer text-sm"
            >
              <Printer className="w-5 h-5" />
              <span>🖨️ A4 가로 출력하기 (window.print)</span>
            </button>
          </div>
        </div>

        {/* Filter Controls */}
        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center space-x-1.5 text-xs font-bold text-slate-500">
              <Filter className="w-4 h-4 text-slate-400" />
              <span>대상 어르신 선택:</span>
            </div>

            {/* Recipient Selector Dropdown */}
            <select
              value={selectedRecipientId}
              onChange={(e) => setSelectedRecipientId(e.target.value)}
              className="text-sm bg-white border border-slate-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-bold shadow-2xs cursor-pointer"
            >
              {allRecipients.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name} 어르신 (장기요양 {r.careLevel} / {r.certNumber})
                </option>
              ))}
            </select>

            {/* Year & Month Picker */}
            <div className="flex items-center space-x-2 bg-white border border-slate-300 rounded-xl px-3 py-1.5 text-sm font-bold shadow-2xs">
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

          <div className="flex items-center space-x-2 text-xs font-mono text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-xl font-bold">
            <Sparkles className="w-4 h-4 text-emerald-600" />
            <span>2026년 9월 한 달치 샘플 데이터셋 자동 주입 완료 ({activeCareLogs.length}일 기록)</span>
          </div>
        </div>
      </div>

      {/* Embedded Printable Monthly Care Calendar Component */}
      <div className="w-full">
        <PrintableCareCalendar
          year={year}
          month={month}
          recipient={activeRecipient}
          caregiverName="김영희 요양사"
          careLogs={activeCareLogs}
          showControls={true}
        />
      </div>
    </div>
  );
}
