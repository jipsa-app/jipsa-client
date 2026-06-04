import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import BottomNav from '../components/BottomNav'

export default function MyPage() {
  const navigate = useNavigate()
  const [nickname, setNickname] = useState(localStorage.getItem('nickname') || '')
  const [editMode, setEditMode] = useState(false)
  const [inputNick, setInputNick] = useState(nickname)
  const isLoggedIn = !!localStorage.getItem('token')

  function handleLogout() {
    localStorage.removeItem('token')
    localStorage.removeItem('nickname')
    localStorage.removeItem('monthly_step')
    localStorage.removeItem('jeonse_step')
    localStorage.removeItem('sale_step')
    localStorage.removeItem('urgent_schedule')
    navigate('/')
  }

  function handleSaveNickname() {
    if (!inputNick.trim()) return
    localStorage.setItem('nickname', inputNick.trim())
    setNickname(inputNick.trim())
    setEditMode(false)
  }

  return (
    <div className="mx-auto max-w-mobile min-h-screen bg-gray-50 pb-20">

      {/* 프로필 헤더 */}
      <div className="bg-white px-5 pt-12 pb-6 border-b border-gray-100">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-[#E6F1FB] flex items-center justify-center text-2xl flex-shrink-0">
            👤
          </div>
          {isLoggedIn ? (
            <div className="flex-1">
              {editMode ? (
                <div className="flex items-center gap-2">
                  <input
                    value={inputNick}
                    onChange={e => setInputNick(e.target.value)}
                    className="flex-1 border border-[#185FA5] rounded-lg px-3 py-1.5 text-sm outline-none"
                    maxLength={12}
                    autoFocus
                  />
                  <button
                    onClick={handleSaveNickname}
                    className="text-xs font-semibold text-white bg-[#185FA5] px-3 py-1.5 rounded-lg"
                  >
                    저장
                  </button>
                  <button
                    onClick={() => { setEditMode(false); setInputNick(nickname) }}
                    className="text-xs text-gray-400"
                  >
                    취소
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <p className="font-bold text-gray-900 text-lg">{nickname}님</p>
                  <button
                    onClick={() => setEditMode(true)}
                    className="text-xs text-gray-400 border border-gray-200 rounded-md px-2 py-0.5"
                  >
                    수정
                  </button>
                </div>
              )}
              <p className="text-sm text-gray-400 mt-0.5">집사 회원</p>
            </div>
          ) : (
            <div className="flex-1">
              <p className="font-bold text-gray-900">로그인이 필요해요</p>
              <p className="text-sm text-gray-400 mt-0.5">로그인하고 더 많은 기능을 사용해보세요</p>
            </div>
          )}
        </div>

        {!isLoggedIn && (
          <button
            onClick={() => navigate('/login')}
            className="w-full mt-4 py-3 rounded-xl text-sm font-semibold text-white bg-[#185FA5]"
          >
            로그인하기
          </button>
        )}
      </div>

      <div className="px-4 py-5 space-y-4">

        {/* 준비 중인 기능 */}
        <div className="space-y-2">
          <p className="text-xs font-semibold text-gray-400 px-1 uppercase tracking-wide">준비 중 🚧</p>
          <div className="bg-white rounded-2xl border border-gray-100 divide-y divide-gray-50">
            <ComingSoon icon="💰" label="맞춤 대출 추천" desc="내 자산 정보로 대출 상품 추천" />
            <ComingSoon icon="🔔" label="D-day 이메일 알림" desc="계약 만료일 전 이메일로 알림" />
            <ComingSoon icon="✏️" label="이메일 인증" desc="회원가입 시 이메일 본인 인증" />
          </div>
        </div>

        {/* 앱 정보 */}
        <div className="space-y-2">
          <p className="text-xs font-semibold text-gray-400 px-1 uppercase tracking-wide">앱 정보</p>
          <div className="bg-white rounded-2xl border border-gray-100 divide-y divide-gray-50">
            <InfoRow label="버전" value="v1.0.0" />
            <InfoRow label="문의" value="syysia2787@gmail.com" />
          </div>
        </div>

        {/* 계정 */}
        {isLoggedIn && (
          <div className="space-y-2">
            <p className="text-xs font-semibold text-gray-400 px-1 uppercase tracking-wide">계정</p>
            <div className="bg-white rounded-2xl border border-gray-100">
              <button
                onClick={handleLogout}
                className="w-full px-4 py-4 flex items-center gap-3 hover:bg-gray-50 transition-colors rounded-2xl"
              >
                <span className="text-lg">🚪</span>
                <span className="text-sm font-medium text-red-400">로그아웃</span>
              </button>
            </div>
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  )
}

function ComingSoon({ icon, label, desc }) {
  return (
    <div className="px-4 py-4 flex items-center justify-between">
      <div className="flex items-center gap-3 opacity-50">
        <span className="text-lg">{icon}</span>
        <div>
          <p className="text-sm font-medium text-gray-800">{label}</p>
          <p className="text-xs text-gray-400">{desc}</p>
        </div>
      </div>
      <span className="text-xs text-gray-300 bg-gray-100 px-2 py-1 rounded-full flex-shrink-0">준비 중</span>
    </div>
  )
}

function InfoRow({ label, value }) {
  return (
    <div className="px-4 py-4 flex items-center justify-between">
      <span className="text-sm text-gray-500">{label}</span>
      <span className="text-sm text-gray-400">{value}</span>
    </div>
  )
}
