import { Hero } from '../components/ui/Hero'
import { FeatureCards } from '../components/ui/FeatureCards'
import { WorkflowTimeline } from '../components/ui/WorkflowTimeline'
import { AboutMetrics } from '../components/ui/AboutMetrics'
import { Testimonial } from '../components/ui/Testimonial'
import { CTASection } from '../components/ui/CTASection'

function Home() {
  return (
    <div className="bg-slate-950 text-white">
      <Hero />
      <FeatureCards />
      <WorkflowTimeline />
      <AboutMetrics />
      <Testimonial />
      <CTASection />
    </div>
  )
}

export default Home
