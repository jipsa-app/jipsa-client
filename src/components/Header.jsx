import { useNavigate } from 'react-router-dom'

export default function Header({ title, badge, badgeStyle = 'bg-gray-100 text-gray-600', onBack }) {
  const navigate = useNavigate()
  return (
    <header className="sticky top-0 z-20 bg-white border-b border-gray-200 h-[52px] flex items-center px-4 gap-3">
      <button
        onClick={() => onBack ? onBack() : navigate(-1)}
        className="p-1 -ml-1 text-gray-500 hover:text-gray-800 transition-colors"
        aria-label="뒤로 가기"
      >
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path d="M12.5 15L7.5 10L12.5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
      <span className="flex-1 font-semibold text-gray-900 text-[15px]">{title}</span>
      {badge && (
        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${badgeStyle}`}>
          {badge}
        </span>
      )}
    </header>
  )
}
