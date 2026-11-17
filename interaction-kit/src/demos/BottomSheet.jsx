import { useLayoutEffect, useRef, useState } from 'react'
import { animate, motion, useDragControls, useMotionTemplate, useMotionValue, useTransform } from 'framer-motion'
import { Share, Plus, Download, Heart } from '../icons.jsx'

// One spring for open and dismiss. damping / (2 * sqrt(stiffness)) ~ 0.69, so it
// overshoots its resting point a little before settling.
const SPRING = { type: 'spring', stiffness: 300, damping: 24 }
// The sheet runs this far past the bottom edge, so the overshoot never shows a gap.
const BLEED = 56

const ROWS = [
  { Icon: Share, label: 'Share', meta: 'AirDrop, Messages, Mail' },
  { Icon: Plus, label: 'Add to album', meta: '3 albums' },
  { Icon: Download, label: 'Save to files', meta: '4.2 MB · HEIC' },
]

export default function BottomSheet() {
  const sheetRef = useRef(null)
  const height = useRef(800)
  const [open, setOpen] = useState(false)
  const openRef = useRef(false)
  openRef.current = open
  const controls = useDragControls()

  // Everything else on screen is derived from the sheet's y, so open, dismiss
  // and a half-way drag all move the background in lockstep with the sheet.
  const y = useMotionValue(1000)
  const progress = useTransform(y, (v) => Math.max(0, 1 - v / height.current))
  const bgScale = useTransform(progress, (p) => 1 - 0.04 * p)
  const bgRadius = useTransform(progress, (p) => Math.min(1, p) * 28)
  const blur = useTransform(progress, (p) => 12 * p)
  const dim = useTransform(progress, (p) => 0.35 * Math.min(1, p))
  const backdrop = useMotionTemplate`blur(${blur}px)`
  const scrimColor = useMotionTemplate`rgba(0,0,0,${dim})`

  useLayoutEffect(() => {
    const measure = () => {
      height.current = sheetRef.current.offsetHeight
      if (!openRef.current && !y.isAnimating()) y.set(height.current)
    }
    measure()
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [y])

  const show = () => {
    setOpen(true)
    animate(y, 0, SPRING)
  }
  const hide = (velocity = 0) => {
    setOpen(false)
    animate(y, height.current, { ...SPRING, velocity })
  }

  return (
    <div className="relative h-full overflow-hidden bg-black">
      {/* Background app content: shrinks and rounds off as the sheet rises. */}
      <motion.div
        style={{ scale: bgScale, borderRadius: bgRadius }}
        className="absolute inset-0 overflow-hidden bg-[#0e0e11]"
      >
        <div className="mx-auto flex h-full max-w-md flex-col px-5 pt-20 sm:justify-center sm:pt-0">
          <p className="text-[13px] font-medium text-white/40">Tuesday, 17 November</p>
          <h1 className="mt-1 text-[32px] font-semibold tracking-tight">For you</h1>

          <article className="relative mt-6 aspect-[4/5] overflow-hidden rounded-[28px] shadow-2xl shadow-black/60">
            <div className="absolute inset-0 bg-[radial-gradient(120%_80%_at_20%_0%,#3ee6c1_0%,transparent_55%),radial-gradient(90%_70%_at_100%_30%,#7b5cff_0%,transparent_60%),radial-gradient(120%_90%_at_50%_120%,#ff5f8f_0%,transparent_55%),linear-gradient(#0b1730,#120a26)]" />
            <div className="absolute inset-0 bg-[repeating-linear-gradient(90deg,rgba(255,255,255,.035)_0_2px,transparent_2px_7px)] mix-blend-overlay" />
            <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 bg-gradient-to-t from-black/70 to-transparent p-5 pt-24">
              <div>
                <p className="text-[12px] font-medium uppercase tracking-[0.14em] text-white/60">Memory</p>
                <h2 className="mt-1 text-2xl font-semibold leading-tight">Northern Lights</h2>
                <p className="mt-0.5 text-[13px] text-white/60">Tromsø · 38 photos</p>
              </div>
              <motion.button
                type="button"
                onClick={show}
                whileTap={{ scale: 0.94 }}
                transition={{ type: 'spring', stiffness: 600, damping: 30 }}
                className="shrink-0 rounded-full bg-white px-5 py-2.5 text-[15px] font-semibold text-black"
              >
                Open
              </motion.button>
            </div>
          </article>

          <div className="mt-4 grid grid-cols-2 gap-3">
            {['Lofoten', 'Senja'].map((t, i) => (
              <div key={t} className="flex items-center gap-3 rounded-2xl bg-white/[0.05] p-3">
                <div className={`size-10 rounded-xl ${i ? 'bg-gradient-to-br from-amber-300 to-rose-500' : 'bg-gradient-to-br from-sky-400 to-indigo-600'}`} />
                <div className="min-w-0">
                  <p className="truncate text-[14px] font-medium">{t}</p>
                  <p className="text-[12px] text-white/45">{i ? '12' : '24'} photos</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Backdrop: blur 0 -> 12px, driven by the same progress as the scale. */}
      <motion.div
        aria-hidden
        onClick={() => hide()}
        style={{ backdropFilter: backdrop, WebkitBackdropFilter: backdrop, backgroundColor: scrimColor }}
        className={`absolute inset-0 ${open ? '' : 'pointer-events-none'}`}
      />

      {/* The sheet. Only the handle starts a drag. */}
      <motion.div
        ref={sheetRef}
        role="dialog"
        aria-label="Northern Lights options"
        aria-hidden={!open}
        drag="y"
        dragControls={controls}
        dragListener={false}
        dragConstraints={{ top: 0 }}
        dragElastic={{ top: 0.08, bottom: 1 }}
        dragMomentum={false}
        onDragEnd={(_, info) => {
          const far = info.offset.y > height.current * 0.28
          const fast = info.velocity.y > 650
          if (far || fast) hide(info.velocity.y)
          else animate(y, 0, { ...SPRING, velocity: info.velocity.y })
        }}
        style={{ y, bottom: -BLEED, paddingBottom: BLEED, backdropFilter: 'blur(20px) saturate(170%)', WebkitBackdropFilter: 'blur(20px) saturate(170%)' }}
        className="absolute inset-x-0 mx-auto w-full max-w-[440px] select-none rounded-t-[30px] border border-b-0 border-white/10 bg-[rgba(30,30,36,0.55)] shadow-[0_-12px_60px_-12px_rgba(0,0,0,0.7)]"
      >
        <div
          onPointerDown={(e) => { e.preventDefault(); controls.start(e) }}
          className="flex h-7 cursor-grab touch-none items-center justify-center active:cursor-grabbing"
        >
          <span className="h-[5px] w-9 rounded-full bg-white/30" />
        </div>

        <div className="flex items-center gap-3 px-5 pb-4 pt-1">
          <div className="size-12 shrink-0 rounded-[14px]" style={{ background: 'radial-gradient(120% 80% at 20% 0%,#3ee6c1,transparent 60%),radial-gradient(120% 90% at 80% 110%,#ff5f8f,transparent 60%),#1a1440' }} />
          <div className="min-w-0 flex-1">
            <p className="truncate text-[16px] font-semibold">Northern Lights</p>
            <p className="text-[13px] text-white/50">38 photos · 12 Nov</p>
          </div>
          <button type="button" aria-label="Favourite" className="grid size-9 place-items-center rounded-full bg-white/10 text-white/80">
            <Heart width={18} height={18} />
          </button>
        </div>

        <ul className="mx-3 mb-4 overflow-hidden rounded-2xl bg-white/[0.06]">
          {ROWS.map(({ Icon, label, meta }, i) => (
            <li key={label} className={`flex items-center gap-3.5 px-4 py-3.5 ${i ? 'border-t border-white/[0.07]' : ''}`}>
              <span className="grid size-9 place-items-center rounded-[10px] bg-white/10 text-white/90"><Icon /></span>
              <span className="flex-1">
                <span className="block text-[15px] font-medium">{label}</span>
                <span className="block text-[12px] text-white/45">{meta}</span>
              </span>
            </li>
          ))}
        </ul>
        <div className="px-3 pb-5">
          <button type="button" onClick={() => hide()} className="w-full rounded-2xl bg-white/10 py-3.5 text-[15px] font-semibold text-white/90">
            Done
          </button>
        </div>
      </motion.div>
    </div>
  )
}
