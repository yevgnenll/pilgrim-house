import Link from 'next/link'
import { getNewsPosts } from '@/lib/notion'

export const metadata = { title: '선교 소식 | Pilgrim House' }

export default async function NewsPage() {
  const posts = await getNewsPosts().catch(() => [])

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-stone-800">선교 소식</h1>
        <p className="text-stone-500 mt-2">현장에서 보내는 편지를 읽어주세요.</p>
      </div>

      <div className="space-y-5">
        {posts.map((post) => (
          <Link
            key={post.id}
            href={`/news/${post.slug}`}
            className="flex gap-5 bg-white rounded-xl border border-stone-200 overflow-hidden hover:shadow-md transition-shadow"
          >
            {post.coverUrl && (
              <img
                src={post.coverUrl}
                alt={post.title}
                className="w-36 h-28 object-cover flex-shrink-0"
                loading="lazy"
                decoding="async"
              />
            )}
            <div className="p-5 flex flex-col justify-center">
              <p className="text-xs text-stone-400 mb-1">{post.date}</p>
              <h2 className="font-semibold text-stone-800 text-lg leading-snug">{post.title}</h2>
              <p className="text-stone-500 text-sm mt-1 line-clamp-2">{post.summary}</p>
            </div>
          </Link>
        ))}

        {posts.length === 0 && (
          <p className="text-stone-400 text-center py-20">아직 등록된 소식이 없습니다.</p>
        )}
      </div>
    </div>
  )
}
