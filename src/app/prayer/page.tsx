import { getPrayerRequests } from '@/lib/notion'
import PrayerList from '@/components/prayer/PrayerList'

export const revalidate = 3600

export const metadata = { title: '기도제목 | B&W Mission Center' }

export default async function PrayerPage() {
  const prayers = await getPrayerRequests().catch(() => [])

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-stone-800">기도제목</h1>
        <p className="text-stone-500 mt-2">함께 기도해 주셔서 감사합니다.</p>
      </div>
      <PrayerList prayers={prayers} />
    </div>
  )
}
