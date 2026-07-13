import { useEffect, useState, type ReactNode } from "react";
import { HaloProvider, defaultTheme, darkTheme } from "./theme/ThemeProvider";
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
import {
  Sun, Moon, Package, LayoutGrid, Rocket,
  ArrowLeftRight, Network, Gauge, Smartphone, Sparkles,
  CircleDot, BadgeCheck,
} from "lucide-react";
import "./demo/site.css";

const ICON = 14;
const STROKE = 1.75;

const V2_ICONS: Record<string, typeof Sparkles> = {
  HandoffState: ArrowLeftRight,
  "Multi-agent coordination": Network,
  "Observability dashboard": Gauge,
  "Mobile & voice": Smartphone,
};

const GITHUB_URL = "https://github.com/pujamahtani/halo";
const NPM_URL = "https://www.npmjs.com/package/@pujamahtani/halo";

const sampleSources = [
  { title: "Master Services Agreement v4", url: "#", type: "document" as const, domain: "contracts.acme.internal", snippet: "Effective March 1, the blended professional-services rate increases from $120 to $145 per hour." },
  { title: "Unbilled invoices, current cycle", url: "#", type: "database" as const, domain: "24 invoices matched", snippet: "Three invoices were generated before the rate change and still bill at the prior $120 rate." },
  { title: "Billing reconciliation policy", url: "#", type: "internal" as const, domain: "finance.acme.internal", snippet: "Rate corrections may be applied automatically to unsent invoices; sent invoices require finance approval." },
];

const sampleSteps = [
  { label: "Parsed contract v4 for rate changes", status: "complete" as const, duration: 0.8 },
  { label: "Compared 24 invoices in the current cycle", status: "complete" as const, duration: 2.1 },
  { label: "Flagging invoices still on the old rate", status: "active" as const, duration: 1.4 },
  { label: "Draft the corrected invoice amounts", status: "pending" as const },
];

const initialActivity: ActivityEntry[] = [
  { id: "a1", actor: "Billing agent", action: "repriced invoice #1043 to $1,740.00", timestamp: "2:41 PM", status: "done", undoable: true },
  { id: "a2", actor: "Billing agent", action: "repriced invoice #1044 to $1,160.00", timestamp: "2:41 PM", status: "done", undoable: true },
  { id: "a3", actor: "You", action: "approved the reprice batch", timestamp: "2:40 PM", status: "done" },
  { id: "a4", actor: "Billing agent", action: "flagged invoice #1050 (missing contract)", timestamp: "2:39 PM", status: "failed" },
];

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
        { label: "Total delta", value: "+$750.00" },
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

function renderPreview(id: string): ReactNode {
  switch (id) {
    case "confidence":
      return (
        <div className="site-stack">
          <ConfidenceIndicator variant="score" score={0.91} explanation="The rate change and the three affected invoices are an exact match. Only their send status needs a human check." />
          <ConfidenceIndicator variant="dimensions" dimensions={[
            { label: "Rate match", score: 0.98 },
            { label: "Invoice coverage", score: 0.88 },
            { label: "Send-status certainty", score: 0.54 },
          ]} />
        </div>
      );
    case "sources":
      return <SourceCitation sources={sampleSources} variant="panel" />;
    case "reasoning":
      return (
        <div className="site-stack">
          <ReasoningPanel variant="live" steps={sampleSteps} />
          <ReasoningPanel variant="collapsed" steps={sampleSteps.map((s) => ({ ...s, status: "complete" as const, duration: s.duration || 1.5 }))} totalDuration={7.1} defaultOpen />
        </div>
      );
    case "aibadge":
      return (
        <div className="site-row">
          <AIBadge label="AI generated" processingTime={4.2} />
          <AIBadge variant="outlined" label="AI assisted" />
          <AIBadge variant="ghost" label="Human verified" icon={BadgeCheck} />
        </div>
      );
    case "generation-state":
      return (
        <div className="site-stack">
          <GenerationState state="streaming" text="Based on the updated contract, the recommended reprice for these three invoices is" />
          <GenerationState state="skeleton" lines={3} />
          <GenerationState state="error" onRetry={() => {}} />
        </div>
      );
    case "suggestion":
      return (
        <SuggestionCard
          variant="diff-card"
          before="Invoice #1043 — 12 hrs at the standard $120/hr rate. Total $1,440.00."
          after="Invoice #1043 — 12 hrs at the contract v4 rate of $145/hr, effective March 1. Total $1,740.00."
        />
      );
    case "response-actions":
      return <ResponseActions variant="bar" onCopy={() => {}} onRetry={() => {}} onGood={() => {}} onBad={() => {}} />;
    case "agent-status":
      return (
        <div className="site-stack">
          <AgentStatus state="working" label="Repricing 3 invoices to the contract v4 rate" elapsed={12} />
          <AgentStatus state="needs-input" label="Confirm the reprice before invoices are sent" />
          <AgentStatus state="done" label="Repriced 3 invoices" />
          <div className="site-row">
            <AgentStatus variant="pill" state="working" label="Working" />
            <AgentStatus variant="pill" state="idle" />
          </div>
        </div>
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

function GithubMark({ size = ICON }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
      <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0016 8c0-4.42-3.58-8-8-8z" />
    </svg>
  );
}

function Logo({ dark }: { dark: boolean }) {
  return (
    <div className="site-logo">
      <CircleDot size={11} color={dark ? "#09090b" : "#ffffff"} strokeWidth={2.5} aria-hidden="true" />
    </div>
  );
}

function Sidebar({ activeId }: { activeId: string }) {
  return (
    <nav className="site-sidebar" aria-label="Components">
      {SECTIONS.map((section) => (
        <div key={section.id} className="site-nav-group">
          <div className="site-nav-label">{section.label}</div>
          {section.items.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              className={`site-nav-item${item.id === activeId ? " is-active" : ""}`}
            >
              {item.name}
            </a>
          ))}
        </div>
      ))}
    </nav>
  );
}

function Site({ dark, onToggle }: { dark: boolean; onToggle: () => void }) {
  const [activeId, setActiveId] = useState(SECTIONS[0].items[0].id);
  const [isWide, setIsWide] = useState(true);

  useEffect(() => {
    const onResize = () => setIsWide(window.innerWidth >= 900);
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    document.documentElement.style.colorScheme = dark ? "dark" : "light";
    document.body.style.background = dark ? "#09090b" : "#ffffff";
    document.body.style.color = dark ? "#fafafa" : "#09090b";
  }, [dark]);

  useEffect(() => {
    const anchors = Array.from(document.querySelectorAll<HTMLElement>("[data-halo-anchor]"));
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActiveId(visible[0].target.id);
      },
      { rootMargin: "-64px 0px -70% 0px", threshold: 0 },
    );
    anchors.forEach((a) => observer.observe(a));
    return () => observer.disconnect();
  }, []);

  return (
    <div className="site" data-theme={dark ? "dark" : "light"}>
      <header className="site-header">
        <div className="site-header-inner">
          <div className="site-brand">
            <Logo dark={dark} />
            <span className="site-name">Halo</span>
            <span className="site-version">v0.2.0</span>
          </div>
          <nav className="site-nav" aria-label="External links">
            <a href={GITHUB_URL} target="_blank" rel="noreferrer" className="site-nav-link">
              <GithubMark />
              <span className="site-nav-text">GitHub</span>
            </a>
            <a href={NPM_URL} target="_blank" rel="noreferrer" className="site-nav-link">
              <Package size={ICON} strokeWidth={STROKE} />
              <span className="site-nav-text">npm</span>
            </a>
            <button
              type="button"
              className="site-icon-btn"
              onClick={onToggle}
              aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
            >
              {dark ? <Sun size={ICON} strokeWidth={STROKE} /> : <Moon size={ICON} strokeWidth={STROKE} />}
            </button>
          </nav>
        </div>
      </header>

      <div className="site-layout">
        {isWide && <Sidebar activeId={activeId} />}

        <main className="site-main">
          <header className="site-hero">
            <h1>A trust layer for AI interfaces</h1>
            <p className="site-hero-desc">
              Twelve React components that help people understand, verify, and control AI as it works and acts inside a product, not just inside a chat.
            </p>
            <div className="site-hero-install">
              <CodeBlock code="npm i @pujamahtani/halo" inline dark={dark} />
            </div>
            <div className="site-hero-actions">
              <a href={GITHUB_URL} target="_blank" rel="noreferrer" className="site-btn site-btn-primary">
                <GithubMark size={ICON} />
                View on GitHub
              </a>
              <a href="#confidence" className="site-btn site-btn-secondary">
                <LayoutGrid size={ICON} strokeWidth={STROKE} />
                Browse components
              </a>
            </div>
          </header>

          <section className="site-section">
            <div className="site-section-header">
              <h2>Getting started</h2>
              <p>Wrap your app once, then drop components in. No stylesheet to import. Works in the Next.js App Router, and ships with light and dark themes.</p>
            </div>
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
}`} dark={dark} />
          </section>

          {SECTIONS.map((section) => (
            <div key={section.id} className="site-section">
              <div className="site-section-header">
                <h2>{section.label}</h2>
                <p>{section.blurb}</p>
              </div>

              {section.items.map((item) => (
                <section key={item.id} id={item.id} data-halo-anchor className="site-component">
                  <h3>{item.name}</h3>
                  <p className="site-component-desc">{item.blurb}</p>
                  <div className="site-canvas">{renderPreview(item.id)}</div>
                  <CodeBlock code={item.code} dark={dark} />
                </section>
              ))}
            </div>
          ))}

          <section className="site-v2">
            <div className="site-v2-label">
              <Rocket size={ICON} strokeWidth={STROKE} />
              Coming in v2
            </div>
            <p className="site-v2-desc">
              v1 covers a single agent working alongside one person. Next comes the harder part: many agents at once, and the people who have to supervise them at scale.
            </p>
            <div className="site-v2-grid">
              {V2_ITEMS.map((item) => {
                const Icon = V2_ICONS[item.name] ?? Sparkles;
                return (
                  <div key={item.name} className="site-v2-card">
                    <Icon size={ICON} strokeWidth={STROKE} color="var(--c-text-3)" />
                    <h4>{item.name}</h4>
                    <p>{item.blurb}</p>
                  </div>
                );
              })}
            </div>
            <p className="site-v2-foot">
              Star the repo to follow along.{" "}
              <a href={GITHUB_URL} target="_blank" rel="noreferrer">github.com/pujamahtani/halo</a>
            </p>
          </section>

          <footer className="site-footer">
            <span>Built by <a href="https://pujamahtani.com" target="_blank" rel="noreferrer">Puja Mahtani</a></span>
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
  const [dark, setDark] = useState(() => {
    if (typeof window !== "undefined" && window.matchMedia("(prefers-color-scheme: dark)").matches) {
      return true;
    }
    return false;
  });

  return (
    <HaloProvider theme={dark ? darkTheme : defaultTheme}>
      <Site dark={dark} onToggle={() => setDark((d) => !d)} />
    </HaloProvider>
  );
}

export default App;
