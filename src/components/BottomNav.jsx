import { useNavigate, useLocation } from 'react-router-dom'

export default function BottomNav() {
  const navigate = useNavigate()
  const { pathname } = useLocation()

  const isActive = (path) => pathname === path

  const tabs = [
    {
      key: 'assets',
      label: '맞춤추천',
      icon: LoanIcon,
      active: isActive('/mypage/assets'),
      onClick: () => navigate('/mypage/assets'),
    },
    {
      key: 'checklist',
      label: '체크리스트',
      icon: CheckIcon,
      active: isActive('/checklist'),
      onClick: () => navigate('/checklist'),
    },
    {
      key: 'home',
      label: '홈',
      icon: HomeIcon,
      active: isActive('/'),
      onClick: () => navigate('/'),
    },
    {
      key: 'schedule',
      label: '일정',
      icon: CalendarIcon,
      active: isActive('/schedule'),
      onClick: () => navigate('/schedule'),
    },
    {
      key: 'mypage',
      label: '마이',
      icon: UserIcon,
      active: pathname.startsWith('/mypage'),
      onClick: () => navigate('/mypage'),
    },
  ]

  return (
    <>
      {/* 하단 탭바 */}
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-mobile z-30 bg-white border-t border-gray-100">
        <div className="flex items-center justify-around px-2 py-2">
          {tabs.map(tab => (
            <button
              key={tab.key}
              onClick={tab.onClick}
              className={`flex flex-col items-center gap-0.5 transition-all ${
                tab.key === 'home'
                  ? '-mt-4 bg-[#185FA5] w-14 h-14 rounded-full shadow-lg items-center justify-center'
                  : 'px-3 py-1 rounded-xl'
              }`}
            >
              <tab.icon active={tab.active} home={tab.key === 'home'} />
              {tab.key !== 'home' && (
                <span
                  className="text-[10px] font-medium"
                  style={{ color: tab.active ? '#185FA5' : '#9ca3af' }}
                >
                  {tab.label}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>
    </>
  )
}

function HomeIcon({ home }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path d="M3 9.5L12 3L21 9.5V20a1 1 0 01-1 1H5a1 1 0 01-1-1V9.5z"
        stroke="white" strokeWidth="1.8"
        fill="none" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M9 21V12h6v9" stroke="white" strokeWidth="1.8" strokeLinecap="round"/>
    </svg>
  )
}

function LoanIcon({ active }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z"
        stroke={active ? '#185FA5' : '#9ca3af'} strokeWidth="1.8"
        fill={active ? '#E6F1FB' : 'none'} strokeLinecap="round" strokeLinejoin="round"/>
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
