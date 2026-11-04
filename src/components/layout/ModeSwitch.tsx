import { setLayout, useLayout } from '@/utils/layout'

const IconMonitor = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <rect x="3" y="4" width="18" height="12" rx="2" /><path d="M8 20h8M12 16v4" />
  </svg>
)
const IconPhone = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <rect x="7" y="2.5" width="10" height="19" rx="2.2" /><path d="M11 18.5h2" />
  </svg>
)

/** ปุ่มสลับหน้าตา Web (จอคอม) / Mobile — ปุ่มที่ไฮไลต์ = หน้าตาที่ใช้อยู่ */
export function ModeSwitch() {
  const { isMobile, mode } = useLayout()
  const hint = mode === 'auto' ? ' (อัตโนมัติตามขนาดจอ)' : ''
  return (
    <div className="mode-switch" role="group" aria-label="โหมดการแสดงผล">
      <button
        type="button"
        aria-pressed={!isMobile}
        title={'แสดงแบบ Web (จอคอม)' + (!isMobile ? hint : '')}
        onClick={() => setLayout('web')}
      >
        <IconMonitor /><span className="mode-switch__label">Web</span>
      </button>
      <button
        type="button"
        aria-pressed={isMobile}
        title={'แสดงแบบ Mobile' + (isMobile ? hint : '')}
        onClick={() => setLayout('mobile')}
      >
        <IconPhone /><span className="mode-switch__label">Mobile</span>
      </button>
    </div>
  )
}
