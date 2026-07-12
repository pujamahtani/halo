import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import type { ReactElement } from "react";
import {
  HaloProvider,
  AIBadge,
  ConfidenceIndicator,
  SourceCitation,
  ReasoningPanel,
  SuggestionCard,
  ResponseActions,
  ApprovalGate,
  ActionReceipt,
  AutonomyControl,
  AgentStatus,
  GenerationState,
  ActivityTimeline,
} from "../index";

const wrap = (ui: ReactElement) => render(<HaloProvider>{ui}</HaloProvider>);

// Every component should mount inside the provider without throwing and put
// something in the DOM.
const mountCases: [string, ReactElement][] = [
  ["AIBadge", <AIBadge label="AI generated" />],
  ["ConfidenceIndicator", <ConfidenceIndicator variant="score" score={0.87} />],
  ["SourceCitation", <SourceCitation variant="pill" sources={[{ title: "A", url: "#", type: "document" }]} />],
  ["ReasoningPanel", <ReasoningPanel variant="collapsed" steps={[{ label: "s", status: "complete", duration: 1 }]} totalDuration={1} />],
  ["SuggestionCard", <SuggestionCard variant="diff-card" before="a" after="b" />],
  ["ResponseActions", <ResponseActions variant="bar" onAccept={() => {}} />],
  ["ApprovalGate", <ApprovalGate action="Reprice invoices" onApprove={() => {}} onReject={() => {}} />],
  ["ActionReceipt", <ActionReceipt summary="Repriced invoices" changes={[{ field: "x", before: "1", after: "2" }]} onUndo={() => {}} />],
  ["AutonomyControl", <AutonomyControl value="suggest" onChange={() => {}} />],
  ["AgentStatus", <AgentStatus state="working" label="Working" />],
  ["GenerationState", <GenerationState state="skeleton" lines={2} />],
  ["ActivityTimeline", <ActivityTimeline entries={[{ id: "1", actor: "Agent", action: "did x", timestamp: "now" }]} />],
];

describe("mounts", () => {
  it.each(mountCases)("%s renders", (_name, ui) => {
    const { container } = wrap(ui);
    expect(container.firstChild).toBeTruthy();
  });
});

describe("interactions", () => {
  it("ApprovalGate fires onApprove", () => {
    const onApprove = vi.fn();
    wrap(<ApprovalGate action="Do it" onApprove={onApprove} onReject={() => {}} />);
    fireEvent.click(screen.getByText("Approve"));
    expect(onApprove).toHaveBeenCalledTimes(1);
  });

  it("AutonomyControl moves selection with ArrowRight", () => {
    const onChange = vi.fn();
    wrap(<AutonomyControl value="suggest" onChange={onChange} />);
    const radios = screen.getAllByRole("radio");
    radios[0].focus();
    fireEvent.keyDown(radios[0], { key: "ArrowRight" });
    expect(onChange).toHaveBeenCalledWith("approve");
  });

  it("AutonomyControl uses roving tabindex", () => {
    wrap(<AutonomyControl value="approve" onChange={() => {}} />);
    const radios = screen.getAllByRole("radio");
    const tabbable = radios.filter((r) => r.getAttribute("tabindex") === "0");
    expect(tabbable).toHaveLength(1);
    expect(tabbable[0].getAttribute("aria-checked")).toBe("true");
  });

  it("ActionReceipt fires onUndo", () => {
    const onUndo = vi.fn();
    wrap(<ActionReceipt summary="Did it" changes={[{ field: "x", before: "1", after: "2" }]} onUndo={onUndo} />);
    fireEvent.click(screen.getByText("Undo"));
    expect(onUndo).toHaveBeenCalledTimes(1);
  });

  it("GenerationState error fires onRetry", () => {
    const onRetry = vi.fn();
    wrap(<GenerationState state="error" onRetry={onRetry} />);
    fireEvent.click(screen.getByText("Retry"));
    expect(onRetry).toHaveBeenCalledTimes(1);
  });

  it("ActivityTimeline fires onUndo with the entry id", () => {
    const onUndo = vi.fn();
    wrap(
      <ActivityTimeline
        entries={[{ id: "e1", actor: "Agent", action: "did x", timestamp: "now", status: "done", undoable: true }]}
        onUndo={onUndo}
      />
    );
    fireEvent.click(screen.getByText("Undo"));
    expect(onUndo).toHaveBeenCalledWith("e1");
  });
});
