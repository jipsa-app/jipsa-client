import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Header from '../components/Header'
import Toast from '../components/Toast'
import { updateNickname, updatePassword, withdraw } from '../api/auth'

export default function EditProfile() {
  const navigate = useNavigate()
  const currentNickname = localStorage.getItem('nickname') || ''

  const [nickname, setNickname] = useState(currentNickname)
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [toast, setToast] = useState(null)
  const [showWithdraw, setShowWithdraw] = useState(false)
  const [loadingNick, setLoadingNick] = useState(false)
  const [loadingPw, setLoadingPw] = useState(false)

  const showToast = (msg, type = 'error') => setToast({ msg, type })

  async function handleNickname() {
    if (!nickname.trim()) return showToast('닉네임을 입력해주세요.')
    setLoadingNick(true)
    try {
      await updateNickname(nickname.trim())
      localStorage.setItem('nickname', nickname.trim())
      showToast('닉네임이 변경되었어요! ✅', 'success')
    } catch (e) {
      showToast(e.response?.data?.message || '닉네임 변경에 실패했어요.')
    } finally {
      setLoadingNick(false)
    }
  }

  async function handlePassword() {
    if (!currentPassword) return showToast('현재 비밀번호를 입력해주세요.')
    if (newPassword.length < 6) return showToast('새 비밀번호는 6자 이상이어야 해요.')
    if (newPassword !== confirmPassword) return showToast('새 비밀번호가 일치하지 않아요.')
    setLoadingPw(true)
    try {
      await updatePassword(currentPassword, newPassword)
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
      showToast('비밀번호가 변경되었어요! ✅', 'success')
    } catch (e) {
      showToast(e.response?.data?.message || '비밀번호 변경에 실패했어요.')
    } finally {
      setLoadingPw(false)
    }
  }

  async function handleWithdraw() {
    try {
      await withdraw()
      localStorage.clear()
      navigate('/')
    } catch (e) {
      showToast('회원 탈퇴에 실패했어요.')
    }
  }

  return (
    <div className="mx-auto max-w-mobile min-h-screen bg-gray-50 pb-10">
      <Header title="회원정보 수정" />
      {toast && <Toast message={toast.msg} type={toast.type} onClose={() => setToast(null)} />}

      <div className="px-4 py-5 space-y-4">

        {/* 닉네임 변경 */}
        <Section title="닉네임 변경">
          <div className="space-y-3">
            <InputField
              label="닉네임"
              value={nickname}
              onChange={setNickname}
              placeholder="변경할 닉네임을 입력하세요"
              maxLength={12}
            />
            <button
              onClick={handleNickname}
              disabled={loadingNick || !nickname.trim() || nickname.trim() === currentNickname}
              className="w-full py-3 rounded-xl text-sm font-semibold text-white bg-[#185FA5] disabled:opacity-40 transition-opacity"
            >
              {loadingNick ? '변경 중...' : '닉네임 변경'}
            </button>
          </div>
        </Section>

        {/* 비밀번호 변경 */}
        <Section title="비밀번호 변경">
          <div className="space-y-3">
            <InputField
              label="현재 비밀번호"
              value={currentPassword}
              onChange={setCurrentPassword}
              type="password"
              placeholder="현재 비밀번호"
            />
            <InputField
              label="새 비밀번호"
              value={newPassword}
              onChange={setNewPassword}
              type="password"
              placeholder="새 비밀번호 (6자 이상)"
            />
            <InputField
              label="비밀번호 확인"
              value={confirmPassword}
              onChange={setConfirmPassword}
              type="password"
              placeholder="새 비밀번호 재입력"
              error={confirmPassword && newPassword !== confirmPassword ? '비밀번호가 일치하지 않아요' : null}
            />
            <button
              onClick={handlePassword}
              disabled={loadingPw || !currentPassword || !newPassword || !confirmPassword}
              className="w-full py-3 rounded-xl text-sm font-semibold text-white bg-[#185FA5] disabled:opacity-40 transition-opacity"
            >
              {loadingPw ? '변경 중...' : '비밀번호 변경'}
            </button>
          </div>
        </Section>

        {/* 회원 탈퇴 */}
        <div className="flex justify-end pt-2 pb-4 px-1">
          <button
            onClick={() => setShowWithdraw(true)}
            className="text-xs text-gray-300 underline underline-offset-2"
          >
            회원 탈퇴
          </button>
        </div>
      </div>

      {/* 회원 탈퇴 확인 모달 */}
      {showWithdraw && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center px-6">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm">
            <div className="text-center mb-5">
              <div className="text-4xl mb-3">⚠️</div>
              <p className="font-bold text-gray-900 text-lg">정말 탈퇴하시겠어요?</p>
              <p className="text-sm text-gray-500 mt-2 leading-relaxed">
                탈퇴하면 체크리스트, 계약 일정 등<br/>모든 데이터가 삭제되며 복구할 수 없어요.
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setShowWithdraw(false)}
                className="flex-1 py-3 rounded-xl text-sm font-semibold border border-gray-200 text-gray-600"
              >
                취소
              </button>
              <button
                onClick={handleWithdraw}
                className="flex-1 py-3 rounded-xl text-sm font-semibold text-white bg-red-500"
              >
                탈퇴하기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function Section({ title, children }) {
  return (
    <div className="space-y-2">
      <p className="text-xs font-semibold text-gray-400 px-1 tracking-wide">{title}</p>
      <div className="bg-white rounded-2xl border border-gray-100 p-4">
        {children}
      </div>
    </div>
  )
}

function InputField({ label, value, onChange, type = 'text', placeholder, maxLength, error }) {
  return (
    <div className="space-y-1">
      <label className="text-xs font-medium text-gray-500">{label}</label>
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        maxLength={maxLength}
        className={`w-full border rounded-xl px-4 py-3 text-sm outline-none transition-colors ${
          error ? 'border-red-300 focus:border-red-400' : 'border-gray-200 focus:border-[#185FA5]'
        }`}
      />
      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  )
}
