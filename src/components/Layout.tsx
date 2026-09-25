import { useEffect, useState } from 'react'
import { Outlet, useLocation } from 'react-router'
import Lenis from 'lenis'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowUp } from 'lucide-react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

let lenisInstance: Lenis | null = null

/**
 * Smooth-scroll to an element id (with or without leading '#') or a pixel
 * position; usable from pages. Uses getElementById so an empty or invalid
 * hash (e.g. '/work#') is a safe no-op instead of a querySelector SyntaxError.
 */
export function scrollToTarget(target: string | number, offset = -80) {
  if (typeof target === 'number') {
    if (lenisInstance) lenisInstance.scrollTo(target, { offset, duration: 1.1 })
    else window.scrollTo({ top: target, behavior: 'smooth' })
    return
  }
  const id = target.replace(/^#/, '').trim()
  if (!id) return
  const el = document.getElementById(id)
  if (!el) return
  if (lenisInstance) lenisInstance.scrollTo(el, { offset, duration: 1.1 })
  else el.scrollIntoView({ behavior: 'smooth' })
}

/**
 * Shared layout — nested-route pattern: renders <Outlet/> and App.tsx nests
 * all page routes under <Route element={<Layout/>}>. Never mix with a
 * children-wrapping Routes.
 *
 * Navbar is `sticky top-0 z-50` (normal document flow), so pages must NOT add
 * nav-height padding/margins.
 */
export default function Layout() {
  const location = useLocation()
  const [showBackTop, setShowBackTop] = useState(false)

  // Lenis page-wide smooth scrolling
  useEffect(() => {
    const lenis = new Lenis({ lerp: 0.1, smoothWheel: true })
    lenisInstance = lenis
    let raf = 0
    const loop = (time: number) => {
      lenis.raf(time)
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => {
      cancelAnimationFrame(raf)
      lenis.destroy()
      lenisInstance = null
    }
  }, [])

  // Route change: scroll to top, or to hash anchor (e.g. /work#portfolio)
  useEffect(() => {
    if (location.hash) {
      const id = location.hash.slice(1)
      const timer = setTimeout(() => scrollToTarget(`#${id}`, -80), 150)
      return () => clearTimeout(timer)
    }
    lenisInstance?.scrollTo(0, { immediate: true })
    window.scrollTo(0, 0)
  }, [location.pathname, location.hash])

  useEffect(() => {
    const onScroll = () => setShowBackTop(window.scrollY > 400)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div className="flex min-h-[100dvh] flex-col bg-page">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />

      {/* Back-to-top floating button — 36px square ink block, no shadow */}
      <AnimatePresence>
        {showBackTop && (
          <motion.button
            type="button"
            aria-label="back to top"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={() => scrollToTarget(0, 0)}
            className="fixed bottom-6 right-6 z-50 flex h-9 w-9 items-center justify-center rounded-[4px] bg-accent-deep text-[color:var(--bg-page)] transition-transform hover:-translate-y-0.5"
          >
            <ArrowUp size={16} />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  )
}
