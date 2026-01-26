'use client'

import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
  type FormEvent,
} from 'react'
import {
  Briefcase,
  ChevronDown,
  Eye,
  EyeOff,
  LogOut,
  Pencil,
  Plus,
  Search,
  Target,
  User,
  X,
} from 'lucide-react'

type Mode = 'login' | 'register'

type TelegramUser = {
  id: number
  first_name?: string
  last_name?: string
  username?: string
  photo_url?: string
  auth_date: number
  hash: string
}

type UserProfile = {
  id: string
  email?: string
  username?: string
  displayName?: string
  bio?: string
  team?: string
  position?: string
  directions?: string
  avatar?: {
    url?: string
  } | null
}

type ThreadItem = {
  id: string
  title: string
  category: string
  tags?: string[]
  authorName?: string
  createdAt: string
}

declare global {
  interface Window {
    onTelegramAuth?: (user: TelegramUser) => void
  }
}

const NAV_LINKS = ['Blog', 'Conferences', 'Services', 'Forum', 'Partnership', 'Jobs']

const CATEGORIES = [
  { label: 'News and announcements', value: 'news' },
  { label: 'Media buying', value: 'media-buying' },
  { label: 'SEO', value: 'seo' },
  { label: 'Community', value: 'community' },
  { label: 'Events', value: 'events' },
]

const TAGS = [
  { label: 'Facebook', value: 'facebook' },
  { label: 'Keitaro', value: 'keitaro' },
  { label: 'TikTok', value: 'tiktok' },
]

const formatDate = (value: string) => {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return 'Unknown'
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

function PromoCard({ align }: { align: 'left' | 'right' }) {
  return (
    <div
      className={`relative hidden w-full max-w-[340px] overflow-hidden rounded-[26px] border border-white/5 bg-gradient-to-b from-[#0f1b3e] via-[#0c1a3a] to-[#0b1a2f] p-6 text-white shadow-[0_20px_60px_rgba(9,15,30,0.65)] lg:block ${align === 'right' ? 'lg:order-3' : 'lg:order-1'
        }`}
    >
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-24 top-10 h-56 w-56 rounded-full bg-cyan-400/20 blur-[90px]" />
        <div className="absolute -right-10 bottom-4 h-56 w-56 rounded-full bg-blue-500/30 blur-[80px]" />
        <div className="absolute inset-x-6 bottom-6 h-32 rounded-3xl bg-gradient-to-tr from-blue-500/20 via-transparent to-cyan-400/10" />
      </div>
      <div className="relative z-10 flex h-full flex-col">
        <div className="text-[40px] font-black tracking-tight text-[#9ad6ff]">
          1X<span className="text-white">BET</span>
        </div>
        <div className="mt-10 flex-1">
          <div className="h-48 w-full rounded-2xl bg-gradient-to-b from-[#1a2e6b] via-[#1b3f88] to-[#132a63]" />
        </div>
        <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/70">Use Promo Code</p>
          <p className="mt-2 text-2xl font-black tracking-[0.15em] text-cyan-200">VIPOFFER</p>
          <p className="mt-3 text-xs font-semibold uppercase tracking-[0.2em] text-white/60">
            While registration and get your welcome bonus
          </p>
        </div>
      </div>
    </div>
  )
}

export default function Home() {
  const [mode, setMode] = useState<Mode>('login')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  })

  const [user, setUser] = useState<UserProfile | null>(null)
  const [userLoading, setUserLoading] = useState(true)

  const [threads, setThreads] = useState<ThreadItem[]>([])
  const [threadsError, setThreadsError] = useState('')
  const [threadsLoading, setThreadsLoading] = useState(false)
  const [threadsMeta, setThreadsMeta] = useState({
    totalDocs: 0,
    page: 1,
    totalPages: 1,
    limit: 12,
  })

  const [modalOpen, setModalOpen] = useState(false)
  const [threadForm, setThreadForm] = useState({
    title: '',
    category: '',
    tags: [] as string[],
    content: '',
  })
  const [threadError, setThreadError] = useState('')
  const [threadSubmitting, setThreadSubmitting] = useState(false)

  const telegramRef = useRef<HTMLDivElement>(null)
  const telegramBot = process.env.NEXT_PUBLIC_TELEGRAM_BOT_USERNAME || ''

  const helperText = useMemo(() => {
    return mode === 'login'
      ? 'Sign in to continue to your account'
      : 'Enter details to create an account'
  }, [mode])

  const avatarUrl = user?.avatar && typeof user.avatar === 'object' ? user.avatar.url : undefined
  const threadsStart =
    threadsMeta.totalDocs === 0 ? 0 : (threadsMeta.page - 1) * threadsMeta.limit + 1
  const threadsEnd =
    threadsMeta.totalDocs === 0
      ? 0
      : Math.min(threadsMeta.page * threadsMeta.limit, threadsMeta.totalDocs)

  const refreshUser = async () => {
    try {
      const response = await fetch('/api/auth/me', { cache: 'no-store' })
      const data = await response.json().catch(() => null)
      if (data?.user) {
        setUser(data.user as UserProfile)
        return data.user as UserProfile
      }
    } catch {
      return null
    }
    setUser(null)
    return null
  }

  const loadThreads = async (page = 1) => {
    setThreadsLoading(true)
    setThreadsError('')
    try {
      const response = await fetch(`/api/threads?page=${page}&limit=12`, { cache: 'no-store' })
      const data = await response.json().catch(() => null)
      if (!response.ok) {
        throw new Error(data?.error || 'Unable to load threads.')
      }
      setThreads(data?.docs || [])
      setThreadsMeta({
        totalDocs: data?.totalDocs ?? 0,
        page: data?.page ?? 1,
        totalPages: data?.totalPages ?? 1,
        limit: data?.limit ?? 12,
      })
    } catch (err) {
      setThreadsError(err instanceof Error ? err.message : 'Unable to load threads.')
    } finally {
      setThreadsLoading(false)
    }
  }

  useEffect(() => {
    setError('')
    setSuccess('')
  }, [mode])

  useEffect(() => {
    const bootstrap = async () => {
      setUserLoading(true)
      await refreshUser()
      setUserLoading(false)
    }

    bootstrap()
  }, [])

  useEffect(() => {
    if (user) {
      loadThreads(1)
    }
  }, [user])
  useEffect(() => {
    if (!telegramBot || !telegramRef.current) return

    telegramRef.current.innerHTML = ''
    const script = document.createElement('script')
    script.async = true
    script.src = 'https://telegram.org/js/telegram-widget.js?22'
    script.setAttribute('data-telegram-login', telegramBot)
    script.setAttribute('data-size', 'large')
    script.setAttribute('data-userpic', 'false')
    script.setAttribute('data-onauth', 'onTelegramAuth(user)')
    script.setAttribute('data-request-access', 'write')
    telegramRef.current.appendChild(script)
  }, [telegramBot])

  useEffect(() => {
    window.onTelegramAuth = async (tgUser) => {
      setLoading(true)
      setError('')
      setSuccess('')

      try {
        const response = await fetch('/api/auth/telegram-oauth', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(tgUser),
        })

        const data = await response.json()
        if (!response.ok) {
          throw new Error(data?.error || 'Telegram OAuth authentication failed.')
        }

        await refreshUser()
        setSuccess(`Welcome, ${data?.user?.username || data?.user?.email || 'friend'}!`)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Telegram OAuth authentication failed.')
      } finally {
        setLoading(false)
      }
    }

    return () => {
      delete window.onTelegramAuth
    }
  }, [])

  const handleChange = (key: keyof typeof form) => (event: ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [key]: event.target.value }))
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError('')
    setSuccess('')

    if (!form.email || !form.password) {
      setError('Please fill in all required fields.')
      return
    }

    if (mode === 'register') {
      if (!form.username) {
        setError('Please enter a login name.')
        return
      }
      if (form.password.length < 8) {
        setError('Password must be at least 8 characters.')
        return
      }
      if (form.password !== form.confirmPassword) {
        setError('Passwords do not match.')
        return
      }
    }

    setLoading(true)

    try {
      const response = await fetch(mode === 'login' ? '/api/auth/login' : '/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: form.email,
          password: form.password,
          username: form.username,
        }),
      })

      const data = await response.json()
      if (!response.ok) {
        throw new Error(data?.error || 'Authentication failed.')
      }

      await refreshUser()
      setSuccess(
        mode === 'login'
          ? `Welcome back, ${data?.user?.username || data?.user?.email || 'friend'}!`
          : 'Account created! You are now signed in.'
      )
      setForm({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Authentication failed.')
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    setUser(null)
  }

  const toggleTag = (tag: string) => {
    setThreadForm((prev) => {
      const exists = prev.tags.includes(tag)
      return {
        ...prev,
        tags: exists ? prev.tags.filter((item) => item !== tag) : [...prev.tags, tag],
      }
    })
  }

  const handleThreadSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setThreadError('')

    if (!threadForm.title || !threadForm.category || !threadForm.content) {
      setThreadError('Please fill in all required fields.')
      return
    }

    setThreadSubmitting(true)

    try {
      const response = await fetch('/api/threads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(threadForm),
      })
      const data = await response.json().catch(() => null)
      if (!response.ok) {
        throw new Error(data?.error || 'Unable to create thread.')
      }

      setModalOpen(false)
      setThreadForm({ title: '', category: '', tags: [], content: '' })
      loadThreads(1)
    } catch (err) {
      setThreadError(err instanceof Error ? err.message : 'Unable to create thread.')
    } finally {
      setThreadSubmitting(false)
    }
  }
  if (!user && userLoading) {
    return (
      <main className="relative min-h-screen bg-[#0b0b0b] text-white">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(255,255,255,0.06),transparent_55%)]" />
        <div className="relative z-10 flex min-h-screen items-center justify-center text-sm text-white/60">
          Loading...
        </div>
      </main>
    )
  }

  if (user) {
    return (
      <main className="relative min-h-screen overflow-hidden bg-[#0b0b0b] text-white">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(43,66,122,0.45),transparent_45%),radial-gradient(circle_at_75%_15%,rgba(140,88,19,0.4),transparent_40%),radial-gradient(circle_at_50%_85%,rgba(18,32,64,0.55),transparent_55%)]" />
          <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(255,255,255,0.02),transparent_40%)]" />
        </div>

        <header className="relative z-10 mx-auto flex w-full max-w-[1280px] items-center justify-between px-6 pb-10 pt-10 lg:px-10">
          <div className="flex items-center gap-3">
            <div className="auth-display text-2xl font-extrabold tracking-[0.2em]">CSC</div>
            <span className="text-[10px] font-semibold uppercase tracking-[0.4em] text-white/60">Agency</span>
          </div>
          <nav className="hidden items-center gap-8 text-sm text-white/60 lg:flex">
            {NAV_LINKS.map((item) => (
              <span key={item} className="cursor-pointer transition hover:text-white">
                {item}
              </span>
            ))}
          </nav>
          <div className="flex items-center gap-3">
            <button className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/5 transition hover:border-white/40">
              <Search className="h-5 w-5 text-white/70" />
            </button>
            <div className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-full border border-white/10 bg-gradient-to-br from-amber-200/40 via-blue-500/40 to-slate-900">
              {avatarUrl ? (
                <img src={avatarUrl} alt="User avatar" className="h-full w-full object-cover" />
              ) : (
                <User className="h-5 w-5 text-white/70" />
              )}
            </div>
          </div>
        </header>

        <section className="relative z-10 mx-auto w-full max-w-[1280px] px-6 pb-28 lg:px-10">
          <div className="mb-8 text-center">
            <div className="auth-display text-4xl font-semibold tracking-tight">Community</div>
            <p className="mt-2 text-sm text-white/50">Share insights, connect, and launch new threads.</p>
          </div>

          <div className="rounded-[30px] border border-white/10 bg-gradient-to-r from-white/5 via-white/2 to-transparent p-8">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex items-center gap-5">
                <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-full border border-white/10 bg-gradient-to-br from-amber-200/40 via-blue-500/40 to-slate-900">
                  {avatarUrl ? (
                    <img src={avatarUrl} alt="User avatar" className="h-full w-full object-cover" />
                  ) : (
                    <User className="h-7 w-7 text-white/70" />
                  )}
                </div>
                <div>
                  <p className="text-lg font-semibold">{user.displayName || user.username || 'Member'}</p>
                  <div className="mt-2 flex items-center gap-3 text-xs text-white/50">
                    <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-white/10">in</span>
                    <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-white/10">tt</span>
                    <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-white/10">tg</span>
                  </div>
                </div>
              </div>
              <div className="max-w-xl text-sm text-white/55">
                {user.bio ||
                  'I make design that people fall in love with at first sight - and that works to grow businesses. Share your latest insights with the community.'}
              </div>
              <div className="flex items-center gap-2 text-xs text-white/50">
                <button className="flex items-center gap-2 rounded-full border border-white/10 px-4 py-2 hover:border-white/30">
                  <Pencil className="h-4 w-4" />
                  Edit
                </button>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 rounded-full border border-white/10 px-4 py-2 hover:border-white/30"
                >
                  <LogOut className="h-4 w-4" />
                  Exit
                </button>
              </div>
            </div>
          </div>

          <div className="mt-6 grid gap-4 lg:grid-cols-3">
            <div className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/5 px-5 py-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/20 text-primary">
                <Briefcase className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-white/40">Team</p>
                <p className="text-sm font-semibold">{user.team || 'Ping.Partners'}</p>
              </div>
            </div>
            <div className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/5 px-5 py-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/20 text-primary">
                <User className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-white/40">Position</p>
                <p className="text-sm font-semibold">{user.position || 'Teamlead'}</p>
              </div>
            </div>
            <div className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/5 px-5 py-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/20 text-primary">
                <Target className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-white/40">Directions</p>
                <p className="text-sm font-semibold">{user.directions || 'Investing, Crypto, Trading'}</p>
              </div>
            </div>
          </div>

          <div className="mt-8 overflow-hidden rounded-[26px] border border-white/10 bg-gradient-to-r from-[#2b1f2b] via-[#301b2b] to-[#1f2230]">
            <div className="flex items-center justify-center px-6 py-12">
              <div className="auth-display text-5xl font-bold tracking-[0.2em] text-pink-400">FAVBET</div>
            </div>
          </div>

          <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <h2 className="auth-display text-2xl font-semibold">Threads</h2>
              <span className="text-sm text-primary">{threadsMeta.totalDocs}</span>
            </div>
            <button
              className="inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-5 py-2 text-sm text-primary transition hover:border-primary"
              onClick={() => setModalOpen(true)}
            >
              <Plus className="h-4 w-4" />
              Add a comment
            </button>
          </div>

          <div className="mt-6 space-y-4">
            {threadsLoading && (
              <div className="rounded-2xl border border-white/10 bg-white/5 px-6 py-5 text-sm text-white/60">
                Loading threads...
              </div>
            )}
            {threadsError && (
              <div className="rounded-2xl border border-red-500/40 bg-red-500/10 px-6 py-5 text-sm text-red-200">
                {threadsError}
              </div>
            )}
            {!threadsLoading && !threadsError && threads.length === 0 && (
              <div className="rounded-2xl border border-white/10 bg-white/5 px-6 py-5 text-sm text-white/60">
                No threads yet. Create the first one.
              </div>
            )}
            {threads.map((thread) => (
              <div
                key={thread.id}
                className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-white/5 px-6 py-5 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/20 text-primary">
                    <span className="text-sm font-bold">#</span>
                  </div>
                  <div>
                    <p className="text-sm font-semibold">{thread.title}</p>
                    <p className="text-xs text-white/50">
                      {CATEGORIES.find((item) => item.value === thread.category)?.label || thread.category}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-xs text-white/50">
                  <div className="text-right">
                    <p className="text-xs font-semibold text-white/70">{thread.authorName || user.displayName}</p>
                    <p>{formatDate(thread.createdAt)}</p>
                  </div>
                  <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border border-white/10 bg-white/5">
                    {avatarUrl ? (
                      <img src={avatarUrl} alt="Author" className="h-full w-full object-cover" />
                    ) : (
                      <User className="h-4 w-4" />
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/5 px-6 py-4 text-xs text-white/50">
            <span>
              Showing {threadsStart}-{threadsEnd} of {threadsMeta.totalDocs} threads
            </span>
            <div className="flex items-center gap-2">
              <button
                className="h-8 w-8 rounded-full border border-white/10 text-white/60 hover:border-white/30"
                disabled={threadsMeta.page <= 1}
                onClick={() => loadThreads(threadsMeta.page - 1)}
              >
                {'<'}
              </button>
              <span className="h-8 w-8 rounded-full bg-primary text-center leading-8 text-black">{threadsMeta.page}</span>
              <button
                className="h-8 w-8 rounded-full border border-white/10 text-white/60 hover:border-white/30"
                disabled={threadsMeta.page >= threadsMeta.totalPages}
                onClick={() => loadThreads(threadsMeta.page + 1)}
              >
                {'>'}
              </button>
            </div>
          </div>
        </section>

        <footer className="relative z-10 border-t border-white/5">
          <div className="mx-auto flex w-full max-w-[1280px] flex-col items-center gap-8 px-6 py-10 text-xs text-white/40 lg:flex-row lg:justify-between lg:px-10">
            <div className="flex items-center gap-3">
              <div className="auth-display text-lg font-semibold tracking-[0.2em]">CSC</div>
              <span className="text-[10px] uppercase tracking-[0.4em]">Agency</span>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-6 text-[11px] text-white/50">
              {['Agency', ...NAV_LINKS].map((item) => (
                <span key={item} className="cursor-pointer hover:text-white">
                  {item}
                </span>
              ))}
            </div>
            <div className="text-white/30">(c) 2025, ClickStorm Corporation. All Rights Reserved.</div>
          </div>
        </footer>

        {modalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-6">
            <div
              className="absolute inset-0 bg-black/70 backdrop-blur-sm"
              onClick={() => setModalOpen(false)}
            />
            <div className="relative z-10 w-full max-w-[520px] rounded-[28px] border border-white/10 bg-[#1a1a1a] p-8 shadow-[0_25px_80px_rgba(0,0,0,0.6)]">
              <div className="flex items-center justify-between">
                <h3 className="auth-display text-xl font-semibold">Create a new thread</h3>
                <button className="text-white/50 hover:text-white" onClick={() => setModalOpen(false)}>
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form className="mt-6 space-y-5" onSubmit={handleThreadSubmit}>
                <label className="block text-sm text-white/70">
                  Thread title *
                  <input
                    className="mt-2 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition focus:border-primary"
                    placeholder="Enter the name of the thread..."
                    value={threadForm.title}
                    onChange={(event) => setThreadForm((prev) => ({ ...prev, title: event.target.value }))}
                  />
                </label>

                <label className="block text-sm text-white/70">
                  Category *
                  <div className="relative mt-2">
                    <select
                      className="w-full appearance-none rounded-2xl border border-white/10 bg-white/5 px-4 py-3 pr-10 text-sm text-white outline-none transition focus:border-primary"
                      value={threadForm.category}
                      onChange={(event) =>
                        setThreadForm((prev) => ({ ...prev, category: event.target.value }))
                      }
                    >
                      <option value="" disabled>
                        Select a category
                      </option>
                      {CATEGORIES.map((item) => (
                        <option key={item.value} value={item.value} className="text-black">
                          {item.label}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-primary" />
                  </div>
                </label>

                <div className="text-sm text-white/70">
                  Tag platform
                  <div className="mt-3 flex flex-wrap gap-3">
                    {TAGS.map((tag) => {
                      const active = threadForm.tags.includes(tag.value)
                      return (
                        <button
                          key={tag.value}
                          type="button"
                          className={`rounded-full border px-4 py-2 text-xs font-semibold transition ${active
                              ? 'border-primary bg-primary text-black'
                              : 'border-white/10 bg-white/5 text-white/60 hover:border-white/30'
                            }`}
                          onClick={() => toggleTag(tag.value)}
                        >
                          {tag.label}
                        </button>
                      )
                    })}
                  </div>
                </div>

                <label className="block text-sm text-white/70">
                  Content *
                  <textarea
                    className="mt-2 min-h-[140px] w-full resize-none rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition focus:border-primary"
                    placeholder="Write the content of your thread..."
                    value={threadForm.content}
                    onChange={(event) => setThreadForm((prev) => ({ ...prev, content: event.target.value }))}
                  />
                </label>

                {threadError && (
                  <div className="rounded-2xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                    {threadError}
                  </div>
                )}

                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <button
                    type="button"
                    className="rounded-full border border-white/10 px-6 py-3 text-sm text-white/60 hover:border-white/30"
                    onClick={() => setModalOpen(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="rounded-full bg-primary px-6 py-3 text-sm font-semibold text-black transition hover:bg-[color:var(--primary-strong)] disabled:cursor-not-allowed disabled:opacity-60"
                    disabled={threadSubmitting}
                  >
                    {threadSubmitting ? 'Creating...' : 'Create a thread'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    )
  }
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#0b0b0b] text-white">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(43,66,122,0.4),transparent_45%),radial-gradient(circle_at_75%_15%,rgba(140,88,19,0.4),transparent_40%),radial-gradient(circle_at_50%_85%,rgba(18,32,64,0.5),transparent_55%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(255,255,255,0.02),transparent_40%)]" />
      </div>

      <header className="relative z-10 mx-auto flex w-full max-w-[1280px] items-center justify-between px-6 pb-12 pt-10 lg:px-10">
        <div className="flex items-center gap-3">
          <div className="auth-display text-2xl font-extrabold tracking-[0.2em]">CSC</div>
          <span className="text-[10px] font-semibold uppercase tracking-[0.4em] text-white/60">Agency</span>
        </div>
        <nav className="hidden items-center gap-8 text-sm text-white/60 lg:flex">
          {NAV_LINKS.map((item) => (
            <span key={item} className="cursor-pointer transition hover:text-white">
              {item}
            </span>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <button className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/5 transition hover:border-white/40">
            <Search className="h-5 w-5 text-white/70" />
          </button>
          <div className="h-11 w-11 overflow-hidden rounded-full border border-white/10 bg-gradient-to-br from-amber-200/40 via-blue-500/40 to-slate-900" />
        </div>
      </header>

      <section className="relative z-10 mx-auto flex w-full max-w-[1280px] flex-col items-center px-6 pb-28 lg:px-10">
        <div className="grid w-full items-center gap-10 lg:grid-cols-[1fr_auto_1fr]">
          <PromoCard align="left" />

          <div className="relative mx-auto w-full max-w-[420px] rounded-[30px] border border-white/10 bg-black/60 p-8 shadow-[0_25px_80px_rgba(0,0,0,0.55)] backdrop-blur">
            <div className="absolute inset-x-6 top-0 h-[2px] bg-gradient-to-r from-transparent via-white/20 to-transparent" />
            <h1 className="auth-display text-2xl font-semibold tracking-tight">
              {mode === 'login' ? 'Welcome back!' : 'Create an account'}
            </h1>
            <p className="mt-2 text-sm text-white/60">{helperText}</p>

            <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
              {mode === 'register' && (
                <label className="block text-sm text-white/70">
                  Login
                  <input
                    className="mt-2 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition focus:border-primary focus:bg-white/10"
                    placeholder="Your nickname"
                    value={form.username}
                    onChange={handleChange('username')}
                    autoComplete="username"
                  />
                </label>
              )}

              <label className="block text-sm text-white/70">
                Email
                <input
                  className="mt-2 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition focus:border-primary focus:bg-white/10"
                  placeholder="you@example.com"
                  type="email"
                  value={form.email}
                  onChange={handleChange('email')}
                  autoComplete="email"
                  required
                />
              </label>

              <label className="block text-sm text-white/70">
                <span className="flex items-center justify-between">
                  <span>Password</span>
                  {mode === 'login' && (
                    <button type="button" className="text-xs text-white/50 hover:text-white">
                      Forgot password?
                    </button>
                  )}
                </span>
                <div className="relative mt-2">
                  <input
                    className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 pr-12 text-sm text-white outline-none transition focus:border-primary focus:bg-white/10"
                    placeholder="********"
                    type={showPassword ? 'text' : 'password'}
                    value={form.password}
                    onChange={handleChange('password')}
                    autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                    required
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50"
                    onClick={() => setShowPassword((prev) => !prev)}
                    aria-label="Toggle password visibility"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </label>

              {mode === 'register' && (
                <label className="block text-sm text-white/70">
                  Confirm Password
                  <div className="relative mt-2">
                    <input
                      className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 pr-12 text-sm text-white outline-none transition focus:border-primary focus:bg-white/10"
                      placeholder="********"
                      type={showConfirm ? 'text' : 'password'}
                      value={form.confirmPassword}
                      onChange={handleChange('confirmPassword')}
                      autoComplete="new-password"
                      required
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50"
                      onClick={() => setShowConfirm((prev) => !prev)}
                      aria-label="Toggle confirm password visibility"
                    >
                      {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </label>
              )}

              {error && (
                <div className="rounded-2xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                  {error}
                </div>
              )}
              {success && (
                <div className="rounded-2xl border border-emerald-400/40 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">
                  {success}
                </div>
              )}

              <button
                className="mt-2 w-full rounded-2xl bg-primary px-4 py-3 text-sm font-semibold text-black transition hover:bg-[color:var(--primary-strong)] disabled:cursor-not-allowed disabled:opacity-60"
                type="submit"
                disabled={loading}
              >
                {loading ? 'Please wait...' : mode === 'login' ? 'Sign In' : 'Create Account'}
              </button>
            </form>

            <div className="mt-6 text-center text-xs text-white/60">
              {mode === 'login' ? (
                <span>
                  Don&apos;t have an account?{' '}
                  <button className="text-primary" onClick={() => setMode('register')}>
                    Sign Up
                  </button>
                </span>
              ) : (
                <span>
                  Already have an account?{' '}
                  <button className="text-primary" onClick={() => setMode('login')}>
                    Log In
                  </button>
                </span>
              )}
            </div>

            <div className="mt-6 flex items-center gap-4 text-xs text-white/40">
              <span className="h-px flex-1 bg-white/10" />
              OR
              <span className="h-px flex-1 bg-white/10" />
            </div>

            <div className="relative mt-6">
              <button
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#2a5bd7] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#2f67f2] disabled:cursor-not-allowed disabled:opacity-60"
                type="button"
                disabled={!telegramBot || loading}
              >
                <span className="text-[11px] font-bold tracking-[0.2em]">TG</span>
                Continue with Telegram
              </button>
              <div
                ref={telegramRef}
                className={`telegram-widget absolute inset-0 z-10 ${telegramBot ? '' : 'pointer-events-none'}`}
                aria-hidden
              />
            </div>

            {!telegramBot && (
              <p className="mt-3 text-center text-[11px] text-white/40">
                Telegram login is disabled until NEXT_PUBLIC_TELEGRAM_BOT_USERNAME is configured.
              </p>
            )}
          </div>

          <PromoCard align="right" />
        </div>
      </section>

      <footer className="relative z-10 border-t border-white/5">
        <div className="mx-auto flex w-full max-w-[1280px] flex-col items-center gap-8 px-6 py-10 text-xs text-white/40 lg:flex-row lg:justify-between lg:px-10">
          <div className="flex items-center gap-3">
            <div className="auth-display text-lg font-semibold tracking-[0.2em]">CSC</div>
            <span className="text-[10px] uppercase tracking-[0.4em]">Agency</span>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-6 text-[11px] text-white/50">
            {['Agency', ...NAV_LINKS].map((item) => (
              <span key={item} className="cursor-pointer hover:text-white">
                {item}
              </span>
            ))}
          </div>
          <div className="text-white/30">(c) 2025, ClickStorm Corporation. All Rights Reserved.</div>
        </div>
      </footer>
    </main>
  )
}

