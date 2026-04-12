import type { MetadataRoute } from 'next'
import { getAllNewsSlugs } from '@/lib/notion'

const BASE_URL = 'https://bnw.yevgnenll.me'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // 정적 페이지
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: BASE_URL,               lastModified: new Date(), changeFrequency: 'daily',   priority: 1.0 },
    { url: `${BASE_URL}/prayer`,   lastModified: new Date(), changeFrequency: 'weekly',  priority: 0.8 },
    { url: `${BASE_URL}/gallery`,  lastModified: new Date(), changeFrequency: 'weekly',  priority: 0.8 },
    { url: `${BASE_URL}/news`,     lastModified: new Date(), changeFrequency: 'weekly',  priority: 0.8 },
    { url: `${BASE_URL}/support`,  lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
  ]

  // 뉴스 상세 페이지
  const slugs = await getAllNewsSlugs().catch(() => [])
  const newsRoutes: MetadataRoute.Sitemap = slugs.map((slug) => ({
    url: `${BASE_URL}/news/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.7,
  }))

  return [...staticRoutes, ...newsRoutes]
}
