import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import BottomNav from '../components/BottomNav'
import Header from '../components/Header'

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
      <Header title="마이페이지" noBack />

      {/* 프로필 카드 */}
      <div className="mx-4 mt-4 bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
        {isLoggedIn ? (
          <div className="flex items-center gap-4">
            {/* 아바타 */}
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#185FA5] to-[#4A90D9] flex items-center justify-center text-white text-2xl font-bold flex-shrink-0 shadow-sm">
              {nickname?.charAt(0) || '👤'}
            </div>
            <div className="flex-1">
              {editMode ? (
                <div className="space-y-2">
                  <input
                    value={inputNick}
                    onChange={e => setInputNick(e.target.value)}
                    className="w-full border border-[#185FA5] rounded-xl px-3 py-2 text-sm outline-none font-medium"
                    maxLength={12}
                    autoFocus
                    placeholder="닉네임 입력"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={handleSaveNickname}
                      className="flex-1 text-xs font-semibold text-white bg-[#185FA5] py-2 rounded-lg"
                    >
                      저장
                    </button>
                    <button
                      onClick={() => { setEditMode(false); setInputNick(nickname) }}
                      className="flex-1 text-xs text-gray-500 border border-gray-200 py-2 rounded-lg"
                    >
                      취소
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex items-center gap-2">
                    <p className="font-bold text-gray-900 text-lg">{nickname}</p>
                    <button
                      onClick={() => setEditMode(true)}
                      className="text-[11px] text-[#185FA5] border border-[#185FA5]/30 bg-[#E6F1FB] rounded-full px-2 py-0.5 font-medium"
                    >
                      수정
                    </button>
                  </div>
                  <p className="text-sm text-gray-400 mt-0.5">집사 멤버</p>
                </>
              )}
            </div>
          </div>
        ) : (
          <div className="text-center py-2">
            <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center text-3xl mx-auto mb-3">
              👤
            </div>
            <p className="font-bold text-gray-900 mb-1">로그인이 필요해요</p>
            <p className="text-sm text-gray-400 mb-4">로그인하고 더 많은 기능을 사용해보세요</p>
            <button
              onClick={() => navigate('/login')}
              className="w-full py-3 rounded-xl text-sm font-semibold text-white bg-[#185FA5]"
            >
              로그인하기
            </button>
          </div>
        )}
      </div>

      <div className="px-4 py-5 space-y-4">

        {/* 준비 중인 기능 */}
        <div className="space-y-2">
          <p className="text-xs font-semibold text-gray-400 px-1 tracking-wide">준비 중인 기능 🚧</p>
          <div className="bg-white rounded-2xl border border-gray-100 divide-y divide-gray-50">
            <ComingSoon icon="💰" label="맞춤 대출 추천" desc="내 자산 정보로 대출 상품 추천" />
            <ComingSoon icon="🔔" label="D-day 이메일 알림" desc="계약 만료일 전 이메일로 알림" />
            <ComingSoon icon="✏️" label="이메일 인증" desc="회원가입 시 이메일 본인 인증" />
          </div>
        </div>

        {/* 앱 정보 */}
        <div className="space-y-2">
          <p className="text-xs font-semibold text-gray-400 px-1 tracking-wide">앱 정보</p>
          <div className="bg-white rounded-2xl border border-gray-100 divide-y divide-gray-50">
            <InfoRow label="버전" value="v1.0.0" />
            <InfoRow label="문의" value="syysia2787@gmail.com" />
          </div>
        </div>

        {/* 계정 */}
        {isLoggedIn && (
          <div className="space-y-2">
            <p className="text-xs font-semibold text-gray-400 px-1 tracking-wide">계정</p>
            <div className="bg-white rounded-2xl border border-gray-100">
              <button
                onClick={handleLogout}
                className="w-full px-4 py-3.5 flex items-center gap-3 hover:bg-red-50 transition-colors rounded-2xl"
              >
                <div className="w-9 h-9 rounded-xl bg-red-50 flex items-center justify-center text-lg flex-shrink-0">
                  🚪
                </div>
                <span className="text-sm font-medium text-red-500">로그아웃</span>
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
    <div className="px-4 py-3.5 flex items-center justify-between">
      <div className="flex items-center gap-3 opacity-40">
        <div className="w-9 h-9 rounded-xl bg-gray-100 flex items-center justify-center text-lg flex-shrink-0">
          {icon}
        </div>
        <div>
          <p className="text-sm font-medium text-gray-800">{label}</p>
          <p className="text-xs text-gray-400 mt-0.5">{desc}</p>
        </div>
      </div>
      <span className="text-[11px] text-gray-300 bg-gray-100 px-2.5 py-1 rounded-full flex-shrink-0 font-medium">준비 중</span>
    </div>
  )
}

function InfoRow({ label, value }) {
  return (
    <div className="px-4 py-3.5 flex items-center justify-between">
      <span className="text-sm text-gray-600">{label}</span>
      <span className="text-sm text-gray-400">{value}</span>
    </div>
  )
}
