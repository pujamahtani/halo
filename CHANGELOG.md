# Changelog

All notable changes to Halo are documented here. This project follows
[Semantic Versioning](https://semver.org/).

## [0.2.0]

### Added

- New `info` theme token (a blue accent) for in-progress states, on both `defaultTheme` and `darkTheme`.
- A shimmer treatment for "thinking" and in-progress states, used by `ReasoningPanel` and `AgentStatus`. It is theme-aware and respects `prefers-reduced-motion`.
- `SuggestionCard` gains an `acceptLabel` prop so editor surfaces can use verbs like "Replace" or "Insert" instead of the default "Accept".
- `ResponseActions` gains `onRetry`, `onGood`, and `onBad` handlers for the response bar.

### Changed

- Icons now come from [lucide-react](https://lucide.dev) for one consistent set across every component, instead of hand-drawn inline SVGs. `lucide-react` is a runtime dependency and installs automatically.
- `ResponseActions` `bar` variant is now a quiet, icon-only row (copy, regenerate, thumbs up/down) matching common AI response controls. The accept/dismiss confirmation pattern now lives in the `context` variant.
- `AgentStatus` `working` state uses the new blue `info` color instead of amber, so an in-progress agent no longer reads as a warning. Amber is reserved for `needs-input`.
- `SourceCitation` `panel` variant now renders each source's `snippet`, and no longer displays a `relevance` percentage.
- `ReasoningPanel` collapsed variant now summarizes as "Thought for Xs".
- `ConfidenceIndicator` `score` variant is right-sized with a status icon, and the low-confidence icon is softened.
- Consistent icon stroke widths and added hover/press feedback across interactive components.

### Fixed

- `ReasoningPanel` no longer clips shimmered text at certain animation frames.

## [0.1.0]

Initial release. Twelve React components for trusting, verifying, and controlling
AI as it works and acts inside a product.

### Added

- **Transparency** — `ConfidenceIndicator`, `SourceCitation`, `ReasoningPanel`, `AIBadge`
- **Generation** — `GenerationState`, `SuggestionCard`, `ResponseActions`
- **Control** — `AgentStatus`, `ApprovalGate`, `AutonomyControl`
- **Reversibility** — `ActivityTimeline`, `ActionReceipt`
- `HaloProvider` with a themeable token system, plus exported `defaultTheme` and `darkTheme`.
- Next.js App Router support via a `"use client"` boundary.
- Keyboard-accessible interactions, `prefers-reduced-motion` support, and native focus rings.
- ESM and CJS builds with full TypeScript types.

### Notes

Published as `@pujamahtani/halo`, MIT licensed. `react` and `react-dom` (v18+) are
peer dependencies.
