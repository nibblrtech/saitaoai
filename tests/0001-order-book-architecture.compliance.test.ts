import { describe, expect, it } from "vitest";
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";

function walkTsFiles(rootDir: string): string[] {
  const files: string[] = [];

  if (!existsSync(rootDir)) {
    return files;
  }

  for (const entry of readdirSync(rootDir)) {
    const fullPath = join(rootDir, entry);
    const stats = statSync(fullPath);

    if (stats.isDirectory()) {
      files.push(...walkTsFiles(fullPath));
      continue;
    }

    if (fullPath.endsWith(".ts")) {
      files.push(fullPath);
    }
  }

  return files;
}

describe("0001-order-book-architecture: Generated Non-ArchUnit Compliance Constraints", () => {
  // ADR_CONSTRAINT: The order book component shall maintain separate bid-side and ask-side structures for each instrument and shall not share mutable state across instruments--even if they want to.
  // ADR_MAPPING_RULE: compliance-catch-all-bootstrap
  it.todo("should satisfy: the order book component shall maintain separate bid-side and ask-side structures for each instrument and shall not share mutable state across instruments--even if they want to [the-order-book-component-shall-maintain-separate-bid-side-and-ask-side-structure]");
  // ADR_CONSTRAINT: The order book component shall enforce instrument-level isolation so that events for one instrument cannot mutate another instrument book.
  // ADR_MAPPING_RULE: compliance-catch-all-bootstrap
  it.todo("should satisfy: the order book component shall enforce instrument-level isolation so that events for one instrument cannot mutate another instrument book [the-order-book-component-shall-enforce-instrument-level-isolation-so-that-events]");
  // ADR_CONSTRAINT: The order book component shall treat all accepted state transitions as a totally ordered sequence of events per instrument.
  // ADR_MAPPING_RULE: compliance-sequencing-behavior
  it.todo("should satisfy: the order book component shall treat all accepted state transitions as a totally ordered sequence of events per instrument [the-order-book-component-shall-treat-all-accepted-state-transitions-as-a-totally]");
  // ADR_CONSTRAINT: The order book component shall apply events in sequence order and shall reject out-of-order mutation events unless an explicit recovery mode is active.
  // ADR_MAPPING_RULE: compliance-sequencing-behavior
  it.todo("should satisfy: the order book component shall apply events in sequence order and shall reject out-of-order mutation events unless an explicit recovery mode is active [the-order-book-component-shall-apply-events-in-sequence-order-and-shall-reject-o]");
  // ADR_CONSTRAINT: The order book component shall use price-time priority within each side for price levels and orders at each level.
  // ADR_MAPPING_RULE: compliance-catch-all-bootstrap
  it.todo("should satisfy: the order book component shall use price-time priority within each side for price levels and orders at each level [the-order-book-component-shall-use-price-time-priority-within-each-side-for-pric]");
  // ADR_CONSTRAINT: The order book component shall preserve original queue position for each resting order unless that order is canceled, fully filled, or replaced according to explicit replace semantics.
  // ADR_MAPPING_RULE: compliance-catch-all-bootstrap
  it.todo("should satisfy: the order book component shall preserve original queue position for each resting order unless that order is canceled, fully filled, or replaced according to explicit replace semantics [the-order-book-component-shall-preserve-original-queue-position-for-each-resting]");
  // ADR_CONSTRAINT: The order book component shall support only limit, market, and stop-limit order intentions in v1 and shall reject unsupported order types.
  // ADR_MAPPING_RULE: compliance-validation-and-rejection
  it.todo("should satisfy: the order book component shall support only limit, market, and stop-limit order intentions in v1 and shall reject unsupported order types [the-order-book-component-shall-support-only-limit-market-and-stop-limit-order-in]");
  // ADR_CONSTRAINT: The order book component shall validate order attributes against instrument reference data before admitting an order to the active book.
  // ADR_MAPPING_RULE: compliance-validation-and-rejection
  it.todo("should satisfy: the order book component shall validate order attributes against instrument reference data before admitting an order to the active book [the-order-book-component-shall-validate-order-attributes-against-instrument-refe]");
  // ADR_CONSTRAINT: The order book component shall reject orders with invalid tick size, invalid lot size, invalid side, or non-positive quantity.
  // ADR_MAPPING_RULE: compliance-validation-and-rejection
  it.todo("should satisfy: the order book component shall reject orders with invalid tick size, invalid lot size, invalid side, or non-positive quantity [the-order-book-component-shall-reject-orders-with-invalid-tick-size-invalid-lot-]");
  // ADR_CONSTRAINT: The order book component shall not allow the active continuous-trading book to remain crossed after processing a mutation event.
  // ADR_MAPPING_RULE: compliance-catch-all-bootstrap
  it.todo("should satisfy: the order book component shall not allow the active continuous-trading book to remain crossed after processing a mutation event [the-order-book-component-shall-not-allow-the-active-continuous-trading-book-to-r]");
  // ADR_CONSTRAINT: The order book component shall support partial fill accounting and shall keep remaining open quantity exact and non-negative.
  // ADR_MAPPING_RULE: compliance-quantity-and-lifecycle-invariants
  it.todo("should satisfy: the order book component shall support partial fill accounting and shall keep remaining open quantity exact and non-negative [the-order-book-component-shall-support-partial-fill-accounting-and-shall-keep-re]");
  // ADR_CONSTRAINT: The order book component shall emit explicit domain events for accepted order, rejected order, canceled order, replaced order, partially filled order, and fully filled order.
  // ADR_MAPPING_RULE: compliance-validation-and-rejection
  it.todo("should satisfy: the order book component shall emit explicit domain events for accepted order, rejected order, canceled order, replaced order, partially filled order, and fully filled order [the-order-book-component-shall-emit-explicit-domain-events-for-accepted-order-re]");
  // ADR_CONSTRAINT: The order book component shall include a strictly increasing sequence number and event time on every emitted domain event.
  // ADR_MAPPING_RULE: compliance-sequencing-behavior
  it.todo("should satisfy: the order book component shall include a strictly increasing sequence number and event time on every emitted domain event [the-order-book-component-shall-include-a-strictly-increasing-sequence-number-and]");
  // ADR_CONSTRAINT: The order book component shall not execute network calls or blocking remote procedure calls on the mutation path.
  // ADR_MAPPING_RULE: compliance-catch-all-bootstrap
  it.todo("should satisfy: the order book component shall not execute network calls or blocking remote procedure calls on the mutation path [the-order-book-component-shall-not-execute-network-calls-or-blocking-remote-proc]");
  // ADR_CONSTRAINT: The order book component shall read static instrument metadata from a versioned reference data snapshot that is immutable during a processing cycle.
  // ADR_MAPPING_RULE: compliance-catch-all-bootstrap
  it.todo("should satisfy: the order book component shall read static instrument metadata from a versioned reference data snapshot that is immutable during a processing cycle [the-order-book-component-shall-read-static-instrument-metadata-from-a-versioned-]");
  // ADR_CONSTRAINT: The order book component shall use a monotonic in-process clock source for internal ordering diagnostics and a wall clock source for persisted event timestamps.
  // ADR_MAPPING_RULE: compliance-catch-all-bootstrap
  it.todo("should satisfy: the order book component shall use a monotonic in-process clock source for internal ordering diagnostics and a wall clock source for persisted event timestamps [the-order-book-component-shall-use-a-monotonic-in-process-clock-source-for-inter]");
  // ADR_CONSTRAINT: The order book component shall support deterministic replay from the append-only journal and shall produce an identical final state for identical ordered input.
  // ADR_MAPPING_RULE: compliance-sequencing-behavior
  it.todo("should satisfy: the order book component shall support deterministic replay from the append-only journal and shall produce an identical final state for identical ordered input [the-order-book-component-shall-support-deterministic-replay-from-the-append-only]");
  // ADR_CONSTRAINT: The order book component shall persist sufficient event attributes to reconstruct full order lifecycle history.
  // ADR_MAPPING_RULE: compliance-quantity-and-lifecycle-invariants
  it.todo("should satisfy: the order book component shall persist sufficient event attributes to reconstruct full order lifecycle history [the-order-book-component-shall-persist-sufficient-event-attributes-to-reconstruc]");
  // ADR_CONSTRAINT: The order book component shall expose only query interfaces for derived views such as best bid, best ask, spread, and depth, and these query interfaces shall be side-effect free.
  // ADR_MAPPING_RULE: compliance-catch-all-bootstrap
  it.todo("should satisfy: the order book component shall expose only query interfaces for derived views such as best bid, best ask, spread, and depth, and these query interfaces shall be side-effect free [the-order-book-component-shall-expose-only-query-interfaces-for-derived-views-su]");
  // ADR_CONSTRAINT: The order book component shall prevent duplicate order identifiers within the same trading session for a given participant and instrument.
  // ADR_MAPPING_RULE: compliance-catch-all-bootstrap
  it.todo("should satisfy: the order book component shall prevent duplicate order identifiers within the same trading session for a given participant and instrument [the-order-book-component-shall-prevent-duplicate-order-identifiers-within-the-sa]");
  // ADR_CONSTRAINT: The order book component shall support explicit session-state transitions such as pre-open, open, halt, and closed, and shall reject order actions not permitted in the current state.
  // ADR_MAPPING_RULE: compliance-validation-and-rejection
  it.todo("should satisfy: the order book component shall support explicit session-state transitions such as pre-open, open, halt, and closed, and shall reject order actions not permitted in the current state [the-order-book-component-shall-support-explicit-session-state-transitions-such-a]");
  // ADR_CONSTRAINT: The order book module shall not contain inheritance chains deeper than three levels for domain entities.
  // ADR_MAPPING_RULE: compliance-inheritance-depth-cap
  it("should keep class inheritance depth at 3 levels or less", () => {
    const tsFiles = walkTsFiles("src");
    const parentByClass = new Map<string, string>();

    for (const file of tsFiles) {
      const content = readFileSync(file, "utf8");
      const classRegex = /class\s+([A-Za-z0-9_]+)(?:\s+extends\s+([A-Za-z0-9_]+))?/g;
      let match = classRegex.exec(content);

      while (match) {
        const cls = match[1];
        const parent = match[2];

        if (parent) {
          parentByClass.set(cls, parent);
        }

        match = classRegex.exec(content);
      }
    }

    const depthCache = new Map<string, number>();

    function depth(className: string, visiting = new Set<string>()): number {
      if (depthCache.has(className)) {
        return depthCache.get(className) as number;
      }

      if (visiting.has(className)) {
        return Number.POSITIVE_INFINITY;
      }

      const parent = parentByClass.get(className);
      if (!parent) {
        depthCache.set(className, 1);
        return 1;
      }

      visiting.add(className);
      const result = depth(parent, visiting) + 1;
      visiting.delete(className);

      depthCache.set(className, result);
      return result;
    }

    const violating = Array.from(parentByClass.keys()).filter(
      (cls) => depth(cls) > 3
    );

    expect(violating).toEqual([]);
  });
  // ADR_CONSTRAINT: The order book module shall keep entity fields private and allow state mutation only through explicit domain methods.
  // ADR_MAPPING_RULE: compliance-security-and-privacy
  it.todo("should satisfy: the order book module shall keep entity fields private and allow state mutation only through explicit domain methods [the-order-book-module-shall-keep-entity-fields-private-and-allow-state-mutation-]");
  // ADR_CONSTRAINT: The order book module shall archive daily journal batches and define a seven-year retention policy for historical events.
  // ADR_MAPPING_RULE: compliance-metrics-and-operations
  it.todo("should satisfy: the order book module shall archive daily journal batches and define a seven-year retention policy for historical events [the-order-book-module-shall-archive-daily-journal-batches-and-define-a-seven-yea]");
  // ADR_CONSTRAINT: Id field should not have prefix. E.g. "ID:".
  // ADR_MAPPING_RULE: compliance-prefix-literal-ban
  it('should not encode values with the prohibited prefix "ID:" in source literals', () => {
    const tsFiles = walkTsFiles("src");
    const forbiddenPattern = new RegExp("[\"']ID:[^\"'\\n]*[\"']");

    const offenders = tsFiles.filter((file) =>
      forbiddenPattern.test(readFileSync(file, "utf8"))
    );

    expect(offenders).toEqual([]);
  });
});
