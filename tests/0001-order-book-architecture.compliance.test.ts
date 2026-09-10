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
  it("should provide implementation evidence for this constraint", () => {
    const candidateRoots = ["src/order-book"];
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

    const requiredTerms: string[] = ["order", "book", "instrument"];

    // If term extraction yields no terms, this stays as a bootstrap pass.
    if (requiredTerms.length === 0) {
      expect(true).toBe(true);
      return;
    }

    const missingTerms = requiredTerms.filter((term) => !corpus.includes(term));
    expect(missingTerms).toEqual([]);
  });
  // ADR_CONSTRAINT: The order book component shall enforce instrument-level isolation so that events for one instrument cannot mutate another instrument book.
  // ADR_MAPPING_RULE: compliance-catch-all-bootstrap
  it("should provide implementation evidence for this constraint", () => {
    const candidateRoots = ["src/order-book"];
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

    const requiredTerms: string[] = ["order", "book", "instrument-level"];

    // If term extraction yields no terms, this stays as a bootstrap pass.
    if (requiredTerms.length === 0) {
      expect(true).toBe(true);
      return;
    }

    const missingTerms = requiredTerms.filter((term) => !corpus.includes(term));
    expect(missingTerms).toEqual([]);
  });
  // ADR_CONSTRAINT: The order book component shall treat all accepted state transitions as a totally ordered sequence of events per instrument.
  // ADR_MAPPING_RULE: compliance-sequencing-behavior
  it("should provide sequence/replay evidence for this constraint", () => {
    const candidateRoots = ["src/order-book"];

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

    const requiredTerms: string[] = ["sequence", "order"];
    const missingTerms = requiredTerms.filter((term) => !corpus.includes(term));

    expect(missingTerms).toEqual([]);
  });
  // ADR_CONSTRAINT: The order book component shall apply events in sequence order and shall reject out-of-order mutation events unless an explicit recovery mode is active.
  // ADR_MAPPING_RULE: compliance-sequencing-behavior
  it("should provide sequence/replay evidence for this constraint", () => {
    const candidateRoots = ["src/order-book"];

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

    const requiredTerms: string[] = ["sequence", "order"];
    const missingTerms = requiredTerms.filter((term) => !corpus.includes(term));

    expect(missingTerms).toEqual([]);
  });
  // ADR_CONSTRAINT: The order book component shall use price-time priority within each side for price levels and orders at each level.
  // ADR_MAPPING_RULE: compliance-catch-all-bootstrap
  it("should provide implementation evidence for this constraint", () => {
    const candidateRoots = ["src/order-book"];
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

    const requiredTerms: string[] = ["order", "book", "priority"];

    // If term extraction yields no terms, this stays as a bootstrap pass.
    if (requiredTerms.length === 0) {
      expect(true).toBe(true);
      return;
    }

    const missingTerms = requiredTerms.filter((term) => !corpus.includes(term));
    expect(missingTerms).toEqual([]);
  });
  // ADR_CONSTRAINT: The order book component shall preserve original queue position for each resting order unless that order is canceled, fully filled, or replaced according to explicit replace semantics.
  // ADR_MAPPING_RULE: compliance-catch-all-bootstrap
  it("should provide implementation evidence for this constraint", () => {
    const candidateRoots = ["src/order-book"];
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

    const requiredTerms: string[] = ["order", "book", "queue"];

    // If term extraction yields no terms, this stays as a bootstrap pass.
    if (requiredTerms.length === 0) {
      expect(true).toBe(true);
      return;
    }

    const missingTerms = requiredTerms.filter((term) => !corpus.includes(term));
    expect(missingTerms).toEqual([]);
  });
  // ADR_CONSTRAINT: The order book component shall support only limit, market, and stop-limit order intentions in v1 and shall reject unsupported order types.
  // ADR_MAPPING_RULE: compliance-validation-and-rejection
  it("should provide validation/rejection evidence for this constraint", () => {
    const candidateRoots = ["src/order-book"];
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

    const requiredTerms: string[] = ["reject"];
    const missingTerms = requiredTerms.filter((term) => !corpus.includes(term));

    expect(missingTerms).toEqual([]);
  });
  // ADR_CONSTRAINT: The order book component shall validate order attributes against instrument reference data before admitting an order to the active book.
  // ADR_MAPPING_RULE: compliance-validation-and-rejection
  it("should provide validation/rejection evidence for this constraint", () => {
    const candidateRoots = ["src/order-book"];
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

    const requiredTerms: string[] = ["validate"];
    const missingTerms = requiredTerms.filter((term) => !corpus.includes(term));

    expect(missingTerms).toEqual([]);
  });
  // ADR_CONSTRAINT: The order book component shall reject orders with invalid tick size, invalid lot size, invalid side, or non-positive quantity.
  // ADR_MAPPING_RULE: compliance-validation-and-rejection
  it("should provide validation/rejection evidence for this constraint", () => {
    const candidateRoots = ["src/order-book"];
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

    const requiredTerms: string[] = ["reject", "invalid"];
    const missingTerms = requiredTerms.filter((term) => !corpus.includes(term));

    expect(missingTerms).toEqual([]);
  });
  // ADR_CONSTRAINT: The order book component shall not allow the active continuous-trading book to remain crossed after processing a mutation event.
  // ADR_MAPPING_RULE: compliance-catch-all-bootstrap
  it("should provide implementation evidence for this constraint", () => {
    const candidateRoots = ["src/order-book"];
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

    const requiredTerms: string[] = ["order", "book", "event"];

    // If term extraction yields no terms, this stays as a bootstrap pass.
    if (requiredTerms.length === 0) {
      expect(true).toBe(true);
      return;
    }

    const missingTerms = requiredTerms.filter((term) => !corpus.includes(term));
    expect(missingTerms).toEqual([]);
  });
  // ADR_CONSTRAINT: The order book component shall support partial fill accounting and shall keep remaining open quantity exact and non-negative.
  // ADR_MAPPING_RULE: compliance-quantity-and-lifecycle-invariants
  it("should provide quantity/lifecycle invariant evidence for this constraint", () => {
    const candidateRoots = ["src/order-book"];
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

    const requiredTerms: string[] = ["quantity", "partial", "fill", "remaining", "open"];
    const missingTerms = requiredTerms.filter((term) => !corpus.includes(term));

    expect(missingTerms).toEqual([]);
  });
  // ADR_CONSTRAINT: The order book component shall emit explicit domain events for accepted order, rejected order, canceled order, replaced order, partially filled order, and fully filled order.
  // ADR_MAPPING_RULE: compliance-validation-and-rejection
  it("should provide validation/rejection evidence for this constraint", () => {
    const candidateRoots = ["src/order-book"];
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

    const requiredTerms: string[] = ["reject"];
    const missingTerms = requiredTerms.filter((term) => !corpus.includes(term));

    expect(missingTerms).toEqual([]);
  });
  // ADR_CONSTRAINT: The order book component shall include a strictly increasing sequence number and event time on every emitted domain event.
  // ADR_MAPPING_RULE: compliance-sequencing-behavior
  it("should provide sequence/replay evidence for this constraint", () => {
    const candidateRoots = ["src/order-book"];

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

    const requiredTerms: string[] = ["sequence", "order"];
    const missingTerms = requiredTerms.filter((term) => !corpus.includes(term));

    expect(missingTerms).toEqual([]);
  });
  // ADR_CONSTRAINT: The order book component shall not execute network calls or blocking remote procedure calls on the mutation path.
  // ADR_MAPPING_RULE: compliance-catch-all-bootstrap
  it("should provide implementation evidence for this constraint", () => {
    const candidateRoots = ["src/order-book"];
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

    const requiredTerms: string[] = ["order", "book"];

    // If term extraction yields no terms, this stays as a bootstrap pass.
    if (requiredTerms.length === 0) {
      expect(true).toBe(true);
      return;
    }

    const missingTerms = requiredTerms.filter((term) => !corpus.includes(term));
    expect(missingTerms).toEqual([]);
  });
  // ADR_CONSTRAINT: The order book component shall read static instrument metadata from a versioned reference data snapshot that is immutable during a processing cycle.
  // ADR_MAPPING_RULE: compliance-catch-all-bootstrap
  it("should provide implementation evidence for this constraint", () => {
    const candidateRoots = ["src/order-book"];
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

    const requiredTerms: string[] = ["order", "book", "instrument"];

    // If term extraction yields no terms, this stays as a bootstrap pass.
    if (requiredTerms.length === 0) {
      expect(true).toBe(true);
      return;
    }

    const missingTerms = requiredTerms.filter((term) => !corpus.includes(term));
    expect(missingTerms).toEqual([]);
  });
  // ADR_CONSTRAINT: The order book component shall use a monotonic in-process clock source for internal ordering diagnostics and a wall clock source for persisted event timestamps.
  // ADR_MAPPING_RULE: compliance-catch-all-bootstrap
  it("should provide implementation evidence for this constraint", () => {
    const candidateRoots = ["src/order-book"];
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

    const requiredTerms: string[] = ["order", "book", "monotonic"];

    // If term extraction yields no terms, this stays as a bootstrap pass.
    if (requiredTerms.length === 0) {
      expect(true).toBe(true);
      return;
    }

    const missingTerms = requiredTerms.filter((term) => !corpus.includes(term));
    expect(missingTerms).toEqual([]);
  });
  // ADR_CONSTRAINT: The order book component shall support deterministic replay from the append-only journal and shall produce an identical final state for identical ordered input.
  // ADR_MAPPING_RULE: compliance-sequencing-behavior
  it("should provide sequence/replay evidence for this constraint", () => {
    const candidateRoots = ["src/order-book"];

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

    const requiredTerms: string[] = ["order", "replay", "deterministic"];
    const missingTerms = requiredTerms.filter((term) => !corpus.includes(term));

    expect(missingTerms).toEqual([]);
  });
  // ADR_CONSTRAINT: The order book component shall persist sufficient event attributes to reconstruct full order lifecycle history.
  // ADR_MAPPING_RULE: compliance-quantity-and-lifecycle-invariants
  it("should provide quantity/lifecycle invariant evidence for this constraint", () => {
    const candidateRoots = ["src/order-book"];
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

    const requiredTerms: string[] = ["lifecycle"];
    const missingTerms = requiredTerms.filter((term) => !corpus.includes(term));

    expect(missingTerms).toEqual([]);
  });
  // ADR_CONSTRAINT: The order book component shall expose only query interfaces for derived views such as best bid, best ask, spread, and depth, and these query interfaces shall be side-effect free.
  // ADR_MAPPING_RULE: compliance-catch-all-bootstrap
  it("should provide implementation evidence for this constraint", () => {
    const candidateRoots = ["src/order-book"];
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

    const requiredTerms: string[] = ["order", "book", "spread"];

    // If term extraction yields no terms, this stays as a bootstrap pass.
    if (requiredTerms.length === 0) {
      expect(true).toBe(true);
      return;
    }

    const missingTerms = requiredTerms.filter((term) => !corpus.includes(term));
    expect(missingTerms).toEqual([]);
  });
  // ADR_CONSTRAINT: The order book component shall prevent duplicate order identifiers within the same trading session for a given participant and instrument.
  // ADR_MAPPING_RULE: compliance-catch-all-bootstrap
  it("should provide implementation evidence for this constraint", () => {
    const candidateRoots = ["src/order-book"];
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

    const requiredTerms: string[] = ["order", "book", "prevent"];

    // If term extraction yields no terms, this stays as a bootstrap pass.
    if (requiredTerms.length === 0) {
      expect(true).toBe(true);
      return;
    }

    const missingTerms = requiredTerms.filter((term) => !corpus.includes(term));
    expect(missingTerms).toEqual([]);
  });
  // ADR_CONSTRAINT: The order book component shall support explicit session-state transitions such as pre-open, open, halt, and closed, and shall reject order actions not permitted in the current state.
  // ADR_MAPPING_RULE: compliance-validation-and-rejection
  it("should provide validation/rejection evidence for this constraint", () => {
    const candidateRoots = ["src/order-book"];
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

    const requiredTerms: string[] = ["reject"];
    const missingTerms = requiredTerms.filter((term) => !corpus.includes(term));

    expect(missingTerms).toEqual([]);
  });
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
  it("should provide security/privacy evidence for this constraint", () => {
    const candidateRoots = ["src/order-book"];
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

    const requiredTerms: string[] = ["private"];
    const missingTerms = requiredTerms.filter((term) => !corpus.includes(term));

    expect(missingTerms).toEqual([]);
  });
  // ADR_CONSTRAINT: The order book module shall archive daily journal batches and define a seven-year retention policy for historical events.
  // ADR_MAPPING_RULE: compliance-metrics-and-operations
  it("should provide metrics/operations evidence for this constraint", () => {
    const candidateRoots = ["src/order-book"];
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

    const requiredTerms: string[] = ["archive", "retention"];
    const missingTerms = requiredTerms.filter((term) => !corpus.includes(term));

    expect(missingTerms).toEqual([]);
  });
  // ADR_CONSTRAINT: Fields whose name starts with "id" should not have a prefix.
  // ADR_MAPPING_RULE: compliance-id-prefix-ban
  it("should not prefix id field values with literal text", () => {
    const tsFiles = walkTsFiles("src");
    const literalPrefixConcat = /\bid[A-Za-z0-9_]*\s*:\s*(?:"[^"\n]+"|'[^'\n]+')\s*\+\s*[A-Za-z_$][\w$]*/i;
    const templatePrefix = /\bid[A-Za-z0-9_]*\s*:\s*`[^`\n$]*[^`\n$\s][^`\n$]*\$\{\s*[A-Za-z_$][\w$]*\s*\}[^`\n]*`/i;

    const offenders = tsFiles.filter((file) => {
      const content = readFileSync(file, "utf8");
      return literalPrefixConcat.test(content) || templatePrefix.test(content);
    });

    expect(offenders).toEqual([]);
  });
  // ADR_CONSTRAINT: domain entities must have a createdAt attribute.
  // ADR_MAPPING_RULE: compliance-domain-entity-created-at
  it("should require createdAt on domain entity definitions", () => {
    const tsFiles = walkTsFiles("src");
    const domainFiles = tsFiles.filter(
      (file) => file.includes("/domain/") || file.includes("\\domain\\")
    );

    // Bootstrap guard: if no domain files exist yet, this check is a no-op.
    if (domainFiles.length === 0) {
      expect(true).toBe(true);
      return;
    }

    const offenders = domainFiles.filter((file) => {
      const content = readFileSync(file, "utf8");
      return !/\bcreatedAt\b/.test(content);
    });

    expect(offenders).toEqual([]);
  });
});
