import { Card } from './Card'
import { Tag } from './Tag'

const features = [
  {
    title: 'Personalized prompts',
    description:
      'OpenAI-backed keyword filtering distills raw parent notes into structured robot instructions.',
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
    <section className="mx-auto grid max-w-6xl gap-6 px-6 py-16 md:grid-cols-3">
      {features.map((feature) => (
        <Card
          key={feature.title}
          title={feature.title}
          description={feature.description}
          className="bg-white/80 backdrop-blur-sm transition hover:-translate-y-1 hover:shadow-xl"
        >
          <Tag variant="info">{feature.tag}</Tag>
        </Card>
      ))}
    </section>
  )
}
