import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Award, FilePlus2 } from 'lucide-react'
import PageHeader from '@/components/PageHeader'
import { cn } from '@/lib/utils'

const EASE: [number, number, number, number] = [0.22, 0.61, 0.36, 1]

const TABS = [
  { key: 'quals', label: '资格证书', en: 'CERTIFICATES' },
  { key: 'comps', label: '竞赛获奖', en: 'COMPETITIONS' },
] as const

type TabKey = (typeof TABS)[number]['key']

function EmptyState({ label }: { label: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.35, ease: EASE }}
      className="flex flex-col items-center justify-center rounded-md border border-dashed border-line px-6 py-24 text-center"
    >
      <span className="flex h-12 w-12 items-center justify-center rounded-md border border-line bg-accent-soft text-ink-muted">
        {label === '资格证书' ? <Award size={20} strokeWidth={1.5} /> : <FilePlus2 size={20} strokeWidth={1.5} />}
      </span>
      <p className="font-serif-sc mt-5 text-[18px] font-semibold text-ink-primary">
        {label} · 待添加
      </p>
      <p className="mt-2 max-w-[40ch] text-[13px] leading-relaxed text-ink-muted">
        内容整理中，稍后将补充{label}的完整记录。
      </p>
    </motion.div>
  )
}

export default function Awards() {
  const [tab, setTab] = useState<TabKey>('quals')

  return (
    <>
      <PageHeader
        eyebrow="04 — AWARDS"
        title="获奖证书"
        quote="// 记录每一次被看见的努力"
      />

      {/* tabs */}
      <section className="border-b border-line">
        <div className="mx-auto flex max-w-[1200px] gap-2 px-6 py-4">
          {TABS.map((t) => (
            <button
              key={t.key}
              type="button"
              onClick={() => setTab(t.key)}
              className={cn(
                'rounded-full border px-4 py-1.5 text-[12.5px] transition-all',
                tab === t.key
                  ? 'border-accent-blue bg-accent-blue font-medium text-white'
                  : 'border-line bg-card text-ink-secondary hover:text-ink-primary',
              )}
            >
              {t.label}
              <span className="font-mono-x ml-1.5 text-[10px] opacity-70">{t.en}</span>
            </button>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-[1200px] px-6 py-14">
        <AnimatePresence mode="wait">
          <EmptyState key={tab} label={TABS.find((t) => t.key === tab)!.label} />
        </AnimatePresence>
      </section>
    </>
  )
}
