import { Button } from './Button'
import { Card } from './Card'

export function CTASection() {
  return (
    <section className="bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-cyan-500/10 py-20">
      <div className="mx-auto max-w-4xl px-6">
        <Card className="bg-white/90 backdrop-blur py-12 text-center shadow-xl">
          <div className="space-y-4">
            <h2 className="text-3xl font-semibold text-slate-900">
              Ready to sync your robot with real-time empathy?
            </h2>
            <p className="text-base text-slate-600">
              Start by building a child profile or jump directly into a new session. Your robot will thank you.
            </p>
            <div className="flex flex-col justify-center gap-4 sm:flex-row">
              <Button as="link" href="/session/new" size="md">
                Start a session
              </Button>
              <Button as="link" href="/child/new" variant="secondary" size="md">
                Create child profile
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </section>
  )
}
