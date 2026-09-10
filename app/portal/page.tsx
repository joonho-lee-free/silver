"use client";

import Link from "next/link";
import { Calendar, Users, FileCheck, ShieldAlert, Clock, ChevronRight, Heart, Printer } from "@/lib/icons";

export default function PortalDashboard() {
  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Welcome Hero */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 rounded-2xl p-6 sm:p-8 text-white shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center space-x-2 bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs px-3 py-1 rounded-full font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>실버링크(Silver Link) 급여 관리 ERP 모듈</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              장기요양기관 업무 통합 포털
            </h1>
            <p className="text-slate-300 text-sm max-w-xl leading-relaxed">
              수급자 등급 서류 관리부터 요양보호사 방문 일정 배정, 모바일 급여제공기록지 작성, 자녀-요양보호사 동시 열람 및 인쇄 전용 월간 일지 달력까지 통합 지원합니다.
            </p>
          </div>

          <div className="flex items-center space-x-3 bg-white/5 border border-white/10 p-4 rounded-xl backdrop-blur-sm">
            <div className="text-right">
              <p className="text-xs text-slate-400">시스템 현황</p>
              <p className="text-sm font-semibold text-emerald-400">Firestore 연동 정상</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Task Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Task 1: Schedule Calendar */}
        <Link
          href="/portal/admin/schedules"
          className="group bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md hover:border-blue-300 transition-all flex flex-col justify-between"
        >
          <div>
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Calendar className="w-6 h-6" />
            </div>
            <div className="flex items-center space-x-2 mb-1">
              <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider">Admin</span>
              <span className="text-slate-300">·</span>
              <span className="text-xs text-slate-500">일정 관리</span>
            </div>
            <h2 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-blue-600 transition">
              일정 배정 캘린더
            </h2>
            <p className="text-slate-600 text-sm leading-relaxed mb-4">
              요양보호사와 수급자 간 방문 일정을 등록하고 주간 캘린더로 확인합니다. 방문 시간 중복 자동 검증 로직이 적용됩니다.
            </p>
          </div>
          <div className="flex items-center text-sm font-semibold text-blue-600 group-hover:translate-x-1 transition-transform">
            <span>캘린더 이동</span>
            <ChevronRight className="w-4 h-4 ml-1" />
          </div>
        </Link>

        {/* Task 2: Recipients */}
        <Link
          href="/portal/admin/recipients"
          className="group bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md hover:border-emerald-300 transition-all flex flex-col justify-between"
        >
          <div>
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Users className="w-6 h-6" />
            </div>
            <div className="flex items-center space-x-2 mb-1">
              <span className="text-xs font-semibold text-emerald-600 uppercase tracking-wider">Admin</span>
              <span className="text-slate-300">·</span>
              <span className="text-xs text-slate-500">수급자 관리</span>
            </div>
            <h2 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-emerald-600 transition">
              수급자 & 공단 서류
            </h2>
            <p className="text-slate-600 text-sm leading-relaxed mb-4">
              장기요양 등급(1~5등급), 인정번호, 유효기간, 본인부담금 감경율(15%, 9%, 6%, 0%)을 관리하고 D-30 만료 배지를 확인합니다.
            </p>
          </div>
          <div className="flex items-center text-sm font-semibold text-emerald-600 group-hover:translate-x-1 transition-transform">
            <span>수급자 목록 이동</span>
            <ChevronRight className="w-4 h-4 ml-1" />
          </div>
        </Link>

        {/* Task 3: Caregiver Mobile Record */}
        <Link
          href="/portal/caregiver/record"
          className="group bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md hover:border-indigo-300 transition-all flex flex-col justify-between"
        >
          <div>
            <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <FileCheck className="w-6 h-6" />
            </div>
            <div className="flex items-center space-x-2 mb-1">
              <span className="text-xs font-semibold text-indigo-600 uppercase tracking-wider">Caregiver</span>
              <span className="text-slate-300">·</span>
              <span className="text-xs text-slate-500">모바일 현장</span>
            </div>
            <h2 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-indigo-600 transition">
              급여제공기록 폼
            </h2>
            <p className="text-slate-600 text-sm leading-relaxed mb-4">
              당일 배정 스케줄 자동 로딩, 공단 표준 큰 버튼 체크 항목(식사, 복약, 신체활동) 입력 및 카메라 사진 첨부 후 저장합니다.
            </p>
          </div>
          <div className="flex items-center text-sm font-semibold text-indigo-600 group-hover:translate-x-1 transition-transform">
            <span>기록 폼 작성하기</span>
            <ChevronRight className="w-4 h-4 ml-1" />
          </div>
        </Link>

        {/* Task 4: Family Monthly Care Calendar */}
        <Link
          href="/portal/family/calendar"
          className="group bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md hover:border-rose-300 transition-all flex flex-col justify-between"
        >
          <div>
            <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Heart className="w-6 h-6" />
            </div>
            <div className="flex items-center space-x-2 mb-1">
              <span className="text-xs font-semibold text-rose-600 uppercase tracking-wider">Family</span>
              <span className="text-slate-300">·</span>
              <span className="text-xs text-slate-500">보호자 뷰어</span>
            </div>
            <h2 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-rose-600 transition">
              자녀 전용 케어 달력
            </h2>
            <p className="text-slate-600 text-sm leading-relaxed mb-4">
              우리 부모님의 월간 케어 일지, 식사·복약 현황 및 담당 요양보호사의 현장 케어 사진을 캘린더로 열람하고 A4 인쇄합니다.
            </p>
          </div>
          <div className="flex items-center text-sm font-semibold text-rose-600 group-hover:translate-x-1 transition-transform">
            <span>보호자 달력 보기</span>
            <ChevronRight className="w-4 h-4 ml-1" />
          </div>
        </Link>

        {/* Task 5: Admin Print Center */}
        <Link
          href="/portal/admin/print-calendar"
          className="group bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md hover:border-purple-300 transition-all flex flex-col justify-between"
        >
          <div>
            <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Printer className="w-6 h-6" />
            </div>
            <div className="flex items-center space-x-2 mb-1">
              <span className="text-xs font-semibold text-purple-600 uppercase tracking-wider">Admin</span>
              <span className="text-slate-300">·</span>
              <span className="text-xs text-slate-500">공단/출력 센터</span>
            </div>
            <h2 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-purple-600 transition">
              월간 일지 인쇄 센터
            </h2>
            <p className="text-slate-600 text-sm leading-relaxed mb-4">
              공단 제출용 및 보관용 어르신별 월간 케어 일지 달력을 A4 가로(Landscape) 규격으로 일괄 인쇄 출력합니다.
            </p>
          </div>
          <div className="flex items-center text-sm font-semibold text-purple-600 group-hover:translate-x-1 transition-transform">
            <span>인쇄 센터 이동</span>
            <ChevronRight className="w-4 h-4 ml-1" />
          </div>
        </Link>
      </div>
    </div>
  );
}
