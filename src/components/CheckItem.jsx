export default function CheckItem({ checked, onChange, children, color = '#185FA5' }) {
  return (
    <label className="flex items-start gap-3 cursor-pointer py-2">
      <button
        type="button"
        onClick={() => onChange(!checked)}
        className="w-5 h-5 rounded flex-shrink-0 mt-0.5 border-2 flex items-center justify-center transition-all"
        style={{
          borderColor: checked ? color : '#d1d5db',
          backgroundColor: checked ? color : 'white',
        }}
        aria-checked={checked}
      >
        {checked && (
          <svg width="11" height="9" viewBox="0 0 11 9" fill="none">
            <path d="M1 4L4 7.5L10 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        )}
      </button>
      <span
        className={`text-sm leading-relaxed transition-colors ${
          checked ? 'line-through text-gray-400' : 'text-gray-700'
        }`}
      >
        {children}
      </span>
    </label>
  )
}
