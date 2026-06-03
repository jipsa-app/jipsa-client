import { useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { getContracts } from '../api/contract'

const types = [
  {
    path: '/monthly',
    color: '#BA7517',
    bg: '#FAEEDA',
    textColor: '#633806',
    borderColor: '#E8C88A',
    icon: '🏠',
    label: '월세',
    desc: '보증금 일부 맡기고 매달 월세 납부',
    stars: '★★',
    starsGray: '★★★',
    badge: null,
  },
  {
    path: '/jeonse',
    color: '#185FA5',
    bg: '#E6F1FB',
    textColor: '#0C447C',
    borderColor: '#A8C8E8',
    icon: '🔑',
    label: '전세',
    desc: '목돈 맡기고 무이자 거주',
    stars: '★★★★',
    starsGray: '★',
    badge: '많이 선택',
  },
  {
    path: '/sale',
    color: '#534AB7',
    bg: '#EEEDFE',
    textColor: '#3C3489',
    borderColor: '#B8B4E8',
    icon: '🏡',
    label: '매매',
    desc: '소유권 취득, 세금·대출 복잡',
    stars: '★★★★★',
    starsGray: '',
    badge: null,
  },
]

export default function Home() {
  const navigate = useNavigate()
  const [nickname, setNickname] = useState(null)
  const [urgentSchedule, setUrgentSchedule] = useState(null)

  useEffect(() => {
    setNickname(localStorage.getItem('nickname'))
    if (localStorage.getItem('token')) {
      getContracts().then(res => {
        const today = new Date().setHours(0, 0, 0, 0)
        let closest = null
        res.data.forEach(c => {
          [
            { label: '잔금일', date: c.balanceDate },
            { label: '계약 만료일', date: c.expiryDate },
          ].forEach(({ label, date }) => {
            if (!date) return
            const diff = Math.ceil((new Date(date) - today) / 86400000)
            if (diff >= 0 && diff <= 30) {
              if (!closest || diff < closest.diff) {
                closest = { label, date, diff, address: c.address }
              }
            }
          })
        })
        setUrgentSchedule(closest)
      }).catch(() => {})
    }
  }, [])

  function handleLogout() {
    localStorage.removeItem('token')
    localStorage.removeItem('nickname')
    localStorage.removeItem('monthly_step')
    localStorage.removeItem('jeonse_step')
    localStorage.removeItem('sale_step')
    setNickname(null)
    setUrgentSchedule(null)
  }

  return (
    <div className="mx-auto max-w-mobile min-h-screen flex flex-col bg-white">
      {/* 헤더 */}
      <div className="px-5 pt-10 pb-6">
        <div className="flex items-start justify-between">
          <div className="text-4xl mb-3">🏠</div>
          {nickname ? (
            <div className="flex items-center gap-2 mt-1">
              <span className="text-sm text-gray-600 font-medium">{nickname}님</span>
              <button
                onClick={handleLogout}
                className="text-xs text-gray-400 underline"
              >
                로그아웃
              </button>
            </div>
          ) : (
            <button
              onClick={() => navigate('/login')}
              className="mt-1 text-sm text-[#185FA5] font-semibold border border-[#185FA5] rounded-lg px-3 py-1"
            >
              로그인
            </button>
          )}
        </div>
        <h1 className="text-2xl font-bold text-gray-900 leading-tight">집 구하기 가이드</h1>
        <p className="text-sm text-gray-500 mt-1">처음 집 구하는 분들을 위한 부동산 거래 단계별 안내</p>
      </div>

      {/* 임박 일정 배너 */}
      {urgentSchedule && (
        <button
          onClick={() => navigate('/schedule')}
          className="mx-4 mb-2 w-[calc(100%-2rem)] flex items-center gap-3 rounded-xl px-4 py-3 text-left active:scale-[0.98] transition-transform"
          style={{
            backgroundColor: urgentSchedule.diff <= 7 ? '#FCEBEB' : '#FAEEDA',
            border: `1px solid ${urgentSchedule.diff <= 7 ? '#F5BABA' : '#E8C88A'}`,
          }}
        >
          <span className="text-xl">{urgentSchedule.diff <= 7 ? '🚨' : '⏰'}</span>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold truncate" style={{ color: urgentSchedule.diff <= 7 ? '#791F1F' : '#633806' }}>
              {urgentSchedule.address}
            </p>
            <p className="text-xs mt-0.5" style={{ color: urgentSchedule.diff <= 7 ? '#E24B4A' : '#BA7517' }}>
              {urgentSchedule.label} {urgentSchedule.diff === 0 ? '오늘!' : `D-${urgentSchedule.diff}`}
            </p>
          </div>
          <span className="text-xs font-bold px-2 py-1 rounded-full text-white flex-shrink-0"
            style={{ backgroundColor: urgentSchedule.diff <= 7 ? '#E24B4A' : '#BA7517' }}>
            확인
          </span>
        </button>
      )}

      {/* 거래 유형 카드 */}
      <div className="px-4 space-y-3 flex-1">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide px-1 mb-1">거래 유형 선택</p>
        {types.map((t) => (
          <button
            key={t.path}
            onClick={() => navigate(t.path)}
            className="w-full text-left rounded-xl border p-4 flex items-center gap-4 active:scale-[0.98] transition-transform"
            style={{ backgroundColor: t.bg, borderColor: t.borderColor }}
          >
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
              style={{ backgroundColor: t.color + '22' }}
            >
              {t.icon}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                <span className="font-bold text-base" style={{ color: t.textColor }}>{t.label}</span>
                {t.badge && (
                  <span
                    className="text-xs px-2 py-0.5 rounded-full font-medium"
                    style={{ backgroundColor: t.color, color: 'white' }}
                  >
                    {t.badge}
                  </span>
                )}
              </div>
              <p className="text-sm" style={{ color: t.textColor + 'CC' }}>{t.desc}</p>
              <div className="mt-1.5 flex items-center gap-1">
                <span className="text-xs font-medium" style={{ color: t.textColor }}>난이도</span>
                <span className="text-xs" style={{ color: t.color }}>{t.stars}</span>
                <span className="text-xs text-gray-300">{t.starsGray}</span>
              </div>
            </div>
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" className="flex-shrink-0">
              <path d="M7 4L12 9L7 14" stroke={t.color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        ))}
      </div>

      {/* 하단 배너 */}
      <div className="px-4 pb-8 pt-4 space-y-3 mt-4">
        <button
          onClick={() => navigate('/checklist')}
          className="w-full flex items-center gap-3 bg-[#FCEBEB] border border-[#F5BABA] rounded-xl px-4 py-3.5 active:scale-[0.98] transition-transform"
        >
          <span className="text-xl">🛡️</span>
          <div className="flex-1 text-left">
            <p className="font-semibold text-[#791F1F] text-sm">전세사기 예방 체크리스트</p>
            <p className="text-xs text-[#791F1F]/70 mt-0.5">계약 전 6가지 필수 확인 항목</p>
          </div>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M6 3.5L10.5 8L6 12.5" stroke="#E24B4A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>

        <button
          onClick={() => navigate('/documents')}
          className="w-full flex items-center gap-3 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5 active:scale-[0.98] transition-transform"
        >
          <span className="text-xl">📄</span>
          <div className="flex-1 text-left">
            <p className="font-semibold text-gray-800 text-sm">서류 미리보기</p>
            <p className="text-xs text-gray-400 mt-0.5">등기부등본·계약서·건축물대장 보는 법</p>
          </div>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M6 3.5L10.5 8L6 12.5" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>

        <button
          onClick={() => navigate('/schedule')}
          className="w-full flex items-center gap-3 bg-[#E6F1FB] border border-[#A8C8E8] rounded-xl px-4 py-3.5 active:scale-[0.98] transition-transform"
        >
          <span className="text-xl">📅</span>
          <div className="flex-1 text-left">
            <p className="font-semibold text-[#0C447C] text-sm">계약 일정 관리</p>
            <p className="text-xs text-[#0C447C]/70 mt-0.5">잔금일·전입신고 D-day 자동 계산</p>
          </div>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M6 3.5L10.5 8L6 12.5" stroke="#185FA5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>
    </div>
  )
}
