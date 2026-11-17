// Small stroke icon set, 24px grid, drawn to read at 18-28px.
const base = {
  width: 20,
  height: 20,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.8,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': true,
}

const make = (paths) =>
  function Icon(props) {
    return <svg {...base} {...props}>{paths}</svg>
  }

export const Share = make(<><path d="M12 3v12" /><path d="m7 8 5-5 5 5" /><path d="M5 13v6a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-6" /></>)
export const Plus = make(<><path d="M12 5v14" /><path d="M5 12h14" /></>)
export const Download = make(<><path d="M12 3v12" /><path d="m7 10 5 5 5-5" /><path d="M5 21h14" /></>)
export const Heart = make(<path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10Z" />)
export const Close = make(<><path d="M6 6l12 12" /><path d="M18 6 6 18" /></>)
export const Grip = make(<><circle cx="9" cy="6" r=".6" /><circle cx="15" cy="6" r=".6" /><circle cx="9" cy="12" r=".6" /><circle cx="15" cy="12" r=".6" /><circle cx="9" cy="18" r=".6" /><circle cx="15" cy="18" r=".6" /></>)
export const Sun = make(<><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" /></>)
export const Moon = make(<path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5Z" />)
export const Wave = make(<path d="M2 12c2.5-4 5-4 7.5 0s5 4 7.5 0 3.5-3 5-2" />)
export const Leaf = make(<><path d="M5 19c0-8 5-14 15-14 0 10-6 15-14 15" /><path d="M5 19 13 11" /></>)
export const Flame = make(<path d="M12 22a7 7 0 0 0 7-7c0-4-3-6-4-10-2 2-3 4-3 6-1-1-2-2-2-4-3 2-5 5-5 8a7 7 0 0 0 7 7Z" />)
export const Flower = make(<><circle cx="12" cy="12" r="2.5" /><path d="M12 9.5C12 6 10 4 12 3c2 1 0 3 0 6.5ZM14.5 12c3.5 0 5.5-2 6.5 0-1 2-3 0-6.5 0ZM12 14.5c0 3.5 2 5.5 0 6.5-2-1 0-3 0-6.5ZM9.5 12C6 12 4 14 3 12c1-2 3 0 6.5 0Z" /></>)
export const Inbox = make(<><path d="M3 13h5l1.5 3h5L16 13h5" /><path d="M5 5h14l2 8v6H3v-6Z" /></>)
export const Calendar = make(<><rect x="3" y="5" width="18" height="16" rx="3" /><path d="M8 3v4M16 3v4M3 10h18" /></>)
export const Star = make(<path d="m12 3 2.8 5.8 6.2.9-4.5 4.4 1.1 6.2L12 17.4l-5.6 2.9 1.1-6.2L3 9.7l6.2-.9Z" />)
export const Folder = make(<path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z" />)
export const Music = make(<><path d="M9 18V5l11-2v13" /><circle cx="6" cy="18" r="3" /><circle cx="17" cy="16" r="3" /></>)
export const Bolt = make(<path d="M13 2 4 14h7l-1 8 9-12h-7Z" />)
export const Headphones = make(<><path d="M4 15v-3a8 8 0 0 1 16 0v3" /><rect x="3" y="14" width="5" height="7" rx="2" /><rect x="16" y="14" width="5" height="7" rx="2" /></>)
export const Lamp = make(<><path d="M8 3h8l3 8H5Z" /><path d="M12 11v8" /><path d="M8 21h8" /></>)
export const Watch = make(<><circle cx="12" cy="12" r="6" /><path d="M12 9v3l2 1.5" /><path d="M9 6.5 9.5 2h5l.5 4.5M9 17.5 9.5 22h5l.5-4.5" /></>)
export const Arrow = make(<path d="M5 12h14M13 6l6 6-6 6" />)
export const ArrowLeft = make(<path d="M19 12H5M11 6l-6 6 6 6" />)
export const Eye = make(<><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z" /><circle cx="12" cy="12" r="3" /></>)
export const Replay = make(<><path d="M3 12a9 9 0 1 0 3-6.7" /><path d="M3 4v5h5" /></>)
