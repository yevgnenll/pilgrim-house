// Notion에서 가져오는 데이터 타입 정의

export interface PrayerRequest {
  id: string
  title: string
  content: string
  date: string
  status: '기도중' | '응답됨'
  category: '김순아 선교사' | '한주연 이사(단기선교 2026-04-20 ~ 2026-05-18)' | ''
  published: boolean
}

export interface GalleryItem {
  id: string
  title: string
  photoUrl: string
  description: string
  date: string
  tags: string[]
  published: boolean
}

export interface NewsPost {
  id: string
  title: string
  slug: string
  coverUrl: string
  summary: string
  date: string
  published: boolean
}

export interface NewsPostDetail extends NewsPost {
  blocks: NotionBlock[]
}

// Notion 블록 (본문 렌더링용)
export interface NotionBlock {
  id: string
  type: 'paragraph' | 'heading_1' | 'heading_2' | 'heading_3' | 'bulleted_list_item' | 'numbered_list_item' | 'image' | 'quote'
  content: string
  imageUrl?: string
}
