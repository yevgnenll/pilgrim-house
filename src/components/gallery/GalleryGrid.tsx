'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import type { GalleryItem } from '@/lib/types'

export default function GalleryGrid({ items }: { items: GalleryItem[] }) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)
  const touchStartX = useRef<number | null>(null)
  const thumbnailStripRef = useRef<HTMLDivElement>(null)
  const thumbnailRefs = useRef<(HTMLButtonElement | null)[]>([])

  const open = (index: number) => setLightboxIndex(index)
  const close = () => setLightboxIndex(null)

  const prev = useCallback(() => {
    setLightboxIndex((i) => (i !== null ? (i - 1 + items.length) % items.length : null))
  }, [items.length])

  const next = useCallback(() => {
    setLightboxIndex((i) => (i !== null ? (i + 1) % items.length : null))
  }, [items.length])

  // 활성 썸네일을 가운데로 스크롤
  useEffect(() => {
    if (lightboxIndex === null) return
    const strip = thumbnailStripRef.current
    const thumb = thumbnailRefs.current[lightboxIndex]
    if (!strip || !thumb) return

    const stripCenter = strip.offsetWidth / 2
    const thumbCenter = thumb.offsetLeft + thumb.offsetWidth / 2
    strip.scrollTo({ left: thumbCenter - stripCenter, behavior: 'smooth' })
  }, [lightboxIndex])

  // 키보드 네비게이션
  useEffect(() => {
    if (lightboxIndex === null) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close()
      if (e.key === 'ArrowLeft') prev()
      if (e.key === 'ArrowRight') next()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [lightboxIndex, prev, next])

  // 스크롤 잠금
  useEffect(() => {
    document.body.style.overflow = lightboxIndex !== null ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [lightboxIndex])

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return
    const diff = touchStartX.current - e.changedTouches[0].clientX
    if (Math.abs(diff) > 50) diff > 0 ? next() : prev()
    touchStartX.current = null
  }

  const current = lightboxIndex !== null ? items[lightboxIndex] : null

  return (
    <>
      {/* 그리드 */}
      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
        {items.map((item, index) => (
          <div
            key={item.id}
            className="bg-white rounded-xl border border-stone-200 overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => open(index)}
          >
            {item.photoUrl ? (
              <img
                src={item.photoUrl}
                alt={item.title}
                className="w-full h-48 object-cover"
                loading="lazy"
                decoding="async"
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

      {/* 라이트박스 */}
      {current && lightboxIndex !== null && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex flex-col"
          onClick={close}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {/* 상단 바 */}
          <div className="flex items-center justify-between px-4 py-3 text-white/70 text-sm flex-shrink-0">
            <span>{lightboxIndex + 1} / {items.length}</span>
            <button onClick={close} className="text-white text-2xl leading-none px-2">✕</button>
          </div>

          {/* 이미지 영역 */}
          <div
            className="flex-1 flex items-center justify-center relative px-12 min-h-0"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={prev}
              className="absolute left-2 text-white text-4xl px-2 py-4 hover:text-amber-400 transition-colors"
            >
              ‹
            </button>

            <img
              src={current.photoUrl}
              alt={current.title}
              className="max-h-full max-w-full object-contain rounded-lg select-none"
            />

            <button
              onClick={next}
              className="absolute right-2 text-white text-4xl px-2 py-4 hover:text-amber-400 transition-colors"
            >
              ›
            </button>
          </div>

          {/* 하단 제목 + 썸네일 */}
          <div
            className="flex-shrink-0 pb-4"
            onClick={(e) => e.stopPropagation()}
          >
            <p className="text-white text-center text-sm px-4 py-2">{current.title}</p>

            {/* 썸네일 스트립 — 활성 항목이 항상 가운데로 스크롤 */}
            <div
              ref={thumbnailStripRef}
              className="flex gap-2 overflow-x-auto px-4 pb-1 scrollbar-hide justify-start md:justify-center"
            >
              {items.map((item, index) => (
                <button
                  key={item.id}
                  ref={(el) => { thumbnailRefs.current[index] = el }}
                  onClick={() => setLightboxIndex(index)}
                  className={`flex-shrink-0 w-14 h-14 rounded-md overflow-hidden border-2 transition-all ${
                    index === lightboxIndex
                      ? 'border-amber-400 opacity-100 scale-110'
                      : 'border-transparent opacity-40 hover:opacity-70'
                  }`}
                >
                  <img
                    src={item.photoUrl}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
