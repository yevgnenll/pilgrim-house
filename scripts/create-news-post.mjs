import { Client } from '@notionhq/client'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// .env.local 로드
const envPath = path.resolve(__dirname, '../.env')
if (fs.existsSync(envPath)) {
  fs.readFileSync(envPath, 'utf-8')
    .split('\n')
    .forEach((line) => {
      const match = line.match(/^([^#=\s]+)\s*=\s*(.*)$/)
      if (match) process.env[match[1]] = match[2].trim()
    })
}

const NOTION_TOKEN = process.env.NOTION_TOKEN
const NEWS_DB_ID = process.env.NOTION_NEWS_DB_ID

if (!NOTION_TOKEN || !NEWS_DB_ID) {
  console.error('환경변수 NOTION_TOKEN, NOTION_NEWS_DB_ID 가 필요합니다. (.env.local 확인)')
  process.exit(1)
}

const notion = new Client({ auth: NOTION_TOKEN })

// Notion 파일 업로드 API로 이미지 업로드
async function uploadImage(filePath, fileName) {
  const fileBuffer = fs.readFileSync(filePath)
  const fileSize = fs.statSync(filePath).size

  console.log(`업로드 중: ${fileName} (${fileSize} bytes)`)

  // Step 1: 파일 업로드 객체 생성
  const uploadRes = await fetch('https://api.notion.com/v1/file-uploads', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${NOTION_TOKEN}`,
      'Notion-Version': '2022-06-28',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name: fileName,
      content_type: 'image/png',
      size: fileSize,
    }),
  })

  const uploadData = await uploadRes.json()
  if (!uploadRes.ok) {
    console.error('파일 업로드 객체 생성 실패:', JSON.stringify(uploadData))
    return null
  }

  const { id: fileUploadId, upload_url } = uploadData
  console.log(`업로드 URL 획득: ${fileUploadId}`)

  // Step 2: 실제 파일 업로드
  const uploadFileRes = await fetch(upload_url, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${NOTION_TOKEN}`,
      'Notion-Version': '2022-06-28',
      'Content-Type': 'image/png',
      'Content-Length': fileSize.toString(),
    },
    body: fileBuffer,
  })

  if (!uploadFileRes.ok) {
    const errText = await uploadFileRes.text()
    console.error('파일 업로드 실패:', errText)
    return null
  }

  console.log(`업로드 완료: ${fileUploadId}`)
  return fileUploadId
}

async function main() {
  const imagesDir = '/Users/yevgnenll/Downloads/files 2'

  // 사역.png를 커버 이미지로, 나머지를 본문에 사용
  const coverPath = path.join(imagesDir, '사역.png')
  const contentImages = [
    { file: path.join(imagesDir, 'education.png'), caption: '바이블 스쿨 교육 현장' },
    { file: path.join(imagesDir, '사역 education.png'), caption: '어린이반 수업' },
    { file: path.join(imagesDir, '사역 기도.png'), caption: '함께하는 기도' },
    { file: path.join(imagesDir, '사역 물품.png'), caption: '후원 물품 전달' },
  ]

  // 커버 이미지 업로드
  const coverUploadId = await uploadImage(coverPath, '사역.png')

  // 본문 이미지 업로드
  const uploadedImages = []
  for (const img of contentImages) {
    if (fs.existsSync(img.file)) {
      const id = await uploadImage(img.file, path.basename(img.file))
      if (id) uploadedImages.push({ id, caption: img.caption })
    }
  }

  // 본문 블록 구성
  const blocks = [
    // 1. 시한욱빌 소개
    {
      object: 'block',
      type: 'heading_2',
      heading_2: { rich_text: [{ type: 'text', text: { content: '캄보디아 시한욱빌 소개' } }] },
    },
    {
      object: 'block',
      type: 'paragraph',
      paragraph: {
        rich_text: [{
          type: 'text',
          text: {
            content: '시한욱빌은 캄보디아의 4번째 도시로, 바다를 품은 아름다운 곳이지만 현재 불법이 난무해 "제2 마카오"라 불리고 있습니다. 캄보디아는 2020년 기준 성인 문맹률이 약 87.8%에 달하며, 시골로 갈수록 더 높아집니다.',
          },
        }],
      },
    },

    // 2. 사역 1년의 발견
    {
      object: 'block',
      type: 'heading_2',
      heading_2: { rich_text: [{ type: 'text', text: { content: '사역 1년의 발견' } }] },
    },
    {
      object: 'block',
      type: 'paragraph',
      paragraph: {
        rich_text: [{
          type: 'text',
          text: {
            content: '작년 3월 31일 캄보디아에 도착해 1년이 지났습니다. 주일학교 및 아이들 돌봄 사역을 통해, 아이들이 학교에 다녀도 자국 언어를 잘 읽지 못한다는 사실을 알게 되었습니다. 언어 자체가 고대어인 데다 의무교육도 아니고 교사들의 책임감도 부족하여, 교회에 다니면서도 성경을 읽지 못하는 성도와 아이들이 많았습니다.',
          },
        }],
      },
    },

    // 3. 바이블 스쿨 개설
    {
      object: 'block',
      type: 'heading_2',
      heading_2: { rich_text: [{ type: 'text', text: { content: '필그림 하우스 바이블 스쿨 개설' } }] },
    },
    {
      object: 'block',
      type: 'paragraph',
      paragraph: {
        rich_text: [{
          type: 'text',
          text: {
            content: '기도 중 캄보디아어를 가르쳐 성경을 읽고 말씀을 암송하게 하는 것이 진정한 전도임을 깨달았습니다. 시한욱빌 성갓무어이 지역에 센터를 임대하여 4월 1일 "필그림 하우스 바이블 스쿨"을 개설했습니다. 인근의 선교사님들(오직예수그리스도교회)이 사역자를 파견하고 물품도 나눠주었으며 축복기도를 함께 했습니다.',
          },
        }],
      },
    },

    // 4. 교사와 첫날 현황
    {
      object: 'block',
      type: 'heading_2',
      heading_2: { rich_text: [{ type: 'text', text: { content: '교사와 첫날 현황' } }] },
    },
    {
      object: 'block',
      type: 'paragraph',
      paragraph: {
        rich_text: [{
          type: 'text',
          text: {
            content: '사역자는 캄보디아 장로교신학교 출신으로, 남자 선생님 지디(어른반)·여자 선생님 시야(어린이반)가 맡았습니다. 첫날 어른반에 할머니 3명·아주머니 1명, 어린이반에 18명이 참석했습니다. 어린이 책상 6세트와 어른 책상 2세트를 후원으로 준비했는데 예상을 훨씬 넘는 참석자에 깜짝 놀랐습니다.',
          },
        }],
      },
    },
  ]

  // 업로드된 이미지 블록 추가
  for (const img of uploadedImages) {
    blocks.push({
      object: 'block',
      type: 'image',
      image: {
        type: 'file_upload',
        file_upload: { id: img.id },
        caption: [{ type: 'text', text: { content: img.caption } }],
      },
    })
  }

  // 커버 이미지 설정
  const coverProperty = coverUploadId
    ? { type: 'file_upload', file_upload: { id: coverUploadId } }
    : null

  // Notion 페이지 생성
  const pagePayload = {
    parent: { database_id: NEWS_DB_ID },
    cover: coverProperty,
    properties: {
      Title: { title: [{ text: { content: '필그림 하우스 바이블 스쿨 개설 — 사역 1주년 소식' } }] },
      Slug: { rich_text: [{ text: { content: 'bible-school-opening-2025' } }] },
      Summary: { rich_text: [{ text: { content: '캄보디아 시한욱빌 성갓무어이 지역에 필그림 하우스 바이블 스쿨을 개설했습니다. 첫날부터 어린이 18명을 포함해 많은 분들이 참석해 주셨습니다.' } }] },
      Date: { date: { start: '2025-04-01' } },
      Published: { checkbox: true },
    },
    children: blocks,
  }

  console.log('\nNotion 페이지 생성 중...')
  const page = await notion.pages.create(pagePayload)
  console.log(`\n✅ 페이지 생성 완료!`)
  console.log(`페이지 ID: ${page.id}`)
  console.log(`URL: https://notion.so/${page.id.replace(/-/g, '')}`)
}

main().catch(console.error)
