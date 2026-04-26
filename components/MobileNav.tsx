'use client'

import { useState, useEffect } from 'react'
import type { IssueData } from '@/types'

interface Props {
  data: IssueData
  activeTab: string
  onTabChange: (id: string) => void
  onSearchOpen: () => void
}

export default function MobileNav({ data, activeTab, onTabChange, onSearchOpen }: Props) {
  const [open, setOpen] = useState(false)

  // Close on outside tap
  useEffect(() => {
    if (!open) return
    const close = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (!target.closest('.mobile-drawer') && !target.closest('.mobile-hamburger')) {
        setOpen(false)
      }
    }
    document.addEventListener('click', close)
    return () => document.removeEventListener('click', close)
  }, [open])

  // Prevent body scroll when open
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  const activeLabel = data.tabs.find(t => t.id === activeTab)?.label ?? 'The Scene'

  return (
    <>
      {/* Mobile topbar row */}
      <div className="mobile-topbar">
        <div className="mobile-brand">The Gamer·Scene</div>
        <div className="mobile-topbar-right">
          <button
            className="mobile-search-btn"
            onClick={onSearchOpen}
            aria-label="Search"
          >
            ⌕
          </button>
          <button
            className={`mobile-hamburger${open ? ' open' : ''}`}
            onClick={() => setOpen(v => !v)}
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </div>

      {/* Active tab indicator strip */}
      <div className="mobile-active-tab">
        <span className="mobile-active-label">{activeLabel}</span>
        <span className="mobile-issue">Issue №{data.issue.number}</span>
      </div>

      {/* Overlay */}
      {open && <div className="mobile-overlay" onClick={() => setOpen(false)} />}

      {/* Drawer */}
      <div className={`mobile-drawer${open ? ' open' : ''}`}>
        <div className="mobile-drawer-header">
          <span className="mobile-drawer-title">Navigation</span>
          <button className="mobile-drawer-close" onClick={() => setOpen(false)}>✕</button>
        </div>
        <nav className="mobile-drawer-nav">
          {data.tabs.map(t => (
            <button
              key={t.id}
              className={`mobile-drawer-item${activeTab === t.id ? ' active' : ''}`}
              onClick={() => { onTabChange(t.id); setOpen(false) }}
            >
              <span className="mobile-drawer-num">{t.num}</span>
              <span className="mobile-drawer-label">{t.label}</span>
              {activeTab === t.id && <span className="mobile-drawer-check">◆</span>}
            </button>
          ))}
        </nav>
        <div className="mobile-drawer-footer">
          <div className="mobile-drawer-meta">
            {data.issue.weekday}, {data.issue.date}
          </div>
          <div className="mobile-drawer-meta">{data.issue.subscribers} readers</div>
        </div>
      </div>
    </>
  )
}
