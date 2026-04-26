'use client'

import { useState, useEffect, useCallback } from 'react'
import type { StoredComment } from '@/app/api/comments/route'

interface Props {
  /** Used as the Redis key context — either an issue number or article slug */
  issueContext: string
}

function timeAgo(ts: number): string {
  const diff = Date.now() - ts
  const mins = Math.floor(diff / 60_000)
  if (mins < 1)  return 'just now'
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24)  return `${hrs}h ago`
  const days = Math.floor(hrs / 24)
  return `${days}d ago`
}

export default function ArticleComments({ issueContext }: Props) {
  const [comments, setComments]     = useState<StoredComment[]>([])
  const [total, setTotal]           = useState(0)
  const [hasMore, setHasMore]       = useState(false)
  const [page, setPage]             = useState(0)
  const [loading, setLoading]       = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)

  const [name, setName]             = useState('')
  const [body, setBody]             = useState('')
  const [posting, setPosting]       = useState(false)
  const [postError, setPostError]   = useState('')

  const fetchComments = useCallback(async (p: number, append = false) => {
    try {
      const res  = await fetch(`/api/comments?issue=${issueContext}&page=${p}`)
      const data = await res.json()
      setComments(prev => append ? [...prev, ...data.comments] : data.comments)
      setTotal(data.total || 0)
      setHasMore(data.hasMore || false)
    } catch {}
  }, [issueContext])

  useEffect(() => {
    setLoading(true)
    fetchComments(0).finally(() => setLoading(false))
  }, [fetchComments])

  const loadMore = async () => {
    setLoadingMore(true)
    const next = page + 1
    setPage(next)
    await fetchComments(next, true)
    setLoadingMore(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!body.trim() || posting) return
    setPosting(true)
    setPostError('')

    try {
      const res = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ issue: issueContext, name: name.trim() || 'Anonymous', body }),
      })
      const data = await res.json()
      if (!res.ok) {
        setPostError(data.error || 'Failed to post. Try again.')
      } else {
        setComments(prev => [data.comment, ...prev])
        setTotal(prev => prev + 1)
        setBody('')
        // Keep name filled so repeat commenter doesn't have to retype
      }
    } catch {
      setPostError('Network error. Try again.')
    } finally {
      setPosting(false)
    }
  }

  return (
    <section style={{ marginTop: '64px' }}>
      <div style={{
        borderTop: '2px solid var(--ink)',
        paddingTop: '40px',
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'baseline',
          marginBottom: '28px',
        }}>
          <div>
            <div style={{
              fontFamily: 'var(--mono)',
              fontSize: '9px',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: 'var(--ink-soft)',
              marginBottom: '4px',
            }}>
              Discourse
            </div>
            <h2 style={{
              fontFamily: 'var(--serif)',
              fontSize: '1.4rem',
              fontWeight: 900,
              margin: 0,
              letterSpacing: '-0.02em',
            }}>
              {loading ? 'Comments' : `${total} Comment${total !== 1 ? 's' : ''}`}
            </h2>
          </div>
        </div>

        {/* Compose */}
        <form onSubmit={handleSubmit} style={{
          border: '1.5px solid var(--ink)',
          padding: '20px',
          marginBottom: '32px',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
          background: 'var(--bg-alt)',
        }}>
          <div style={{
            fontFamily: 'var(--mono)',
            fontSize: '9px',
            letterSpacing: '0.16em',
            textTransform: 'uppercase',
            color: 'var(--ink-soft)',
          }}>
            Leave a Comment
          </div>
          <input
            type="text"
            placeholder="Your name (optional)"
            value={name}
            onChange={e => setName(e.target.value)}
            maxLength={60}
            style={{
              border: '1px solid var(--rule)',
              background: 'var(--bg)',
              fontFamily: 'var(--sans)',
              fontSize: '0.875rem',
              padding: '10px 12px',
              color: 'var(--ink)',
              outline: 'none',
            }}
          />
          <textarea
            placeholder="Share your thoughts on this article…"
            value={body}
            onChange={e => setBody(e.target.value)}
            rows={4}
            maxLength={1000}
            required
            style={{
              border: '1px solid var(--rule)',
              background: 'var(--bg)',
              fontFamily: 'var(--serif)',
              fontSize: '0.95rem',
              lineHeight: 1.6,
              padding: '10px 12px',
              color: 'var(--ink)',
              outline: 'none',
              resize: 'vertical',
            }}
          />
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button
              type="submit"
              disabled={posting || !body.trim()}
              style={{
                background: 'var(--ink)',
                color: 'var(--bg)',
                fontFamily: 'var(--mono)',
                fontSize: '10px',
                letterSpacing: '0.15em',
                fontWeight: 700,
                padding: '10px 20px',
                border: 'none',
                cursor: posting || !body.trim() ? 'not-allowed' : 'pointer',
                opacity: posting || !body.trim() ? 0.5 : 1,
                transition: 'opacity 0.15s',
              }}
            >
              {posting ? 'POSTING…' : 'POST COMMENT →'}
            </button>
            {postError && (
              <span style={{
                fontFamily: 'var(--sans)',
                fontSize: '0.8rem',
                color: 'var(--hot)',
              }}>
                {postError}
              </span>
            )}
            <span style={{
              marginLeft: 'auto',
              fontFamily: 'var(--mono)',
              fontSize: '9px',
              color: 'var(--ink-faint)',
              letterSpacing: '0.08em',
            }}>
              {body.length}/1000
            </span>
          </div>
        </form>

        {/* Comment list */}
        {loading ? (
          <div style={{
            fontFamily: 'var(--mono)',
            fontSize: '10px',
            letterSpacing: '0.12em',
            color: 'var(--ink-soft)',
            padding: '24px 0',
          }}>
            Loading comments…
          </div>
        ) : comments.length === 0 ? (
          <div style={{
            fontFamily: 'var(--sans)',
            fontSize: '0.9rem',
            color: 'var(--ink-soft)',
            padding: '24px 0',
            textAlign: 'center',
            borderTop: '1px solid var(--rule)',
          }}>
            No comments yet. Be the first to share your thoughts.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
            {comments.map((c, i) => (
              <article
                key={c.id}
                style={{
                  borderTop: i === 0 ? '2px solid var(--ink)' : '1px solid var(--rule)',
                  padding: '20px 0',
                }}
              >
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  marginBottom: '10px',
                }}>
                  <div style={{
                    width: '36px',
                    height: '36px',
                    background: 'var(--ink)',
                    color: 'var(--bg)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontFamily: 'var(--mono)',
                    fontSize: '11px',
                    fontWeight: 700,
                    letterSpacing: '0.05em',
                    flexShrink: 0,
                  }}>
                    {c.initials}
                  </div>
                  <div>
                    <div style={{
                      fontFamily: 'var(--sans)',
                      fontSize: '0.875rem',
                      fontWeight: 700,
                      color: 'var(--ink)',
                    }}>
                      {c.name}
                    </div>
                    <div style={{
                      fontFamily: 'var(--mono)',
                      fontSize: '9px',
                      letterSpacing: '0.1em',
                      color: 'var(--ink-faint)',
                    }}>
                      {timeAgo(c.timestamp)}
                    </div>
                  </div>
                </div>
                <p style={{
                  fontFamily: 'var(--serif)',
                  fontSize: '0.95rem',
                  lineHeight: 1.65,
                  color: 'var(--ink)',
                  margin: 0,
                  paddingLeft: '46px',
                }}>
                  {c.body}
                </p>
              </article>
            ))}

            {/* Load more */}
            {hasMore && (
              <div style={{ paddingTop: '24px', borderTop: '1px solid var(--rule)' }}>
                <button
                  onClick={loadMore}
                  disabled={loadingMore}
                  style={{
                    background: 'none',
                    border: '1.5px solid var(--ink)',
                    fontFamily: 'var(--mono)',
                    fontSize: '10px',
                    letterSpacing: '0.15em',
                    padding: '10px 20px',
                    cursor: loadingMore ? 'not-allowed' : 'pointer',
                    color: 'var(--ink)',
                    opacity: loadingMore ? 0.5 : 1,
                  }}
                >
                  {loadingMore ? 'LOADING…' : 'LOAD MORE COMMENTS'}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  )
}
