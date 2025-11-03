# HRI Autism Frontend

A Vite + React + TypeScript + Tailwind CSS frontend that works with the HRI autism backend to generate daily robot interaction prompts for children.

## Routes (no-auth milestone)

- `/` – Home page with project overview and primary actions.
- `/child/new` – Create a child profile. On success the app redirects to `/session/new?child_id=<UUID>`.
- `/session/new?child_id=...` – Daily session form that submits mood, environment, and situation to generate a prompt.
- `/session/success/:sessionId` – Read-only prompt viewer with an option to start another session.
