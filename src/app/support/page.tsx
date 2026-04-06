export const metadata = { title: '후원 안내 | Pilgrim House' }

export default function SupportPage() {
  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-stone-800">후원 안내</h1>
        <p className="text-stone-500 mt-2">선교 사역에 동참해 주셔서 감사합니다.</p>
      </div>

      <div className="space-y-6">
        {/* 후원 목적 */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-6">
          <h2 className="text-lg font-semibold text-amber-800 mb-3">후원금 사용처</h2>
          <ul className="space-y-2 text-stone-700">
            <li className="flex gap-2"><span className="text-amber-600">•</span>바이블 스쿨 운영 (센터 임대, 교재)</li>
            <li className="flex gap-2"><span className="text-amber-600">•</span>아이들 학용품 및 생활용품</li>
            <li className="flex gap-2"><span className="text-amber-600">•</span>에어컨 설치 및 시설 개선</li>
            <li className="flex gap-2"><span className="text-amber-600">•</span>현지 사역자 사례비</li>
            <li className="flex gap-2"><span className="text-amber-600">•</span>선교사 생활비</li>
          </ul>
        </div>

        {/* 후원 계좌 — 실제 정보로 교체 필요 */}
        <div className="bg-white border border-stone-200 rounded-xl p-6">
          <h2 className="text-lg font-semibold text-stone-800 mb-4">후원 계좌</h2>
          <div className="space-y-3">
            <div className="flex justify-between items-center py-3 border-b border-stone-100">
              <span className="text-stone-500">은행</span>
              <span className="font-medium">— (추후 기입)</span>
            </div>
            <div className="flex justify-between items-center py-3 border-b border-stone-100">
              <span className="text-stone-500">계좌번호</span>
              <span className="font-medium">— (추후 기입)</span>
            </div>
            <div className="flex justify-between items-center py-3">
              <span className="text-stone-500">예금주</span>
              <span className="font-medium">김순아</span>
            </div>
          </div>
        </div>

        {/* 연락처 */}
        <div className="bg-white border border-stone-200 rounded-xl p-6">
          <h2 className="text-lg font-semibold text-stone-800 mb-2">문의</h2>
          <p className="text-stone-600 text-sm leading-relaxed">
            후원 및 선교 문의는 아래로 연락주세요.<br />
            소중한 기도와 후원에 감사드립니다.
          </p>
          {/* 연락처 정보 추후 추가 */}
        </div>
      </div>
    </div>
  )
}
