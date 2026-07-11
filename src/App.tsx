import { useState } from "react";
import { HaloProvider } from "./theme/ThemeProvider";
import { AIBadge } from "./components/AIBadge/AIBadge";
import { ConfidenceIndicator } from "./components/ConfidenceIndicator/ConfidenceIndicator";
import { SourceCitation } from "./components/SourceCitation/SourceCitation";
import { ReasoningPanel } from "./components/ReasoningPanel/ReasoningPanel";
import { SuggestionCard } from "./components/SuggestionCard/SuggestionCard";
import { ResponseActions } from "./components/ResponseActions/ResponseActions";
import { ApprovalGate, type ApprovalStatus } from "./components/ApprovalGate/ApprovalGate";
import { ActionReceipt } from "./components/ActionReceipt/ActionReceipt";
import { AutonomyControl } from "./components/AutonomyControl/AutonomyControl";
import { AgentStatus } from "./components/AgentStatus/AgentStatus";
import { GenerationState } from "./components/GenerationState/GenerationState";
import { ActivityTimeline, type ActivityEntry } from "./components/ActivityTimeline/ActivityTimeline";

function ApprovalGateDemo() {
  const [status, setStatus] = useState<ApprovalStatus>("pending");
  return (
    <ApprovalGate
      action="Reprice 3 invoices to match the updated contract rate"
      rationale="Contract v4 raised the hourly rate from $120 to $145. Three unsent invoices still use the old rate."
      risk="high"
      status={status}
      confidence={0.91}
      details={[
        { label: "Invoices", value: "#1043, #1044, #1047" },
        { label: "Rate change", value: "$120 → $145 / hr" },
        { label: "Total delta", value: "+$1,850.00" },
      ]}
      onApprove={() => setStatus("approved")}
      onReject={() => setStatus("rejected")}
      onModify={() => console.log("modify")}
    />
  );
}

function AutonomyControlDemo() {
  const [level, setLevel] = useState("approve");
  return <AutonomyControl value={level} onChange={setLevel} />;
}

const initialActivity: ActivityEntry[] = [
  { id: "a1", actor: "Billing agent", action: "repriced invoice #1043 to $1,740.00", timestamp: "2:41 PM", status: "done", undoable: true },
  { id: "a2", actor: "Billing agent", action: "repriced invoice #1044 to $1,160.00", timestamp: "2:41 PM", status: "done", undoable: true },
  { id: "a3", actor: "You", action: "approved the reprice batch", timestamp: "2:40 PM", status: "done" },
  { id: "a4", actor: "Billing agent", action: "flagged invoice #1050 (missing contract)", timestamp: "2:39 PM", status: "failed" },
];

function ActivityTimelineDemo() {
  const [entries, setEntries] = useState(initialActivity);
  return (
    <ActivityTimeline
      entries={entries}
      onUndo={(id) =>
        setEntries((prev) => prev.map((e) => (e.id === id ? { ...e, status: "undone", undoable: false } : e)))
      }
    />
  );
}

function ActionReceiptDemo() {
  const [undone, setUndone] = useState(false);
  return (
    <ActionReceipt
      summary="Repriced 3 invoices to the updated contract rate"
      actor="Billing agent"
      timestamp="just now"
      confidence={0.91}
      undone={undone}
      onUndo={() => setUndone(true)}
      changes={[
        { field: "Invoice #1043", before: "$1,440.00", after: "$1,740.00" },
        { field: "Invoice #1044", before: "$960.00", after: "$1,160.00" },
        { field: "Invoice #1047", before: "$1,200.00", after: "$1,450.00" },
      ]}
    />
  );
}

const sampleSources = [
  {
    title: "Clinical Guidelines 2026",
    url: "#",
    type: "document" as const,
    domain: "guidelines.health.org",
    relevance: 0.95,
  },
  {
    title: "Lab Results Analysis Framework",
    url: "#",
    type: "database" as const,
    domain: "847 records matched",
    relevance: 0.82,
  },
  {
    title: "Healthcare Cost Optimization Study",
    url: "#",
    type: "research" as const,
    domain: "pubmed.gov",
    relevance: 0.71,
  },
];

const sampleSteps = [
  { label: "Analyzed 24 months of patient history", status: "complete" as const, duration: 1.2 },
  { label: "Cross-referenced 3 clinical protocols", status: "complete" as const, duration: 2.8 },
  { label: "Evaluating cost impact...", status: "active" as const, duration: 3.1 },
  { label: "Generate final recommendation", status: "pending" as const },
];

const sampleDiffs = [
  { type: "unchanged" as const, text: "The patient " },
  { type: "removed" as const, text: "should be given" },
  { type: "added" as const, text: "should receive" },
  { type: "unchanged" as const, text: " Protocol B treatment, which " },
  { type: "removed" as const, text: "has been shown in studies to reduce" },
  { type: "added" as const, text: "reduces" },
  { type: "unchanged" as const, text: " treatment time by 30% " },
  { type: "removed" as const, text: "according to available data" },
  { type: "added" as const, text: "based on 847 comparable cases" },
  { type: "unchanged" as const, text: "." },
];

function Section({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <section style={{ marginBottom: "56px" }}>
      <h2
        style={{
          margin: "0 0 4px",
          fontSize: "17px",
          fontWeight: 600,
          color: "#0a0a0a",
          letterSpacing: "-0.01em",
        }}
      >
        {title}
      </h2>
      <p style={{ margin: "0 0 20px", fontSize: "13px", color: "#737373" }}>
        {description}
      </p>
      {children}
    </section>
  );
}

function VariantLabel({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        fontSize: "11px",
        fontWeight: 500,
        color: "#a3a3a3",
        textTransform: "uppercase",
        letterSpacing: "0.04em",
        marginBottom: "8px",
        marginTop: "20px",
      }}
    >
      {children}
    </div>
  );
}

function App() {
  return (
    <HaloProvider>
      <div
        style={{
          maxWidth: "680px",
          margin: "0 auto",
          padding: "48px 24px 80px",
          fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
        }}
      >
        <header style={{ marginBottom: "56px" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              marginBottom: "10px",
            }}
          >
            <div
              style={{
                width: "28px",
                height: "28px",
                borderRadius: "50%",
                backgroundColor: "#0a0a0a",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="6" stroke="white" strokeWidth="2" opacity="0.5" />
                <circle cx="12" cy="12" r="2.5" fill="white" />
              </svg>
            </div>
            <h1
              style={{
                margin: 0,
                fontSize: "22px",
                fontWeight: 600,
                color: "#0a0a0a",
                letterSpacing: "-0.02em",
              }}
            >
              Halo
            </h1>
          </div>
          <p
            style={{
              margin: 0,
              fontSize: "14px",
              color: "#737373",
              lineHeight: 1.6,
              maxWidth: "480px",
            }}
          >
            A trust layer for AI interfaces. Twelve React components that help
            people understand, verify, and control AI as it works and acts
            inside a product, not just inside a chat.
          </p>
        </header>

        {/* AI BADGE */}
        <Section
          title="AIBadge"
          description="Labels content as AI-generated. Supports filled, outlined, and ghost variants with optional processing time."
        >
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", alignItems: "center" }}>
            <AIBadge />
            <AIBadge variant="outlined" label="AI suggested" />
            <AIBadge variant="ghost" label="AI draft" />
          </div>

          <VariantLabel>With processing time</VariantLabel>
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", alignItems: "center" }}>
            <AIBadge label="AI generated" processingTime={4.2} />
            <AIBadge variant="outlined" label="AI generated" processingTime={13} />
          </div>

          <VariantLabel>Small size</VariantLabel>
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", alignItems: "center" }}>
            <AIBadge size="sm" label="AI" />
            <AIBadge size="sm" variant="outlined" label="AI draft" />
          </div>

          <VariantLabel>Disclaimer footer</VariantLabel>
          <div>
            <p style={{ fontSize: "14px", color: "#0a0a0a", lineHeight: 1.7, marginBottom: "8px" }}>
              Based on the patient's lab results, switching to Protocol B would reduce treatment time by approximately 30%.
            </p>
            <div style={{ fontSize: "11px", color: "#a3a3a3", display: "flex", alignItems: "center", gap: "4px" }}>
              <svg width={12} height={12} viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5" />
                <path d="M8 5v3M8 10.5h.01" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
              AI-generated response. May contain errors.
            </div>
          </div>
        </Section>

        {/* CONFIDENCE */}
        <Section
          title="ConfidenceIndicator"
          description="Shows how confident the AI is. Supports score display, multi-dimension breakdown, inline pills, and disclaimer-only mode."
        >
          <VariantLabel>Score + explanation</VariantLabel>
          <ConfidenceIndicator
            variant="score"
            score={0.87}
            explanation="Based on 847 similar cases with statistically significant outcomes. Score reflects match strength against clinical protocols."
          />

          <VariantLabel>Multi-dimension with status icons</VariantLabel>
          <ConfidenceIndicator
            variant="dimensions"
            dimensions={[
              { label: "Accuracy", score: 0.92 },
              { label: "Relevance", score: 0.85 },
              { label: "Completeness", score: 0.58 },
              { label: "Recency", score: 0.31 },
            ]}
          />

          <VariantLabel>Inline pill</VariantLabel>
          <p style={{ fontSize: "14px", color: "#0a0a0a", lineHeight: 1.7 }}>
            The recommended dosage adjustment is 15mg daily{" "}
            <ConfidenceIndicator variant="inline" score={0.87} />
            {" "}based on the patient's metabolic profile.
          </p>

          <VariantLabel>Disclaimer only (no score)</VariantLabel>
          <ConfidenceIndicator
            variant="disclaimer"
            disclaimer="This response is generated by AI and may contain errors. Verify critical information independently."
          />
        </Section>

        {/* SOURCE CITATION */}
        <Section
          title="SourceCitation"
          description="Shows where AI sourced its information. Three layers: inline superscripts, summary pill, and full source panel."
        >
          <VariantLabel>Inline superscripts</VariantLabel>
          <p style={{ fontSize: "14px", color: "#0a0a0a", lineHeight: 1.8 }}>
            Clinical studies show that Protocol B reduces treatment time by 30%
            <SourceCitation sources={sampleSources} variant="superscript" />
            {" "}while maintaining equivalent outcomes. Cost analysis suggests a 15% reduction in per-patient spending.
          </p>

          <VariantLabel>Source count pill</VariantLabel>
          <SourceCitation sources={sampleSources} variant="pill" />

          <VariantLabel>Source panel with rich previews</VariantLabel>
          <SourceCitation sources={sampleSources} variant="panel" />
        </Section>

        {/* REASONING */}
        <Section
          title="ReasoningPanel"
          description="Shows the AI's step-by-step thinking process. Supports live thinking, collapsed summary, and raw output modes."
        >
          <VariantLabel>Live thinking</VariantLabel>
          <ReasoningPanel variant="live" steps={sampleSteps} />

          <VariantLabel>Collapsed (completed)</VariantLabel>
          <ReasoningPanel
            variant="collapsed"
            steps={sampleSteps.map((s) => ({ ...s, status: "complete" as const, duration: s.duration || 1.5 }))}
            totalDuration={7.1}
            defaultOpen={false}
          />

          <VariantLabel>Raw output</VariantLabel>
          <ReasoningPanel
            variant="raw"
            rawLabel="Generated query"
            rawContent={`SELECT p.patient_id, p.protocol,
  AVG(r.recovery_days) as avg_recovery,
  COUNT(*) as case_count
FROM patients p
JOIN results r ON p.id = r.patient_id
WHERE p.protocol IN ('A', 'B')
GROUP BY p.patient_id, p.protocol
HAVING COUNT(*) > 5`}
          />
        </Section>

        {/* SUGGESTION CARD */}
        <Section
          title="SuggestionCard"
          description="Displays AI suggestions for content changes. Supports inline text diffs, option lists with tone control, and side-by-side comparison."
        >
          <VariantLabel>Inline text diff</VariantLabel>
          <SuggestionCard
            variant="inline-diff"
            diffs={sampleDiffs}
            onAccept={() => console.log("accepted")}
            onDismiss={() => console.log("dismissed")}
          />

          <VariantLabel>Suggestion list with tone control</VariantLabel>
          <SuggestionCard
            variant="suggestion-list"
            suggestions={[
              "Protocol B: A cost-effective treatment alternative",
              "Reducing treatment time with Protocol B",
              "Evidence-based case for switching to Protocol B",
            ]}
            selectedIndex={0}
            toneOptions={["Clinical", "Conversational", "Executive summary"]}
            onSelectSuggestion={(i) => console.log("selected", i)}
            onRegenerate={(tone) => console.log("regenerate", tone)}
          />

          <VariantLabel>Side-by-side diff</VariantLabel>
          <SuggestionCard
            variant="diff-card"
            before="Patient should be given Protocol A treatment per standard procedure."
            after="Patient should receive Protocol B, which reduces treatment time by 30% based on 847 comparable cases."
          />
        </Section>

        {/* RESPONSE ACTIONS */}
        <Section
          title="ResponseActions"
          description="Action controls for AI responses. Includes standard action bar, context-specific actions, structured feedback collection, and suggested follow-ups."
        >
          <VariantLabel>Full action bar</VariantLabel>
          <div
            style={{
              padding: "16px",
              borderRadius: "8px",
              border: "1px solid #e5e5e5",
              backgroundColor: "#ffffff",
            }}
          >
            <p style={{ fontSize: "14px", color: "#0a0a0a", lineHeight: 1.7, marginBottom: "14px" }}>
              Based on the analysis, switching to Protocol B is recommended for Patient Group 3.
            </p>
            <ResponseActions
              variant="bar"
              onAccept={() => console.log("accepted")}
              onDismiss={() => console.log("dismissed")}
              onCopy={() => console.log("copied")}
            />
          </div>

          <VariantLabel>Context-specific actions</VariantLabel>
          <ResponseActions
            variant="context"
            actions={[
              { label: "Apply to patient record", icon: "apply", variant: "primary" },
              { label: "Export as PDF", icon: "download", variant: "secondary" },
              { label: "Continue analysis", icon: "expand", variant: "secondary" },
            ]}
          />

          <VariantLabel>Structured feedback</VariantLabel>
          <ResponseActions
            variant="feedback"
            feedbackQuestion="What was helpful about this response?"
            feedbackCriteria={[
              { label: "Accurately reflects patient data", defaultChecked: true },
              { label: "Cites relevant sources" },
              { label: "Actionable recommendation", defaultChecked: true },
              { label: "Explains reasoning clearly" },
            ]}
            onFeedback={(selected) => console.log("feedback:", selected)}
          />

          <VariantLabel>Suggested follow-ups</VariantLabel>
          <ResponseActions
            variant="follow-ups"
            followUps={[
              { label: "Compare Protocol B outcomes across age groups", onClick: () => console.log("follow-up 1") },
              { label: "Generate a summary report for the care team", onClick: () => console.log("follow-up 2") },
            ]}
          />
        </Section>

        {/* APPROVAL GATE */}
        <Section
          title="ApprovalGate"
          description="A human-in-the-loop checkpoint before an agent takes action. Shows the proposed action, risk level, context, and confidence, with approve / reject / modify controls."
        >
          <ApprovalGateDemo />
        </Section>

        {/* ACTION RECEIPT */}
        <Section
          title="ActionReceipt"
          description="Post-action proof of what the agent did, with a before/after diff and an undo. The receipt is where trust starts."
        >
          <ActionReceiptDemo />
        </Section>

        {/* AUTONOMY CONTROL */}
        <Section
          title="AutonomyControl"
          description="Progressive delegation. Let people dial how much freedom the agent has, from suggest-only to fully autonomous, and grow it as trust builds."
        >
          <AutonomyControlDemo />
        </Section>

        {/* AGENT STATUS */}
        <Section
          title="AgentStatus"
          description="A live read on what the agent is doing: idle, working, needs input, done, or failed. Full row and compact pill variants."
        >
          <VariantLabel>Row</VariantLabel>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <AgentStatus state="working" label="Cross-referencing 3 contracts..." elapsed={12} />
            <AgentStatus state="needs-input" label="Confirm the reprice before sending" />
            <AgentStatus state="done" label="Repriced 3 invoices" />
            <AgentStatus state="error" label="Could not reach the billing API" />
          </div>
          <VariantLabel>Pill</VariantLabel>
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
            <AgentStatus variant="pill" state="working" label="Working" />
            <AgentStatus variant="pill" state="needs-input" label="Needs input" />
            <AgentStatus variant="pill" state="idle" />
          </div>
        </Section>

        {/* GENERATION STATE */}
        <Section
          title="GenerationState"
          description="States for content the AI is producing in-product: streaming with a caret, skeleton loading, and a graceful error with retry."
        >
          <VariantLabel>Streaming</VariantLabel>
          <GenerationState state="streaming" text="Based on the updated contract, the recommended reprice for these three invoices is" />
          <VariantLabel>Skeleton</VariantLabel>
          <GenerationState state="skeleton" lines={3} />
          <VariantLabel>Error with retry</VariantLabel>
          <GenerationState state="error" onRetry={() => console.log("retry")} />
        </Section>

        {/* ACTIVITY TIMELINE */}
        <Section
          title="ActivityTimeline"
          description="An audit log of everything the agent did: who, what, when, with per-entry undo. Recovery is the most-requested trust feature."
        >
          <ActivityTimelineDemo />
        </Section>

        <footer
          style={{
            marginTop: "64px",
            paddingTop: "20px",
            borderTop: "1px solid #e5e5e5",
            fontSize: "12px",
            color: "#a3a3a3",
          }}
        >
          Built by{" "}
          <a
            href="https://pujamahtani.com"
            style={{ color: "#525252", textDecoration: "none" }}
          >
            Puja Mahtani
          </a>
          {" "}&middot; Halo &middot; AI Trust Components
        </footer>
      </div>
    </HaloProvider>
  );
}

export default App;
