import { Client } from '@notionhq/client'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const envPath = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../.env')
if (fs.existsSync(envPath)) {
  fs.readFileSync(envPath, 'utf-8')
    .split('\n')
    .forEach((line) => {
      const match = line.match(/^([^#=\s]+)\s*=\s*(.*)$/)
      if (match) process.env[match[1]] = match[2].trim()
    })
}

const notion = new Client({ auth: process.env.NOTION_TOKEN })
const PRAYER_DB_ID = process.env.NOTION_PRAYER_DB_ID

async function main() {
  await notion.databases.update({
    database_id: PRAYER_DB_ID,
    properties: {
      Category: {
        select: {
          options: [
            { name: '선교사', color: 'blue' },
            { name: '이사',   color: 'green' },
          ],
        },
      },
    },
  })
  console.log('✅ Category 필드 추가 완료 (선교사 / 이사)')
}

main().catch(console.error)
