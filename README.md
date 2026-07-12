# Halo

**A trust layer for AI interfaces.** Twelve React components that help people understand, verify, and control AI as it works and acts inside a product, not just inside a chat.

Most AI component kits stop at the chat bubble. Halo covers the other layer: the trust signals that live *inside* a product once AI starts suggesting, drafting, and taking actions on a user's behalf. How confident is the model? Where did this come from? What is the agent about to do, and can I undo it? Halo gives you a consistent, themeable set of primitives for exactly those questions.

Built with React 19 and TypeScript. Neutral by default, themeable through a single provider. No Tailwind or CSS import required at runtime.

## Why Halo

AI moved out of the chat window and into the product. Agents now triage, draft, edit, and act. But the UI for *trusting* those actions never caught up, so every team rebuilds confidence badges, source citations, approval gates, and undo logs from scratch. Halo is that missing layer, organized around the four things trust needs:

- **Transparency** — understand the AI: `ConfidenceIndicator`, `SourceCitation`, `ReasoningPanel`, `AIBadge`
- **Generation** — follow what the AI produces: `GenerationState`, `SuggestionCard`, `ResponseActions`
- **Control** — supervise the AI: `AgentStatus`, `ApprovalGate`, `AutonomyControl`
- **Reversibility** — recover when it is wrong: `ActivityTimeline`, `ActionReceipt`

## Install

```bash
npm install @pujamahtani/halo
```

`react` and `react-dom` (v18+) are peer dependencies.

## Usage

Wrap your app once in `HaloProvider`, then drop components in wherever AI touches the UI.

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

## Compatibility & accessibility

- **Next.js App Router** — components ship with the `"use client"` boundary, so you can import them into Server Components without extra wiring.
- **Accessible** — interactive components are keyboard operable (the `AutonomyControl` is a full arrow-key radiogroup), preserve native focus rings, and respect `prefers-reduced-motion`.
- **ESM + CJS** — ships both, with complete TypeScript types.
- **No runtime CSS import** — styles are inline and theme-driven; nothing to import or configure.

## Components

| Component | What it does |
|---|---|
| `ConfidenceIndicator` | How confident the model is: score, multi-dimension breakdown, inline pill, or disclaimer. |
| `SourceCitation` | Where the answer came from: inline superscripts, a summary pill, or a full source panel. |
| `ReasoningPanel` | The model's step-by-step thinking: live, collapsed summary, or raw output. |
| `AIBadge` | Labels content as AI-generated, with optional processing time. |
| `GenerationState` | Content being produced: streaming caret, skeleton, or graceful error with retry. |
| `SuggestionCard` | AI edits: inline text diff, suggestion list with tone control, or side-by-side. |
| `ResponseActions` | Controls for a response: accept/dismiss/copy, context actions, feedback, follow-ups. |
| `AgentStatus` | Live agent state: idle, working, needs input, done, or failed. Row and pill. |
| `ApprovalGate` | A human-in-the-loop checkpoint before an agent acts, with risk, context, and confidence. |
| `AutonomyControl` | Progressive delegation: suggest-only, ask-first, or autonomous. |
| `ActivityTimeline` | An audit log of agent activity, with per-entry undo. |
| `ActionReceipt` | Post-action proof of what changed, with a before/after diff and undo. |

## Theming

Halo ships a neutral gray theme with no brand colors, so it adapts to your product instead of fighting it. Override any part by passing a partial `theme` to the provider.

```tsx
<HaloProvider theme={{ colors: { text: "#111", border: "#e2e2e2" }, radius: { md: "8px" } }}>
  {children}
</HaloProvider>
```

### Light and dark

Halo ships both. Import `darkTheme` and pass it to the provider, or wire it to your own toggle.

```tsx
import { HaloProvider, darkTheme } from "@pujamahtani/halo";

<HaloProvider theme={darkTheme}>{children}</HaloProvider>
```

## Scripts

```bash
npm run dev        # run the demo showcase
npm run build:lib  # build the publishable library (dist/ + types)
npm test           # run the component test suite
npm run lint       # oxlint
```

## Roadmap (v2)

Handoff states (agent to human, agent to agent), multi-agent coordination and shared-state visibility, a team-level observability dashboard, and mobile/voice surfaces.

## About

Halo grew out of patterns I kept rebuilding while designing AI features in healthcare, where a person always has to trust, verify, or override what the model says. It is open source, MIT licensed, and free to use.

Built by [Puja Mahtani](https://pujamahtani.com).
