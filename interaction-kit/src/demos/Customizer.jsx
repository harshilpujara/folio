import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, animate, motion, useAnimationFrame, useMotionTemplate, useMotionValue, useTransform } from 'framer-motion'

const COLORS = [
  { id: 'graphite', name: 'Graphite', fill: 'linear-gradient(135deg,#4a4a52 0%,#26262b 45%,#0f0f12 100%)', swatch: '#3a3a40', glow: '#8b8b99' },
  { id: 'ember', name: 'Ember', fill: 'linear-gradient(135deg,#ffb067 0%,#f0622a 45%,#8f1d0b 100%)', swatch: '#f0622a', glow: '#ff7a2f' },
  { id: 'cobalt', name: 'Cobalt', fill: 'linear-gradient(135deg,#8ab4ff 0%,#2f6bff 45%,#0b1f73 100%)', swatch: '#2f6bff', glow: '#3d7bff' },
  { id: 'sage', name: 'Sage', fill: 'linear-gradient(135deg,#cfe8c6 0%,#6fa284 45%,#1f4536 100%)', swatch: '#6fa284', glow: '#6fd39a' },
  { id: 'rose', name: 'Rosé', fill: 'linear-gradient(135deg,#ffd1e3 0%,#f06aa5 45%,#7a1043 100%)', swatch: '#f06aa5', glow: '#ff5fa8' },
]

const PERIOD = 4 // seconds per idle cycle
const FLOAT = 6 // px
const TILT = 2 // deg, on Y

export default function Customizer() {
  const [base, setBase] = useState(COLORS[0])
  const [target, setTarget] = useState(COLORS[0])
  const [wipes, setWipes] = useState([])
  const [ripples, setRipples] = useState([])
  const objectRef = useRef(null)
  const nextId = useRef(0)

  // Idle loop. A sine is an ease-in-out by nature, and driving it from the frame
  // clock means it never stops: a tap changes its amplitude, not its phase.
  const amp = useMotionValue(1)
  const kick = useMotionValue(0)
  const y = useMotionValue(0)
  const rotateY = useMotionValue(0)
  useAnimationFrame((t) => {
    const phase = (t / 1000 / PERIOD) * Math.PI * 2
    const a = amp.get()
    y.set(-FLOAT * a * Math.sin(phase) + kick.get())
    rotateY.set(TILT * a * Math.sin(phase + Math.PI / 2))
  })
  // Light follows the object: the specular band slides with the tilt, the floor
  // shadow tightens and fades as the object rises.
  const bandX = useTransform(rotateY, [-TILT * 3, TILT * 3], ['-34%', '34%'])
  const shadowScale = useTransform(y, [-FLOAT * 3, FLOAT * 2], [0.78, 1.04])
  const shadowOpacity = useTransform(y, [-FLOAT * 3, FLOAT * 2], [0.35, 0.75])

  const choose = (color, e) => {
    if (color.id === target.id) return
    const box = objectRef.current.getBoundingClientRect()
    const swatch = e.currentTarget.getBoundingClientRect()
    // Wipe origin: the tapped swatch, in the object's own coordinates (below it).
    const x = swatch.left + swatch.width / 2 - box.left
    const yy = swatch.top + swatch.height / 2 - box.top
    // Radius that reaches the farthest corner, which from a swatch below the
    // object is roughly 150% of its size.
    const r = Math.max(
      Math.hypot(x, yy), Math.hypot(box.width - x, yy),
      Math.hypot(x, box.height - yy), Math.hypot(box.width - x, box.height - yy),
    ) * 1.04
    const id = nextId.current++
    setWipes((w) => [...w, { id, color, x, y: yy, r }])
    setRipples((rs) => [...rs, { id, colorId: color.id }])
    setTarget(color)

    // Reaction bounce: float amplitude swells, then eases back to the idle loop.
    animate(amp, [amp.get(), 2.4, 1], { duration: 1.4, times: [0, 0.22, 1], ease: ['easeOut', 'easeInOut'] })
    animate(kick, 0, { type: 'spring', stiffness: 220, damping: 11, velocity: -140 })
  }

  const landed = (wipe) => {
    setBase(wipe.color)
    setWipes((w) => w.filter((x) => x.id > wipe.id))
  }

  return (
    <div className="relative flex h-full flex-col items-center justify-center overflow-hidden bg-[#09090b]">
      {/* Ambient glow picks up the colour of the object. */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-[42%] size-[620px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-25 blur-[120px]"
        animate={{ backgroundColor: target.glow }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
      />
      <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/60 to-transparent" />

      {/* The object. The outer box is untransformed, so it's the coordinate space for the wipe. */}
      <div className="relative" style={{ perspective: 900 }}>
        <div ref={objectRef} className="relative aspect-[1.586] w-[min(84vw,400px)]">
          <motion.div
            style={{ y, rotateY, boxShadow: '0 30px 60px -24px rgba(0,0,0,0.8), 0 0 0 1px rgba(255,255,255,0.08) inset, 0 1px 0 rgba(255,255,255,0.28) inset' }}
            className="absolute inset-0 overflow-hidden rounded-[22px]"
          >
            <div className="absolute inset-0" style={{ background: base.fill }} />
            {wipes.map((w) => <Wipe key={w.id} wipe={w} onDone={() => landed(w)} />)}

            {/* Brushed texture and edge light. */}
            <div className="absolute inset-0 bg-[repeating-linear-gradient(90deg,rgba(255,255,255,0.035)_0_1px,transparent_1px_3px)]" />
            <div className="absolute inset-0 bg-[radial-gradient(120%_90%_at_10%_0%,rgba(255,255,255,0.22),transparent_45%)]" />
            {/* Specular highlight band. */}
            <motion.div
              style={{ x: bandX }}
              className="absolute -inset-y-4 -left-1/2 w-[200%] bg-[linear-gradient(105deg,transparent_38%,rgba(255,255,255,0.08)_45%,rgba(255,255,255,0.32)_50%,rgba(255,255,255,0.08)_55%,transparent_62%)] mix-blend-screen"
            />

            <CardFace />
          </motion.div>
        </div>
        {/* Floor shadow */}
        <motion.div
          aria-hidden
          style={{ scaleX: shadowScale, opacity: shadowOpacity }}
          className="mx-auto mt-7 h-5 w-[72%] rounded-[50%] bg-black blur-[14px]"
        />
      </div>

      <div className="relative mt-12 flex flex-col items-center">
        <p className="text-[13px] font-medium uppercase tracking-[0.16em] text-white/45">Tap a color</p>
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.p
            key={target.id}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ type: 'spring', stiffness: 400, damping: 32 }}
            className="mt-1 text-[15px] text-white/85"
          >
            {target.name}
          </motion.p>
        </AnimatePresence>
        <div className="mt-5 flex gap-4">
          {COLORS.map((c) => (
            <motion.button
              key={c.id}
              type="button"
              aria-label={c.name}
              aria-pressed={target.id === c.id}
              onClick={(e) => choose(c, e)}
              whileTap={{ scale: 0.88 }}
              transition={{ type: 'spring', stiffness: 600, damping: 26 }}
              className="relative size-10 rounded-full"
            >
              {target.id === c.id && (
                <motion.span
                  layoutId="swatch-ring"
                  transition={{ type: 'spring', stiffness: 500, damping: 34 }}
                  className="absolute -inset-[5px] rounded-full border-2 border-white/85"
                />
              )}
              <span className="absolute inset-0 rounded-full shadow-[inset_0_1px_0_rgba(255,255,255,0.35),0_4px_12px_rgba(0,0,0,0.5)]" style={{ background: c.fill }} />
              {ripples.filter((r) => r.colorId === c.id).map((r) => (
                <motion.span
                  key={r.id}
                  initial={{ scale: 1, opacity: 0.6 }}
                  animate={{ scale: 2.4, opacity: 0 }}
                  transition={{ duration: 0.6, ease: 'easeOut' }}
                  onAnimationComplete={() => setRipples((rs) => rs.filter((x) => x.id !== r.id))}
                  className="pointer-events-none absolute inset-0 rounded-full border-2"
                  style={{ borderColor: c.swatch }}
                />
              ))}
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  )
}

// New colour on top of the old one, revealed by an expanding clip-path circle.
function Wipe({ wipe, onDone }) {
  const r = useMotionValue(0)
  const clip = useMotionTemplate`circle(${r}px at ${wipe.x}px ${wipe.y}px)`
  useEffect(() => {
    const controls = animate(r, wipe.r, { duration: 0.5, ease: 'easeOut', onComplete: onDone })
    return () => controls.stop()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  return (
    <motion.div
      className="absolute inset-0"
      style={{ background: wipe.color.fill, clipPath: clip, WebkitClipPath: clip }}
    />
  )
}

function CardFace() {
  return (
    <div className="relative flex h-full flex-col justify-between p-[7%] text-white/90 [text-shadow:0_1px_1px_rgba(0,0,0,0.35)]">
      <div className="flex items-start justify-between">
        <span className="text-[19px] font-semibold tracking-tight">kit<span className="text-white/50">.</span></span>
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" className="rotate-90 opacity-80" aria-hidden>
          <path d="M8.5 15a5 5 0 0 1 0-6M12 17.5a9 9 0 0 0 0-11M15.5 20a13 13 0 0 0 0-16" />
        </svg>
      </div>
      <div className="h-[22%] w-[15%] rounded-[6px] bg-[linear-gradient(135deg,#f6e7b8,#c9a95b_50%,#f1dfa6)] shadow-[inset_0_0_0_1px_rgba(0,0,0,0.18)]">
        <div className="h-full w-full rounded-[6px] bg-[linear-gradient(90deg,transparent_32%,rgba(0,0,0,0.18)_33%,transparent_34%,transparent_65%,rgba(0,0,0,0.18)_66%,transparent_67%),linear-gradient(transparent_48%,rgba(0,0,0,0.18)_49%,transparent_51%)]" />
      </div>
      <div className="flex items-end justify-between">
        <span className="text-[15px] tracking-[0.18em] tabular-nums">•••• 2026</span>
        <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-white/60">Edition 01</span>
      </div>
    </div>
  )
}
