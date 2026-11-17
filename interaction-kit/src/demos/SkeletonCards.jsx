import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Headphones, Lamp, Watch } from '../icons.jsx'

const PRODUCTS = [
  { name: 'Aero Headphones', price: '$349', Icon: Headphones, bg: 'radial-gradient(80% 70% at 30% 20%,#7dd3fc,transparent 60%),linear-gradient(150deg,#1e3a8a,#0f172a)' },
  { name: 'Lumen Desk Lamp', price: '$129', Icon: Lamp, bg: 'radial-gradient(80% 70% at 70% 20%,#fde68a,transparent 60%),linear-gradient(150deg,#9a3412,#1c1917)' },
  { name: 'Field Watch', price: '$289', Icon: Watch, bg: 'radial-gradient(80% 70% at 40% 25%,#a7f3d0,transparent 60%),linear-gradient(150deg,#065f46,#0b1512)' },
]

const EASE = [0.22, 1, 0.36, 1]
const DUR = 0.3

// Timing lives entirely in variants: the row staggers cards by 150ms, each card
// staggers its slots by 100ms. A slot's skeleton and content are both its
// children, so they swap on exactly the same beat.
const row = { loading: {}, loaded: { transition: { staggerChildren: 0.15 } } }
const card = { loading: {}, loaded: { transition: { staggerChildren: 0.1 } } }
const slot = { loading: {}, loaded: {} }
const skeletonOut = { loading: { opacity: 1 }, loaded: { opacity: 0, transition: { duration: DUR, ease: EASE } } }
const imageIn = { loading: { opacity: 0, scale: 0.95 }, loaded: { opacity: 1, scale: 1, transition: { duration: DUR, ease: EASE } } }
const textIn = { loading: { opacity: 0, y: 8 }, loaded: { opacity: 1, y: 0, transition: { duration: DUR, ease: EASE } } }

export default function SkeletonCards() {
  const [loaded, setLoaded] = useState(false)
  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), 1500)
    return () => clearTimeout(t)
  }, [])

  return (
    <div className="grid h-full place-items-center overflow-hidden bg-[#0b0b0d] px-3 sm:px-6">
      <div className="w-full max-w-3xl">
        <div className="mb-5 flex items-end justify-between px-1">
          <div>
            <p className="text-[13px] font-medium text-white/40">New this week</p>
            <h1 className="mt-1 text-[26px] font-semibold tracking-tight sm:text-[30px]">Desk essentials</h1>
          </div>
        </div>
        <motion.ul
          variants={row}
          initial="loading"
          animate={loaded ? 'loaded' : 'loading'}
          aria-busy={!loaded}
          className="grid grid-cols-3 gap-2.5 sm:gap-4"
        >
          {PRODUCTS.map((p) => (
            <motion.li key={p.name} variants={card} className="rounded-2xl border border-white/[0.06] bg-[#141418] p-2 sm:p-3">
              <motion.div variants={slot} className="relative aspect-[4/5] overflow-hidden rounded-xl">
                <motion.div variants={skeletonOut} className="shimmer absolute inset-0 rounded-xl" />
                <motion.div variants={imageIn} style={{ background: p.bg }} className="absolute inset-0 grid place-items-center rounded-xl">
                  <p.Icon width="42%" height="42%" strokeWidth={1.2} className="text-white/90 drop-shadow-[0_10px_20px_rgba(0,0,0,0.45)]" />
                </motion.div>
              </motion.div>

              <motion.div variants={slot} className="relative mt-3 h-5">
                <motion.div variants={skeletonOut} className="shimmer absolute inset-y-[3px] left-0 w-4/5 rounded-md" />
                <motion.p variants={textIn} className="truncate text-[13px] font-medium leading-5 sm:text-[15px]">{p.name}</motion.p>
              </motion.div>

              <motion.div variants={slot} className="relative mt-1.5 h-5">
                <motion.div variants={skeletonOut} className="shimmer absolute inset-y-[3px] left-0 w-2/5 rounded-md" />
                <motion.p variants={textIn} className="text-[13px] leading-5 text-white/55 tabular-nums sm:text-[15px]">{p.price}</motion.p>
              </motion.div>
            </motion.li>
          ))}
        </motion.ul>
      </div>
    </div>
  )
}
