import { useNavigate, useLocation } from 'react-router-dom'
import { useState } from 'react'

const GUIDE_TYPES = [
  { path: '/monthly', label: '월세', color: '#BA7517', bg: '#FAEEDA', icon: '🏠' },
  { path: '/jeonse', label: '전세', color: '#185FA5', bg: '#E6F1FB', icon: '🔑' },
  { path: '/sale',   label: '매매', color: '#534AB7', bg: '#EEEDFE', icon: '🏡' },
]

export default function BottomNav() {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const [showGuide, setShowGuide] = useState(false)

  const isActive = (path) => pathname === path

  const tabs = [
    {
      key: 'home',
      label: '홈',
      icon: HomeIcon,
      path: '/',
      active: isActive('/'),
      onClick: () => navigate('/'),
    },
    {
      key: 'guide',
      label: '가이드',
      icon: GuideIcon,
      active: ['/monthly', '/jeonse', '/sale'].includes(pathname),
      onClick: () => setShowGuide(v => !v),
    },
    {
      key: 'checklist',
      label: '체크리스트',
      icon: CheckIcon,
      path: '/checklist',
      active: isActive('/checklist'),
      onClick: () => navigate('/checklist'),
    },
    {
      key: 'schedule',
      label: '일정',
      icon: CalendarIcon,
      path: '/schedule',
      active: isActive('/schedule'),
      onClick: () => navigate('/schedule'),
    },
    {
      key: 'mypage',
      label: '마이페이지',
      icon: UserIcon,
      path: '/mypage',
      active: isActive('/mypage'),
      onClick: () => navigate('/mypage'),
    },
  ]

  return (
    <>
      {/* 가이드 선택 시트 */}
      {showGuide && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setShowGuide(false)} />
          <div className="fixed bottom-16 left-1/2 -translate-x-1/2 w-full max-w-mobile z-50 px-4">
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-4 space-y-2">
              <p className="text-xs text-gray-400 font-medium px-1 mb-3">거래 유형 선택</p>
              {GUIDE_TYPES.map(g => (
                <button
                  key={g.path}
                  onClick={() => { navigate(g.path); setShowGuide(false) }}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl border transition-all"
                  style={{ backgroundColor: g.bg, borderColor: g.color + '40' }}
                >
                  <span className="text-xl">{g.icon}</span>
                  <span className="font-semibold text-sm" style={{ color: g.color }}>{g.label} 계약 가이드</span>
                </button>
              ))}
            </div>
          </div>
        </>
      )}

      {/* 하단 탭바 */}
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-mobile z-30 bg-white border-t border-gray-100">
        <div className="flex items-center justify-around px-2 py-2">
          {tabs.map(tab => (
            <button
              key={tab.key}
              onClick={tab.onClick}
              className="flex flex-col items-center gap-0.5 px-3 py-1 rounded-xl transition-all"
            >
              <tab.icon active={tab.active} />
              <span
                className="text-[10px] font-medium"
                style={{ color: tab.active ? '#185FA5' : '#9ca3af' }}
              >
                {tab.label}
              </span>
            </button>
          ))}
        </div>
      </div>
    </>
  )
}

function HomeIcon({ active }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <path d="M3 9.5L12 3L21 9.5V20a1 1 0 01-1 1H5a1 1 0 01-1-1V9.5z"
        stroke={active ? '#185FA5' : '#9ca3af'} strokeWidth="1.8"
        fill={active ? '#E6F1FB' : 'none'} strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M9 21V12h6v9" stroke={active ? '#185FA5' : '#9ca3af'} strokeWidth="1.8" strokeLinecap="round"/>
    </svg>
  )
}

function GuideIcon({ active }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <rect x="3" y="3" width="18" height="18" rx="3"
        stroke={active ? '#185FA5' : '#9ca3af'} strokeWidth="1.8"
        fill={active ? '#E6F1FB' : 'none'}/>
      <path d="M7 8h10M7 12h10M7 16h6"
        stroke={active ? '#185FA5' : '#9ca3af'} strokeWidth="1.8" strokeLinecap="round"/>
    </svg>
  )
}

function CheckIcon({ active }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <rect x="3" y="3" width="18" height="18" rx="3"
        stroke={active ? '#185FA5' : '#9ca3af'} strokeWidth="1.8"
        fill={active ? '#E6F1FB' : 'none'}/>
      <path d="M7 12l3.5 3.5L17 8"
        stroke={active ? '#185FA5' : '#9ca3af'} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

function CalendarIcon({ active }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <rect x="3" y="4" width="18" height="18" rx="2"
        stroke={active ? '#185FA5' : '#9ca3af'} strokeWidth="1.8"
        fill={active ? '#E6F1FB' : 'none'}/>
      <path d="M8 2v4M16 2v4M3 10h18"
        stroke={active ? '#185FA5' : '#9ca3af'} strokeWidth="1.8" strokeLinecap="round"/>
      <circle cx="12" cy="16" r="1.5" fill={active ? '#185FA5' : '#9ca3af'}/>
    </svg>
  )
}

function UserIcon({ active }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="8" r="4"
        stroke={active ? '#185FA5' : '#9ca3af'} strokeWidth="1.8"
        fill={active ? '#E6F1FB' : 'none'}/>
      <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"
        stroke={active ? '#185FA5' : '#9ca3af'} strokeWidth="1.8" strokeLinecap="round"/>
    </svg>
  )
}
