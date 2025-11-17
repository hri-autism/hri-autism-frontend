import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ChangeEvent,
  type FormEvent,
} from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { PageContainer, SectionHeader, StatusBanner, Button } from '../components/ui'
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
    <PageContainer variant="dark" contentClassName="space-y-12">
      <SectionHeader
        tone="dark"
        title="Create an account"
        description="Register to add child profiles, create sessions, and track their progress."
      />
      <div className="space-y-8 rounded-[32px] border border-white/10 bg-white/5 p-8 shadow-2xl shadow-cyan-500/10 backdrop-blur">
        <form className="space-y-6" onSubmit={handleSubmit} noValidate>
          <TextInput
            tone="dark"
            label="Full name"
            name="full_name"
            placeholder="Alice Chen"
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
  )
}

export default Register
