import { Link } from 'react-router-dom'
import { useCallback } from 'react'
import { Hero } from '../components/ui/Hero'
import { CTASection } from '../components/ui/CTASection'
import { FeatureCards } from '../components/ui/FeatureCards'
import { WorkflowTimeline } from '../components/ui/WorkflowTimeline'
import { buttonClasses, Button } from '../components/ui'
import { useAuth } from '../context/AuthContext'

function Home() {
  const { status, isAuthenticated, user, logout } = useAuth()
  const handleLogout = useCallback(() => {
    const shouldLogout = window.confirm('Are you sure you want to sign out?')
    if (shouldLogout) {
      logout()
    }
  }, [logout])

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <header className="sticky top-0 z-20 border-b border-white/5 bg-slate-950/80 backdrop-blur">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-5">
          <Link
            to="/"
            className="text-lg font-semibold tracking-[0.3em] text-cyan-200"
          >
            AUTISM COMPANION
          </Link>
          <div className="flex items-center gap-3 text-sm">
            {status === 'checking' ? (
              <span className="text-slate-400">Validating session...</span>
            ) : isAuthenticated ? (
              <>
                <span className="hidden text-slate-300 sm:inline-flex">
                  Hello, <span className="ml-1 font-semibold">{user?.full_name}</span>
                </span>
                <Button size="sm" variant="secondary" onClick={handleLogout}>
                  Sign out
                </Button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className={buttonClasses({
                    variant: 'ghost',
                    size: 'sm',
                    className: 'text-sm font-semibold text-cyan-100',
                  })}
                >
                  Sign in
                </Link>
                <Link
                  to="/register"
                  className={buttonClasses({
                    variant: 'primary',
                    size: 'sm',
                    className: 'text-sm',
                  })}
                >
                  Create account
                </Link>
              </>
            )}
          </div>
        </div>
      </header>
      <Hero />
      <FeatureCards />
      <WorkflowTimeline />
      <CTASection />
    </div>
  )
}

export default Home
