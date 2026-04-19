import { signOut } from './actions'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-stone-50">
      <header className="bg-white border-b border-stone-200">
        <div className="max-w-3xl mx-auto px-4 h-14 flex items-center justify-between">
          <span className="font-bold text-amber-700 text-sm">관리자 · B&W Mission Center</span>
          <form action={signOut}>
            <button type="submit" className="text-xs text-stone-500 hover:text-red-600 transition-colors">
              로그아웃
            </button>
          </form>
        </div>
      </header>
      <main className="max-w-3xl mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  )
}
