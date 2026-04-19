import dynamic from 'next/dynamic'

const PeopleList = dynamic(() => import('@/components/people/PeopleList'), { ssr: false })

export default function PeoplePage() {
  return (
    <div className="space-y-8">
      <section className="text-center space-y-2 py-6">
        <h1 className="text-3xl font-bold text-stone-800">같이하는 사람들</h1>
        <p className="text-stone-500 text-sm">B&W Mission Center와 함께하는 분들입니다.</p>
      </section>
      <PeopleList />
    </div>
  )
}
