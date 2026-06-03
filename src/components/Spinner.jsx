export default function Spinner({ color = '#185FA5' }) {
  return (
    <div className="flex-1 flex items-center justify-center py-20">
      <div
        className="w-8 h-8 rounded-full border-[3px] border-t-transparent animate-spin"
        style={{ borderColor: `${color}40`, borderTopColor: color }}
      />
    </div>
  )
}
