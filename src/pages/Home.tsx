import { useEffect, useRef, useState, type ReactNode } from 'react'
import { Link } from 'react-router'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowRight, ArrowUpRight, Download, Mail, Phone, Send, X } from 'lucide-react'
import { scrollToTarget } from '@/components/Layout'
import { useLang } from '@/lib/i18n'
import type { Lang } from '@/lib/i18n'

const EASE: [number, number, number, number] = [0.22, 0.61, 0.36, 1]

/* ------------------------------------------------------------------ */
/* Copy (bilingual, mirrors the design draft)                          */
/* ------------------------------------------------------------------ */
const COPY = {
  cn: {
    eyebrow: 'EXPLORE KNOWLEDGE · CONNECT THE WORLD',
    greeting: '你好，我是',
    name: 'Gao Tianlee',
    subtitle: '探索知识，连接世界',
    tagline: 'Think Deep · Build Useful Things · Make a Positive Impact',
    bio: '我是一名关注人工智能、宏观经济与管理的学习者与实践者，致力于用系统化的思维理解复杂问题。在这里，分享学习笔记、研究成果与生活思考，希望与更多有趣的朋友交流合作。',
    contactBtn: '联系我',
    resumeBtn: '下载简历',
    motto: ['行万里路', '读万卷书', '见更大的世界'],
    bubble: ['Stay curious.', 'Keep building.'],
    contact: {
      wechat: '微信 (WeChat)',
      phone: '手机号',
      email: '邮箱',
      telegram: 'Telegram',
      github: 'GitHub',
      qq: 'QQ',
      youtube: 'YouTube',
      more: 'More Ways to Connect',
      scanHint: '扫码添加微信',
    },
    about: {
      title: '关于我',
      titleEn: 'ABOUT ME',
      p1: '目前专注于人工智能、宏观经济、管理学与数据分析领域的学习与实践。喜欢通过系统化思维理解复杂问题，并尝试用可视化与工具化的方法提升效率。',
      p2: '热爱阅读、写作与探索新技术，期待在学术、产业与社会之间找到交汇点，创造真实、可持续的价值。',
      identities: [
        { name: '学习者', desc: '持续学习，终身成长' },
        { name: '实践者', desc: '从想法到落地' },
        { name: '连接者', desc: '交流合作，共同进步' },
        { name: '长期主义者', desc: '用时间复利创造价值' },
      ],
      interests: [
        '人工智能',
        '宏观经济',
        '管理学',
        '数据分析',
        '可视化',
        '工具化',
        '阅读写作',
        '旅行摄影',
      ],
      info: [
        { label: '现居', value: 'Tokyo, Japan' },
        { label: '状态', value: '学习 / 研究 / 探索' },
        { label: '兴趣', value: '阅读 · 旅行 · 摄影 · 科技' },
      ],
      stats: [
        { value: 2, suffix: '+', label: '教育经历', to: '/education' },
        { value: 10, suffix: '+', label: '研究项目', to: '/education' },
        { value: 5, suffix: '+', label: '实践项目', to: '/work' },
        { value: 10, suffix: '+', label: '获奖证书', to: '/awards' },
      ],
    },
  },
  en: {
    eyebrow: 'EXPLORE KNOWLEDGE · CONNECT THE WORLD',
    greeting: "Hello, I'm",
    name: 'Gao Tianlee',
    subtitle: 'Explore Knowledge, Connect the World',
    tagline: 'Think Deep · Build Useful Things · Make a Positive Impact',
    bio: 'I am a learner and practitioner focused on AI, macroeconomics and management, dedicated to understanding complex problems through systematic thinking. Here I share study notes, research outcomes and reflections on life — looking forward to connecting with more interesting people.',
    contactBtn: 'Contact Me',
    resumeBtn: 'Download Résumé',
    motto: ['Travel far', 'Read widely', 'See a bigger world'],
    bubble: ['Stay curious.', 'Keep building.'],
    contact: {
      wechat: 'WeChat',
      phone: 'Phone',
      email: 'Email',
      telegram: 'Telegram',
      github: 'GitHub',
      qq: 'QQ',
      youtube: 'YouTube',
      more: 'More Ways to Connect',
      scanHint: 'Scan to add on WeChat',
    },
    about: {
      title: 'About Me',
      titleEn: 'ABOUT ME',
      p1: 'Currently focused on learning and practice across AI, macroeconomics, management and data analytics — understanding complex problems through systematic thinking, and improving efficiency with visualization and tooling.',
      p2: 'I love reading, writing and exploring new technologies, hoping to find the intersection of academia, industry and society, and to create real, sustainable value.',
      identities: [
        { name: 'Learner', desc: 'Keep learning, keep growing' },
        { name: 'Builder', desc: 'From ideas to reality' },
        { name: 'Connector', desc: 'Connect & grow together' },
        { name: 'Long-termist', desc: 'Compound value with time' },
      ],
      interests: [
        'AI',
        'Macroeconomics',
        'Management',
        'Data Analytics',
        'Visualization',
        'Tooling',
        'Reading & Writing',
        'Travel Photography',
      ],
      info: [
        { label: 'Based in', value: 'Tokyo, Japan' },
        { label: 'Status', value: 'Learning / Research / Exploring' },
        { label: 'Interests', value: 'Reading · Travel · Photography · Tech' },
      ],
      stats: [
        { value: 2, suffix: '+', label: 'Education', to: '/education' },
        { value: 10, suffix: '+', label: 'Research', to: '/education' },
        { value: 5, suffix: '+', label: 'Projects', to: '/work' },
        { value: 10, suffix: '+', label: 'Awards', to: '/awards' },
      ],
    },
  },
} as const

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

/** Animated number that counts up when scrolled into view. */
function CountUp({
  end,
  suffix = '',
  duration = 1.2,
}: {
  end: number
  suffix?: string
  duration?: number
}) {
  const ref = useRef<HTMLSpanElement>(null)
  const started = useRef(false)
  const [val, setVal] = useState(0)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting && !started.current) {
          started.current = true
          const t0 = performance.now()
          const tick = (now: number) => {
            const p = Math.min((now - t0) / (duration * 1000), 1)
            setVal(Math.round(end * (1 - Math.pow(1 - p, 3))))
            if (p < 1) requestAnimationFrame(tick)
          }
          requestAnimationFrame(tick)
          io.disconnect()
        }
      },
      { threshold: 0.4 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [end, duration])

  return (
    <span ref={ref}>
      {val}
      {suffix}
    </span>
  )
}

/* ------------------------------------------------------------------ */
/* Hero                                                                */
/* ------------------------------------------------------------------ */
function Hero({ c }: { c: (typeof COPY)[Lang] }) {
  return (
    <section className="relative overflow-hidden">
      {/* Background — Ken Burns is the site's only large-scale motion */}
      <motion.img
        src="/home-bg.png"
        alt=""
        initial={{ scale: 1.08 }}
        animate={{ scale: 1 }}
        transition={{ duration: 1.6, ease: EASE }}
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0" style={{ background: 'var(--banner-overlay)' }} />

      <div className="relative mx-auto flex max-w-[1200px] flex-col px-6 pb-28 pt-24">
        <div className="max-w-[640px]">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.05, ease: EASE }}
            className="font-mono-x text-[11px] font-medium uppercase tracking-[0.18em] text-ink-muted"
          >
            01 — INDEX / {c.eyebrow}
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.13, ease: EASE }}
            className="font-serif-sc mt-6 text-[clamp(38px,5.5vw,56px)] font-semibold leading-[1.12] text-ink-primary"
          >
            {c.greeting}
            <span className="text-accent-blue"> {c.name}</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.21, ease: EASE }}
            className="font-serif-sc mt-3 text-[clamp(17px,2vw,21px)] font-medium text-accent-deep"
          >
            {c.subtitle}
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.27, ease: EASE }}
            className="font-mono-x mt-2 text-[11.5px] uppercase tracking-[0.14em] text-ink-muted"
          >
            {c.tagline}
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.33, ease: EASE }}
            className="mt-5 max-w-[560px] text-[14px] leading-[1.9] text-ink-secondary"
          >
            {c.bio}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.41, ease: EASE }}
            className="mt-9 flex flex-wrap items-center gap-3"
          >
            <button type="button" onClick={() => scrollToTarget('contact')} className="btn-primary">
              <Send size={14} />
              {c.contactBtn}
            </button>
            <a href="/resume.pdf" download className="btn-outline">
              <Download size={14} />
              {c.resumeBtn}
            </a>
            <span className="font-mono-x ml-1 hidden text-[11px] tracking-[0.1em] text-ink-muted sm:inline">
              {c.motto.join(' · ')}
            </span>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/* Contact strip                                                       */
/* ------------------------------------------------------------------ */
interface QrData {
  src: string
  title: string
  caption: string
}

interface ContactItem {
  key: string
  monoLabel: string
  brandIcon?: ReactNode
  value: string
  href?: string
  external?: boolean
  qr?: QrData
}

/** Full-screen QR preview: overlay-click / Esc to close, locks body scroll. */
function QrLightbox({ qr, onClose }: { qr: QrData | null; onClose: () => void }) {
  useEffect(() => {
    if (!qr) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = prev
    }
  }, [qr, onClose])

  return (
    <AnimatePresence>
      {qr && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-label={`${qr.title}二维码`}
          className="bg-overlay-scrim fixed inset-0 z-[80] flex items-center justify-center p-6"
        >
          <button
            type="button"
            aria-label="关闭"
            onClick={onClose}
            className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center text-white/80 transition-colors hover:text-white"
          >
            <X size={20} />
          </button>
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            transition={{ duration: 0.25, ease: EASE }}
            onClick={(e) => e.stopPropagation()}
            className="rounded-lg border border-line bg-card p-4"
          >
            <img
              src={qr.src}
              alt={`${qr.title}二维码`}
              draggable={false}
              className="qr-img h-auto w-[min(78vw,320px)] rounded-[4px]"
            />
            <p className="pt-3 text-center text-[13px] font-medium text-ink-secondary">
              {qr.caption}
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

function ContactStrip({ c }: { c: (typeof COPY)[Lang] }) {
  const [qr, setQr] = useState<QrData | null>(null)

  const items: ContactItem[] = [
    {
      key: 'wechat',
      monoLabel: 'WECHAT',
      brandIcon: (
        <svg viewBox="0 0 24 24" width="15" height="15" fill="#07C160" aria-hidden>
          <path d="M8.7 4C4.9 4 2 6.6 2 9.8c0 1.8 1 3.4 2.5 4.5l-.6 1.9 2.2-1.1c.5.1 1 .2 1.6.2h.4A5.5 5.5 0 0 1 8.7 13c0-2.9 2.8-5.2 6.1-5.2h.3C14.4 5.9 11.8 4 8.7 4zM6.6 8.3a.8.8 0 1 1 0-1.6.8.8 0 0 1 0 1.6zm4.2 0a.8.8 0 1 1 0-1.6.8.8 0 0 1 0 1.6zM2.4 19.6l1.7-.9A6.9 6.9 0 0 1 2 15.3c0-1.3.4-2.5 1-3.5-.4-.6-.6-1.3-.6-2C2.4 7 5.4 4.4 9.2 4.4c.9 0 1.7.1 2.5.4A6.9 6.9 0 0 0 8.7 12c0 3.4 2.8 6.2 6.5 6.9a7 7 0 0 1-3.6 1H8.3l-2.3 1.2.6-1.8a7 7 0 0 1-4.2-2.7zM13 8.9a5 5 0 0 0-5.1 5 5 5 0 0 0 5.1 5c.5 0 1-.1 1.5-.2l1.8.9-.5-1.5a4.9 4.9 0 0 0 2.3-4.2c0-2.8-2.3-5-5.1-5zm-1.7 2.5a.7.7 0 1 1 0-1.4.7.7 0 0 1 0 1.4zm3.4 0a.7.7 0 1 1 0-1.4.7.7 0 0 1 0 1.4z" />
        </svg>
      ),
      value: 'Gtl_huyidan',
      qr: { src: '/wechat-qr-real.jpg', title: '微信', caption: '扫码添加微信（Gtl_huyidan）' },
    },
    {
      key: 'qq',
      monoLabel: 'QQ',
      brandIcon: (
        <svg viewBox="0 0 24 24" width="15" height="15" aria-hidden>
          <path fill="#12B7F5" d="M12 2C8 2 5 5.1 5 8.9c0 1.9.9 3.7 2.3 4.9-.1.6-.4 1.7-1 2.7 1.1-.3 2.2-.8 2.9-1.3.9.2 1.8.4 2.8.4s1.9-.1 2.8-.4c.7.5 1.8 1 2.9 1.3-.6-1-1-2.1-1-2.7 1.4-1.2 2.3-3 2.3-4.9C19 5.1 16 2 12 2z" />
          <path fill="#fff" d="M8.2 9.2a.9.9 0 1 1 0-1.8.9.9 0 0 1 0 1.8zm7.6 0a.9.9 0 1 1 0-1.8.9.9 0 0 1 0 1.8z" />
        </svg>
      ),
      value: '2273018052',
      qr: { src: '/qq-qr.jpg', title: 'QQ', caption: '扫码添加 QQ（2273018052）' },
    },
    {
      key: 'phone',
      monoLabel: 'PHONE',
      brandIcon: <Phone size={14} className="text-ink-secondary" />,
      value: '+86 186 6393 5936',
      href: 'tel:+8618663935936',
    },
    {
      key: 'email',
      monoLabel: 'EMAIL',
      brandIcon: <Mail size={14} className="text-ink-secondary" />,
      value: 'gtl.huyidan@gmail.com',
      href: 'mailto:gtl.huyidan@gmail.com',
    },
    {
      key: 'telegram',
      monoLabel: 'TELEGRAM',
      brandIcon: (
        <svg viewBox="0 0 24 24" width="15" height="15" fill="#229ED9" aria-hidden>
          <path d="M21.9 4.6c.3-1.2-.9-1.9-2-1.4L2.7 9.8c-1.2.5-1.1 1.9.1 2.3l4.6 1.4 1.8 5.5c.3.9 1.2 1 1.9.4l2.5-2.3 4.7 3.5c.9.6 1.9.1 2.1-.9l2.5-14.7zM8.3 12.6l9.3-5.9c.2-.1.4.1.3.3l-7.6 7.2-.3 3-1.7-4.6z" />
        </svg>
      ),
      value: '@GaoTianlee',
      href: 'https://t.me/GaoTianlee',
      external: true,
    },
    {
      key: 'github',
      monoLabel: 'GITHUB',
      brandIcon: (
        <svg viewBox="0 0 24 24" width="15" height="15" fill="currentColor" className="text-ink-primary" aria-hidden>
          <path d="M12 2C6.5 2 2 6.5 2 12.3c0 4.5 2.9 8.4 6.8 9.8.5.1.7-.2.7-.5v-1.8c-2.8.6-3.4-1.4-3.4-1.4-.4-1.2-1.1-1.5-1.1-1.5-.9-.6.1-.6.1-.6 1 .1 1.5 1.1 1.5 1.1.9 1.6 2.4 1.1 3 .9.1-.7.4-1.1.6-1.4-2.2-.3-4.6-1.2-4.6-5.2 0-1.1.4-2.1 1.1-2.8-.1-.3-.5-1.4.1-2.9 0 0 .9-.3 2.9 1.1a10 10 0 0 1 5.3 0c2-1.4 2.9-1.1 2.9-1.1.6 1.5.2 2.6.1 2.9.7.7 1.1 1.6 1.1 2.8 0 4-2.4 4.9-4.6 5.2.4.3.7.9.7 1.9v2.8c0 .3.2.6.7.5a10.3 10.3 0 0 0 6.8-9.8C22 6.5 17.5 2 12 2z" />
        </svg>
      ),
      value: 'github.com/gtlhuyidan',
      href: 'https://github.com/gtlhuyidan',
      external: true,
    },
  ]

  const cellClass =
    'group flex h-full flex-col justify-between gap-3 bg-card px-4 py-5 text-left transition-colors'

  const body = (item: ContactItem) => (
    <>
      <span className="flex items-center justify-between gap-2">
        <span className="flex items-center gap-2">
          <span
            className="flex h-7 w-7 shrink-0 items-center justify-center rounded border border-line bg-accent-soft"
            aria-hidden
          >
            {item.brandIcon ?? <Phone size={14} className="text-ink-secondary" />}
          </span>
          <span className="font-mono-x text-[11px] font-medium uppercase tracking-[0.18em] text-ink-muted">
            {item.monoLabel}
          </span>
        </span>
        <ArrowUpRight
          size={14}
          className="shrink-0 text-ink-muted transition-all duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent-blue"
        />
      </span>
      <span className="break-all text-[14px] leading-snug text-ink-primary transition-colors group-hover:text-accent-blue">
        {item.value}
      </span>
    </>
  )

  return (
    <section id="contact" className="bg-card">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.5, ease: EASE }}
        className="mx-auto max-w-[1200px] px-6 py-10"
      >
        {/* Ruled index grid — hairlines via gap-px over --line */}
        <div className="grid grid-cols-2 gap-px border border-line bg-line md:grid-cols-3 xl:grid-cols-6">
          {items.map((item) =>
            item.qr ? (
              <button
                key={item.key}
                type="button"
                onClick={() => setQr(item.qr ?? null)}
                aria-label={`${item.monoLabel}：${item.value}，点击查看二维码`}
                className={cellClass}
              >
                {body(item)}
              </button>
            ) : (
              <a
                key={item.key}
                href={item.href}
                {...(item.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                aria-label={`${item.monoLabel}：${item.value}`}
                className={cellClass}
              >
                {body(item)}
              </a>
            ),
          )}
        </div>

        <div className="mt-5 flex justify-end">
          <Link
            to="/social"
            className="group flex items-center gap-2 text-[13px] text-ink-primary transition-colors hover:text-accent-blue"
          >
            <span className="font-mono-x tracking-[0.06em]">{c.contact.more}</span>
            <ArrowRight size={14} className="transition-transform group-hover:translate-x-[3px]" />
          </Link>
        </div>
      </motion.div>

      <QrLightbox qr={qr} onClose={() => setQr(null)} />
    </section>
  )
}

/* ------------------------------------------------------------------ */
/* About me                                                            */
/* ------------------------------------------------------------------ */
function About({ c }: { c: (typeof COPY)[Lang] }) {
  return (
    <section className="mx-auto max-w-[1200px] px-6 py-24">
      {/* Section eyebrow + ruler */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.5, ease: EASE }}
      >
        <p className="font-mono-x text-[11px] font-medium uppercase tracking-[0.18em] text-ink-muted">
          {c.about.titleEn} — {c.about.title}
        </p>
        <div className="mt-4 border-t border-line" />
      </motion.div>

      <div className="mt-12 grid gap-12 lg:grid-cols-12">
        {/* Left — typography column (7/12) */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5, ease: EASE }}
          className="lg:col-span-7"
        >
          <h2 className="font-serif-sc text-[22px] font-semibold text-ink-primary">
            {c.about.title}
          </h2>
          <p className="mt-5 text-[14px] leading-[1.85] text-ink-secondary">{c.about.p1}</p>
          <p className="mt-3 text-[14px] leading-[1.85] text-ink-secondary">{c.about.p2}</p>

          {/* Identities — mono-numbered grid */}
          <div className="mt-10 grid grid-cols-2 gap-x-8 gap-y-6">
            {c.about.identities.map((it, i) => (
              <div key={it.name} className="flex items-baseline gap-3">
                <span className="font-mono-x text-[11px] text-accent-blue">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <div>
                  <p className="text-[14px] font-semibold text-ink-primary">{it.name}</p>
                  <p className="mt-0.5 text-[12px] text-ink-muted">{it.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Interest tags — outline style */}
          <div className="mt-10 flex flex-wrap gap-2">
            {c.about.interests.map((tag) => (
              <span
                key={tag}
                className="font-mono-x rounded-[4px] border border-line px-2.5 py-1 text-[10.5px] tracking-[0.08em] text-ink-secondary transition-colors hover:border-line-strong hover:text-ink-primary"
              >
                {tag}
              </span>
            ))}
            <span className="font-mono-x rounded-[4px] border border-line px-2.5 py-1 text-[10.5px] text-ink-muted">
              …
            </span>
          </div>

          {/* Info — ruled list */}
          <div className="mt-10">
            {c.about.info.map((it) => (
              <div key={it.label} className="flex items-baseline gap-6 border-t border-line py-3">
                <span className="font-mono-x w-14 shrink-0 text-[11px] uppercase tracking-[0.18em] text-ink-muted">
                  {it.label}
                </span>
                <span className="text-[13px] text-ink-primary">{it.value}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Right — quote image (5/12) */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5, delay: 0.08, ease: EASE }}
          className="lg:col-span-5"
        >
          <div className="overflow-hidden rounded-md border border-line">
            <motion.img
              src="/about-photo.jpg"
              alt="Knowledge is a lifelong journey."
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.5, ease: EASE }}
              className="aspect-[4/3] w-full object-cover"
            />
          </div>
          <p className="font-mono-x mt-3 text-[11px] tracking-[0.08em] text-ink-muted">
            Knowledge is a lifelong journey.
          </p>
        </motion.div>
      </div>

      {/* Stats — borderless full-width ruled strip */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.5, ease: EASE }}
        className="mt-20 grid grid-cols-2 divide-x divide-line border-y border-line md:grid-cols-4"
      >
        {c.about.stats.map((s) => (
          <Link key={s.label} to={s.to} className="group px-4 py-8 text-center">
            <p
              className="font-mono-x font-medium text-ink-primary transition-colors group-hover:text-accent-blue"
              style={{ fontSize: 'clamp(28px, 3vw, 36px)' }}
            >
              <CountUp end={s.value} suffix={s.suffix} />
            </p>
            <p className="mt-2 text-[12px] text-ink-muted transition-colors group-hover:text-accent-blue">
              {s.label}
            </p>
          </Link>
        ))}
      </motion.div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */
export default function Home() {
  const { lang } = useLang()
  const c = COPY[lang]

  return (
    <>
      <Hero c={c} />
      <ContactStrip c={c} />
      <About c={c} />
    </>
  )
}
