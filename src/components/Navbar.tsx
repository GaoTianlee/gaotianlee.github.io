import { useEffect, useRef, useState } from 'react'
import { Link, NavLink, useLocation, useNavigate } from 'react-router'
import { AnimatePresence, motion } from 'framer-motion'
import { Menu, Moon, Search, Sun, X } from 'lucide-react'
import { useLang } from '@/lib/i18n'
import type { I18nKey } from '@/lib/i18n'
import { cn } from '@/lib/utils'

interface NavItem {
  key: I18nKey
  to: string
  num: string
}

const NAV_ITEMS: NavItem[] = [
  { key: 'nav.home', to: '/', num: '01' },
  { key: 'nav.education', to: '/education', num: '02' },
  { key: 'nav.work', to: '/work', num: '03' },
  { key: 'nav.awards', to: '/awards', num: '04' },
  { key: 'nav.social', to: '/social', num: '05' },
  { key: 'nav.shop', to: '/shop', num: '06' },
]

/** Static search index across pages (frontend-only). */
const SEARCH_INDEX: { title: string; path: string; keywords: string }[] = [
  { title: '首页 · 个人简介与联系方式', path: '/', keywords: 'home 简介 联系 wechat email github telegram qq youtube' },
  { title: '教育经历 · 学籍信息', path: '/education', keywords: 'education 教育 学籍 湖南工商大学 本科' },
  { title: '实习工作经历', path: '/work', keywords: 'work internship 实习 工作 经历' },
  { title: '作品集 Portfolio', path: '/work#portfolio', keywords: 'portfolio 项目 可视化 dashboard ai 阅读 知识库 摄影' },
  { title: '获奖证书', path: '/awards', keywords: 'awards certificate 奖学金 挑战杯 数学建模 aws python toefl' },
  { title: '社媒平台', path: '/social', keywords: 'social 小红书 youtube bilibili github 视频 vlog' },
  { title: '小店 · 服务店铺', path: '/shop', keywords: 'shop 小店 服务 ppt excel 算命 投资 博客搭建 图文美化 下单' },
]

function ThemeToggle() {
  const [dark, setDark] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false
    const saved = window.localStorage.getItem('theme')
    if (saved) return saved === 'dark'
    return window.matchMedia('(prefers-color-scheme: dark)').matches
  })

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light')
    window.localStorage.setItem('theme', dark ? 'dark' : 'light')
  }, [dark])

  return (
    <button
      type="button"
      aria-label="toggle dark mode"
      onClick={() => setDark((d) => !d)}
      className="flex h-7 w-7 items-center justify-center text-ink-secondary transition-colors hover:text-accent-blue"
    >
      {dark ? <Sun size={16} /> : <Moon size={16} />}
    </button>
  )
}

function SearchOverlay({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { t } = useLang()
  const [q, setQ] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)
  const navigate = useNavigate()

  useEffect(() => {
    if (open) {
      setQ('')
      setTimeout(() => inputRef.current?.focus(), 60)
    }
  }, [open])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  const results = q.trim()
    ? SEARCH_INDEX.filter((item) =>
        `${item.title} ${item.keywords}`.toLowerCase().includes(q.trim().toLowerCase()),
      )
    : []

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          onClick={onClose}
          className="bg-overlay-scrim fixed inset-0 z-[60]"
        >
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            transition={{ duration: 0.25, ease: [0.22, 0.61, 0.36, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="mx-auto mt-[12vh] w-[min(640px,calc(100vw-40px))] rounded-lg border border-line bg-card shadow-[0_8px_32px_rgba(27,25,21,0.08)]"
          >
            <div className="flex items-center gap-3 px-5 py-4">
              <Search size={16} className="shrink-0 text-ink-muted" />
              <input
                ref={inputRef}
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder={t('nav.searchPlaceholder')}
                className="w-full bg-transparent text-[15px] text-ink-primary outline-none placeholder:text-ink-muted"
              />
              <button
                type="button"
                onClick={onClose}
                className="flex h-7 w-7 items-center justify-center text-ink-secondary transition-colors hover:text-accent-blue"
                aria-label="close search"
              >
                <X size={16} />
              </button>
            </div>
            <div className="max-h-72 overflow-y-auto border-t border-line px-2 py-2">
              {!q.trim() && (
                <p className="px-3 py-3 font-mono-x text-[11px] uppercase tracking-[0.18em] text-ink-muted">
                  {t('nav.searchEmpty')}
                </p>
              )}
              {q.trim() && results.length === 0 && (
                <p className="px-3 py-3 text-[13px] text-ink-muted">{t('nav.noResult')}</p>
              )}
              {results.map((r) => (
                <button
                  key={r.path}
                  type="button"
                  onClick={() => {
                    onClose()
                    navigate(r.path)
                  }}
                  className="block w-full border-l-2 border-transparent px-3 py-2.5 text-left text-[14px] text-ink-primary transition-colors hover:border-accent-blue"
                >
                  {r.title}
                  <span className="ml-2 font-mono-x text-[11px] text-ink-muted">{r.path}</span>
                </button>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default function Navbar() {
  const { t } = useLang()
  const location = useLocation()
  const [scrolled, setScrolled] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [drawerOpen, setDrawerOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setDrawerOpen(false)
  }, [location.pathname])

  useEffect(() => {
    const prev = document.body.style.overflow
    document.body.style.overflow = drawerOpen ? 'hidden' : prev
    return () => {
      document.body.style.overflow = prev
    }
  }, [drawerOpen])

  const renderLink = (item: NavItem, mobile = false, index = 0) => {
    const label = t(item.key)

    if (mobile) {
      const mobileClass =
        'group flex items-baseline gap-4 py-4 font-serif-sc text-[28px] font-semibold leading-none'
      const num = (
        <span className="mono-num text-[12px]" data-active={undefined}>
          {item.num}
        </span>
      )
      return (
        <motion.div
          key={item.key}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.05 * index, ease: [0.22, 0.61, 0.36, 1] }}
        >
          <NavLink to={item.to} end={item.to === '/'} className={cn(mobileClass, 'text-ink-primary')}>
            {num}
            {label}
          </NavLink>
        </motion.div>
      )
    }

    const desktopClass =
      'underline-slide flex cursor-pointer items-baseline gap-1.5 py-2 text-[13px] font-medium'

    return (
      <NavLink
        key={item.key}
        to={item.to}
        end={item.to === '/'}
        className={({ isActive }) =>
          cn(desktopClass, isActive ? 'text-ink-primary' : 'text-ink-secondary')
        }
      >
        {({ isActive }) => (
          <>
            <span className="mono-num text-[10px]" data-active={isActive}>
              {item.num}
            </span>
            {label}
            {isActive && <span className="sr-only">(current)</span>}
          </>
        )}
      </NavLink>
    )
  }

  return (
    <>
      <header
        className={cn(
          'sticky top-0 z-50 h-14 border-b transition-all duration-300',
          scrolled ? 'border-line backdrop-blur-[12px]' : 'border-transparent',
        )}
        style={
          scrolled
            ? { backgroundColor: 'color-mix(in srgb, var(--bg-page) 85%, transparent)' }
            : { backgroundColor: 'transparent' }
        }
      >
        <div className="mx-auto flex h-full max-w-[1200px] items-center justify-between gap-4 px-6 md:px-6">
          {/* Brand — single-line mono mark */}
          <Link to="/" className="group flex shrink-0 items-baseline">
            <span className="font-mono-x text-[12px] font-medium tracking-[0.14em] text-ink-primary transition-colors group-hover:text-accent-blue">
              GT
            </span>
            <span className="font-mono-x ml-2 text-[12px] font-medium tracking-[0.14em] text-ink-muted transition-colors group-hover:text-accent-blue">
              — GAO TIANLEE
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden items-center gap-6 lg:flex xl:gap-8">
            {NAV_ITEMS.map((item) => renderLink(item))}
          </nav>

          {/* Right controls — 28px borderless icon buttons */}
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              aria-label={t('nav.search')}
              onClick={() => setSearchOpen(true)}
              className="flex h-7 w-7 items-center justify-center text-ink-secondary transition-colors hover:text-accent-blue"
            >
              <Search size={16} />
            </button>
            <ThemeToggle />
            <button
              type="button"
              aria-label="menu"
              onClick={() => setDrawerOpen((v) => !v)}
              className="flex h-7 w-7 items-center justify-center text-ink-secondary transition-colors hover:text-accent-blue lg:hidden"
            >
              {drawerOpen ? <X size={16} /> : <Menu size={16} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile drawer — full-screen solid ivory */}
      <AnimatePresence>
        {drawerOpen && (
          <motion.nav
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="fixed inset-0 top-14 z-40 overflow-y-auto bg-page lg:hidden"
          >
            <div className="flex flex-col px-6 pb-12 pt-8">
              {NAV_ITEMS.map((item, i) => renderLink(item, true, i))}
            </div>
          </motion.nav>
        )}
      </AnimatePresence>

      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  )
}
