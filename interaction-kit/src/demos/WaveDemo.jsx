import { useRef, useState } from 'react'
import { WaveTransition } from '@/components/ui/wave-transition'

// Portfolio oranges with a warm pink, so the wave reads as a sunrise, not a rainbow.
const PALETTE = ['#FF7A00', '#FFB877', '#FF4F7B']

// A few rows of the portfolio's pixel sky: solid orange, light orange and a
// 2px checker step, fixed so it never reshuffles between renders.
const SKY = [
  'dddlddlldddlldd',
  'dl.lddl.lldl.ld',
  '.l..l.l..l...l.',
]

export default function WaveDemo() {
  const [revealed, setRevealed] = useState(false)
  const triggerRef = useRef(null)

  return (
    <div className="relative grid h-full place-items-center overflow-hidden bg-[#0a0a0b] px-4">
      <div aria-hidden className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.08)_1px,transparent_1.2px)] [background-size:22px_22px]" />

      <WaveTransition
        revealed={revealed}
        source={triggerRef}
        type="center"
        palette={PALETTE}
        duration={1.25}
        className="relative aspect-[3/4] w-[min(88vw,380px)] rounded-[30px] shadow-[0_40px_80px_-30px_rgba(0,0,0,0.9),0_0_0_1px_rgba(255,255,255,0.06)]"
        revealedContent={<Builds />}
        overlay={
          <button
            ref={triggerRef}
            type="button"
            onClick={() => setRevealed((value) => !value)}
            className={`absolute bottom-6 right-6 flex items-center gap-2 rounded-full py-2.5 pl-4 pr-3 text-[14px] font-semibold transition-colors duration-300 ${
              revealed ? 'bg-[#1a1208] text-[#FFB877]' : 'bg-[#FF7A00] text-[#1a1208]'
            }`}
          >
            {revealed ? 'Back' : 'And then?'}
            <svg viewBox="0 0 16 16" className={`size-4 transition-transform duration-300 ${revealed ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="M3 8h10M9 4l4 4-4 4" />
            </svg>
          </button>
        }
      >
        <Designs />
      </WaveTransition>
    </div>
  )
}

function Designs() {
  return (
    <section className="flex h-full flex-col overflow-hidden rounded-[30px] bg-[#121214] text-white">
      <PixelSky />
      <div className="flex flex-1 flex-col px-7 pb-24 pt-7">
        <p className="text-[12px] font-medium uppercase tracking-[0.18em] text-white/40">Harshil Pujara · 01</p>
        <h1 className="mt-auto font-[family-name:var(--font-display)] text-[38px] italic leading-[1.05] tracking-tight">
          I design how products <span className="text-[#FF7A00]">behave</span>,
        </h1>
        <p className="mt-4 max-w-[16rem] text-[14px] leading-relaxed text-white/50">
          Flows, states and the motion in between, for enterprise health, field ops and travel.
        </p>
      </div>
    </section>
  )
}

function Builds() {
  return (
    <section className="flex h-full flex-col rounded-[30px] bg-[#FFF4E8] px-7 pb-24 pt-7 text-[#1a1208]">
      <p className="text-[12px] font-medium uppercase tracking-[0.18em] text-[#1a1208]/45">Harshil Pujara · 02</p>
      <h2 className="mt-auto font-[family-name:var(--font-display)] text-[38px] italic leading-[1.05] tracking-tight">
        …then I <span className="text-[#E85D00]">build</span> them.
      </h2>
      <ul className="mt-5 flex flex-wrap gap-1.5">
        {['React', 'Framer Motion', 'Tailwind', 'Figma to code'].map((t) => (
          <li key={t} className="rounded-full border border-[#1a1208]/15 px-3 py-1 text-[12.5px] font-medium text-[#1a1208]/75">{t}</li>
        ))}
      </ul>
    </section>
  )
}

function PixelSky() {
  return (
    <div aria-hidden className="grid shrink-0 grid-cols-[repeat(15,1fr)]">
      {SKY.flatMap((row, r) =>
        [...row].map((c, i) => (
          <span
            key={`${r}-${i}`}
            className="aspect-square"
            style={{
              background:
                c === 'd' ? '#FF7A00'
                : c === 'l' ? '#FFB877'
                : 'repeating-conic-gradient(#FF7A00 0 25%, transparent 0 50%) 0 0 / 4px 4px',
            }}
          />
        ))
      )}
    </div>
  )
}
