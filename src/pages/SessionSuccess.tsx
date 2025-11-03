import { Link, useParams } from 'react-router-dom'

function SessionSuccess() {
  const { sessionId } = useParams<{ sessionId: string }>()

  return (
    <main className="min-h-screen bg-white px-4 py-16">
      <div className="mx-auto max-w-3xl space-y-6">
        <h1 className="text-3xl font-semibold text-slate-900">
          Prompt 已生成
        </h1>
        <p className="text-slate-600">
          下面位置将展示后端返回的 prompt（只读）。支持刷新页面通过
          session_id 重新获取。
        </p>

        <div className="rounded-lg border border-slate-200 bg-slate-50 p-6 space-y-4">
          <p className="text-sm uppercase tracking-wide text-slate-500">
            session_id
          </p>
          <p className="font-mono text-lg text-slate-800 break-all">
            {sessionId ?? '未提供'}
          </p>
          <div className="rounded border border-dashed border-slate-300 bg-white p-4 text-slate-500">
            Prompt 内容展示区域（待接入后端）
          </div>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <Link
            to="/session/new"
            className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-5 py-3 text-base font-semibold text-white shadow hover:bg-blue-500 transition"
          >
            再次创建会话
          </Link>
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-lg border border-slate-300 px-5 py-3 text-base font-semibold text-slate-700 hover:border-slate-400 hover:bg-white transition"
          >
            返回首页
          </Link>
        </div>
      </div>
    </main>
  )
}

export default SessionSuccess
