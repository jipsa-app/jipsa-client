import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Header from '../components/Header'
import Spinner from '../components/Spinner'
import Toast from '../components/Toast'
import { getCheckedItems, toggleChecklistItem } from '../api/auth'

const items = [
  {
    id: 'a',
    icon: '📋',
    title: '등기부등본 갑구·을구 확인 (700원)',
    desc: '인터넷등기소 or 정부24에서 즉시 발급',
    color: '#E24B4A',
    bg: '#FCEBEB',
    border: '#F5BABA',
    url: 'https://www.iros.go.kr',
    urlLabel: '인터넷등기소',
  },
  {
    id: 'b',
    icon: '📊',
    title: '전세가율 80% 이하 확인',
    desc: '(선순위 채권 + 보증금) ÷ 시세 < 80%',
    color: '#E24B4A',
    bg: '#FCEBEB',
    border: '#F5BABA',
  },
  {
    id: 'c',
    icon: '🧾',
    title: '임대인 세금 체납 여부 확인',
    desc: '임사·임차 앱 (HUG) 또는 세금 미납 조회',
    color: '#BA7517',
    bg: '#FAEEDA',
    border: '#E8C88A',
    url: 'https://www.khug.or.kr',
    urlLabel: '임사·임차 앱',
  },
  {
    id: 'd',
    icon: '🏢',
    title: '공인중개사 등록 여부 확인',
    desc: '국가공간정보포털에서 자격증 번호 조회',
    color: '#BA7517',
    bg: '#FAEEDA',
    border: '#E8C88A',
    url: 'https://www.onnara.go.kr',
    urlLabel: '국가공간정보포털',
  },
  {
    id: 'e',
    icon: '🛡️',
    title: '전세보증보험 가입 가능 여부 확인',
    desc: 'HUG·HF·SGI 중 하나에서 사전 확인',
    color: '#185FA5',
    bg: '#E6F1FB',
    border: '#A8C8E8',
    url: 'https://www.khug.or.kr',
    urlLabel: 'HUG 바로가기',
  },
  {
    id: 'f',
    icon: '📅',
    title: '잔금일 당일 등기부등본 재발급',
    desc: '신규 근저당·가압류 없는지 최종 확인',
    color: '#E24B4A',
    bg: '#FCEBEB',
    border: '#F5BABA',
  },
]

export default function Checklist() {
  const navigate = useNavigate()
  const [checked, setChecked] = useState({})
  const [loading, setLoading] = useState(true)
  const [toast, setToast] = useState(null)
  const isLoggedIn = !!localStorage.getItem('token')

  useEffect(() => {
    if (!isLoggedIn) { setLoading(false); return }
    getCheckedItems()
      .then(res => {
        const map = {}
        res.data.forEach(id => { map[id] = true })
        setChecked(map)
      })
      .catch(() => setToast('데이터를 불러오지 못했어요'))
      .finally(() => setLoading(false))
  }, [])

  const toggle = async (id) => {
    const isChecked = !!checked[id]
    // 이미 체크된 항목보다 더 많이 체크 못 하도록 제한
    if (!isChecked && count >= items.length) return

    if (isLoggedIn) {
      try {
        await toggleChecklistItem(id)
      } catch {
        setToast('저장에 실패했어요. 다시 시도해주세요')
        return
      }
    }
    setChecked((c) => ({ ...c, [id]: !c[id] }))
  }

  const reset = async () => {
    if (isLoggedIn) {
      try {
        // 체크된 항목 전부 토글 해제
        const checkedIds = Object.keys(checked).filter(id => checked[id])
        await Promise.all(checkedIds.map(id => toggleChecklistItem(id)))
      } catch {
        setToast('초기화에 실패했어요. 다시 시도해주세요')
        return
      }
    }
    setChecked({})
  }

  const count = Object.values(checked).filter(Boolean).length
  const allDone = count === items.length

  if (loading) return (
    <div className="mx-auto max-w-mobile min-h-screen flex flex-col bg-gray-50">
      <Header title="전세사기 예방 체크리스트" badge="6개 항목" badgeStyle="bg-[#FCEBEB] text-[#E24B4A]" />
      <Spinner color="#E24B4A" />
    </div>
  )

  return (
    <div className="mx-auto max-w-mobile min-h-screen flex flex-col bg-gray-50">
      <Header
        title="전세사기 예방 체크리스트"
        badge="6개 항목"
        badgeStyle="bg-[#FCEBEB] text-[#E24B4A]"
      />
      {toast && <Toast message={toast} onClose={() => setToast(null)} />}

      <div className="px-4 py-5 flex-1 overflow-y-auto space-y-3">
        {/* 비로그인 안내 배너 */}
        {!isLoggedIn && (
          <div className="bg-[#E6F1FB] border border-[#A8C8E8] rounded-xl px-4 py-3 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="text-base">💾</span>
              <p className="text-xs text-[#0C447C]">로그인하면 체크 기록이 저장돼요</p>
            </div>
            <button
              onClick={() => navigate('/login')}
              className="text-xs font-semibold text-white bg-[#185FA5] px-3 py-1.5 rounded-lg flex-shrink-0"
            >
              로그인
            </button>
          </div>
        )}

        {/* 경고 배너 */}
        <div className="bg-[#FCEBEB] border border-[#F5BABA] rounded-xl px-4 py-3 flex items-start gap-2">
          <span className="text-base flex-shrink-0">🚨</span>
          <p className="text-sm text-[#791F1F] leading-relaxed">
            계약 전 아래 항목을 모두 확인해야 전세사기 피해를 예방할 수 있어요.
          </p>
        </div>

        {/* 체크 아이템 */}
        {items.map((item) => {
          const isChecked = !!checked[item.id]
          return (
            <div
              key={item.id}
              className="rounded-xl border p-4 transition-all"
              style={{
                backgroundColor: isChecked ? item.bg : 'white',
                borderColor: isChecked ? item.border : '#e5e7eb',
              }}
            >
              <div className="flex items-start gap-3">
                <button
                  onClick={() => toggle(item.id)}
                  className="w-6 h-6 rounded-full flex-shrink-0 flex items-center justify-center border-2 mt-0.5 transition-all"
                  style={{
                    borderColor: isChecked ? item.color : '#d1d5db',
                    backgroundColor: isChecked ? item.color : 'white',
                  }}
                  aria-checked={isChecked}
                >
                  {isChecked && (
                    <svg width="12" height="10" viewBox="0 0 12 10" fill="none">
                      <path d="M1 5L4.5 8.5L11 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  )}
                </button>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span>{item.icon}</span>
                    <span
                      className={`font-semibold text-sm ${isChecked ? 'line-through' : ''}`}
                      style={{ color: isChecked ? item.color : '#111827' }}
                    >
                      {item.title}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 pl-6">{item.desc}</p>
                  {item.url && !isChecked && (
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs font-medium mt-2 ml-6"
                      style={{ color: item.color }}
                    >
                      → {item.urlLabel}
                    </a>
                  )}
                </div>
              </div>
            </div>
          )
        })}

        {/* 전체 완료 메시지 */}
        {allDone && (
          <div className="bg-[#EAF3DE] border border-[#B0D48A] rounded-xl p-5 text-center">
            <div className="text-3xl mb-2">✅</div>
            <p className="font-bold text-[#27500A]">모든 항목 확인되었어요!</p>
            <p className="text-sm text-[#639922] mt-1">안전한 전세 계약을 위한 준비가 완료됐습니다.</p>
          </div>
        )}
      </div>

      {/* 하단 진행 표시 */}
      <div className="sticky bottom-0 bg-white border-t border-gray-100 px-4 py-3">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-semibold text-gray-700">{count} / {items.length} 완료</span>
          <div className="flex items-center gap-2">
            {count > 0 && (
              <button
                onClick={reset}
                className="text-xs text-gray-400 underline"
              >
                초기화
              </button>
            )}
            <span className="text-sm font-bold" style={{ color: allDone ? '#639922' : '#E24B4A' }}>
              {allDone ? '모두 완료 🎉' : `${items.length - count}개 남음`}
            </span>
          </div>
        </div>
        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{
              width: `${(count / items.length) * 100}%`,
              backgroundColor: allDone ? '#639922' : '#E24B4A',
            }}
          />
        </div>
      </div>
    </div>
  )
}
