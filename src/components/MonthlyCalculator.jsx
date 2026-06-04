import { useState } from 'react'

const N = (v) => Number(v) || 0

export default function MonthlyCalculator({ onClose }) {
  const [form, setForm] = useState({ rent: '', mgmt: '', utility: '', loanInt: '', income: '' })

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))

  const monthly = (N(form.rent) + N(form.mgmt) + N(form.utility) + N(form.loanInt)) * 10000
  const income = N(form.income) * 10000
  const ratio = income > 0 ? (monthly / income) * 100 : 0
  const hasResult = monthly > 0

  const barColor = ratio > 50 ? '#E24B4A' : ratio > 40 ? '#BA7517' : '#639922'
  const barWidth = Math.min(ratio, 100)

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-end justify-center" onClick={onClose}>
      <div
        className="bg-white w-full max-w-mobile rounded-t-2xl p-5 pb-8 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-bold text-lg text-gray-900">월 지출 계산기</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl leading-none">✕</button>
        </div>

        <div className="space-y-3 mb-5">
          {[
            { key: 'rent',    label: '월세',          placeholder: '예) 60' },
            { key: 'mgmt',    label: '관리비',         placeholder: '예) 8' },
            { key: 'utility', label: '공과금 (평균)',   placeholder: '예) 5' },
            { key: 'loanInt', label: '보증금 대출 이자', placeholder: '예) 12' },
            { key: 'income',  label: '월 소득',         placeholder: '예) 300' },
          ].map(({ key, label, placeholder }) => (
            <div key={key} className="flex items-center gap-3">
              <label className="text-sm text-gray-600 w-28 flex-shrink-0">{label}</label>
              <div className="relative flex-1">
                <input
                  type="number"
                  inputMode="numeric"
                  value={form[key]}
                  onChange={set(key)}
                  placeholder={placeholder}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm pr-8 focus:outline-none focus:border-[#BA7517]"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">만원</span>
              </div>
            </div>
          ))}
        </div>

        {hasResult && (
          <div className="bg-[#FAEEDA] rounded-xl p-4 space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-[#633806] font-medium">월 주거비 합계</span>
              <span className="font-bold text-[#BA7517]">{(monthly / 10000).toFixed(1)}만원</span>
            </div>
            {income > 0 && (
              <>
                <div>
                  <div className="flex justify-between text-xs text-[#633806] mb-1">
                    <span>소득 대비 비율</span>
                    <span className="font-bold" style={{ color: barColor }}>{ratio.toFixed(1)}%</span>
                  </div>
                  <div className="h-2.5 bg-white rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{ width: `${barWidth}%`, backgroundColor: barColor }}
                    />
                  </div>
                </div>
                {ratio > 50 && (
                  <p className="text-xs text-[#791F1F] bg-[#FCEBEB] rounded-lg px-3 py-2">
                    ⚠️ 소득의 50% 초과 — 주거비 부담이 매우 높아요
                  </p>
                )}
                {ratio > 40 && ratio <= 50 && (
                  <p className="text-xs text-[#633806] bg-white rounded-lg px-3 py-2">
                    💡 소득의 40% 초과 — 절약 가능한 항목을 검토하세요
                  </p>
                )}
                {ratio <= 40 && (
                  <p className="text-xs text-[#27500A] bg-[#EAF3DE] rounded-lg px-3 py-2">
                    ✅ 안정적인 주거비 수준이에요
                  </p>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
