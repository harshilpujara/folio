import { useState } from 'react'
import { Reorder, useDragControls } from 'framer-motion'
import { Inbox, Calendar, Star, Folder, Music, Bolt, Grip } from '../icons.jsx'

const ITEMS = [
  { id: 'inbox', label: 'Inbox', meta: '12 unread', Icon: Inbox, tint: 'from-sky-400 to-blue-600' },
  { id: 'today', label: 'Today', meta: '5 tasks', Icon: Calendar, tint: 'from-amber-300 to-orange-500' },
  { id: 'starred', label: 'Starred', meta: '8 items', Icon: Star, tint: 'from-yellow-200 to-amber-500' },
  { id: 'projects', label: 'Projects', meta: '3 active', Icon: Folder, tint: 'from-violet-400 to-fuchsia-600' },
  { id: 'focus', label: 'Focus mix', meta: '2h 10m', Icon: Music, tint: 'from-emerald-300 to-teal-600' },
  { id: 'shortcuts', label: 'Shortcuts', meta: '14 saved', Icon: Bolt, tint: 'from-rose-400 to-red-600' },
]

// Shadows are much darker than Tailwind's defaults so the lift reads on a dark
// page and on camera. Same two-layer shape, so they interpolate cleanly.
const SHADOW_MD = '0 4px 6px -1px rgba(0,0,0,0.45), 0 2px 4px -2px rgba(0,0,0,0.45)'
const SHADOW_XL = '0 24px 32px -6px rgba(0,0,0,0.75), 0 10px 14px -6px rgba(0,0,0,0.6)'
const SPRING = { type: 'spring', stiffness: 500, damping: 40 }

export default function ReorderList() {
  const [items, setItems] = useState(ITEMS)
  const [top, setTop] = useState(null)

  return (
    <div className="grid h-full place-items-center overflow-hidden bg-[#1b1b20] px-5">
      <div className="w-full max-w-sm">
        <p className="text-[13px] font-medium text-white/40">Sidebar</p>
        <h1 className="mt-1 text-[28px] font-semibold tracking-tight">Pinned</h1>
        <p className="mt-1 text-[14px] text-white/45">Drag the handle to reorder.</p>

        <Reorder.Group axis="y" values={items} onReorder={setItems} className="mt-6 flex flex-col gap-2.5">
          {items.map((item) => (
            <Row key={item.id} item={item} onLift={() => setTop(item.id)} raised={top === item.id} />
          ))}
        </Reorder.Group>
      </div>
    </div>
  )
}

function Row({ item, onLift, raised }) {
  const controls = useDragControls()
  const { Icon } = item
  return (
    <Reorder.Item
      value={item}
      dragListener={false}
      dragControls={controls}
      onDragStart={onLift}
      // Layout reflow and the settle after drop share one spring: never a snap.
      transition={SPRING}
      whileDrag={{ scale: 1.03, rotate: 1.5, boxShadow: SHADOW_XL }}
      // The last lifted item stays on top until another one is lifted, so it
      // can't slip under a neighbour while it springs back into its slot.
      style={{ boxShadow: SHADOW_MD, zIndex: raised ? 10 : 0, position: 'relative' }}
      className="flex select-none items-center gap-3.5 rounded-2xl border border-white/[0.06] bg-[#111114] py-3 pl-3 pr-2"
    >
      <span className={`grid size-10 place-items-center rounded-xl bg-gradient-to-br text-white ${item.tint}`}>
        <Icon width={19} height={19} />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-[15px] font-medium">{item.label}</span>
        <span className="block text-[12px] text-white/45">{item.meta}</span>
      </span>
      <span
        onPointerDown={(e) => { e.preventDefault(); controls.start(e) }}
        aria-label={`Reorder ${item.label}`}
        className="grid size-10 cursor-grab touch-none place-items-center rounded-xl text-white/35 hover:bg-white/5 hover:text-white/70 active:cursor-grabbing"
      >
        <Grip width={20} height={20} strokeWidth={2.6} />
      </span>
    </Reorder.Item>
  )
}
