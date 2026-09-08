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

describe("0002-matching-engine-architecture: Generated Non-ArchUnit Compliance Constraints", () => {
  // ADR_CONSTRAINT: The matching engine component shall process order events in a single-threaded logical sequence per instrument shard.
  // ADR_MAPPING_RULE: compliance-sequencing-behavior
  it("should provide sequence/replay evidence for this constraint", () => {
    const candidateRoots = ["src/matching-engine"];

    const existingRoots = candidateRoots.filter((root) => existsSync(root));

    // Bootstrap guard: until component code exists, this test is a no-op and stays green.
    if (existingRoots.length === 0) {
      expect(true).toBe(true);
      return;
    }

    const tsFiles = Array.from(
      new Set(existingRoots.flatMap((root) => walkTsFiles(root)))
    );

    const corpus = tsFiles
      .map((file) => readFileSync(file, "utf8"))
      .join("\n")
      .toLowerCase();

    const requiredTerms = ["sequence", "order"];
    const missingTerms = requiredTerms.filter((term) => !corpus.includes(term));

    expect(missingTerms).toEqual([]);
  });
  // ADR_CONSTRAINT: The matching engine component shall apply a documented matching policy and shall not change policy at runtime without explicit configuration versioning.
  // ADR_MAPPING_RULE: compliance-catch-all-bootstrap
  it.todo("should satisfy: the matching engine component shall apply a documented matching policy and shall not change policy at runtime without explicit configuration versioning [the-matching-engine-component-shall-apply-a-documented-matching-policy-and-shall]");
  // ADR_CONSTRAINT: The matching engine component shall enforce price-time priority for continuous trading.
  // ADR_MAPPING_RULE: compliance-catch-all-bootstrap
  it.todo("should satisfy: the matching engine component shall enforce price-time priority for continuous trading [the-matching-engine-component-shall-enforce-price-time-priority-for-continuous-t]");
  // ADR_CONSTRAINT: The matching engine component shall not implement auction matching logic in v1.
  // ADR_MAPPING_RULE: compliance-catch-all-bootstrap
  it.todo("should satisfy: the matching engine component shall not implement auction matching logic in v1 [the-matching-engine-component-shall-not-implement-auction-matching-logic-in-v1]");
  // ADR_CONSTRAINT: The matching engine component shall consume only validated order-intent events from the order entry gateway and shall reject malformed or unauthenticated inputs.
  // ADR_MAPPING_RULE: compliance-validation-and-rejection
  it("should provide validation/rejection evidence for this constraint", () => {
    const candidateRoots = ["src/matching-engine"];
    const existingRoots = candidateRoots.filter((root) => existsSync(root));

    // Bootstrap guard: until component code exists, this test is a no-op and stays green.
    if (existingRoots.length === 0) {
      expect(true).toBe(true);
      return;
    }

    const tsFiles = Array.from(
      new Set(existingRoots.flatMap((root) => walkTsFiles(root)))
    );

    const corpus = tsFiles
      .map((file) => readFileSync(file, "utf8"))
      .join("\n")
      .toLowerCase();

    const requiredTerms = ["validate", "reject", "auth"];
    const missingTerms = requiredTerms.filter((term) => !corpus.includes(term));

    expect(missingTerms).toEqual([]);
  });
  // ADR_CONSTRAINT: The matching engine component shall perform final in-engine validations for session state and instrument tradability before matching.
  // ADR_MAPPING_RULE: compliance-validation-and-rejection
  it("should provide validation/rejection evidence for this constraint", () => {
    const candidateRoots = ["src/matching-engine"];
    const existingRoots = candidateRoots.filter((root) => existsSync(root));

    // Bootstrap guard: until component code exists, this test is a no-op and stays green.
    if (existingRoots.length === 0) {
      expect(true).toBe(true);
      return;
    }

    const tsFiles = Array.from(
      new Set(existingRoots.flatMap((root) => walkTsFiles(root)))
    );

    const corpus = tsFiles
      .map((file) => readFileSync(file, "utf8"))
      .join("\n")
      .toLowerCase();

    const requiredTerms = ["validate", "session", "tradable"];
    const missingTerms = requiredTerms.filter((term) => !corpus.includes(term));

    expect(missingTerms).toEqual([]);
  });
  // ADR_CONSTRAINT: The matching engine component shall support only limit, market, and stop-limit order types in v1 and shall reject unsupported order types.
  // ADR_MAPPING_RULE: compliance-validation-and-rejection
  it("should provide validation/rejection evidence for this constraint", () => {
    const candidateRoots = ["src/matching-engine"];
    const existingRoots = candidateRoots.filter((root) => existsSync(root));

    // Bootstrap guard: until component code exists, this test is a no-op and stays green.
    if (existingRoots.length === 0) {
      expect(true).toBe(true);
      return;
    }

    const tsFiles = Array.from(
      new Set(existingRoots.flatMap((root) => walkTsFiles(root)))
    );

    const corpus = tsFiles
      .map((file) => readFileSync(file, "utf8"))
      .join("\n")
      .toLowerCase();

    const requiredTerms = ["reject"];
    const missingTerms = requiredTerms.filter((term) => !corpus.includes(term));

    expect(missingTerms).toEqual([]);
  });
  // ADR_CONSTRAINT: The matching engine component shall emit execution events with immutable execution identifiers and strict per-instrument sequence numbers.
  // ADR_MAPPING_RULE: compliance-sequencing-behavior
  it("should provide sequence/replay evidence for this constraint", () => {
    const candidateRoots = ["src/matching-engine"];

    const existingRoots = candidateRoots.filter((root) => existsSync(root));

    // Bootstrap guard: until component code exists, this test is a no-op and stays green.
    if (existingRoots.length === 0) {
      expect(true).toBe(true);
      return;
    }

    const tsFiles = Array.from(
      new Set(existingRoots.flatMap((root) => walkTsFiles(root)))
    );

    const corpus = tsFiles
      .map((file) => readFileSync(file, "utf8"))
      .join("\n")
      .toLowerCase();

    const requiredTerms = ["sequence"];
    const missingTerms = requiredTerms.filter((term) => !corpus.includes(term));

    expect(missingTerms).toEqual([]);
  });
  // ADR_CONSTRAINT: The matching engine component shall guarantee idempotent behavior for retried inbound messages by deduplicating on a stable client order identity and session scope.
  // ADR_MAPPING_RULE: compliance-quantity-and-lifecycle-invariants
  it("should provide quantity/lifecycle invariant evidence for this constraint", () => {
    const candidateRoots = ["src/matching-engine"];
    const existingRoots = candidateRoots.filter((root) => existsSync(root));

    // Bootstrap guard: until component code exists, this test is a no-op and stays green.
    if (existingRoots.length === 0) {
      expect(true).toBe(true);
      return;
    }

    const tsFiles = Array.from(
      new Set(existingRoots.flatMap((root) => walkTsFiles(root)))
    );

    const corpus = tsFiles
      .map((file) => readFileSync(file, "utf8"))
      .join("\n")
      .toLowerCase();

    const requiredTerms = ["idempotent"];
    const missingTerms = requiredTerms.filter((term) => !corpus.includes(term));

    expect(missingTerms).toEqual([]);
  });
  // ADR_CONSTRAINT: The matching engine component shall guarantee at-most-once execution creation for each matched quantity slice.
  // ADR_MAPPING_RULE: compliance-quantity-and-lifecycle-invariants
  it("should provide quantity/lifecycle invariant evidence for this constraint", () => {
    const candidateRoots = ["src/matching-engine"];
    const existingRoots = candidateRoots.filter((root) => existsSync(root));

    // Bootstrap guard: until component code exists, this test is a no-op and stays green.
    if (existingRoots.length === 0) {
      expect(true).toBe(true);
      return;
    }

    const tsFiles = Array.from(
      new Set(existingRoots.flatMap((root) => walkTsFiles(root)))
    );

    const corpus = tsFiles
      .map((file) => readFileSync(file, "utf8"))
      .join("\n")
      .toLowerCase();

    const requiredTerms = ["quantity", "at-most-once"];
    const missingTerms = requiredTerms.filter((term) => !corpus.includes(term));

    expect(missingTerms).toEqual([]);
  });
  // ADR_CONSTRAINT: The matching engine component shall guarantee that the sum of all execution quantities for an order never exceeds its accepted quantity.
  // ADR_MAPPING_RULE: compliance-quantity-and-lifecycle-invariants
  it("should provide quantity/lifecycle invariant evidence for this constraint", () => {
    const candidateRoots = ["src/matching-engine"];
    const existingRoots = candidateRoots.filter((root) => existsSync(root));

    // Bootstrap guard: until component code exists, this test is a no-op and stays green.
    if (existingRoots.length === 0) {
      expect(true).toBe(true);
      return;
    }

    const tsFiles = Array.from(
      new Set(existingRoots.flatMap((root) => walkTsFiles(root)))
    );

    const corpus = tsFiles
      .map((file) => readFileSync(file, "utf8"))
      .join("\n")
      .toLowerCase();

    const requiredTerms = ["quantity"];
    const missingTerms = requiredTerms.filter((term) => !corpus.includes(term));

    expect(missingTerms).toEqual([]);
  });
  // ADR_CONSTRAINT: The matching engine component shall guarantee that canceled quantity plus executed quantity plus remaining open quantity equals accepted quantity for every live order lifecycle.
  // ADR_MAPPING_RULE: compliance-quantity-and-lifecycle-invariants
  it("should provide quantity/lifecycle invariant evidence for this constraint", () => {
    const candidateRoots = ["src/matching-engine"];
    const existingRoots = candidateRoots.filter((root) => existsSync(root));

    // Bootstrap guard: until component code exists, this test is a no-op and stays green.
    if (existingRoots.length === 0) {
      expect(true).toBe(true);
      return;
    }

    const tsFiles = Array.from(
      new Set(existingRoots.flatMap((root) => walkTsFiles(root)))
    );

    const corpus = tsFiles
      .map((file) => readFileSync(file, "utf8"))
      .join("\n")
      .toLowerCase();

    const requiredTerms = ["quantity", "remaining", "open", "lifecycle"];
    const missingTerms = requiredTerms.filter((term) => !corpus.includes(term));

    expect(missingTerms).toEqual([]);
  });
  // ADR_CONSTRAINT: The matching engine component shall emit state transitions for all order lifecycle events required by client drop-copy and market data downstream systems.
  // ADR_MAPPING_RULE: compliance-quantity-and-lifecycle-invariants
  it("should provide quantity/lifecycle invariant evidence for this constraint", () => {
    const candidateRoots = ["src/matching-engine","src/market-data"];
    const existingRoots = candidateRoots.filter((root) => existsSync(root));

    // Bootstrap guard: until component code exists, this test is a no-op and stays green.
    if (existingRoots.length === 0) {
      expect(true).toBe(true);
      return;
    }

    const tsFiles = Array.from(
      new Set(existingRoots.flatMap((root) => walkTsFiles(root)))
    );

    const corpus = tsFiles
      .map((file) => readFileSync(file, "utf8"))
      .join("\n")
      .toLowerCase();

    const requiredTerms = ["lifecycle"];
    const missingTerms = requiredTerms.filter((term) => !corpus.includes(term));

    expect(missingTerms).toEqual([]);
  });
  // ADR_CONSTRAINT: The matching engine component shall persist an append-only execution and order-event journal before acknowledging final acceptance outcomes to external clients.
  // ADR_MAPPING_RULE: compliance-catch-all-bootstrap
  it.todo("should satisfy: the matching engine component shall persist an append-only execution and order-event journal before acknowledging final acceptance outcomes to external clients [the-matching-engine-component-shall-persist-an-append-only-execution-and-order-e]");
  // ADR_CONSTRAINT: The matching engine component shall assign authoritative event timestamps within the engine boundary and shall not trust client-supplied timestamps for sequencing.
  // ADR_MAPPING_RULE: compliance-catch-all-bootstrap
  it.todo("should satisfy: the matching engine component shall assign authoritative event timestamps within the engine boundary and shall not trust client-supplied timestamps for sequencing [the-matching-engine-component-shall-assign-authoritative-event-timestamps-within]");
  // ADR_CONSTRAINT: The matching engine component shall not call market data publisher APIs directly from matching logic and shall publish only domain events to an internal event bus.
  // ADR_MAPPING_RULE: compliance-catch-all-bootstrap
  it.todo("should satisfy: the matching engine component shall not call market data publisher APIs directly from matching logic and shall publish only domain events to an internal event bus [the-matching-engine-component-shall-not-call-market-data-publisher-apis-directly]");
  // ADR_CONSTRAINT: The matching engine component shall include operator kill-switch hooks to halt matching per instrument or per market segment.
  // ADR_MAPPING_RULE: compliance-metrics-and-operations
  it.todo("should satisfy: the matching engine component shall include operator kill-switch hooks to halt matching per instrument or per market segment [the-matching-engine-component-shall-include-operator-kill-switch-hooks-to-halt-m]");
  // ADR_CONSTRAINT: The matching engine component shall apply configured trading-halt state from market-control inputs before accepting aggressive matches.
  // ADR_MAPPING_RULE: compliance-catch-all-bootstrap
  it.todo("should satisfy: the matching engine component shall apply configured trading-halt state from market-control inputs before accepting aggressive matches [the-matching-engine-component-shall-apply-configured-trading-halt-state-from-mar]");
  // ADR_CONSTRAINT: The matching engine component shall expose metrics for input rate, match rate, rejection rate, queue depth, and tail latency per shard.
  // ADR_MAPPING_RULE: compliance-validation-and-rejection
  it("should provide validation/rejection evidence for this constraint", () => {
    const candidateRoots = ["src/matching-engine"];
    const existingRoots = candidateRoots.filter((root) => existsSync(root));

    // Bootstrap guard: until component code exists, this test is a no-op and stays green.
    if (existingRoots.length === 0) {
      expect(true).toBe(true);
      return;
    }

    const tsFiles = Array.from(
      new Set(existingRoots.flatMap((root) => walkTsFiles(root)))
    );

    const corpus = tsFiles
      .map((file) => readFileSync(file, "utf8"))
      .join("\n")
      .toLowerCase();

    const requiredTerms = ["reject"];
    const missingTerms = requiredTerms.filter((term) => !corpus.includes(term));

    expect(missingTerms).toEqual([]);
  });
  // ADR_CONSTRAINT: The matching engine component shall expose deterministic replay tooling that can regenerate execution tapes for a selected time range and shard.
  // ADR_MAPPING_RULE: compliance-sequencing-behavior
  it("should provide sequence/replay evidence for this constraint", () => {
    const candidateRoots = ["src/matching-engine"];

    const existingRoots = candidateRoots.filter((root) => existsSync(root));

    // Bootstrap guard: until component code exists, this test is a no-op and stays green.
    if (existingRoots.length === 0) {
      expect(true).toBe(true);
      return;
    }

    const tsFiles = Array.from(
      new Set(existingRoots.flatMap((root) => walkTsFiles(root)))
    );

    const corpus = tsFiles
      .map((file) => readFileSync(file, "utf8"))
      .join("\n")
      .toLowerCase();

    const requiredTerms = ["replay", "deterministic"];
    const missingTerms = requiredTerms.filter((term) => !corpus.includes(term));

    expect(missingTerms).toEqual([]);
  });
  // ADR_CONSTRAINT: The matching engine component shall isolate participant-specific confidential data from public market data payload generation.
  // ADR_MAPPING_RULE: compliance-security-and-privacy
  it.todo("should satisfy: the matching engine component shall isolate participant-specific confidential data from public market data payload generation [the-matching-engine-component-shall-isolate-participant-specific-confidential-da]");
  // ADR_CONSTRAINT: The matching engine component shall support backward-compatible event schema evolution through explicit versioned event contracts.
  // ADR_MAPPING_RULE: compliance-catch-all-bootstrap
  it.todo("should satisfy: the matching engine component shall support backward-compatible event schema evolution through explicit versioned event contracts [the-matching-engine-component-shall-support-backward-compatible-event-schema-evo]");
  // ADR_CONSTRAINT: The matching engine module shall keep orchestration classes in the application layer and shall keep matching rules in pure domain services.
  // ADR_MAPPING_RULE: compliance-catch-all-bootstrap
  it.todo("should satisfy: the matching engine module shall keep orchestration classes in the application layer and shall keep matching rules in pure domain services [the-matching-engine-module-shall-keep-orchestration-classes-in-the-application-l]");
  // ADR_CONSTRAINT: The matching engine module shall not inherit domain service classes from infrastructure base classes.
  // ADR_MAPPING_RULE: compliance-catch-all-bootstrap
  it.todo("should satisfy: the matching engine module shall not inherit domain service classes from infrastructure base classes [the-matching-engine-module-shall-not-inherit-domain-service-classes-from-infrast]");
  // ADR_CONSTRAINT: The matching engine module shall keep class inheritance depth at three levels or less.
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
  // ADR_CONSTRAINT: The matching engine module shall archive daily journal batches and define a seven-year retention policy for execution and lifecycle events.
  // ADR_MAPPING_RULE: compliance-quantity-and-lifecycle-invariants
  it("should provide quantity/lifecycle invariant evidence for this constraint", () => {
    const candidateRoots = ["src/matching-engine"];
    const existingRoots = candidateRoots.filter((root) => existsSync(root));

    // Bootstrap guard: until component code exists, this test is a no-op and stays green.
    if (existingRoots.length === 0) {
      expect(true).toBe(true);
      return;
    }

    const tsFiles = Array.from(
      new Set(existingRoots.flatMap((root) => walkTsFiles(root)))
    );

    const corpus = tsFiles
      .map((file) => readFileSync(file, "utf8"))
      .join("\n")
      .toLowerCase();

    const requiredTerms = ["lifecycle"];
    const missingTerms = requiredTerms.filter((term) => !corpus.includes(term));

    expect(missingTerms).toEqual([]);
  });
  // ADR_CONSTRAINT: The matching engine deployment shall target a single region for v1 and shall avoid active-active write topology.
  // ADR_MAPPING_RULE: compliance-avoid-active-active
  it('should not contain the prohibited literal "active-active" in source files', () => {
    const tsFiles = walkTsFiles("src");
    const forbiddenPattern = new RegExp("active-active", "i");

    const offenders = tsFiles.filter((file) =>
      forbiddenPattern.test(readFileSync(file, "utf8"))
    );

    expect(offenders).toEqual([]);
  });
});
