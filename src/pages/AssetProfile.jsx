import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Header from '../components/Header'
import BottomNav from '../components/BottomNav'
import { getMe, updateAssetProfileDB } from '../api/auth'

// 대출 상품 추천 로직
function getRecommendations({ type, cash, targetPrice, income, age }) {
  const need = targetPrice - cash  // 필요 대출액 (만원)
  if (need <= 0) return { need: 0, monthly: 0, dsr: 0, products: [], surplus: cash - targetPrice }

  const results = []

  if (type === 'jeonse') {
    // 버팀목 전세자금대출
    const limit = income <= 5000 ? 24000 : income <= 6000 ? 12000 : 0
    const rate = income <= 2000 ? 2.1 : income <= 4000 ? 2.4 : 2.9
    if (limit > 0) {
      results.push({
        name: '버팀목 전세자금대출',
        color: '#185FA5',
        bg: '#E6F1FB',
        eligible: need <= limit,
        limit,
        rate,
        desc: `연소득 ${income <= 5000 ? '5천만원' : '6천만원'} 이하 · 최대 ${limit.toLocaleString()}만원`,
        tip: need > limit ? `⚠️ 한도(${limit.toLocaleString()}만원) 초과 — 추가 자금 준비 필요` : '✅ 조건 충족!',
        url: 'https://nhuf.molit.go.kr/FP/FP05/FP0503/FP05030101.jsp',
        urlLabel: '주택도시기금 바로가기',
      })
    }

    // 청년 전용 전세대출 (만 34세 이하)
    const isYoung = age ? age <= 34 : null // 나이 미입력이면 null
    const youngEligible = isYoung && income <= 5000 && need <= 30000
    const youngTip = isYoung === null
      ? '⚠️ 회원정보에 나이를 입력하면 자동 판단해드려요!'
      : youngEligible ? '✅ 조건 충족!' : age > 34 ? '❌ 만 34세 초과 — 해당 없음' : '⚠️ 소득 조건 확인 필요'
    results.push({
      name: '청년 전용 전세대출',
      color: '#639922',
      bg: '#EAF3DE',
      eligible: !!youngEligible,
      limit: 30000,
      rate: 2.3,
      desc: `만 34세 이하 · 연소득 5천만원 이하 · 최대 3억${age ? ` · 현재 ${age}세` : ''}`,
      tip: youngTip,
      url: 'https://nhuf.molit.go.kr/FP/FP05/FP0503/FP05030201.jsp',
      urlLabel: '청년 전세대출 신청',
    })

    // HUG 전세보증보험
    results.push({
      name: 'HUG 전세보증보험',
      color: '#E24B4A',
      bg: '#FCEBEB',
      eligible: true,
      limit: null,
      rate: null,
      desc: '전세금 미반환 시 HUG가 대신 지급 · 연 보증금의 0.1~0.4%',
      tip: '✅ 전세 계약 시 필수 권장!',
      url: 'https://www.khug.or.kr',
      urlLabel: 'HUG 바로가기',
    })
  }

  if (type === 'sale') {
    // 디딤돌 대출 — 주택가격 5억 이하 조건 체크
    const didiPriceOk = targetPrice <= 50000 // 5억 = 50,000만원
    const didiIncomeOk = income <= 6000
    if (didiIncomeOk) {
      results.push({
        name: '디딤돌 대출',
        color: '#534AB7',
        bg: '#EEEDFE',
        eligible: didiPriceOk && need <= 30000,
        limit: 30000,
        rate: 2.65,
        desc: `연소득 6천만원 이하 · 최대 3억 · 주택가격 5억 이하 · 현재 목표가 ${(targetPrice / 10000).toFixed(1)}억`,
        tip: !didiPriceOk
          ? `❌ 주택가격 ${(targetPrice / 10000).toFixed(1)}억 — 5억 초과로 신청 불가`
          : need <= 30000 ? '✅ 조건 충족!' : '⚠️ 한도(3억) 초과',
        url: 'https://nhuf.molit.go.kr/FP/FP05/FP0502/FP05020101.jsp',
        urlLabel: '디딤돌 대출 신청',
      })
    }

    // 보금자리론 — 주택가격 6억 이하 조건 체크
    const bogumPriceOk = targetPrice <= 60000 // 6억 = 60,000만원
    const bogumLimit = income <= 7000 ? 36000 : 0
    if (bogumLimit > 0) {
      results.push({
        name: '보금자리론',
        color: '#BA7517',
        bg: '#FAEEDA',
        eligible: bogumPriceOk && need <= bogumLimit,
        limit: bogumLimit,
        rate: 3.8,
        desc: `연소득 7천만원 이하 · 최대 3.6억 · 주택가격 6억 이하 · 고정금리`,
        tip: !bogumPriceOk
          ? `❌ 주택가격 ${(targetPrice / 10000).toFixed(1)}억 — 6억 초과로 신청 불가`
          : need <= bogumLimit ? '✅ 조건 충족!' : '⚠️ 한도(3.6억) 초과',
        url: 'https://www.hf.go.kr/hf/sub01/sub01_01_01.do',
        urlLabel: '한국주택금융공사 바로가기',
      })
    }

    // 일반 주담대
    results.push({
      name: '일반 주택담보대출',
      color: '#6B7280',
      bg: '#F3F4F6',
      eligible: true,
      limit: null,
      rate: 4.5,
      desc: '소득·주택가격 제한 없음 · LTV 40~70% · 스트레스 DSR 3단계 적용',
      tip: '⚠️ 스트레스 DSR 3단계 (금리 1.5% 가산) 적용 — 은행 상담 필수',
      url: 'https://www.fss.or.kr/fss/main/main.do',
      urlLabel: '금융감독원 대출 비교',
    })
  }

  // 대표 금리로 월 상환액/DSR 계산 (첫 번째 상품 기준)
  const repRate = results[0]?.rate || (type === 'jeonse' ? 2.5 : 4.0)
  const monthly = Math.round((need * 10000) * (repRate / 100) / 12 / 10000)
  const dsr = income > 0 ? Math.round((monthly * 12 / (income * 10000)) * 100 * 10) / 10 : 0

  return { need, monthly, dsr, products: results, surplus: 0 }
}

export default function AssetProfile() {
  const navigate = useNavigate()
  const isLoggedIn = !!localStorage.getItem('token')

  const saved = JSON.parse(localStorage.getItem('asset_profile') || '{}')
  const [cash, setCash] = useState(saved.cash || '')
  const [income, setIncome] = useState(saved.income || '')
  const [type, setType] = useState(saved.type || 'jeonse')
  const [targetPrice, setTargetPrice] = useState(saved.targetPrice || '')
  const [result, setResult] = useState(saved.result || null)
  const [memberAge, setMemberAge] = useState(null) // DB에서 불러온 나이

  // 로그인 시 DB에서 나이 불러오기 (자산 정보는 localStorage 우선)
  useEffect(() => {
    if (!isLoggedIn) return
    getMe().then(res => {
      if (res.data.age) setMemberAge(res.data.age)
      // localStorage에 데이터가 없을 때만 DB에서 불러오기
      const hasLocal = localStorage.getItem('asset_profile')
      if (!hasLocal && res.data.assetProfile) {
        try {
          const data = JSON.parse(res.data.assetProfile)
          setCash(data.cash || '')
          setIncome(data.income || '')
          setType(data.type || 'jeonse')
          setTargetPrice(data.targetPrice || '')
          if (data.cash && data.income && data.targetPrice) {
            const r = getRecommendations({ type: data.type || 'jeonse', cash: Number(data.cash), targetPrice: Number(data.targetPrice), income: Number(data.income), age: res.data.age })
            setResult(r)
          }
        } catch {}
      }
    }).catch(() => {})
  }, [])

  function handleAnalyze() {
    const c = Number(cash)
    const i = Number(income)
    const t = Number(targetPrice)
    if (!c || !i || !t) return
    const r = getRecommendations({ type, cash: c, targetPrice: t, income: i, age: memberAge })
    setResult(r)
    const profileData = { cash, income, type, targetPrice }
    localStorage.setItem('asset_profile', JSON.stringify({ ...profileData, result: r }))
    if (isLoggedIn) updateAssetProfileDB(profileData).catch(() => {})
  }

  const needAmount = Number(targetPrice) - Number(cash)

  return (
    <div className="mx-auto max-w-mobile min-h-screen bg-gray-50 pb-24">
      <Header title="맞춤 대출 추천" noBack />

      <div className="px-4 py-5 space-y-4">

        {/* 거래 유형 */}
        <div className="space-y-2">
          <p className="text-xs font-semibold text-gray-400 px-1">거래 유형</p>
          <div className="flex gap-2">
            {[
              { key: 'jeonse', label: '🔑 전세', color: '#185FA5', bg: '#E6F1FB' },
              { key: 'sale', label: '🏡 매매', color: '#534AB7', bg: '#EEEDFE' },
            ].map(t => (
              <button
                key={t.key}
                onClick={() => {
                  const newType = t.key
                  setType(newType)
                  // 값이 모두 있으면 자동 재계산
                  if (cash && income && targetPrice) {
                    const r = getRecommendations({ type: newType, cash: Number(cash), targetPrice: Number(targetPrice), income: Number(income), age: memberAge })
                    setResult(r)
                    localStorage.setItem('asset_profile', JSON.stringify({ cash, income, type: newType, targetPrice, result: r }))
                  } else {
                    setResult(null)
                  }
                }}
                className="flex-1 py-3 rounded-xl text-sm font-semibold border transition-all"
                style={{
                  backgroundColor: type === t.key ? t.bg : 'white',
                  borderColor: type === t.key ? t.color : '#e5e7eb',
                  color: type === t.key ? t.color : '#9ca3af',
                }}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* 자산 입력 */}
        <div className="space-y-2">
          <p className="text-xs font-semibold text-gray-400 px-1">내 자산 정보</p>
          <div className="bg-white rounded-2xl border border-gray-100 p-4 space-y-3">
            <AmountInput label="보유 현금" value={cash} onChange={v => { setCash(v); setResult(null) }} placeholder="예) 30000 (만원)" />
            <AmountInput label="연소득" value={income} onChange={v => { setIncome(v); setResult(null) }} placeholder="예) 5000 (만원)" />
          </div>
        </div>

        {/* 목표 주택 */}
        <div className="space-y-2">
          <p className="text-xs font-semibold text-gray-400 px-1">목표 주택</p>
          <div className="bg-white rounded-2xl border border-gray-100 p-4">
            <AmountInput
              label={type === 'jeonse' ? '전세 보증금' : '매매 가격'}
              value={targetPrice}
              onChange={v => { setTargetPrice(v); setResult(null) }}
              placeholder="예) 50000 (만원)"
            />
            {Number(cash) > 0 && Number(targetPrice) > 0 && (
              <div className="mt-3 pt-3 border-t border-gray-50 flex items-center justify-between">
                <span className="text-xs text-gray-400">필요 대출액</span>
                <span className={`text-sm font-bold ${needAmount > 0 ? 'text-[#E24B4A]' : 'text-[#639922]'}`}>
                  {needAmount > 0 ? `${needAmount.toLocaleString()}만원` : '✅ 대출 불필요!'}
                </span>
              </div>
            )}
          </div>
        </div>

        {isLoggedIn && !memberAge && (
          <div className="bg-[#FAEEDA] border border-[#E8C88A] rounded-xl px-4 py-3 flex items-center gap-2">
            <span className="text-sm">💡</span>
            <p className="text-xs text-[#633806] flex-1">
              <span className="font-semibold">나이</span>를 입력하면 청년 대출 조건을 자동으로 판단해드려요!
            </p>
            <button
              onClick={() => navigate('/mypage/edit')}
              className="text-xs font-semibold text-[#BA7517] flex-shrink-0"
            >
              입력하기 →
            </button>
          </div>
        )}

        <button
          onClick={handleAnalyze}
          disabled={!cash || !income || !targetPrice}
          className="w-full py-4 rounded-xl text-sm font-bold text-white bg-[#185FA5] disabled:opacity-40 transition-opacity"
        >
          💰 맞춤 대출 분석하기
        </button>

        {/* 결과 */}
        {result && (
          <div className="space-y-3">
            <p className="text-xs font-semibold text-gray-400 px-1">분석 결과</p>

            {result.need <= 0 ? (
              <div className="bg-[#EAF3DE] border border-[#B0D48A] rounded-2xl p-5 text-center">
                <div className="text-3xl mb-2">🎉</div>
                <p className="font-bold text-[#27500A]">대출 없이 가능해요!</p>
                <p className="text-sm text-[#639922] mt-1">
                  여유 자금 {result.surplus.toLocaleString()}만원
                </p>
              </div>
            ) : (
              <>
                {/* 요약 카드 */}
                <div className="bg-white rounded-2xl border border-gray-100 p-4 grid grid-cols-3 gap-3 text-center">
                  <SummaryItem label="필요 대출" value={`${result.need.toLocaleString()}만`} color="#E24B4A" />
                  <SummaryItem label="월 이자 (예상)" value={`${result.monthly.toLocaleString()}만`} color="#BA7517" />
                  <SummaryItem label="DSR" value={`${result.dsr}%`} color={result.dsr > 40 ? '#E24B4A' : '#639922'} />
                </div>
                {result.dsr > 40 && (
                  <div className="bg-[#FCEBEB] border border-[#F5BABA] rounded-xl px-4 py-3 text-xs text-[#791F1F]">
                    ⚠️ DSR 40% 초과 — 대출 한도가 제한될 수 있어요. 은행 상담을 권장해요.
                  </div>
                )}

                {/* 추천 상품 */}
                {result.products.map((p, i) => (
                  <div key={i} className="bg-white rounded-2xl border border-gray-100 p-4"
                    style={{ borderLeftWidth: 4, borderLeftColor: p.color }}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-bold text-sm text-gray-900">{p.name}</span>
                      {p.rate && (
                        <span className="text-xs font-semibold px-2 py-0.5 rounded-full"
                          style={{ backgroundColor: p.bg, color: p.color }}>
                          연 {p.rate}%
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 mb-2">{p.desc}</p>
                    <p className="text-xs font-medium mb-3" style={{ color: p.color }}>{p.tip}</p>
                    {p.url && (
                      <a
                        href={p.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between w-full px-3 py-2 rounded-xl text-xs font-semibold transition-colors"
                        style={{ backgroundColor: p.bg, color: p.color }}
                      >
                        <span>{p.urlLabel}</span>
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                          <path d="M1 6h10M7 2l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </a>
                    )}
                  </div>
                ))}

                <div className="bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 space-y-1">
                  <p className="text-xs text-gray-500 font-semibold">⚠️ 참고사항</p>
                  <p className="text-xs text-gray-400 leading-relaxed">
                    • 표시된 금리는 <b>2026년 기준 참고값</b>으로, 실제 금리는 시장 상황에 따라 변동돼요.<br/>
                    • 대출 가능 여부와 한도는 <b>금융기관 심사</b>에 따라 다를 수 있어요.<br/>
                    • 최종 대출 전 반드시 <b>은행 상담</b>을 받으세요.
                  </p>
                </div>
              </>
            )}
          </div>
        )}
      </div>
      <BottomNav />
    </div>
  )
}

function AmountInput({ label, value, onChange, placeholder }) {
  return (
    <div className="space-y-1">
      <label className="text-xs font-medium text-gray-500">{label}</label>
      <div className="relative">
        <input
          type="number"
          inputMode="numeric"
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#185FA5] pr-12"
        />
        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-gray-400">만원</span>
      </div>
    </div>
  )
}

function SummaryItem({ label, value, color }) {
  return (
    <div>
      <p className="text-xs text-gray-400 mb-1">{label}</p>
      <p className="font-bold text-base" style={{ color }}>{value}</p>
    </div>
  )
}
