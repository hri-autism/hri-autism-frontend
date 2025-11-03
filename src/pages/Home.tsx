import { Link } from 'react-router-dom'

function Home() {
  return (
    <main className="min-h-screen bg-slate-100 flex items-center justify-center px-4 py-16">
      <div className="max-w-2xl text-center space-y-8">
        <h1 className="text-4xl font-bold text-slate-900">
          Autism Session Companion
        </h1>
        <p className="text-lg text-slate-600">
          为孩子快速生成社交机器人引导词。先建立儿童档案，再根据当天情况生成专属提示。
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/child/new"
            className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-5 py-3 text-base font-semibold text-white shadow hover:bg-blue-500 transition"
          >
            创建孩子档案
          </Link>
          <Link
            to="/session/new"
            className="inline-flex items-center justify-center rounded-lg border border-slate-300 px-5 py-3 text-base font-semibold text-slate-700 hover:border-slate-400 hover:bg-white transition"
          >
            已有 child_id? 开始新会话
          </Link>
        </div>
      </div>
    </main>
  )
}

export default Home
