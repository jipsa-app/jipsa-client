import { useState } from 'react'

const N = (v) => Number(v) || 0
const fmt = (n) => Math.round(n).toLocaleString()

function getAcqTaxRate(price, houseCount) {
  if (houseCount >= 2) return 0.08
  if (price <= 60000) return 0.01
  if (price <= 90000) return 0.01 + ((price - 60000) / 30000) * 0.02
  return 0.03
}

function getBrokerRate(price) {
  if (price < 5000) return Math.min(price * 10000 * 0.006, 250000) / (price * 10000)
  if (price < 20000) return Math.min(price * 10000 * 0.005, 800000) / (price * 10000)
  if (price < 90000) return 0.004
  if (price < 120000) return 0.005
  return 0.006
}

export default function TaxCalculator({ onClose }) {
  const [form, setForm] = useState({ price: '', equity: '', houses: '0' })

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))

  const price = N(form.price)
  const equity = N(form.equity)
  const houses = N(form.houses)
  const hasResult = price > 0

  const taxRate = getAcqTaxRate(price, houses)
  const acqTax = price * 10000 * taxRate
  const legalFee = price * 10000 * 0.002
  const brokerFee = price * 10000 * getBrokerRate(price)
  const totalExtra = acqTax + legalFee + brokerFee
  const totalNeeded = price * 10000 + totalExtra
  const loan = Math.max(0, totalNeeded - equity * 10000)
  const loanRatio = price > 0 ? (loan / (price * 10000)) * 100 : 0

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-end justify-center" onClick={onClose}>
      <div
        className="bg-white w-full max-w-mobile rounded-t-2xl p-5 pb-8 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-bold text-lg text-gray-900">취득세·비용 계산기</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl leading-none">✕</button>
        </div>

        <div className="space-y-3 mb-5">
          <div className="flex items-center gap-3">
            <label className="text-sm text-gray-600 w-28 flex-shrink-0">매매가</label>
            <div className="relative flex-1">
              <input
                type="number"
                inputMode="numeric"
                value={form.price}
                onChange={set('price')}
                placeholder="예) 50000"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm pr-8 focus:outline-none focus:border-[#534AB7]"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">만원</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <label className="text-sm text-gray-600 w-28 flex-shrink-0">자기자본</label>
            <div className="relative flex-1">
              <input
                type="number"
                inputMode="numeric"
                value={form.equity}
                onChange={set('equity')}
                placeholder="예) 20000"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm pr-8 focus:outline-none focus:border-[#534AB7]"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">만원</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <label className="text-sm text-gray-600 w-28 flex-shrink-0">현재 주택 보유 수</label>
            <select
              value={form.houses}
              onChange={set('houses')}
              className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#534AB7]"
            >
              <option value="0">무주택</option>
              <option value="1">1주택</option>
              <option value="2">2주택 이상</option>
            </select>
          </div>
        </div>

        {hasResult && (
          <div className="bg-[#EEEDFE] rounded-xl p-4 space-y-2.5">
            <Row label="매매가" value={`${fmt(price * 10000)}원`} bold />
            <Row label={`취득세 (${(taxRate * 100).toFixed(1)}%)`} value={`${fmt(acqTax)}원`} />
            <Row label="법무사·등기 비용 (0.2%)" value={`${fmt(legalFee)}원`} />
            <Row label={`중개보수 (${(getBrokerRate(price) * 100).toFixed(2)}%)`} value={`${fmt(brokerFee)}원`} />
            <div className="border-t border-[#B8B4E8] pt-2.5 space-y-2.5">
              <Row label="총 필요 자금" value={`${fmt(totalNeeded)}원`} bold color="#3C3489" />
              {equity > 0 && <Row label="필요 대출" value={`${fmt(loan)}원`} color={loanRatio > 70 ? '#E24B4A' : '#534AB7'} />}
            </div>
            {houses >= 2 && (
              <p className="text-xs text-[#791F1F] bg-[#FCEBEB] rounded-lg px-3 py-2">
                ⚠️ 2주택 이상: 취득세 8% 중과 (조정지역 최대 12%)
              </p>
            )}
            {loanRatio > 70 && (
              <p className="text-xs text-[#791F1F] bg-[#FCEBEB] rounded-lg px-3 py-2">
                ⚠️ 대출 비중 {loanRatio.toFixed(0)}% 초과 — LTV 한도를 반드시 확인하세요
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

function Row({ label, value, bold, color = '#3C3489' }) {
  return (
    <div className="flex justify-between text-sm">
      <span className="text-[#534AB7]">{label}</span>
      <span className={bold ? 'font-bold' : 'font-medium'} style={{ color }}>
        {value}
      </span>
    </div>
  )
}
