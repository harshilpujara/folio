// Stroke icons for the kit controls, 24px grid.
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

export const Arrow = make(<path d="M5 12h14M13 6l6 6-6 6" />)
export const ArrowLeft = make(<path d="M19 12H5M11 6l-6 6 6 6" />)
export const Eye = make(<><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z" /><circle cx="12" cy="12" r="3" /></>)
export const Replay = make(<><path d="M3 12a9 9 0 1 0 3-6.7" /><path d="M3 4v5h5" /></>)
