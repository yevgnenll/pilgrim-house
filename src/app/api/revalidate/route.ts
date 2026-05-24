import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'

// Notion을 직접 수정한 뒤 이 URL을 열면 캐시를 무효화해 즉시 새 내용을 반영한다.
// 사용법: /api/revalidate?secret=시크릿            → 아래 경로 전부 갱신
//         /api/revalidate?secret=시크릿&path=/prayer → 특정 경로만 갱신
const DEFAULT_PATHS = ['/', '/prayer', '/gallery', '/news']

export async function GET(request: NextRequest) {
  const secret = request.nextUrl.searchParams.get('secret')

  if (!process.env.REVALIDATE_SECRET || secret !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json({ ok: false, message: '인증 실패' }, { status: 401 })
  }

  const pathParam = request.nextUrl.searchParams.get('path')
  const paths = pathParam ? [pathParam] : DEFAULT_PATHS

  for (const path of paths) {
    revalidatePath(path)
  }
  // 소식 상세 페이지(/news/[slug])도 함께 갱신
  if (!pathParam) {
    revalidatePath('/news/[slug]', 'page')
  }

  return NextResponse.json({
    ok: true,
    revalidated: paths,
    at: new Date().toISOString(),
  })
}
