import { useEffect, useState, type ReactNode } from "react";
import { HaloProvider, useHaloTheme, defaultTheme, darkTheme } from "./theme/ThemeProvider";
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
import { CodeBlock } from "./demo/CodeBlock";
import { SECTIONS, V2_ITEMS } from "./demo/registry";

const GITHUB_URL = "https://github.com/pujamahtani/halo";
const NPM_URL = "https://www.npmjs.com/package/@pujamahtani/halo";

/* ---------- sample data ---------- */

const sampleSources = [
  { title: "Clinical Guidelines 2026", url: "#", type: "document" as const, domain: "guidelines.health.org", relevance: 0.95 },
  { title: "Lab Results Analysis Framework", url: "#", type: "database" as const, domain: "847 records matched", relevance: 0.82 },
  { title: "Healthcare Cost Optimization Study", url: "#", type: "research" as const, domain: "pubmed.gov", relevance: 0.71 },
];

const sampleSteps = [
  { label: "Analyzed 24 months of patient history", status: "complete" as const, duration: 1.2 },
  { label: "Cross-referenced 3 clinical protocols", status: "complete" as const, duration: 2.8 },
  { label: "Evaluating cost impact...", status: "active" as const, duration: 3.1 },
  { label: "Generate final recommendation", status: "pending" as const },
];

const initialActivity: ActivityEntry[] = [
  { id: "a1", actor: "Billing agent", action: "repriced invoice #1043 to $1,740.00", timestamp: "2:41 PM", status: "done", undoable: true },
  { id: "a2", actor: "Billing agent", action: "repriced invoice #1044 to $1,160.00", timestamp: "2:41 PM", status: "done", undoable: true },
  { id: "a3", actor: "You", action: "approved the reprice batch", timestamp: "2:40 PM", status: "done" },
  { id: "a4", actor: "Billing agent", action: "flagged invoice #1050 (missing contract)", timestamp: "2:39 PM", status: "failed" },
];

/* ---------- stateful previews ---------- */

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
      onModify={() => {}}
    />
  );
}

function AutonomyControlDemo() {
  const [level, setLevel] = useState("approve");
  return <AutonomyControl value={level} onChange={setLevel} />;
}

function ActivityTimelineDemo() {
  const [entries, setEntries] = useState(initialActivity);
  return (
    <ActivityTimeline
      entries={entries}
      onUndo={(id) => setEntries((prev) => prev.map((e) => (e.id === id ? { ...e, status: "undone", undoable: false } : e)))}
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

function Stack({ children }: { children: ReactNode }) {
  return <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>{children}</div>;
}

function renderPreview(id: string): ReactNode {
  switch (id) {
    case "confidence":
      return (
        <Stack>
          <ConfidenceIndicator variant="score" score={0.87} explanation="Based on 847 similar cases with statistically significant outcomes." />
          <ConfidenceIndicator variant="dimensions" dimensions={[
            { label: "Accuracy", score: 0.92 },
            { label: "Relevance", score: 0.85 },
            { label: "Completeness", score: 0.58 },
          ]} />
        </Stack>
      );
    case "sources":
      return <SourceCitation sources={sampleSources} variant="panel" />;
    case "reasoning":
      return <ReasoningPanel variant="collapsed" steps={sampleSteps.map((s) => ({ ...s, status: "complete" as const, duration: s.duration || 1.5 }))} totalDuration={7.1} defaultOpen />;
    case "aibadge":
      return (
        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", alignItems: "center" }}>
          <AIBadge label="AI generated" processingTime={4.2} />
          <AIBadge variant="outlined" label="AI assisted" />
          <AIBadge variant="ghost" label="Human verified" />
        </div>
      );
    case "generation-state":
      return (
        <Stack>
          <GenerationState state="streaming" text="Based on the updated contract, the recommended reprice for these three invoices is" />
          <GenerationState state="skeleton" lines={3} />
          <GenerationState state="error" onRetry={() => {}} />
        </Stack>
      );
    case "suggestion":
      return (
        <SuggestionCard
          variant="diff-card"
          before="Patient should be given Protocol A treatment per standard procedure."
          after="Patient should receive Protocol B, which reduces treatment time by 30% based on 847 comparable cases."
        />
      );
    case "response-actions":
      return (
        <div style={{ padding: "16px", borderRadius: "8px", border: "1px solid var(--halo-canvas-border)" }}>
          <ResponseActions variant="bar" onAccept={() => {}} onDismiss={() => {}} onCopy={() => {}} />
        </div>
      );
    case "agent-status":
      return (
        <Stack>
          <AgentStatus state="working" label="Cross-referencing 3 contracts..." elapsed={12} />
          <AgentStatus state="needs-input" label="Confirm the reprice before sending" />
          <AgentStatus state="done" label="Repriced 3 invoices" />
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
            <AgentStatus variant="pill" state="working" label="Working" />
            <AgentStatus variant="pill" state="idle" />
          </div>
        </Stack>
      );
    case "approval":
      return <ApprovalGateDemo />;
    case "autonomy":
      return <AutonomyControlDemo />;
    case "activity":
      return <ActivityTimelineDemo />;
    case "receipt":
      return <ActionReceiptDemo />;
    default:
      return null;
  }
}

/* ---------- chrome ---------- */

function Logo({ size = 26 }: { size?: number }) {
  const theme = useHaloTheme();
  return (
    <div style={{ width: size, height: size, borderRadius: "50%", backgroundColor: theme.colors.text, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
      <svg width={size * 0.5} height={size * 0.5} viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="6" stroke={theme.colors.background} strokeWidth="2" opacity="0.5" />
        <circle cx="12" cy="12" r="2.5" fill={theme.colors.background} />
      </svg>
    </div>
  );
}

function TopBarLink({ href, children }: { href: string; children: ReactNode }) {
  const theme = useHaloTheme();
  return (
    <a href={href} target="_blank" rel="noreferrer" style={{ fontSize: "13px", color: theme.colors.textSecondary, textDecoration: "none", fontWeight: 500 }}>
      {children}
    </a>
  );
}

function ThemeToggle({ dark, onToggle }: { dark: boolean; onToggle: () => void }) {
  const theme = useHaloTheme();
  return (
    <button
      type="button"
      className="halo-btn"
      onClick={onToggle}
      aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
      style={{
        display: "inline-flex", alignItems: "center", justifyContent: "center",
        width: "32px", height: "32px", borderRadius: theme.radius.md,
        border: `1px solid ${theme.colors.border}`, backgroundColor: theme.colors.surface,
        color: theme.colors.textSecondary, cursor: "pointer",
      }}
    >
      {dark ? (
        <svg width={15} height={15} viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <circle cx="12" cy="12" r="4.5" stroke="currentColor" strokeWidth="1.6" />
          <path d="M12 2v2M12 20v2M2 12h2M20 12h2M5 5l1.5 1.5M17.5 17.5L19 19M19 5l-1.5 1.5M6.5 17.5L5 19" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
      ) : (
        <svg width={15} height={15} viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M20 14.5A8 8 0 019.5 4a7 7 0 108.5 10.5z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
        </svg>
      )}
    </button>
  );
}

function Sidebar({ activeId }: { activeId: string }) {
  const theme = useHaloTheme();
  return (
    <nav aria-label="Components" style={{ position: "sticky", top: "80px", alignSelf: "flex-start", width: "196px", flexShrink: 0, fontFamily: theme.font.sans }}>
      {SECTIONS.map((section) => (
        <div key={section.id} style={{ marginBottom: "18px" }}>
          <div style={{ fontSize: "11px", fontWeight: 600, letterSpacing: "0.04em", textTransform: "uppercase", color: theme.colors.textMuted, marginBottom: "8px" }}>
            {section.label}
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "1px" }}>
            {section.items.map((item) => {
              const active = item.id === activeId;
              return (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  style={{
                    fontSize: "13px",
                    color: active ? theme.colors.text : theme.colors.textMuted,
                    fontWeight: active ? 550 : 400,
                    textDecoration: "none",
                    padding: "3px 0",
                    borderLeft: `2px solid ${active ? theme.colors.text : "transparent"}`,
                    paddingLeft: "10px",
                    marginLeft: "-2px",
                    transition: "color .12s ease",
                  }}
                >
                  {item.name}
                </a>
              );
            })}
          </div>
        </div>
      ))}
    </nav>
  );
}

function Site({ dark, onToggle }: { dark: boolean; onToggle: () => void }) {
  const theme = useHaloTheme();
  const [activeId, setActiveId] = useState(SECTIONS[0].items[0].id);
  const [isWide, setIsWide] = useState(true);

  useEffect(() => {
    const onResize = () => setIsWide(window.innerWidth >= 900);
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    document.body.style.backgroundColor = theme.colors.background;
  }, [theme.colors.background]);

  useEffect(() => {
    const anchors = Array.from(document.querySelectorAll<HTMLElement>("[data-halo-anchor]"));
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActiveId(visible[0].target.id);
      },
      { rootMargin: "-72px 0px -70% 0px", threshold: 0 }
    );
    anchors.forEach((a) => observer.observe(a));
    return () => observer.disconnect();
  }, []);

  const canvasStyle: React.CSSProperties = {
    padding: "22px 24px",
    border: `1px solid ${theme.colors.border}`,
    borderRadius: theme.radius.lg,
    backgroundColor: theme.colors.background,
    marginBottom: "12px",
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: theme.colors.background, color: theme.colors.text, fontFamily: theme.font.sans, transition: "background-color .2s ease, color .2s ease", ["--halo-canvas-border" as string]: theme.colors.border }}>
      {/* top bar */}
      <div style={{ position: "sticky", top: 0, zIndex: 10, backgroundColor: theme.colors.background, borderBottom: `1px solid ${theme.colors.border}` }}>
        <div style={{ maxWidth: "1040px", margin: "0 auto", height: "56px", padding: "0 24px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "9px" }}>
            <Logo />
            <span style={{ fontSize: "16px", fontWeight: 600, letterSpacing: "-0.02em" }}>Halo</span>
            <span style={{ fontSize: "11px", color: theme.colors.textMuted, border: `1px solid ${theme.colors.border}`, borderRadius: "999px", padding: "1px 7px", marginLeft: "2px" }}>v0.1</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "18px" }}>
            <TopBarLink href={GITHUB_URL}>GitHub</TopBarLink>
            <TopBarLink href={NPM_URL}>npm</TopBarLink>
            <ThemeToggle dark={dark} onToggle={onToggle} />
          </div>
        </div>
      </div>

      <div style={{ maxWidth: "1040px", margin: "0 auto", display: "flex", gap: "48px", padding: "0 24px" }}>
        {isWide && <div style={{ paddingTop: "48px" }}><Sidebar activeId={activeId} /></div>}

        <main style={{ flex: 1, minWidth: 0, maxWidth: "720px", padding: "48px 0 96px" }}>
          {/* hero */}
          <header style={{ marginBottom: "40px" }}>
            <h1 style={{ margin: "0 0 14px", fontSize: "34px", fontWeight: 600, letterSpacing: "-0.03em", lineHeight: 1.1 }}>
              A trust layer for AI interfaces
            </h1>
            <p style={{ margin: "0 0 22px", fontSize: "16px", lineHeight: 1.6, color: theme.colors.textSecondary, maxWidth: "560px" }}>
              Twelve React components that help people understand, verify, and control AI as it works and acts inside a product, not just inside a chat.
            </p>
            <div style={{ maxWidth: "360px", marginBottom: "16px" }}>
              <CodeBlock code="npm i @pujamahtani/halo" />
            </div>
            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
              <a href={GITHUB_URL} target="_blank" rel="noreferrer" className="halo-btn" style={{ fontSize: "13px", fontWeight: 550, color: theme.colors.background, backgroundColor: theme.colors.text, borderRadius: theme.radius.md, padding: "8px 16px", textDecoration: "none" }}>
                View on GitHub
              </a>
              <a href="#confidence" className="halo-btn" style={{ fontSize: "13px", fontWeight: 500, color: theme.colors.textSecondary, border: `1px solid ${theme.colors.border}`, borderRadius: theme.radius.md, padding: "8px 16px", textDecoration: "none" }}>
                Browse components
              </a>
            </div>
          </header>

          {/* getting started */}
          <section style={{ marginBottom: "48px" }}>
            <h2 style={{ margin: "0 0 6px", fontSize: "13px", fontWeight: 600, letterSpacing: "0.04em", textTransform: "uppercase", color: theme.colors.textMuted }}>Getting started</h2>
            <p style={{ margin: "0 0 14px", fontSize: "14px", color: theme.colors.textSecondary, lineHeight: 1.6 }}>
              Wrap your app once, then drop components in. No stylesheet to import. Works in the Next.js App Router, and ships with light and dark themes.
            </p>
            <CodeBlock code={`import { HaloProvider, ApprovalGate } from "@pujamahtani/halo";

export function App() {
  return (
    <HaloProvider>
      <ApprovalGate
        action="Reprice 3 invoices to the new rate"
        risk="high"
        onApprove={approve}
        onReject={reject}
      />
    </HaloProvider>
  );
}`} />
          </section>

          {/* component sections */}
          {SECTIONS.map((section) => (
            <div key={section.id}>
              <div style={{ margin: "0 0 24px", paddingTop: "8px" }}>
                <h2 style={{ margin: "0 0 4px", fontSize: "20px", fontWeight: 600, letterSpacing: "-0.01em" }}>{section.label}</h2>
                <p style={{ margin: 0, fontSize: "13.5px", color: theme.colors.textMuted, lineHeight: 1.5, maxWidth: "520px" }}>{section.blurb}</p>
              </div>

              {section.items.map((item) => (
                <section key={item.id} id={item.id} data-halo-anchor style={{ marginBottom: "44px", scrollMarginTop: "72px" }}>
                  <h3 style={{ margin: "0 0 3px", fontSize: "15px", fontWeight: 600 }}>{item.name}</h3>
                  <p style={{ margin: "0 0 16px", fontSize: "13.5px", color: theme.colors.textMuted, lineHeight: 1.5, maxWidth: "560px" }}>{item.blurb}</p>
                  <div style={canvasStyle}>{renderPreview(item.id)}</div>
                  <CodeBlock code={item.code} />
                </section>
              ))}
            </div>
          ))}

          {/* v2 teaser */}
          <section style={{ marginTop: "24px", padding: "28px", borderRadius: theme.radius.lg, border: `1px dashed ${theme.colors.borderStrong}`, backgroundColor: theme.colors.surface }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
              <span style={{ fontSize: "11px", fontWeight: 600, letterSpacing: "0.04em", textTransform: "uppercase", color: theme.colors.textMuted }}>Coming in v2</span>
            </div>
            <p style={{ margin: "0 0 20px", fontSize: "14px", color: theme.colors.textSecondary, lineHeight: 1.6, maxWidth: "520px" }}>
              v1 covers a single agent working alongside one person. Next, Halo grows into the harder territory: many agents, and the humans supervising them at scale.
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "14px" }}>
              {V2_ITEMS.map((item) => (
                <div key={item.name} style={{ padding: "14px 16px", borderRadius: theme.radius.md, backgroundColor: theme.colors.background, border: `1px solid ${theme.colors.border}` }}>
                  <div style={{ fontSize: "13.5px", fontWeight: 600, marginBottom: "3px" }}>{item.name}</div>
                  <div style={{ fontSize: "12.5px", color: theme.colors.textMuted, lineHeight: 1.5 }}>{item.blurb}</div>
                </div>
              ))}
            </div>
            <p style={{ margin: "18px 0 0", fontSize: "12.5px", color: theme.colors.textMuted }}>
              Star the repo to follow along.{" "}
              <a href={GITHUB_URL} target="_blank" rel="noreferrer" style={{ color: theme.colors.textSecondary }}>github.com/pujamahtani/halo</a>
            </p>
          </section>

          {/* footer */}
          <footer style={{ marginTop: "56px", paddingTop: "20px", borderTop: `1px solid ${theme.colors.border}`, fontSize: "12.5px", color: theme.colors.textMuted, display: "flex", gap: "8px", flexWrap: "wrap" }}>
            <span>Built by <a href="https://pujamahtani.com" target="_blank" rel="noreferrer" style={{ color: theme.colors.textSecondary, textDecoration: "none" }}>Puja Mahtani</a></span>
            <span>·</span>
            <span>MIT licensed</span>
            <span>·</span>
            <span>Open source</span>
          </footer>
        </main>
      </div>
    </div>
  );
}

function App() {
  const [dark, setDark] = useState(false);
  return (
    <HaloProvider theme={dark ? darkTheme : defaultTheme}>
      <Site dark={dark} onToggle={() => setDark((d) => !d)} />
    </HaloProvider>
  );
}

export default App;
