import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { buttonClasses } from '../ui'

type TopBarProps = {
  // solid: app shell; transparent: see-through; hero: share hero background
  variant?: 'solid' | 'transparent' | 'hero'
}

export function TopBar({ variant = 'solid' }: TopBarProps) {
  const { status, isAuthenticated, user, logout } = useAuth()
  const [menuOpen, setMenuOpen] = useState(false)
  const [isPointerDevice, setIsPointerDevice] = useState(false)

  useEffect(() => {
    const media = window.matchMedia('(pointer: fine)')
    const update = (event: MediaQueryListEvent | MediaQueryList) => {
      setIsPointerDevice(event.matches)
    }
    update(media)
    if (typeof media.addEventListener === 'function') {
      media.addEventListener('change', update)
      return () => media.removeEventListener('change', update)
    }
    media.addListener(update as any)
    return () => media.removeListener(update as any)
  }, [])

  const handleLogout = useCallback(() => {
    const shouldLogout = window.confirm('Are you sure you want to sign out?')
    if (shouldLogout) {
      logout()
    }
  }, [logout])

  const headerStyles =
    variant === 'solid'
      ? 'border-b border-white/5 bg-slate-950/80 backdrop-blur-sm'
      : variant === 'hero'
        ? 'bg-gradient-to-b from-[#0F172A] via-[#111827] to-[#0B1120] backdrop-blur-sm'
        : 'bg-transparent backdrop-blur-sm'

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 pointer-events-auto ${headerStyles}`}
        onMouseLeave={isPointerDevice ? () => setMenuOpen(false) : undefined}
      >
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-5">
          <Link
            to="/"
            className="whitespace-nowrap text-base font-semibold tracking-[0.25em] text-cyan-200 md:text-lg md:tracking-[0.3em]"
          >
            <span className="md:hidden">AUTISM CARE</span>
            <span className="hidden md:inline">AUTISM COMPANION</span>
          </Link>
          <div className="flex items-center gap-3 text-sm">
            {status === 'checking' ? (
              <span className="text-slate-400">Validating session...</span>
            ) : isAuthenticated ? (
              <div className="relative">
                <div className="flex items-center gap-1.5 rounded-2xl border border-cyan-400/40 bg-gradient-to-r from-slate-900/70 via-slate-900/40 to-cyan-900/30 px-4 py-2 text-sm font-semibold tracking-wide text-cyan-100 transition hover:border-cyan-300 hover:text-white">
                  <span className="inline-flex h-5 w-5 items-start justify-start">
                    <span className="inline-block h-3 w-3 border-t-2 border-l-2 border-cyan-200" />
                  </span>
                  <button
                    type="button"
                    onClick={() => setMenuOpen((prev) => !prev)}
                    className="flex items-center gap-1.5"
                  >
                    <span>Hello, {user?.full_name ?? 'User'}</span>
                    <span className="inline-flex h-5 w-5 items-center justify-center">
                      <span
                        className={`inline-block h-3 w-3 border-b-2 border-r-2 border-cyan-200 transition-transform ${
                          menuOpen ? 'rotate-45' : '-rotate-135'
                        }`}
                      />
                    </span>
                  </button>
                </div>
                {menuOpen ? (
                  <div className="absolute right-0 mt-3 w-56 rounded-2xl border border-cyan-400/30 bg-gradient-to-b from-slate-950/95 via-slate-900/90 to-slate-950/80 p-3">
                    <Link
                      to="/dashboard"
                      className="block rounded-xl px-4 py-2 text-sm font-medium text-cyan-100 transition hover:bg-cyan-400/10 hover:text-white"
                      onClick={() => setMenuOpen(false)}
                    >
                      Dashboard
                    </Link>
                    <button
                      type="button"
                      className="mt-2 block w-full rounded-xl border border-rose-400/30 px-4 py-2 text-left text-sm font-semibold text-rose-200 transition hover:bg-rose-500/10"
                      onClick={() => {
                        setMenuOpen(false)
                        handleLogout()
                      }}
                    >
                      Sign out
                    </button>
                  </div>
                ) : null}
              </div>
            ) : (
              <>
                <Link
                  to="/login"
                  className={buttonClasses({
                    variant: 'ghost',
                    size: 'md',
                    className: 'text-base font-semibold text-cyan-100',
                  })}
                >
                  <span className="sm:hidden">Login</span>
                  <span className="hidden sm:inline">Sign in</span>
                </Link>
                <Link
                  to="/register"
                  className={buttonClasses({
                    variant: 'primary',
                    size: 'md',
                    className: 'text-base',
                  })}
                >
                  <span className="sm:hidden">Register</span>
                  <span className="hidden sm:inline">Create account</span>
                </Link>
              </>
            )}
          </div>
        </div>
      </header>
      <div className="h-16 md:h-20" />
    </>
  )
}
