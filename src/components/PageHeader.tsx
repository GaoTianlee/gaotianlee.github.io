import { motion } from 'framer-motion'

const EASE: [number, number, number, number] = [0.22, 0.61, 0.36, 1]

interface PageHeaderProps {
  /** Mono eyebrow line, e.g. "02 — EDUCATION & RESEARCH" */
  eyebrow: string
  /** Chinese H1 (Noto Serif SC 600, clamp 34–48px) */
  title: string
  /** Optional secondary line rendered right after the eyebrow (legacy subtitle). */
  subtitle?: string
  /** Quote line — rendered with a mono "//" prefix, no accent dash. */
  quote?: string
}

/**
 * Pure-typography inner-page header (replaces the old 260px banner image).
 * Structure: mono eyebrow → H1 → quote, followed by a full-width 1px rule.
 * Entrance: three rows fade + 12px rise, stagger 0.08s, 0.5s, ease-out.
 */
export default function PageHeader({ eyebrow, title, subtitle, quote }: PageHeaderProps) {
  return (
    <section className="border-b border-line">
      <div className="mx-auto max-w-[1200px] px-6 pb-14 pt-24">
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0, ease: EASE }}
          className="font-mono-x text-[11px] font-medium uppercase tracking-[0.18em] text-ink-muted"
        >
          {eyebrow}
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.08, ease: EASE }}
          className="font-serif-sc mt-5 text-[clamp(34px,4.5vw,48px)] font-semibold leading-[1.15] text-ink-primary"
        >
          {title}
        </motion.h1>

        {subtitle && (
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.12, ease: EASE }}
            className="font-mono-x mt-3 text-[12px] tracking-[0.08em] text-ink-muted"
          >
            {subtitle}
          </motion.p>
        )}

        {quote && (
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.16, ease: EASE }}
            className="mt-4 text-[14px] text-ink-secondary"
          >
            <span className="font-mono-x mr-2 text-ink-muted">//</span>
            {quote}
          </motion.p>
        )}
      </div>
    </section>
  )
}
