"use client";

import { useState, useEffect, useMemo } from "react";
import {
  Users,
  Plus,
  Search,
  AlertCircle,
  CheckCircle,
  Calendar,
  FileText,
  Trash2,
  Edit2,
  RefreshCw,
  X,
  ShieldAlert,
  Percent,
} from "@/lib/icons";
import { Recipient, CareLevel, CoPayRate } from "@/lib/types/erp";
import {
  getRecipients,
  addRecipient,
  updateRecipient,
  deleteRecipient,
  seedInitialErpData,
} from "@/lib/firebaseErp";

const CARE_LEVELS: CareLevel[] = [
  "1등급",
  "2등급",
  "3등급",
  "4등급",
  "5등급",
  "인지지원등급",
];

const COPAY_RATES: { value: CoPayRate; label: string }[] = [
  { value: 15, label: "15% (일반)" },
  { value: 9, label: "9% (감경 40%)" },
  { value: 6, label: "6% (감경 60%)" },
  { value: 0, label: "0% (기초생활수급자)" },
];

export default function RecipientsPage() {
  const [recipients, setRecipients] = useState<Recipient[]>([]);
  const [loading, setLoading] = useState(true);

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState("");
  const [careLevelFilter, setCareLevelFilter] = useState<string>("all");
  const [expirationFilter, setExpirationFilter] = useState<string>("all"); // "all", "imminent", "expired"

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRecipientId, setEditingRecipientId] = useState<string | null>(null);

  // Form State
  const [name, setName] = useState("");
  const [birthDate, setBirthDate] = useState("1945-01-01");
  const [careLevel, setCareLevel] = useState<CareLevel>("1등급");
  const [certNumber, setCertNumber] = useState("");
  const [startDate, setStartDate] = useState("2026-01-01");
  const [endDate, setEndDate] = useState("2026-12-31");
  const [coPayRate, setCoPayRate] = useState<CoPayRate>(15);
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      let list = await getRecipients();
      if (list.length === 0) {
        await seedInitialErpData();
        list = await getRecipients();
      }
      setRecipients(list);
    } catch (err) {
      console.error("Error loading recipients:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Helper: Calculate remaining days & status badge
  const getExpirationStatus = (endDateStr: string) => {
    if (!endDateStr) return { daysLeft: 999, badgeType: "valid", text: "정상" };
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const end = new Date(endDateStr);
    end.setHours(0, 0, 0, 0);

    const diffTime = end.getTime() - today.getTime();
    const daysLeft = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (daysLeft < 0) {
      return {
        daysLeft,
        badgeType: "expired",
        text: `만료됨 (D+${Math.abs(daysLeft)})`,
      };
    } else if (daysLeft <= 30) {
      return {
        daysLeft,
        badgeType: "imminent",
        text: `만료임박 (D-${daysLeft})`,
      };
    } else {
      return {
        daysLeft,
        badgeType: "valid",
        text: `유효 (D-${daysLeft})`,
      };
    }
  };

  // Filtered recipients
  const filteredRecipients = useMemo(() => {
    return recipients.filter((r) => {
      // Search
      const query = searchQuery.trim().toLowerCase();
      if (
        query &&
        !r.name.toLowerCase().includes(query) &&
        !r.certNumber.toLowerCase().includes(query)
      ) {
        return false;
      }

      // Care level filter
      if (careLevelFilter !== "all" && r.careLevel !== careLevelFilter) {
        return false;
      }

      // Expiration filter
      const status = getExpirationStatus(r.endDate);
      if (expirationFilter === "imminent" && status.badgeType !== "imminent") {
        return false;
      }
      if (expirationFilter === "expired" && status.badgeType !== "expired") {
        return false;
      }

      return true;
    });
  }, [recipients, searchQuery, careLevelFilter, expirationFilter]);

  // Open Modal for New Recipient
  const openNewRecipientModal = () => {
    setEditingRecipientId(null);
    setName("");
    setBirthDate("1948-06-15");
    setCareLevel("1등급");
    setCertNumber(`L${Math.floor(1000000000 + Math.random() * 9000000000)}`);
    const today = new Date();
    setStartDate(today.toISOString().split("T")[0]);
    const nextYear = new Date();
    nextYear.setFullYear(today.getFullYear() + 1);
    setEndDate(nextYear.toISOString().split("T")[0]);
    setCoPayRate(15);
    setPhone("010-0000-0000");
    setAddress("");
    setNotes("");
    setIsModalOpen(true);
  };

  // Open Modal for Editing Recipient
  const openEditRecipientModal = (r: Recipient) => {
    setEditingRecipientId(r.id);
    setName(r.name);
    setBirthDate(r.birthDate || "1948-06-15");
    setCareLevel(r.careLevel);
    setCertNumber(r.certNumber);
    setStartDate(r.startDate);
    setEndDate(r.endDate);
    setCoPayRate(r.coPayRate);
    setPhone(r.phone || "");
    setAddress(r.address || "");
    setNotes(r.notes || "");
    setIsModalOpen(true);
  };

  // Save Recipient
  const handleSaveRecipient = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !certNumber || !startDate || !endDate) {
      alert("필수 항목을 모두 입력해 주세요.");
      return;
    }

    setSaving(true);
    try {
      const data = {
        name,
        birthDate,
        careLevel,
        certNumber,
        startDate,
        endDate,
        coPayRate,
        phone,
        address,
        notes,
      };

      if (editingRecipientId) {
        await updateRecipient(editingRecipientId, data);
      } else {
        await addRecipient(data);
      }

      setIsModalOpen(false);
      await loadData();
    } catch (err) {
      console.error("Save recipient error:", err);
      alert("수급자 저장 중 오류가 발생했습니다.");
    } finally {
      setSaving(false);
    }
  };

  // Delete Recipient
  const handleDeleteRecipient = async (id: string, name: string) => {
    if (!confirm(`'${name}' 어르신의 공단 수급자 정보 및 서류를 삭제하시겠습니까?`)) return;
    try {
      await deleteRecipient(id);
      await loadData();
    } catch (err) {
      console.error("Delete recipient error:", err);
      alert("삭제 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Title */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center space-x-2 text-emerald-600 font-semibold text-xs tracking-wider uppercase mb-1">
            <Users className="w-4 h-4" />
            <span>Silver Link 수급자 관리 모듈</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900">
            수급자 및 공단 서류 관리
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            장기요양 인정 등급, 인정번호, 서류 유효기간(D-30 임박 배지) 및 본인부담금 감경율을 총괄 관리합니다.
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
            onClick={openNewRecipientModal}
            className="flex items-center space-x-2 bg-emerald-600 hover:bg-emerald-700 text-white font-medium px-4 py-2.5 rounded-xl shadow-md transition cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>신규 수급자 등록</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="수급자 성명 또는 인정번호 검색"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-slate-50"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {/* Care Level Filter */}
          <select
            value={careLevelFilter}
            onChange={(e) => setCareLevelFilter(e.target.value)}
            className="text-sm bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
          >
            <option value="all">전체 등급</option>
            {CARE_LEVELS.map((level) => (
              <option key={level} value={level}>
                {level}
              </option>
            ))}
          </select>

          {/* Expiration Status Filter */}
          <select
            value={expirationFilter}
            onChange={(e) => setExpirationFilter(e.target.value)}
            className="text-sm bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
          >
            <option value="all">전체 유효기간 상태</option>
            <option value="imminent">⚠️ 만료 임박 (D-30 이내)</option>
            <option value="expired">🔴 만료됨</option>
          </select>
        </div>
      </div>

      {/* Recipient Data Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-slate-500">
            <RefreshCw className="w-8 h-8 animate-spin mx-auto text-emerald-500 mb-3" />
            <p className="font-medium text-sm">수급자 서류 정보를 불러오는 중입니다...</p>
          </div>
        ) : filteredRecipients.length === 0 ? (
          <div className="p-12 text-center text-slate-400">
            <Users className="w-10 h-10 mx-auto text-slate-300 mb-2" />
            <p className="font-semibold text-slate-600">조회된 수급자가 없습니다.</p>
            <p className="text-xs text-slate-400 mt-1">검색 조건 또는 신규 등록을 확인해 주세요.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-900 text-white text-xs font-semibold uppercase tracking-wider">
                  <th className="py-3.5 px-4">성명 / 생년월일</th>
                  <th className="py-3.5 px-4">장기요양 등급</th>
                  <th className="py-3.5 px-4">공단 인정번호</th>
                  <th className="py-3.5 px-4">유효기간 (만료 상태)</th>
                  <th className="py-3.5 px-4">본인부담금 감경율</th>
                  <th className="py-3.5 px-4">비고 / 메모</th>
                  <th className="py-3.5 px-4 text-right">관리</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {filteredRecipients.map((r) => {
                  const status = getExpirationStatus(r.endDate);

                  return (
                    <tr key={r.id} className="hover:bg-slate-50/80 transition">
                      {/* Name & Birth */}
                      <td className="py-4 px-4 font-semibold text-slate-900">
                        <div>{r.name}</div>
                        <div className="text-xs text-slate-400 font-normal">
                          {r.birthDate || "-"}
                        </div>
                      </td>

                      {/* Care Level */}
                      <td className="py-4 px-4">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold bg-slate-100 text-slate-800 border border-slate-200">
                          {r.careLevel}
                        </span>
                      </td>

                      {/* Cert Number */}
                      <td className="py-4 px-4 font-mono font-medium text-slate-700">
                        {r.certNumber}
                      </td>

                      {/* Expiration Date & D-30 Badge */}
                      <td className="py-4 px-4">
                        <div className="flex flex-col space-y-1">
                          <div className="text-xs text-slate-600 font-mono">
                            {r.startDate} ~ {r.endDate}
                          </div>

                          {/* Badge */}
                          {status.badgeType === "expired" && (
                            <span className="inline-flex items-center space-x-1 text-xs font-bold text-red-700 bg-red-100 border border-red-300 px-2.5 py-0.5 rounded-full w-fit animate-pulse">
                              <ShieldAlert className="w-3.5 h-3.5" />
                              <span>{status.text}</span>
                            </span>
                          )}

                          {status.badgeType === "imminent" && (
                            <span className="inline-flex items-center space-x-1 text-xs font-bold text-amber-800 bg-amber-100 border border-amber-300 px-2.5 py-0.5 rounded-full w-fit">
                              <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                              <span>{status.text}</span>
                            </span>
                          )}

                          {status.badgeType === "valid" && (
                            <span className="inline-flex items-center space-x-1 text-xs font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full w-fit">
                              <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                              <span>{status.text}</span>
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Co-pay reduction rate */}
                      <td className="py-4 px-4">
                        <span className="inline-flex items-center space-x-1 text-xs font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 px-2.5 py-1 rounded-lg">
                          <Percent className="w-3 h-3" />
                          <span>
                            {r.coPayRate}% ({r.coPayRate === 15 ? "일반" : r.coPayRate === 0 ? "기초수급" : "감경"})
                          </span>
                        </span>
                      </td>

                      {/* Notes */}
                      <td className="py-4 px-4 text-xs text-slate-500 max-w-xs truncate">
                        {r.notes || "-"}
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-4 text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            onClick={() => openEditRecipientModal(r)}
                            className="p-1.5 hover:bg-slate-200 text-slate-600 rounded-lg transition"
                            title="수정"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteRecipient(r.id, r.name)}
                            className="p-1.5 hover:bg-red-100 text-red-600 rounded-lg transition"
                            title="삭제"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Recipient Modal (Add/Edit) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <h3 className="text-lg font-bold text-slate-900 flex items-center space-x-2">
                <Users className="w-5 h-5 text-emerald-600" />
                <span>{editingRecipientId ? "수급자 공단 서류 수정" : "신규 수급자 등록"}</span>
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveRecipient} className="space-y-4">
              {/* Name & Birth */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    수급자 성명 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="예: 홍길동"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full text-sm border border-slate-200 rounded-xl p-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    생년월일
                  </label>
                  <input
                    type="date"
                    value={birthDate}
                    onChange={(e) => setBirthDate(e.target.value)}
                    className="w-full text-sm border border-slate-200 rounded-xl p-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
                  />
                </div>
              </div>

              {/* Care Level */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  장기요양 등급 <span className="text-red-500">*</span>
                </label>
                <select
                  value={careLevel}
                  onChange={(e) => setCareLevel(e.target.value as CareLevel)}
                  className="w-full text-sm border border-slate-200 rounded-xl p-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
                  required
                >
                  {CARE_LEVELS.map((lvl) => (
                    <option key={lvl} value={lvl}>
                      {lvl}
                    </option>
                  ))}
                </select>
              </div>

              {/* Cert Number */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  장기요양 인정번호 (공단 서류) <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="예: L1234567890"
                  value={certNumber}
                  onChange={(e) => setCertNumber(e.target.value)}
                  className="w-full text-sm border border-slate-200 rounded-xl p-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono font-bold"
                  required
                />
              </div>

              {/* Validity Period */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    유효기간 시작일 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full text-sm border border-slate-200 rounded-xl p-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    유효기간 만료일 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full text-sm border border-slate-200 rounded-xl p-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
                    required
                  />
                </div>
              </div>

              {/* Co-pay reduction rate */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  본인부담금 감경율 <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {COPAY_RATES.map((cp) => (
                    <button
                      type="button"
                      key={cp.value}
                      onClick={() => setCoPayRate(cp.value)}
                      className={`py-2 px-3 text-xs font-semibold rounded-xl border transition text-left ${
                        coPayRate === cp.value
                          ? "bg-emerald-700 text-white border-emerald-700 shadow"
                          : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                      }`}
                    >
                      {cp.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Phone & Address */}
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    보호자 연락처
                  </label>
                  <input
                    type="text"
                    placeholder="010-0000-0000"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full text-sm border border-slate-200 rounded-xl p-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    주소
                  </label>
                  <input
                    type="text"
                    placeholder="서울특별시..."
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full text-sm border border-slate-200 rounded-xl p-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  특이사항 / 메도
                </label>
                <input
                  type="text"
                  placeholder="특이사항 기록"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full text-sm border border-slate-200 rounded-xl p-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500"
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
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium shadow-md transition disabled:opacity-50 flex items-center space-x-1"
                >
                  {saving ? (
                    <span>저장 중...</span>
                  ) : (
                    <span>{editingRecipientId ? "수정 완료" : "수급자 등록"}</span>
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
