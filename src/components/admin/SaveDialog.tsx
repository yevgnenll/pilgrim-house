import { useRouter } from 'next/navigation'

interface Props {
  onClose: () => void
}

export default function SaveDialog({ onClose }: Props) {
  const router = useRouter()

  function handleConfirm() {
    onClose()
    router.push('/admin')
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-2xl p-6 max-w-sm w-full space-y-4">
        <h2 className="text-lg font-bold text-stone-800">저장 완료</h2>
        <p className="text-sm text-stone-600 leading-relaxed">
          내용이 저장되었습니다.<br />
          사이트에 반영되기까지 최대 몇 분이 소요될 수 있습니다.
        </p>
        <button
          onClick={handleConfirm}
          className="w-full bg-amber-700 text-white rounded-lg py-2 text-sm font-medium hover:bg-amber-800 transition-colors"
        >
          확인
        </button>
      </div>
    </div>
  )
}
