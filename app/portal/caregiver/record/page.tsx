"use client";

import { useState, useEffect, useMemo } from "react";
import {
  FileCheck,
  Camera,
  CheckCircle2,
  Clock,
  User,
  Calendar,
  Sparkles,
  Upload,
  X,
  AlertCircle,
  ChevronDown,
  RefreshCw,
} from "@/lib/icons";
import { Schedule, Caregiver, CareLog } from "@/lib/types/erp";
import {
  getCaregivers,
  getSchedules,
  addCareLog,
  seedInitialErpData,
} from "@/lib/firebaseErp";

// 공단 표준 신체활동 보조 항목 목록
const PHYSICAL_ACTIVITIES = [
  "세면도움",
  "몸청결",
  "식사도움",
  "체위변경",
  "배설도움",
  "외출동행",
  "신체기능유지",
];

export default function CaregiverRecordPage() {
  const [caregivers, setCaregivers] = useState<Caregiver[]>([]);
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [selectedCaregiverId, setSelectedCaregiverId] = useState<string>("");
  const [loading, setLoading] = useState(true);

  // Selected schedule for today
  const [selectedScheduleId, setSelectedScheduleId] = useState<string>("");

  // Form Fields
  const [mealStatus, setMealStatus] = useState<CareLog["mealStatus"]>("전부 섭취");
  const [medicationStatus, setMedicationStatus] = useState<CareLog["medicationStatus"]>("완료");
  const [physicalActivity, setPhysicalActivity] = useState<string[]>([
    "세면도움",
    "식사도움",
  ]);
  const [notes, setNotes] = useState("");
  const [photoBase64, setPhotoBase64] = useState<string>("");

  // UI state
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Today Date & Day of week
  const todayDate = new Date();
  const todayStr = todayDate.toISOString().split("T")[0];
  const todayDayOfWeek = todayDate.getDay(); // 0=일, 1=월 ...
  const dayNames = ["일요일", "월요일", "화요일", "수요일", "목요일", "금요일", "토요일"];

  const loadData = async () => {
    setLoading(true);
    try {
      let [cgList, scList] = await Promise.all([getCaregivers(), getSchedules()]);
      if (cgList.length === 0) {
        await seedInitialErpData();
        [cgList, scList] = await Promise.all([getCaregivers(), getSchedules()]);
      }

      setCaregivers(cgList);
      setSchedules(scList);

      if (cgList.length > 0) {
        setSelectedCaregiverId(cgList[0].id);
      }
    } catch (err) {
      console.error("Error loading caregiver data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Filter today's schedules assigned to selected caregiver
  const todaySchedules = useMemo(() => {
    if (!selectedCaregiverId) return [];
    return schedules.filter(
      (s) => s.caregiverId === selectedCaregiverId && s.dayOfWeek === todayDayOfWeek
    );
  }, [schedules, selectedCaregiverId, todayDayOfWeek]);

  // Active schedule details
  const activeSchedule = useMemo(() => {
    return todaySchedules.find((s) => s.id === selectedScheduleId) || todaySchedules[0] || null;
  }, [todaySchedules, selectedScheduleId]);

  // Set default schedule selection when todaySchedules updates
  useEffect(() => {
    if (todaySchedules.length > 0 && !selectedScheduleId) {
      setSelectedScheduleId(todaySchedules[0].id);
    }
  }, [todaySchedules, selectedScheduleId]);

  // Toggle Physical Activity Item
  const togglePhysicalActivity = (item: string) => {
    setPhysicalActivity((prev) =>
      prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]
    );
  };

  // Handle Photo Upload (Camera / Gallery)
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      alert("이미지 용량은 10MB 이하만 가능합니다.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setPhotoBase64(event.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  // Submit Form to Firestore 'care_logs'
  const handleSubmitLog = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!activeSchedule) {
      alert("오늘 배정된 스케줄을 먼저 선택해 주세요.");
      return;
    }

    if (physicalActivity.length === 0) {
      alert("신체활동 보조 항목을 최소 1개 이상 선택해 주세요.");
      return;
    }

    const currentCaregiver = caregivers.find((c) => c.id === selectedCaregiverId);

    setSubmitting(true);
    try {
      const careLogData: CareLog = {
        scheduleId: activeSchedule.id,
        recipientId: activeSchedule.recipientId,
        recipientName: activeSchedule.recipientName,
        caregiverId: selectedCaregiverId,
        caregiverName: currentCaregiver?.name || activeSchedule.caregiverName,
        logDate: todayStr,
        startTime: activeSchedule.startTime,
        endTime: activeSchedule.endTime,
        mealStatus,
        medicationStatus,
        physicalActivity,
        photoUrl: photoBase64,
        notes,
        createdAt: new Date().toISOString(),
      };

      await addCareLog(careLogData);
      setSubmitSuccess(true);
    } catch (err) {
      console.error("Submit care log error:", err);
      alert("기록지 저장 중 오류가 발생했습니다.");
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setSubmitSuccess(false);
    setPhotoBase64("");
    setNotes("");
    setMealStatus("전부 섭취");
    setMedicationStatus("완료");
    setPhysicalActivity(["세면도움", "식사도움"]);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Caregiver Selection Bar */}
      <div className="bg-slate-900 text-white p-5 rounded-2xl shadow-lg border border-slate-800 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 text-indigo-400 font-semibold text-xs uppercase tracking-wider">
            <FileCheck className="w-4 h-4" />
            <span>모바일 급여제공기록지</span>
          </div>
          <span className="text-xs bg-indigo-900/80 text-indigo-200 border border-indigo-700/50 px-2.5 py-0.5 rounded-full font-mono">
            {todayStr} ({dayNames[todayDayOfWeek]})
          </span>
        </div>

        {/* Caregiver Switcher */}
        <div className="flex items-center space-x-3 bg-slate-800/80 p-3 rounded-xl border border-slate-700">
          <User className="w-5 h-5 text-indigo-400 flex-shrink-0" />
          <div className="flex-1">
            <label className="block text-[11px] text-slate-400 font-medium">
              현재 작성 요양보호사 선택:
            </label>
            <select
              value={selectedCaregiverId}
              onChange={(e) => {
                setSelectedCaregiverId(e.target.value);
                setSelectedScheduleId("");
              }}
              className="w-full text-base font-bold bg-transparent text-white focus:outline-none cursor-pointer"
            >
              {caregivers.map((cg) => (
                <option key={cg.id} value={cg.id} className="bg-slate-900 text-white">
                  {cg.name} ({cg.phone})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Success Screen Modal / View */}
      {submitSuccess ? (
        <div className="bg-white rounded-2xl border border-emerald-200 p-8 shadow-xl text-center space-y-5 animate-in fade-in zoom-in-95 duration-200">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-extrabold text-slate-900">
              급여제공기록지 제출 완료!
            </h2>
            <p className="text-slate-600 text-sm">
              <span className="font-bold text-slate-900">{activeSchedule?.recipientName} 어르신</span>의
              오늘 급여제공기록이 Firestore <code className="bg-slate-100 text-indigo-600 px-1.5 py-0.5 rounded font-mono">care_logs</code> 컬렉션에 성공적으로 저장되었습니다.
            </p>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl text-left border border-slate-200 text-xs space-y-2 font-mono">
            <div><span className="text-slate-400">수급자:</span> {activeSchedule?.recipientName} 어르신</div>
            <div><span className="text-slate-400">방문시간:</span> {activeSchedule?.startTime} ~ {activeSchedule?.endTime}</div>
            <div><span className="text-slate-400">식사섭취:</span> {mealStatus}</div>
            <div><span className="text-slate-400">복약확인:</span> {medicationStatus}</div>
            <div><span className="text-slate-400">신체활동:</span> {physicalActivity.join(", ")}</div>
            {photoBase64 && <div><span className="text-slate-400">사진첨부:</span> 완료 (Base64/Storage)</div>}
          </div>

          <button
            onClick={resetForm}
            className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg transition text-base cursor-pointer"
          >
            추가 급여제공기록 작성하기
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmitLog} className="space-y-6">
          {/* Section 1: Today Assigned Schedules */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
            <h2 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
              <Clock className="w-4 h-4 text-indigo-600" />
              <span>오늘 배정된 방문 스케줄 ({todaySchedules.length}건)</span>
            </h2>

            {todaySchedules.length === 0 ? (
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800 flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0" />
                <span>오늘({dayNames[todayDayOfWeek]}) 해당 요양보호사에게 배정된 스케줄이 없습니다. 상단에서 다른 요양보호사를 선택하거나 어드민 캘린더에서 스케줄을 추가하세요.</span>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-2">
                {todaySchedules.map((sched) => {
                  const isSelected = (activeSchedule?.id === sched.id);
                  return (
                    <button
                      type="button"
                      key={sched.id}
                      onClick={() => setSelectedScheduleId(sched.id)}
                      className={`p-4 rounded-xl border text-left transition flex items-center justify-between cursor-pointer ${
                        isSelected
                          ? "bg-indigo-50 border-indigo-500 shadow-sm ring-2 ring-indigo-500/20"
                          : "bg-slate-50 border-slate-200 hover:border-slate-300"
                      }`}
                    >
                      <div>
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="font-mono text-xs font-bold text-indigo-700 bg-indigo-100 px-2 py-0.5 rounded">
                            {sched.startTime} ~ {sched.endTime}
                          </span>
                          <span className="text-xs font-medium text-slate-500">
                            {sched.serviceType}
                          </span>
                        </div>
                        <div className="text-base font-bold text-slate-900">
                          {sched.recipientName} <span className="text-xs font-normal text-slate-500">어르신</span>
                        </div>
                      </div>
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center border ${
                        isSelected ? "bg-indigo-600 border-indigo-600 text-white" : "border-slate-300 bg-white"
                      }`}>
                        {isSelected && <CheckCircle2 className="w-4 h-4" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Section 2: Meal Intake (Big Touch Buttons) */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
            <label className="block text-sm font-bold text-slate-900">
              1. 식사 섭취 상태 <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-2 gap-2.5">
              {(["전부 섭취", "반 이상 섭취", "반 미만 섭취", "미섭취"] as CareLog["mealStatus"][]).map((option) => (
                <button
                  type="button"
                  key={option}
                  onClick={() => setMealStatus(option)}
                  className={`min-h-[52px] px-4 py-3 rounded-xl font-bold text-sm transition border flex items-center justify-center cursor-pointer ${
                    mealStatus === option
                      ? "bg-indigo-600 text-white border-indigo-600 shadow-md ring-2 ring-indigo-600/30"
                      : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>

          {/* Section 3: Medication Check (Big Touch Buttons) */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
            <label className="block text-sm font-bold text-slate-900">
              2. 복약 확인 상태 <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-2 gap-2.5">
              {(["완료", "일부 복약", "미복약", "해당없음"] as CareLog["medicationStatus"][]).map((option) => (
                <button
                  type="button"
                  key={option}
                  onClick={() => setMedicationStatus(option)}
                  className={`min-h-[52px] px-4 py-3 rounded-xl font-bold text-sm transition border flex items-center justify-center cursor-pointer ${
                    medicationStatus === option
                      ? "bg-indigo-600 text-white border-indigo-600 shadow-md ring-2 ring-indigo-600/30"
                      : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>

          {/* Section 4: Physical Activity Support (Multi-select Grid) */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <label className="block text-sm font-bold text-slate-900">
                3. 신체활동 보조 항목 <span className="text-red-500">*</span>
              </label>
              <span className="text-xs text-indigo-600 font-semibold">
                (다중 선택 가능 - {physicalActivity.length}개 선택)
              </span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {PHYSICAL_ACTIVITIES.map((act) => {
                const isSelected = physicalActivity.includes(act);
                return (
                  <button
                    type="button"
                    key={act}
                    onClick={() => togglePhysicalActivity(act)}
                    className={`min-h-[52px] px-3 py-2.5 rounded-xl font-bold text-sm transition border flex items-center justify-center space-x-2 cursor-pointer ${
                      isSelected
                        ? "bg-slate-900 text-white border-slate-900 shadow-sm"
                        : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
                    }`}
                  >
                    <span>{act}</span>
                    {isSelected && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section 5: Mobile Camera Photo Upload */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
            <label className="block text-sm font-bold text-slate-900 flex items-center justify-between">
              <span className="flex items-center space-x-2">
                <Camera className="w-4 h-4 text-indigo-600" />
                <span>4. 현장 카메라 사진 촬영 / 첨부</span>
              </span>
              <span className="text-xs font-normal text-slate-400">(선택 사항)</span>
            </label>

            {photoBase64 ? (
              <div className="relative rounded-2xl overflow-hidden border border-slate-300 shadow-md">
                <img
                  src={photoBase64}
                  alt="현장 방문 사진"
                  className="w-full h-56 object-cover"
                />
                <button
                  type="button"
                  onClick={() => setPhotoBase64("")}
                  className="absolute top-3 right-3 bg-slate-900/80 text-white p-2 rounded-full hover:bg-slate-900 transition"
                  title="사진 삭제"
                >
                  <X className="w-5 h-5" />
                </button>
                <div className="absolute bottom-3 left-3 bg-slate-900/80 text-white text-xs px-3 py-1 rounded-full font-mono">
                  촬영 이미지 저장 완료
                </div>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center border-2 border-dashed border-indigo-200 hover:border-indigo-500 bg-indigo-50/40 hover:bg-indigo-50 rounded-2xl p-6 transition cursor-pointer text-center space-y-2">
                <div className="w-12 h-12 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center">
                  <Camera className="w-6 h-6" />
                </div>
                <div className="text-sm font-bold text-slate-800">
                  터치하여 카메라 촬영 또는 사진 선택
                </div>
                <p className="text-xs text-slate-500">
                  모바일 카메라 촬영 지원 (<code className="font-mono text-indigo-600">capture="environment"</code>)
                </p>
                <input
                  type="file"
                  accept="image/*"
                  capture="environment"
                  onChange={handlePhotoUpload}
                  className="hidden"
                />
              </label>
            )}
          </div>

          {/* Section 6: Notes */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
            <label className="block text-sm font-bold text-slate-900">
              5. 특이사항 및 관찰 기록
            </label>
            <textarea
              rows={3}
              placeholder="어르신의 일상 상태, 컨디션, 기타 전달사항을 작성하세요."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full text-sm border border-slate-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={submitting || !activeSchedule}
            className="w-full min-h-[56px] bg-indigo-600 hover:bg-indigo-700 text-white text-lg font-bold rounded-2xl shadow-xl transition disabled:opacity-50 flex items-center justify-center space-x-2 cursor-pointer"
          >
            {submitting ? (
              <span>저장 중...</span>
            ) : (
              <>
                <FileCheck className="w-5 h-5" />
                <span>급여제공기록 작성 완료 (Firestore 저장)</span>
              </>
            )}
          </button>
        </form>
      )}
    </div>
  );
}
