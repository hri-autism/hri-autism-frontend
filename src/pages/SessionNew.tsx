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
import { Select, TextArea } from '../components/form'
import {
  Button,
  Card,
  FormSection,
  PageContainer,
  SectionHeader,
  StatusBanner,
  buttonClasses,
} from '../components/ui'

type FormState = {
  mood: string
  location: string
  noise: string
  crowd: string
  situation: string
}

type FieldErrors = Partial<Record<keyof FormState, string>>

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

const MOOD_OPTIONS = MOODS.map((value) => ({
  value,
  label: humanize(value),
}))

const LOCATION_OPTIONS = ENVIRONMENT_LOCATIONS.map((value) => ({
  value,
  label: humanize(value),
}))

const NOISE_OPTIONS = ENVIRONMENT_NOISE.map((value) => ({
  value,
  label: humanize(value),
}))

const CROWD_OPTIONS = ENVIRONMENT_CROWD.map((value) => ({
  value,
  label: humanize(value),
}))

function SessionNew() {
  const [searchParams] = useSearchParams()
  const childId = searchParams.get('child_id')?.trim() ?? ''

  const [form, setForm] = useState<FormState>(initialState)
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({})
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

      if (!childId) {
        setFieldErrors({})
        setFormError('Missing child_id. Please create a child profile first.')
        return
      }

      const newErrors: FieldErrors = {}

      if (!form.mood) {
        newErrors.mood = 'Select the child\'s current mood'
      }

      if (!form.location) {
        newErrors.location = 'Select a location context'
      }

      if (!form.noise) {
        newErrors.noise = 'Select the noise level'
      }

      if (!form.crowd) {
        newErrors.crowd = 'Select the crowd density'
      }

      const trimmedSituation = form.situation.trim()
      if (!trimmedSituation) {
        newErrors.situation = 'Situation detail is required'
      } else if (trimmedSituation.length < 20) {
        newErrors.situation = 'Please provide at least 20 characters so the robot has enough context'
      } else if (trimmedSituation.length > 800) {
        newErrors.situation = 'Situation must be 800 characters or less'
      }

      if (Object.keys(newErrors).length > 0) {
        setFieldErrors(newErrors)
        setFormError('Please correct the highlighted fields.')
        return
      }

      setFieldErrors({})
      setFormError(null)

      try {
        const session = await createSession({
          child_id: childId,
          mood: form.mood,
          environment: [form.location, form.noise, form.crowd].join(','),
          situation: trimmedSituation,
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
    setFieldErrors({})
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
      !form.situation.trim() ||
      Object.keys(fieldErrors).length > 0
    )
  }, [childId, fieldErrors, form, isSubmitting])

  const feedback = formError ?? error

  return (
    <PageContainer>
      <SectionHeader
        title="Create Daily Session"
        description="Provide the child’s current mood, environment, and situation so the backend can generate an actionable prompt."
      />

      <Card
        title="Selected child"
        description="Sessions are tied to an existing child profile."
      >
        <div className="space-y-3 text-sm text-slate-700">
          <div>
            <p className="text-xs uppercase tracking-wide text-slate-500">
              child_id
            </p>
            <p className="font-mono text-base text-slate-900">
              {childId || 'Not provided'}
            </p>
          </div>
          {!childId && (
            <p>
              Please{' '}
              <Link
                to="/child/new"
                className="font-semibold text-blue-600 hover:text-blue-500"
              >
                create a child profile
              </Link>{' '}
              before starting a session.
            </p>
          )}
        </div>
      </Card>

      {childId && (
        <form onSubmit={handleSubmit} className="space-y-8">
          {isSubmitting ? (
            <StatusBanner variant="loading">Generating prompt...</StatusBanner>
          ) : feedback ? (
            <StatusBanner variant="error">{feedback}</StatusBanner>
          ) : null}

          <FormSection
            title="Mood & environment"
            description="Help the robot understand how the child feels and what the setting looks like today."
          >
            <div className="grid gap-6 md:grid-cols-2">
              <Select
                label="Mood"
                name="mood"
                value={form.mood}
                onChange={handleChange}
                placeholder="Select an option"
                options={MOOD_OPTIONS}
                disabled={isSubmitting}
                error={fieldErrors.mood ?? null}
              />

              <Select
                label="Location"
                name="location"
                value={form.location}
                onChange={handleChange}
                placeholder="Select an option"
                options={LOCATION_OPTIONS}
                disabled={isSubmitting}
                error={fieldErrors.location ?? null}
              />

              <Select
                label="Noise Level"
                name="noise"
                value={form.noise}
                onChange={handleChange}
                placeholder="Select an option"
                options={NOISE_OPTIONS}
                disabled={isSubmitting}
                error={fieldErrors.noise ?? null}
              />

              <Select
                label="Crowd Density"
                name="crowd"
                value={form.crowd}
                onChange={handleChange}
                placeholder="Select an option"
                options={CROWD_OPTIONS}
                disabled={isSubmitting}
                error={fieldErrors.crowd ?? null}
              />
            </div>
          </FormSection>

          <FormSection
            title="Situation context"
            description="Share what happened today, any energy shifts, or specifics the robot should mention."
          >
            <TextArea
              label="Situation"
              name="situation"
              rows={6}
              maxLength={800}
              value={form.situation}
              onChange={handleChange}
              placeholder="Describe today's context in full sentences (<= 800 characters)."
              hint="Focus on temporary context, energy level, recent events, or anything the robot should know today."
              disabled={isSubmitting}
              error={fieldErrors.situation ?? null}
            />
          </FormSection>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <Button
              type="submit"
              variant="primary"
              loading={isSubmitting}
              disabled={disableSubmit}
            >
              Generate Prompt
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={handleReset}
              disabled={isSubmitting}
            >
              Reset
            </Button>
            <Link to="/" className={buttonClasses('ghost')}>
              Cancel and return home
            </Link>
          </div>
        </form>
      )}
    </PageContainer>
  )
}

export default SessionNew
