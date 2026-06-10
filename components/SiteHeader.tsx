import Link from 'next/link'

interface Props {
  /** Which nav item to mark active (optional) */
  active?: 'news' | 'reviews' | 'opinion' | 'archive'
}

export default function SiteHeader({ active }: Props) {
  const navItems = [
    { href: '/news',    label: 'News',    id: 'news'    },
    { href: '/reviews', label: 'Reviews', id: 'reviews' },
    { href: '/opinion', label: 'Opinion', id: 'opinion' },
    { href: '/issues',  label: 'Archive', id: 'archive' },
  ]

  return (
    <header className="site-header">
      <a href="#main-content" className="skip-link">Skip to content</a>

      <Link href="/" className="site-header-brand">
        THE GAMER SCENE
      </Link>

      <nav className="site-header-nav" aria-label="Main navigation">
        {navItems.map(item => (
          <Link
            key={item.id}
            href={item.href}
            className={`site-header-link${active === item.id ? ' active' : ''}`}
            aria-current={active === item.id ? 'page' : undefined}
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </header>
  )
}
