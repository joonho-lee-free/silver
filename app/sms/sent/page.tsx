"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
    fbq?: (...args: any[]) => void;
  }
}

export default function SmsSentPage() {
  const router = useRouter();

  useEffect(() => {
    // 중복 방지 (같은 세션에서 1번만)
    const key = "sms_lead_tracked_once";
    const already = typeof window !== "undefined" && sessionStorage.getItem(key);

    if (!already) {
      // 1) GA4 - 문자 “성공” 전환
      if (window.gtag) {
        window.gtag("event", "sms_submit_success", {
          event_category: "lead",
          event_label: "sms_sent",
        });
      }

      // 2) Meta Pixel - 문자 “성공” 전환 (표준 이벤트 Lead)
      if (window.fbq) {
        window.fbq("track", "Lead", { method: "sms" });
      }

      sessionStorage.setItem(key, "1");
    }

    // 홈의 sms-lead 섹션으로 복귀 (UI 메시지 유지용 sent=1 포함)
    const t = setTimeout(() => {
      router.replace("/?sent=1#sms-lead");
    }, 200);

    return () => clearTimeout(t);
  }, [router]);

  return (
    <main style={{ maxWidth: 520, margin: "0 auto", padding: "24px" }}>
      <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: 8 }}>
        문자 문의 접수 완료
      </h1>
      <p style={{ lineHeight: 1.6 }}>
        문의가 정상 접수되었습니다. 잠시 후 홈 화면으로 이동합니다…
      </p>
    </main>
  );
}
