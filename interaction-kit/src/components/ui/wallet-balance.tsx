"use client";

import {
  type ReactNode,
  useId,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

/* -------------------------------------------------------------------------- */
/*  Wallet Balance — cards tucked in a pouch, tap the eye to reveal / hide      */
/*  Deps: react 19, framer-motion, tailwindcss. No other imports.              */
/*                                                                             */
/*  Adapted from EasyUI by Suraj Maurya (MIT, see ./EASYUI-LICENSE): espresso  */
/*  leather, pixel account marks, and a hover bump with a "View details" tip.  */
/*                                                                             */
/*  <WalletBalance />                                                          */
/*  <WalletBalance accounts={myAccounts} visible={v} onVisibleChange={setV} /> */
/* -------------------------------------------------------------------------- */

export type WalletAccount = {
  id: string;
  name: string;
  balance: number;
  /** Brand mark. Swap the typographic stand-ins for official SVGs here. */
  logo: ReactNode;
  /** Any CSS background color for the card */
  background: string;
  /** Color of the amount text on the card */
  amountColor?: string;
};

export type WalletBalanceProps = {
  /** Up to 3 accounts are shown (the layout fits three cards) */
  accounts?: WalletAccount[];
  /** Controlled visibility */
  visible?: boolean;
  /** Uncontrolled initial visibility (default true) */
  defaultVisible?: boolean;
  onVisibleChange?: (visible: boolean) => void;
  /** ISO currency used on the cards (default "USD") */
  currency?: string;
  locale?: string;
  totalLabel?: string;
  className?: string;
  style?: React.CSSProperties;
  /** Called when a fanned-out card is clicked (the "View details" tip) */
  onViewDetails?: (account: WalletAccount) => void;
};

/* ------------------------------ Design space ------------------------------- */
// Everything is authored on a 340×400 stage, then scaled to the container width.

const STAGE_W = 340;
const STAGE_H = 400;
const CARD_W = 266;
const CARD_H = 130;
const CARD_LEFT = (STAGE_W - CARD_W) / 2;
const HIDE_SCALE = 0.89;
const MAX_CARDS = 3;
const POCKET_TOP = 179;

const visibleTop = (i: number) => 13 + i * 49.5; // fanned out
const hiddenTop = (i: number) => 75 + i * 35; // tucked into the pouch

const EASE_OUT = [0.23, 1, 0.32, 1] as const;
const MONO = 'var(--font-mono, "JetBrains Mono", ui-monospace, "SF Mono", "Space Mono", Menlo, Consolas, monospace)';
const MASK = "******";

/* ------------------------------- Account marks ------------------------------ */
// 5x5 pixel glyphs, drawn on the same grid as the portfolio's pixel favicon.

function PixelMark({ rows, color, label, labelColor }: { rows: string[]; color: string; label: string; labelColor: string }) {
  return (
    <span className="flex items-center gap-[7px]">
      <svg viewBox="0 0 5 5" className="h-[15px] w-[15px]" shapeRendering="crispEdges" aria-hidden>
        {rows.flatMap((row, y) =>
          [...row].map((c, x) => (c === "#" ? <rect key={`${x}-${y}`} x={x} y={y} width="1" height="1" fill={color} /> : null)),
        )}
      </svg>
      <span className="text-[16px] font-semibold leading-none tracking-[-0.02em]" style={{ color: labelColor }}>
        {label}
      </span>
    </span>
  );
}

const SUN = [".#.#.", "#####", ".###.", "#####", ".#.#."];
const BOLT = ["..##.", ".##..", "#####", "..##.", ".##.."];
const DROP = ["..#..", ".###.", "#####", "#####", ".###."];

export const DEFAULT_ACCOUNTS: WalletAccount[] = [
  { id: "everyday", name: "Everyday", balance: 18240, logo: <PixelMark rows={SUN} color="#2a1404" label="Everyday" labelColor="#2a1404" />, background: "#ff7a00", amountColor: "#6a2a00" },
  { id: "side-quests", name: "Side quests", balance: 6480, logo: <PixelMark rows={BOLT} color="#e86a00" label="Side quests" labelColor="#2a1d14" />, background: "#f3e6d3", amountColor: "#8a6a4d" },
  { id: "rainy-day", name: "Rainy day", balance: 92315, logo: <PixelMark rows={DROP} color="#ffb877" label="Rainy day" labelColor="#f4f1ec" />, background: "#2a2a30", amountColor: "#a9a9b4" },
];

/* ------------------------------- Small parts -------------------------------- */

// Crossfades between a real value and its mask. The real value is never in the
// DOM while hidden.
function Swap({
  show,
  value,
  mask = MASK,
  className = "",
  maskClassName = "",
}: {
  show: boolean;
  value: string;
  mask?: string;
  className?: string;
  maskClassName?: string;
}) {
  const reduce = useReducedMotion();
  return (
    <span className="relative inline-flex">
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={show ? "value" : "mask"}
          className={`whitespace-nowrap ${show ? className : maskClassName || className}`}
          initial={{ opacity: 0, filter: reduce ? "blur(0px)" : "blur(4px)" }}
          animate={{ opacity: 1, filter: "blur(0px)" }}
          exit={{ opacity: 0, filter: reduce ? "blur(0px)" : "blur(4px)" }}
          transition={{ duration: reduce ? 0 : 0.18, ease: EASE_OUT }}
        >
          {show ? value : mask}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

function EyeIcon({ open }: { open: boolean }) {
  const reduce = useReducedMotion();
  const t = { duration: reduce ? 0 : 0.28, ease: EASE_OUT };
  return (
    <motion.svg
      viewBox="0 0 34 24"
      className="h-[22px] w-[31px] overflow-visible"
      initial={false}
      animate={{ color: open ? "#ffb877" : "#6b4c3a" }}
      transition={t}
      aria-hidden
    >
      <path d="M1.5 12C5.5 5 10.5 1.5 17 1.5S28.5 5 32.5 12c-4 7-9 10.5-15.5 10.5S5.5 19 1.5 12Z" fill="currentColor" />
      <circle cx="17" cy="12" r="6.6" fill="#24160e" />
      <circle cx="17" cy="12" r="3.6" fill="currentColor" />
      {/* slash draws in when hidden: dark underlay cuts the eye, light stroke on top */}
      <motion.path
        d="M5 22.5 29 1.5"
        stroke="#24160e"
        strokeWidth={5}
        strokeLinecap="round"
        fill="none"
        initial={false}
        animate={{ pathLength: open ? 0 : 1, opacity: open ? 0 : 1 }}
        transition={t}
      />
      <motion.path
        d="M5 22.5 29 1.5"
        stroke="#b89b85"
        strokeWidth={2}
        strokeLinecap="round"
        fill="none"
        initial={false}
        animate={{ pathLength: open ? 0 : 1, opacity: open ? 0 : 1 }}
        transition={t}
      />
    </motion.svg>
  );
}

/* -------------------------------- Component --------------------------------- */

export function WalletBalance({
  accounts = DEFAULT_ACCOUNTS,
  visible,
  defaultVisible = true,
  onVisibleChange,
  currency = "USD",
  locale = "en-US",
  totalLabel = "Total Balance",
  className = "",
  style,
  onViewDetails,
}: WalletBalanceProps) {
  const uid = useId().replace(/:/g, "");
  const reduce = useReducedMotion();

  const [inner, setInner] = useState(defaultVisible);
  const isVisible = visible ?? inner;
  const [hovered, setHovered] = useState<string | null>(null);
  // The tuck/fan stagger only applies while toggling; a hover bump reacts at once.
  const toggling = useRef(false);
  const toggle = () => {
    toggling.current = true;
    setHovered(null);
    setTimeout(() => (toggling.current = false), 600);
    const next = !isVisible;
    if (visible === undefined) setInner(next);
    onVisibleChange?.(next);
  };

  const list = accounts.slice(0, MAX_CARDS);
  const total = useMemo(() => list.reduce((s, a) => s + a.balance, 0), [list]);
  const money = useMemo(
    () => new Intl.NumberFormat(locale, { style: "currency", currency, maximumFractionDigits: 0 }),
    [locale, currency],
  );
  const plain = useMemo(() => new Intl.NumberFormat(locale, { maximumFractionDigits: 0 }), [locale]);

  // Scale the fixed stage to whatever width we're given (mobile friendly)
  const wrapRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState<number | null>(null);
  useLayoutEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const update = () => setScale(el.clientWidth / STAGE_W);
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const spring = (delay: number) =>
    reduce ? { duration: 0 } : ({ type: "spring", duration: 0.5, bounce: 0.16, delay } as const);
  const bump = reduce ? { duration: 0 } : ({ type: "spring", duration: 0.42, bounce: 0.38 } as const);
  const BUMP = 12;

  return (
    <div
      ref={wrapRef}
      role="group"
      aria-label="Wallet balances"
      className={`relative mx-auto w-full max-w-[400px] select-none ${className}`}
      style={{
        aspectRatio: `${STAGE_W} / ${STAGE_H}`,
        fontFamily: "var(--font-sans, 'Geist', sans-serif)",
        ...style,
      }}
    >
      <div
        className="absolute left-0 top-0 origin-top-left"
        style={{
          width: STAGE_W,
          height: STAGE_H,
          transform: `scale(${scale ?? 1})`,
          opacity: scale === null ? 0 : 1,
        }}
      >
        {/* Back of the pouch */}
        <svg
          viewBox={`0 0 ${STAGE_W} ${STAGE_H}`}
          width={STAGE_W}
          height={STAGE_H}
          className="absolute inset-0"
          style={{ filter: "drop-shadow(0 22px 26px rgba(48,24,10,0.3))" }}
          aria-hidden
        >
          <defs>
            <linearGradient id={`${uid}-back`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3d271b" />
              <stop offset="100%" stopColor="#2e1c13" />
            </linearGradient>
          </defs>
          <path
            d="M20 112C20 102 28 96 38 96H302C312 96 320 102 320 112V316A66 66 0 0 1 254 382H86A66 66 0 0 1 20 316Z"
            fill={`url(#${uid}-back)`}
          />
        </svg>

        {/* Cards. Fanned out, each one is a target: hover (or focus, or a first
            tap on touch) bumps it up and shows the tip; a click views details. */}
        {list.map((a, i) => {
          const n = list.length;
          const delay = toggling.current ? (isVisible ? i : n - 1 - i) * 0.03 : 0;
          const lifted = isVisible && hovered === a.id;
          return (
            <motion.div
              key={a.id}
              role={isVisible ? "button" : undefined}
              tabIndex={isVisible ? 0 : -1}
              aria-label={isVisible ? `${a.name}: view details` : undefined}
              onPointerEnter={(e) => e.pointerType !== "touch" && isVisible && setHovered(a.id)}
              onPointerLeave={(e) => e.pointerType !== "touch" && setHovered((h) => (h === a.id ? null : h))}
              onFocus={() => isVisible && setHovered(a.id)}
              onBlur={() => setHovered((h) => (h === a.id ? null : h))}
              onClick={() => {
                if (!isVisible) return;
                if (hovered === a.id) onViewDetails?.(a);
                else setHovered(a.id);
              }}
              onKeyDown={(e) => {
                if (isVisible && (e.key === "Enter" || e.key === " ")) {
                  e.preventDefault();
                  onViewDetails?.(a);
                }
              }}
              className="absolute overflow-hidden rounded-[18px] outline-none will-change-transform focus-visible:ring-2 focus-visible:ring-[#ffb877]/80"
              style={{
                left: CARD_LEFT,
                top: 0,
                width: CARD_W,
                height: CARD_H,
                zIndex: i + 1,
                cursor: isVisible ? "pointer" : "default",
                transformOrigin: "50% 0%",
                background: `linear-gradient(180deg, rgba(255,255,255,0.28), rgba(255,255,255,0) 45%), ${a.background}`,
              }}
              initial={false}
              animate={{
                y: isVisible ? visibleTop(i) - (lifted ? BUMP : 0) : hiddenTop(i),
                scale: isVisible ? 1 : HIDE_SCALE,
                boxShadow: lifted
                  ? "inset 0 1px 0 rgba(255,255,255,0.65), 0 -1px 0 rgba(0,0,0,0.04), 0 -10px 22px rgba(40,18,4,0.28)"
                  : "inset 0 1px 0 rgba(255,255,255,0.65), 0 -1px 0 rgba(0,0,0,0.04), 0 6px 14px rgba(0,0,0,0.10)",
              }}
              transition={toggling.current ? spring(delay) : bump}
            >
              <div className="flex h-[40px] items-center justify-between px-[16px]">
                <span className="flex items-center">{a.logo}</span>
                <span
                  className="text-[15px] font-medium tabular-nums tracking-[0.05em]"
                  style={{ fontFamily: MONO, color: a.amountColor ?? "rgba(0,0,0,0.45)" }}
                >
                  <Swap show={isVisible} value={money.format(a.balance)} />
                </span>
              </div>
            </motion.div>
          );
        })}

        {/* "View details" tip, above the bumped card's right edge */}
        <AnimatePresence>
          {isVisible && hovered && list.some((a) => a.id === hovered) && (
            <motion.div
              key={hovered}
              aria-hidden
              className="pointer-events-none absolute flex items-center gap-[6px] rounded-full bg-[#1a1008] py-[6px] pl-[9px] pr-[11px] text-[12px] font-medium text-[#ffe7d0] shadow-[0_6px_16px_rgba(26,16,8,0.35)]"
              style={{
                right: CARD_LEFT + 10,
                top: visibleTop(list.findIndex((a) => a.id === hovered)) - BUMP - 34,
                zIndex: 13,
                transformOrigin: "85% 100%",
              }}
              initial={{ opacity: 0, y: 6, scale: 0.86 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 4, scale: 0.92, transition: { duration: 0.12 } }}
              transition={bump}
            >
              <svg viewBox="0 0 24 24" className="h-[14px] w-[14px]" fill="none" stroke="#ffb877" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
              View details
              <span className="absolute -bottom-[4px] right-[22px] h-[8px] w-[8px] rotate-45 rounded-[1px] bg-[#1a1008]" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Front pocket */}
        <svg
          viewBox={`0 0 ${STAGE_W} ${STAGE_H}`}
          width={STAGE_W}
          height={STAGE_H}
          className="pointer-events-none absolute inset-0"
          style={{ zIndex: 10 }}
          aria-hidden
        >
          <defs>
            <linearGradient id={`${uid}-front`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#332015" />
              <stop offset="100%" stopColor="#24160e" />
            </linearGradient>
          </defs>
          <path
            d={`M30 198C30 188 41 ${POCKET_TOP} 54 ${POCKET_TOP}L286 ${POCKET_TOP}C299 ${POCKET_TOP + 1} 310 188 310 198V322A56 56 0 0 1 254 378H86A56 56 0 0 1 30 322Z`}
            fill={`url(#${uid}-front)`}
            stroke="rgba(255,255,255,0.05)"
          />
          <path
            d="M38 199C38 192 46 187 56 187L284 187C294 187 302 192 302 199V322A48 48 0 0 1 254 370H86A48 48 0 0 1 38 322Z"
            fill="none"
            stroke="rgba(255,184,119,0.55)"
            strokeWidth={1}
            strokeDasharray="4 3.2"
            strokeLinecap="round"
          />
        </svg>

        {/* Total + toggle (above the pocket) */}
        <div className="absolute inset-x-0 text-center" style={{ top: 191, zIndex: 11 }}>
          <div className="flex h-[36px] items-center justify-center">
            <Swap
              show={isVisible}
              value={plain.format(total)}
              className="text-[28px] font-medium tabular-nums tracking-[0.1em] text-[#f6e6d6]"
              maskClassName="text-[26px] font-medium tracking-[0.34em] text-[#b89b85]"
            />
          </div>
          <p className="mt-[2px] text-[15px] tracking-[0.01em] text-[#a8896f]">{totalLabel}</p>
        </div>

        <button
          type="button"
          onClick={toggle}
          aria-pressed={isVisible}
          aria-label={isVisible ? "Hide balances" : "Show balances"}
          className="absolute flex h-[56px] w-[56px] items-center justify-center rounded-full outline-none transition-transform duration-150 ease-out [-webkit-tap-highlight-color:transparent] active:scale-[0.92] focus-visible:ring-2 focus-visible:ring-[#ffb877]/70"
          style={{ left: STAGE_W / 2 - 28, top: 306, zIndex: 12 }}
        >
          <EyeIcon open={isVisible} />
        </button>
      </div>

      <span className="sr-only" aria-live="polite">
        {isVisible ? `Total balance ${plain.format(total)}` : "Balances hidden"}
      </span>
    </div>
  );
}

/* ---------------------------------- Demo ----------------------------------- */

export function WalletBalanceDemo() {
  return (
    <div className="flex min-h-dvh items-center justify-center bg-gradient-to-br from-[#fbefe2] via-[#f6f1ea] to-[#efebe6] p-6">
      <WalletBalance className="max-w-[360px]" />
    </div>
  );
}

export default WalletBalance;
