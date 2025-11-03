import { useCallback, useMemo, useState } from 'react'
import type { ChangeEvent, FormEvent } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import {
  ENVIRONMENT_CROWD,
  ENVIRONMENT_LOCATIONS,
  ENVIRONMENT_NOISE,
  MOODS,
} from '../lib/constants'
import { useSession } from '../hooks/useSession'

type FormState = {
  mood: string
  location: string
  noise: string
  crowd: string
  situation: string
}

const initialState: FormState = {
  mood: '',
  location: '',
  noise: '',
  crowd: '',
  situation: '',
}

function humanize(option: string) {
  return option
    .split('_')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ')
}

function SessionNew() {
  const [searchParams] = useSearchParams()
  const childId = searchParams.get('child_id')?.trim() ?? ''

  const [form, setForm] = useState<FormState>(initialState)
  const [formError, setFormError] = useState<string | null>(null)
  const { createSession, isSubmitting, error, clearError } = useSession()
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
    },
    [],
  )

  const handleSubmit = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault()
      setFormError(null)
      clearError()

      if (!childId) {
        setFormError('Missing child_id. Please create a child profile first.')
        return
      }

      if (!form.mood) {
        setFormError('Mood is required')
        return
      }

      if (!form.location || !form.noise || !form.crowd) {
        setFormError('Environment selections are required')
        return
      }

      if (!form.situation.trim()) {
        setFormError('Situation detail is required')
        return
      }

      try {
        const session = await createSession({
          child_id: childId,
          mood: form.mood,
          environment: [form.location, form.noise, form.crowd].join(','),
          situation: form.situation.trim(),
        })
        navigate(`/session/success/${session.session_id}`)
      } catch (submissionError) {
        console.error(submissionError)
        if (submissionError instanceof Error) {
          setFormError(submissionError.message)
        } else {
          setFormError('Failed to submit the form. Please try again.')
        }
      }
    },
    [childId, clearError, createSession, form, navigate],
  )

  const handleReset = useCallback(() => {
    setForm(initialState)
    setFormError(null)
    clearError()
  }, [clearError])

  const disableSubmit = useMemo(() => {
    return (
      isSubmitting ||
      !childId ||
      !form.mood ||
      !form.location ||
      !form.noise ||
      !form.crowd ||
      !form.situation.trim()
    )
  }, [childId, form, isSubmitting])

  const feedback = formError ?? error

  return (
    <main className="min-h-screen bg-white px-4 py-16">
      <div className="mx-auto max-w-3xl space-y-8">
        <header className="space-y-3">
          <h1 className="text-3xl font-semibold text-slate-900">
            Create Daily Session
          </h1>
          <p className="text-slate-600">
            Submit the child&apos;s current mood, environment, and situation to generate a tailored prompt.
          </p>
        </header>

        <section className="rounded-lg border border-slate-200 bg-slate-50 p-6 text-slate-700">
          <p className="text-sm uppercase tracking-wide text-slate-500">
            child_id
          </p>
          <p className="font-mono text-base text-slate-900">
            {childId || 'Not provided'}
          </p>
          {!childId && (
            <p className="mt-3 text-sm">
              Please
              <Link
                to="/child/new"
                className="mx-1 font-semibold text-blue-600 hover:text-blue-500"
              >
                create a child profile
              </Link>
              before starting a session.
            </p>
          )}
        </section>

        {childId && (
          <form onSubmit={handleSubmit} className="space-y-8">
            {feedback && (
              <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {feedback}
              </div>
            )}

            <section className="grid gap-6 md:grid-cols-2">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-slate-700" htmlFor="mood">
                  Mood
                </label>
                <select
                  id="mood"
                  name="mood"
                  value={form.mood}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  className="rounded-lg border border-slate-300 px-3 py-2 text-slate-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                >
                  <option value="" disabled hidden>
                    Select an option
                  </option>
                  {MOODS.map((mood) => (
                    <option key={mood} value={mood}>
                      {humanize(mood)}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-slate-700" htmlFor="location">
                  Location
                </label>
                <select
                  id="location"
                  name="location"
                  value={form.location}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  className="rounded-lg border border-slate-300 px-3 py-2 text-slate-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                >
                  <option value="" disabled hidden>
                    Select an option
                  </option>
                  {ENVIRONMENT_LOCATIONS.map((option) => (
                    <option key={option} value={option}>
                      {humanize(option)}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-slate-700" htmlFor="noise">
                  Noise Level
                </label>
                <select
                  id="noise"
                  name="noise"
                  value={form.noise}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  className="rounded-lg border border-slate-300 px-3 py-2 text-slate-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                >
                  <option value="" disabled hidden>
                    Select an option
                  </option>
                  {ENVIRONMENT_NOISE.map((option) => (
                    <option key={option} value={option}>
                      {humanize(option)}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-slate-700" htmlFor="crowd">
                  Crowd Density
                </label>
                <select
                  id="crowd"
                  name="crowd"
                  value={form.crowd}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  className="rounded-lg border border-slate-300 px-3 py-2 text-slate-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                >
                  <option value="" disabled hidden>
                    Select an option
                  </option>
                  {ENVIRONMENT_CROWD.map((option) => (
                    <option key={option} value={option}>
                      {humanize(option)}
                    </option>
                  ))}
                </select>
              </div>
            </section>

            <section className="space-y-6">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-slate-700" htmlFor="situation">
                  Situation
                </label>
                <textarea
                  id="situation"
                  name="situation"
                  rows={6}
                  maxLength={800}
                  value={form.situation}
                  onChange={handleChange}
                  placeholder="Describe today's context in full sentences (<= 800 characters)."
                  disabled={isSubmitting}
                  className="rounded-lg border border-slate-300 px-3 py-2 text-slate-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                />
                <p className="text-xs text-slate-500">
                  Focus on temporary context, energy level, recent events, or anything the robot should know today.
                </p>
              </div>
            </section>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <button
                type="submit"
                disabled={disableSubmit}
                className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-5 py-3 text-base font-semibold text-white shadow transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:bg-slate-300"
              >
                {isSubmitting ? 'Submitting...' : 'Generate Prompt'}
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
        )}
      </div>
    </main>
  )
}

export default SessionNew
