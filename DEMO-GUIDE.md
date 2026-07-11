# Dev-Loop — Getting Started

This repo runs an autonomous multi-agent dev loop: an Orchestrator agent plans work,
gets your approval, then hands tasks to Frontend, Backend, and QA agents in sequence.

The default application architecture is a Next.js App Router frontend in `frontend/`,
a Node.js API in `backend/`, and a database used by the backend. Next.js is built on
React, so React components continue to work, but Vite-specific configuration and
`import.meta.env` variables do not.

## 1. Set up your project

- Fill in `docs/PRD.md` with your actual product requirements.
- Add tasks to `.plan/000-backlog.md` (one line per task, optional `| figma:<url>`).
- If you use Figma, add your file URL per task or set a default via `FIGMA_URL` / `--figma`.
- If you use Linear for ticket tracking, set `LINEAR_API_KEY` and `LINEAR_TEAM_ID`
  (or `--linear-key` / `--linear-team`). Without these, tickets are simulated locally.

## 2. Install dependencies

```bash
npm install
```

## 3. Run the orchestrator

```bash
node dev-loop.js \
  --figma "YOUR_FIGMA_URL" \
  --linear-team "YOUR_TEAM_ID" \
  --linear-key "YOUR_API_KEY"
```

Flags are optional — omit `--figma` if you don't use Figma, and omit the Linear flags
to run with simulated tickets and terminal-only approval gates.

The orchestrator will, per backlog task:
1. Read the PRD and (optionally) relevant Figma frames.
2. Write an implementation plan to `.plan/` and **pause for your approval**.
3. Create tickets (Linear or simulated).
4. Launch the Frontend agent, then the Backend agent, then the QA agent.
5. Pause again for final approval before marking the task done.

## 4. Watch a single agent live (optional)

`trace-agent.js` runs one agent with streaming tool-call output, useful for demos
or debugging what an agent is actually doing:

```bash
node trace-agent.js --task "describe the task" \
  [--system-prompt agents/frontend/CLAUDE.md] [--role frontend]
```

## Human checkpoints

- **Plan approval** — nothing gets built until you type `APPROVED` (or move the
  ticket in Linear, if configured).
- **Final approval** — after QA reports done, you approve again before the task
  is marked complete in the backlog.

## Agent roles and boundaries

- `agents/orchestrator/CLAUDE.md` — plans and coordinates, never writes app code.
- `agents/frontend/CLAUDE.md` — owns the UI and defines the API contract.
- `agents/backend/CLAUDE.md` — implements exactly what the API contract says.
- `agents/qa/CLAUDE.md` — validates against the PRD's acceptance criteria.

Update the "Stack" section in each `agents/*/CLAUDE.md` file to match your project's
actual tech choices — they ship with reasonable placeholders, not hard requirements.
The supplied frontend-agent default is Next.js App Router; use `NEXT_PUBLIC_API_URL`
for browser-visible API configuration and keep private values server-side.
File-boundary enforcement (frontend agent can't touch backend files, etc.) is done
via `.claude/hooks/enforce-agent-boundaries.js`, keyed off the `frontend/` and
`backend/` directory convention — adjust those paths if your project layout differs.

## Troubleshooting

| Problem | Fix |
|---------|-----|
| `claude CLI not found` | Script falls back to simulated agent output |
| Linear API error | Omit `--linear-key` — script simulates tickets |
| Frontend tests fail | Run tests directly in `frontend/` to see which one |
| Port already in use | `npx kill-port <port>` |
