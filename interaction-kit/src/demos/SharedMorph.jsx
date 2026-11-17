import { forwardRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Sun, Moon, Wave, Leaf, Flame, Flower, Close } from '../icons.jsx'

const CARDS = [
  { id: 'aurora', title: 'Aurora', kind: 'Ambient · 42 min', Icon: Moon, bg: 'linear-gradient(145deg,#38f9d7 0%,#3b82f6 55%,#6d28d9 100%)', text: 'Slow pads and field recordings from the Arctic circle. Built for late nights and long focus blocks.' },
  { id: 'ember', title: 'Ember', kind: 'Warm jazz · 38 min', Icon: Flame, bg: 'linear-gradient(145deg,#fde68a 0%,#fb923c 50%,#e11d48 100%)', text: 'Brushed drums, upright bass and a fireplace somewhere in the next room.' },
  { id: 'tide', title: 'Tide', kind: 'Ocean · 60 min', Icon: Wave, bg: 'linear-gradient(145deg,#a5f3fc 0%,#22d3ee 45%,#0e7490 100%)', text: 'Swell, foam and distant gulls. One hour, no loops you can hear.' },
  { id: 'moss', title: 'Moss', kind: 'Forest · 45 min', Icon: Leaf, bg: 'linear-gradient(145deg,#d9f99d 0%,#4ade80 50%,#15803d 100%)', text: 'Rain on a canopy, recorded under it. Soft enough to read through.' },
  { id: 'dusk', title: 'Dusk', kind: 'Lo-fi · 51 min', Icon: Sun, bg: 'linear-gradient(145deg,#fbcfe8 0%,#f472b6 45%,#7c3aed 100%)', text: 'Tape-warm beats for the last hour of light. Mellow, never sleepy.' },
  { id: 'bloom', title: 'Bloom', kind: 'Piano · 33 min', Icon: Flower, bg: 'linear-gradient(145deg,#fef3c7 0%,#fca5a5 50%,#db2777 100%)', text: 'Felt piano, recorded close. Quiet mornings and first coffee.' },
]

// ~450ms with a slight spring.
const MORPH = { type: 'spring', duration: 0.45, bounce: 0.18 }

export default function SharedMorph() {
  const [selected, setSelected] = useState(null)
  const [returning, setReturning] = useState(null)
  const card = CARDS.find((c) => c.id === selected)

  const open = (id) => { setReturning(null); setSelected(id) }
  const close = () => { setReturning(selected); setSelected(null) }

  return (
    <div className="relative h-full overflow-y-auto bg-[#0c0c0f]">
      <div className="relative mx-auto min-h-full max-w-2xl px-5 pb-16 pt-20">
        <AnimatePresence mode="popLayout" initial={false}>
          {card ? (
            <Detail key="detail" card={card} onClose={close} />
          ) : (
            <Grid key="grid" onOpen={open} returning={returning} />
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

// popLayout pulls the outgoing view out of flow so the incoming one measures
// its real position. It needs a ref on each direct child to do that.
const Grid = forwardRef(function Grid({ onOpen, returning }, ref) {
  return (
    <motion.section ref={ref} className="w-full">
      <motion.header initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, transition: { duration: 0.15 } }}>
        <p className="text-[13px] font-medium text-white/40">Soundscapes</p>
        <h1 className="mt-1 text-[32px] font-semibold tracking-tight">Collections</h1>
      </motion.header>
      <ul className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3">
        {CARDS.map((c, i) => {
          const back = c.id === returning
          return (
            <li key={c.id} className={back ? 'relative z-10' : 'relative'}>
              <button type="button" onClick={() => onOpen(c.id)} className="block w-full text-left">
                <Block card={c} radius={12} />
                {/* Everything around the block fades; the block itself never does. */}
                <motion.span
                  className="mt-2.5 block"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1, transition: { delay: back ? 0.35 : 0.12 + i * 0.03, duration: 0.25 } }}
                  exit={{ opacity: 0, transition: { duration: 0.12 } }}
                >
                  <span className="block text-[15px] font-medium">{c.title}</span>
                  <span className="block text-[12px] text-white/45">{c.kind}</span>
                </motion.span>
              </button>
            </li>
          )
        })}
      </ul>
    </motion.section>
  )
})

const Detail = forwardRef(function Detail({ card, onClose }, ref) {
  // Text arrives ~100ms after the morph has landed, so the eye follows one thing at a time.
  const after = (d = 0) => ({
    initial: { opacity: 0, y: 14 },
    animate: { opacity: 1, y: 0, transition: { delay: 0.55 + d, type: 'spring', stiffness: 380, damping: 32 } },
    exit: { opacity: 0, y: 6, transition: { duration: 0.12 } },
  })
  return (
    <motion.section ref={ref} className="relative z-10 w-full">
      <div className="relative">
        <Block card={card} radius={24} hero />
        <motion.button
          {...after()}
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute right-3 top-3 grid size-10 place-items-center rounded-full bg-black/30 text-white backdrop-blur-md"
        >
          <Close width={18} height={18} />
        </motion.button>
      </div>
      <motion.p {...after()} className="mt-6 text-[13px] font-medium uppercase tracking-[0.14em] text-white/45">{card.kind}</motion.p>
      <motion.h2 {...after(0.04)} className="mt-1 text-[40px] font-semibold leading-tight tracking-tight">{card.title}</motion.h2>
      <motion.p {...after(0.08)} className="mt-3 max-w-md text-[16px] leading-relaxed text-white/60">{card.text}</motion.p>
      <motion.div {...after(0.12)} className="mt-6 flex gap-2">
        <span className="rounded-full bg-white px-5 py-2.5 text-[15px] font-semibold text-black">Play</span>
        <span className="rounded-full bg-white/10 px-5 py-2.5 text-[15px] font-medium text-white/85">Download</span>
      </motion.div>
    </motion.section>
  )
})

// The shared element. Same layoutId in both views; position, size and corner
// radius morph continuously between them. The icon has its own layoutId so it is
// scale-corrected instead of stretching with the block.
function Block({ card, radius, hero }) {
  const { Icon } = card
  return (
    <motion.div
      layoutId={`card-${card.id}`}
      transition={MORPH}
      style={{ background: card.bg, borderRadius: radius }}
      className={`relative grid w-full place-items-center overflow-hidden ${hero ? 'aspect-[4/3]' : 'aspect-square'}`}
    >
      <motion.span
        layoutId={`icon-${card.id}`}
        transition={MORPH}
        className="grid place-items-center text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.25)]"
      >
        <Icon width={hero ? 72 : 36} height={hero ? 72 : 36} strokeWidth={1.6} />
      </motion.span>
    </motion.div>
  )
}
