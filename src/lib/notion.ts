import { Client } from '@notionhq/client'
import type { PrayerRequest, GalleryItem, NewsPost, NewsPostDetail, NotionBlock } from './types'

// Notion 클라이언트 초기화
const notion = new Client({
  auth: process.env.NOTION_TOKEN,
})

const PRAYER_DB_ID = process.env.NOTION_PRAYER_DB_ID!
const GALLERY_DB_ID = process.env.NOTION_GALLERY_DB_ID!
const NEWS_DB_ID = process.env.NOTION_NEWS_DB_ID!

// ─── 유틸리티 ────────────────────────────────────────────

/** Notion 날짜 → 한국어 형식 변환 */
function formatDate(dateString: string | null): string {
  if (!dateString) return ''
  return new Date(dateString).toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

/** Notion RichText → 일반 문자열 변환 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function richTextToString(richText: any[]): string {
  return richText?.map((t: any) => t.plain_text).join('') ?? ''
}

// ─── 기도제목 ─────────────────────────────────────────────

export async function getPrayerRequests(): Promise<PrayerRequest[]> {
  const response = await notion.databases.query({
    database_id: PRAYER_DB_ID,
    filter: {
      property: 'Published',
      checkbox: { equals: true },
    },
    sorts: [{ property: 'Date', direction: 'descending' }],
  })

  return response.results.map((page: any) => ({
    id: page.id,
    title: richTextToString(page.properties.Title?.title ?? []),
    content: richTextToString(page.properties.Content?.rich_text ?? []),
    date: formatDate(page.properties.Date?.date?.start ?? null),
    status: page.properties.Status?.select?.name ?? '기도중',
    published: page.properties.Published?.checkbox ?? false,
  }))
}

// ─── 갤러리 ───────────────────────────────────────────────

export async function getGalleryItems(): Promise<GalleryItem[]> {
  const response = await notion.databases.query({
    database_id: GALLERY_DB_ID,
    filter: {
      property: 'Published',
      checkbox: { equals: true },
    },
    sorts: [{ property: 'Date', direction: 'descending' }],
  })

  return response.results.map((page: any) => ({
    id: page.id,
    title: richTextToString(page.properties.Title?.title ?? []),
    photoUrl: page.properties.Photo?.files?.[0]?.file?.url
      ?? page.properties.Photo?.files?.[0]?.external?.url
      ?? '',
    description: richTextToString(page.properties.Description?.rich_text ?? []),
    date: formatDate(page.properties.Date?.date?.start ?? null),
    tags: page.properties.Tag?.multi_select?.map((t: any) => t.name) ?? [],
    published: page.properties.Published?.checkbox ?? false,
  }))
}

// ─── 선교 소식 ────────────────────────────────────────────

export async function getNewsPosts(): Promise<NewsPost[]> {
  const response = await notion.databases.query({
    database_id: NEWS_DB_ID,
    filter: {
      property: 'Published',
      checkbox: { equals: true },
    },
    sorts: [{ property: 'Date', direction: 'descending' }],
  })

  return response.results.map((page: any) => ({
    id: page.id,
    title: richTextToString(page.properties.Title?.title ?? []),
    slug: richTextToString(page.properties.Slug?.rich_text ?? []),
    coverUrl: page.properties.Cover?.files?.[0]?.file?.url
      ?? page.properties.Cover?.files?.[0]?.external?.url
      ?? '',
    summary: richTextToString(page.properties.Summary?.rich_text ?? []),
    date: formatDate(page.properties.Date?.date?.start ?? null),
    published: page.properties.Published?.checkbox ?? false,
  }))
}

export async function getNewsPostBySlug(slug: string): Promise<NewsPostDetail | null> {
  // slug로 페이지 찾기
  const response = await notion.databases.query({
    database_id: NEWS_DB_ID,
    filter: {
      and: [
        { property: 'Slug', rich_text: { equals: slug } },
        { property: 'Published', checkbox: { equals: true } },
      ],
    },
  })

  if (!response.results.length) return null

  const page = response.results[0] as any

  // 페이지 본문 블록 가져오기
  const blocksResponse = await notion.blocks.children.list({ block_id: page.id })
  const blocks = parseBlocks(blocksResponse.results)

  return {
    id: page.id,
    title: richTextToString(page.properties.Title?.title ?? []),
    slug: richTextToString(page.properties.Slug?.rich_text ?? []),
    coverUrl: page.properties.Cover?.files?.[0]?.file?.url
      ?? page.properties.Cover?.files?.[0]?.external?.url
      ?? '',
    summary: richTextToString(page.properties.Summary?.rich_text ?? []),
    date: formatDate(page.properties.Date?.date?.start ?? null),
    published: page.properties.Published?.checkbox ?? false,
    blocks,
  }
}

/** Notion 블록 배열 → 렌더링용 구조로 변환 */
function parseBlocks(blocks: any[]): NotionBlock[] {
  return blocks.map((block) => {
    const type = block.type as NotionBlock['type']
    const richText = block[type]?.rich_text ?? []

    if (type === 'image') {
      return {
        id: block.id,
        type,
        content: richTextToString(block.image?.caption ?? []),
        imageUrl: block.image?.file?.url ?? block.image?.external?.url ?? '',
      }
    }

    return {
      id: block.id,
      type,
      content: richTextToString(richText),
    }
  })
}

/** 모든 뉴스 슬러그 반환 (generateStaticParams용) */
export async function getAllNewsSlugs(): Promise<string[]> {
  const posts = await getNewsPosts()
  return posts.map((p) => p.slug).filter(Boolean)
}
