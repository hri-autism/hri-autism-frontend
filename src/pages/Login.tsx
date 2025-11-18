import { useCallback, useMemo, useState, type FormEvent, type ChangeEvent } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { PageContainer, SectionHeader, StatusBanner, Button, LoadingOverlay } from '../components/ui'
import { TextInput } from '../components/form'
import { request, ApiError } from '../lib/api'
import { useAuth, type AuthUser } from '../context/AuthContext'

type LoginFormState = {
  email: string
  password: string
}

type LoginFieldErrors = Partial<LoginFormState>

type AuthResponse = {
  access_token: string
  token_type: 'bearer'
  user: AuthUser
}

const initialState: LoginFormState = {
  email: '',
  password: '',
}

function Login() {
  const [form, setForm] = useState<LoginFormState>(initialState)
  const [fieldErrors, setFieldErrors] = useState<LoginFieldErrors>({})
  const [formError, setFormError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { setSession, status, isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const handleChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const { name, value } = event.target
      setForm((prev) => ({ ...prev, [name]: value }))
      setFieldErrors((prev) => {
        if (!prev[name as keyof LoginFieldErrors]) {
          return prev
        }
        const next = { ...prev }
        delete next[name as keyof LoginFieldErrors]
        return next
      })
    },
    [],
  )

  const validate = useCallback(() => {
    const errors: LoginFieldErrors = {}
    if (!form.email.trim()) {
      errors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      errors.email = 'Please enter a valid email address'
    }

    if (!form.password) {
      errors.password = 'Password is required'
    }
    return errors
  }, [form.email, form.password])

  const handleSubmit = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault()
      setFormError(null)

      const errors = validate()
      if (Object.keys(errors).length > 0) {
        setFieldErrors(errors)
        return
      }

      const trimmedEmail = form.email.trim()

      setIsSubmitting(true)
      try {
        const data = await request<AuthResponse>('/api/auth/login', {
          method: 'POST',
          body: {
            email: trimmedEmail,
            password: form.password,
          },
          skipAuthHandling: true,
        })

        setSession({ token: data.access_token, user: data.user })
        const redirectTo =
          (location.state as { from?: { pathname?: string } } | null)?.from?.pathname ??
          '/'
        navigate(redirectTo, { replace: true })
      } catch (error) {
        console.error('Login failed', error)
        if (error instanceof ApiError) {
          if (error.status === 404) {
            navigate('/register', {
              replace: true,
              state: { email: trimmedEmail },
            })
            return
          }
          if (error.status === 422) {
            try {
              await request('/api/auth/login', {
                method: 'POST',
                body: {
                  email: trimmedEmail,
                  password: 'placeholder_password',
                },
                skipAuthHandling: true,
              })
            } catch (probeError) {
              if (probeError instanceof ApiError && probeError.status === 404) {
                navigate('/register', {
                  replace: true,
                  state: { email: trimmedEmail },
                })
                return
              }
            }
            setFormError('Incorrect password. Please try again.')
            return
          }
          if (error.status === 400) {
            setFormError('Incorrect password. Please try again.')
            return
          }
        }
        const message =
          error instanceof Error ? error.message : 'Login failed. Please try again later.'
        setFormError(message)
      } finally {
        setIsSubmitting(false)
      }
    },
    [form.email, form.password, location.state, navigate, setSession, validate],
  )

  const disableSubmit = useMemo(() => {
    return (
      isSubmitting ||
      !form.email.trim() ||
      !form.password ||
      Object.keys(fieldErrors).length > 0
    )
  }, [fieldErrors, form.email, form.password, isSubmitting])

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
    <PageContainer variant="dark" contentClassName="space-y-12">
      <SectionHeader
        tone="dark"
        title="Welcome back"
        description="Sign in with your registered email to access your dashboard."
      />
      <div className="relative space-y-8 rounded-[32px] border border-white/10 bg-white/5 p-8 shadow-2xl shadow-cyan-500/10 backdrop-blur">
        {isSubmitting ? (
          <LoadingOverlay tone="dark" label="Signing in..." />
        ) : null}
        <form className="space-y-6" onSubmit={handleSubmit} noValidate>
          <TextInput
            tone="dark"
            label="Email"
            name="email"
            type="email"
            placeholder="parent@example.com"
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
            placeholder="••••••••"
            value={form.password}
            onChange={handleChange}
            autoComplete="current-password"
            error={fieldErrors.password}
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
            Sign in
          </Button>
        </form>
        <div className="text-center text-sm text-slate-300">
          Need an account?
          <Link
            to="/register"
            className="ml-2 font-semibold text-cyan-200 underline-offset-4 hover:underline"
          >
            Create one
          </Link>
        </div>
      </div>
    </PageContainer>
  )
}

export default Login
