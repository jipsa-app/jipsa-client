import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Header from '../components/Header'
import CheckItem from '../components/CheckItem'
import { getCheckedItems, toggleChecklistItem } from '../api/auth'

const COLOR = '#185FA5'
const BG = '#E6F1FB'
const TEXT = '#0C447C'
const BORDER = '#A8C8E8'
const TOTAL = 6

const stepTitles = [
  'STEP 1. 예산 설정 & 매물 탐색',
  'STEP 2. 임장 (현장 방문)',
  'STEP 3. 계약 전 서류 확인',
  'STEP 4. 계약 체결',
  'STEP 5. 잔금 지급 & 입주',
  'STEP 6. 전세보증보험 가입',
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
        title="전세 계약 가이드"
        badge="난이도 ★★★★"
        badgeStyle="bg-[#E6F1FB] text-[#185FA5]"
      />
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
      {locked
        ? <LoginGate onLogin={onLogin} color={COLOR} />
        : <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
            <h2 className="font-bold text-base text-gray-900 px-1">{title}</h2>
            {loginBanner}
            {children}
          </div>
      }
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
          className="flex-[2] py-3 rounded-xl text-sm font-semibold text-white disabled:opacity-30"
          style={{ backgroundColor: step === total ? '#d1d5db' : COLOR }}
        >
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
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center justify-between bg-white border border-gray-200 rounded-xl px-4 py-3 hover:border-gray-300 transition-colors"
    >
      <span className="text-sm text-gray-700">{children}</span>
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
        <path d="M2 7H12M8 3L12 7L8 11" stroke="#9ca3af" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    </a>
  )
}

function PrepTag({ children }) {
  return (
    <span className="inline-block bg-[#E6F1FB] text-[#0C447C] border border-[#A8C8E8] text-xs px-3 py-1.5 rounded-full font-medium">
      {children}
    </span>
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

const PREFIX = 'jeonse_'

export default function JeonseGuide() {
  const navigate = useNavigate()
  const [step, setStep] = useState(() => Number(localStorage.getItem('jeonse_step')) || 1)
  const [checks, setChecks] = useState({})
  const [priceInput, setPriceInput] = useState({ senior: '', mine: '', market: '' })
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

  const senior = Number(priceInput.senior) || 0
  const mine = Number(priceInput.mine) || 0
  const market = Number(priceInput.market) || 0
  const riskRatio = market > 0 ? ((senior + mine) / market) * 100 : 0

  const content = {
    1: (
      <div className="space-y-3">
        <div className="bg-white rounded-xl border border-gray-100 p-4 space-y-1">
          <CheckItem checked={!!checks['1a']} onChange={() => toggle('1a')} color={COLOR}>
            보증금 + 이사비 + 초기 관리비 합산으로 예산 설정
          </CheckItem>
          <CheckItem checked={!!checks['1b']} onChange={() => toggle('1b')} color={COLOR}>
            전세대출 가능 여부 사전 확인 (무직·소득 낮으면 대출 불가 사례 주의)
          </CheckItem>
        </div>

        <div className="rounded-xl border p-4 space-y-2" style={{ backgroundColor: BG, borderColor: BORDER }}>
          <div className="flex items-center gap-2">
            <span>💡</span>
            <span className="font-semibold text-sm" style={{ color: TEXT }}>2026년 전세 이자율 참고</span>
          </div>
          <p className="text-sm leading-relaxed" style={{ color: TEXT + 'CC' }}>
            기준금리 + 2% (약 4.5~5%) 수준. 보증금 3억 기준 월 이자 약 112~125만원 수준.
          </p>
        </div>

        <div className="rounded-xl border p-4 space-y-2" style={{ backgroundColor: BG, borderColor: BORDER }}>
          <div className="flex items-center gap-2">
            <span>💰</span>
            <span className="font-semibold text-sm" style={{ color: TEXT }}>중개수수료 계산법</span>
          </div>
          <p className="text-sm leading-relaxed" style={{ color: TEXT + 'CC' }}>
            <b>수수료율</b>: 1억~6억 0.3% / 6억 초과 0.4%<br/>
            예) 전세 2억 → 수수료 0.3% = <b>최대 60만원</b><br/>
            네이버 부동산 수수료 계산기 활용 추천
          </p>
        </div>

        <div className="space-y-2">
          <p className="text-xs text-gray-500 font-medium px-1">매물 탐색 사이트</p>
          <LinkRow href="https://land.naver.com">네이버 부동산</LinkRow>
          <LinkRow href="https://zigbang.com">직방</LinkRow>
          <LinkRow href="https://kbland.kr">KB부동산</LinkRow>
          <LinkRow href="https://www.peterpanz.com">피터팬의 좋은방 구하기</LinkRow>
        </div>
      </div>
    ),

    2: (
      <div className="space-y-3">
        <div className="bg-white rounded-xl border border-gray-100 p-4 space-y-1">
          <CheckItem checked={!!checks['2a']} onChange={() => toggle('2a')} color={COLOR}>
            채광·통풍 확인 (남향 & 맞통풍 여부)
          </CheckItem>
          <CheckItem checked={!!checks['2b']} onChange={() => toggle('2b')} color={COLOR}>
            곰팡이 확인 (벽 모서리·화장실·창문 주변)
          </CheckItem>
          <CheckItem checked={!!checks['2c']} onChange={() => toggle('2c')} color={COLOR}>
            수압·온수 확인 (뜨거운 물 틀어보기)
          </CheckItem>
          <CheckItem checked={!!checks['2d']} onChange={() => toggle('2d')} color={COLOR}>
            난방 방식 확인 (개별난방 권장)
          </CheckItem>
          <CheckItem checked={!!checks['2e']} onChange={() => toggle('2e')} color={COLOR}>
            관리비 항목·금액 확인 (인터넷·주차·청소 포함 여부)
          </CheckItem>
          <CheckItem checked={!!checks['2f']} onChange={() => toggle('2f')} color={COLOR}>
            냄새 확인 (곰팡이·담배·하수구 냄새)
          </CheckItem>
          <CheckItem checked={!!checks['2g']} onChange={() => toggle('2g')} color={COLOR}>
            CCTV 위치 및 작동 여부 확인
          </CheckItem>
        </div>
        <WarningBanner>
          건물 주변 공실이 많으면 임대 수요가 낮은 지역일 수 있어요. 만기 후 보증금 반환이 어려울 수 있습니다.
        </WarningBanner>
      </div>
    ),

    3: (
      <div className="space-y-3">
        <div className="flex gap-2 items-start bg-[#FCEBEB] border border-[#F5BABA] rounded-xl px-4 py-3">
          <span className="text-base flex-shrink-0">🚨</span>
          <p className="text-sm font-semibold text-[#791F1F] leading-relaxed">
            계약 전 서류 확인 — 전세사기의 90%는 여기서 예방 가능합니다.
          </p>
        </div>

        <div className="bg-[#FCEBEB] border border-[#F5BABA] rounded-xl p-4 space-y-2">
          <div className="flex items-center gap-2">
            <span>📋</span>
            <span className="font-semibold text-sm text-[#791F1F]">등기부등본 확인 필수 (700원)</span>
          </div>
          <div className="text-xs text-[#791F1F]/80 space-y-1 pl-6">
            <p>• <b>갑구</b> — 집주인 이름 신분증과 대조</p>
            <p>• <b>을구</b> — 근저당·전세권 합산 금액 확인</p>
          </div>
          <a href="https://www.iros.go.kr" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-xs text-[#E24B4A] font-medium mt-1">
            → 인터넷등기소 바로가기
          </a>
        </div>

        {/* 깡통전세 계산기 */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 space-y-3">
          <p className="font-semibold text-sm text-gray-800">🧮 깡통전세 위험도 계산</p>
          <p className="text-xs text-gray-500">(선순위 채권 + 내 보증금) ÷ 집 시세 · 80% 초과 시 위험</p>
          {[
            { key: 'senior', label: '선순위 채권 합계', ph: '예) 5000' },
            { key: 'mine',   label: '내 보증금',       ph: '예) 20000' },
            { key: 'market', label: '집 시세',          ph: '예) 30000' },
          ].map(({ key, label, ph }) => (
            <div key={key} className="flex items-center gap-2">
              <label className="text-xs text-gray-500 w-28 flex-shrink-0">{label}</label>
              <div className="relative flex-1">
                <input
                  type="number"
                  inputMode="numeric"
                  value={priceInput[key]}
                  onChange={(e) => setPriceInput((p) => ({ ...p, [key]: e.target.value }))}
                  placeholder={ph}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm pr-8 focus:outline-none focus:border-[#185FA5]"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">만원</span>
              </div>
            </div>
          ))}
          {market > 0 && (
            <div className={`rounded-lg px-3 py-2 text-sm font-semibold ${riskRatio > 80 ? 'bg-[#FCEBEB] text-[#791F1F]' : 'bg-[#EAF3DE] text-[#27500A]'}`}>
              비율: {riskRatio.toFixed(1)}% {riskRatio > 80 ? '⚠️ 위험! 계약 재검토 권장' : '✅ 안전 범위'}
            </div>
          )}
        </div>

        <div className="bg-white rounded-xl border border-gray-100 p-4 space-y-1">
          <CheckItem checked={!!checks['3a']} onChange={() => toggle('3a')} color={COLOR}>
            임대인 세금체납·악성임대인 여부 조회 (안심전세 앱)
          </CheckItem>
          <CheckItem checked={!!checks['3b']} onChange={() => toggle('3b')} color={COLOR}>
            다가구주택 — 선순위 세입자 총 보증금 합산 확인
          </CheckItem>
          <CheckItem checked={!!checks['3c']} onChange={() => toggle('3c')} color={COLOR}>
            HUG 전세보증보험 가입 가능 여부 사전 확인
          </CheckItem>
        </div>

        <LinkRow href="https://www.khug.or.kr/jeonse/web/s01/s010102.jsp">안심전세 앱 — 임대인 세금체납·악성이력 조회</LinkRow>

        <div className="bg-[#E6F1FB] border border-[#A8C8E8] rounded-xl p-4">
          <p className="text-xs font-bold text-[#0C447C] mb-2">💡 가계약 주의사항</p>
          <p className="text-sm text-[#0C447C]/80 leading-relaxed">
            가계약금(10~50만원)은 본계약 포기 시 돌려받기 어려워요. 반드시 등기부등본·깡통전세 계산 후 진행하세요!
          </p>
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
            계약금은 임대인 본인 명의 계좌로만 송금
          </CheckItem>
        </div>
        <div className="bg-[#E6F1FB] border border-[#A8C8E8] rounded-xl p-4">
          <p className="text-xs font-bold text-[#0C447C] uppercase tracking-wide mb-3">✍️ 특약 필수 3가지</p>
          <ol className="space-y-2">
            {[
              '잔금일 전 소유권 이전·근저당 설정 금지',
              '전세보증보험 가입 협조 의무',
              '입주 전 배·수관 이상 시 조건 명시',
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-[#0C447C]">
                <span className="font-bold flex-shrink-0">{i + 1}.</span>
                <span>"{item}"</span>
              </li>
            ))}
          </ol>
        </div>
      </div>
    ),

    5: (
      <div className="space-y-3">
        <WarningBanner icon="⏰">
          잔금 당일 — 이체 전에 등기부등본을 재발급해서 신규 근저당이 없는지 확인하세요!
        </WarningBanner>

        <div className="flex gap-2 items-start bg-[#FCEBEB] border border-[#F5BABA] rounded-xl px-4 py-3">
          <span className="text-base flex-shrink-0">⚠️</span>
          <p className="text-sm text-[#791F1F] leading-relaxed">
            전입신고는 이사 당일 해도 <b>대항력은 다음날 0시</b>부터 생겨요. 이 틈에 집주인이 근저당을 설정하는 경우가 있으니 계약서 특약에 "전입신고일 다음날까지 등기 현 상태 유지" 반드시 명시하세요!
          </p>
        </div>

        <CompleteCard items={[
          { title: '등기부등본 재확인', desc: '잔금 이체 직전 최종 확인 (온라인 가능)' },
          { title: '잔금 이체', desc: '임대인 본인 명의 계좌 · 이체확인증 보관' },
          { title: '이전 영수증 수령', desc: '열쇠·카드키·관리비 정산 영수증 포함' },
        ]} />

        <div className="bg-white rounded-xl border border-gray-100 p-4">
          <p className="font-semibold text-sm text-gray-800 mb-3">입주 당일 처리 목록</p>
          <div className="space-y-2">
            {[
              { title: '전입신고', desc: '주민센터 or 정부24 · 무료' },
              { title: '확정일자', desc: '주민센터 · 600원' },
              { title: '전월세 신고', desc: '보증금 6천만원 초과 or 월세 30만원 초과 시 의무 · 30일 이내 · 미신고 과태료 최대 30만원' },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3 text-sm">
                <span className="w-5 h-5 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0" style={{ backgroundColor: COLOR }}>
                  {i + 1}
                </span>
                <div>
                  <span className="font-medium text-gray-800">{item.title}</span>
                  <span className="text-gray-500 ml-2 text-xs">{item.desc}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    ),

    6: (
      <div className="space-y-3">
        <div className="bg-[#EAF3DE] border border-[#B0D48A] rounded-xl p-4 space-y-2">
          <div className="flex items-center gap-2">
            <span>🛡️</span>
            <span className="font-semibold text-sm text-[#27500A]">전세보증보험 가입 (강력 권장)</span>
          </div>
          <p className="text-sm text-[#27500A]/80 leading-relaxed">
            집주인이 보증금을 돌려주지 않으면 HUG가 대신 지급해줍니다. 연 보증금의 0.1~0.4% 수준.
          </p>
        </div>

        <div className="space-y-2">
          <p className="text-xs text-gray-500 font-medium px-1">가입처</p>
          <LinkRow href="https://www.khug.or.kr">HUG 주택도시보증공사</LinkRow>
          <LinkRow href="https://www.hf.go.kr">HF 한국주택금융공사</LinkRow>
          <LinkRow href="https://www.sgic.co.kr">SGI 서울보증</LinkRow>
        </div>

        <div className="rounded-xl border p-4 space-y-2" style={{ backgroundColor: BG, borderColor: BORDER }}>
          <div className="flex items-center gap-2">
            <span>🛡️</span>
            <span className="font-semibold text-sm" style={{ color: TEXT }}>최우선변제권 — 소액임차인 보호</span>
          </div>
          <p className="text-sm leading-relaxed" style={{ color: TEXT + 'CC' }}>
            확정일자 없이도 경매 시 일부 보증금을 최우선으로 돌려받을 수 있어요.<br/><br/>
            <b>2026년 기준 소액임차인 범위</b><br/>
            • 서울: 보증금 <b>1억 6,500만원 이하</b><br/>
            • 과밀억제권역(경기 일부): 1억 4,500만원 이하<br/>
            • 광역시: 8,500만원 이하<br/>
            • 그 외 지역: 7,500만원 이하
          </p>
        </div>

        <div className="bg-[#EAF3DE] border border-[#B0D48A] rounded-xl p-5 text-center mt-2">
          <div className="text-3xl mb-2">🎉</div>
          <p className="font-bold text-[#27500A]">전세 계약 완료!</p>
          <p className="text-sm text-[#639922] mt-1">모든 단계를 마쳤어요. 새 집에서 행복하세요!</p>
        </div>
      </div>
    ),
  }

  return (
    <StepLayout
      step={step}
      total={TOTAL}
      title={stepTitles[step - 1]}
      onPrev={() => setStep((s) => { const n = Math.max(1, s - 1); localStorage.setItem('jeonse_step', n); return n })}
      onNext={() => setStep((s) => { const n = Math.min(TOTAL, s + 1); localStorage.setItem('jeonse_step', n); return n })}
      loginBanner={loginBanner}
      isLoggedIn={isLoggedIn}
      onLogin={() => navigate('/login')}
    >
      {content[step]}
    </StepLayout>
  )
}
