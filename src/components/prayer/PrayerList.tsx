'use client'

import { useState } from 'react'
import type { PrayerRequest } from '@/lib/types'

const TABS = [
  { key: '', label: '전체' },
  { key: '김순아 선교사', label: '김순아 선교사' },
  { key: '한주연 이사', label: '한주연 이사' },
] as const

function PrayerCard({ prayer }: { prayer: PrayerRequest }) {
  return (
    <div className="bg-white rounded-xl border border-stone-200 p-6">
      <div className="flex items-center gap-2 mb-2">
        <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
          prayer.status === '응답됨'
            ? 'bg-green-100 text-green-700'
            : 'bg-amber-100 text-amber-700'
        }`}>
          {prayer.status === '응답됨' ? '🙏 응답됨' : '✨ 기도중'}
        </span>
        {prayer.category && (
          <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
            prayer.category === '김순아 선교사'
              ? 'bg-blue-100 text-blue-700'
              : 'bg-green-100 text-green-700'
          }`}>
            {prayer.category}
          </span>
        )}
        <span className="text-xs text-stone-400">{prayer.date}</span>
      </div>
      <h2 className="text-lg font-semibold text-stone-800">{prayer.title}</h2>
      <p className="text-stone-600 mt-2 leading-relaxed whitespace-pre-line">{prayer.content}</p>
    </div>
  )
}

export default function PrayerList({ prayers }: { prayers: PrayerRequest[] }) {
  const [activeTab, setActiveTab] = useState<'' | '선교사' | '이사'>('')

  const filtered = activeTab === ''
    ? prayers
    : prayers.filter((p) => p.category === activeTab)

  return (
    <>
      {/* 탭 */}
      <div className="flex gap-2 mb-6">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
              activeTab === tab.key
                ? 'bg-amber-700 text-white'
                : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
            }`}
          >
            {tab.label}
            <span className="ml-1.5 text-xs opacity-70">
              {tab.key === '' ? prayers.length : prayers.filter((p) => p.category === tab.key).length}
            </span>
          </button>
        ))}
      </div>

      {/* 목록 */}
      <div className="space-y-4">
        {filtered.map((prayer) => (
          <PrayerCard key={prayer.id} prayer={prayer} />
        ))}
        {filtered.length === 0 && (
          <p className="text-stone-400 text-center py-20">
            {activeTab ? `${activeTab}님의 기도제목이 없습니다.` : '아직 등록된 기도제목이 없습니다.'}
          </p>
        )}
      </div>
    </>
  )
}
