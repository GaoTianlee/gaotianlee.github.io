import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useScroll, useSpring } from 'framer-motion'
import type { Variants } from 'framer-motion'
import { marked } from 'marked'
import {
  ChevronRight,
  Download,
  FileBadge,
  FilePlus2,
  FileText,
  Folder,
  FolderPlus,
  Link2,
  Trash2,
  X,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import PageHeader from '@/components/PageHeader'

/* ---------------------------------- data --------------------------------- */

interface WorkEntry {
  years: string
  period: string
  logo: string
  /** 无 logo 图片时显示的字符占位 */
  symbol?: string
  company: string
  role: string
  tags: string[]
  duties: string[]
  /** 实习证明图片，点击该经历弹出查看 */
  cert?: string
  certTitle?: string
}

const WORK_ENTRIES: WorkEntry[] = [
  {
    years: '2025.01 - 2025.02',
    period: '2025 年寒假',
    logo: '/logo-bain.png',
    company: '贝恩公司 (Bain & Company)',
    role: '咨询实习生 (PTA)',
    tags: ['行业研究', '数据分析', '管理咨询'],
    duties: [
      '参与消费品行业研究项目，完成桌面研究与专家访谈纪要整理',
      '协助团队进行数据分析与财务模型搭建',
      '参与客户汇报材料（PPT）的撰写与美化',
    ],
  },
  {
    years: '2026.07.20 - 2026.08.30',
    period: '2026 年暑期',
    logo: '',
    symbol: '栩',
    company: '惠州栩格美电子科技有限公司',
    role: '采购助理',
    tags: ['采购管理', '供应商管理', '数据分析'],
    duties: [
      '跟进采购订单全流程，协调供应商交付周期与异常处理',
      '协助供应商资质审核与比价议价，整理采购成本数据',
      '维护采购台账与库存数据，输出周报支持补货决策',
    ],
    cert: '/cert-xugemei.png',
    certTitle: '惠州栩格美电子科技有限公司 · 实习证明',
  },
]

/* ----------------------------- portfolio fs ------------------------------ */

interface FSNode {
  id: string
  name: string
  type: 'folder' | 'file'
  url?: string
  desc?: string
  children?: FSNode[]
  /** 文件夹的项目介绍链接（显示在文件夹下方，蓝色可点击跳转） */
  introLabel?: string
  introUrl?: string
  /** 文件封面图（缩略图） */
  img?: string
  /** 置顶标记 */
  pinned?: boolean
  /** 在线预览：幻灯片图片列表 */
  slides?: string[]
  /** 在线预览：结构化文档 */
  doc?: { heading: string; intro: string; sections: { title: string; body: string }[] }
  /** 右下角下载标识：点击下载该文件 */
  download?: string
  /** 在线阅览完整 Markdown 文档 */
  presentation?: 'website-preview'
  politicsPreviewsVersion?: number
  mdUrl?: string
}

const FS_STORAGE_KEY = 'portfolio-fs-v9'

const POLITICS_PROJECTS: FSNode[] = [
  { id: 'politics-history', name: '建国后党史', type: 'file', presentation: 'website-preview', img: '/files/politics/history.jpg', url: 'https://cpchistory.gtl-huyidan.workers.dev/' },
  { id: 'politics-state', name: '权力体系架构', type: 'file', presentation: 'website-preview', img: '/files/politics/state.jpg', url: 'https://chinastates.gtl-huyidan.workers.dev/' },
  { id: 'politics-center', name: '百年中枢', type: 'file', presentation: 'website-preview', img: '/files/politics/center.jpg', url: 'https://cpcpolitburo.gtl-huyidan.workers.dev/' },
]

const SEED_TREE: FSNode = {
  id: 'root',
  politicsPreviewsVersion: 1,
  name: '作品集',
  type: 'folder',
  children: [
    {
      id: 'corp-ops',
      name: '公司经管实务',
      type: 'folder',
      pinned: true,
      introLabel: '经管实务笔记',
      introUrl: 'https://notes.coloros.com/s/1CZuKZZHgzZj_1',
      children: [],
    },
    {
      id: 'to-c',
      name: '个人公司化运营项目',
      type: 'folder',
      pinned: true,
      children: [
        {
          id: 'toc-zip',
          name: '个人管理.zip — 完整资料包',
          type: 'file',
          img: '/files/toc/01-finance-overview.png',
          download: '/files/个人管理.zip',
          mdUrl: '/files/toc/README.md',
          desc: '「衡 · 人生 IPO」完整项目资料包。点击在线阅览完整 README 文档；右下角下载标识可获取压缩包。',
        },
      ],
    },
    {
      id: 'ext-scan',
      name: '外部环境扫描',
      type: 'folder',
      children: [
        { id: 'ext-politics', name: '政治研读', type: 'folder', children: POLITICS_PROJECTS },
        { id: 'ext-economy', name: '经济研读', type: 'folder', children: [] },
        { id: 'ext-tech', name: '技术研读', type: 'folder', children: [] },
        { id: 'ext-society', name: '人口和社会文化倾向', type: 'folder', children: [] },
        { id: 'ext-geo', name: '地缘政治与全球视角', type: 'folder', children: [] },
      ],
    },
    { id: 'industry-dash', name: '行业看板与分析', type: 'folder', children: [] },
  ],
}

function genId() {
  return `n-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`
}

function loadTree(): FSNode {
  try {
    const raw = window.localStorage.getItem(FS_STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw) as FSNode
      if (parsed && parsed.type === 'folder') {
        if (!parsed.politicsPreviewsVersion) {
          const migrated = updateAt(parsed, ['ext-scan', 'ext-politics'], (folder) => ({
            ...folder,
            children: [...(folder.children ?? []), ...POLITICS_PROJECTS.filter(
              (project) => !(folder.children ?? []).some((child) => child.id === project.id),
            )],
          }))
          return { ...migrated, politicsPreviewsVersion: 1 }
        }
        return parsed
      }
    }
  } catch {
    /* fall through to seed */
  }
  return SEED_TREE
}

function saveTree(tree: FSNode) {
  try {
    window.localStorage.setItem(FS_STORAGE_KEY, JSON.stringify(tree))
  } catch {
    /* storage unavailable */
  }
}

/** Immutably map the node at `pathIds` (starting under root). */
function updateAt(node: FSNode, pathIds: string[], fn: (n: FSNode) => FSNode): FSNode {
  if (pathIds.length === 0) return fn(node)
  const [head, ...rest] = pathIds
  return {
    ...node,
    children: (node.children ?? []).map((c) => (c.id === head ? updateAt(c, rest, fn) : c)),
  }
}

function findAt(root: FSNode, pathIds: string[]): FSNode {
  let cur = root
  for (const id of pathIds) {
    const next = (cur.children ?? []).find((c) => c.id === id)
    if (!next) return cur
    cur = next
  }
  return cur
}

function countDescendants(node: FSNode): number {
  return (node.children ?? []).length
}

/* -------------------------------- motion --------------------------------- */

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
}

/* --------------------------------- toast --------------------------------- */

function useToast() {
  const [toast, setToast] = useState<string | null>(null)
  useEffect(() => {
    if (!toast) return
    const t = window.setTimeout(() => setToast(null), 3000)
    return () => window.clearTimeout(t)
  }, [toast])
  return { toast, showToast: setToast }
}

function Toast({ message }: { message: string | null }) {
  return (
    <AnimatePresence>
      {message && (
        <motion.div
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 24 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="fixed bottom-6 right-6 z-[80] flex items-center gap-2.5 rounded-xl border border-line bg-card px-4 py-3 shadow-card-hover"
        >
          <span className="h-2 w-2 rounded-full bg-accent-blue" />
          <span className="text-[13px] text-ink-primary">{message}</span>
        </motion.div>
      )}
    </AnimatePresence>
  )
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

/* ------------------------------ work timeline ----------------------------- */

function WorkTimeline() {
  const listRef = useRef<HTMLDivElement>(null)
  const [certEntry, setCertEntry] = useState<WorkEntry | null>(null)
  const { scrollYProgress } = useScroll({
    target: listRef,
    offset: ['start 85%', 'end 65%'],
  })
  const lineScale = useSpring(scrollYProgress, { stiffness: 90, damping: 24 })

  return (
    <motion.section
      variants={fadeUp}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: '-60px' }}
    >
      <SectionHeader eyebrow="03-A — INTERNSHIP" title="实习工作经历" />

      {/* timeline */}
      <div ref={listRef} className="relative mt-7">
        <span className="absolute bottom-2 left-[2.5px] top-2 w-px bg-line-strong" />
        <motion.span
          style={{ scaleY: lineScale }}
          className="absolute bottom-2 left-[2.5px] top-2 w-px origin-top bg-accent-blue"
        />

        <ol className="space-y-8">
          {WORK_ENTRIES.map((w, i) => (
            <li key={w.years} className="relative pl-6">
              <motion.span
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ type: 'spring', bounce: 0.6, duration: 0.6 }}
                className={cn(
                  'absolute left-0 top-1.5 h-[6px] w-[6px]',
                  i === 0 ? 'bg-accent-blue' : 'border border-accent-blue bg-card',
                )}
              />
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.5, delay: i * 0.06, ease: 'easeOut' }}
                onClick={w.cert ? () => setCertEntry(w) : undefined}
                role={w.cert ? 'button' : undefined}
                className={cn(
                  'rounded-md px-3 py-3 transition-colors duration-200 hover:bg-accent-soft',
                  w.cert && 'cursor-pointer',
                )}
              >
                <p className="font-mono-x text-[11.5px] tracking-[0.06em] text-ink-muted">
                  {w.years} · {w.period}
                </p>
                <div className="mt-2.5 flex items-center gap-3.5">
                  <span className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded border border-line bg-white p-1.5">
                    {w.logo ? (
                      <img
                        src={w.logo}
                        alt={w.company}
                        loading="lazy"
                        className="h-full w-full object-contain"
                      />
                    ) : (
                      <span className="font-serif-sc text-[22px] font-bold text-accent-blue">
                        {w.symbol ?? '企'}
                      </span>
                    )}
                  </span>
                  <div className="min-w-0">
                    <h3 className="text-[15.5px] font-semibold text-ink-primary">{w.company}</h3>
                    <p className="mt-0.5 text-[13px] text-ink-secondary">{w.role}</p>
                  </div>
                </div>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {w.tags.map((t) => (
                    <span
                      key={t}
                      className="font-mono-x rounded border border-line px-2 py-0.5 text-[10.5px] tracking-[0.08em] text-ink-secondary"
                    >
                      {t}
                    </span>
                  ))}
                </div>
                <ul className="mt-3 space-y-1.5">
                  {w.duties.map((d) => (
                    <li
                      key={d}
                      className="flex items-start gap-2 text-[13px] leading-[1.7] text-ink-secondary"
                    >
                      <span className="font-mono-x shrink-0 text-accent-blue">—</span>
                      {d}
                    </li>
                  ))}
                </ul>
                {w.cert && (
                  <p className="font-mono-x mt-3 inline-flex items-center gap-1.5 text-[11px] tracking-[0.08em] text-accent-blue">
                    <FileBadge size={12} />
                    点击查看实习证明
                  </p>
                )}
              </motion.div>
            </li>
          ))}
        </ol>
      </div>

      {/* internship certificate lightbox */}
      <AnimatePresence>
        {certEntry && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[70] flex items-center justify-center bg-overlay-scrim p-4"
            onClick={() => setCertEntry(null)}
          >
            <motion.div
              initial={{ scale: 0.94, y: 10 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.94, y: 10 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              onClick={(e) => e.stopPropagation()}
              className="max-h-[88vh] overflow-auto rounded-lg border border-line bg-card p-4"
            >
              <img
                src={certEntry.cert}
                alt={certEntry.certTitle ?? '实习证明'}
                className="mx-auto h-auto w-[min(84vw,880px)] rounded-[4px]"
              />
              <p className="font-mono-x pt-3 text-center text-[12px] tracking-[0.06em] text-ink-secondary">
                {certEntry.certTitle}
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <style>{`body:has(.cert-lightbox-open){overflow:hidden}`}</style>

      {/* bottom quote band */}
      <div className="mt-10 border-y border-line py-4 text-center">
        <p className="text-[13px] text-ink-muted">
          “工作是最好的学习方式。” —— Practice makes progress.
        </p>
      </div>
    </motion.section>
  )
}

/* ------------------------------ fs modals -------------------------------- */

function ModalShell({
  onClose,
  children,
  wide = false,
  xwide = false,
}: {
  onClose: () => void
  children: React.ReactNode
  wide?: boolean
  xwide?: boolean
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      onClick={onClose}
      className="bg-overlay-scrim fixed inset-0 z-[70] flex items-center justify-center p-4"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.94, y: 12 }}
        transition={{ type: 'spring', stiffness: 300, damping: 28 }}
        onClick={(e) => e.stopPropagation()}
        className={cn(
          'max-h-[86dvh] w-full overflow-y-auto overscroll-contain rounded-lg border border-line bg-card p-6',
          xwide ? 'max-w-[880px]' : wide ? 'max-w-[560px]' : 'max-w-[440px]',
        )}
      >
        {children}
      </motion.div>
    </motion.div>
  )
}

function ModalHeader({ title, onClose }: { title: string; onClose: () => void }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <h3 className="font-serif-sc text-[18px] font-semibold text-ink-primary">{title}</h3>
      <button
        type="button"
        aria-label="close"
        onClick={onClose}
        className="flex h-7 w-7 shrink-0 items-center justify-center text-ink-secondary transition-colors hover:text-accent-blue"
      >
        <X size={16} />
      </button>
    </div>
  )
}

const inputCls =
  'w-full rounded border border-line bg-page px-3 py-2 text-[13.5px] text-ink-primary outline-none transition-colors placeholder:text-ink-muted focus:border-accent-blue'

function CreateModal({
  kind,
  onClose,
  onSubmit,
}: {
  kind: 'folder' | 'file'
  onClose: () => void
  onSubmit: (data: { name: string; url?: string; desc?: string }) => void
}) {
  const [name, setName] = useState('')
  const [url, setUrl] = useState('')
  const [desc, setDesc] = useState('')

  const submit = () => {
    const n = name.trim()
    if (!n) return
    onSubmit({
      name: n,
      url: kind === 'file' && url.trim() ? url.trim() : undefined,
      desc: kind === 'file' && desc.trim() ? desc.trim() : undefined,
    })
  }

  return (
    <ModalShell onClose={onClose}>
      <ModalHeader title={kind === 'folder' ? '新建文件夹' : '新建文件'} onClose={onClose} />
      <div className="mt-5 space-y-3.5">
        <div>
          <label className="font-mono-x mb-1.5 block text-[11px] uppercase tracking-[0.14em] text-ink-muted">
            名称 *
          </label>
          <input
            autoFocus
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && submit()}
            placeholder={kind === 'folder' ? '文件夹名称' : '文件名称'}
            className={inputCls}
          />
        </div>
        {kind === 'file' && (
          <>
            <div>
              <label className="font-mono-x mb-1.5 block text-[11px] uppercase tracking-[0.14em] text-ink-muted">
                链接 URL（可选）
              </label>
              <input
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://…"
                className={inputCls}
              />
            </div>
            <div>
              <label className="font-mono-x mb-1.5 block text-[11px] uppercase tracking-[0.14em] text-ink-muted">
                简介（可选）
              </label>
              <textarea
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
                rows={2}
                placeholder="一句话简介…"
                className={cn(inputCls, 'resize-none')}
              />
            </div>
          </>
        )}
      </div>
      <div className="mt-6 flex justify-end gap-3">
        <button type="button" onClick={onClose} className="btn-outline">
          取消
        </button>
        <button
          type="button"
          onClick={submit}
          disabled={!name.trim()}
          className="btn-primary disabled:cursor-not-allowed disabled:opacity-50"
        >
          {kind === 'folder' ? <FolderPlus size={14} /> : <FilePlus2 size={14} />}
          创建
        </button>
      </div>
    </ModalShell>
  )
}

function DeleteModal({
  node,
  onClose,
  onConfirm,
}: {
  node: FSNode
  onClose: () => void
  onConfirm: () => void
}) {
  return (
    <ModalShell onClose={onClose}>
      <ModalHeader title="删除确认" onClose={onClose} />
      <p className="mt-4 text-[13.5px] leading-relaxed text-ink-secondary">
        确定删除{node.type === 'folder' ? '文件夹' : '文件'}
        <span className="font-semibold text-ink-primary">「{node.name}」</span>
        吗？
        {node.type === 'folder' && countDescendants(node) > 0 && (
          <span className="text-accent-blue">
            该文件夹内的 {countDescendants(node)} 个子项将一并删除。
          </span>
        )}
        此操作不可撤销。
      </p>
      <div className="mt-6 flex justify-end gap-3">
        <button type="button" onClick={onClose} className="btn-outline">
          取消
        </button>
        <button
          type="button"
          onClick={onConfirm}
          className="btn-outline border-accent-blue text-accent-blue hover:bg-accent-soft"
        >
          <Trash2 size={14} />
          确认删除
        </button>
      </div>
    </ModalShell>
  )
}

function MarkdownView({ url }: { url: string }) {
  const [html, setHtml] = useState<string | null>(null)
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    let alive = true
    fetch(url)
      .then((r) => {
        if (!r.ok) throw new Error(String(r.status))
        return r.text()
      })
      .then(async (text) => {
        // 相对图片路径 → 站点资源路径；加载失败的图片在前端隐藏
        const fixed = text.replace(/src="\.\/docs\/screenshots\//g, 'src="/files/toc/')
        const parsed = await marked.parse(fixed)
        if (alive) setHtml(parsed)
      })
      .catch(() => {
        if (alive) setFailed(true)
      })
    return () => {
      alive = false
    }
  }, [url])

  if (failed) {
    return <p className="mt-4 text-[13px] text-ink-muted">文档加载失败，请稍后重试。</p>
  }
  if (html === null) {
    return (
      <div className="mt-4 space-y-2.5">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-3.5 animate-pulse rounded bg-accent-soft" style={{ width: `${88 - i * 9}%` }} />
        ))}
      </div>
    )
  }
  return (
    <div
      className="md-doc mt-4 rounded-md border border-line/60 bg-white px-6 py-6 sm:px-8"
      // README 为本人上传的可信内容
      dangerouslySetInnerHTML={{ __html: html }}
      onErrorCapture={(e) => {
        const t = e.target as HTMLElement
        if (t.tagName === 'IMG') t.style.display = 'none'
      }}
    />
  )
}

function FileDetailModal({ node, onClose }: { node: FSNode; onClose: () => void }) {
  return (
    <ModalShell onClose={onClose} wide xwide={!!node.mdUrl}>
      <ModalHeader title={node.name} onClose={onClose} />
      <div className="mt-3 flex items-center gap-2">
        <span className="font-mono-x rounded border border-line px-2 py-0.5 text-[10.5px] tracking-[0.08em] text-ink-secondary">
          FILE
        </span>
        {node.url && (
          <span className="font-mono-x rounded border border-line px-2 py-0.5 text-[10.5px] tracking-[0.08em] text-accent-blue">
            LINK
          </span>
        )}
      </div>
      {node.mdUrl ? (
        <MarkdownView url={node.mdUrl} />
      ) : node.doc ? (
        /* 在线文档预览 — 素白纸面，无明显卡片痕迹 */
        <div className="mt-4 rounded-md border border-line/60 bg-white px-6 py-6 sm:px-8">
          <p className="font-mono-x text-[10px] uppercase tracking-[0.2em] text-ink-muted">
            README.md
          </p>
          <h3 className="font-serif-sc mt-2 text-[22px] font-semibold text-ink-primary">
            {node.doc.heading}
          </h3>
          <p className="mt-3 text-[13.5px] leading-[1.9] text-ink-secondary">{node.doc.intro}</p>
          {node.doc.sections.map((sec) => (
            <div key={sec.title} className="mt-5 border-t border-line/60 pt-4">
              <p className="text-[13px] font-semibold text-ink-primary">{sec.title}</p>
              <p className="mt-1.5 text-[13px] leading-[1.85] text-ink-secondary">{sec.body}</p>
            </div>
          ))}
          <p className="font-mono-x mt-6 border-t border-line/60 pt-3 text-[10.5px] tracking-[0.12em] text-ink-muted">
            — END OF DOCUMENT —
          </p>
        </div>
      ) : node.slides ? (
        /* 在线幻灯片预览 — 连续翻阅 */
        <div className="mt-4 space-y-3">
          {node.slides.map((src, i) => (
            <div key={src} className="relative overflow-hidden rounded-[4px] border border-line/60">
              <img
                src={src}
                alt={`第 ${i + 1} 页`}
                draggable={false}
                loading="lazy"
                className="no-dim block w-full"
              />
              <span className="font-mono-x absolute bottom-1.5 right-2 rounded bg-black/40 px-1.5 py-0.5 text-[10px] text-white">
                {i + 1}/{node.slides!.length}
              </span>
            </div>
          ))}
        </div>
      ) : node.img ? (
        <img
          src={node.img}
          alt={node.name}
          className="no-dim mt-4 max-h-[46vh] w-full rounded-md border border-line object-contain bg-bg-page"
        />
      ) : null}
      <p className="mt-4 text-[13.5px] leading-[1.8] text-ink-secondary">
        {node.desc || '暂无简介。'}
      </p>
      {node.download && (
        <a href={node.download} download className="btn-primary mt-6 inline-flex">
          <Download size={14} />
          下载资料包
        </a>
      )}
      {node.url && (
        <a
          href={node.url}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-primary mt-6 inline-flex"
        >
          <Link2 size={14} />
          在线查看原图
        </a>
      )}
    </ModalShell>
  )
}

/* --------------------------- portfolio explorer --------------------------- */

type ModalState =
  | { kind: 'create-folder' }
  | { kind: 'create-file' }
  | { kind: 'delete'; node: FSNode }
  | { kind: 'detail'; node: FSNode }
  | null

function Portfolio({ showToast }: { showToast: (m: string) => void }) {
  const [tree, setTree] = useState<FSNode>(() => loadTree())
  const [pathIds, setPathIds] = useState<string[]>([])
  const [modal, setModal] = useState<ModalState>(null)

  // persist on every change
  useEffect(() => {
    saveTree(tree)
  }, [tree])

  // ensure current path still valid after deletions
  const current = findAt(tree, pathIds)
  const items = current.children ?? []

  const crumbs: FSNode[] = [tree]
  {
    let cur = tree
    for (const id of pathIds) {
      const next = (cur.children ?? []).find((c) => c.id === id)
      if (!next) break
      crumbs.push(next)
      cur = next
    }
  }

  const addNode = (data: { name: string; url?: string; desc?: string }, type: 'folder' | 'file') => {
    const node: FSNode = {
      id: genId(),
      name: data.name,
      type,
      ...(type === 'file' ? { url: data.url, desc: data.desc } : { children: [] }),
    }
    setTree((t) =>
      updateAt(t, pathIds, (n) => ({ ...n, children: [...(n.children ?? []), node] })),
    )
    showToast(type === 'folder' ? `已创建文件夹「${data.name}」` : `已创建文件「${data.name}」`)
  }

  const removeNode = (id: string) => {
    setTree((t) =>
      updateAt(t, pathIds, (n) => ({
        ...n,
        children: (n.children ?? []).filter((c) => c.id !== id),
      })),
    )
    showToast('已删除')
  }

  const openNode = (node: FSNode) => {
    if (node.type === 'folder') {
      setPathIds((p) => [...p, node.id])
    } else if (node.url) {
      window.open(node.url, '_blank', 'noopener,noreferrer')
    } else {
      setModal({ kind: 'detail', node })
    }
  }

  return (
    <motion.section
      id="portfolio"
      variants={fadeUp}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: '-60px' }}
      className="scroll-mt-24"
    >
      <SectionHeader eyebrow="03-B — PORTFOLIO" title="作品集" />

      {/* toolbar: breadcrumb + actions */}
      <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-b border-line pb-4">
        <nav className="flex min-w-0 flex-wrap items-center gap-1 text-[13px]">
          {crumbs.map((c, i) => (
            <span key={c.id} className="flex items-center gap-1">
              {i > 0 && <ChevronRight size={13} className="shrink-0 text-ink-muted" />}
              <button
                type="button"
                onClick={() => setPathIds(pathIds.slice(0, i))}
                className={cn(
                  'font-mono-x transition-colors',
                  i === crumbs.length - 1
                    ? 'font-medium text-ink-primary'
                    : 'text-ink-muted hover:text-accent-blue',
                )}
              >
                {c.name}
              </button>
            </span>
          ))}
        </nav>
        <div className="flex shrink-0 gap-2">
          <button
            type="button"
            onClick={() => setModal({ kind: 'create-folder' })}
            className="btn-outline"
          >
            <FolderPlus size={14} />
            新建文件夹
          </button>
          <button
            type="button"
            onClick={() => setModal({ kind: 'create-file' })}
            className="btn-outline"
          >
            <FilePlus2 size={14} />
            新建文件
          </button>
        </div>
      </div>

      {/* current level listing */}
      <AnimatePresence mode="wait">
        <motion.div
          key={current.id}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="mt-5"
        >
          {items.length === 0 ? (
            <p className="rounded-md border border-dashed border-line px-4 py-10 text-center text-[13px] text-ink-muted">
              空文件夹 — 点击右上角新建项目
            </p>
          ) : (
            <ul className={current.id === 'ext-politics' ? "grid grid-cols-1 gap-x-6 gap-y-9 md:grid-cols-2 lg:grid-cols-3" : "grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4"}>
              {items.map((node) => (
                <li
                  key={node.id}
                  className={cn('group relative', node.type === 'file' && node.presentation !== 'website-preview' && current.id !== 'ext-politics' && 'col-span-2 sm:col-span-3 lg:col-span-4')}
                >
                  {node.presentation === 'website-preview' ? (
                    <figure className="m-0 min-w-0" data-project-preview={node.id}>
                      <a href={node.url} target="_blank" rel="noopener noreferrer"
                        aria-label={`打开${node.name}网站`}
                        className="block focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent-blue">
                        <img src={node.img} alt={`${node.name}网站预览`} width={2412} height={1280}
                          loading="lazy" className="block h-auto w-full" />
                      </a>
                      <figcaption className="mt-4 min-w-0">
                        <h3 className="font-serif-sc text-[17px] font-semibold text-ink-primary">{node.name}</h3>
                        <a href={node.url} target="_blank" rel="noopener noreferrer"
                          className="mt-2 flex items-start gap-1.5 text-[12px] leading-relaxed text-accent-blue underline decoration-accent-blue/40 underline-offset-4 hover:decoration-accent-blue">
                          <Link2 size={13} className="mt-0.5 shrink-0" />
                          <span className="min-w-0 break-all">{node.url}</span>
                        </a>
                      </figcaption>
                    </figure>
                  ) : node.type === 'folder' ? (
                    /* 方格文件夹卡片 */
                    <button
                      type="button"
                      onClick={() => openNode(node)}
                      className="card-hover flex aspect-square w-full flex-col items-center justify-center gap-2.5 rounded-md border border-line bg-card px-3 text-center"
                    >
                      <span className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-md border border-line bg-accent-soft text-accent-blue">
                        {node.img ? (
                          <img src={node.img} alt="" className="h-full w-full object-cover" />
                        ) : (
                          <Folder size={20} />
                        )}
                      </span>
                      {node.pinned && (
                        <span className="rounded bg-accent-blue/10 px-1.5 py-0.5 text-[10px] font-medium text-accent-blue">
                          置顶
                        </span>
                      )}
                      <span className="font-mono-x line-clamp-2 text-[13px] font-medium leading-snug text-ink-primary">
                        {node.name}
                      </span>
                      <span className="text-[11.5px] text-ink-muted">
                        {countDescendants(node)} 个子项
                      </span>
                    </button>
                  ) : (
                    /* 文件保持横向行 */
                    <button
                      type="button"
                      onClick={() => openNode(node)}
                      className="card-hover flex w-full items-center gap-3 rounded-md border border-line bg-card px-4 py-3.5 text-left"
                    >
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded border border-line bg-accent-soft text-accent-blue">
                        {node.img ? (
                          <img src={node.img} alt="" className="h-full w-full object-cover" />
                        ) : node.url ? (
                          <Link2 size={16} />
                        ) : (
                          <FileText size={16} />
                        )}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="flex items-center gap-2">
                          {node.pinned && (
                            <span className="shrink-0 rounded bg-accent-blue/10 px-1.5 py-0.5 text-[10px] font-medium text-accent-blue">
                              置顶
                            </span>
                          )}
                          <span className="font-mono-x block truncate text-[13.5px] font-medium text-ink-primary">
                            {node.name}
                          </span>
                        </span>
                        <span className="mt-0.5 block truncate text-[12px] text-ink-muted">
                          {node.desc || (node.url ? '外部链接文件' : '文件')}
                        </span>
                      </span>
                    </button>
                  )}
                  {node.type === 'folder' && node.introUrl && (
                    <a
                      href={node.introUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-1.5 flex items-center justify-center gap-1.5 text-[12px] font-medium text-accent-blue underline decoration-accent-blue/40 underline-offset-4 transition-colors hover:decoration-accent-blue"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Link2 size={12} className="shrink-0" />
                      <span className="truncate">{node.introLabel || node.introUrl}</span>
                    </a>
                  )}
                  {node.download && (
                    <a
                      href={node.download}
                      download
                      aria-label={`下载 ${node.name}`}
                      title="下载"
                      onClick={(e) => e.stopPropagation()}
                      className="absolute bottom-2.5 right-2.5 flex h-7 w-7 items-center justify-center rounded-full border border-line bg-card text-ink-muted shadow-sm transition-all hover:border-accent-blue hover:text-accent-blue"
                    >
                      <Download size={13} />
                    </a>
                  )}
                  <button
                    type="button"
                    aria-label={`删除 ${node.name}`}
                    onClick={() => setModal({ kind: 'delete', node })}
                    className="absolute right-2.5 top-2.5 flex h-6 w-6 items-center justify-center rounded text-ink-muted opacity-0 transition-all hover:text-accent-blue group-hover:opacity-100"
                  >
                    <Trash2 size={13} />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </motion.div>
      </AnimatePresence>

      {/* modals */}
      <AnimatePresence>
        {modal?.kind === 'create-folder' && (
          <CreateModal
            key="cf"
            kind="folder"
            onClose={() => setModal(null)}
            onSubmit={(d) => {
              addNode(d, 'folder')
              setModal(null)
            }}
          />
        )}
        {modal?.kind === 'create-file' && (
          <CreateModal
            key="cfile"
            kind="file"
            onClose={() => setModal(null)}
            onSubmit={(d) => {
              addNode(d, 'file')
              setModal(null)
            }}
          />
        )}
        {modal?.kind === 'delete' && (
          <DeleteModal
            key="del"
            node={modal.node}
            onClose={() => setModal(null)}
            onConfirm={() => {
              removeNode(modal.node.id)
              setModal(null)
            }}
          />
        )}
        {modal?.kind === 'detail' && (
          <FileDetailModal key="det" node={modal.node} onClose={() => setModal(null)} />
        )}
      </AnimatePresence>
    </motion.section>
  )
}

/* ---------------------------------- page ---------------------------------- */

export default function Work() {
  const { toast, showToast } = useToast()
  return (
    <div className="pb-20">
      <PageHeader
        eyebrow="03 — WORK & PORTFOLIO"
        title="工作经历 & 作品集"
        quote="在实践中学习，在探索中成长。"
      />
      <div className="mx-auto mt-16 grid max-w-[1200px] grid-cols-1 items-start gap-8 px-6 lg:grid-cols-[34%_1fr]">
        <WorkTimeline />
        <Portfolio showToast={showToast} />
      </div>
      <Toast message={toast} />
    </div>
  )
}
