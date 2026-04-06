import { getGalleryItems } from '@/lib/notion'

export const metadata = { title: '사진 | Pilgrim House' }

export default async function GalleryPage() {
  const items = await getGalleryItems()

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-stone-800">사진</h1>
        <p className="text-stone-500 mt-2">캄보디아 현장의 모습을 나눕니다.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
        {items.map((item) => (
          <div key={item.id} className="bg-white rounded-xl border border-stone-200 overflow-hidden hover:shadow-md transition-shadow">
            {item.photoUrl ? (
              <img
                src={item.photoUrl}
                alt={item.title}
                className="w-full h-48 object-cover"
              />
            ) : (
              <div className="w-full h-48 bg-stone-100 flex items-center justify-center text-stone-400 text-sm">
                사진 없음
              </div>
            )}
            <div className="p-4">
              <div className="flex flex-wrap gap-1 mb-2">
                {item.tags.map((tag) => (
                  <span key={tag} className="text-xs bg-stone-100 text-stone-500 px-2 py-0.5 rounded-full">
                    {tag}
                  </span>
                ))}
              </div>
              <p className="font-medium text-stone-800">{item.title}</p>
              {item.description && (
                <p className="text-sm text-stone-500 mt-1 line-clamp-2">{item.description}</p>
              )}
              <p className="text-xs text-stone-400 mt-2">{item.date}</p>
            </div>
          </div>
        ))}
      </div>

      {items.length === 0 && (
        <p className="text-stone-400 text-center py-20">아직 등록된 사진이 없습니다.</p>
      )}
    </div>
  )
}
