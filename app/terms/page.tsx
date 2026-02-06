export default function TermsPage() {
  return (
    <main className="mx-auto max-w-4xl px-6 py-16 text-gray-800">
      <h1 className="mb-8 text-2xl font-bold">이용약관</h1>

      <section className="space-y-6 text-sm leading-relaxed">
        <p>
          본 약관은 이가에프엔비(이하 “회사”)가 제공하는 웹사이트 및 관련
          서비스(이하 “서비스”)의 이용과 관련하여 회사와 이용자 간의 권리, 의무,
          책임사항 및 기타 필요한 사항을 규정합니다.
        </p>

        <h2 className="text-lg font-semibold">제1조 (목적)</h2>
        <p>
          이 약관은 회사가 제공하는 서비스의 이용조건 및 절차, 회사와 이용자의
          권리·의무 및 책임사항을 규정함을 목적으로 합니다.
        </p>

        <h2 className="text-lg font-semibold">제2조 (정의)</h2>
        <ul className="list-disc pl-5">
          <li>“서비스”란 회사가 제공하는 웹사이트 및 이를 통해 제공되는 기능을 의미합니다.</li>
          <li>“이용자”란 본 약관에 따라 회사가 제공하는 서비스를 이용하는 자를 의미합니다.</li>
        </ul>

        <h2 className="text-lg font-semibold">제3조 (약관의 효력 및 변경)</h2>
        <ul className="list-disc pl-5">
          <li>본 약관은 서비스 화면에 게시하거나 기타 방법으로 공지함으로써 효력이 발생합니다.</li>
          <li>
            회사는 관련 법령을 위배하지 않는 범위에서 약관을 변경할 수 있으며, 변경 시 적용일자 및 변경사유를 공지합니다.
          </li>
        </ul>

        <h2 className="text-lg font-semibold">제4조 (서비스 이용)</h2>
        <ul className="list-disc pl-5">
          <li>이용자는 회사가 정한 절차에 따라 서비스를 이용할 수 있습니다.</li>
          <li>회사는 시스템 점검, 장애, 기타 불가피한 사유가 있는 경우 서비스 제공을 일시 중단할 수 있습니다.</li>
        </ul>

        <h2 className="text-lg font-semibold">제5조 (이용자의 의무)</h2>
        <ul className="list-disc pl-5">
          <li>이용자는 관계 법령 및 본 약관, 공지사항을 준수해야 합니다.</li>
          <li>이용자는 서비스 이용과 관련하여 허위 정보 제공, 타인의 권리 침해, 업무 방해 행위를 해서는 안 됩니다.</li>
        </ul>

        <h2 className="text-lg font-semibold">제6조 (면책 및 책임 제한)</h2>
        <ul className="list-disc pl-5">
          <li>회사는 천재지변, 불가항력, 이용자 귀책사유로 인한 서비스 장애에 대해 책임을 지지 않습니다.</li>
          <li>회사는 이용자가 서비스를 통해 얻은 정보로 인한 손해에 대해 법령이 허용하는 범위 내에서 책임을 제한합니다.</li>
        </ul>

        <h2 className="text-lg font-semibold">제7조 (지식재산권)</h2>
        <p>
          서비스에 포함된 콘텐츠(문구, 이미지, 디자인 등)에 대한 권리는 회사 또는
          정당한 권리자에게 있으며, 이용자는 회사의 사전 동의 없이 이를 무단
          복제·배포·전송·가공할 수 없습니다.
        </p>

        <h2 className="text-lg font-semibold">제8조 (준거법 및 관할)</h2>
        <p>
          본 약관은 대한민국 법령에 따라 해석되며, 서비스 이용과 관련하여 분쟁이
          발생할 경우 관할 법원은 관련 법령에 따릅니다.
        </p>

        <p className="pt-6 text-xs text-gray-500">
          본 약관은 시행일로부터 적용됩니다.
        </p>
      </section>
    </main>
  );
}
