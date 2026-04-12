'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'

const navItems = [
  { href: '/', label: '홈' },
  { href: '/prayer', label: '기도제목' },
  { href: '/gallery', label: '사진' },
  { href: '/news', label: '선교 소식' },
  { href: '/support', label: '후원 안내' },
]

export default function Header() {
  const pathname = usePathname()
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header className="bg-white border-b border-stone-200 sticky top-0 z-10">
      <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* 로고 */}
        <Link href="/" className="flex flex-col leading-tight" onClick={() => setMenuOpen(false)}>
          <span className="font-bold text-amber-700 text-lg">B&W Mission Center</span>
          <span className="text-xs text-stone-500">Pilgrim House · Sihanoukville</span>
        </Link>

        {/* 데스크탑 네비게이션 */}
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

        {/* 모바일 메뉴 버튼 */}
        <button
          className="md:hidden text-stone-600 text-sm font-medium"
          onClick={() => setMenuOpen((prev) => !prev)}
        >
          {menuOpen ? '닫기' : '메뉴'}
        </button>
      </div>

      {/* 모바일 드롭다운 */}
      {menuOpen && (
        <nav className="md:hidden bg-white border-t border-stone-100">
          {navItems.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setMenuOpen(false)}
              className={`block px-6 py-3 text-sm font-medium border-b border-stone-50 transition-colors ${
                pathname === href
                  ? 'text-amber-700 bg-amber-50'
                  : 'text-stone-600 hover:text-amber-700 hover:bg-stone-50'
              }`}
            >
              {label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  )
}
