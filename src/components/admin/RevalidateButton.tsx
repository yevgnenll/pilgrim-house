'use client'

import { useTransition, useState } from 'react'
import { revalidateContent } from '@/app/admin/actions'

export default function RevalidateButton() {
  const [isPending, startTransition] = useTransition()
  const [status, setStatus] = useState<'idle' | 'done' | 'error'>('idle')

  function handleClick() {
    setStatus('idle')
    startTransition(async () => {
      try {
        await revalidateContent()
        setStatus('done')
      } catch {
        setStatus('error')
      }
    })
  }

  return (
    <div className="flex items-center gap-3">
      {status === 'done' && <span className="text-xs text-green-600">반영 완료 ✓</span>}
      {status === 'error' && <span className="text-xs text-red-600">오류가 발생했습니다.</span>}
      <button
        onClick={handleClick}
        disabled={isPending}
        className="bg-amber-700 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-amber-800 transition-colors disabled:opacity-50 whitespace-nowrap"
      >
        {isPending ? '반영 중...' : '사이트에 반영하기'}
      </button>
    </div>
  )
}
