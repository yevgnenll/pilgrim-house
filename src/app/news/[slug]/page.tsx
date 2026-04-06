import { notFound } from 'next/navigation'
import { getAllNewsSlugs, getNewsPostBySlug } from '@/lib/notion'
import type { NotionBlock } from '@/lib/types'

// 빌드 시 모든 slug에 대해 정적 페이지 생성
export async function generateStaticParams() {
  const slugs = await getAllNewsSlugs()
  return slugs.map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const post = await getNewsPostBySlug(params.slug)
  if (!post) return {}
  return {
    title: `${post.title} | Pilgrim House`,
    description: post.summary,
  }
}

/** Notion 블록 → JSX 렌더링 */
function renderBlock(block: NotionBlock) {
  switch (block.type) {
    case 'heading_1':
      return <h2 key={block.id} className="text-2xl font-bold text-stone-800 mt-8 mb-3">{block.content}</h2>
    case 'heading_2':
      return <h3 key={block.id} className="text-xl font-semibold text-stone-800 mt-6 mb-2">{block.content}</h3>
    case 'heading_3':
      return <h4 key={block.id} className="text-lg font-semibold text-stone-700 mt-4 mb-2">{block.content}</h4>
    case 'bulleted_list_item':
      return <li key={block.id} className="ml-5 list-disc text-stone-700">{block.content}</li>
    case 'numbered_list_item':
      return <li key={block.id} className="ml-5 list-decimal text-stone-700">{block.content}</li>
    case 'quote':
      return (
        <blockquote key={block.id} className="border-l-4 border-amber-400 pl-4 italic text-stone-600 my-4">
          {block.content}
        </blockquote>
      )
    case 'image':
      return (
        <figure key={block.id} className="my-6">
          <img src={block.imageUrl} alt={block.content} className="rounded-xl w-full object-cover" />
          {block.content && (
            <figcaption className="text-center text-sm text-stone-400 mt-2">{block.content}</figcaption>
          )}
        </figure>
      )
    default:
      return block.content ? (
        <p key={block.id} className="text-stone-700 leading-relaxed">{block.content}</p>
      ) : (
        <div key={block.id} className="h-3" />
      )
  }
}

export default async function NewsDetailPage({ params }: { params: { slug: string } }) {
  const post = await getNewsPostBySlug(params.slug)
  if (!post) notFound()

  return (
    <article className="max-w-2xl mx-auto">
      {/* 커버 이미지 */}
      {post.coverUrl && (
        <img
          src={post.coverUrl}
          alt={post.title}
          className="w-full h-64 object-cover rounded-2xl mb-8"
        />
      )}

      {/* 헤더 */}
      <header className="mb-8">
        <p className="text-sm text-amber-700 mb-2">{post.date}</p>
        <h1 className="text-3xl font-bold text-stone-800 leading-tight">{post.title}</h1>
        {post.summary && (
          <p className="text-stone-500 mt-3 text-lg leading-relaxed">{post.summary}</p>
        )}
      </header>

      {/* 본문 */}
      <div className="space-y-3">
        {post.blocks.map(renderBlock)}
      </div>
    </article>
  )
}
