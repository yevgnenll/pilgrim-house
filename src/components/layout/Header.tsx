'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const navItems = [
  { href: '/', label: '홈' },
  { href: '/prayer', label: '기도제목' },
  { href: '/gallery', label: '사진' },
  { href: '/news', label: '선교 소식' },
  { href: '/support', label: '후원 안내' },
]

export default function Header() {
  const pathname = usePathname()

  return (
    <header className="bg-white border-b border-stone-200 sticky top-0 z-10">
      <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* 로고 */}
        <Link href="/" className="flex flex-col leading-tight">
          <span className="font-bold text-amber-700 text-lg">Pilgrim House</span>
          <span className="text-xs text-stone-500">Bible School · Sihanoukville</span>
        </Link>

        {/* 네비게이션 */}
        <nav className="hidden md:flex gap-6">
          {navItems.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={`text-sm font-medium transition-colors ${
                pathname === href
                  ? 'text-amber-700'
                  : 'text-stone-600 hover:text-amber-700'
              }`}
            >
              {label}
            </Link>
          ))}
        </nav>

        {/* 모바일 메뉴 — 추후 구현 */}
        <button className="md:hidden text-stone-600 text-sm">메뉴</button>
      </div>
    </header>
  )
}
