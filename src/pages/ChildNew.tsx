import { Link } from 'react-router-dom'

function ChildNew() {
  return (
    <main className="min-h-screen bg-white px-4 py-16">
      <div className="mx-auto max-w-3xl space-y-6">
        <h1 className="text-3xl font-semibold text-slate-900">
          创建孩子档案
        </h1>
        <p className="text-slate-600">
          这里将包含孩子基础信息表单（昵称、年龄、沟通水平等）。后续会在提交成功后自动跳转到
          <code className="mx-1 rounded bg-slate-100 px-1 py-0.5 text-sm">
            /session/new?child_id=&lt;UUID&gt;
          </code>
          。
        </p>
        <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50 p-6 text-slate-500">
          表单开发中。请先在 Home 页面了解流程。
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

export default ChildNew
