import { useCallback, useMemo, useState } from 'react'
import type { ChangeEvent, FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { COMM_LEVELS, PERSONALITIES } from '../lib/constants'
import { useChild, useChildrenList, type ChildListItem } from '../hooks/useChild'
import { Select, TextArea, TextInput } from '../components/form'
import {
  Button,
  Card,
  LoadingOverlay,
  FormSection,
  PageContainer,
  SectionHeader,
  StatusBanner,
  Tag,
  buttonClasses,
  EmptyState,
} from '../components/ui'

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
  const {
    children,
    isLoading: childrenLoading,
    error: childrenError,
  } = useChildrenList()
  const navigate = useNavigate()
  const hasChildren = children.length > 0

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

      const triggersTrimmed = form.triggers_raw.trim()
      const interestsTrimmed = form.interests_raw.trim()
      const skillsTrimmed = form.target_skills_raw.trim()

      if (!triggersTrimmed) {
        newErrors.triggers_raw = 'Sensitive topics are required'
      } else if (triggersTrimmed.length > 800) {
        newErrors.triggers_raw = 'Sensitive topics must be 800 characters or less'
      }

      if (!interestsTrimmed) {
        newErrors.interests_raw = 'Long-term interests are required'
      } else if (interestsTrimmed.length > 800) {
        newErrors.interests_raw = 'Long-term interests must be 800 characters or less'
      }

      if (!skillsTrimmed) {
        newErrors.target_skills_raw = 'Target skills are required'
      } else if (skillsTrimmed.length > 800) {
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
          triggers_raw: triggersTrimmed,
          interests_raw: interestsTrimmed,
          target_skills_raw: skillsTrimmed,
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
      !form.triggers_raw.trim() ||
      !form.interests_raw.trim() ||
      !form.target_skills_raw.trim() ||
      Object.keys(fieldErrors).length > 0
    )
  }, [fieldErrors, form, isSubmitting])

  const feedback = formError ?? error

  const renderChildCard = useCallback(
    (child: ChildListItem) => (
      <Card key={child.child_id} tone="dark" title={child.nickname}>
        <div className="space-y-3 text-sm text-slate-100">
          <div className="flex flex-wrap gap-2">
            <Tag variant="environment">Age: {child.age}</Tag>
            <Tag variant="environment">Comm: {child.comm_level}</Tag>
            <Tag variant="environment">Personality: {child.personality}</Tag>
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
              Interests
            </p>
            <p className="font-mono text-xs text-slate-300 break-words">
              {child.interests ? child.interests.split(',').join(' • ') : 'N/A'}
            </p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
              Triggers
            </p>
            <p className="font-mono text-xs text-slate-300 break-words">
              {child.triggers ? child.triggers.split(',').join(' • ') : 'N/A'}
            </p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
              Target skills
            </p>
            <p className="font-mono text-xs text-slate-300 break-words">
              {child.target_skills ? child.target_skills.split(',').join(' • ') : 'N/A'}
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              to={`/session/new?child_id=${encodeURIComponent(child.child_id)}`}
              className={buttonClasses({ size: 'sm' })}
            >
              Create session
            </Link>
          </div>
        </div>
      </Card>
    ),
    [],
  )

  return (
    <PageContainer variant="dark" contentClassName="space-y-12">
      <SectionHeader
        tone="dark"
        title="Create Child Profile"
        description={
          <span className="inline-flex items-center gap-2 whitespace-nowrap text-slate-300">
            <span>Provide the child&apos;s baseline information to generate a unique</span>
            <span className="rounded-full border border-cyan-400/40 bg-cyan-400/10 px-3 py-1 text-xs uppercase tracking-[0.25em] text-cyan-200">
              child_id
            </span>
            <span>and reuse it for every future session.</span>
          </span>
        }
      />

      {childrenLoading ? (
        <StatusBanner variant="loading">Loading existing child profiles...</StatusBanner>
      ) : childrenError ? (
        <StatusBanner variant="error">{childrenError}</StatusBanner>
      ) : hasChildren ? (
        <div className="space-y-4">
          <div>
            <h2 className="text-lg font-semibold text-white">Existing children</h2>
            <p className="text-sm text-slate-400">
              Review current profiles before adding another.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            {children.map((child) => renderChildCard(child))}
          </div>
        </div>
      ) : (
        <EmptyState
          tone="dark"
          title="No child profiles yet"
          description="Fill out the form below to create your first child profile. We’ll automatically take you to the session flow afterward."
        />
      )}

      <form onSubmit={handleSubmit} className="relative space-y-10">
        {isSubmitting ? (
          <LoadingOverlay tone="dark">
            Creating child profile...
          </LoadingOverlay>
        ) : feedback ? (
          <StatusBanner variant="error">{feedback}</StatusBanner>
        ) : null}

      <FormSection
        title="Child basics"
        description="Nickname, age, communication level and personality help tailor the robot's tone."
        tone="dark"
        className="shadow-[0_30px_80px_rgba(56,189,248,0.12)]"
      >
          <div className="grid gap-6 md:grid-cols-2">
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
              tone="dark"
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
              tone="dark"
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
              tone="dark"
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
              tone="dark"
            />
          </div>
        </FormSection>

        <FormSection
          title="Long-form context"
          description="Required narratives that feed the child model and regenerate prompts when needed."
          tone="dark"
          className="shadow-[0_30px_80px_rgba(56,189,248,0.12)]"
        >
          <div className="space-y-6">
            <TextArea
              label="Sensitive Topics"
              name="triggers_raw"
              rows={4}
              value={form.triggers_raw}
              onChange={handleChange}
              placeholder="e.g., Avoid hospital or doctor stories; keep the volume low."
              hint="Describe sensitive topics in full sentences. The backend will extract up to seven keywords."
              disabled={isSubmitting}
              maxLength={800}
              error={fieldErrors.triggers_raw ?? null}
              required
              tone="dark"
            />

            <TextArea
              label="Long-term Interests"
              name="interests_raw"
              rows={4}
              value={form.interests_raw}
              onChange={handleChange}
              placeholder="e.g., Dinosaurs, puzzles, blue toys help them relax."
              disabled={isSubmitting}
              maxLength={800}
              error={fieldErrors.interests_raw ?? null}
              required
              tone="dark"
            />

            <TextArea
              label="Target Skills"
              name="target_skills_raw"
              rows={4}
              value={form.target_skills_raw}
              onChange={handleChange}
              placeholder="e.g., Practice asking for help, taking turns, sharing the toy car."
              disabled={isSubmitting}
              maxLength={800}
              error={fieldErrors.target_skills_raw ?? null}
              required
              tone="dark"
            />
          </div>
        </FormSection>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <Button type="submit" loading={isSubmitting} disabled={disableSubmit}>
            Create Profile
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={handleReset}
            disabled={isSubmitting}
          >
            Reset
          </Button>
          <Link to="/" className={buttonClasses({ variant: 'ghost' })}>
            Cancel and return home
          </Link>
        </div>
      </form>
    </PageContainer>
  )
}

export default ChildNew
