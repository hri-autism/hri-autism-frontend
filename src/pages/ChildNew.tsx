import { useCallback, useMemo, useState } from 'react'
import type { ChangeEvent, FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { COMM_LEVELS, PERSONALITIES } from '../lib/constants'

type FormState = {
  nickname: string
  age: string
  comm_level: string
  personality: string
  triggers_raw: string
  interests_raw: string
  target_skills_raw: string
}

const initialState: FormState = {
  nickname: '',
  age: '',
  comm_level: '',
  personality: '',
  triggers_raw: '',
  interests_raw: '',
  target_skills_raw: '',
}

function ChildNew() {
  const [form, setForm] = useState<FormState>(initialState)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
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
    (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault()
      setIsSubmitting(true)
      setError(null)

      try {
        // TODO: replace with real API call once backend integration is ready.
        const fakeChildId = 'temporary-child-id'
        navigate(`/session/new?child_id=${encodeURIComponent(fakeChildId)}`)
      } catch (submissionError) {
        console.error(submissionError)
        setError('Failed to submit the form. Please try again.')
      } finally {
        setIsSubmitting(false)
      }
    },
    [navigate],
  )

  const handleReset = useCallback(() => {
    setForm(initialState)
    setError(null)
  }, [])

  const disableSubmit = useMemo(() => {
    return (
      isSubmitting ||
      !form.nickname ||
      !form.age ||
      !form.comm_level ||
      !form.personality
    )
  }, [form, isSubmitting])

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

        {error && (
          <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          <section className="grid gap-6 md:grid-cols-2">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-slate-700" htmlFor="nickname">
                Nickname
              </label>
              <input
                id="nickname"
                name="nickname"
                type="text"
                value={form.nickname}
                onChange={handleChange}
                placeholder="e.g., Leo"
                required
                maxLength={100}
                disabled={isSubmitting}
                className="rounded-lg border border-slate-300 px-3 py-2 text-slate-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-slate-700" htmlFor="age">
                Age (years)
              </label>
              <input
                id="age"
                name="age"
                type="number"
                min={0}
                value={form.age}
                onChange={handleChange}
                placeholder="e.g., 6"
                required
                disabled={isSubmitting}
                className="rounded-lg border border-slate-300 px-3 py-2 text-slate-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-slate-700" htmlFor="comm_level">
                Communication Level
              </label>
              <select
                id="comm_level"
                name="comm_level"
                value={form.comm_level}
                onChange={handleChange}
                required
                disabled={isSubmitting}
                className="rounded-lg border border-slate-300 px-3 py-2 text-slate-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
              >
                <option value="" disabled hidden>
                  Select an option
                </option>
                {COMM_LEVELS.map((level) => (
                  <option key={level} value={level}>
                    {level.charAt(0).toUpperCase() + level.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-slate-700" htmlFor="personality">
                Personality
              </label>
              <select
                id="personality"
                name="personality"
                value={form.personality}
                onChange={handleChange}
                required
                disabled={isSubmitting}
                className="rounded-lg border border-slate-300 px-3 py-2 text-slate-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
              >
                <option value="" disabled hidden>
                  Select an option
                </option>
                {PERSONALITIES.map((item) => (
                  <option key={item} value={item}>
                    {item.charAt(0).toUpperCase() + item.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </section>

          <section className="space-y-6">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-slate-700" htmlFor="triggers_raw">
                Sensitive Topics (triggers_raw)
              </label>
              <textarea
                id="triggers_raw"
                name="triggers_raw"
                rows={4}
                value={form.triggers_raw}
                onChange={handleChange}
                placeholder="e.g., Avoid hospital or doctor stories; keep the volume low."
                disabled={isSubmitting}
                className="rounded-lg border border-slate-300 px-3 py-2 text-slate-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
              />
              <p className="text-xs text-slate-500">
                Describe sensitive topics in full sentences. The backend will extract up to seven keywords.
              </p>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-slate-700" htmlFor="interests_raw">
                Long-term Interests (interests_raw)
              </label>
              <textarea
                id="interests_raw"
                name="interests_raw"
                rows={4}
                value={form.interests_raw}
                onChange={handleChange}
                placeholder="e.g., Dinosaurs, puzzles, blue toys help them relax."
                disabled={isSubmitting}
                className="rounded-lg border border-slate-300 px-3 py-2 text-slate-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-slate-700" htmlFor="target_skills_raw">
                Target Skills (target_skills_raw)
              </label>
              <textarea
                id="target_skills_raw"
                name="target_skills_raw"
                rows={4}
                value={form.target_skills_raw}
                onChange={handleChange}
                placeholder="e.g., Practice asking for help, taking turns, sharing the toy car."
                disabled={isSubmitting}
                className="rounded-lg border border-slate-300 px-3 py-2 text-slate-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
              />
            </div>
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
