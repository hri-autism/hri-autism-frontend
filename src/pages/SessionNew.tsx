import { Link, useSearchParams } from 'react-router-dom'

function SessionNew() {
  const [searchParams] = useSearchParams()
  const childId = searchParams.get('child_id')

  return (
    <main className="min-h-screen bg-white px-4 py-16">
      <div className="mx-auto max-w-3xl space-y-6">
        <header className="space-y-2">
          <h1 className="text-3xl font-semibold text-slate-900">
            创建当天会话
          </h1>
          <p className="text-slate-600">
            提交 mood、environment、situation 后端会生成专属 prompt 并返回 session
            ID。
          </p>
        </header>

        <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50 p-6 text-slate-600 space-y-4">
          <p>
            child_id:{' '}
            <span className="font-mono text-slate-800">
              {childId ?? '未提供'}
            </span>
          </p>
          {childId ? (
            <p>后续会在此渲染会话表单并提交到后端。</p>
          ) : (
            <p>
              请先
              <Link
                to="/child/new"
                className="mx-1 text-blue-600 hover:text-blue-500 font-medium"
              >
                创建孩子档案
              </Link>
              获取 child_id。
            </p>
          )}
        </div>

        <div>
          <Link
            to="/"
            className="text-blue-600 hover:text-blue-500 font-medium"
          >
            返回首页
          </Link>
        </div>
      </div>
    </main>
  )
}

export default SessionNew
