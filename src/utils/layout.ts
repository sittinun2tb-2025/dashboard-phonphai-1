import { useSyncExternalStore } from 'react'

/**
 * โหมดการแสดงผล
 * - auto   : เลือกตามขนาดจอ (ค่าเริ่มต้น)
 * - web    : บังคับหน้าตาแบบจอคอม — ถ้าจอแคบกว่า 1024px (เช่นมือถือ) จะจัดหน้ากว้าง 1280px
 *            แล้วย่อด้วย CSS transform ให้พอดีจอทั้งหน้า (ไม่พึ่งการซูมของเบราว์เซอร์ ซึ่งแต่ละเครื่องไม่เหมือนกัน)
 * - mobile : บังคับหน้าตาแบบมือถือ (บนจอคอมแสดงเป็นกรอบกว้างเท่าโทรศัพท์ตรงกลาง)
 *
 * ผลลัพธ์ใส่เป็น class บน <html>:
 *   is-mobile (แท็บเล็ต/มือถือ), is-phone (จอโทรศัพท์), force-mobile, web-scaled
 * CSS ใน global.css ใช้ class เหล่านี้แทน media query
 */
export type LayoutMode = 'auto' | 'web' | 'mobile'

export interface LayoutState {
  mode: LayoutMode
  isMobile: boolean
  isPhone: boolean
}

const KEY = 'layout'
const MQ_MOBILE = '(max-width: 1023px), (max-height: 560px)'
const MQ_PHONE = '(max-width: 640px)'
const DESKTOP_W = 1280 // ความกว้างที่ใช้จัดหน้าแบบจอคอมเมื่อจอจริงแคบกว่านี้
const DESKTOP_MIN = 1024

function readMode(): LayoutMode {
  try {
    const v = localStorage.getItem(KEY)
    return v === 'web' || v === 'mobile' ? v : 'auto'
  } catch {
    return 'auto'
  }
}

let state: LayoutState = { mode: readMode(), isMobile: false, isPhone: false }
const listeners = new Set<() => void>()

/** หน้าตาที่ "อัตโนมัติ" จะเลือกให้ */
function autoLayout() {
  const mobile = matchMedia(MQ_MOBILE).matches
  return { mobile, phone: mobile && matchMedia(MQ_PHONE).matches }
}

function apply() {
  const root = document.documentElement
  const mode = state.mode

  const auto = autoLayout()
  const isMobile = mode === 'mobile' || (mode === 'auto' && auto.mobile)
  const isPhone = mode === 'mobile' || (mode === 'auto' && auto.phone)

  // โหมด web บนจอแคบ → ย่อหน้าจอคอม (กว้าง 1280px) ให้พอดีความกว้างจอ และสูงเต็มจอพอดี
  const w = root.clientWidth || innerWidth
  const scaled = mode === 'web' && w < DESKTOP_MIN
  root.classList.toggle('web-scaled', scaled)
  if (scaled) {
    const scale = w / DESKTOP_W
    // สูงแบบจอคอมทั่วไป 720–900px (ไม่ยืดตามจอมือถือแนวตั้ง ซึ่งจะทำให้กราฟยืดผิดสัดส่วน)
    const h = Math.min(900, Math.max(720, Math.round(innerHeight / scale)))
    root.style.setProperty('--web-scale', scale.toFixed(4))
    root.style.setProperty('--web-h', `${h}px`)
  } else {
    root.style.removeProperty('--web-scale')
    root.style.removeProperty('--web-h')
  }

  root.classList.toggle('is-mobile', isMobile)
  root.classList.toggle('is-phone', isPhone)
  root.classList.toggle('force-mobile', mode === 'mobile')
  root.dataset.layout = mode

  if (state.isMobile !== isMobile || state.isPhone !== isPhone || state.mode !== mode) {
    state = { mode, isMobile, isPhone }
    listeners.forEach((l) => l())
  }
}

/** เลือกโหมด — ถ้าตรงกับที่อัตโนมัติจะเลือกอยู่แล้ว ให้กลับเป็น auto (ตามขนาดจอต่อไป) */
export function setLayout(target: 'web' | 'mobile') {
  const autoMatches = (target === 'mobile') === autoLayout().mobile
  const mode: LayoutMode = autoMatches ? 'auto' : target
  try {
    if (mode === 'auto') localStorage.removeItem(KEY)
    else localStorage.setItem(KEY, mode)
  } catch { /* ignore */ }
  state = { ...state, mode }
  apply()
  listeners.forEach((l) => l())
  scrollTo(0, 0)
}

/** เรียกครั้งเดียวตอนเริ่มแอป (ก่อน render) */
export function initLayout() {
  // ล้างค่า viewport แบบเก่า (เวอร์ชันก่อนตั้ง width=1280 ไว้)
  document.querySelector('meta[name=viewport]')
    ?.setAttribute('content', 'width=device-width, initial-scale=1.0, viewport-fit=cover')

  apply()
  for (const q of [MQ_MOBILE, MQ_PHONE]) matchMedia(q).addEventListener('change', apply)
  // สำรอง: บางเบราว์เซอร์ไม่ส่ง change ของ media query ทุกครั้ง (เช่นตอนหมุนจอ/แท็บถูกซ่อน)
  let raf = 0
  const reapply = () => { cancelAnimationFrame(raf); raf = requestAnimationFrame(apply) }
  addEventListener('resize', reapply)
  addEventListener('orientationchange', reapply)
  addEventListener('load', apply)
}

export function useLayout(): LayoutState {
  return useSyncExternalStore(
    (cb) => { listeners.add(cb); return () => listeners.delete(cb) },
    () => state,
  )
}
