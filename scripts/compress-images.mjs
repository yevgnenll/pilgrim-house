/**
 * 이미지 압축 스크립트
 * 사용법: node scripts/compress-images.mjs [폴더경로]
 * 기본값: public/images 하위 전체
 */

import sharp from 'sharp'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '..')

const TARGET_DIR = process.argv[2]
  ? path.resolve(process.argv[2])
  : path.resolve(ROOT, 'public/images')

const IMAGE_EXTS = ['.jpg', '.jpeg', '.png', '.webp']
const MAX_WIDTH = 1200   // 최대 가로 1200px
const JPEG_QUALITY = 80  // JPEG 품질 (0~100)
const PNG_QUALITY = 80

function getAllImages(dir) {
  const results = []
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      results.push(...getAllImages(fullPath))
    } else if (IMAGE_EXTS.includes(path.extname(entry.name).toLowerCase())) {
      results.push(fullPath)
    }
  }
  return results
}

async function compress(filePath) {
  const ext = path.extname(filePath).toLowerCase()
  const beforeSize = fs.statSync(filePath).size

  const image = sharp(filePath).rotate().resize({ width: MAX_WIDTH, withoutEnlargement: true })

  let buffer
  if (ext === '.png') {
    buffer = await image.png({ quality: PNG_QUALITY, compressionLevel: 9 }).toBuffer()
  } else {
    buffer = await image.jpeg({ quality: JPEG_QUALITY, mozjpeg: true }).toBuffer()
  }

  // 압축 후가 더 작을 때만 덮어쓰기
  if (buffer.length < beforeSize) {
    fs.writeFileSync(filePath, buffer)
    const afterSize = buffer.length
    const saved = ((beforeSize - afterSize) / beforeSize * 100).toFixed(1)
    return { saved: beforeSize - afterSize, percent: saved }
  }

  return { saved: 0, percent: '0' }
}

async function main() {
  const images = getAllImages(TARGET_DIR)
  console.log(`\n${images.length}개 이미지 압축 시작...\n`)

  let totalBefore = 0
  let totalSaved = 0

  for (let i = 0; i < images.length; i++) {
    const file = images[i]
    const beforeSize = fs.statSync(file).size
    totalBefore += beforeSize

    try {
      const { saved, percent } = await compress(file)
      totalSaved += saved
      const relativePath = path.relative(ROOT, file)
      if (saved > 0) {
        console.log(`[${i + 1}/${images.length}] ✅ ${relativePath}`)
        console.log(`         ${(beforeSize / 1024).toFixed(0)}KB → ${((beforeSize - saved) / 1024).toFixed(0)}KB (-${percent}%)`)
      } else {
        console.log(`[${i + 1}/${images.length}] — ${relativePath} (이미 최적화됨)`)
      }
    } catch (err) {
      console.error(`[${i + 1}/${images.length}] ❌ ${file}: ${err.message}`)
    }
  }

  console.log('\n================================')
  console.log(`총 절약: ${(totalBefore / 1024 / 1024).toFixed(1)}MB → ${((totalBefore - totalSaved) / 1024 / 1024).toFixed(1)}MB`)
  console.log(`절약 용량: ${(totalSaved / 1024 / 1024).toFixed(1)}MB (${(totalSaved / totalBefore * 100).toFixed(1)}%)`)
  console.log('================================\n')
}

main().catch(console.error)
