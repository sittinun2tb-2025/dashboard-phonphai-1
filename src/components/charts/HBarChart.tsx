import {
  Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis,
} from 'recharts'
import type { TooltipContentProps } from 'recharts'
import { fmtNumber } from '@/utils/format'

export interface Series {
  key: string
  label: string
  color: string // CSS var เช่น 'var(--series-1)'
}

interface Props {
  data: object[]
  categoryKey: string
  series: Series[]
  stacked?: boolean
  height?: number
}

function ChartTooltip({ active, payload, label }: TooltipContentProps<any, any>) {
  if (!active || !payload?.length) return null
  return (
    <div className="tip">
      <strong>{label}</strong>
      {payload.map((p) => (
        <div className="tip__row" key={String(p.dataKey)}>
          <span className="tip__swatch" style={{ background: p.color }} />
          {p.name}: {fmtNumber(Number(p.value))}
        </div>
      ))}
    </div>
  )
}

/** กราฟแท่งแนวนอน — เหมาะกับชื่อหมวดภาษาไทยที่ยาว */
export function HBarChart({ data, categoryKey, series, stacked, height }: Props) {
  const h = height ?? Math.max(220, data.length * (stacked ? 40 : 18 * series.length + 20) + 60)
  return (
    <ResponsiveContainer width="100%" height={h}>
      <BarChart data={data} layout="vertical" margin={{ left: 8, right: 24 }} barGap={2} barCategoryGap="22%">
        <CartesianGrid horizontal={false} stroke="var(--grid)" />
        <XAxis type="number" tickFormatter={fmtNumber} tick={{ fill: 'var(--text-muted)', fontSize: 12 }} axisLine={false} tickLine={false} />
        <YAxis type="category" dataKey={categoryKey} width={150} tick={{ fill: 'var(--text-secondary)', fontSize: 13 }} axisLine={false} tickLine={false} />
        <Tooltip content={ChartTooltip} cursor={{ fill: 'var(--surface-2)' }} />
        {series.length > 1 && <Legend wrapperStyle={{ fontSize: 13, color: 'var(--text-secondary)' }} />}
        {series.map((s, i) => (
          <Bar
            key={s.key}
            dataKey={s.key}
            name={s.label}
            fill={s.color}
            stackId={stacked ? 'a' : undefined}
            stroke={stacked ? 'var(--surface-1)' : undefined}
            strokeWidth={stacked ? 2 : 0}
            radius={!stacked || i === series.length - 1 ? [0, 4, 4, 0] : 0}
          />
        ))}
      </BarChart>
    </ResponsiveContainer>
  )
}
