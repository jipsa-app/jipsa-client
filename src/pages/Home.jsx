import { useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { getContracts } from '../api/contract'
import BottomNav from '../components/BottomNav'
import Header from '../components/Header'

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
  const [urgentSchedule, setUrgentSchedule] = useState(() => {
    const cached = localStorage.getItem('urgent_schedule')
    return cached ? JSON.parse(cached) : null
  })

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
        if (closest) {
          localStorage.setItem('urgent_schedule', JSON.stringify(closest))
        } else {
          localStorage.removeItem('urgent_schedule')
        }
      }).catch(() => {})
    }
  }, [])

  function handleLogout() {
    localStorage.removeItem('token')
    localStorage.removeItem('nickname')
    localStorage.removeItem('monthly_step')
    localStorage.removeItem('jeonse_step')
    localStorage.removeItem('sale_step')
    localStorage.removeItem('urgent_schedule')
    setNickname(null)
    setUrgentSchedule(null)
  }

  return (
    <div className="mx-auto max-w-mobile min-h-screen flex flex-col bg-white pb-16">
      {/* 통일된 헤더 */}
      <Header
        title="집사 🏠"
        noBack
        right={
          nickname ? (
            <button onClick={() => navigate('/mypage')} className="flex items-center gap-1.5">
              <span className="text-sm text-gray-600 font-medium">{nickname}님</span>
              <div className="w-7 h-7 rounded-full bg-[#E6F1FB] flex items-center justify-center text-sm">👤</div>
            </button>
          ) : (
            <button
              onClick={() => navigate('/login')}
              className="text-sm text-[#185FA5] font-semibold border border-[#185FA5] rounded-lg px-3 py-1"
            >
              로그인
            </button>
          )
        }
      />

      {/* 서브 타이틀 */}
      <div className="px-5 pt-5 pb-4">
        <h1 className="text-xl font-bold text-gray-900 leading-tight">거래 유형을 선택하세요</h1>
        <p className="text-sm text-gray-400 mt-1">처음 집 구하는 분들을 위한 단계별 안내</p>
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

      {/* 하단 여백 */}
      <div className="pb-6" />
      <BottomNav />
    </div>
  )
}
