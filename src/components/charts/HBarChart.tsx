import {
  Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis,
} from 'recharts'
import type { TooltipContentProps } from 'recharts'
import { fmtNumber } from '@/utils/format'
import { useLayout } from '@/utils/layout'

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

/** ตัดชื่อหมวดที่ยาวเกินบนจอมือถือ (ตัดตามตัวอักษรที่มองเห็น ไม่ตัดสระ/วรรณยุกต์ไทยแยกจากพยัญชนะ) */
const graphemes = new Intl.Segmenter('th', { granularity: 'grapheme' })
function shorten(label: string, max: number) {
  const parts = [...graphemes.segment(String(label))].map((s) => s.segment)
  return parts.length > max ? parts.slice(0, max - 1).join('') + '…' : label
}

/** กราฟแท่งแนวนอน — เหมาะกับชื่อหมวดภาษาไทยที่ยาว ยืดเต็มความสูงของกล่องที่ใส่ */
export function HBarChart({ data, categoryKey, series, stacked }: Props) {
  const phone = useLayout().isPhone
  const yWidth = phone ? 100 : 154
  return (
    <div className="chart-box">
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} layout="vertical" margin={{ top: 0, left: 0, right: 16, bottom: 0 }} barGap={2} barCategoryGap="22%">
        <CartesianGrid horizontal={false} stroke="var(--grid)" />
        <XAxis type="number" tickFormatter={fmtNumber} tick={{ fill: 'var(--text-muted)', fontSize: 12.1 }} axisLine={false} tickLine={false} />
        <YAxis
          type="category" dataKey={categoryKey} width={yWidth}
          tick={{ fill: 'var(--text-secondary)', fontSize: phone ? 12.5 : 13.2 }}
          tickFormatter={phone ? (v: string) => shorten(v, 11) : undefined}
          axisLine={false} tickLine={false}
        />
        <Tooltip content={ChartTooltip} cursor={{ fill: 'var(--surface-2)' }} />
        {series.length > 1 && (
          <Legend verticalAlign="top" align="right" iconType="circle" iconSize={10} height={28} wrapperStyle={{ fontSize: 13.2, color: 'var(--text-secondary)' }} />
        )}
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
    </div>
  )
}
