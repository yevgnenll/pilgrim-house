'use client'

import { useTransition, useState } from 'react'
import { submitNewsPost } from '../../actions'
import SaveDialog from '@/components/admin/SaveDialog'

export default function NewNewsPage() {
  const [isPending, startTransition] = useTransition()
  const [showDialog, setShowDialog] = useState(false)
  const [error, setError] = useState('')

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError('')
    const formData = new FormData(e.currentTarget)
    startTransition(async () => {
      try {
        await submitNewsPost(formData)
        setShowDialog(true)
      } catch (err) {
        setError(err instanceof Error ? err.message : '저장 중 오류가 발생했습니다.')
      }
    })
  }

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-bold text-stone-800">선교소식 작성</h1>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-stone-200 p-6 space-y-4">
        <div>
          <label className="block text-xs font-medium text-stone-600 mb-1">제목 *</label>
          <input
            name="title"
            required
            className="w-full border border-stone-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-600"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-stone-600 mb-1">슬러그 (URL용) *</label>
          <input
            name="slug"
            required
            placeholder="예: 2024-01-mission-report"
            className="w-full border border-stone-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-600"
          />
          <p className="text-xs text-stone-400 mt-1">영문 소문자, 숫자, 하이픈만 사용</p>
        </div>

        <div>
          <label className="block text-xs font-medium text-stone-600 mb-1">요약 *</label>
          <textarea
            name="summary"
            required
            rows={2}
            className="w-full border border-stone-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-600 resize-none"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-stone-600 mb-1">커버 이미지 URL</label>
          <input
            name="coverUrl"
            type="url"
            placeholder="https://..."
            className="w-full border border-stone-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-600"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-stone-600 mb-1">본문</label>
          <textarea
            name="body"
            rows={10}
            placeholder="단락은 빈 줄로 구분합니다."
            className="w-full border border-stone-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-600 resize-none"
          />
        </div>

        {error && <p className="text-xs text-red-600">{error}</p>}

        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={isPending}
            className="bg-amber-700 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-amber-800 transition-colors disabled:opacity-50"
          >
            {isPending ? '저장 중...' : '저장'}
          </button>
          <a href="/admin" className="text-sm text-stone-500 py-2 hover:text-stone-700">취소</a>
        </div>
      </form>

      {showDialog && <SaveDialog onClose={() => setShowDialog(false)} />}
    </div>
  )
}
