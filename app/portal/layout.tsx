"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Calendar, Users, FileCheck, Shield, ChevronRight, Menu, X, Database, LogIn, LogOut, User as UserIcon } from "@/lib/icons";
import { seedInitialErpData } from "@/lib/firebaseErp";
import { UserProfile } from "@/lib/types/erp";

export default function PortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isSeeding, setIsSeeding] = useState(false);
  const [seedMessage, setSeedMessage] = useState<string | null>(null);
  const [user, setUser] = useState<UserProfile | null>(null);

  // Load User Session from localStorage
  const loadUserSession = () => {
    try {
      const stored = localStorage.getItem("silverlink_user");
      if (stored) {
        setUser(JSON.parse(stored));
      } else {
        setUser(null);
      }
    } catch (e) {
      console.error(e);
      setUser(null);
    }
  };

  useEffect(() => {
    loadUserSession();
    const handleAuthChange = () => loadUserSession();
    window.addEventListener("silverlink_auth_change", handleAuthChange);
    return () => {
      window.removeEventListener("silverlink_auth_change", handleAuthChange);
    };
  }, []);

  // Logout Handler
  const handleLogout = () => {
    localStorage.removeItem("silverlink_user");
    setUser(null);
    window.dispatchEvent(new Event("silverlink_auth_change"));
    router.push("/portal/login");
  };

  // Auto-hide public MobileCTA on portal pages
  useEffect(() => {
    const styleEl = document.createElement("style");
    styleEl.innerHTML = `.mobile-cta { display: none !important; } body { padding-bottom: 0 !important; }`;
    document.head.appendChild(styleEl);
    return () => {
      document.head.removeChild(styleEl);
    };
  }, []);

  const handleSeedData = async () => {
    try {
      setIsSeeding(true);
      const res = await seedInitialErpData();
      setSeedMessage(`시드 데이터 로딩 완료 (수급자 ${res.recipientsCount}명, 일정 ${res.schedulesCount}건)`);
      setTimeout(() => setSeedMessage(null), 4000);
      window.location.reload();
    } catch (err) {
      console.error(err);
      setSeedMessage("데이터 생성 중 오류가 발생했습니다.");
      setTimeout(() => setSeedMessage(null), 4000);
    } finally {
      setIsSeeding(false);
    }
  };

  const navItems = [
    {
      label: "일정 배정 캘린더",
      href: "/portal/admin/schedules",
      icon: Calendar,
      role: "어드민",
      color: "text-blue-600",
    },
    {
      label: "수급자 및 공단 서류",
      href: "/portal/admin/recipients",
      icon: Users,
      role: "어드민",
      color: "text-emerald-600",
    },
    {
      label: "모바일 급여제공기록지",
      href: "/portal/caregiver/record",
      icon: FileCheck,
      role: "요양보호사",
      color: "text-indigo-600",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 flex flex-col">
      {/* Top Header Navigation */}
      <header className="bg-slate-900 text-white sticky top-0 z-50 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <Link href="/portal" className="flex items-center space-x-2 group">
                <div className="w-9 h-9 rounded-lg bg-emerald-500 flex items-center justify-center font-bold text-white shadow-lg group-hover:bg-emerald-400 transition">
                  SL
                </div>
                <div>
                  <span className="text-lg font-bold tracking-tight text-white">실버링크 ERP</span>
                  <span className="ml-2 text-xs bg-slate-800 text-emerald-400 px-2 py-0.5 rounded font-mono border border-slate-700">
                    SilverLink v1.4
                  </span>
                </div>
              </Link>
            </div>

            {/* Desktop Navigation Tabs */}
            <nav className="hidden md:flex items-center space-x-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                      isActive
                        ? "bg-slate-800 text-white shadow-inner border border-slate-700"
                        : "text-slate-300 hover:bg-slate-800/60 hover:text-white"
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? item.color : "text-slate-400"}`} />
                    <span>{item.label}</span>
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded font-normal ${
                        item.role === "어드민"
                          ? "bg-blue-950 text-blue-300 border border-blue-800/50"
                          : "bg-indigo-950 text-indigo-300 border border-indigo-800/50"
                      }`}
                    >
                      {item.role}
                    </span>
                  </Link>
                );
              })}
            </nav>

            {/* User Session Status & Actions */}
            <div className="flex items-center space-x-2">
              {/* User Profile Badge */}
              {user ? (
                <div className="hidden sm:flex items-center space-x-2 bg-slate-800 border border-slate-700 px-3 py-1.5 rounded-lg text-xs">
                  <UserIcon className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="font-bold text-slate-200">{user.name}</span>
                  <span className={`px-1.5 py-0.2 text-[10px] rounded font-semibold ${
                    user.role === "admin" ? "bg-blue-900 text-blue-200" : "bg-indigo-900 text-indigo-200"
                  }`}>
                    {user.role === "admin" ? "어드민" : "요양보호사"}
                  </span>
                  <button
                    onClick={handleLogout}
                    className="ml-2 text-slate-400 hover:text-red-400 font-medium border-l border-slate-700 pl-2 transition cursor-pointer"
                    title="로그아웃"
                  >
                    <LogOut className="w-3.5 h-3.5 inline mr-1" />
                    로그아웃
                  </button>
                </div>
              ) : (
                <Link
                  href="/portal/login"
                  className="flex items-center space-x-1 text-xs bg-emerald-600 hover:bg-emerald-500 text-white font-medium px-3 py-1.5 rounded-lg transition shadow"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>로그인</span>
                </Link>
              )}

              {/* Seed Sample Data Button */}
              <button
                onClick={handleSeedData}
                disabled={isSeeding}
                title="초기 테스트 샘플 데이터 생성/복구"
                className="hidden lg:flex items-center space-x-1 text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 px-3 py-1.5 rounded-lg transition disabled:opacity-50 cursor-pointer"
              >
                <Database className="w-3.5 h-3.5 text-emerald-400" />
                <span>{isSeeding ? "생성중..." : "샘플 초기화"}</span>
              </button>

              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 focus:outline-none"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-slate-800 bg-slate-900 px-4 pt-2 pb-4 space-y-2 shadow-2xl">
            {/* Mobile User Info */}
            {user ? (
              <div className="flex items-center justify-between p-3 bg-slate-800 rounded-xl text-xs text-slate-200 mb-2">
                <div className="flex items-center space-x-2">
                  <UserIcon className="w-4 h-4 text-emerald-400" />
                  <div>
                    <div className="font-bold">{user.name}</div>
                    <div className="text-[10px] text-slate-400">{user.email}</div>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="px-2.5 py-1 bg-red-950 text-red-300 border border-red-800/50 rounded font-semibold"
                >
                  로그아웃
                </button>
              </div>
            ) : (
              <Link
                href="/portal/login"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center space-x-2 w-full py-2.5 bg-emerald-600 text-white text-sm font-bold rounded-xl mb-2"
              >
                <LogIn className="w-4 h-4" />
                <span>로그인 페이지로 이동</span>
              </Link>
            )}

            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-base font-medium ${
                    isActive ? "bg-slate-800 text-white font-semibold" : "text-slate-300 hover:bg-slate-800/50"
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <Icon className={`w-5 h-5 ${item.color}`} />
                    <span>{item.label}</span>
                  </div>
                  <span className="text-xs bg-slate-800 text-slate-400 px-2 py-0.5 rounded">
                    {item.role}
                  </span>
                </Link>
              );
            })}
          </div>
        )}
      </header>

      {/* Notification Banner */}
      {seedMessage && (
        <div className="bg-emerald-600 text-white text-xs font-semibold py-2 px-4 text-center animate-fade-in shadow-md">
          {seedMessage}
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-4 text-center text-xs text-slate-500">
        실버링크(Silver Link) 급여제공 ERP 모듈 · Next.js 14 & Firebase Firestore Integrated
      </footer>
    </div>
  );
}
