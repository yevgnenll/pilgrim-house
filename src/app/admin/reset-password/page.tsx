'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export default function ResetPasswordPage() {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    if (password !== confirm) {
      setError('비밀번호가 일치하지 않습니다.')
      return
    }
    if (password.length < 8) {
      setError('비밀번호는 8자 이상이어야 합니다.')
      return
    }

    setLoading(true)
    const supabase = createClient()
    const { error } = await supabase.auth.updateUser({ password })

    if (error) {
      setError('비밀번호 변경에 실패했습니다. 링크가 만료되었을 수 있습니다.')
      setLoading(false)
      return
    }

    setDone(true)
    setTimeout(() => router.push('/admin/login'), 2000)
  }

  return (
    <div className="min-h-screen bg-stone-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl border border-stone-200 p-8 w-full max-w-sm space-y-6">
        <div className="text-center">
          <h1 className="text-xl font-bold text-stone-800">새 비밀번호 설정</h1>
          <p className="text-xs text-stone-500 mt-1">B&W Mission Center</p>
        </div>

        {done ? (
          <div className="text-center space-y-2 py-4">
            <p className="text-sm font-medium text-green-700">비밀번호가 변경되었습니다.</p>
            <p className="text-xs text-stone-400">로그인 페이지로 이동합니다...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-stone-600 mb-1">새 비밀번호</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={8}
                className="w-full border border-stone-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-600"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-stone-600 mb-1">비밀번호 확인</label>
              <input
                type="password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                required
                className="w-full border border-stone-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-600"
              />
            </div>

            {error && <p className="text-xs text-red-600">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-amber-700 text-white rounded-lg py-2 text-sm font-medium hover:bg-amber-800 transition-colors disabled:opacity-50"
            >
              {loading ? '변경 중...' : '비밀번호 변경'}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
