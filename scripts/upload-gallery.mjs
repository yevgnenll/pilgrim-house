/**
 * 갤러리 이미지 일괄 업로드 스크립트
 *
 * 사용법:
 *   node scripts/upload-gallery.mjs <이미지폴더경로> [태그]
 *
 * 예시:
 *   node scripts/upload-gallery.mjs ~/Downloads/photos 사역
 *   node scripts/upload-gallery.mjs ~/Desktop/갤러리 "바이블스쿨,아이들"
 */

import { Client } from '@notionhq/client'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

// .env 로드
const envPath = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../.env')
if (fs.existsSync(envPath)) {
  fs.readFileSync(envPath, 'utf-8')
    .split('\n')
    .forEach((line) => {
      const match = line.match(/^([^#=\s]+)\s*=\s*(.*)$/)
      if (match) process.env[match[1]] = match[2].trim()
    })
}

const NOTION_TOKEN = process.env.NOTION_TOKEN
const GALLERY_DB_ID = process.env.NOTION_GALLERY_DB_ID

if (!NOTION_TOKEN || !GALLERY_DB_ID) {
  console.error('환경변수 NOTION_TOKEN, NOTION_GALLERY_DB_ID 가 필요합니다. (.env 확인)')
  process.exit(1)
}

const notion = new Client({ auth: NOTION_TOKEN })

const REPO_BASE_URL = 'https://raw.githubusercontent.com/yevgnenll/pilgrim-house/main/public/images/gallery'
const PUBLIC_DIR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../public/images/gallery')

const IMAGE_EXTS = ['.jpg', '.jpeg', '.png', '.gif', '.webp']

function getImageFiles(dir) {
  return fs.readdirSync(dir)
    .filter(f => IMAGE_EXTS.includes(path.extname(f).toLowerCase()))
    .sort()
}

function toSlug(filename) {
  return path.basename(filename, path.extname(filename))
    .replace(/\s+/g, '-')
    .replace(/[^a-zA-Z0-9가-힣-_]/g, '')
}

async function createGalleryItem(filename, publicFilename, tags) {
  const title = path.basename(filename, path.extname(filename))
  const imageUrl = `${REPO_BASE_URL}/${publicFilename}`
  const today = new Date().toISOString().split('T')[0]

  await notion.pages.create({
    parent: { database_id: GALLERY_DB_ID },
    properties: {
      Title: { title: [{ text: { content: title } }] },
      Photo: {
        files: [{
          type: 'external',
          name: publicFilename,
          external: { url: imageUrl },
        }],
      },
      Date: { date: { start: today } },
      Tag: {
        multi_select: tags.map(name => ({ name })),
      },
      Published: { checkbox: true },
    },
  })
}

async function main() {
  const inputDir = process.argv[2]
  const tagArg = process.argv[3] ?? ''
  const tags = tagArg ? tagArg.split(',').map(t => t.trim()).filter(Boolean) : []

  if (!inputDir) {
    console.error('사용법: node scripts/upload-gallery.mjs <이미지폴더경로> [태그]')
    console.error('예시:  node scripts/upload-gallery.mjs ~/Downloads/photos "사역,아이들"')
    process.exit(1)
  }

  const resolvedDir = inputDir.replace(/^~/, process.env.HOME)
  if (!fs.existsSync(resolvedDir)) {
    console.error(`폴더를 찾을 수 없습니다: ${resolvedDir}`)
    process.exit(1)
  }

  const files = getImageFiles(resolvedDir)
  if (files.length === 0) {
    console.error('이미지 파일이 없습니다.')
    process.exit(1)
  }

  console.log(`\n총 ${files.length}개 이미지 발견`)
  console.log(`태그: ${tags.length ? tags.join(', ') : '없음'}`)
  console.log(`대상 폴더: ${resolvedDir}\n`)

  // public/images/gallery 폴더에 복사
  fs.mkdirSync(PUBLIC_DIR, { recursive: true })

  for (let i = 0; i < files.length; i++) {
    const file = files[i]
    const ext = path.extname(file).toLowerCase()
    const slug = toSlug(file)
    const publicFilename = `${slug}${ext}`
    const srcPath = path.join(resolvedDir, file)
    const destPath = path.join(PUBLIC_DIR, publicFilename)

    // 파일 복사
    fs.copyFileSync(srcPath, destPath)

    // Notion 페이지 생성
    try {
      await createGalleryItem(file, publicFilename, tags)
      console.log(`[${i + 1}/${files.length}] ✅ ${file}`)
    } catch (err) {
      console.error(`[${i + 1}/${files.length}] ❌ ${file}: ${err.message}`)
    }
  }

  console.log('\n완료! 다음 단계:')
  console.log('  1. git add public/images/gallery/')
  console.log('  2. git commit -m "Add gallery images"')
  console.log('  3. git push')
}

main().catch(console.error)
