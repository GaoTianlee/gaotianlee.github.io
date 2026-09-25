import { motion } from 'framer-motion'
import type { Variants } from 'framer-motion'
import PageHeader from '@/components/PageHeader'

/* ---------------------------------- data --------------------------------- */

interface EduEntry {
  school: string
  college: string
  badge: string
  logo: string
}

const EDU_ENTRIES: EduEntry[] = [
  {
    school: '湖南工商大学',
    college: '工商管理学院',
    badge: '本科',
    logo: '/logo-hutb.png',
  },
]

/* -------------------------------- motion --------------------------------- */

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
}

/* ----------------------------- section header ----------------------------- */

function SectionHeader({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <header className="border-b border-line pb-5">
      <p className="font-mono-x text-[11px] font-medium uppercase tracking-[0.18em] text-ink-muted">
        {eyebrow}
      </p>
      <h2 className="font-serif-sc mt-2.5 text-[22px] font-semibold text-ink-primary">{title}</h2>
    </header>
  )
}

/* ------------------------------ xuexin cards ------------------------------ */

function EduTimeline() {
  return (
    <motion.section
      variants={fadeUp}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: '-60px' }}
    >
      <SectionHeader eyebrow="02-A — ENROLLMENT" title="学籍信息" />

      {/* xuexin-style subheading */}
      <div className="mt-6 flex items-baseline justify-between border-b border-line-strong pb-3">
        <h3 className="text-[15px] font-semibold text-ink-primary">
          学籍信息{' '}
          <span className="font-mono-x text-[13px] text-accent-blue">({EDU_ENTRIES.length})</span>
        </h3>
        <span className="font-mono-x text-[10px] uppercase tracking-[0.14em] text-ink-muted">
          Enrollment Records
        </span>
      </div>

      {/* stacked xuexin-style cards */}
      <ol className="mt-5 space-y-4">
        {EDU_ENTRIES.map((e, i) => (
          <motion.li
            key={e.school + e.badge}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.5, delay: i * 0.06, ease: 'easeOut' }}
            className="card-hover rounded-md border border-line bg-card p-5"
          >
            <span className="font-mono-x text-[10px] tracking-[0.08em] text-accent-blue">
              {String(i + 1).padStart(2, '0')}
            </span>
            <div className="mt-3 flex items-start gap-3.5">
              <img
                src={e.logo}
                alt={e.school}
                loading="lazy"
                className="h-11 w-11 shrink-0 rounded border border-line bg-white object-contain p-1"
              />
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-3">
                  <h4 className="text-[16px] font-semibold leading-snug text-ink-primary">
                    {e.school}
                  </h4>
                  <span className="font-mono-x shrink-0 rounded border border-line-strong px-2 py-0.5 text-[10.5px] tracking-[0.08em] text-ink-secondary">
                    {e.badge}
                  </span>
                </div>
                <p className="mt-2 text-[13px] text-ink-secondary">{e.college}</p>
              </div>
            </div>
          </motion.li>
        ))}
      </ol>

      {/* bottom quote band */}
      <div className="mt-10 border-y border-line py-4 text-center">
        <p className="text-[13px] text-ink-muted">
          “教育不是灌输，而是点燃火焰。” —— William Butler Yeats
        </p>
      </div>
    </motion.section>
  )
}

/* ---------------------------------- page ---------------------------------- */

export default function Education() {
  return (
    <div className="pb-20">
      <PageHeader
        eyebrow="02 — EDUCATION"
        title="教育经历"
        quote="“知识的积累，是为了看更大的世界。”"
      />
      <div className="mx-auto mt-16 max-w-[760px] px-6">
        <EduTimeline />
      </div>
    </div>
  )
}
