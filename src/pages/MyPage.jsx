import { useNavigate } from 'react-router-dom'
import BottomNav from '../components/BottomNav'

export default function MyPage() {
  const navigate = useNavigate()
  const nickname = localStorage.getItem('nickname')
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

  return (
    <div className="mx-auto max-w-mobile min-h-screen bg-gray-50 pb-20">
      {/* 헤더 */}
      <div className="bg-white px-5 pt-12 pb-6 border-b border-gray-100">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-[#E6F1FB] flex items-center justify-center text-2xl">
            👤
          </div>
          <div>
            {isLoggedIn ? (
              <>
                <p className="font-bold text-gray-900 text-lg">{nickname}님</p>
                <p className="text-sm text-gray-400">집사 회원</p>
              </>
            ) : (
              <>
                <p className="font-bold text-gray-900">로그인이 필요해요</p>
                <p className="text-sm text-gray-400">로그인하고 더 많은 기능을 사용해보세요</p>
              </>
            )}
          </div>
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
        {/* 나의 활동 */}
        <Section title="나의 활동">
          <MenuItem icon="✅" label="전세사기 예방 체크리스트" onClick={() => navigate('/checklist')} />
          <MenuItem icon="📅" label="계약 일정 관리" onClick={() => navigate('/schedule')} />
          <MenuItem icon="📄" label="서류 미리보기" onClick={() => navigate('/documents')} />
        </Section>

        {/* 가이드 */}
        <Section title="거래 가이드">
          <MenuItem icon="🏠" label="월세 계약 가이드" onClick={() => navigate('/monthly')} />
          <MenuItem icon="🔑" label="전세 계약 가이드" onClick={() => navigate('/jeonse')} />
          <MenuItem icon="🏡" label="매매 계약 가이드" onClick={() => navigate('/sale')} />
        </Section>

        {/* 준비 중인 기능 */}
        <Section title="준비 중 🚧">
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
            <div className="px-4 py-4 flex items-center justify-between opacity-50">
              <div className="flex items-center gap-3">
                <span className="text-lg">💰</span>
                <div>
                  <p className="text-sm font-medium text-gray-800">맞춤 대출 추천</p>
                  <p className="text-xs text-gray-400">내 자산 정보 입력하면 대출 상품 추천</p>
                </div>
              </div>
              <span className="text-xs text-gray-300 bg-gray-100 px-2 py-1 rounded-full">준비 중</span>
            </div>
            <div className="px-4 py-4 flex items-center justify-between opacity-50 border-t border-gray-50">
              <div className="flex items-center gap-3">
                <span className="text-lg">🔔</span>
                <div>
                  <p className="text-sm font-medium text-gray-800">D-day 이메일 알림</p>
                  <p className="text-xs text-gray-400">계약 만료일 전 이메일로 알림</p>
                </div>
              </div>
              <span className="text-xs text-gray-300 bg-gray-100 px-2 py-1 rounded-full">준비 중</span>
            </div>
          </div>
        </Section>

        {/* 계정 */}
        {isLoggedIn && (
          <Section title="계정">
            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
              <button
                onClick={handleLogout}
                className="w-full px-4 py-4 flex items-center gap-3 hover:bg-gray-50 transition-colors"
              >
                <span className="text-lg">🚪</span>
                <span className="text-sm font-medium text-red-400">로그아웃</span>
              </button>
            </div>
          </Section>
        )}
      </div>

      <BottomNav />
    </div>
  )
}

function Section({ title, children }) {
  return (
    <div className="space-y-2">
      <p className="text-xs font-semibold text-gray-400 px-1 uppercase tracking-wide">{title}</p>
      {children}
    </div>
  )
}

function MenuItem({ icon, label, onClick }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
      <button
        onClick={onClick}
        className="w-full px-4 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <span className="text-lg">{icon}</span>
          <span className="text-sm font-medium text-gray-800">{label}</span>
        </div>
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path d="M5 3l4 4-4 4" stroke="#d1d5db" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
    </div>
  )
}
