# Halo

Trust and control components for AI features. Twelve React components for the parts of a product where a person has to understand, check, or undo what an AI did.

[![npm version](https://img.shields.io/npm/v/@pujamahtani/halo.svg)](https://www.npmjs.com/package/@pujamahtani/halo)
[![license](https://img.shields.io/npm/l/@pujamahtani/halo.svg)](./LICENSE)
[![types](https://img.shields.io/npm/types/@pujamahtani/halo.svg)](https://www.npmjs.com/package/@pujamahtani/halo)

## Why Halo

AI in products used to live in a chat window, so the interface patterns that came with it (message bubbles, streaming text, a prompt box) were built for chat. Most AI component libraries still cover that surface.

The work has moved. AI now suggests edits, runs tasks, and takes actions across the rest of the product, not only inside a conversation. When it does, a person needs to answer a few practical questions right where the action happens: how confident is the model, where did this come from, what is the agent about to do, and can I undo it.

Halo is the set of components for those moments. It groups them by what trusting an AI action actually takes:

- **Transparency:** understand what the AI produced.
- **Generation:** follow content as it is created, and act on it.
- **Control:** supervise agents before and while they act.
- **Reversibility:** recover when the AI gets it wrong.

The components use a neutral gray theme by default, carry no brand colors, and need no stylesheet at runtime, so they adapt to your product instead of restyling it.

## Installation

```bash
npm install @pujamahtani/halo
```

`react` and `react-dom` (v18 or newer) are peer dependencies. Icons come from `lucide-react`, which installs automatically.

## Usage

Wrap your app once in `HaloProvider`, then use any component where AI touches the UI.

```tsx
import { HaloProvider, ApprovalGate } from "@pujamahtani/halo";

export function ReviewStep() {
  return (
    <HaloProvider>
      <ApprovalGate
        action="Reprice 3 invoices to match the updated contract rate"
        rationale="Contract v4 raised the rate from $120 to $145/hr."
        risk="high"
        confidence={0.91}
        details={[
          { label: "Invoices", value: "#1043, #1044, #1047" },
          { label: "Total delta", value: "+$750.00" },
        ]}
        onApprove={reprice}
        onReject={dismiss}
      />
    </HaloProvider>
  );
}
```

## Components

### Transparency

| Component | Description |
|---|---|
| `ConfidenceIndicator` | How confident the model is: a score, a multi-dimension breakdown, an inline pill, or a plain disclaimer. |
| `SourceCitation` | Where an answer came from: inline superscripts, a count pill, or a full source panel. |
| `ReasoningPanel` | The model's step-by-step thinking, shown live, collapsed, or as raw output. |
| `AIBadge` | Marks content as AI-generated, AI-assisted, or human-verified, with optional processing time. |

### Generation

| Component | Description |
|---|---|
| `GenerationState` | Content being produced: a streaming caret, a skeleton, or an error with retry. |
| `SuggestionCard` | An AI edit to accept or dismiss: inline diff, a list with tone control, or side by side. |
| `ResponseActions` | The controls under a response: copy, regenerate, and thumbs feedback, plus context actions and follow-ups. |

### Control

| Component | Description |
|---|---|
| `AgentStatus` | A live read on the agent: idle, working, needs input, done, or failed. |
| `ApprovalGate` | A checkpoint before an agent acts, showing the action, its risk, and the context. |
| `AutonomyControl` | Set how much the agent may do on its own, from suggest-only to autonomous. |

### Reversibility

| Component | Description |
|---|---|
| `ActivityTimeline` | An audit log of agent activity, with per-entry undo. |
| `ActionReceipt` | Proof of what an agent changed, with a before-and-after diff and an undo. |

Every component takes plain props and calls back with plain data. Halo does not wrap a specific AI SDK, so it works with any backend or model.

## Theming

Halo ships one neutral theme and no brand colors. Override any token by passing a partial theme to the provider.

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

## Accessibility

Interactive components are operable by keyboard and keep the browser's native focus ring. `AutonomyControl` is a full radiogroup with arrow-key, Home, and End navigation. Animations respect `prefers-reduced-motion`. Links built from source data are sanitized against unsafe URL schemes such as `javascript:`.

## Compatibility

- React 18 and 19.
- Next.js App Router. The package ships a `"use client"` boundary, so it imports cleanly into Server Components.
- ESM and CommonJS, with TypeScript types included.

## Roadmap

v1 covers a single agent working alongside one person. v2 moves into the harder problems: handoffs between a person and an agent or between agents, shared state when several agents work together, a team view of agent activity, and patterns for mobile and voice.

## Contributing

Issues and pull requests are welcome. To run the project locally:

```bash
npm install
npm run dev        # demo site
npm test           # component tests
npm run build:lib  # build the package into dist/
```

## About

I built Halo out of patterns I kept rebuilding while designing AI features in healthcare, where someone always has to sign off on what the model suggests before it counts for anything. Those trust controls never came in a library, so every project started them again from scratch. This is the reusable version I wished I had.

Built by [Puja Mahtani](https://pujamahtani.com).

## License

MIT
