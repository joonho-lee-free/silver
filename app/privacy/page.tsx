export default function PrivacyPage() {
  return (
    <main className="mx-auto max-w-4xl px-6 py-16 text-gray-800">
      <h1 className="mb-8 text-2xl font-bold">개인정보처리방침</h1>

      <section className="space-y-6 text-sm leading-relaxed">
        <p>
          이가에프엔비(이하 “회사”)는 「개인정보 보호법」을 준수하며,
          고객의 개인정보를 중요하게 생각하고 보호하기 위해
          다음과 같은 개인정보처리방침을 수립·공개합니다.
        </p>

        <h2 className="text-lg font-semibold">1. 개인정보의 수집 항목 및 방법</h2>
        <p>
          회사는 상담, 문의 접수, 거래 진행을 위해 아래와 같은 개인정보를 수집합니다.
        </p>
        <ul className="list-disc pl-5">
          <li>수집 항목: 상호명, 담당자명, 연락처, 지역, 문의 내용</li>
          <li>수집 방법: 홈페이지 문의 폼, 문자(SMS) 접수</li>
        </ul>

        <h2 className="text-lg font-semibold">2. 개인정보의 이용 목적</h2>
        <ul className="list-disc pl-5">
          <li>제품 및 서비스 상담</li>
          <li>거래 관련 연락 및 안내</li>
          <li>고객 문의 응대 및 관리</li>
        </ul>

        <h2 className="text-lg font-semibold">3. 개인정보의 보유 및 이용 기간</h2>
        <p>
          개인정보는 수집·이용 목적이 달성된 후에는 지체 없이 파기합니다.
          단, 관련 법령에 따라 보관이 필요한 경우 해당 기간 동안 보관됩니다.
        </p>

        <h2 className="text-lg font-semibold">4. 개인정보의 제3자 제공</h2>
        <p>
          회사는 원칙적으로 고객의 개인정보를 외부에 제공하지 않습니다.
        </p>

        <h2 className="text-lg font-semibold">5. 개인정보 보호를 위한 조치</h2>
        <ul className="list-disc pl-5">
          <li>접근 권한 최소화</li>
          <li>관리자 접근 통제</li>
          <li>보안 시스템 운영</li>
        </ul>

        <h2 className="text-lg font-semibold">6. 개인정보 보호책임자</h2>
        <p>
          개인정보 보호책임자: 이가에프엔비<br />
          문의: 홈페이지 문의 또는 고객센터
        </p>

        <p className="pt-6 text-xs text-gray-500">
          본 방침은 시행일로부터 적용됩니다.
        </p>
      </section>
    </main>
  );
}
