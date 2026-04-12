import { getGalleryItems } from '@/lib/notion'
import GalleryGrid from '@/components/gallery/GalleryGrid'

export const metadata = { title: '사진 | Pilgrim House' }

export default async function GalleryPage() {
  const items = await getGalleryItems().catch(() => [])

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-stone-800">사진</h1>
        <p className="text-stone-500 mt-2">캄보디아 현장의 모습을 나눕니다.</p>
      </div>

      {items.length === 0 ? (
        <p className="text-stone-400 text-center py-20">아직 등록된 사진이 없습니다.</p>
      ) : (
        <GalleryGrid items={items} />
      )}
    </div>
  )
}
