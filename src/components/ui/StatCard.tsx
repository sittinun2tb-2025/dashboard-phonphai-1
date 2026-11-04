interface Props {
  label: string
  value: string
  hint?: string
}

/** การ์ดตัวเลขสรุป (KPI) */
export function StatCard({ label, value, hint }: Props) {
  return (
    <div className="card">
      <div className="stat__label">{label}</div>
      <div className="stat__value">{value}</div>
      {hint && <div className="stat__hint">{hint}</div>}
    </div>
  )
}
