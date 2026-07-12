# Changelog

All notable changes to Halo are documented here. This project follows
[Semantic Versioning](https://semver.org/).

## [0.2.0]

### Changed

- Icons now come from [lucide-react](https://lucide.dev) for one consistent set across every component, instead of hand-drawn inline SVGs. `lucide-react` is a runtime dependency and installs automatically.

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
