# Autism Companion Frontend
Generating daily robot interaction prompts for autism children.  

Vite + React + TypeScript + Tailwind UI for the Frontend.

## Routes

- `/` – Landing page (hero, CTA, workflow steps).
- `/dashboard` – Authenticated home showing user info + child cards + latest sessions.
- `/login`, `/register` – Auth flows (JWT, LoadingOverlay states).
- `/child/new` – Create child profiles and review existing ones.
- `/session/new` – Daily session form (auto-select latest child, picker when many).
- `/session/success/:id` – Prompt recap page for the created session.
