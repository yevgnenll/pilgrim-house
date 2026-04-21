'use client'

import { useState } from 'react'

const members = [
  { name: '조현영', title: '권사' },
  { name: '박유양', title: '장로' },
  { name: '한주연', title: '권사' },
  { name: '강연석', title: '전도사' },
]

function shuffle<T>(arr: T[]): T[] {
  const result = [...arr]
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[result[i], result[j]] = [result[j], result[i]]
  }
  return result
}

export default function PeopleList() {
  const [shuffled] = useState(() => shuffle(members))

  return (
    <section>
      <h1 className="text-3xl font-bold text-stone-800 mb-4 text-center">이사진</h1>
      <div className="grid gap-4 sm:grid-cols-2">
      {shuffled.map(({ name, title }) => (
        <div
          key={name}
          className="bg-white rounded-xl border border-stone-200 p-6 flex flex-col items-center gap-2"
        >
          <span className="text-lg font-bold text-stone-800">{name}</span>
          <span className="text-sm text-amber-700 font-medium">{title}</span>
        </div>
      ))}
      </div>
    </section>
  )
}
