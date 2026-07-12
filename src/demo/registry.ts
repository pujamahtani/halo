export interface ComponentEntry {
  id: string;
  name: string;
  blurb: string;
  code: string;
}

export interface PillarSection {
  id: string;
  label: string;
  blurb: string;
  items: ComponentEntry[];
}

export const SECTIONS: PillarSection[] = [
  {
    id: "transparency",
    label: "Transparency",
    blurb: "Help people understand what the AI is telling them, and how much to trust it.",
    items: [
      {
        id: "confidence",
        name: "ConfidenceIndicator",
        blurb: "How sure the AI is, as a score, a multi-dimension breakdown, an inline pill, or a plain disclaimer.",
        code: `<ConfidenceIndicator
  variant="score"
  score={0.87}
  explanation="Based on 847 similar cases."
/>`,
      },
      {
        id: "sources",
        name: "SourceCitation",
        blurb: "Where the answer came from. Progressive layers: inline superscripts, a count pill, then a full source panel.",
        code: `<SourceCitation
  variant="panel"
  sources={[
    { title: "Clinical Guidelines 2026", url, type: "document", relevance: 0.95 },
  ]}
/>`,
      },
      {
        id: "reasoning",
        name: "ReasoningPanel",
        blurb: "The AI's step-by-step thinking. Live while it works, collapsed once done, or as raw generated output.",
        code: `<ReasoningPanel
  variant="collapsed"
  steps={steps}
  totalDuration={7.1}
/>`,
      },
      {
        id: "aibadge",
        name: "AIBadge",
        blurb: "A quiet marker for what is AI-generated, AI-assisted, or human-verified, with optional processing time.",
        code: `<AIBadge label="AI generated" processingTime={4.2} />`,
      },
    ],
  },
  {
    id: "generation",
    label: "Generation",
    blurb: "Show the AI producing something, and let people act on what it made.",
    items: [
      {
        id: "generation-state",
        name: "GenerationState",
        blurb: "The in-between states of AI content: streaming with a caret, skeleton loading, or a graceful error with retry.",
        code: `<GenerationState state="streaming" text={partialText} />
<GenerationState state="skeleton" lines={3} />
<GenerationState state="error" onRetry={retry} />`,
      },
      {
        id: "suggestion",
        name: "SuggestionCard",
        blurb: "An AI edit you can accept or dismiss: inline diff, a suggestion list with tone control, or side-by-side.",
        code: `<SuggestionCard
  variant="diff-card"
  before={original}
  after={suggested}
/>`,
      },
      {
        id: "response-actions",
        name: "ResponseActions",
        blurb: "The controls under an AI answer: accept, dismiss, retry, copy, structured feedback, and follow-ups.",
        code: `<ResponseActions
  variant="bar"
  onAccept={accept}
  onDismiss={dismiss}
  onCopy={copy}
/>`,
      },
    ],
  },
  {
    id: "control",
    label: "Control",
    blurb: "Supervise agents as they act. This is where most products have nothing, and where trust is won or lost.",
    items: [
      {
        id: "agent-status",
        name: "AgentStatus",
        blurb: "A live read on the agent: idle, working, needs input, done, or failed. Full row or compact pill.",
        code: `<AgentStatus state="working" label="Cross-referencing 3 contracts" elapsed={12} />`,
      },
      {
        id: "approval",
        name: "ApprovalGate",
        blurb: "A human-in-the-loop checkpoint before an agent acts: the action, its risk, the context, and approve / reject.",
        code: `<ApprovalGate
  action="Reprice 3 invoices to the new contract rate"
  risk="high"
  confidence={0.91}
  onApprove={approve}
  onReject={reject}
/>`,
      },
      {
        id: "autonomy",
        name: "AutonomyControl",
        blurb: "Progressive delegation. Dial how much the agent may do on its own, from suggest-only to autonomous, as trust grows.",
        code: `<AutonomyControl value={level} onChange={setLevel} />`,
      },
    ],
  },
  {
    id: "reversibility",
    label: "Reversibility",
    blurb: "Let people recover when the AI is wrong. The most-requested trust feature of all.",
    items: [
      {
        id: "activity",
        name: "ActivityTimeline",
        blurb: "An audit log of what the agent did: who, what, when, with per-entry undo.",
        code: `<ActivityTimeline entries={entries} onUndo={undo} />`,
      },
      {
        id: "receipt",
        name: "ActionReceipt",
        blurb: "Post-action proof: what changed, a before/after diff, and an undo. The receipt is where trust starts.",
        code: `<ActionReceipt
  summary="Repriced 3 invoices to the updated rate"
  changes={changes}
  onUndo={undo}
/>`,
      },
    ],
  },
];

export const V2_ITEMS = [
  { name: "HandoffState", blurb: "When an agent hands back to a human, or off to another agent." },
  { name: "Multi-agent coordination", blurb: "Shared state and handoffs when several agents work together." },
  { name: "Observability dashboard", blurb: "Team-wide view of what every agent is doing and how well." },
  { name: "Mobile & voice", blurb: "Trust patterns for agents beyond the desktop." },
];
