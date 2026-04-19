import Link from 'next/link'

const sections = [
  { href: '/admin/prayer/new', label: '기도제목 작성', desc: '새 기도제목을 Notion에 등록합니다.' },
  { href: '/admin/gallery/new', label: '갤러리 이미지 업로드', desc: '사진을 업로드하고 갤러리에 추가합니다.' },
  { href: '/admin/news/new', label: '선교소식 작성', desc: '새 선교 소식 포스트를 작성합니다.' },
]

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-stone-800">대시보드</h1>
      <div className="grid gap-4 sm:grid-cols-3">
        {sections.map(({ href, label, desc }) => (
          <Link
            key={href}
            href={href}
            className="bg-white rounded-xl border border-stone-200 p-6 hover:border-amber-400 hover:shadow-sm transition-all"
          >
            <p className="font-semibold text-stone-800 mb-1">{label}</p>
            <p className="text-xs text-stone-500">{desc}</p>
          </Link>
        ))}
      </div>
    </div>
  )
}
