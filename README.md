# Halo

React components for the moments when someone has to trust, verify, or undo what an AI just did.

[![npm version](https://img.shields.io/npm/v/@pujamahtani/halo.svg)](https://www.npmjs.com/package/@pujamahtani/halo)
[![license](https://img.shields.io/npm/l/@pujamahtani/halo.svg)](./LICENSE)

Most AI component kits cover the chat window: message bubbles, streaming text, a prompt box. Halo covers what happens outside of it, once AI starts suggesting edits, taking actions, and running tasks across the rest of your product. It answers the questions a person asks in those moments. How sure is the model? Where did this come from? What is the agent about to do, and can I take it back?

Built with React 19 and TypeScript. It uses a neutral gray theme by default, so it adapts to your product instead of restyling it, and there is no CSS to import at runtime.

## Install

```bash
npm install @pujamahtani/halo
```

`react` and `react-dom` (v18 or newer) are peer dependencies.

## Quick start

Wrap your app once in `HaloProvider`, then use components wherever AI touches the UI.

```tsx
import { HaloProvider, ApprovalGate } from "@pujamahtani/halo";

function ReviewStep() {
  return (
    <HaloProvider>
      <ApprovalGate
        action="Reprice 3 invoices to match the updated contract rate"
        rationale="Contract v4 raised the rate from $120 to $145/hr."
        risk="high"
        confidence={0.91}
        details={[
          { label: "Invoices", value: "#1043, #1044, #1047" },
          { label: "Total delta", value: "+$1,850.00" },
        ]}
        onApprove={reprice}
        onReject={dismiss}
      />
    </HaloProvider>
  );
}
```

## The components

Twelve components, grouped by what a person needs before they will trust an AI action.

### Transparency

Understand what the model is telling you.

| Component | What it does |
|---|---|
| `ConfidenceIndicator` | How confident the model is: a score, a multi-dimension breakdown, an inline pill, or a plain disclaimer. |
| `SourceCitation` | Where the answer came from: inline superscripts, a summary pill, or a full source panel. |
| `ReasoningPanel` | The model's step-by-step thinking, shown live, collapsed, or as raw output. |
| `AIBadge` | Marks content as AI-generated or AI-assisted, with optional processing time. |

### Generation

Follow what the AI produces, and act on it.

| Component | What it does |
|---|---|
| `GenerationState` | Content being produced: a streaming caret, a skeleton, or an error with retry. |
| `SuggestionCard` | An AI edit you can take or leave: inline diff, a list with tone control, or side by side. |
| `ResponseActions` | The controls under a response: accept, dismiss, retry, copy, feedback, and follow-ups. |

### Control

Supervise agents as they act.

| Component | What it does |
|---|---|
| `AgentStatus` | A live read on the agent: idle, working, needs input, done, or failed. |
| `ApprovalGate` | A checkpoint before an agent acts, showing the action, its risk, and the context. |
| `AutonomyControl` | Set how much the agent may do on its own, from suggest-only to autonomous. |

### Reversibility

Recover when the AI is wrong.

| Component | What it does |
|---|---|
| `ActivityTimeline` | An audit log of agent activity, with per-entry undo. |
| `ActionReceipt` | Proof of what an agent changed, with a before-and-after diff and an undo. |

## Works with

- **Next.js App Router.** Components ship with a `"use client"` boundary, so you can import them from Server Components without extra setup.
- **Keyboard and assistive tech.** Interactive components are operable by keyboard (`AutonomyControl` is a full arrow-key radiogroup), keep native focus rings, and honor `prefers-reduced-motion`.
- **ESM and CommonJS**, with TypeScript types included.

## Theming

Halo ships one neutral theme and no brand colors, so it takes on your product's look. Override any token by passing a partial theme to the provider.

```tsx
<HaloProvider theme={{ colors: { text: "#111", border: "#e2e2e2" }, radius: { md: "8px" } }}>
  {children}
</HaloProvider>
```

Light and dark both ship. Import `darkTheme` and pass it in, or wire it to your own toggle.

```tsx
import { HaloProvider, darkTheme } from "@pujamahtani/halo";

<HaloProvider theme={darkTheme}>{children}</HaloProvider>
```

## Local development

```bash
npm run dev        # run the demo site
npm test           # run the component tests
npm run build:lib  # build the package into dist/
```

## Roadmap

v1 covers one agent working next to one person. Planned for v2: handoffs between a person and an agent or between agents, shared state when several agents work together, a team view of what every agent is doing, and patterns for mobile and voice.

## About

I built Halo out of patterns I kept rebuilding while designing AI features in healthcare, where someone always has to sign off on what the model suggests before it counts for anything. Those trust controls never came in a library, so every project started them again from scratch. This is the reusable version I wished I had.

MIT licensed and free to use. If you ship something with it, I would like to see it.

Built by [Puja Mahtani](https://pujamahtani.com).

## License

MIT
