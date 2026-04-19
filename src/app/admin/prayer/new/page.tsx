import { submitPrayerRequest } from '../../actions'

const CATEGORIES = [
  '',
  '김순아 선교사',
  '한주연 이사(단기선교 2026-04-20 ~ 2026-05-18)',
]

export default function NewPrayerPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-xl font-bold text-stone-800">기도제목 작성</h1>

      <form action={submitPrayerRequest} className="bg-white rounded-xl border border-stone-200 p-6 space-y-4">
        <div>
          <label className="block text-xs font-medium text-stone-600 mb-1">제목 *</label>
          <input
            name="title"
            required
            className="w-full border border-stone-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-600"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-stone-600 mb-1">내용 *</label>
          <textarea
            name="content"
            required
            rows={5}
            className="w-full border border-stone-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-600 resize-none"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-stone-600 mb-1">상태</label>
            <select
              name="status"
              className="w-full border border-stone-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-600"
            >
              <option value="기도중">기도중</option>
              <option value="응답됨">응답됨</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-stone-600 mb-1">카테고리</label>
            <select
              name="category"
              className="w-full border border-stone-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-600"
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>{c || '(없음)'}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            className="bg-amber-700 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-amber-800 transition-colors"
          >
            Notion에 저장
          </button>
          <a href="/admin" className="text-sm text-stone-500 py-2 hover:text-stone-700">취소</a>
        </div>
      </form>
    </div>
  )
}
