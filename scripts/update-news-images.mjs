import { Client } from '@notionhq/client'

const NOTION_TOKEN = process.env.NOTION_TOKEN

if (!NOTION_TOKEN) {
  console.error('환경변수 NOTION_TOKEN 이 필요합니다.')
  process.exit(1)
}
const PAGE_ID = '340b967d-93d5-8120-9668-cbc9bc9ca9d3'
const BASE_URL = 'https://raw.githubusercontent.com/yevgnenll/pilgrim-house/main/public/images/news'

const notion = new Client({ auth: NOTION_TOKEN })

const images = [
  { url: `${BASE_URL}/bible-school-opening.png`, caption: '필그림 하우스 바이블 스쿨 개설 첫날' },
  { url: `${BASE_URL}/bible-school-class.png`, caption: '어린이반 수업 현장' },
  { url: `${BASE_URL}/bible-school-education.png`, caption: '바이블 스쿨 교육' },
  { url: `${BASE_URL}/bible-school-prayer.png`, caption: '함께하는 기도' },
  { url: `${BASE_URL}/bible-school-supplies.png`, caption: '후원 물품 전달' },
]

async function main() {
  // 커버 이미지 업데이트
  await notion.pages.update({
    page_id: PAGE_ID,
    cover: {
      type: 'external',
      external: { url: images[0].url },
    },
  })
  console.log('커버 이미지 설정 완료')

  // 이미지 블록 추가
  const imageBlocks = images.map(img => ({
    object: 'block',
    type: 'image',
    image: {
      type: 'external',
      external: { url: img.url },
      caption: [{ type: 'text', text: { content: img.caption } }],
    },
  }))

  await notion.blocks.children.append({
    block_id: PAGE_ID,
    children: [
      {
        object: 'block',
        type: 'heading_2',
        heading_2: { rich_text: [{ type: 'text', text: { content: '현장 사진' } }] },
      },
      ...imageBlocks,
    ],
  })

  console.log('✅ 이미지 블록 추가 완료!')
  console.log(`Notion 페이지: https://notion.so/${PAGE_ID.replace(/-/g, '')}`)
}

main().catch(console.error)
