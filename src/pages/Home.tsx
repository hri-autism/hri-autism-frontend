import { TopBar } from '../components/layout/TopBar'
import { Hero } from '../components/ui/Hero'
import { CTASection } from '../components/ui/CTASection'
import { FeatureCards } from '../components/ui/FeatureCards'
import { WorkflowTimeline } from '../components/ui/WorkflowTimeline'

function Home() {
  return (
    <div className="text-white">
      <Hero topSlot={<TopBar variant="transparent" />} />
      <section className="relative overflow-hidden bg-gradient-to-b from-[#0F2338] via-[#0C2641] to-[#0A1F36]">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_10%,rgba(56,189,248,0.16),transparent_55%),radial-gradient(circle_at_85%_12%,rgba(139,92,246,0.14),transparent_55%)]" />
        <div className="relative">
          <FeatureCards />
          <WorkflowTimeline />
        </div>
      </section>
      <CTASection />
    </div>
  )
}

export default Home
