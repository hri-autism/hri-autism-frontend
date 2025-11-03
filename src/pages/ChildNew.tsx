import { useCallback, useMemo, useState } from 'react'
import type { ChangeEvent, FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { COMM_LEVELS, PERSONALITIES } from '../lib/constants'
import { useChild } from '../hooks/useChild'
import { FormError, Select, TextArea, TextInput } from '../components/form'

type FormState = {
  nickname: string
  age: string
  comm_level: string
  personality: string
  triggers_raw: string
  interests_raw: string
  target_skills_raw: string
}

type FieldErrors = Partial<Record<keyof FormState, string>>

const initialState: FormState = {
  nickname: '',
  age: '',
  comm_level: '',
  personality: '',
  triggers_raw: '',
  interests_raw: '',
  target_skills_raw: '',
}

const COMM_LEVEL_OPTIONS = COMM_LEVELS.map((level) => ({
  value: level,
  label: level.charAt(0).toUpperCase() + level.slice(1),
}))

const PERSONALITY_OPTIONS = PERSONALITIES.map((item) => ({
  value: item,
  label: item.charAt(0).toUpperCase() + item.slice(1),
}))

function ChildNew() {
  const [form, setForm] = useState<FormState>(initialState)
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({})
  const [formError, setFormError] = useState<string | null>(null)
  const { createChild, isSubmitting, error, clearError } = useChild()
  const navigate = useNavigate()

  const handleChange = useCallback(
    (
      event: ChangeEvent<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >,
    ) => {
      const field = event.target.name as keyof FormState
      setForm((prev) => ({
        ...prev,
        [field]: event.target.value,
      }))
      setFieldErrors((prev) => {
        if (!prev[field]) {
          return prev
        }
        const next = { ...prev }
        delete next[field]
        return next
      })
    },
    [],
  )

  const handleSubmit = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault()
      clearError()

      const newErrors: FieldErrors = {}

      const trimmedNickname = form.nickname.trim()
      if (!trimmedNickname) {
        newErrors.nickname = 'Nickname is required'
      } else if (trimmedNickname.length > 100) {
        newErrors.nickname = 'Nickname must be 100 characters or less'
      }

      const parsedAge = Number(form.age)
      if (!Number.isFinite(parsedAge) || !Number.isInteger(parsedAge)) {
        newErrors.age = 'Age must be a whole number'
      } else if (parsedAge < 0 || parsedAge > 18) {
        newErrors.age = 'Age must be between 0 and 18'
      }

      if (!form.comm_level) {
        newErrors.comm_level = 'Select a communication level'
      }

      if (!form.personality) {
        newErrors.personality = 'Select a personality'
      }

      if (form.triggers_raw && form.triggers_raw.length > 800) {
        newErrors.triggers_raw = 'Sensitive topics must be 800 characters or less'
      }

      if (form.interests_raw && form.interests_raw.length > 800) {
        newErrors.interests_raw = 'Long-term interests must be 800 characters or less'
      }

      if (form.target_skills_raw && form.target_skills_raw.length > 800) {
        newErrors.target_skills_raw = 'Target skills must be 800 characters or less'
      }

      if (Object.keys(newErrors).length > 0) {
        setFieldErrors(newErrors)
        setFormError('Please correct the highlighted fields.')
        return
      }

      setFieldErrors({})
      setFormError(null)

      try {
        const child = await createChild({
          nickname: trimmedNickname,
          age: parsedAge,
          comm_level: form.comm_level as 'low' | 'medium' | 'high',
          personality:
            form.personality as 'shy' | 'active' | 'calm' | 'curious',
          triggers_raw: form.triggers_raw || undefined,
          interests_raw: form.interests_raw || undefined,
          target_skills_raw: form.target_skills_raw || undefined,
        })
        navigate(`/session/new?child_id=${encodeURIComponent(child.child_id)}`)
      } catch (submissionError) {
        console.error(submissionError)
        if (submissionError instanceof Error) {
          setFormError(submissionError.message)
        } else {
          setFormError('Failed to submit the form. Please try again.')
        }
      }
    },
    [clearError, createChild, form, navigate],
  )

  const handleReset = useCallback(() => {
    setForm(initialState)
    setFieldErrors({})
    setFormError(null)
    clearError()
  }, [clearError])

  const disableSubmit = useMemo(() => {
    return (
      isSubmitting ||
      !form.nickname.trim() ||
      !form.age ||
      !form.comm_level ||
      !form.personality ||
      Object.keys(fieldErrors).length > 0
    )
  }, [fieldErrors, form, isSubmitting])

  const feedback = formError ?? error

  return (
    <main className="min-h-screen bg-white px-4 py-16">
      <div className="mx-auto max-w-3xl space-y-8">
        <header className="space-y-3">
          <h1 className="text-3xl font-semibold text-slate-900">
            Create Child Profile
          </h1>
          <p className="text-slate-600">
            Provide the child&apos;s baseline information to generate a unique{' '}
            <code className="mx-1 rounded bg-slate-100 px-1 py-0.5 text-sm">
              child_id
            </code>
            . After submission the app redirects to
            <code className="mx-1 rounded bg-slate-100 px-1 py-0.5 text-sm">
              /session/new?child_id=...
            </code>
            to continue the daily session flow.
          </p>
        </header>

        <form onSubmit={handleSubmit} className="space-y-8">
          <FormError>{feedback}</FormError>

          <section className="grid gap-6 md:grid-cols-2">
            <TextInput
              label="Nickname"
              name="nickname"
              type="text"
              value={form.nickname}
              onChange={handleChange}
              placeholder="e.g., Leo"
              required
              maxLength={100}
              disabled={isSubmitting}
              error={fieldErrors.nickname ?? null}
            />

            <TextInput
              label="Age (years)"
              name="age"
              type="number"
              min={0}
              value={form.age}
              onChange={handleChange}
              placeholder="e.g., 6"
              required
              disabled={isSubmitting}
              error={fieldErrors.age ?? null}
            />

            <Select
              label="Communication Level"
              name="comm_level"
              value={form.comm_level}
              onChange={handleChange}
              placeholder="Select an option"
              options={COMM_LEVEL_OPTIONS}
              required
              disabled={isSubmitting}
              error={fieldErrors.comm_level ?? null}
            />

            <Select
              label="Personality"
              name="personality"
              value={form.personality}
              onChange={handleChange}
              placeholder="Select an option"
              options={PERSONALITY_OPTIONS}
              required
              disabled={isSubmitting}
              error={fieldErrors.personality ?? null}
            />
          </section>

          <section className="space-y-6">
            <TextArea
              label="Sensitive Topics (triggers_raw)"
              name="triggers_raw"
              rows={4}
              value={form.triggers_raw}
              onChange={handleChange}
              placeholder="e.g., Avoid hospital or doctor stories; keep the volume low."
              hint="Describe sensitive topics in full sentences. The backend will extract up to seven keywords."
              disabled={isSubmitting}
              maxLength={800}
              error={fieldErrors.triggers_raw ?? null}
            />

            <TextArea
              label="Long-term Interests (interests_raw)"
              name="interests_raw"
              rows={4}
              value={form.interests_raw}
              onChange={handleChange}
              placeholder="e.g., Dinosaurs, puzzles, blue toys help them relax."
              disabled={isSubmitting}
              maxLength={800}
              error={fieldErrors.interests_raw ?? null}
            />

            <TextArea
              label="Target Skills (target_skills_raw)"
              name="target_skills_raw"
              rows={4}
              value={form.target_skills_raw}
              onChange={handleChange}
              placeholder="e.g., Practice asking for help, taking turns, sharing the toy car."
              disabled={isSubmitting}
              maxLength={800}
              error={fieldErrors.target_skills_raw ?? null}
            />
          </section>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <button
              type="submit"
              disabled={disableSubmit}
              className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-5 py-3 text-base font-semibold text-white shadow transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:bg-slate-300"
            >
              {isSubmitting ? 'Submitting...' : 'Create Profile'}
            </button>
            <button
              type="button"
              onClick={handleReset}
              disabled={isSubmitting}
              className="inline-flex items-center justify-center rounded-lg border border-slate-300 px-5 py-3 text-base font-semibold text-slate-700 transition hover:border-slate-400 hover:bg-white disabled:cursor-not-allowed disabled:opacity-60"
            >
              Reset
            </button>
            <Link
              to="/"
              className="inline-flex items-center justify-center text-base font-semibold text-blue-600 hover:text-blue-500"
            >
              Cancel and return home
            </Link>
          </div>
        </form>
      </div>
    </main>
  )
}

export default ChildNew
