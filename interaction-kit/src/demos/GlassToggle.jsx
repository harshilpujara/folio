import { useLayoutEffect, useRef, useState } from 'react'
import { AnimatePresence, LayoutGroup, animate, motion, useMotionValue, useMotionValueEvent, useTransform } from 'framer-motion'

const OPTIONS = [
  { label: 'Day', value: '4h 12m', note: 'Today so far' },
  { label: 'Week', value: '29h 40m', note: 'Mon 16 – Sun 22 Nov' },
  { label: 'Month', value: '126h', note: 'November' },
]
// damping / (2 * sqrt(stiffness)) = 0.75: a small elastic overshoot on arrival.
const SPRING = { type: 'spring', stiffness: 400, damping: 30 }
const clamp01 = (v) => Math.min(1, Math.max(0, v))

export default function GlassToggle() {
  const [active, setActive] = useState(1)
  const buttons = useRef([])
  const geo = useRef([]) // { c: centre x, w: width } per option, in track coordinates
  const from = useRef(0)
  const to = useRef(0)

  // progress runs 0 -> 1 on the same spring, started on the same frame, as the
  // layoutId animation, so it is that trip's progress. The stretch and the
  // label colours are both read off it; there is no separate transition.
  const progress = useMotionValue(1)
  const pillX = useMotionValue(0)
  useMotionValueEvent(progress, 'change', (p) => pillX.set(from.current + (to.current - from.current) * p))
  const bulge = useTransform(progress, (p) => Math.sin(Math.PI * clamp01(p))) // 0 at ends, 1 mid-trip
  const scaleX = useTransform(bulge, [0, 1], [1, 1.08])
  const scaleY = useTransform(bulge, [0, 1], [1, 0.94]) // keep the volume, so it reads as liquid

  useLayoutEffect(() => {
    const measure = () => {
      geo.current = buttons.current.map((b) => ({ c: b.offsetLeft + b.offsetWidth / 2, w: b.offsetWidth }))
      if (!progress.isAnimating()) pillX.set(geo.current[active].c)
    }
    measure()
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const select = (i) => {
    if (i === active) return
    from.current = pillX.get()
    to.current = geo.current[i].c
    progress.jump(0)
    animate(progress, 1, SPRING)
    setActive(i)
  }

  return (
    <div className="relative grid h-full place-items-center overflow-hidden bg-[#08080a]">
      <Backdrop />

      <div className="relative flex flex-col items-center">
        <p className="text-[13px] font-medium uppercase tracking-[0.16em] text-white/45">Screen time</p>
        <div className="relative mt-3 h-[60px] w-[280px] overflow-hidden text-center">
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.p
              key={active}
              initial={{ y: 28, opacity: 0, filter: 'blur(6px)' }}
              animate={{ y: 0, opacity: 1, filter: 'blur(0px)' }}
              exit={{ y: -28, opacity: 0, filter: 'blur(6px)' }}
              // Blur on a tween: a spring would overshoot it below zero.
              transition={{ ...SPRING, filter: { duration: 0.22, ease: 'easeOut' } }}
              className="absolute inset-x-0 text-[48px] font-semibold leading-[60px] tracking-tight tabular-nums"
            >
              {OPTIONS[active].value}
            </motion.p>
          </AnimatePresence>
        </div>
        <p className="mt-1 h-5 text-[14px] text-white/45">{OPTIONS[active].note}</p>

        <LayoutGroup id="glass-toggle">
          <div
            role="tablist"
            aria-label="Range"
            className="relative mt-10 flex rounded-full border border-white/10 bg-white/[0.06] p-1.5 shadow-[inset_0_1px_1px_rgba(0,0,0,0.4)]"
          >
            {OPTIONS.map((o, i) => (
              <button
                key={o.label}
                ref={(el) => (buttons.current[i] = el)}
                type="button"
                role="tab"
                aria-selected={active === i}
                onClick={() => select(i)}
                className="relative px-8 py-3.5 text-[17px] font-medium outline-none sm:px-10"
              >
                {active === i && (
                  <motion.span
                    layoutId="glass-pill"
                    transition={SPRING}
                    style={{
                      scaleX,
                      scaleY,
                      borderRadius: 999,
                      backdropFilter: 'blur(16px) saturate(160%)',
                      WebkitBackdropFilter: 'blur(16px) saturate(160%)',
                      boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.35), 0 8px 24px -6px rgba(0,0,0,0.55)',
                    }}
                    className="absolute inset-0 overflow-hidden border border-white/20 bg-white/15"
                  >
                    {/* Highlight across the top third sells the glass. */}
                    <span className="absolute inset-x-0 top-0 h-1/3 bg-gradient-to-b from-white/35 to-transparent" />
                  </motion.span>
                )}
                <Label index={i} pillX={pillX} geo={geo}>{o.label}</Label>
              </button>
            ))}
          </div>
        </LayoutGroup>
      </div>
    </div>
  )
}

// Colour and opacity follow the pill's live position, so a label lights up as
// the pill passes under it, including the middle one on a Day <-> Month trip.
function Label({ index, pillX, geo, children }) {
  const lit = useTransform(pillX, (x) => {
    const g = geo.current[index]
    if (!g) return index === 1 ? 1 : 0
    return clamp01(1 - Math.abs(x - g.c) / (g.w * 0.75))
  })
  const color = useTransform(lit, [0, 1], ['rgba(161,161,170,0.75)', 'rgba(255,255,255,1)'])
  return <motion.span style={{ color }} className="relative z-10 block select-none">{children}</motion.span>
}

// Dot grid plus slow coloured light, so there is real detail for the glass to blur.
function Backdrop() {
  return (
    <div aria-hidden className="absolute inset-0">
      <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.13)_1px,transparent_1.2px)] [background-size:18px_18px]" />
      <motion.div
        className="absolute left-1/2 top-1/2 size-[520px] -translate-x-[70%] -translate-y-[40%] rounded-full bg-[#5b5bff] opacity-50 blur-[90px]"
        animate={{ x: [0, 60, -20, 0], y: [0, -30, 40, 0] }}
        transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute left-1/2 top-1/2 size-[440px] -translate-x-[10%] -translate-y-[30%] rounded-full bg-[#ff4fa0] opacity-40 blur-[90px]"
        animate={{ x: [0, -50, 30, 0], y: [0, 40, -20, 0] }}
        transition={{ duration: 17, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute left-1/2 top-1/2 size-[360px] -translate-x-[40%] translate-y-[10%] rounded-full bg-[#21d4b4] opacity-35 blur-[80px]"
        animate={{ x: [0, 40, -40, 0], y: [0, 20, -30, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
      />
    </div>
  )
}
