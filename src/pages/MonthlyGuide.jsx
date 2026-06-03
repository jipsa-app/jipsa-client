import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Header from '../components/Header'
import CheckItem from '../components/CheckItem'
import MonthlyCalculator from '../components/MonthlyCalculator'
import { getCheckedItems, toggleChecklistItem } from '../api/auth'

const COLOR = '#BA7517'
const BG = '#FAEEDA'
const TEXT = '#633806'

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

function StepLayout({ step, total, title, children, onPrev, onNext, loginBanner, isLoggedIn, onLogin, color }) {
  const locked = step >= 3 && !isLoggedIn

  return (
    <div className="mx-auto max-w-mobile min-h-screen flex flex-col bg-gray-50">
      <Header
        title="월세 계약 가이드"
        badge={`난이도 ★★`}
        badgeStyle="bg-[#FAEEDA] text-[#BA7517]"
      />

      {/* 진행바 */}
      <div className="bg-white px-4 pt-3 pb-0">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-gray-500">STEP {step} / {total}</span>
          <span className="text-xs font-semibold" style={{ color: COLOR }}>{Math.round((step / total) * 100)}%</span>
        </div>
        <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{ width: `${(step / total) * 100}%`, backgroundColor: COLOR }}
          />
        </div>

        {/* 타임라인 */}
        <div className="flex items-center gap-0 mt-3 mb-1 pb-3">
          {Array.from({ length: total }, (_, i) => {
            const s = i + 1
            const done = s < step
            const current = s === step
            return (
              <div key={s} className="flex-1 flex flex-col items-center relative">
                {i > 0 && (
                  <div
                    className="absolute top-3 right-1/2 w-full h-0.5"
                    style={{ backgroundColor: done || current ? COLOR : '#e5e7eb' }}
                  />
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

      {/* 콘텐츠 */}
      {locked
        ? <LoginGate onLogin={onLogin} color={COLOR} />
        : <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
            <h2 className="font-bold text-base text-gray-900 px-1">{title}</h2>
            {loginBanner}
            {children}
          </div>
      }

      {/* 이전/다음 버튼 */}
      <div className="sticky bottom-0 bg-white border-t border-gray-100 px-4 py-3 flex gap-2">
        <button
          onClick={onPrev}
          disabled={step === 1}
          className="flex-1 py-3 rounded-xl text-sm font-semibold border border-gray-200 text-gray-600 disabled:opacity-30"
        >
          이전
        </button>
        <button
          onClick={onNext}
          disabled={step === total}
          className="flex-2 flex-[2] py-3 rounded-xl text-sm font-semibold text-white disabled:opacity-30"
          style={{ backgroundColor: step === total ? '#d1d5db' : COLOR }}
        >
          {step === total ? '완료 🎉' : '다음 단계'}
        </button>
      </div>
    </div>
  )
}

function WarningBanner({ children }) {
  return (
    <div className="flex gap-2 items-start bg-[#FCEBEB] border border-[#F5BABA] rounded-xl px-4 py-3">
      <span className="text-base flex-shrink-0">⚠️</span>
      <p className="text-sm text-[#791F1F] leading-relaxed">{children}</p>
    </div>
  )
}

function InfoCard({ color, bg, border, icon, title, children }) {
  return (
    <div className="rounded-xl border p-4 space-y-2" style={{ backgroundColor: bg, borderColor: border }}>
      <div className="flex items-center gap-2">
        <span>{icon}</span>
        <span className="font-semibold text-sm" style={{ color }}>{title}</span>
      </div>
      <div className="text-sm leading-relaxed" style={{ color: color + 'CC' }}>{children}</div>
    </div>
  )
}

function LinkRow({ href, children }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center justify-between bg-white border border-gray-200 rounded-xl px-4 py-3 hover:border-gray-300 transition-colors"
    >
      <span className="text-sm text-gray-700">{children}</span>
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
        <path d="M2 7H12M8 3L12 7L8 11" stroke="#9ca3af" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M12 2H9M12 2V5M12 2L8.5 5.5" stroke="#9ca3af" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    </a>
  )
}

function PrepTag({ children }) {
  return (
    <span className="inline-block bg-[#FAEEDA] text-[#633806] border border-[#E8C88A] text-xs px-3 py-1.5 rounded-full font-medium">
      {children}
    </span>
  )
}

function SpecialCard({ items }) {
  return (
    <div className="bg-[#FAEEDA] border border-[#E8C88A] rounded-xl p-4">
      <p className="text-xs font-bold text-[#633806] uppercase tracking-wide mb-3">✍️ 특약 필수 3가지</p>
      <ol className="space-y-2">
        {items.map((item, i) => (
          <li key={i} className="flex items-start gap-2 text-sm text-[#633806]">
            <span className="font-bold flex-shrink-0">{i + 1}.</span>
            <span>"{item}"</span>
          </li>
        ))}
      </ol>
    </div>
  )
}

function CompleteCard({ items }) {
  return (
    <div className="space-y-2">
      {items.map((item, i) => (
        <div key={i} className="bg-[#EAF3DE] border border-[#B0D48A] rounded-xl px-4 py-3 flex items-start gap-3">
          <span className="w-5 h-5 bg-[#639922] rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0 mt-0.5">
            {i + 1}
          </span>
          <div>
            <p className="font-semibold text-sm text-[#27500A]">{item.title}</p>
            {item.desc && <p className="text-xs text-[#639922] mt-0.5">{item.desc}</p>}
          </div>
        </div>
      ))}
    </div>
  )
}

const TOTAL = 5

const stepTitles = [
  'STEP 1. 예산 설정 & 매물 탐색',
  'STEP 2. 임장 (현장 방문)',
  'STEP 3. 계약 전 서류 확인',
  'STEP 4. 계약 체결',
  'STEP 5. 입주 & 이사 처리',
]

const PREFIX = 'monthly_'

export default function MonthlyGuide() {
  const navigate = useNavigate()
  const [step, setStep] = useState(() => Number(localStorage.getItem('monthly_step')) || 1)
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
            월세 + 관리비 + 공과금 합산으로 월 예산 설정
          </CheckItem>
          <CheckItem checked={!!checks['1b']} onChange={() => toggle('1b')} color={COLOR}>
            보증금 마련 여부 확인 (통장 잔액 및 부모 지원 여부)
          </CheckItem>
        </div>

        <InfoCard color="#BA7517" bg="#FAEEDA" border="#E8C88A" icon="💡" title="2026년 서울 평균 월세 참고">
          원룸·다세대 <b>85.6만원</b> / 오피스텔 <b>83만원</b><br/>
          (출처: 국토부 실거래가 기준)
        </InfoCard>

        <div className="space-y-2">
          <p className="text-xs text-gray-500 font-medium px-1">매물 탐색 사이트</p>
          <LinkRow href="https://land.naver.com">네이버 부동산</LinkRow>
          <LinkRow href="https://zigbang.com">직방</LinkRow>
          <LinkRow href="https://dabangapp.com">다방</LinkRow>
        </div>

        <button
          onClick={() => setShowCalc(true)}
          className="w-full py-3 rounded-xl text-sm font-semibold text-white"
          style={{ backgroundColor: COLOR }}
        >
          📊 월 지출 계산기 열기
        </button>
        {showCalc && <MonthlyCalculator onClose={() => setShowCalc(false)} />}
      </div>
    ),

    2: (
      <div className="space-y-3">
        <div className="bg-white rounded-xl border border-gray-100 p-4 space-y-1">
          <CheckItem checked={!!checks['2a']} onChange={() => toggle('2a')} color={COLOR}>
            곰팡이·냄새·채광·방음 직접 확인 (여러 시간대 방문 권장)
          </CheckItem>
          <CheckItem checked={!!checks['2b']} onChange={() => toggle('2b')} color={COLOR}>
            관리비 항목·금액 확인 (인터넷·주차·청소 포함 여부)
          </CheckItem>
          <CheckItem checked={!!checks['2c']} onChange={() => toggle('2c')} color={COLOR}>
            주변 교통·편의시설 확인 (도보 5분 내 마트·약국 등)
          </CheckItem>
        </div>

        <WarningBanner>
          건물 주변 공실이 많으면 임대 수요가 낮은 지역일 수 있어요. 퇴실 시 다음 세입자 구하기 어려울 수 있습니다.
        </WarningBanner>
      </div>
    ),

    3: (
      <div className="space-y-3">
        <div className="flex gap-2 items-start bg-[#FCEBEB] border border-[#F5BABA] rounded-xl px-4 py-3">
          <span className="text-base flex-shrink-0">🚨</span>
          <p className="text-sm font-semibold text-[#791F1F] leading-relaxed">
            이 단계를 건너뛰다가 전세사기 피해 당하는 경우 많음. 반드시 확인!
          </p>
        </div>

        <div className="bg-[#FCEBEB] border border-[#F5BABA] rounded-xl p-4 space-y-2">
          <div className="flex items-center gap-2">
            <span>📋</span>
            <span className="font-semibold text-sm text-[#791F1F]">등기부등본 확인 필수 (700원)</span>
          </div>
          <div className="text-xs text-[#791F1F]/80 space-y-1 pl-6">
            <p>• <b>표제부</b> — 건물 기본 현황 (면적·층수)</p>
            <p>• <b>갑구</b> — 소유권 (집주인 이름 확인)</p>
            <p>• <b>을구</b> — 근저당·전세권 (빚이 있는지 확인)</p>
          </div>
          <a
            href="https://www.iros.go.kr"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-xs text-[#E24B4A] font-medium mt-1"
          >
            <span>→ 인터넷등기소 바로가기</span>
          </a>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 p-4 space-y-1">
          <CheckItem checked={!!checks['3a']} onChange={() => toggle('3a')} color={COLOR}>
            임대인 신분증과 등기부등본 이름 일치 확인
          </CheckItem>
          <CheckItem checked={!!checks['3b']} onChange={() => toggle('3b')} color={COLOR}>
            공인중개사 등록 여부 조회 (국가공간정보포털)
          </CheckItem>
        </div>
      </div>
    ),

    4: (
      <div className="space-y-3">
        <div>
          <p className="text-xs text-gray-500 font-medium px-1 mb-2">준비물</p>
          <div className="flex flex-wrap gap-2">
            {['신분증', '도장', '계약금 (보증금 10%)', '통장·카드'].map((t) => <PrepTag key={t}>{t}</PrepTag>)}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 p-4 space-y-1">
          <CheckItem checked={!!checks['4a']} onChange={() => toggle('4a')} color={COLOR}>
            계약금은 반드시 임대인 본인 명의 계좌로만 송금
          </CheckItem>
          <CheckItem checked={!!checks['4b']} onChange={() => toggle('4b')} color={COLOR}>
            계약서에 보증금·월세·관리비 금액 명확히 기재 확인
          </CheckItem>
        </div>

        <SpecialCard items={[
          '입주 전 배·수관 교체 (세입자 부담 금지)',
          '퇴실 시 원상복구 임대인 부담 명시',
          '계약 기간 중 보증금 인상 금지',
        ]} />
      </div>
    ),

    5: (
      <div className="space-y-3">
        <div className="flex gap-2 items-start bg-[#FCEBEB] border border-[#F5BABA] rounded-xl px-4 py-3">
          <span className="text-base flex-shrink-0">⏰</span>
          <p className="text-sm font-semibold text-[#791F1F] leading-relaxed">
            전입신고 + 확정일자는 이사 당일! 효력은 다음날 0시부터 발생합니다.
          </p>
        </div>

        <CompleteCard items={[
          { title: '전입신고', desc: '주민센터 or 정부24 · 무료 · 이사 당일 처리' },
          { title: '확정일자', desc: '주민센터 · 600원 · 전입신고 시 함께 신청' },
          { title: '전세보험 신고', desc: '계약 후 30일 이내 · 미신고 시 과태료 100만원' },
        ]} />

        <div className="bg-[#EAF3DE] border border-[#B0D48A] rounded-xl p-5 text-center mt-2">
          <div className="text-3xl mb-2">🎉</div>
          <p className="font-bold text-[#27500A]">월세 계약 완료!</p>
          <p className="text-sm text-[#639922] mt-1">모든 단계를 마쳤어요. 새 집에서 행복하세요!</p>
        </div>
      </div>
    ),
  }

  return (
    <>
      <StepLayout
        step={step}
        total={TOTAL}
        title={stepTitles[step - 1]}
        onPrev={() => setStep((s) => { const n = Math.max(1, s - 1); localStorage.setItem('monthly_step', n); return n })}
        onNext={() => setStep((s) => { const n = Math.min(TOTAL, s + 1); localStorage.setItem('monthly_step', n); return n })}
        loginBanner={loginBanner}
        isLoggedIn={isLoggedIn}
        onLogin={() => navigate('/login')}
        color={COLOR}
      >
        {content[step]}
      </StepLayout>
    </>
  )
}
