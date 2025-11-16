import { Hero } from '../components/ui/Hero'
import { CTASection } from '../components/ui/CTASection'
import { FeatureCards } from '../components/ui/FeatureCards'
import { WorkflowTimeline } from '../components/ui/WorkflowTimeline'

function Home() {
  return (
    <div className="bg-slate-950 text-white">
      <Hero />
      <FeatureCards />
      <WorkflowTimeline />
      <CTASection />
    </div>
  )
}

export default Home
