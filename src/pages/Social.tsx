import { useEffect, useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import {
  ArrowUpRight,
  Building2,
  ChevronDown,
  Heart,
  Link as LinkIcon,
  Mail,
  MapPin,
  Search,
  SearchX,
  Smile,
  Users,
  X,
} from 'lucide-react'
import PageHeader from '@/components/PageHeader'
import { cn } from '@/lib/utils'

const EASE: [number, number, number, number] = [0.22, 0.61, 0.36, 1]

/* ------------------------------------------------------------------ */
/* Platform meta & brand icons                                         */
/* ------------------------------------------------------------------ */

type PlatformKey =
  | 'github'
  | 'youtube'
  | 'zhihu'
  | 'xhs'
  | 'x'
  | 'telegram'
  | 'qq'
  | 'wechat'
  | 'bilibili'

const PLATFORM_META: Record<PlatformKey, { name: string; color: string; url: string }> = {
  github: { name: 'GitHub', color: '#24292f', url: 'https://github.com/gtlhuyidan' },
  youtube: { name: 'YouTube', color: '#ff0000', url: 'https://www.youtube.com/@GaoTianlee' },
  zhihu: { name: '知乎', color: '#0066ff', url: 'https://www.zhihu.com' },
  xhs: { name: '小红书', color: '#ff2442', url: 'https://www.xiaohongshu.com' },
  x: { name: 'X (Twitter)', color: '#0f1419', url: 'https://x.com/GaoTianlee' },
  telegram: { name: 'Telegram', color: '#229ed9', url: 'https://t.me/GaoTianlee' },
  qq: { name: 'QQ', color: '#12b7f5', url: 'https://user.qzone.qq.com/2273018052' },
  wechat: { name: '微信', color: '#07c160', url: '#' },
  bilibili: { name: 'Bilibili', color: '#00a1d6', url: 'https://space.bilibili.com' },
}

/** Simple-icons style SVG paths (viewBox 0 0 24 24) for western platforms. */
const BRAND_PATHS: Partial<Record<PlatformKey, string>> = {
  github:
    'M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12',
  youtube:
    'M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z',
  x: 'M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z',
  telegram:
    'M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472c-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z',
}

/** Chinese platforms rendered as colored tiles with a white glyph. */
const BRAND_GLYPHS: Partial<Record<PlatformKey, string>> = {
  zhihu: '知',
  xhs: '红',
  qq: 'QQ',
  wechat: '微',
  bilibili: 'b',
}

function BrandIcon({ platform, size = 28 }: { platform: PlatformKey; size?: number }) {
  const meta = PLATFORM_META[platform]
  const path = BRAND_PATHS[platform]
  const glyph = BRAND_GLYPHS[platform]
  return (
    <span
      aria-hidden
      className="flex shrink-0 items-center justify-center rounded-[22%] text-white"
      style={{ width: size, height: size, backgroundColor: meta.color }}
    >
      {path ? (
        <svg
          viewBox="0 0 24 24"
          width={Math.round(size * 0.58)}
          height={Math.round(size * 0.58)}
          fill="currentColor"
        >
          <path d={path} />
        </svg>
      ) : (
        <span className="font-bold leading-none" style={{ fontSize: Math.round(size * 0.42) }}>
          {glyph}
        </span>
      )}
    </span>
  )
}

/* ------------------------------------------------------------------ */
/* Data                                                                */
/* ------------------------------------------------------------------ */

interface SocialCardData {
  id: number
  cover: string
  type: 'note' | 'video'
  duration?: string
  title: string
  desc: string
  platform: PlatformKey
  date: string
  ts: number
  views: number
  likes: number
  categories: string[]
  /** 指定文章直达链接（默认跳转平台主页） */
  url?: string
}

const CARDS: SocialCardData[] = [
  {
    id: 1,
    cover: '/social-zhihu.png',
    type: 'note',
    title: '六朝何事，只成门户私计',
    desc: '嘿嘿的文章 · 知乎专栏。六朝旧事随流水，但寒烟衰草凝绿——一篇读史随笔。',
    platform: 'zhihu',
    date: '2025.07.19',
    ts: Date.parse('2025-07-19'),
    views: 8600,
    likes: 421,
    categories: ['图文笔记', '观点随笔'],
    url: 'https://zhuanlan.zhihu.com/p/1938868319437423342',
  },
]

const PROFILE_LINKS: { platform: PlatformKey; account: string }[] = [
  { platform: 'github', account: 'github.com/gtlhuyidan' },
  { platform: 'youtube', account: '@Gao Tianlee' },
  { platform: 'zhihu', account: '@Gao Tianlee' },
  { platform: 'xhs', account: '@Gao Tianlee' },
  { platform: 'x', account: '@GaoTianlee' },
  { platform: 'telegram', account: '@GaoTianlee' },
  { platform: 'qq', account: '2273018052' },
  { platform: 'wechat', account: '1866393 5936' },
]

const CATEGORIES = ['全部', '图文笔记', '视频', '技术分享', '生活记录', '旅行摄影', '观点随笔']

const SORTS = [
  { key: 'latest', label: '最新发布' },
  { key: 'views', label: '最多浏览' },
  { key: 'likes', label: '最多喜欢' },
] as const

type SortKey = (typeof SORTS)[number]['key']

function formatNum(v: number): string {
  if (v >= 1000) {
    const s = (v / 1000).toFixed(1)
    return `${s.endsWith('.0') ? s.slice(0, -2) : s}k`
  }
  return String(v)
}

/* ------------------------------------------------------------------ */
/* Left column — GitHub-profile style sidebar (no card chrome)         */
/* ------------------------------------------------------------------ */

const INFO_ROWS: { icon: typeof MapPin; text: string }[] = [
  { icon: Building2, text: '学生 · 湖南工商大学' },
  { icon: MapPin, text: 'Tokyo, Japan' },
  { icon: LinkIcon, text: 'github.com/gtlhuyidan' },
  { icon: Mail, text: 'gtl.huyidan@gmail.com' },
]

function ProfileSidebar() {
  return (
    <motion.aside
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.5, ease: EASE }}
      className="self-start lg:sticky lg:top-[80px]"
    >
      {/* Avatar — large round, hairline border, status emoji button */}
      <div className="flex items-center gap-4 lg:block">
        <div className="relative shrink-0">
          <img
            src="/portrait.jpg"
            alt="Gao Tianlee"
            className="h-20 w-20 rounded-full border border-line object-cover lg:h-[280px] lg:w-[280px]"
          />
          <button
            type="button"
            aria-label="设置状态"
            title="设置状态"
            className="absolute bottom-0 right-0 flex h-7 w-7 items-center justify-center rounded-full border border-line bg-card text-ink-secondary transition-colors hover:border-accent hover:text-accent-blue lg:bottom-4 lg:right-4 lg:h-10 lg:w-10"
          >
            <Smile size={13} className="lg:hidden" />
            <Smile size={18} className="hidden lg:block" />
          </button>
        </div>

        {/* Name + username */}
        <div className="min-w-0 lg:mt-4">
          <h2 className="text-[22px] font-semibold leading-tight text-ink-primary lg:text-[26px]">
            Gao Tianlee
          </h2>
          <p className="mt-0.5 text-[15px] font-light text-ink-muted lg:text-[20px]">
            @GaoTianlee
          </p>
        </div>
      </div>

      {/* Bio */}
      <p className="mt-4 text-[14px] leading-[1.7] text-ink-secondary">
        用持续的学习，创造更大的可能。
      </p>

      {/* Followers · following — GitHub style */}
      <div className="mt-4 flex items-center gap-1.5 text-[14px] text-ink-muted">
        <Users size={15} className="shrink-0" />
        <span>
          <span className="font-semibold text-ink-primary">2.4k</span> 粉丝
        </span>
        <span aria-hidden>·</span>
        <span>
          <span className="font-semibold text-ink-primary">128</span> 关注
        </span>
      </div>

      {/* Info list */}
      <ul className="mt-4 space-y-2">
        {INFO_ROWS.map((row) => (
          <li key={row.text} className="flex items-center gap-2 text-[14px] text-ink-muted">
            <row.icon size={15} className="shrink-0" />
            <span className="truncate">{row.text}</span>
          </li>
        ))}
      </ul>

      {/* Platform links — ruled rows */}
      <h3 className="mt-8 border-b border-line pb-2.5 text-[14px] font-semibold text-ink-primary">
        我的社媒平台
      </h3>
      <div className="grid grid-cols-1 gap-x-4 sm:grid-cols-2 lg:grid-cols-1">
        {PROFILE_LINKS.map((link, i) => {
          const meta = PLATFORM_META[link.platform]
          return (
            <motion.a
              key={link.platform}
              href={meta.url}
              target="_blank"
              rel="noreferrer"
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.08 + i * 0.04, ease: EASE }}
              className="group flex items-center gap-2.5 border-b border-line py-2.5"
            >
              <BrandIcon platform={link.platform} size={24} />
              <span className="min-w-0 flex-1">
                <span className="block truncate text-[13px] font-semibold text-ink-primary transition-colors group-hover:text-accent-blue">
                  {meta.name}
                </span>
                <span className="font-mono-x block truncate text-[11.5px] text-ink-muted">
                  {link.account}
                </span>
              </span>
              <ArrowUpRight
                size={14}
                className="shrink-0 text-ink-muted transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent-blue"
              />
            </motion.a>
          )
        })}
      </div>
    </motion.aside>
  )
}

/* ------------------------------------------------------------------ */
/* Feed item — YouTube / 小红书 hybrid, no card chrome                 */
/* ------------------------------------------------------------------ */

interface FeedItemProps {
  card: SocialCardData
  index: number
  liked: boolean
  likeCount: number
  onLike: () => void
}

function FeedItem({ card, index, liked, likeCount, onLike }: FeedItemProps) {
  const meta = PLATFORM_META[card.platform]
  const openExternal = () =>
    window.open(card.url ?? meta.url, '_blank', 'noopener,noreferrer')
  const isVideo = card.type === 'video'

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.5, delay: (index % 3) * 0.05, ease: EASE }}
      className="group flex min-w-0 flex-col"
    >
      {/* Cover — rounded corners only, slight zoom on hover */}
      <button
        type="button"
        onClick={openExternal}
        aria-label={card.title}
        className={cn(
          'relative block w-full cursor-pointer overflow-hidden rounded-[8px] text-left',
          isVideo ? 'aspect-video' : 'aspect-[3/4]',
        )}
      >
        <img
          src={card.cover}
          alt={card.title}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
        />
        {isVideo && card.duration && (
          <span className="absolute bottom-2 right-2 rounded-[4px] bg-black/80 px-1.5 py-0.5 font-mono-x text-[11px] tabular-nums leading-none text-white">
            {card.duration}
          </span>
        )}
      </button>

      {/* Text below cover */}
      <div className="mt-2.5 flex flex-col gap-1.5">
        <button type="button" onClick={openExternal} className="text-left">
          <h3 className="line-clamp-2 text-[15px] font-medium leading-snug text-ink-primary transition-colors group-hover:text-accent-blue">
            {card.title}
          </h3>
        </button>

        {isVideo ? (
          /* YouTube-style meta row: platform · views · date */
          <div className="flex flex-wrap items-center gap-x-1.5 gap-y-1 text-[12.5px] text-ink-muted">
            <span className="flex items-center gap-1.5">
              <BrandIcon platform={card.platform} size={16} />
              {meta.name}
            </span>
            <span aria-hidden>·</span>
            <span className="tabular-nums">{formatNum(card.views)} 次观看</span>
            <span aria-hidden>·</span>
            <span className="font-mono-x tabular-nums">{card.date}</span>
          </div>
        ) : (
          /* 小红书-style footer: platform + like button */
          <div className="flex items-center gap-1.5 text-[12.5px] text-ink-muted">
            <BrandIcon platform={card.platform} size={16} />
            <span className="truncate">{meta.name}</span>
            <button
              type="button"
              aria-label="喜欢"
              aria-pressed={liked}
              onClick={onLike}
              className={cn(
                'ml-auto flex items-center gap-1 tabular-nums transition-colors',
                liked ? 'text-[#ff2442]' : 'hover:text-[#ff2442]',
              )}
            >
              <motion.span
                key={String(liked)}
                initial={liked ? { scale: 0.6 } : false}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 500, damping: 12 }}
                className="flex"
              >
                <Heart size={14} fill={liked ? 'currentColor' : 'none'} />
              </motion.span>
              {formatNum(likeCount)}
            </button>
          </div>
        )}
      </div>
    </motion.article>
  )
}

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

export default function Social() {
  const [category, setCategory] = useState('全部')
  const [query, setQuery] = useState('')
  const [debouncedQuery, setDebouncedQuery] = useState('')
  const [sort, setSort] = useState<SortKey>('latest')
  const [likes, setLikes] = useState<Record<number, number>>(() =>
    Object.fromEntries(CARDS.map((c) => [c.id, c.likes])),
  )
  const [liked, setLiked] = useState<Record<number, boolean>>({})

  // 200ms debounced search
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(query.trim().toLowerCase()), 200)
    return () => clearTimeout(timer)
  }, [query])

  const toggleLike = (id: number) => {
    const next = !liked[id]
    setLiked((prev) => ({ ...prev, [id]: next }))
    setLikes((prev) => ({ ...prev, [id]: prev[id] + (next ? 1 : -1) }))
  }

  const visible = useMemo(() => {
    let list = CARDS.filter((c) => {
      const matchCat = category === '全部' || c.categories.includes(category)
      const matchQuery =
        !debouncedQuery ||
        `${c.title} ${c.desc} ${PLATFORM_META[c.platform].name}`
          .toLowerCase()
          .includes(debouncedQuery)
      return matchCat && matchQuery
    })
    if (sort === 'views') list = [...list].sort((a, b) => b.views - a.views)
    else if (sort === 'likes') list = [...list].sort((a, b) => likes[b.id] - likes[a.id])
    else list = [...list].sort((a, b) => b.ts - a.ts)
    return list
  }, [category, debouncedQuery, sort, likes])

  return (
    <div>
      <PageHeader
        eyebrow="05 — SOCIAL & MEDIA"
        title="社媒平台"
        subtitle="Share Ideas, Connect People, Build a Better World."
        quote="分享知识，连接有趣的灵魂。"
      />

      <div className="mx-auto mt-14 max-w-[1200px] px-6 pb-24">
        <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-[296px_minmax(0,1fr)]">
          <ProfileSidebar />

          {/* Right column — content feed */}
          <section className="min-w-0">
            {/* Toolbar — underline tabs + search + sort */}
            <div className="flex flex-col gap-4">
              <div className="flex flex-wrap items-center gap-x-5 border-b border-line">
                {CATEGORIES.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setCategory(c)}
                    className={cn(
                      '-mb-px border-b pb-2.5 text-[13px] transition-colors',
                      category === c
                        ? 'border-ink-primary font-semibold text-ink-primary'
                        : 'border-transparent text-ink-muted hover:text-ink-primary',
                    )}
                  >
                    {c}
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-2.5">
                <label className="flex flex-1 items-center gap-2 border border-line bg-transparent px-3.5 py-2 transition-colors focus-within:border-accent">
                  <Search size={15} className="shrink-0 text-ink-muted" />
                  <input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="搜索内容…"
                    className="w-full bg-transparent text-[13.5px] text-ink-primary outline-none placeholder:text-ink-muted"
                  />
                  {query && (
                    <button
                      type="button"
                      aria-label="清空搜索"
                      onClick={() => setQuery('')}
                      className="shrink-0 text-ink-muted hover:text-accent-blue"
                    >
                      <X size={14} />
                    </button>
                  )}
                </label>
                <div className="relative shrink-0">
                  <select
                    value={sort}
                    onChange={(e) => setSort(e.target.value as SortKey)}
                    aria-label="排序方式"
                    className="cursor-pointer appearance-none border border-line bg-transparent py-2 pl-3.5 pr-9 text-[12.5px] font-medium text-ink-secondary outline-none transition-colors hover:border-accent"
                  >
                    {SORTS.map((s) => (
                      <option key={s.key} value={s.key}>
                        {s.label}
                      </option>
                    ))}
                  </select>
                  <ChevronDown
                    size={14}
                    className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-ink-muted"
                  />
                </div>
              </div>
            </div>

            {/* Feed grid */}
            {visible.length > 0 ? (
              <motion.div
                layout
                className="mt-6 grid grid-cols-2 gap-x-4 gap-y-7 xl:grid-cols-3"
              >
                <AnimatePresence mode="popLayout">
                  {visible.map((card, i) => (
                    <FeedItem
                      key={card.id}
                      card={card}
                      index={i}
                      liked={!!liked[card.id]}
                      likeCount={likes[card.id]}
                      onLike={() => toggleLike(card.id)}
                    />
                  ))}
                </AnimatePresence>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, ease: EASE }}
                className="mt-6 flex flex-col items-center gap-3 border border-dashed border-line px-6 py-16 text-center"
              >
                <SearchX size={36} className="text-ink-muted" />
                <p className="text-[15px] font-medium text-ink-secondary">没有找到相关内容</p>
                <p className="text-[13px] text-ink-muted">试试更换分类或搜索关键词</p>
              </motion.div>
            )}
          </section>
        </div>
      </div>
    </div>
  )
}
