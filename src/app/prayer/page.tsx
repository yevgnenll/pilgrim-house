import { getPrayerRequests } from '@/lib/notion'

export const metadata = { title: '기도제목 | Pilgrim House' }

export default async function PrayerPage() {
  const prayers = await getPrayerRequests()

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-stone-800">기도제목</h1>
        <p className="text-stone-500 mt-2">함께 기도해 주셔서 감사합니다.</p>
      </div>

      <div className="space-y-4">
        {prayers.map((prayer) => (
          <div key={prayer.id} className="bg-white rounded-xl border border-stone-200 p-6">
            <div className="flex items-center gap-2 mb-2">
              <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                prayer.status === '응답됨'
                  ? 'bg-green-100 text-green-700'
                  : 'bg-amber-100 text-amber-700'
              }`}>
                {prayer.status === '응답됨' ? '🙏 응답됨' : '✨ 기도중'}
              </span>
              <span className="text-xs text-stone-400">{prayer.date}</span>
            </div>
            <h2 className="text-lg font-semibold text-stone-800">{prayer.title}</h2>
            <p className="text-stone-600 mt-2 leading-relaxed whitespace-pre-line">{prayer.content}</p>
          </div>
        ))}

        {prayers.length === 0 && (
          <p className="text-stone-400 text-center py-20">아직 등록된 기도제목이 없습니다.</p>
        )}
      </div>
    </div>
  )
}
