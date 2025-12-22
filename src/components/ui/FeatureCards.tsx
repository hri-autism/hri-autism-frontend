import { Card } from './Card'
import { Tag } from './Tag'

const features = [
  {
    title: 'Personalized prompts',
    description:
      'AI-backed keyword filtering distills raw parent notes into structured robot instructions.',
    tag: 'Context aware',
  },
  {
    title: 'Emotion & environment cues',
    description:
      'Mood labels, sound levels, and crowd density combine to tailor interaction pacing and tone.',
    tag: 'Sensory friendly',
  },
  {
    title: 'Co-create with specialists',
    description:
      'Share child profiles with therapists so robot scripts stay aligned with therapy goals.',
    tag: 'Team collaboration',
  },
]

export function FeatureCards() {
  return (
    <section
      id="features"
      className="mx-auto hidden max-w-6xl grid-cols-1 gap-6 px-6 py-16 md:grid md:grid-cols-3"
    >
      {features.map((feature) => (
        <Card
          key={feature.title}
          title={feature.title}
          description={feature.description}
          tone="dark"
          className="border-cyan-400/15 bg-slate-900/60 backdrop-blur-lg shadow-[0_20px_70px_rgba(8,23,53,0.65)] transition hover:-translate-y-1 hover:border-cyan-300/40 hover:shadow-[0_35px_120px_rgba(56,189,248,0.25)]"
        >
          <Tag variant="glow">{feature.tag}</Tag>
        </Card>
      ))}
    </section>
  )
}
