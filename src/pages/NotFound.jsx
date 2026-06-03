import { useNavigate } from 'react-router-dom'

export default function NotFound() {
  const navigate = useNavigate()
  return (
    <div className="mx-auto max-w-mobile min-h-screen flex flex-col items-center justify-center bg-white px-6 text-center">
      <div className="text-6xl mb-4">🏚️</div>
      <h1 className="text-2xl font-bold text-gray-900 mb-2">페이지를 찾을 수 없어요</h1>
      <p className="text-sm text-gray-500 mb-8">주소가 잘못됐거나 삭제된 페이지예요</p>
      <button
        onClick={() => navigate('/')}
        className="bg-[#185FA5] text-white font-semibold px-8 py-3 rounded-xl text-sm"
      >
        홈으로 돌아가기
      </button>
    </div>
  )
}
