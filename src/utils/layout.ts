import { useSyncExternalStore } from 'react'

/**
 * โหมดการแสดงผล
 * - auto   : เลือกตามขนาดจอ (ค่าเริ่มต้น)
 * - web    : บังคับหน้าตาแบบจอคอม (บนมือถือจะตั้ง viewport กว้าง 1280px แล้วย่อพอดีจอ)
 * - mobile : บังคับหน้าตาแบบมือถือ (บนจอคอมแสดงเป็นกรอบกว้างเท่าโทรศัพท์ตรงกลาง)
 *
 * ผลลัพธ์ใส่เป็น class บน <html>: is-mobile (แท็บเล็ต/มือถือ), is-phone (จอโทรศัพท์), force-mobile
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
const VIEWPORT_DEVICE = 'width=device-width, initial-scale=1.0, viewport-fit=cover'
const DESKTOP_W = 1280
/** viewport แบบเดสก์ท็อป: กว้าง 1280px — เบราว์เซอร์มือถือจะซูมออกให้พอดีความกว้างจอเอง */
const viewportDesktop = () => `width=${DESKTOP_W}, viewport-fit=cover`
const isDesktopViewport = () =>
  document.querySelector('meta[name=viewport]')?.getAttribute('content')?.startsWith(`width=${DESKTOP_W}`) ?? false

function readMode(): LayoutMode {
  try {
    const v = localStorage.getItem(KEY)
    return v === 'web' || v === 'mobile' ? v : 'auto'
  } catch {
    return 'auto'
  }
}

/** อุปกรณ์จอสัมผัสขนาดเล็ก (มือถือ/แท็บเล็ต) — ดูจากขนาดจอจริง ไม่ขึ้นกับ viewport ที่เราตั้ง */
const smallDevice = () =>
  matchMedia('(pointer: coarse)').matches && Math.min(screen.width, screen.height) < 1024

const wantsDesktopViewport = (mode: LayoutMode) => mode === 'web' && smallDevice()

let state: LayoutState = { mode: readMode(), isMobile: false, isPhone: false }
const listeners = new Set<() => void>()

/** หน้าตาที่ "อัตโนมัติ" จะเลือกให้ */
function autoLayout() {
  const viewportIsDevice = !isDesktopViewport()
  // ปกติดูจาก viewport · ถ้าเราตั้ง viewport 1280 ไว้ (โหมด web บนมือถือ) ให้ดูจากอุปกรณ์แทน
  const mobile = viewportIsDevice ? matchMedia(MQ_MOBILE).matches : smallDevice()
  const phone = viewportIsDevice ? matchMedia(MQ_PHONE).matches : Math.min(screen.width, screen.height) <= 640
  return { mobile, phone: mobile && phone }
}

function apply() {
  const root = document.documentElement
  const mode = state.mode

  // web บนอุปกรณ์จอเล็ก → ให้เบราว์เซอร์จัดหน้ากว้าง 1280px (เหมือน "ขอเว็บไซต์เดสก์ท็อป")
  // (ตอนโหลดหน้า index.html ตั้งค่านี้ไว้แล้ว ที่นี่แค่ทำให้ตรงกัน)
  const vp = document.querySelector('meta[name=viewport]')
  const wantVp = wantsDesktopViewport(mode) ? viewportDesktop() : VIEWPORT_DEVICE
  if (vp && vp.getAttribute('content') !== wantVp) vp.setAttribute('content', wantVp)

  const auto = autoLayout()
  const isMobile = mode === 'mobile' || (mode === 'auto' && auto.mobile)
  const isPhone = mode === 'mobile' || (mode === 'auto' && auto.phone)

  root.classList.toggle('is-mobile', isMobile)
  root.classList.toggle('is-phone', isPhone)
  root.classList.toggle('force-mobile', mode === 'mobile')
  root.dataset.layout = mode

  state = { mode, isMobile, isPhone }
  listeners.forEach((l) => l())
}

/** เลือกโหมด — ถ้าตรงกับที่อัตโนมัติจะเลือกอยู่แล้ว ให้กลับเป็น auto (ตามขนาดจอต่อไป) */
export function setLayout(target: 'web' | 'mobile') {
  const before = state.mode
  const autoMatches = (target === 'mobile') === autoLayout().mobile
  const mode: LayoutMode = autoMatches ? 'auto' : target
  try {
    if (mode === 'auto') localStorage.removeItem(KEY)
    else localStorage.setItem(KEY, mode)
  } catch { /* ignore */ }

  // บนมือถือ การสลับเข้า/ออกโหมด web ต้องเปลี่ยน viewport → รีโหลดหน้าให้เบราว์เซอร์ซูมใหม่ถูกต้อง
  if (wantsDesktopViewport(before) !== wantsDesktopViewport(mode)) {
    location.reload()
    return
  }
  state = { ...state, mode }
  apply()
}

/** เรียกครั้งเดียวตอนเริ่มแอป (ก่อน render) */
export function initLayout() {
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
