import { Link } from 'react-router'
import { useLang } from '@/lib/i18n'

export default function Footer() {
  const { t } = useLang()

  const navLinks = [
    { num: '01', label: t('nav.home'), to: '/' },
    { num: '02', label: t('nav.education'), to: '/education' },
    { num: '03', label: t('nav.work'), to: '/work' },
    { num: '04', label: t('nav.awards'), to: '/awards' },
    { num: '05', label: t('nav.social'), to: '/social' },
  ]

  const contacts = [
    { label: 'WECHAT', value: 'Gtl_huyidan' },
    { label: 'PHONE', value: '+86 186 6393 5936' },
    { label: 'EMAIL', value: 'gtl.huyidan@gmail.com' },
    { label: 'TELEGRAM', value: '@GaoTianlee' },
    { label: 'GITHUB', value: 'github.com/gtlhuyidan' },
  ]

  return (
    <footer className="border-t border-line bg-page">
      <div className="mx-auto max-w-[1200px] px-6 pb-8 pt-16">
        {/* Top row — brand + nav */}
        <div className="flex flex-col gap-10 md:flex-row md:items-start md:justify-between">
          <div>
            <Link to="/" className="group flex items-baseline">
              <span className="font-mono-x text-[12px] font-medium tracking-[0.14em] text-ink-primary transition-colors group-hover:text-accent-blue">
                GT
              </span>
              <span className="font-mono-x ml-2 text-[12px] font-medium tracking-[0.14em] text-ink-muted transition-colors group-hover:text-accent-blue">
                — GAO TIANLEE
              </span>
            </Link>
            <p className="mt-4 max-w-xs text-[13px] leading-relaxed text-ink-secondary">
              {t('footer.desc')}
            </p>
          </div>

          <ul className="grid grid-cols-2 gap-x-10 gap-y-2.5">
            {navLinks.map((l) => (
              <li key={l.to}>
                <Link
                  to={l.to}
                  className="group flex items-baseline gap-2 text-[13px] text-ink-secondary transition-colors hover:text-ink-primary"
                >
                  <span className="mono-num text-[10px]">{l.num}</span>
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact — ruled list */}
        <div className="mt-14">
          {contacts.map((c) => (
            <div
              key={c.label}
              className="flex items-baseline gap-6 border-t border-line py-3"
            >
              <span className="font-mono-x w-20 shrink-0 text-[11px] uppercase tracking-[0.18em] text-ink-muted">
                {c.label}
              </span>
              <span className="text-[13px] text-ink-primary">{c.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-line">
        <p className="font-mono-x mx-auto max-w-[1200px] px-6 py-5 text-left text-[10.5px] uppercase tracking-[0.14em] text-ink-muted">
          © 2025 GAO TIANLEE · EXPLORE KNOWLEDGE — MAKE A POSITIVE IMPACT
        </p>
      </div>
    </footer>
  )
}
