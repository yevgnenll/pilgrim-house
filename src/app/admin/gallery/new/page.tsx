'use client'

import { useTransition, useState } from 'react'
import imageCompression from 'browser-image-compression'
import { submitGalleryItem } from '../../actions'
import SaveDialog from '@/components/admin/SaveDialog'

export default function NewGalleryPage() {
  const [isPending, startTransition] = useTransition()
  const [showDialog, setShowDialog] = useState(false)
  const [error, setError] = useState('')
  const [status, setStatus] = useState('')

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError('')
    const form = e.currentTarget
    const baseFormData = new FormData(form)
    const fileInput = form.elements.namedItem('image') as HTMLInputElement
    const files = Array.from(fileInput.files ?? [])

    if (files.length === 0) {
      setError('이미지를 선택해주세요.')
      return
    }

    const title = baseFormData.get('title') as string
    const description = (baseFormData.get('description') as string) ?? ''
    const tags = (baseFormData.get('tags') as string) ?? ''

    startTransition(async () => {
      let completed = 0
      const failures: string[] = []
      setStatus(`처리 중... (0/${files.length})`)

      const uploadOne = async (file: File) => {
        try {
          const compressed = await imageCompression(file, {
            maxSizeMB: 1,
            maxWidthOrHeight: 1920,
            useWebWorker: true,
            fileType: 'image/webp',
          })
          const webpName = file.name.replace(/\.[^.]+$/, '') + '.webp'

          const fd = new FormData()
          fd.set('title', title)
          fd.set('description', description)
          fd.set('tags', tags)
          fd.set('image', compressed, webpName)

          await submitGalleryItem(fd)
        } catch (err) {
          failures.push(`${file.name}: ${err instanceof Error ? err.message : '실패'}`)
        } finally {
          completed++
          setStatus(`처리 중... (${completed}/${files.length})`)
        }
      }

      const CONCURRENCY = 3
      const queue = [...files]
      const workers = Array.from({ length: Math.min(CONCURRENCY, queue.length) }, async () => {
        while (queue.length > 0) {
          const file = queue.shift()
          if (file) await uploadOne(file)
        }
      })
      await Promise.all(workers)
      setStatus('')

      if (failures.length === 0) {
        setShowDialog(true)
      } else if (failures.length < files.length) {
        setError(`${files.length - failures.length}개 성공, ${failures.length}개 실패:\n${failures.join('\n')}`)
      } else {
        setError(`업로드 실패:\n${failures.join('\n')}`)
      }
    })
  }

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-bold text-stone-800">갤러리 이미지 업로드</h1>

      <form onSubmit={handleSubmit} encType="multipart/form-data" className="bg-white rounded-xl border border-stone-200 p-6 space-y-4">
        <div>
          <label className="block text-xs font-medium text-stone-600 mb-1">제목 *</label>
          <input
            name="title"
            required
            className="w-full border border-stone-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-600"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-stone-600 mb-1">이미지 * (여러 장 선택 가능)</label>
          <input
            name="image"
            type="file"
            accept="image/*"
            multiple
            required
            className="w-full border border-stone-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-600"
          />
          <p className="text-xs text-stone-400 mt-1">선택한 모든 이미지에 동일한 제목·설명·태그가 적용됩니다.</p>
        </div>

        <div>
          <label className="block text-xs font-medium text-stone-600 mb-1">설명</label>
          <textarea
            name="description"
            rows={3}
            className="w-full border border-stone-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-600 resize-none"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-stone-600 mb-1">태그 (쉼표로 구분)</label>
          <input
            name="tags"
            placeholder="예: 예배, 2024, 시한욱빌"
            className="w-full border border-stone-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-600"
          />
        </div>

        {error && <pre className="text-xs text-red-600 whitespace-pre-wrap font-sans">{error}</pre>}

        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={isPending}
            className="bg-amber-700 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-amber-800 transition-colors disabled:opacity-50"
          >
            {isPending ? (status || '업로드 중...') : '저장'}
          </button>
          <a href="/admin" className="text-sm text-stone-500 py-2 hover:text-stone-700">취소</a>
        </div>
      </form>

      {showDialog && <SaveDialog onClose={() => setShowDialog(false)} />}
    </div>
  )
}
