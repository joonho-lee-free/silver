"use client";

import { useState, useEffect, useMemo } from "react";
import {
  Calendar as CalendarIcon,
  Plus,
  Clock,
  User,
  AlertTriangle,
  CheckCircle2,
  Trash2,
  Edit2,
  Filter,
  RefreshCw,
  X,
} from "@/lib/icons";
import { Schedule, Caregiver, Recipient } from "@/lib/types/erp";
import {
  getSchedules,
  getCaregivers,
  getRecipients,
  addSchedule,
  updateSchedule,
  deleteSchedule,
  checkScheduleOverlap,
  seedInitialErpData,
} from "@/lib/firebaseErp";

const DAYS_OF_WEEK = [
  { id: 1, label: "월요일", short: "월" },
  { id: 2, label: "화요일", short: "화" },
  { id: 3, label: "수요일", short: "수" },
  { id: 4, label: "목요일", short: "목" },
  { id: 5, label: "금요일", short: "금" },
  { id: 6, label: "토요일", short: "토" },
  { id: 0, label: "일요일", short: "일" },
];

const SERVICE_TYPES: Schedule["serviceType"][] = [
  "방문요양",
  "방문목욕",
  "방문간호",
  "주야간보호",
];

export default function SchedulesPage() {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [caregivers, setCaregivers] = useState<Caregiver[]>([]);
  const [recipients, setRecipients] = useState<Recipient[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [selectedCaregiverFilter, setSelectedCaregiverFilter] = useState<string>("all");
  const [selectedRecipientFilter, setSelectedRecipientFilter] = useState<string>("all");

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingScheduleId, setEditingScheduleId] = useState<string | null>(null);

  // Form State
  const [caregiverId, setCaregiverId] = useState("");
  const [recipientId, setRecipientId] = useState("");
  const [dayOfWeek, setDayOfWeek] = useState<number>(1);
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("12:00");
  const [serviceType, setServiceType] = useState<Schedule["serviceType"]>("방문요양");
  const [notes, setNotes] = useState("");

  // Overlap Error Modal / Message
  const [overlapError, setOverlapError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      let [scList, cgList, rcList] = await Promise.all([
        getSchedules(),
        getCaregivers(),
        getRecipients(),
      ]);

      if (scList.length === 0 && cgList.length === 0) {
        await seedInitialErpData();
        [scList, cgList, rcList] = await Promise.all([
          getSchedules(),
          getCaregivers(),
          getRecipients(),
        ]);
      }

      setSchedules(scList);
      setCaregivers(cgList);
      setRecipients(rcList);
    } catch (err) {
      console.error("Error loading schedules data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Filtered schedules list
  const filteredSchedules = useMemo(() => {
    return schedules.filter((s) => {
      if (selectedCaregiverFilter !== "all" && s.caregiverId !== selectedCaregiverFilter) {
        return false;
      }
      if (selectedRecipientFilter !== "all" && s.recipientId !== selectedRecipientFilter) {
        return false;
      }
      return true;
    });
  }, [schedules, selectedCaregiverFilter, selectedRecipientFilter]);

  // Open Modal for New Schedule
  const openNewScheduleModal = (dayId?: number) => {
    setEditingScheduleId(null);
    setCaregiverId(caregivers[0]?.id || "");
    setRecipientId(recipients[0]?.id || "");
    setDayOfWeek(dayId !== undefined ? dayId : 1);
    setStartTime("09:00");
    setEndTime("12:00");
    setServiceType("방문요양");
    setNotes("");
    setOverlapError(null);
    setIsModalOpen(true);
  };

  // Open Modal for Editing Schedule
  const openEditScheduleModal = (s: Schedule) => {
    setEditingScheduleId(s.id);
    setCaregiverId(s.caregiverId);
    setRecipientId(s.recipientId);
    setDayOfWeek(s.dayOfWeek);
    setStartTime(s.startTime);
    setEndTime(s.endTime);
    setServiceType(s.serviceType);
    setNotes(s.notes || "");
    setOverlapError(null);
    setIsModalOpen(true);
  };

  // Save Schedule with Overlap Validation
  const handleSaveSchedule = async (e: React.FormEvent) => {
    e.preventDefault();
    setOverlapError(null);

    if (!caregiverId || !recipientId) {
      alert("요양보호사와 수급자를 모두 선택해 주세요.");
      return;
    }

    if (startTime >= endTime) {
      alert("종료 시간은 시작 시간보다 이후여야 합니다.");
      return;
    }

    const selectedCaregiver = caregivers.find((c) => c.id === caregiverId);
    const selectedRecipient = recipients.find((r) => r.id === recipientId);

    // 🔴 Validation: Overlapping Check for Same Caregiver on Same Day
    const conflicting = checkScheduleOverlap(schedules, {
      caregiverId,
      dayOfWeek,
      startTime,
      endTime,
      excludeScheduleId: editingScheduleId || undefined,
    });

    if (conflicting) {
      const dayName = DAYS_OF_WEEK.find((d) => d.id === dayOfWeek)?.label || "";
      setOverlapError(
        `[시간 중복 오류] ${selectedCaregiver?.name || "선택한 요양보호사"}는 ${dayName} ${conflicting.startTime} ~ ${conflicting.endTime} 시간에 이미 ${conflicting.recipientName} 어르신 방문 일정이 등록되어 있습니다.`
      );
      return;
    }

    setSaving(true);
    try {
      const scheduleData = {
        caregiverId,
        caregiverName: selectedCaregiver?.name || "알수없음",
        recipientId,
        recipientName: selectedRecipient?.name || "알수없음",
        dayOfWeek,
        startTime,
        endTime,
        serviceType,
        notes,
      };

      if (editingScheduleId) {
        await updateSchedule(editingScheduleId, scheduleData);
      } else {
        await addSchedule(scheduleData);
      }

      setIsModalOpen(false);
      await loadData();
    } catch (err) {
      console.error("Save schedule error:", err);
      alert("일정 저장에 실패했습니다.");
    } finally {
      setSaving(false);
    }
  };

  // Delete Schedule
  const handleDeleteSchedule = async (id: string, name: string) => {
    if (!confirm(`'${name}' 어르신의 방문 일정을 삭제하시겠습니까?`)) return;
    try {
      await deleteSchedule(id);
      await loadData();
    } catch (err) {
      console.error("Delete schedule error:", err);
      alert("삭제 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Title */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center space-x-2 text-blue-600 font-semibold text-xs tracking-wider uppercase mb-1">
            <CalendarIcon className="w-4 h-4" />
            <span>EasyCare 일정 관리 모듈</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900">
            방문 일정 배정 캘린더
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            요양보호사와 수급자 간 방문 시간대를 등록하고, 동일 요양보호사의 시간 중복 여부를 실시간 검증합니다.
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
            onClick={() => openNewScheduleModal()}
            className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2.5 rounded-xl shadow-md transition cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>신규 일정 등록</span>
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <div className="flex items-center space-x-2 text-xs font-semibold text-slate-500">
            <Filter className="w-4 h-4 text-slate-400" />
            <span>필터:</span>
          </div>

          {/* Caregiver Filter */}
          <select
            value={selectedCaregiverFilter}
            onChange={(e) => setSelectedCaregiverFilter(e.target.value)}
            className="text-sm bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
          >
            <option value="all">전체 요양보호사 ({caregivers.length}명)</option>
            {caregivers.map((cg) => (
              <option key={cg.id} value={cg.id}>
                {cg.name}
              </option>
            ))}
          </select>

          {/* Recipient Filter */}
          <select
            value={selectedRecipientFilter}
            onChange={(e) => setSelectedRecipientFilter(e.target.value)}
            className="text-sm bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
          >
            <option value="all">전체 수급자 ({recipients.length}명)</option>
            {recipients.map((rc) => (
              <option key={rc.id} value={rc.id}>
                {rc.name} ({rc.careLevel})
              </option>
            ))}
          </select>
        </div>

        <div className="text-xs text-slate-500 font-medium self-end md:self-center">
          총 <span className="font-bold text-blue-600">{filteredSchedules.length}</span>건의 배정 일정
        </div>
      </div>

      {/* Weekly Schedule Grid */}
      {loading ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-500">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto text-blue-500 mb-3" />
          <p className="font-medium text-sm">일정을 불러오는 중입니다...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
          {DAYS_OF_WEEK.map((day) => {
            const daySchedules = filteredSchedules
              .filter((s) => s.dayOfWeek === day.id)
              .sort((a, b) => a.startTime.localeCompare(b.startTime));

            return (
              <div
                key={day.id}
                className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col min-h-[380px]"
              >
                {/* Day Header */}
                <div className="bg-slate-900 text-white px-3 py-2.5 flex items-center justify-between">
                  <span className="font-bold text-sm">{day.label}</span>
                  <span className="text-xs bg-slate-800 text-slate-300 px-2 py-0.5 rounded-full font-mono">
                    {daySchedules.length}건
                  </span>
                </div>

                {/* Day Schedule Items */}
                <div className="p-2.5 space-y-2 flex-1 overflow-y-auto">
                  {daySchedules.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-center p-4 text-slate-300">
                      <p className="text-xs">일정 없음</p>
                    </div>
                  ) : (
                    daySchedules.map((sched) => (
                      <div
                        key={sched.id}
                        className="bg-slate-50 hover:bg-blue-50/50 border border-slate-200 hover:border-blue-300 rounded-xl p-3 transition group relative"
                      >
                        <div className="flex items-center justify-between text-xs font-semibold text-blue-700 mb-1">
                          <span className="flex items-center space-x-1 font-mono bg-blue-100/70 text-blue-800 px-1.5 py-0.5 rounded">
                            <Clock className="w-3 h-3" />
                            <span>
                              {sched.startTime} - {sched.endTime}
                            </span>
                          </span>
                          <span className="text-[10px] bg-slate-200 text-slate-700 px-1.5 py-0.5 rounded font-normal">
                            {sched.serviceType}
                          </span>
                        </div>

                        <div className="text-sm font-bold text-slate-900 mb-0.5">
                          {sched.recipientName} <span className="text-xs font-normal text-slate-500">어르신</span>
                        </div>

                        <div className="text-xs text-slate-600 flex items-center space-x-1">
                          <User className="w-3 h-3 text-slate-400" />
                          <span>{sched.caregiverName}</span>
                        </div>

                        {sched.notes && (
                          <p className="text-[11px] text-slate-400 mt-1 line-clamp-1 italic">
                            "{sched.notes}"
                          </p>
                        )}

                        {/* Action Buttons */}
                        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition flex items-center space-x-1 bg-white/90 p-1 rounded-md shadow border border-slate-200">
                          <button
                            onClick={() => openEditScheduleModal(sched)}
                            className="p-1 hover:text-blue-600 text-slate-500 rounded"
                            title="수정"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteSchedule(sched.id, sched.recipientName)}
                            className="p-1 hover:text-red-600 text-slate-500 rounded"
                            title="삭제"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* Add Button per day */}
                <div className="p-2 border-t border-slate-100 bg-slate-50/50">
                  <button
                    onClick={() => openNewScheduleModal(day.id)}
                    className="w-full py-1.5 border border-dashed border-slate-300 hover:border-blue-400 hover:bg-blue-50 text-slate-500 hover:text-blue-600 rounded-lg text-xs font-medium transition flex items-center justify-center space-x-1 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>추가</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Schedule Modal (Add/Edit) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <h3 className="text-lg font-bold text-slate-900 flex items-center space-x-2">
                <CalendarIcon className="w-5 h-5 text-blue-600" />
                <span>{editingScheduleId ? "방문 일정 수정" : "신규 방문 일정 등록"}</span>
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Overlap Alert Banner */}
            {overlapError && (
              <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl text-xs space-y-1.5 flex items-start space-x-3">
                <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-red-800 text-sm">시간 중복 경고</h4>
                  <p className="leading-relaxed">{overlapError}</p>
                </div>
              </div>
            )}

            <form onSubmit={handleSaveSchedule} className="space-y-4">
              {/* Caregiver Select */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  담당 요양보호사 <span className="text-red-500">*</span>
                </label>
                <select
                  value={caregiverId}
                  onChange={(e) => setCaregiverId(e.target.value)}
                  className="w-full text-sm border border-slate-200 rounded-xl p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                  required
                >
                  {caregivers.map((cg) => (
                    <option key={cg.id} value={cg.id}>
                      {cg.name} ({cg.phone})
                    </option>
                  ))}
                </select>
              </div>

              {/* Recipient Select */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  대상 수급자 <span className="text-red-500">*</span>
                </label>
                <select
                  value={recipientId}
                  onChange={(e) => setRecipientId(e.target.value)}
                  className="w-full text-sm border border-slate-200 rounded-xl p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                  required
                >
                  {recipients.map((rc) => (
                    <option key={rc.id} value={rc.id}>
                      {rc.name} 어르신 ({rc.careLevel}) - 인정번호: {rc.certNumber}
                    </option>
                  ))}
                </select>
              </div>

              {/* Day of Week */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  방문 요일 <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-7 gap-1.5">
                  {DAYS_OF_WEEK.map((d) => (
                    <button
                      type="button"
                      key={d.id}
                      onClick={() => setDayOfWeek(d.id)}
                      className={`py-2 text-xs font-bold rounded-lg border transition ${
                        dayOfWeek === d.id
                          ? "bg-blue-600 text-white border-blue-600 shadow"
                          : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                      }`}
                    >
                      {d.short}
                    </button>
                  ))}
                </div>
              </div>

              {/* Time Slots */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    시작 시간 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="w-full text-sm border border-slate-200 rounded-xl p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    종료 시간 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="time"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="w-full text-sm border border-slate-200 rounded-xl p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                    required
                  />
                </div>
              </div>

              {/* Service Type */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  급여 종류
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {SERVICE_TYPES.map((st) => (
                    <button
                      type="button"
                      key={st}
                      onClick={() => setServiceType(st)}
                      className={`py-2 text-xs font-medium rounded-lg border transition ${
                        serviceType === st
                          ? "bg-slate-900 text-white border-slate-900"
                          : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  특이사항 및 메모
                </label>
                <input
                  type="text"
                  placeholder="예: 아침 약 섭취 수발, 주 2회 방문"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full text-sm border border-slate-200 rounded-xl p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Form Buttons */}
              <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-sm font-medium hover:bg-slate-50 transition"
                >
                  취소
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium shadow-md transition disabled:opacity-50 flex items-center space-x-1"
                >
                  {saving ? (
                    <span>저장 중...</span>
                  ) : (
                    <span>{editingScheduleId ? "수정 완료" : "일정 등록"}</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
