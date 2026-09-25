import { useEffect, useState, type ReactNode } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import {
  ArrowUpRight,
  Heart,
  MessageCircle,
  Truck,
  X,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const EASE: [number, number, number, number] = [0.22, 0.61, 0.36, 1]

/* ---------------------------------- data ---------------------------------- */

interface ShopItem {
  id: string
  /** 器物式短名（衬线大字） */
  name: string
  /** 完整标题（详情页用） */
  title: string
  category: string
  categoryEn: string
  /** 一句话推荐语 */
  quote: string
  /** 规格行（服务形态） */
  spec: string
  img: string
  price: number
  originalPrice?: number
  wantCount: number
  badges: string[]
  desc: string
  specs: { k: string; v: string }[]
  badge?: '热销' | '主推' | '孤品'
  /** 已上线的在线产品，直达站点 */
  siteUrl?: string
  /** 品牌组合 Logo 图（替代封面照片） */
  logoArt?: ReactNode
}

const SHOPS: ShopItem[] = [
  {
    id: 'tarot',
    name: '观爻',
    title: '算命命理｜紫微斗数/八字/六爻 一对一解读 三天内答疑',
    category: '命理',
    categoryEn: 'DIVINATION',
    quote: '为你提供一点确定性。',
    spec: '紫微斗数 · 八字 · 六爻',
    img: '/shop-tarot.png',
    logoArt: <BaguaArt />,
    price: 39,
    originalPrice: 88,
    wantCount: 132,
    badges: ['在线产品', '已上线'],
    badge: '热销',
    desc: '主营紫微斗数、八字命理、六爻占卜三大业务：排盘起卦、命盘解读与日常决策参考，输出易懂的书面分析与行动建议。已上线为在线系统，点击即可自助排盘起卦。',
    siteUrl: 'https://fatescript.ok.kimi.link',
    specs: [
      { k: '主要业务', v: '紫微斗数 · 八字 · 六爻' },
      { k: '交付内容', v: '一对一解读 + 书面分析报告 + 行动建议' },
      { k: '交付周期', v: '当天出结果' },
      { k: '售后服务', v: '三天内免费答疑' },
    ],
  },
  {
    id: 'asset',
    name: '衡策',
    title: '投资业务｜股票/比特币/美元/房产 全资产配置方案 已上线',
    category: '投资',
    categoryEn: 'INVESTMENT',
    quote: '用研究的视角看待市场。',
    spec: '在线系统 + 人工复核',
    img: '/shop-asset.png',
    logoArt: <InvestArt />,
    price: 199,
    originalPrice: 399,
    wantCount: 45,
    badges: ['在线产品', '已上线'],
    badge: '主推',
    desc: '覆盖股票、比特币、美元资产、房产等多资产的配置方案：基于风险画像的比例诊断，输出可执行的再平衡建议。已上线为在线产品，点击即可进入系统体验完整流程。',
    specs: [
      { k: '交付内容', v: '资产诊断报告 + 配置方案 + 再平衡建议' },
      { k: '交付周期', v: '在线系统即时生成，人工复核 1 天' },
      { k: '产品形态', v: '在线系统 + 人工服务' },
      { k: '计价方式', v: '¥199/次起，年度跟踪另议' },
    ],
    siteUrl: 'https://investing.kimi.site/vault',
  },
  {
    id: 'aigen',
    name: '造物',
    title: 'AI生图业务｜NanoBanana × GPT Image 2 双引擎 在线生成',
    category: '生图',
    categoryEn: 'AI IMAGERY',
    quote: '一句话，一张可以发表的画。',
    spec: 'NanoBanana × GPT Image 2',
    img: '/shop-aigen.png',
    logoArt: <AiGenArt />,
    price: 29,
    originalPrice: 69,
    wantCount: 118,
    badges: ['在线产品', '已上线'],
    badge: '热销',
    desc: 'AI 生图工作台搭载 NanoBanana 与 GPT Image 2 双引擎：科研配图、海报插画、社媒封面一站式生成。已部署为在线系统，点击进入即可自助体验；也可下单定制精修版。',
    specs: [
      { k: '交付内容', v: '在线生成 + 定制精修 + 多尺寸导出' },
      { k: '交付周期', v: '在线即时，定制 1–2 天' },
      { k: '产品形态', v: '在线系统 + 人工定制' },
      { k: '计价方式', v: '¥29/张起，批量另议' },
    ],
    siteUrl: 'https://bananado.kimi.site/settings',
  },
]

/* --------------------------- brand logo art ---------------------------- */

/** 八卦太极图：阴阳鱼 + 八宫卦象环绕 */
function BaguaArt() {
  // 八卦卦象（自上而下三条爻，1=阳实线 0=阴断线），按先天八卦方位
  const trigrams = [
    [1, 1, 1], [1, 1, 0], [1, 0, 1], [1, 0, 0],
    [0, 1, 1], [0, 1, 0], [0, 0, 1], [0, 0, 0],
  ]
  return (
    <svg viewBox="0 0 200 200" className="h-full w-full" aria-hidden>
      <circle cx="100" cy="100" r="94" fill="none" stroke="#C9BFA8" strokeWidth="1" />
      {trigrams.map((t, i) => {
        const a = (i * Math.PI) / 4 - Math.PI / 2
        const cx = 100 + 78 * Math.cos(a)
        const cy = 100 + 78 * Math.sin(a)
        return (
          <g key={i} transform={`translate(${cx} ${cy}) rotate(${(i * 45) - 90 + 90})`}>
            {t.map((yang, j) =>
              yang ? (
                <rect key={j} x="-11" y={-8 + j * 8} width="22" height="3.4" rx="1.2" fill="#5C5240" />
              ) : (
                <g key={j}>
                  <rect x="-11" y={-8 + j * 8} width="9.4" height="3.4" rx="1.2" fill="#5C5240" />
                  <rect x="1.6" y={-8 + j * 8} width="9.4" height="3.4" rx="1.2" fill="#5C5240" />
                </g>
              ),
            )}
          </g>
        )
      })}
      {/* 阴阳鱼 */}
      <g>
        <path d="M100 60a40 40 0 0 1 0 80 20 20 0 0 1 0-40 20 20 0 0 0 0-40z" fill="#2E2A22" />
        <path d="M100 60a40 40 0 0 0 0 80 20 20 0 0 0 0-40 20 20 0 0 1 0-40z" fill="#F5F1E6" stroke="#2E2A22" strokeWidth="1.4" />
        <circle cx="100" cy="80" r="6" fill="#2E2A22" />
        <circle cx="100" cy="120" r="6" fill="#F5F1E6" stroke="#2E2A22" strokeWidth="1.4" />
      </g>
    </svg>
  )
}

/** 投资业务：股票 / 比特币 / 美元 / 房产 四宫格组合 */
function InvestArt() {
  const cell = 'flex items-center justify-center rounded-lg'
  return (
    <div className="grid h-full w-full grid-cols-2 gap-2.5 p-2.5" aria-hidden>
      <div className={cell} style={{ backgroundColor: '#EAF3EC' }}>
        <svg viewBox="0 0 48 48" className="h-3/5 w-3/5">
          <polyline points="6,36 18,24 26,30 42,12" fill="none" stroke="#2E7D5B" strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round" />
          <polyline points="32,12 42,12 42,22" fill="none" stroke="#2E7D5B" strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
      <div className={cell} style={{ backgroundColor: '#FBF0E2' }}>
        <svg viewBox="0 0 48 48" className="h-3/5 w-3/5">
          <circle cx="24" cy="24" r="17" fill="#F7931A" />
          <text x="24" y="31" textAnchor="middle" fontSize="20" fontWeight="700" fill="#fff" fontFamily="Inter, sans-serif">₿</text>
        </svg>
      </div>
      <div className={cell} style={{ backgroundColor: '#E8EFF7' }}>
        <svg viewBox="0 0 48 48" className="h-3/5 w-3/5">
          <circle cx="24" cy="24" r="17" fill="#2F5B8F" />
          <text x="24" y="32" textAnchor="middle" fontSize="21" fontWeight="700" fill="#fff" fontFamily="Inter, sans-serif">$</text>
        </svg>
      </div>
      <div className={cell} style={{ backgroundColor: '#F3EDE3' }}>
        <svg viewBox="0 0 48 48" className="h-3/5 w-3/5">
          <path d="M8 24 24 10l16 14" fill="none" stroke="#8C7851" strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M13 24v13h22V24" fill="none" stroke="#8C7851" strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round" />
          <rect x="21" y="28" width="7" height="9" fill="#8C7851" rx="1" />
        </svg>
      </div>
    </div>
  )
}

/** AI 生图：NanoBanana + GPT Image 双品牌组合 */
function AiGenArt() {
  return (
    <div className="flex h-full w-full items-stretch gap-2.5 p-2.5" aria-hidden>
      <div className="flex flex-1 flex-col items-center justify-center gap-1.5 rounded-lg" style={{ backgroundColor: '#FBF3D9' }}>
        <svg viewBox="0 0 48 48" className="h-2/5 w-2/5">
          <path d="M10 30c2 8 10 12 17 10 8-2 12-9 11-17-.2-1.5-2.4-1.8-3-.4C32 29 26 33 20 31c-4.5-1.5-7-6-6.5-10.5.2-1.6-1.8-2.3-2.6-1-1.3 2.3-1.6 6.6-.9 10.5z" fill="#E8B93B" />
          <path d="M34 12c1.2-3 4-4.5 6.5-4" fill="none" stroke="#8C7851" strokeWidth="2.6" strokeLinecap="round" />
        </svg>
        <span className="font-mono-x text-[10px] font-semibold uppercase tracking-[0.12em] text-[#8C6D1F]">NanoBanana</span>
      </div>
      <div className="flex flex-1 flex-col items-center justify-center gap-1.5 rounded-lg" style={{ backgroundColor: '#2E2A22' }}>
        <svg viewBox="0 0 48 48" className="h-2/5 w-2/5">
          <rect x="8" y="10" width="32" height="24" rx="4" fill="none" stroke="#F5F1E6" strokeWidth="2.6" />
          <circle cx="17" cy="19" r="3" fill="#F5F1E6" />
          <path d="M10 30l8-7 6 5 8-8 6 6" fill="none" stroke="#F5F1E6" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M38 6l1.4 3.2L42.6 10.6l-3.2 1.4L38 15.2l-1.4-3.2-3.2-1.4 3.2-1.4z" fill="#E8B93B" />
        </svg>
        <span className="font-mono-x text-[10px] font-semibold uppercase tracking-[0.12em] text-[#F5F1E6]">GPT Image 2</span>
      </div>
    </div>
  )
}

const PAY_METHODS = [
  { id: 'wechat', label: '微信支付', color: '#07C160', img: '/pay-wechat.jpg' },
  { id: 'alipay', label: '支付宝', color: '#1677FF', img: '/pay-alipay.jpg' },
] as const

type PayMethod = (typeof PAY_METHODS)[number]['id']

/* ------------------------------ pay sheet ------------------------------- */

function PaySheet({
  item,
  onClose,
}: {
  item: ShopItem
  onClose: () => void
}) {
  const [method, setMethod] = useState<PayMethod>('wechat')
  const active = PAY_METHODS.find((m) => m.id === method)!

  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 28 }}
      transition={{ duration: 0.28, ease: EASE }}
      onClick={(e) => e.stopPropagation()}
      className="w-[min(92vw,400px)] rounded-lg border border-line bg-card p-5"
      role="dialog"
      aria-modal="true"
      aria-label="扫码支付"
    >
      <div className="flex items-center justify-between">
        <p className="font-mono-x text-[11px] uppercase tracking-[0.16em] text-ink-muted">
          收银台 · CHECKOUT
        </p>
        <button
          type="button"
          aria-label="关闭"
          onClick={onClose}
          className="text-ink-muted transition-colors hover:text-ink-primary"
        >
          <X size={17} />
        </button>
      </div>

      <p className="mt-2 truncate text-[14px] font-medium text-ink-primary">{item.title}</p>

      {/* method tabs */}
      <div className="mt-4 grid grid-cols-2 gap-2">
        {PAY_METHODS.map((m) => (
          <button
            key={m.id}
            type="button"
            onClick={() => setMethod(m.id)}
            className={cn(
              'flex items-center justify-center gap-2 rounded-md border px-3 py-2.5 text-[13px] font-medium transition-all',
              method === m.id
                ? 'border-transparent text-white'
                : 'border-line bg-bg-page text-ink-secondary hover:text-ink-primary',
            )}
            style={method === m.id ? { backgroundColor: m.color } : undefined}
          >
            <span
              className="flex h-4 w-4 items-center justify-center rounded-full text-[10px]"
              style={
                method === m.id
                  ? { backgroundColor: 'rgba(255,255,255,0.25)' }
                  : { backgroundColor: m.color, color: '#fff' }
              }
            >
              {m.id === 'wechat' ? '微' : '支'}
            </span>
            {m.label}
          </button>
        ))}
      </div>

      {/* qr */}
      <div className="mt-4 overflow-hidden rounded-md border border-line bg-white">
        <AnimatePresence mode="wait">
          <motion.img
            key={method}
            src={active.img}
            alt={`${active.label}收款码`}
            draggable={false}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.2 }}
            className="qr-img no-dim h-auto w-full"
          />
        </AnimatePresence>
      </div>

      <p className="mt-3 text-center text-[12px] leading-relaxed text-ink-muted">
        打开{active.label}「扫一扫」付款，备注商品名称；
        <br />
        付款后请截图联系店主微信（Gtl_huyidan）确认订单
      </p>
    </motion.div>
  )
}

/* ---------------------------- detail overlay ----------------------------- */

function DetailOverlay({
  item,
  onClose,
}: {
  item: ShopItem | null
  onClose: () => void
}) {
  const [payOpen, setPayOpen] = useState(false)

  useEffect(() => {
    if (!item) return
    setPayOpen(false)
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
  }, [item, onClose])

  return (
    <AnimatePresence>
      {item && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-[70] flex items-end justify-center sm:items-center sm:p-6"
          role="dialog"
          aria-modal="true"
          aria-label={item.title}
        >
          <div className="bg-overlay-scrim absolute inset-0" onClick={onClose} />

          <motion.div
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 32 }}
            transition={{ duration: 0.32, ease: EASE }}
            className="relative flex max-h-[92vh] w-full max-w-[520px] flex-col overflow-hidden rounded-t-xl border border-line bg-bg-page sm:rounded-xl"
          >
            <button
              type="button"
              aria-label="关闭"
              onClick={onClose}
              className="absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-black/35 text-white backdrop-blur-sm transition-colors hover:bg-black/50"
            >
              <X size={16} />
            </button>

            {/* scrollable body */}
            <div className="flex-1 overflow-y-auto">
              {/* gallery */}
              <div className="relative">
                {item.logoArt ? (
                  <div className="aspect-square w-full bg-[#F6F1E6]">{item.logoArt}</div>
                ) : (
                  <img
                    src={item.img}
                    alt={item.title}
                    draggable={false}
                    className="no-dim aspect-square w-full object-cover"
                  />
                )}
                <span className="absolute bottom-2.5 right-3 rounded-full bg-black/45 px-2.5 py-0.5 text-[11px] text-white backdrop-blur-sm">
                  1/1
                </span>
              </div>

              <div className="px-4 pb-4 pt-4">
                {/* price row */}
                <div className="flex items-end justify-between">
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-[15px] font-semibold text-[#FF4A33]">¥</span>
                    <span className="font-mono-x text-[30px] font-semibold leading-none tracking-tight text-[#FF4A33]">
                      {item.price}
                    </span>
                    <span className="text-[11.5px] text-ink-muted">起</span>
                    {item.originalPrice && (
                      <span className="ml-1 text-[12px] text-ink-muted line-through">
                        ¥{item.originalPrice}
                      </span>
                    )}
                  </div>
                  <span className="text-[12px] text-ink-muted">{item.wantCount} 人想要</span>
                </div>

                {/* badges */}
                <div className="mt-2.5 flex flex-wrap gap-1.5">
                  <span className="flex items-center gap-1 rounded bg-[#FF4A33]/10 px-1.5 py-0.5 text-[11px] font-medium text-[#FF4A33]">
                    <Truck size={11} />
                    免运费
                  </span>
                  {item.badges.map((b) => (
                    <span
                      key={b}
                      className="rounded bg-accent-soft px-1.5 py-0.5 text-[11px] text-ink-secondary"
                    >
                      {b}
                    </span>
                  ))}
                </div>

                {/* title */}
                <h2 className="mt-3 text-[15.5px] font-medium leading-[1.55] text-ink-primary">
                  {item.title}
                </h2>

                {/* description */}
                <div className="mt-5">
                  <p className="flex items-center gap-2 text-[13px] font-semibold text-ink-primary">
                    <span className="h-3.5 w-[3px] rounded-full bg-accent-blue" />
                    宝贝描述
                  </p>
                  <p className="mt-2 text-[13.5px] leading-[1.9] text-ink-secondary">{item.desc}</p>
                </div>

                {/* specs */}
                <div className="mt-5">
                  <p className="flex items-center gap-2 text-[13px] font-semibold text-ink-primary">
                    <span className="h-3.5 w-[3px] rounded-full bg-accent-blue" />
                    服务详情
                  </p>
                  <dl className="mt-2.5 divide-y divide-line rounded-md border border-line bg-card">
                    {item.specs.map((s) => (
                      <div key={s.k} className="flex gap-3 px-3.5 py-2.5">
                        <dt className="w-[68px] shrink-0 text-[12.5px] text-ink-muted">{s.k}</dt>
                        <dd className="text-[12.5px] leading-relaxed text-ink-primary">{s.v}</dd>
                      </div>
                    ))}
                  </dl>
                </div>

                <p className="mt-4 text-center text-[11px] text-ink-muted">
                  — 宝贝到底了 —
                </p>
              </div>
            </div>

            {/* bottom bar */}
            <div className="flex items-center gap-3 border-t border-line bg-card px-4 py-3">
              <button
                type="button"
                className="flex flex-col items-center gap-0.5 text-ink-secondary transition-colors hover:text-accent-blue"
                aria-label="聊一聊"
              >
                <MessageCircle size={19} strokeWidth={1.7} />
                <span className="text-[10px]">聊一聊</span>
              </button>
              <button
                type="button"
                className="flex flex-col items-center gap-0.5 text-ink-secondary transition-colors hover:text-[#FF4A33]"
                aria-label="收藏"
              >
                <Heart size={19} strokeWidth={1.7} />
                <span className="text-[10px]">想要</span>
              </button>
              {item.siteUrl && (
                <a
                  href={item.siteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ml-auto flex-1 rounded-full border border-accent-blue py-2.5 text-center text-[14.5px] font-semibold text-accent-blue transition-colors hover:bg-accent-soft"
                >
                  进入网站
                </a>
              )}
              <button
                type="button"
                onClick={() => setPayOpen(true)}
                className={cn(
                  'flex-1 rounded-full bg-gradient-to-r from-[#FF6A3D] to-[#FF4A33] py-2.5 text-[14.5px] font-semibold text-white shadow-sm transition-opacity hover:opacity-90',
                  !item.siteUrl && 'ml-auto',
                )}
              >
                立即购买
              </button>
            </div>

            {/* pay sheet */}
            <AnimatePresence>
              {payOpen && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  onClick={() => setPayOpen(false)}
                  className="absolute inset-0 z-20 flex items-end justify-center bg-black/45 p-4 backdrop-blur-[2px] sm:items-center"
                >
                  <PaySheet item={item} onClose={() => setPayOpen(false)} />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

/* ------------------------------- gallery card ------------------------------ */

const BADGE_STYLE: Record<string, string> = {
  热销: 'bg-accent-blue text-white',
  主推: 'bg-accent-blue text-white',
  孤品: 'bg-ink-primary text-bg-page',
}

function ShopCard({
  item,
  index,
  onOpen,
}: {
  item: ShopItem
  index: number
  onOpen: () => void
}) {
  return (
    <motion.button
      type="button"
      onClick={onOpen}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.6, delay: index * 0.08, ease: EASE }}
      whileHover="hover"
      className="group block w-full text-left"
      aria-label={`查看详情：${item.title}`}
    >
      {/* 3:4 封面 — 品牌组合logo或实拍图 */}
      <div className="relative aspect-square overflow-hidden bg-[#F6F1E6]">
        {item.logoArt ? (
          <motion.div
            variants={{ rest: { scale: 1 }, hover: { scale: 1.04 } }}
            initial="rest"
            animate="rest"
            transition={{ duration: 0.7, ease: EASE }}
            className="h-full w-full"
          >
            {item.logoArt}
          </motion.div>
        ) : (
          <motion.img
            src={item.img}
            alt={item.title}
            draggable={false}
            loading="lazy"
            variants={{ rest: { scale: 1 }, hover: { scale: 1.05 } }}
            initial="rest"
            animate="rest"
            transition={{ duration: 0.7, ease: EASE }}
            className="no-dim h-full w-full object-cover"
          />
        )}
        {item.badge && (
          <span
            className={cn(
              'font-mono-x absolute right-3 top-3 px-2 py-1 text-[10.5px] tracking-[0.1em]',
              BADGE_STYLE[item.badge],
            )}
          >
            {item.badge}
          </span>
        )}
        <motion.span
          variants={{ rest: { opacity: 0, y: 8 }, hover: { opacity: 1, y: 0 } }}
          transition={{ duration: 0.3, ease: EASE }}
          className="absolute bottom-3 left-3 flex items-center gap-1 bg-bg-page/90 px-3 py-1.5 text-[11.5px] tracking-[0.1em] text-ink-primary backdrop-blur-sm"
        >
          查看详情
          <ArrowUpRight size={12} />
        </motion.span>
      </div>

      {/* 文字区：eyebrow → 衬线短名（悬停下划线）→ 价格 */}
      <div className="mt-4">
        <p className="font-mono-x text-[11px] font-medium uppercase tracking-[0.14em] text-ink-muted">
          {item.categoryEn} · {item.category}
        </p>
        <h3 className="relative mt-1.5 inline-block">
          <span className="font-serif-sc text-[20px] font-semibold leading-[1.3] tracking-[0.02em] text-ink-primary">
            {item.name}
          </span>
          <motion.span
            aria-hidden
            variants={{ rest: { scaleX: 0 }, hover: { scaleX: 1 } }}
            transition={{ duration: 0.4, ease: EASE }}
            className="absolute -bottom-0.5 left-0 h-px w-full origin-left bg-accent-blue"
          />
        </h3>
        <p className="mt-1.5 line-clamp-1 text-[12.5px] italic leading-[1.7] text-ink-secondary">
          {item.quote}
        </p>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="font-mono-x text-[19px] font-semibold leading-none text-accent-blue">
            ¥{item.price}
          </span>
          <span className="text-[11px] text-ink-muted">起</span>
          {item.originalPrice && (
            <span className="font-mono-x text-[12.5px] text-ink-muted line-through">
              ¥{item.originalPrice}
            </span>
          )}
        </div>
        <p className="mt-1.5 text-[11.5px] tracking-[0.04em] text-ink-muted">{item.spec}</p>
      </div>
    </motion.button>
  )
}

/* ---------------------------------- page ---------------------------------- */

export default function Shop() {
  const [active, setActive] = useState<ShopItem | null>(null)

  return (
    <>
      {/* S1 页头：eyebrow + 大标题 + 同行小字 + 说明 */}
      <section className="border-b border-line">
        <div className="mx-auto max-w-[1200px] px-6 pb-16 pt-24">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: EASE }}
            className="font-mono-x text-[11px] font-medium uppercase tracking-[0.18em] text-ink-muted"
          >
            06 — SHOP · ALL OBJECTS · {SHOPS.length} 件
          </motion.p>
          <div className="mt-5 flex flex-wrap items-baseline gap-x-6 gap-y-2">
            <motion.h1
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.08, ease: EASE }}
              className="font-serif-sc text-[clamp(38px,5vw,56px)] font-semibold leading-[1.1] text-ink-primary"
            >
              我的小店
            </motion.h1>
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="text-[14px] text-ink-muted"
            >
              每一项服务，都由一双手完成
            </motion.span>
          </div>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4, ease: EASE }}
            className="mt-5 max-w-[56ch] text-[13.5px] leading-[1.9] text-ink-secondary"
          >
            现货服务 24h 内响应。标有「主推」的项目已有在线系统，点击即可直接进入体验。
          </motion.p>
        </div>
      </section>

      {/* S2 状态条（极简） */}
      <section className="sticky top-[56px] z-40 border-b border-line bg-bg-page/90 backdrop-blur-sm">
        <div className="mx-auto flex h-14 max-w-[1200px] items-center gap-x-8 px-6">
          <span className="flex items-center gap-2 text-[12.5px] font-medium text-ink-primary">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
            </span>
            今日营业中 · 接单制
          </span>
          <span className="font-mono-x hidden text-[11px] uppercase tracking-[0.14em] text-ink-muted sm:inline">
            微信支付 / 支付宝
          </span>
          <span className="font-mono-x ml-auto text-[11px] uppercase tracking-[0.14em] text-ink-muted">
            {SHOPS.length} / {SHOPS.length} 件
          </span>
        </div>
      </section>

      {/* S3 器物墙：3 列，纵向大留白 */}
      <section className="mx-auto max-w-[1200px] px-6 py-20">
        <div className="grid grid-cols-2 gap-x-6 gap-y-10 lg:grid-cols-4 lg:gap-x-7">
          {SHOPS.map((it, i) => (
            <ShopCard key={it.id} item={it} index={i} onOpen={() => setActive(it)} />
          ))}
        </div>

        <p className="font-mono-x mt-16 text-center text-[10.5px] uppercase tracking-[0.2em] text-ink-muted">
          — 更多器物，正在窑里 —
        </p>
      </section>

      <DetailOverlay item={active} onClose={() => setActive(null)} />
    </>
  )
}
