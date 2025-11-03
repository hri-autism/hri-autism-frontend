# HRI Autism Frontend

基于 Vite + React + TypeScript + Tailwind CSS 的前端项目，用于配合后端生成儿童社交机器人会话提示。

## 开发

```bash
npm install
npm run dev
```

默认开发地址：http://localhost:5173

## 环境变量

- `VITE_API_BASE`：后端 FastAPI 服务地址，配置在 `.env.local`。

## 页面结构（无登录阶段）

- `/`：Home，项目简介与操作入口。
- `/child/new`：创建孩子档案，提交成功后将带着 `child_id` 跳转到会话页面。
- `/session/new?child_id=...`：填写当天 session 信息并触发 prompt 生成。
- `/session/success/:sessionId`：展示生成成功的只读 prompt，并提供再次创建会话按钮。

后续将逐步接入实际表单、API 请求、表单校验和登录功能。
