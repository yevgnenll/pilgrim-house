'use client'

import { Suspense, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter, useSearchParams } from 'next/navigation'

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const linkError = searchParams.get('error') === 'invalid_link'

  const [mode, setMode] = useState<'login' | 'forgot'>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(linkError ? '유효하지 않거나 만료된 링크입니다.' : '')
  const [loading, setLoading] = useState(false)
  const [sentEmail, setSentEmail] = useState(false)

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const supabase = createClient()
    const { error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      setError('이메일 또는 비밀번호가 올바르지 않습니다.')
      setLoading(false)
      return
    }

    router.push('/admin')
    router.refresh()
  }

  async function handleForgot(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const supabase = createClient()
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${location.origin}/admin/auth/callback`,
    })

    setLoading(false)
    if (error) {
      setError('이메일 전송에 실패했습니다.')
      return
    }
    setSentEmail(true)
  }

  function switchMode(next: 'login' | 'forgot') {
    setMode(next)
    setError('')
    setSentEmail(false)
  }

  return (
    <div className="bg-white rounded-2xl border border-stone-200 p-8 w-full max-w-sm space-y-6">
      <div className="text-center">
        <h1 className="text-xl font-bold text-stone-800">
          {mode === 'login' ? '관리자 로그인' : '비밀번호 찾기'}
        </h1>
        <p className="text-xs text-stone-500 mt-1">B&W Mission Center</p>
      </div>

      {mode === 'login' ? (
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-stone-600 mb-1">이메일</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full border border-stone-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-600"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-stone-600 mb-1">비밀번호</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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
            {loading ? '로그인 중...' : '로그인'}
          </button>

          <button
            type="button"
            onClick={() => switchMode('forgot')}
            className="w-full text-xs text-stone-400 hover:text-amber-700 transition-colors"
          >
            비밀번호를 잊으셨나요?
          </button>
        </form>
      ) : (
        <div className="space-y-4">
          {sentEmail ? (
            <div className="text-center space-y-3 py-2">
              <p className="text-sm font-medium text-stone-700">이메일을 확인해주세요</p>
              <p className="text-xs text-stone-500 leading-relaxed">
                <span className="font-medium text-stone-700">{email}</span>으로<br />
                비밀번호 재설정 링크를 보냈습니다.
              </p>
            </div>
          ) : (
            <form onSubmit={handleForgot} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-stone-600 mb-1">이메일</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
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
                {loading ? '전송 중...' : '재설정 링크 보내기'}
              </button>
            </form>
          )}

          <button
            type="button"
            onClick={() => switchMode('login')}
            className="w-full text-xs text-stone-400 hover:text-amber-700 transition-colors"
          >
            로그인으로 돌아가기
          </button>
        </div>
      )}
    </div>
  )
}

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-stone-50 flex items-center justify-center px-4">
      <Suspense fallback={<div className="w-full max-w-sm h-64 bg-white rounded-2xl border border-stone-200" />}>
        <LoginForm />
      </Suspense>
    </div>
  )
}
