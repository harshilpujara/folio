import { useRef, useState } from 'react'
import { WaveTransition } from '@/components/ui/wave-transition'

// The usage example from the component's metadata, filled out to a full screen.
// The trigger lives in `overlay`, so it stays put while the wave crosses both views.
export default function WaveDemo() {
  const [revealed, setRevealed] = useState(false)
  const triggerRef = useRef(null)

  return (
    <WaveTransition
      revealed={revealed}
      source={triggerRef}
      palette="rainbow"
      className="h-full w-full"
      revealedContent={
        <section className="grid h-full place-items-center bg-[#f4f1ec] px-6 text-center text-[#17151a]">
          <div>
            <p className="text-[13px] font-medium uppercase tracking-[0.16em] text-black/45">New view</p>
            <h1 className="mt-2 text-[44px] font-semibold tracking-tight sm:text-[56px]">Good morning.</h1>
            <p className="mx-auto mt-3 max-w-sm text-[15px] text-black/55">The wave opened from the button and carried this view in.</p>
          </div>
        </section>
      }
      overlay={
        <button
          ref={triggerRef}
          type="button"
          onClick={() => setRevealed((value) => !value)}
          className={`absolute bottom-[12%] left-1/2 -translate-x-1/2 rounded-full px-6 py-3 text-[15px] font-semibold shadow-lg ${
            revealed ? 'bg-[#17151a] text-white shadow-black/20' : 'bg-white text-black shadow-black/50'
          }`}
        >
          Toggle view
        </button>
      }
    >
      <section className="grid h-full place-items-center bg-[#0b0b0d] px-6 text-center">
        <div>
          <p className="text-[13px] font-medium uppercase tracking-[0.16em] text-white/40">Current view</p>
          <h1 className="mt-2 text-[44px] font-semibold tracking-tight sm:text-[56px]">Good night.</h1>
          <p className="mx-auto mt-3 max-w-sm text-[15px] text-white/50">Tap the button to send a light wave across the screen.</p>
        </div>
      </section>
    </WaveTransition>
  )
}
