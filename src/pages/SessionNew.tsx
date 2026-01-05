import { useCallback, useEffect, useMemo, useState } from 'react'
import type { ChangeEvent, FormEvent } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
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
  EmptyState,
  FormSection,
  LoadingOverlay,
  PageContainer,
  SectionHeader,
  StatusBanner,
  Tag,
} from '../components/ui'
import { useChildrenList, type ChildListItem } from '../hooks/useChild'
import { TopBar } from '../components/layout/TopBar'
import { heroBackgroundStyles } from '../components/ui/RobotIllustration'

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
  const {
    children,
    isLoading: isLoadingChildren,
    error: childrenError,
    hasLoaded: hasLoadedChildren,
    refresh,
  } = useChildrenList()
  const [selectedChildId, setSelectedChildId] = useState(childId || '')
  const [form, setForm] = useState<FormState>(initialState)
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({})
  const [formError, setFormError] = useState<string | null>(null)
  const { createSession, isSubmitting, error, clearError } = useSession()
  const navigate = useNavigate()

  const latestChildId = useMemo(() => {
    if (!children.length) return null
    const latest = [...children].reduce<ChildListItem | null>((acc, child) => {
      const currentTs = new Date(child.updated_at ?? child.created_at ?? 0).getTime()
      if (!acc) {
        return child
      }
      const accTs = new Date(acc.updated_at ?? acc.created_at ?? 0).getTime()
      return currentTs > accTs ? child : acc
    }, null)
    return latest?.child_id ?? children[0].child_id
  }, [children])

  useEffect(() => {
    if (isLoadingChildren || !hasLoadedChildren) return
    if (children.length === 0) {
      navigate('/child/new', { replace: true, state: { from: '/session/new' } })
      return
    }
    if (childId) {
      setSelectedChildId(childId)
      return
    }
    setSelectedChildId((prev) => {
      if (prev && children.some((child) => child.child_id === prev)) {
        return prev
      }
      return latestChildId ?? children[0].child_id
    })
  }, [childId, children, hasLoadedChildren, isLoadingChildren, latestChildId, navigate])

  const selectedChild = useMemo(
    () => children.find((child) => child.child_id === selectedChildId) ?? null,
    [children, selectedChildId],
  )

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

      if (!selectedChildId) {
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
      const wordCount = trimmedSituation ? trimmedSituation.split(/\s+/).filter(Boolean).length : 0
      if (!trimmedSituation) {
        newErrors.situation = 'Situation detail is required'
      } else if (wordCount < 4) {
        newErrors.situation = 'Please provide at least 4 words so the robot has enough context'
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
          child_id: selectedChildId,
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
    [clearError, createSession, form, navigate, selectedChildId],
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
      !selectedChildId ||
      !form.mood ||
      !form.location ||
      !form.noise ||
      !form.crowd ||
      !form.situation.trim() ||
      Object.keys(fieldErrors).length > 0
    )
  }, [fieldErrors, form, isSubmitting, selectedChildId])

  const feedback = formError ?? error ?? childrenError ?? null

  const handleChildSelect = useCallback((targetId: string) => {
    setSelectedChildId(targetId)
  }, [])

  const renderChildSummary = (child: ChildListItem) => {
    const chips = [
      { label: 'Age', value: `${child.age}` },
      { label: 'Comm', value: child.comm_level },
      { label: 'Personality', value: child.personality },
    ]

    const formatList = (value?: string) => {
      if (!value) return 'N/A'
      const items = value
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean)
      return items.length ? items.join(' • ') : 'N/A'
    }

    return (
      <div className="space-y-3 text-sm text-slate-100">
        <div>
          <p className="text-base font-semibold text-cyan-200">{child.nickname}</p>
          <div className="mt-2 flex flex-wrap gap-2">
                {chips.map((chip) => (
                  <Tag key={chip.label} variant="environment">
                {chip.label === 'Comm' ? (
                  <>
                    <span className="md:hidden">
                      Comm: {chip.value === 'medium' ? 'med' : chip.value}
                    </span>
                    <span className="hidden md:inline">
                      {chip.label}: {chip.value}
                    </span>
                  </>
                ) : chip.label === 'Personality' ? (
                  <>
                    <span className="md:hidden">
                      Pers: {chip.value === 'curious' ? 'cur' : chip.value}
                    </span>
                    <span className="hidden md:inline">
                      {chip.label}: {chip.value}
                    </span>
                  </>
                ) : (
                  `${chip.label}: ${chip.value}`
                )}
              </Tag>
            ))}
          </div>
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Interests</p>
          <p className="font-mono text-xs text-slate-300">{formatList(child.interests)}</p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Triggers</p>
          <p className="font-mono text-xs text-slate-300">{formatList(child.triggers)}</p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Target skills</p>
          <p className="font-mono text-xs text-slate-300">{formatList(child.target_skills)}</p>
        </div>
      </div>
    )
  }

  return (
    <section className={`${heroBackgroundStyles} overflow-visible min-h-screen`}>
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -left-1/3 -top-1/4 h-[60vh] w-[60vw] rounded-full bg-gradient-to-br from-cyan-400/40 via-purple-500/30 to-blue-500/40 blur-3xl" />
        <div className="absolute right-[-10%] top-1/3 h-[50vh] w-[40vw] rounded-full bg-gradient-to-br from-blue-500/40 to-purple-500/40 blur-3xl" />
      </div>
      <div className="relative z-10">
        <TopBar variant="transparent" />
        <PageContainer variant="dark" contentClassName="space-y-12" className="bg-transparent text-white">
          <SectionHeader
            tone="dark"
            align="center"
            titleClassName="text-4xl md:text-5xl"
            descriptionClassName="text-base md:text-lg"
            title={
              <>
                Create{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-blue-400 to-purple-400">
                  Daily Session
                </span>
              </>
            }
            description={
              <>
                <span className="md:hidden">Provide the child’s current situation.</span>
                <span className="hidden md:inline">
                  Provide the child’s current situation so the robot can respond empathetically.
                </span>
              </>
            }
          />

          <Card title="Selected Child" tone="dark">
            {isLoadingChildren ? (
              <LoadingOverlay tone="dark">Loading children...</LoadingOverlay>
            ) : selectedChild ? (
              renderChildSummary(selectedChild)
            ) : (
              <EmptyState
                title="No child selected"
                description="Create a child profile first so we can attach the daily session to the right person."
                tone="dark"
                actions={[
                  {
                    label: 'Create child profile',
                    href: '/child/new',
                    variant: 'primary',
                  },
                  {
                    label: 'Refresh',
                    onClick: () => refresh(),
                    variant: 'secondary',
                  },
                ]}
              />
            )}
          </Card>

          {children.length > 1 ? (
            <Card
              title="Pick a Child for Today"
              description="Choose which child new session belongs to."
              tone="dark"
            >
              <div className="grid gap-4 md:grid-cols-2">
                {children.map((child) => {
                  const isActive = child.child_id === selectedChildId
                  return (
                    <button
                      key={child.child_id}
                      type="button"
                      onClick={() => handleChildSelect(child.child_id)}
                      className={`rounded-2xl border px-4 py-4 text-left transition ${
                        isActive
                          ? 'border-cyan-300 bg-cyan-400/10 shadow-[0_0_0_1px_rgba(34,211,238,0.4)]'
                          : 'border-white/10 hover:border-cyan-200/60'
                      }`}
                    >
                      {renderChildSummary(child)}
                    </button>
                  )
                })}
              </div>
            </Card>
          ) : null}

          {selectedChild && (
            <form onSubmit={handleSubmit} className="relative space-y-10">
              {isSubmitting ? (
                <LoadingOverlay tone="dark">Generating prompt...</LoadingOverlay>
              ) : feedback ? (
                <StatusBanner variant="error">{feedback}</StatusBanner>
              ) : null}

              <FormSection
                title="Mood & Environment"
            description={
              <>
                <span className="md:hidden">Child mood and setting today.</span>
                <span className="hidden md:inline">
                  Help the robot understand how the child feels and what the setting looks like today.
                </span>
              </>
            }
            tone="dark"
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
                    tone="dark"
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
                    tone="dark"
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
                    tone="dark"
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
                    tone="dark"
                  />
                </div>
              </FormSection>

              <FormSection
                title="Situation Context"
                description="Share what happened today, any energy shifts, or specifics the robot should mention."
                tone="dark"
              >
                <TextArea
                  label="Situation"
                  name="situation"
                  rows={6}
                  maxLength={800}
                  value={form.situation}
                  onChange={handleChange}
                  placeholder="e.g., He skipped breakfast this morning and seems less focused than usual. He’s been rubbing his eyes and responding slowly. The robot should keep sentences short and allow extra time for responses."
                  hint="Provide at least 4 words, up to 800 characters."
                  disabled={isSubmitting}
                  error={fieldErrors.situation ?? null}
                  tone="dark"
                />
              </FormSection>

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <Button type="submit" loading={isSubmitting} disabled={disableSubmit}>
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
              </div>
            </form>
          )}
        </PageContainer>
      </div>
    </section>
  )
}

export default SessionNew
