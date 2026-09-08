"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Mail, Lock, LogIn, User, Shield, Eye, EyeOff, CheckCircle2, Sparkles } from "@/lib/icons";
import { UserRole, UserProfile } from "@/lib/types/erp";

export default function LoginPage() {
  const router = useRouter();
  const [role, setRole] = useState<UserRole>("admin");
  const [email, setEmail] = useState("admin@silverlink.kr");
  const [password, setPassword] = useState("••••••••");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const handleRoleSelect = (selectedRole: UserRole) => {
    setRole(selectedRole);
    if (selectedRole === "admin") {
      setEmail("admin@silverlink.kr");
      setPassword("123456");
    } else {
      setEmail("caregiver@silverlink.kr");
      setPassword("123456");
    }
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    const userProfile: UserProfile =
      role === "admin"
        ? {
            id: "admin-01",
            name: "최관리 센터장",
            email: email || "admin@silverlink.kr",
            role: "admin",
            centerName: "실버링크 서울 강남 센터",
          }
        : {
            id: "caregiver-01",
            name: "김영희 요양보호사",
            email: email || "caregiver@silverlink.kr",
            role: "caregiver",
            phone: "010-1234-5678",
          };

    setTimeout(() => {
      localStorage.setItem("silverlink_user", JSON.stringify(userProfile));
      window.dispatchEvent(new Event("silverlink_auth_change"));
      setSubmitting(false);

      if (role === "caregiver") {
        router.push("/portal/caregiver/record");
      } else {
        router.push("/portal/admin/schedules");
      }
    }, 600);
  };

  const handleQuickDemoLogin = (targetRole: UserRole) => {
    handleRoleSelect(targetRole);
    setTimeout(() => {
      const demoProfile: UserProfile =
        targetRole === "admin"
          ? {
              id: "admin-01",
              name: "최관리 센터장",
              email: "admin@silverlink.kr",
              role: "admin",
              centerName: "실버링크 서울 강남 센터",
            }
          : {
              id: "caregiver-01",
              name: "김영희 요양보호사",
              email: "caregiver@silverlink.kr",
              role: "caregiver",
              phone: "010-1234-5678",
            };

      localStorage.setItem("silverlink_user", JSON.stringify(demoProfile));
      window.dispatchEvent(new Event("silverlink_auth_change"));

      if (targetRole === "caregiver") {
        router.push("/portal/caregiver/record");
      } else {
        router.push("/portal/admin/schedules");
      }
    }, 300);
  };

  return (
    <div className="min-h-[80vh] flex flex-col justify-center items-center px-4 py-8">
      <div className="w-full max-w-md space-y-6">
        {/* Branding Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-emerald-500 text-white font-black text-2xl shadow-xl shadow-emerald-500/20 mb-1">
            SL
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            실버링크 (Silver Link) ERP
          </h1>
          <p className="text-sm text-slate-500">
            시니어 케어 전문 일정·서류·급여제공기록 통합 시스템
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xl space-y-6">
          {/* Role Selection Tabs */}
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 text-center">
              접속 권한 (역할) 선택
            </label>
            <div className="grid grid-cols-2 gap-2 bg-slate-100 p-1.5 rounded-2xl">
              <button
                type="button"
                onClick={() => handleRoleSelect("admin")}
                className={`py-2.5 px-3 rounded-xl font-bold text-xs sm:text-sm transition flex items-center justify-center space-x-2 cursor-pointer ${
                  role === "admin"
                    ? "bg-slate-900 text-white shadow-md"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <Shield className="w-4 h-4 text-emerald-400" />
                <span>어드민 (관리자)</span>
              </button>
              <button
                type="button"
                onClick={() => handleRoleSelect("caregiver")}
                className={`py-2.5 px-3 rounded-xl font-bold text-xs sm:text-sm transition flex items-center justify-center space-x-2 cursor-pointer ${
                  role === "caregiver"
                    ? "bg-indigo-600 text-white shadow-md"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <User className="w-4 h-4 text-indigo-200" />
                <span>요양보호사</span>
              </button>
            </div>
          </div>

          {/* Login Form */}
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            {/* Email Field */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                아이디 / 이메일
              </label>
              <div className="relative">
                <Mail className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@silverlink.kr"
                  className="w-full pl-11 pr-4 py-3 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                비밀번호
              </label>
              <div className="relative">
                <Lock className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="비밀번호 입력"
                  className="w-full pl-11 pr-11 py-3 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Options */}
            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center space-x-2 cursor-pointer text-slate-600">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                />
                <span>로그인 정보 기억하기</span>
              </label>
              <a href="#" onClick={(e) => { e.preventDefault(); alert("비밀번호 재설정 링크는 기관 관리자에게 문의하세요."); }} className="text-slate-500 hover:text-slate-800">
                비밀번호 찾기
              </a>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={submitting}
              className={`w-full py-3.5 rounded-2xl text-white font-bold text-base shadow-lg transition flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-50 ${
                role === "admin"
                  ? "bg-slate-900 hover:bg-slate-800"
                  : "bg-indigo-600 hover:bg-indigo-700"
              }`}
            >
              {submitting ? (
                <span>인증 처리 중...</span>
              ) : (
                <>
                  <LogIn className="w-5 h-5" />
                  <span>{role === "admin" ? "어드민 로그인" : "요양보호사 로그인"}</span>
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Section */}
          <div className="pt-4 border-t border-slate-100 space-y-2.5">
            <div className="flex items-center space-x-1.5 text-xs font-semibold text-slate-500">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>체험용 빠른 원클릭 데모 로그인:</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleQuickDemoLogin("admin")}
                className="py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl transition flex items-center justify-center space-x-1 cursor-pointer"
              >
                <span>👑 어드민 데모</span>
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemoLogin("caregiver")}
                className="py-2 px-3 bg-indigo-50 hover:bg-indigo-100 text-indigo-800 text-xs font-bold rounded-xl transition flex items-center justify-center space-x-1 cursor-pointer"
              >
                <span>👩‍⚕️ 요양보호사 데모</span>
              </button>
            </div>
          </div>
        </div>

        {/* Security Footer Notice */}
        <p className="text-center text-xs text-slate-400">
          🔒 이 시스템은 장기요양보호 관리 및 개인정보보호 법률을 준수합니다.
        </p>
      </div>
    </div>
  );
}
