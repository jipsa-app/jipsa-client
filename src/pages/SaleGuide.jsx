import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Header from '../components/Header'
import CheckItem from '../components/CheckItem'
import TaxCalculator from '../components/TaxCalculator'
import { getCheckedItems, toggleChecklistItem } from '../api/auth'

const COLOR = '#534AB7'
const BG = '#EEEDFE'
const TEXT = '#3C3489'
const BORDER = '#B8B4E8'
const TOTAL = 7

const stepTitles = [
  'STEP 1. 예산 설정 & 대출 사전 확인',
  'STEP 2. 시세 조사 & 매물 탐색',
  'STEP 3. 계약 전 서류 확인',
  'STEP 4. 계약 체결',
  'STEP 5. 중도금 지급',
  'STEP 6. 잔금 지급 & 소유권 이전 등기',
  'STEP 7. 입주 후 처리',
]

function LoginGate({ onLogin, color }) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center px-6 py-16 text-center">
      <div className="text-5xl mb-4">🔒</div>
      <p className="font-bold text-gray-800 text-lg mb-2">로그인이 필요해요</p>
      <p className="text-sm text-gray-500 mb-8 leading-relaxed">
        3단계부터는 중요한 서류·계약 내용이 포함돼요.<br/>
        로그인하면 체크 기록도 저장돼요!
      </p>
      <button
        onClick={onLogin}
        className="w-full max-w-xs py-3.5 rounded-xl text-sm font-semibold text-white"
        style={{ backgroundColor: color }}
      >
        로그인하고 계속하기
      </button>
    </div>
  )
}

function StepLayout({ step, total, title, children, onPrev, onNext, loginBanner, isLoggedIn, onLogin }) {
  const locked = step >= 3 && !isLoggedIn

  return (
    <div className="mx-auto max-w-mobile min-h-screen flex flex-col bg-gray-50">
      <Header
        title="매매 계약 가이드"
        badge="난이도 ★★★★★"
        badgeStyle="bg-[#EEEDFE] text-[#534AB7]"
      />
      <div className="bg-white px-4 pt-3 pb-0">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-gray-500">STEP {step} / {total}</span>
          <span className="text-xs font-semibold" style={{ color: COLOR }}>{Math.round((step / total) * 100)}%</span>
        </div>
        <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
          <div className="h-full rounded-full transition-all duration-500" style={{ width: `${(step / total) * 100}%`, backgroundColor: COLOR }} />
        </div>
        <div className="flex items-center gap-0 mt-3 mb-1 pb-3">
          {Array.from({ length: total }, (_, i) => {
            const s = i + 1
            const done = s < step
            const current = s === step
            return (
              <div key={s} className="flex-1 flex flex-col items-center relative">
                {i > 0 && (
                  <div className="absolute top-3 right-1/2 w-full h-0.5" style={{ backgroundColor: done || current ? COLOR : '#e5e7eb' }} />
                )}
                <div
                  className="w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold z-10 transition-all"
                  style={{
                    backgroundColor: done ? COLOR : current ? COLOR : '#e5e7eb',
                    color: done || current ? 'white' : '#9ca3af',
                    transform: current ? 'scale(1.2)' : 'scale(1)',
                  }}
                >
                  {done ? '✓' : s >= 3 && !isLoggedIn ? '🔒' : s}
                </div>
              </div>
            )
          })}
        </div>
      </div>
      {locked
        ? <LoginGate onLogin={onLogin} color={COLOR} />
        : <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
            <h2 className="font-bold text-base text-gray-900 px-1">{title}</h2>
            {loginBanner}
            {children}
          </div>
      }
      <div className="sticky bottom-0 bg-white border-t border-gray-100 px-4 py-3 flex gap-2">
        <button onClick={onPrev} disabled={step === 1} className="flex-1 py-3 rounded-xl text-sm font-semibold border border-gray-200 text-gray-600 disabled:opacity-30">이전</button>
        <button onClick={onNext} disabled={step === total} className="flex-[2] py-3 rounded-xl text-sm font-semibold text-white disabled:opacity-30" style={{ backgroundColor: step === total ? '#d1d5db' : COLOR }}>
          {step === total ? '완료 🎉' : '다음 단계'}
        </button>
      </div>
    </div>
  )
}

function WarningBanner({ icon = '⚠️', children }) {
  return (
    <div className="flex gap-2 items-start bg-[#FCEBEB] border border-[#F5BABA] rounded-xl px-4 py-3">
      <span className="text-base flex-shrink-0">{icon}</span>
      <p className="text-sm text-[#791F1F] leading-relaxed">{children}</p>
    </div>
  )
}

function LinkRow({ href, children }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between bg-white border border-gray-200 rounded-xl px-4 py-3 hover:border-gray-300 transition-colors">
      <span className="text-sm text-gray-700">{children}</span>
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
        <path d="M2 7H12M8 3L12 7L8 11" stroke="#9ca3af" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    </a>
  )
}

function PrepTag({ children }) {
  return (
    <span className="inline-block bg-[#EEEDFE] text-[#3C3489] border border-[#B8B4E8] text-xs px-3 py-1.5 rounded-full font-medium">
      {children}
    </span>
  )
}

function CompleteCard({ items }) {
  return (
    <div className="space-y-2">
      {items.map((item, i) => (
        <div key={i} className="bg-[#EAF3DE] border border-[#B0D48A] rounded-xl px-4 py-3 flex items-start gap-3">
          <span className="w-5 h-5 bg-[#639922] rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0 mt-0.5">{i + 1}</span>
          <div>
            <p className="font-semibold text-sm text-[#27500A]">{item.title}</p>
            {item.desc && <p className="text-xs text-[#639922] mt-0.5">{item.desc}</p>}
          </div>
        </div>
      ))}
    </div>
  )
}

const PREFIX = 'sale_'

export default function SaleGuide() {
  const navigate = useNavigate()
  const [step, setStep] = useState(() => Number(localStorage.getItem('sale_step')) || 1)
  const [checks, setChecks] = useState({})
  const [showCalc, setShowCalc] = useState(false)
  const isLoggedIn = !!localStorage.getItem('token')

  const loginBanner = !isLoggedIn && (
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
  )

  useEffect(() => {
    if (!isLoggedIn) return
    getCheckedItems().then(res => {
      const map = {}
      res.data.filter(id => id.startsWith(PREFIX))
        .forEach(id => { map[id.slice(PREFIX.length)] = true })
      setChecks(map)
    }).catch(() => {})
  }, [])

  const toggle = async (key) => {
    if (isLoggedIn) await toggleChecklistItem(PREFIX + key).catch(() => {})
    setChecks((c) => ({ ...c, [key]: !c[key] }))
  }

  const content = {
    1: (
      <div className="space-y-3">
        <div className="bg-white rounded-xl border border-gray-100 p-4 space-y-1">
          <CheckItem checked={!!checks['1a']} onChange={() => toggle('1a')} color={COLOR}>
            자기자본 + 대출 한도 합산으로 예산 설정
          </CheckItem>
          <CheckItem checked={!!checks['1b']} onChange={() => toggle('1b')} color={COLOR}>
            DSR 확인 — 연 소득의 40% 이내 (원리금 기준)
          </CheckItem>
        </div>

        <div className="rounded-xl border p-4 space-y-2" style={{ backgroundColor: BG, borderColor: BORDER }}>
          <div className="flex items-center gap-2">
            <span>📌</span>
            <span className="font-semibold text-sm" style={{ color: TEXT }}>2026년 대출 규제</span>
          </div>
          <p className="text-sm leading-relaxed" style={{ color: TEXT + 'CC' }}>
            스트레스 DSR 2단계 적용 · 투기과열지구 LTV 40~50%. 사전 은행 상담 필수.
          </p>
        </div>

        <div className="space-y-2">
          <p className="text-xs text-gray-500 font-medium px-1">시세 조사 사이트</p>
          <LinkRow href="https://hogangnono.com">호갱노노</LinkRow>
          <LinkRow href="https://kbland.kr">KB부동산</LinkRow>
          <LinkRow href="https://rt.molit.go.kr">국토부 실거래가</LinkRow>
        </div>

        <button onClick={() => setShowCalc(true)} className="w-full py-3 rounded-xl text-sm font-semibold text-white" style={{ backgroundColor: COLOR }}>
          🧮 취득세·비용 계산기 열기
        </button>
        {showCalc && <TaxCalculator onClose={() => setShowCalc(false)} />}
      </div>
    ),

    2: (
      <div className="space-y-3">
        <div className="bg-white rounded-xl border border-gray-100 p-4 space-y-1">
          <CheckItem checked={!!checks['2a']} onChange={() => toggle('2a')} color={COLOR}>
            국토부 실거래가에서 최근 6개월 거래가 확인
          </CheckItem>
          <CheckItem checked={!!checks['2b']} onChange={() => toggle('2b')} color={COLOR}>
            KB시세 확인 (은행 담보대출 산정 기준)
          </CheckItem>
          <CheckItem checked={!!checks['2c']} onChange={() => toggle('2c')} color={COLOR}>
            호갱노노로 단지별 가격 흐름 탐색
          </CheckItem>
        </div>

        <WarningBanner>
          서울 아파트 2025년 상승률 11.26% — 전국 평균(1.22%)의 약 10배. 급등 단지는 추격 매수 전 신중히 검토하세요.
        </WarningBanner>

        <div className="space-y-2">
          <LinkRow href="https://land.naver.com">네이버 부동산</LinkRow>
          <LinkRow href="https://zigbang.com">직방</LinkRow>
        </div>
      </div>
    ),

    3: (
      <div className="space-y-3">
        <div className="flex gap-2 items-start bg-[#FCEBEB] border border-[#F5BABA] rounded-xl px-4 py-3">
          <span className="text-base flex-shrink-0">🚨</span>
          <p className="text-sm font-semibold text-[#791F1F] leading-relaxed">
            등기부등본은 3번 확인 — 계약 직전 · 중도금 전 · 잔금 당일
          </p>
        </div>

        <div className="bg-[#FCEBEB] border border-[#F5BABA] rounded-xl p-4 space-y-2">
          <div className="flex items-center gap-2">
            <span>📋</span>
            <span className="font-semibold text-sm text-[#791F1F]">등기부등본 확인 필수 (700원)</span>
          </div>
          <div className="text-xs text-[#791F1F]/80 space-y-1 pl-6">
            <p>• 갑구 소유자 = 매도인 신분증 이름 일치</p>
            <p>• 을구 근저당 — 잔금 전 말소 여부 확인</p>
          </div>
          <a href="https://www.iros.go.kr" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-xs text-[#E24B4A] font-medium mt-1">→ 인터넷등기소 바로가기</a>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 p-4 space-y-1">
          <CheckItem checked={!!checks['3a']} onChange={() => toggle('3a')} color={COLOR}>
            건축물대장 확인 (정부24 무료) — 면적·위반건축물 여부
          </CheckItem>
          <CheckItem checked={!!checks['3b']} onChange={() => toggle('3b')} color={COLOR}>
            공인중개사 등록 여부 조회
          </CheckItem>
        </div>
        <LinkRow href="https://www.onnara.go.kr">국가공간정보포털 (건축물대장)</LinkRow>
      </div>
    ),

    4: (
      <div className="space-y-3">
        <div>
          <p className="text-xs text-gray-500 font-medium px-1 mb-2">준비물</p>
          <div className="flex flex-wrap gap-2">
            {['신분증', '도장', '계약금 (매매가 10%)', '매수인 등기권리증'].map((t) => <PrepTag key={t}>{t}</PrepTag>)}
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-4 space-y-1">
          <CheckItem checked={!!checks['4a']} onChange={() => toggle('4a')} color={COLOR}>
            계약금은 매도인 본인 명의 계좌로만 송금
          </CheckItem>
          <CheckItem checked={!!checks['4b']} onChange={() => toggle('4b')} color={COLOR}>
            이체확인증 보관 (2026년부터 거래 신고 전 잔금 증빙 의무)
          </CheckItem>
        </div>
        <div className="bg-[#EEEDFE] border border-[#B8B4E8] rounded-xl p-4">
          <p className="text-xs font-bold text-[#3C3489] uppercase tracking-wide mb-3">📝 자금조달계획서</p>
          <p className="text-sm text-[#3C3489]/80 leading-relaxed">
            투기과열지구 3억 이상 · 조정대상지역 일부 거래 시 제출 의무. 자기자금 출처 항목을 정확히 기재하세요.
          </p>
        </div>
      </div>
    ),

    5: (
      <div className="space-y-3">
        <div className="rounded-xl border p-4" style={{ backgroundColor: BG, borderColor: BORDER }}>
          <p className="font-semibold text-sm mb-1" style={{ color: TEXT }}>중도금이란?</p>
          <p className="text-sm leading-relaxed" style={{ color: TEXT + 'CC' }}>
            보통 매매가의 10~20%. 계약금과 잔금 사이 지급. 시공 진행 확인 후 이체.
          </p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-4 space-y-1">
          <CheckItem checked={!!checks['5a']} onChange={() => toggle('5a')} color={COLOR}>
            중도금 지급 전 등기부등본 재발급 (신규 근저당 없는지 확인)
          </CheckItem>
          <CheckItem checked={!!checks['5b']} onChange={() => toggle('5b')} color={COLOR}>
            대출 실행 일정과 잔금일 사전 조율
          </CheckItem>
        </div>
        <WarningBanner>
          계약금·중도금·잔금 이체확인증은 모두 보관하세요. 추후 양도세 신고 및 분쟁 해결에 필요합니다.
        </WarningBanner>
      </div>
    ),

    6: (
      <div className="space-y-3">
        <WarningBanner icon="⏰">
          잔금 당일 — 이체 전 등기부등본 최종 확인 후 잔금 이체, 즉시 소유권 이전 등기 신청하세요.
        </WarningBanner>

        <CompleteCard items={[
          { title: '등기부등본 최종 확인', desc: '잔금 이체 직전 (온라인 즉시 발급)' },
          { title: '잔금 이체', desc: '매도인 본인 명의 계좌 · 이체확인증 보관' },
          { title: '소유권 이전 등기 신청', desc: '법무사 대리 신청 권장' },
          { title: '이전 영수증 수령', desc: '열쇠·관리비 정산 포함' },
        ]} />

        <div className="rounded-xl border p-4 space-y-2" style={{ backgroundColor: BG, borderColor: BORDER }}>
          <p className="font-semibold text-sm" style={{ color: TEXT }}>취득세 납부 안내</p>
          <p className="text-sm leading-relaxed" style={{ color: TEXT + 'CC' }}>
            잔금일로부터 <b>60일 이내</b> 납부 의무. 지연 시 가산세 부과. 관할 구청 세무과 방문 또는 위택스(wetax) 온라인 납부 가능.
          </p>
        </div>
      </div>
    ),

    7: (
      <div className="space-y-3">
        <CompleteCard items={[
          { title: '전입신고', desc: '주민센터 or 정부24 · 이사 당일' },
          { title: '부동산 거래 신고', desc: '계약 후 30일 이내 · 공인중개사가 대행' },
          { title: '자동차 주민등록지 변경', desc: '관할 구청 또는 차량등록사업소' },
        ]} />

        <div className="rounded-xl border p-5 text-center mt-2" style={{ backgroundColor: BG, borderColor: BORDER }}>
          <div className="text-3xl mb-2">🎉</div>
          <p className="font-bold" style={{ color: TEXT }}>매매 계약 완료!</p>
          <p className="text-sm mt-1" style={{ color: COLOR }}>모든 단계를 마쳤어요. 내 집 마련 축하드립니다!</p>
        </div>
      </div>
    ),
  }

  return (
    <StepLayout
      step={step}
      total={TOTAL}
      title={stepTitles[step - 1]}
      onPrev={() => setStep((s) => { const n = Math.max(1, s - 1); localStorage.setItem('sale_step', n); return n })}
      onNext={() => setStep((s) => { const n = Math.min(TOTAL, s + 1); localStorage.setItem('sale_step', n); return n })}
      loginBanner={loginBanner}
      isLoggedIn={isLoggedIn}
      onLogin={() => navigate('/login')}
    >
      {content[step]}
    </StepLayout>
  )
}
