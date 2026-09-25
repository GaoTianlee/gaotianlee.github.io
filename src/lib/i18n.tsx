import { createContext, useContext, useEffect } from 'react'
import type { ReactNode } from 'react'

/**
 * Site-wide language is pinned to Chinese.
 * The CN/EN switcher has been removed; `lang` is always 'cn' and `t` always
 * returns the Chinese dictionary — even if a component is rendered outside
 * LangProvider (the default context below is fully functional), so stale
 * `localStorage.lang === 'en'` values can no longer produce an English UI.
 */
export type Lang = 'cn' | 'en'

const dict = {
  cn: {
    'nav.home': '首页',
    'nav.education': '教育经历',
    'nav.work': '工作经历',
    'nav.portfolio': '作品集',
    'nav.awards': '获奖证书',
    'nav.social': '社媒平台',
    'nav.shop': '小店',
    'nav.search': '搜索',
    'nav.searchPlaceholder': '搜索文章 / 项目 / 关键词…',
    'nav.searchEmpty': '输入关键词以搜索全站内容',
    'nav.noResult': '未找到相关内容',
    'footer.desc': '关注人工智能、宏观经济与管理的学习者与实践者。探索知识，连接世界。',
    'footer.nav': '快速导航',
    'footer.contact': '联系方式',
    'footer.rights': '© 2025 Gao Tianlee · Explore Knowledge, Make a Positive Impact',
    'backToTop': '返回顶部',
  },
} as const

export type I18nKey = keyof (typeof dict)['cn']

interface LangCtx {
  lang: Lang
  setLang: (l: Lang) => void
  t: (key: I18nKey) => string
}

const FIXED_LANG: Lang = 'cn'
const t = (key: I18nKey) => dict.cn[key] ?? key
const noopSetLang = () => {}

const zhCtx: LangCtx = { lang: FIXED_LANG, setLang: noopSetLang, t }

// Fully functional default context: safe even without a mounted LangProvider.
const LangContext = createContext<LangCtx>(zhCtx)

export function LangProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    document.documentElement.lang = 'zh-CN'
    // Clear any previously saved English preference.
    try {
      window.localStorage.setItem('lang', FIXED_LANG)
    } catch {
      /* private mode etc. — ignore */
    }
  }, [])

  return <LangContext.Provider value={zhCtx}>{children}</LangContext.Provider>
}

export function useLang() {
  return useContext(LangContext)
}
