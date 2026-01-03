import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ChangeEvent,
  type FormEvent,
} from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import {
  PageContainer,
  SectionHeader,
  StatusBanner,
  Button,
  LoadingOverlay,
  buttonClasses,
} from '../components/ui'
import { heroBackgroundStyles } from '../components/ui/RobotIllustration'
import { Select, TextInput } from '../components/form'
import { request } from '../lib/api'
import { useAuth, type AuthUser } from '../context/AuthContext'

type RegisterFormState = {
  full_name: string
  email: string
  password: string
  role: string
}

type RegisterFieldErrors = Partial<RegisterFormState>

type AuthResponse = {
  access_token: string
  token_type: 'bearer'
  user: AuthUser
}

const initialState: RegisterFormState = {
  full_name: '',
  email: '',
  password: '',
  role: '',
}

const ROLE_OPTIONS = [
  { label: 'Parent', value: 'parent' },
  { label: 'Therapist', value: 'therapist' },
]

function Register() {
  const [form, setForm] = useState<RegisterFormState>(initialState)
  const [fieldErrors, setFieldErrors] = useState<RegisterFieldErrors>({})
  const [formError, setFormError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { setSession, status, isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    const state = location.state as { email?: string } | null
    if (state?.email) {
      setForm((prev) => ({ ...prev, email: state.email ?? '' }))
    }
  }, [location.state])

  const handleChange = useCallback(
    (
      event: ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    ) => {
      const { name, value } = event.target
      setForm((prev) => ({ ...prev, [name]: value }))
      setFieldErrors((prev) => {
        if (!prev[name as keyof RegisterFieldErrors]) {
          return prev
        }
        const next = { ...prev }
        delete next[name as keyof RegisterFieldErrors]
        return next
      })
    },
    [],
  )

  const validate = useCallback(() => {
    const errors: RegisterFieldErrors = {}
    if (!form.full_name.trim()) {
      errors.full_name = 'Full name is required'
    }

    if (!form.email.trim()) {
      errors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      errors.email = 'Please enter a valid email address'
    }

    if (!form.password) {
      errors.password = 'Password is required'
    } else if (form.password.length < 8) {
      errors.password = 'Password must be at least 8 characters'
    }

    if (!form.role) {
      errors.role = 'Please select a role'
    }

    return errors
  }, [form.email, form.full_name, form.password, form.role])

  const handleSubmit = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault()
      setFormError(null)

      const errors = validate()
      if (Object.keys(errors).length > 0) {
        setFieldErrors(errors)
        return
      }

      setIsSubmitting(true)
      try {
        const data = await request<AuthResponse>('/api/auth/register', {
          method: 'POST',
          body: {
            full_name: form.full_name.trim(),
            email: form.email.trim(),
            password: form.password,
            role: form.role,
          },
          skipAuthHandling: true,
        })
        setSession({ token: data.access_token, user: data.user })
        navigate('/', { replace: true })
      } catch (error) {
        console.error('Register failed', error)
        const message =
          error instanceof Error ? error.message : 'Registration failed. Please try again later.'
        setFormError(message)
      } finally {
        setIsSubmitting(false)
      }
    },
    [form.email, form.full_name, form.password, form.role, navigate, setSession, validate],
  )

  const disableSubmit = useMemo(() => {
    return (
      isSubmitting ||
      !form.full_name.trim() ||
      !form.email.trim() ||
      !form.password ||
      !form.role ||
      Object.keys(fieldErrors).length > 0
    )
  }, [
    fieldErrors,
    form.email,
    form.full_name,
    form.password,
    form.role,
    isSubmitting,
  ])

  if (status === 'checking') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
        <div className="text-lg font-semibold tracking-wide">Loading...</div>
      </div>
    )
  }

  if (isAuthenticated) {
    return <Navigate to="/" replace />
  }

  return (
    <section className={`${heroBackgroundStyles} min-h-screen`}>
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -left-1/3 -top-1/4 h-[60vh] w-[60vw] rounded-full bg-gradient-to-br from-cyan-400/40 via-purple-500/30 to-blue-500/40 blur-3xl" />
        <div className="absolute right-[-10%] top-1/3 h-[50vh] w-[40vw] rounded-full bg-gradient-to-br from-blue-500/40 to-purple-500/40 blur-3xl" />
      </div>
      <div className="relative z-10">
        <header className="sticky top-0 z-20 border-b border-white/5 bg-slate-950/80 backdrop-blur">
          <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-5">
            <Link
              to="/"
              className="whitespace-nowrap text-base font-semibold tracking-[0.25em] text-cyan-200 md:text-lg md:tracking-[0.3em]"
            >
              <span className="md:hidden">AUTISM CARE</span>
              <span className="hidden md:inline">AUTISM COMPANION</span>
            </Link>
            <div className="flex items-center gap-3 text-sm">
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
            </div>
          </div>
        </header>
        <PageContainer
          variant="dark"
          className="bg-transparent text-white"
          contentClassName="space-y-12"
        >
          <SectionHeader
            tone="dark"
            align="center"
            titleClassName="text-4xl md:text-5xl"
            descriptionClassName="text-base md:text-lg"
          title={
            <>
              Create{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-blue-400 to-purple-400">
                Account
              </span>
            </>
          }
        description={
          <>
            <span className="md:hidden">
              Register to add profiles, sessions, and track progress.
            </span>
            <span className="hidden md:inline">
              Register to add child profiles, create sessions, and track their progress.
            </span>
          </>
        }
      />
      <div className="relative space-y-8 rounded-[32px] border border-white/10 bg-white/5 p-8 shadow-2xl shadow-cyan-500/10 backdrop-blur">
        {isSubmitting ? (
          <LoadingOverlay tone="dark" label="Creating account..." />
        ) : null}
        <form className="space-y-6" onSubmit={handleSubmit} noValidate>
            <TextInput
              tone="dark"
              label="Full name"
              name="full_name"
              value={form.full_name}
              onChange={handleChange}
              autoComplete="name"
              error={fieldErrors.full_name}
            />
            <TextInput
              tone="dark"
              label="Email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              autoComplete="email"
              error={fieldErrors.email}
            />
          <TextInput
            tone="dark"
            label="Password"
            name="password"
            type="password"
            placeholder="At least 8 characters"
            value={form.password}
            onChange={handleChange}
            autoComplete="new-password"
            error={fieldErrors.password}
          />
          <Select
            tone="dark"
            label="Role"
              name="role"
              value={form.role}
              onChange={handleChange}
              options={ROLE_OPTIONS}
              placeholder="Select a role"
              error={fieldErrors.role}
            />
          {formError ? (
            <StatusBanner variant="error">{formError}</StatusBanner>
          ) : null}
          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-full"
            loading={isSubmitting}
            disabled={disableSubmit}
          >
            Register
          </Button>
        </form>
        <div className="text-center text-sm text-slate-300">
          Already have an account?
          <Link
            to="/login"
            className="ml-2 font-semibold text-cyan-200 underline-offset-4 hover:underline"
          >
            Sign in
          </Link>
        </div>
      </div>
        </PageContainer>
      </div>
    </section>
  )
}

export default Register
