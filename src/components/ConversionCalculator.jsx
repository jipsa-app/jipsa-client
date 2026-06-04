import { useState } from 'react'

// 법정 전월세 전환율 2026년 기준 (기준금리 3.5% + 2% = 5.5%)
const RATE = 5.5

export default function ConversionCalculator({ onClose }) {
  const [mode, setMode] = useState('toMonthly') // 전세→월세 or 월세→전세
  const [jeonse, setJeonse] = useState('')
  const [deposit, setDeposit] = useState('')
  const [monthly, setMonthly] = useState('')
  const [rate, setRate] = useState(String(RATE))

  const r = Number(rate) || RATE

  // 전세 → 월세 계산: 월세 = (전세금 - 보증금) × 전환율 / 12
  const calcMonthly = () => {
    const j = Number(jeonse) * 10000
    const d = Number(deposit) * 10000
    if (!j || d >= j) return null
    return Math.round((j - d) * (r / 100) / 12 / 10000)
  }

  // 월세 → 전세 계산: 전세금 = 보증금 + (월세 × 12 / 전환율)
  const calcJeonse = () => {
    const m = Number(monthly) * 10000
    const d = Number(deposit) * 10000
    if (!m) return null
    return Math.round((d + (m * 12 / (r / 100))) / 10000)
  }

  const result = mode === 'toMonthly' ? calcMonthly() : calcJeonse()

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-end justify-center">
      <div className="bg-white w-full max-w-mobile rounded-t-2xl px-5 pt-5 pb-8 space-y-4">
        <div className="flex items-center justify-between mb-1">
          <h2 className="font-bold text-gray-900">전월세 전환 계산기</h2>
          <button onClick={onClose} className="text-gray-400 text-xl leading-none">✕</button>
        </div>

        {/* 모드 선택 */}
        <div className="flex gap-2">
          {[
            { key: 'toMonthly', label: '전세 → 월세' },
            { key: 'toJeonse', label: '월세 → 전세' },
          ].map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setMode(key)}
              className="flex-1 py-2 rounded-xl text-sm font-semibold border transition-all"
              style={{
                backgroundColor: mode === key ? '#185FA5' : 'white',
                borderColor: mode === key ? '#185FA5' : '#e5e7eb',
                color: mode === key ? 'white' : '#6b7280',
              }}
            >
              {label}
            </button>
          ))}
        </div>

        {/* 전환율 */}
        <div className="flex items-center gap-2">
          <label className="text-xs text-gray-500 w-24 flex-shrink-0">전환율 (%)</label>
          <div className="relative flex-1">
            <input
              type="number"
              value={rate}
              onChange={e => setRate(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm pr-8 outline-none focus:border-[#185FA5]"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">%</span>
          </div>
          <span className="text-xs text-gray-400">법정 {RATE}%</span>
        </div>

        {mode === 'toMonthly' ? (
          <>
            <InputRow label="전세금" value={jeonse} onChange={setJeonse} />
            <InputRow label="보증금" value={deposit} onChange={setDeposit} />
          </>
        ) : (
          <>
            <InputRow label="보증금" value={deposit} onChange={setDeposit} />
            <InputRow label="월세" value={monthly} onChange={setMonthly} />
          </>
        )}

        {result !== null && (
          <div className="bg-[#E6F1FB] border border-[#A8C8E8] rounded-xl px-4 py-4 text-center">
            <p className="text-xs text-[#0C447C] mb-1">
              {mode === 'toMonthly' ? '환산 월세' : '환산 전세금'}
            </p>
            <p className="text-2xl font-bold text-[#185FA5]">
              {mode === 'toMonthly'
                ? `월 ${result.toLocaleString()}만원`
                : `${result.toLocaleString()}만원`}
            </p>
            <p className="text-xs text-[#0C447C]/60 mt-1">
              전환율 {rate}% 기준
            </p>
          </div>
        )}

        <p className="text-xs text-gray-400 text-center">
          법정 전월세 전환율: 기준금리(3.5%) + 2% = <b>5.5%</b> (2026년 기준)
        </p>
      </div>
    </div>
  )
}

function InputRow({ label, value, onChange }) {
  return (
    <div className="flex items-center gap-2">
      <label className="text-xs text-gray-500 w-24 flex-shrink-0">{label}</label>
      <div className="relative flex-1">
        <input
          type="number"
          inputMode="numeric"
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder="0"
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm pr-10 outline-none focus:border-[#185FA5]"
        />
        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">만원</span>
      </div>
    </div>
  )
}
