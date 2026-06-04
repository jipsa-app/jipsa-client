import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Header from '../components/Header'
import BottomNav from '../components/BottomNav'
import Spinner from '../components/Spinner'
import Toast from '../components/Toast'
import { getContracts, createContract, updateContract, deleteContract } from '../api/contract'

const TYPE_LABEL = { MONTHLY: '월세', JEONSE: '전세', SALE: '매매' }
const TYPE_COLOR = { MONTHLY: '#BA7517', JEONSE: '#185FA5', SALE: '#534AB7' }
const TYPE_BG    = { MONTHLY: '#FAEEDA', JEONSE: '#E6F1FB', SALE: '#EEEDFE' }

function dday(dateStr) {
  if (!dateStr) return null
  const diff = Math.ceil((new Date(dateStr) - new Date().setHours(0,0,0,0)) / 86400000)
  if (diff === 0) return 'D-Day'
  if (diff > 0) return `D-${diff}`
  return `D+${Math.abs(diff)}`
}

function ddayColor(dateStr) {
  if (!dateStr) return '#9ca3af'
  const diff = Math.ceil((new Date(dateStr) - new Date().setHours(0,0,0,0)) / 86400000)
  if (diff < 0) return '#9ca3af'
  if (diff <= 7) return '#E24B4A'
  if (diff <= 30) return '#BA7517'
  return '#185FA5'
}

function DateRow({ label, date, highlight }) {
  if (!date) return null
  const tag = dday(date)
  const color = ddayColor(date)
  return (
    <div className={`flex items-center justify-between py-2 border-b border-gray-50 last:border-0 ${highlight ? 'font-semibold' : ''}`}>
      <span className="text-sm text-gray-600">{label}</span>
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-800">{date}</span>
        {tag && (
          <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ color, backgroundColor: color + '18' }}>
            {tag}
          </span>
        )}
      </div>
    </div>
  )
}

function ContractCard({ contract, onEdit, onDelete }) {
  const color = TYPE_COLOR[contract.type]
  const bg = TYPE_BG[contract.type]

  const extraDates = contract.type === 'SALE'
    ? [{ label: '취득세 납부 마감', date: contract.balanceDate ? addDays(contract.balanceDate, 60) : null }]
    : contract.type === 'JEONSE'
    ? [{ label: '보증보험 신청 마감', date: contract.contractDate ? addDays(contract.contractDate, 30) : null }]
    : []

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="px-4 py-3 flex items-center justify-between" style={{ backgroundColor: bg }}>
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold px-2 py-1 rounded-full text-white" style={{ backgroundColor: color }}>
            {TYPE_LABEL[contract.type]}
          </span>
          <a
            href={`https://map.naver.com/v5/search/${encodeURIComponent(contract.address)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-semibold text-gray-800 underline decoration-dotted underline-offset-2"
            onClick={e => e.stopPropagation()}
          >
            {contract.address} 🗺️
          </a>
        </div>
        <div className="flex gap-2">
          <button onClick={onEdit} className="text-xs text-gray-400 hover:text-gray-600">수정</button>
          <button onClick={onDelete} className="text-xs text-red-300 hover:text-red-500">삭제</button>
        </div>
      </div>

      <div className="px-4 py-3 space-y-0">
        <DateRow label="계약일" date={contract.contractDate} />
        <DateRow
          label={contract.type === 'MONTHLY' ? '입주일' : '잔금일 (전입신고·확정일자 당일)'}
          date={contract.balanceDate}
          highlight
        />
        {extraDates.map(d => <DateRow key={d.label} label={d.label} date={d.date} />)}
        <DateRow label="계약 만료일" date={contract.expiryDate} highlight />
        {contract.memo && (
          <p className="text-xs text-gray-400 pt-2 whitespace-pre-line">{contract.memo}</p>
        )}
      </div>
    </div>
  )
}

function addDays(dateStr, days) {
  const d = new Date(dateStr)
  d.setDate(d.getDate() + days)
  return d.toISOString().slice(0, 10)
}

const EMPTY_FORM = { type: 'MONTHLY', address: '', contractDate: '', balanceDate: '', expiryDate: '', memo: '' }

function ContractForm({ initial, onSave, onCancel }) {
  const [form, setForm] = useState(initial || EMPTY_FORM)
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-end justify-center">
      <div className="bg-white w-full max-w-mobile rounded-t-2xl px-5 pt-5 pb-8 space-y-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-1">
          <h2 className="font-bold text-gray-900">{initial ? '일정 수정' : '계약 일정 추가'}</h2>
          <button onClick={onCancel} className="text-gray-400 text-xl leading-none">✕</button>
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">거래 유형</label>
          <div className="flex gap-2">
            {Object.entries(TYPE_LABEL).map(([k, v]) => (
              <button
                key={k}
                onClick={() => set('type', k)}
                className="flex-1 py-2 rounded-xl text-sm font-semibold border transition-all"
                style={{
                  backgroundColor: form.type === k ? TYPE_COLOR[k] : 'white',
                  borderColor: form.type === k ? TYPE_COLOR[k] : '#e5e7eb',
                  color: form.type === k ? 'white' : '#6b7280',
                }}
              >
                {v}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">주소</label>
          <input
            value={form.address}
            onChange={e => set('address', e.target.value)}
            placeholder="예) 서울시 마포구 연남동 123-4"
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#185FA5]"
          />
        </div>

        {[
          { key: 'contractDate', label: '계약일' },
          { key: 'balanceDate', label: form.type === 'MONTHLY' ? '입주일' : '잔금일' },
          { key: 'expiryDate', label: '계약 만료일' },
        ].map(({ key, label }) => (
          <div key={key}>
            <label className="block text-xs font-medium text-gray-500 mb-1">{label}</label>
            <input
              type="date"
              value={form[key]}
              onChange={e => set(key, e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#185FA5]"
            />
          </div>
        ))}

        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">메모 (선택)</label>
          <textarea
            value={form.memo}
            onChange={e => set('memo', e.target.value)}
            placeholder={"예) 집주인 연락처: 010-1234-5678\n공인중개사: 홍길동 공인중개사\n특이사항: 주차 1대 포함"}
            rows={3}
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#185FA5] resize-none"
          />
        </div>

        <button
          onClick={() => onSave(form)}
          disabled={!form.address}
          className="w-full py-3.5 rounded-xl text-sm font-semibold text-white disabled:opacity-40"
          style={{ backgroundColor: TYPE_COLOR[form.type] }}
        >
          저장
        </button>
      </div>
    </div>
  )
}

export default function Schedule() {
  const navigate = useNavigate()
  const [contracts, setContracts] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState(null)
  const [toast, setToast] = useState(null)
  const isLoggedIn = !!localStorage.getItem('token')

  useEffect(() => {
    if (!isLoggedIn) { setLoading(false); return }
    getContracts()
      .then(res => setContracts(res.data))
      .catch(() => setToast('데이터를 불러오지 못했어요'))
      .finally(() => setLoading(false))
  }, [])

  async function handleSave(form) {
    const data = {
      ...form,
      contractDate: form.contractDate || null,
      balanceDate: form.balanceDate || null,
      expiryDate: form.expiryDate || null,
      memo: form.memo || null,
    }
    try {
      if (editing) {
        const res = await updateContract(editing.id, data)
        setContracts(cs => cs.map(c => c.id === editing.id ? res.data : c))
        setEditing(null)
      } else {
        const res = await createContract(data)
        setContracts(cs => [res.data, ...cs])
        setShowForm(false)
      }
    } catch {
      setToast('저장에 실패했어요. 다시 시도해주세요')
    }
  }

  async function handleDelete(id) {
    if (!window.confirm('이 일정을 삭제할까요?')) return
    try {
      await deleteContract(id)
      setContracts(cs => cs.filter(c => c.id !== id))
    } catch {
      setToast('삭제에 실패했어요. 다시 시도해주세요')
    }
  }

  if (loading) return (
    <div className="mx-auto max-w-mobile min-h-screen flex flex-col bg-gray-50">
      <Header title="계약 일정 관리" badge="D-day 자동계산" badgeStyle="bg-[#E6F1FB] text-[#185FA5]" noBack />
      <Spinner />
    </div>
  )

  return (
    <div className="mx-auto max-w-mobile min-h-screen flex flex-col bg-gray-50">
      <Header title="계약 일정 관리" badge="D-day 자동계산" badgeStyle="bg-[#E6F1FB] text-[#185FA5]" noBack />
      {toast && <Toast message={toast} onClose={() => setToast(null)} />}

      <div className="flex-1 px-4 py-4 space-y-3 overflow-y-auto">
        {!isLoggedIn && (
          <div className="bg-[#E6F1FB] border border-[#A8C8E8] rounded-xl px-4 py-4 text-center">
            <p className="text-sm text-[#0C447C] font-medium mb-3">로그인하면 일정을 저장할 수 있어요</p>
            <button
              onClick={() => navigate('/login')}
              className="text-sm font-semibold text-white bg-[#185FA5] px-6 py-2 rounded-xl"
            >
              로그인하기
            </button>
          </div>
        )}

        {contracts.length === 0 && isLoggedIn && (
          <div className="text-center py-16 text-gray-400">
            <div className="text-4xl mb-3">📅</div>
            <p className="text-sm">아직 등록된 계약 일정이 없어요</p>
            <p className="text-xs mt-1">아래 버튼으로 추가해보세요</p>
          </div>
        )}

        {contracts.map(c => (
          <ContractCard
            key={c.id}
            contract={c}
            onEdit={() => setEditing(c)}
            onDelete={() => handleDelete(c.id)}
          />
        ))}
      </div>

      {isLoggedIn && (
        <div className="sticky bottom-16 bg-white border-t border-gray-100 px-4 py-3">
          <button
            onClick={() => setShowForm(true)}
            className="w-full py-3.5 rounded-xl text-sm font-semibold text-white bg-[#185FA5]"
          >
            + 계약 일정 추가
          </button>
        </div>
      )}

      {showForm && (
        <ContractForm onSave={handleSave} onCancel={() => setShowForm(false)} />
      )}
      {editing && (
        <ContractForm
          initial={{ ...editing, contractDate: editing.contractDate ?? '', balanceDate: editing.balanceDate ?? '', expiryDate: editing.expiryDate ?? '', memo: editing.memo ?? '' }}
          onSave={handleSave}
          onCancel={() => setEditing(null)}
        />
      )}
      <BottomNav />
    </div>
  )
}
