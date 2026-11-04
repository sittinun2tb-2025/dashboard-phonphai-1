import { useEffect, useMemo, useRef, useState, type PointerEvent } from 'react'
import { geoArea, geoMercator, geoPath } from 'd3-geo'
import type { Feature, FeatureCollection, Geometry, Position } from 'geojson'
import provincesGeo from '@/data/geo/thailand-provinces.json'

type ProvinceProps = { pro_code: string; pro_th: string; pro_en: string }
type ProvinceFeature = Feature<Geometry, ProvinceProps>

const geo = provincesGeo as unknown as FeatureCollection<Geometry, ProvinceProps>

/**
 * GeoJSON มาตรฐาน (RFC 7946) วนเส้นขอบทวนเข็ม แต่ d3-geo ต้องการตามเข็ม
 * ถ้าไม่กลับทิศ d3 จะตีความว่าเป็น "ทั้งโลกยกเว้นจังหวัดนี้" → ระบายเต็มกรอบ
 */
for (const f of geo.features) {
  if (geoArea(f) > 2 * Math.PI) {
    const g = f.geometry
    if (g.type === 'Polygon') g.coordinates.forEach((r: Position[]) => r.reverse())
    if (g.type === 'MultiPolygon') g.coordinates.forEach((p) => p.forEach((r: Position[]) => r.reverse()))
  }
}

interface Props {
  /** ชื่อจังหวัด (ภาษาไทยตามไฟล์รายงาน) → รายการประเภทภัยในจังหวัดนั้น */
  highlights: Map<string, string[]>
}

interface Hover {
  name: string
  types: string[]
  x: number
  y: number
}

/** แผนที่ขอบเขตจังหวัด ระบายสีจังหวัดที่ปรากฏในรายงาน */
export function ProvinceMap({ highlights }: Props) {
  const boxRef = useRef<HTMLDivElement>(null)
  const [size, setSize] = useState({ w: 0, h: 0 })
  const [hover, setHover] = useState<Hover | null>(null)

  useEffect(() => {
    const el = boxRef.current
    if (!el) return
    // วัดขนาดทันทีตอนแสดงครั้งแรก (ไม่ต้องรอ ResizeObserver ซึ่งบางเบราว์เซอร์มือถือเรียกช้า)
    const first = el.getBoundingClientRect()
    setSize({ w: Math.floor(first.width), h: Math.floor(first.height) })
    const ro = new ResizeObserver(([e]) => {
      const { width, height } = e.contentRect
      setSize({ w: Math.floor(width), h: Math.floor(height) })
    })
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  const paths = useMemo(() => {
    if (!size.w || !size.h) return []
    const projection = geoMercator().fitSize([size.w, size.h], geo)
    const path = geoPath(projection)
    return geo.features.map((f: ProvinceFeature) => ({
      name: f.properties.pro_th,
      d: path(f) ?? '',
    }))
  }, [size])

  // วาดจังหวัดที่ไฮไลต์ทีหลัง เพื่อให้เส้นขอบอยู่ด้านบน
  const sorted = [...paths].sort((a, b) => Number(highlights.has(a.name)) - Number(highlights.has(b.name)))

  return (
    <div className="map">
      <div
        className="map__canvas"
        ref={boxRef}
        // เมาส์ออกนอกแผนที่ → ซ่อน · บนมือถือ แตะที่ว่าง (ไม่ใช่จังหวัด) → ซ่อน
        onPointerLeave={(e) => e.pointerType === 'mouse' && setHover(null)}
        onPointerDown={(e) => (e.target as Element).tagName !== 'path' && setHover(null)}
      >
        <svg width={size.w} height={size.h} role="img" aria-label="แผนที่จังหวัดที่ได้รับผลกระทบ">
          {sorted.map((p) => {
            const types = highlights.get(p.name)
            const show = (e: PointerEvent) => {
              const r = boxRef.current!.getBoundingClientRect()
              setHover({ name: p.name, types: types ?? [], x: e.clientX - r.left, y: e.clientY - r.top })
            }
            return (
              <path
                key={p.name}
                d={p.d}
                className={
                  (types ? 'map__prov map__prov--hit' : 'map__prov') +
                  (hover?.name === p.name ? ' map__prov--active' : '')
                }
                onPointerMove={(e) => e.pointerType === 'mouse' && show(e)}
                onPointerDown={show}
              >
                <title>{types ? `${p.name}: ${types.join(', ')}` : p.name}</title>
              </path>
            )
          })}
        </svg>
        {hover && (
          <div
            className="tip map__tip"
            style={{
              left: Math.max(0, Math.min(hover.x + 12, size.w - 190)),
              top: Math.max(0, Math.min(hover.y - 12, size.h - 110)),
            }}
          >
            <strong>จ.{hover.name}</strong>
            {hover.types.length ? (
              hover.types.map((t) => (
                <div className="tip__row" key={t}>
                  <span className="tip__swatch" style={{ background: 'var(--series-1)' }} />
                  {t}
                </div>
              ))
            ) : (
              <div className="tip__row" style={{ color: 'var(--text-muted)' }}>ไม่มีรายงานในเดือนนี้</div>
            )}
          </div>
        )}
      </div>
      <div className="map__legend">
        <span><i className="map__key map__key--hit" /> พื้นที่ได้รับผลกระทบ ({highlights.size} จังหวัด)</span>
        <span><i className="map__key" /> ไม่มีรายงาน</span>
      </div>
      <div className="map__credit">
        ขอบเขตจังหวัด: กรมการปกครอง ผ่าน{' '}
        <a href="https://github.com/chingchai/OpenGISData-Thailand" target="_blank" rel="noreferrer">OpenGISData-Thailand</a>{' '}
        (CC BY 4.0)
      </div>
    </div>
  )
}
