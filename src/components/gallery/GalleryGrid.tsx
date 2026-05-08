'use client'

import { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import type { GalleryItem } from '@/lib/types'

const TAG_COLORS = [
  { idle: 'bg-rose-100 text-rose-600 hover:bg-rose-200',     active: 'bg-rose-500 text-white' },
  { idle: 'bg-amber-100 text-amber-600 hover:bg-amber-200',   active: 'bg-amber-500 text-white' },
  { idle: 'bg-emerald-100 text-emerald-600 hover:bg-emerald-200', active: 'bg-emerald-500 text-white' },
  { idle: 'bg-sky-100 text-sky-600 hover:bg-sky-200',         active: 'bg-sky-500 text-white' },
  { idle: 'bg-violet-100 text-violet-600 hover:bg-violet-200', active: 'bg-violet-500 text-white' },
  { idle: 'bg-orange-100 text-orange-600 hover:bg-orange-200', active: 'bg-orange-500 text-white' },
  { idle: 'bg-teal-100 text-teal-600 hover:bg-teal-200',      active: 'bg-teal-500 text-white' },
  { idle: 'bg-pink-100 text-pink-600 hover:bg-pink-200',      active: 'bg-pink-500 text-white' },
]

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export default function GalleryGrid({ items }: { items: GalleryItem[] }) {
  const [selectedTag, setSelectedTag] = useState<string | null>(null)
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)
  const touchStartX = useRef<number | null>(null)
  const thumbnailStripRef = useRef<HTMLDivElement>(null)
  const thumbnailRefs = useRef<(HTMLButtonElement | null)[]>([])

  const uniqueTags = useMemo(
    () => Array.from(new Set(items.flatMap((item) => item.tags))),
    [items]
  )
  const [allTags, setAllTags] = useState<string[]>(uniqueTags)

  useEffect(() => {
    setAllTags(shuffle(uniqueTags))
  }, [uniqueTags])

  const tagColorMap = useMemo(() => {
    const map: Record<string, typeof TAG_COLORS[0]> = {}
    allTags.forEach((tag, i) => { map[tag] = TAG_COLORS[i % TAG_COLORS.length] })
    return map
  }, [allTags])

  const filtered = selectedTag ? items.filter((item) => item.tags.includes(selectedTag)) : items

  const open = (index: number) => setLightboxIndex(index)
  const close = () => setLightboxIndex(null)

  const prev = useCallback(() => {
    setLightboxIndex((i) => (i !== null ? (i - 1 + filtered.length) % filtered.length : null))
  }, [filtered.length])

  const next = useCallback(() => {
    setLightboxIndex((i) => (i !== null ? (i + 1) % filtered.length : null))
  }, [filtered.length])

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

  const current = lightboxIndex !== null ? filtered[lightboxIndex] : null

  return (
    <>
      {/* 태그 필터 */}
      {allTags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-6">
          <button
            onClick={() => { setSelectedTag(null); setLightboxIndex(null) }}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
              selectedTag === null
                ? 'bg-stone-800 text-white'
                : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
            }`}
          >
            전체
          </button>
          {allTags.map((tag) => {
            const color = tagColorMap[tag]
            return (
              <button
                key={tag}
                onClick={() => { setSelectedTag(tag); setLightboxIndex(null) }}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  selectedTag === tag ? color.active : color.idle
                }`}
              >
                {tag}
              </button>
            )
          })}
        </div>
      )}

      {/* 그리드 */}
      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
        {filtered.map((item, index) => (
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
            <span>{lightboxIndex + 1} / {filtered.length}</span>
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
              {filtered.map((item, index) => (
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
