"use client";

declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
  }
}

export default function MobileCTA() {
  const trackEvent = (eventName: string) => {
    if (typeof window !== "undefined" && window.gtag) {
      window.gtag("event", eventName, {
        event_category: "lead",
        event_label: "mobile_cta",
      });
    }
  };

  return (
    <div className="mobile-cta">
      {/* ✅ 전화는 중간 페이지(/call)로 보내서 이벤트를 확실히 찍고 tel로 이동 */}
      <a
        href="/call"
        className="cta-btn call"
        onClick={() => trackEvent("call_click")}
      >
        📞 전화
      </a>

      {/* ✅ 문자는 페이지 이탈이 없어서 기존 방식 그대로 + 이벤트만 추가 */}
      <a
        href="/#sms-lead"
        className="cta-btn sms"
        onClick={() => trackEvent("sms_click")}
      >
        ✉️ 문자요청
      </a>
    </div>
  );
}
