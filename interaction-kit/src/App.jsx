import { useCallback, useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import WaveDemo from './demos/WaveDemo.jsx'
import WalletDemo from './demos/WalletDemo.jsx'
import PhotoBoxDemo from './demos/PhotoBoxDemo.jsx'
import NotFoundDemo from './demos/NotFoundDemo.jsx'
import { ArrowLeft, Arrow, Eye, Replay } from './icons.jsx'

export const DEMOS = [
  { slug: 'wave', title: 'Wave Transition', note: 'A soft rainbow light wave carries one view into the next, from the button.', Component: WaveDemo },
  { slug: 'wallet', title: 'Wallet Balance', note: 'Cards tuck into a leather pouch; the eye masks and reveals balances.', Component: WalletDemo },
  { slug: 'photo-box', title: 'Photo Box', note: 'Frosted cover, sliding paper box, fanning polaroids, full-bleed zoom.', Component: PhotoBoxDemo },
  { slug: 'not-found', title: 'Not Found', note: 'A frosted-glass 404 with pointer parallax and recovery actions.', Component: NotFoundDemo },
]

const readRoute = () => {
  const slug = window.location.hash.replace(/^#\/?/, '')
  const i = DEMOS.findIndex((d) => d.slug === slug)
  return i
}

export default function App() {
  const [index, setIndex] = useState(readRoute)
  const [chrome, setChrome] = useState(() => !new URLSearchParams(window.location.search).has('clean'))
  const [run, setRun] = useState(0)

  useEffect(() => {
    const onHash = () => { setIndex(readRoute()); setRun(0) }
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])

  const go = useCallback((i) => {
    window.location.hash = i < 0 ? '' : `/${DEMOS[(i + DEMOS.length) % DEMOS.length].slug}`
  }, [])

  useEffect(() => {
    const onKey = (e) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return
      if (e.target instanceof HTMLElement && e.target.closest('input, textarea')) return
      const k = e.key.toLowerCase()
      if (k === 'h') setChrome((c) => !c)
      else if (index < 0) return
      else if (k === 'r') setRun((r) => r + 1)
      else if (e.key === 'ArrowRight') go(index + 1)
      else if (e.key === 'ArrowLeft') go(index - 1)
      // Escape belongs to the demo while something in it has focus (Photo Box uses it).
      else if (e.key === 'Escape' && document.activeElement === document.body) go(-1)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [index, go])

  if (index < 0) return <Index />

  const demo = DEMOS[index]
  const { Component } = demo
  return (
    <div className="relative h-full overflow-hidden">
      <Component key={`${demo.slug}-${run}`} />

      <AnimatePresence>
        {chrome && (
          <motion.nav
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ type: 'spring', stiffness: 420, damping: 34 }}
            className="pointer-events-none absolute inset-x-0 top-0 z-50 flex items-start justify-between gap-3 p-3 sm:p-4"
          >
            <div className="pointer-events-auto flex items-center gap-1 rounded-full border border-white/10 bg-black/40 p-1 pr-3 text-[13px] text-white/70 backdrop-blur-xl">
              <a href="#" aria-label="All demos" className="grid size-8 place-items-center rounded-full hover:bg-white/10 hover:text-white"><ArrowLeft width={16} height={16} /></a>
              <span className="tabular-nums text-white/40">0{index + 1}</span>
              <span className="ml-1.5 hidden truncate text-white/80 sm:inline">{demo.title}</span>
            </div>
            <div className="pointer-events-auto flex items-center gap-1 rounded-full border border-white/10 bg-black/40 p-1 text-white/70 backdrop-blur-xl">
              <ChromeButton label="Replay (R)" onClick={() => setRun((r) => r + 1)}><Replay width={16} height={16} /></ChromeButton>
              <ChromeButton label="Previous" onClick={() => go(index - 1)}><ArrowLeft width={16} height={16} /></ChromeButton>
              <ChromeButton label="Next" onClick={() => go(index + 1)}><Arrow width={16} height={16} /></ChromeButton>
              <ChromeButton label="Hide controls for recording (H)" onClick={() => setChrome(false)}><Eye width={16} height={16} /></ChromeButton>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>

      {!chrome && (
        // Invisible corner hotspot so touch devices can bring the controls back.
        <button type="button" aria-label="Show controls" onClick={() => setChrome(true)} className="absolute left-0 top-0 z-50 size-14 opacity-0" />
      )}
    </div>
  )
}

function ChromeButton({ label, onClick, children }) {
  return (
    <button type="button" title={label} aria-label={label} onClick={onClick} className="grid size-8 place-items-center rounded-full hover:bg-white/10 hover:text-white">
      {children}
    </button>
  )
}

function Index() {
  return (
    <main className="mx-auto min-h-full max-w-3xl px-4 py-12 sm:py-20">
      <p className="text-[13px] text-white/40">Interaction Kit</p>
      <h1 className="mt-2 text-3xl font-medium tracking-tight sm:text-4xl">EasyUI motion components</h1>
      <p className="mt-3 max-w-lg text-[15px] leading-relaxed text-white/55">
        Four EasyUI components, each running full screen so it can be recorded as its own clip.
      </p>
      <ol className="mt-10 grid gap-2 sm:grid-cols-2">
        {DEMOS.map((d, i) => (
          <li key={d.slug}>
            <motion.a
              href={`#/${d.slug}`}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              className="group flex h-full flex-col rounded-2xl border border-white/[0.07] bg-white/[0.03] p-4 hover:border-white/15 hover:bg-white/[0.05]"
            >
              <span className="text-[12px] tabular-nums text-white/35">0{i + 1}</span>
              <span className="mt-6 text-[15px] font-medium text-white/90">{d.title}</span>
              <span className="mt-1 text-[13px] leading-snug text-white/45">{d.note}</span>
            </motion.a>
          </li>
        ))}
      </ol>
      <p className="mt-10 text-[13px] leading-relaxed text-white/35">
        Keys: <Kbd>←</Kbd> <Kbd>→</Kbd> switch, <Kbd>R</Kbd> replay, <Kbd>H</Kbd> hide controls, <Kbd>Esc</Kbd> back here. Add <code className="text-white/55">?clean</code> to the URL to start with controls hidden.
      </p>
    </main>
  )
}

function Kbd({ children }) {
  return <kbd className="rounded-md border border-white/10 bg-white/5 px-1.5 py-0.5 font-sans text-[12px] text-white/60">{children}</kbd>
}
