import Link from 'next/link'
import { getPrayerRequests } from '@/lib/notion'
import { getNewsPosts } from '@/lib/notion'

export default async function HomePage() {
  // 최근 기도제목 2개, 최근 소식 3개 미리보기
  const [prayers, newsPosts] = await Promise.all([
    getPrayerRequests().catch(() => []),
    getNewsPosts().catch(() => []),
  ])

  const recentPrayers = prayers.slice(0, 2)
  const recentNews = newsPosts.slice(0, 3)

  return (
    <div className="space-y-16">
      {/* 히어로 */}
      <section className="text-center space-y-4 py-10">
        <p className="text-amber-700 font-medium tracking-widest text-sm uppercase">Pilgrim House · Sihanoukville, Cambodia</p>
        <h1 className="text-4xl font-bold text-stone-800">B&W Mission Center</h1>
        <p className="text-stone-600 max-w-md mx-auto leading-relaxed">
          캄보디아 시한욱빌에서 하나님의 말씀을 가르치고,<br />
          생명의 복음을 전하는 사역에 함께해 주세요.
        </p>
        <div className="flex gap-3 justify-center pt-2 flex-wrap">
          <Link href="/prayer" className="bg-amber-700 text-white px-5 py-2 rounded-full text-sm hover:bg-amber-800 transition-colors">
            기도제목 보기
          </Link>
          <Link href="/gallery" className="bg-stone-700 text-white px-5 py-2 rounded-full text-sm hover:bg-stone-800 transition-colors">
            사진 보기
          </Link>
          <Link href="/support" className="border border-stone-300 text-stone-700 px-5 py-2 rounded-full text-sm hover:border-amber-700 hover:text-amber-700 transition-colors">
            후원 안내
          </Link>
        </div>
      </section>

      {/* 최근 기도제목 */}
      <section>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">최근 기도제목</h2>
          <Link href="/prayer" className="text-sm text-amber-700 hover:underline">전체 보기 →</Link>
        </div>
        <div className="space-y-3">
          {recentPrayers.map((prayer) => (
            <div key={prayer.id} className="bg-white rounded-xl border border-stone-200 p-5">
              <div className="flex items-center gap-2 mb-1">
                <span className={`text-xs px-2 py-0.5 rounded-full ${
                  prayer.status === '응답됨'
                    ? 'bg-green-100 text-green-700'
                    : 'bg-amber-100 text-amber-700'
                }`}>
                  {prayer.status}
                </span>
                <span className="text-xs text-stone-400">{prayer.date}</span>
              </div>
              <p className="font-medium text-stone-800">{prayer.title}</p>
              <p className="text-sm text-stone-500 mt-1 line-clamp-2">{prayer.content}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 최근 선교 소식 */}
      <section>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">선교 소식</h2>
          <Link href="/news" className="text-sm text-amber-700 hover:underline">전체 보기 →</Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          {recentNews.map((post) => (
            <Link key={post.id} href={`/news/${post.slug}`} className="bg-white rounded-xl border border-stone-200 overflow-hidden hover:shadow-md transition-shadow">
              {post.coverUrl && (
                <img src={post.coverUrl} alt={post.title} className="w-full h-36 object-cover" />
              )}
              <div className="p-4">
                <p className="text-xs text-stone-400 mb-1">{post.date}</p>
                <p className="font-medium text-stone-800 line-clamp-2">{post.title}</p>
                <p className="text-sm text-stone-500 mt-1 line-clamp-2">{post.summary}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}
