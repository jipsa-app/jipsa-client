import { useEffect } from 'react'

export default function Toast({ message, type = 'error', onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 3000)
    return () => clearTimeout(t)
  }, [])

  const styles = type === 'error'
    ? 'bg-[#791F1F] text-white'
    : 'bg-[#27500A] text-white'

  return (
    <div className={`fixed bottom-24 left-1/2 -translate-x-1/2 z-50 px-5 py-3 rounded-2xl text-sm font-medium shadow-lg whitespace-nowrap ${styles}`}>
      {type === 'error' ? '⚠️ ' : '✅ '}{message}
    </div>
  )
}
