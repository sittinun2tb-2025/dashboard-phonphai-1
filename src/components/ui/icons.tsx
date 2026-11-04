/** ไอคอนเส้นเรียบ ๆ สำหรับเมนู (ใช้ currentColor ตามสีตัวอักษร) */
const base = {
  width: 22, height: 22, viewBox: '0 0 24 24', fill: 'none',
  stroke: 'currentColor', strokeWidth: 1.8, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const,
  'aria-hidden': true,
}

export const IconOverview = () => (
  <svg {...base}><rect x="3" y="3" width="7" height="9" rx="1.5" /><rect x="14" y="3" width="7" height="5" rx="1.5" /><rect x="14" y="12" width="7" height="9" rx="1.5" /><rect x="3" y="16" width="7" height="5" rx="1.5" /></svg>
)
export const IconAlert = () => (
  <svg {...base}><path d="M12 3 2.5 20h19L12 3z" /><path d="M12 10v4" /><path d="M12 17.5v.01" /></svg>
)
export const IconUsers = () => (
  <svg {...base}><circle cx="9" cy="8" r="3.5" /><path d="M2.5 20c.6-3.5 3.3-5.5 6.5-5.5s5.9 2 6.5 5.5" /><path d="M16 4.5a3.5 3.5 0 0 1 0 7" /><path d="M18.5 14.8c1.7.8 2.8 2.6 3 5.2" /></svg>
)
export const IconClock = () => (
  <svg {...base}><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></svg>
)
