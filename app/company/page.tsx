export default function CompanyPage() {
  return (
    <main className="mx-auto max-w-5xl px-6 py-16 text-gray-800">
      {/* 제목 */}
      <header className="mb-12">
        <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">
          회사소개
        </h1>
        <p className="mt-4 text-sm text-gray-600">
          안정적인 식자재 공급, 현장에서 검증된 파트너
        </p>
      </header>

      {/* 회사 개요 */}
      <section className="mb-14 space-y-4 text-sm leading-relaxed">
        <h2 className="text-xl font-bold text-gray-900">이가에프엔비</h2>
        <p>
          이가에프엔비는 닭꼬치 및 육가공 제품을 중심으로 한
          <b> B2B 식자재 전문 공급 업체</b>입니다.
        </p>
        <p>
          단순 유통이 아닌 <b>직접 생산 · 직접 납품</b> 구조를 통해
          품질과 단가, 납기 안정성을 동시에 확보하고 있으며,
          현장에서 실제로 필요한 제품만을 공급하는 것을 원칙으로 합니다.
        </p>
      </section>

      {/* ✅ 신뢰 이미지 섹션 */}
      <section className="mb-16">
        <h2 className="mb-6 text-xl font-bold text-gray-900">
          생산 · 인증 · 물류 현장
        </h2>

        <div className="grid gap-6 md:grid-cols-2">
          {[
            {
              src: "/images/company/why-01.jpg",
              label: "HACCP 인증",
            },
            {
              src: "/images/company/why-02.jpg",
              label: "직접 운영 공장",
            },
            {
              src: "/images/company/why-03.jpg",
              label: "현장 생산 공정",
            },
            {
              src: "/images/company/why-04.jpg",
              label: "냉동 탑차 배송",
            },
          ].map((img) => (
            <div
              key={img.src}
              className="relative overflow-hidden rounded-2xl border border-gray-200"
            >
              <div className="relative w-full" style={{ aspectRatio: "4 / 3" }}>
                <img
                  src={img.src}
                  alt={img.label}
                  loading="lazy"
                  className="absolute inset-0 h-full w-full object-cover"
                />
                <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-3 right-3 rounded-md bg-black/40 px-3 py-1 text-xs font-bold text-white backdrop-blur-sm">
                  {img.label}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 핵심 가치 */}
      <section className="mb-14">
        <h2 className="mb-6 text-xl font-bold text-gray-900">핵심 가치</h2>
        <ul className="grid gap-6 md:grid-cols-3 text-sm">
          <li className="rounded-2xl border border-gray-200 p-6">
            <div className="mb-2 text-base font-bold">현장 중심</div>
            <p className="text-gray-600">
              실제 매장 운영 경험을 바탕으로
              불필요한 구성은 줄이고 필요한 것만 제공합니다.
            </p>
          </li>
          <li className="rounded-2xl border border-gray-200 p-6">
            <div className="mb-2 text-base font-bold">직접 생산</div>
            <p className="text-gray-600">
              HACCP 기준에 맞춘 생산 환경에서
              안정적인 품질 관리가 이루어집니다.
            </p>
          </li>
          <li className="rounded-2xl border border-gray-200 p-6">
            <div className="mb-2 text-base font-bold">장기 파트너십</div>
            <p className="text-gray-600">
              단기 거래가 아닌
              함께 성장하는 거래 관계를 지향합니다.
            </p>
          </li>
        </ul>
      </section>

      {/* 사업 영역 */}
      <section className="mb-14 space-y-4 text-sm">
        <h2 className="text-xl font-bold text-gray-900">사업 영역</h2>
        <ul className="list-disc space-y-2 pl-5 text-gray-700">
          <li>닭꼬치 · 순살꼬치 · 염통 · 닭껍질 등 꼬치류 제품</li>
          <li>포장마차 · 호프 · 이자카야 · 푸드트럭 납품</li>
          <li>행사 · 야시장 · 단기 대량 납품</li>
          <li>브랜드화 · 프랜차이즈 확장 컨설팅</li>
        </ul>
      </section>

      {/* 회사 정보 요약 */}
      <section className="rounded-2xl border border-gray-200 bg-gray-50 p-6 text-sm">
        <h2 className="mb-4 text-base font-bold text-gray-900">회사 정보</h2>
        <div className="grid gap-2 md:grid-cols-2 text-gray-700">
          <div><b>상호명</b> : 이가에프엔비</div>
          <div><b>대표</b> : 이준호</div>
          <div><b>주소</b> : 부산광역시 강서구 낙동북로 31번길 19</div>
          <div><b>사업자등록번호</b> : 408-30-91599</div>
          <div><b>통신판매업신고</b> : 2022-부산남구-0330</div>
          <div><b>문의</b> : 전화 / 문자 상담</div>
        </div>
      </section>
    </main>
  );
}
