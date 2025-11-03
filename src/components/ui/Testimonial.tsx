import { Card } from './Card'

export function Testimonial() {
  return (
    <section className="mx-auto max-w-4xl px-6 py-16">
      <Card className="bg-gradient-to-br from-slate-900 via-slate-900/90 to-slate-900/80 text-slate-100">
        <div className="space-y-4">
          <p className="text-lg italic text-slate-100/90">
            “The prompt captured Leo’s exhaustion after therapy perfectly. Our robot slowed down, asked softer questions, and he actually stayed engaged for 20 minutes.”
          </p>
          <div className="flex items-center gap-3 text-sm text-slate-300/80">
            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-cyan-400 to-purple-500" />
            <div>
              <p className="font-semibold text-slate-100">Maya N.</p>
              <p className="text-xs uppercase tracking-wide text-slate-400">
                Parent & co-creator
              </p>
            </div>
          </div>
        </div>
      </Card>
    </section>
  )
}
