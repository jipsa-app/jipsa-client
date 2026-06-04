import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { login } from '../api/auth'

export default function Login() {
  const navigate = useNavigate()

  useEffect(() => {
    if (localStorage.getItem('token')) navigate('/', { replace: true })
  }, [])
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await login(email, password)
      localStorage.setItem('token', res.data.token)
      localStorage.setItem('nickname', res.data.nickname)
      localStorage.setItem('email', res.data.email)
      navigate('/')
    } catch (err) {
      setError(err.response?.data?.message || '이메일 또는 비밀번호가 올바르지 않아요.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto max-w-mobile min-h-screen flex flex-col bg-white px-5 pt-10">
      <button onClick={() => navigate(-1)} className="self-start p-1 -ml-1 text-gray-400 mb-6">
        <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
          <path d="M14 5L8 11L14 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
      <div className="text-4xl mb-3">🏠</div>
      <h1 className="text-2xl font-bold text-gray-900">로그인</h1>
      <p className="text-sm text-gray-500 mt-1 mb-8">집사에 오신 걸 환영해요</p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">이메일</label>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="example@email.com"
            required
            className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#185FA5] focus:ring-1 focus:ring-[#185FA5]"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">비밀번호</label>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="비밀번호 입력"
            required
            className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#185FA5] focus:ring-1 focus:ring-[#185FA5]"
          />
        </div>

        {error && (
          <p className="text-sm text-red-500">{error}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#185FA5] text-white font-semibold rounded-xl py-3.5 text-sm active:scale-[0.98] transition-transform disabled:opacity-50"
        >
          {loading ? '로그인 중...' : '로그인'}
        </button>
      </form>

      <p className="text-sm text-gray-500 text-center mt-6">
        아직 계정이 없으신가요?{' '}
        <Link to="/signup" className="text-[#185FA5] font-semibold">회원가입</Link>
      </p>
    </div>
  )
}
