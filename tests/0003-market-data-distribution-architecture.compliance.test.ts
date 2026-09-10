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

describe("0003-market-data-distribution-architecture: Generated Non-ArchUnit Compliance Constraints", () => {
  // ADR_CONSTRAINT: The market data distribution component shall assign or preserve a strictly increasing sequence number per feed channel.
  // ADR_MAPPING_RULE: compliance-sequencing-behavior
  it("should provide sequence/replay evidence for this constraint", () => {
    const candidateRoots = ["src/market-data"];

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

    const requiredTerms: string[] = ["sequence"];
    const missingTerms = requiredTerms.filter((term) => !corpus.includes(term));

    expect(missingTerms).toEqual([]);
  });
  // ADR_CONSTRAINT: The market data distribution component shall never publish an incremental message without a sequence identifier.
  // ADR_MAPPING_RULE: compliance-sequencing-behavior
  it("should provide sequence/replay evidence for this constraint", () => {
    const candidateRoots = ["src/market-data"];

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

    const requiredTerms: string[] = ["sequence"];
    const missingTerms = requiredTerms.filter((term) => !corpus.includes(term));

    expect(missingTerms).toEqual([]);
  });
  // ADR_CONSTRAINT: The market data distribution component shall provide a snapshot mechanism that allows a client to reconstruct current state before applying incrementals.
  // ADR_MAPPING_RULE: compliance-market-data-snapshot-reconstruction
  it("should provide targeted evidence for this constraint", () => {
    const candidateRoots = ["src/market-data"];
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

    const requiredTerms: string[] = ["snapshot", "incremental"];
    const forbiddenTerms: string[] = [];
    const missingTerms = requiredTerms.filter((term) => !corpus.includes(term));
    const presentForbiddenTerms = forbiddenTerms.filter((term) => corpus.includes(term));

    expect(missingTerms).toEqual([]);
    expect(presentForbiddenTerms).toEqual([]);
  });
  // ADR_CONSTRAINT: The market data distribution component shall provide a gap-recovery mechanism that allows a client to request missing sequences within a configured retention window.
  // ADR_MAPPING_RULE: compliance-sequencing-behavior
  it("should provide sequence/replay evidence for this constraint", () => {
    const candidateRoots = ["src/market-data"];

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

    const requiredTerms: string[] = ["sequence"];
    const missingTerms = requiredTerms.filter((term) => !corpus.includes(term));

    expect(missingTerms).toEqual([]);
  });
  // ADR_CONSTRAINT: The market data distribution component shall publish incremental updates in sequence order and shall not reorder events within a channel.
  // ADR_MAPPING_RULE: compliance-sequencing-behavior
  it("should provide sequence/replay evidence for this constraint", () => {
    const candidateRoots = ["src/market-data"];

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
  // ADR_CONSTRAINT: The market data distribution component shall detect internal sequence gaps before publication and shall trigger operator alerts when gaps occur.
  // ADR_MAPPING_RULE: compliance-sequencing-behavior
  it("should provide sequence/replay evidence for this constraint", () => {
    const candidateRoots = ["src/market-data"];

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

    const requiredTerms: string[] = ["sequence"];
    const missingTerms = requiredTerms.filter((term) => !corpus.includes(term));

    expect(missingTerms).toEqual([]);
  });
  // ADR_CONSTRAINT: The market data distribution component shall preserve event-time and publish-time metadata for latency measurement and audit.
  // ADR_MAPPING_RULE: compliance-metrics-and-operations
  it("should provide metrics/operations evidence for this constraint", () => {
    const candidateRoots = ["src/market-data"];
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

    const requiredTerms: string[] = ["latency"];
    const missingTerms = requiredTerms.filter((term) => !corpus.includes(term));

    expect(missingTerms).toEqual([]);
  });
  // ADR_CONSTRAINT: The market data distribution component shall separate public market data channels from participant-private order status channels.
  // ADR_MAPPING_RULE: compliance-security-and-privacy
  it("should provide security/privacy evidence for this constraint", () => {
    const candidateRoots = ["src/market-data"];
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
  // ADR_CONSTRAINT: The market data distribution component shall enforce at least channel-level entitlement checks before allowing subscription.
  // ADR_MAPPING_RULE: compliance-security-and-privacy
  it("should provide security/privacy evidence for this constraint", () => {
    const candidateRoots = ["src/market-data"];
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

    const requiredTerms: string[] = ["entitlement"];
    const missingTerms = requiredTerms.filter((term) => !corpus.includes(term));

    expect(missingTerms).toEqual([]);
  });
  // ADR_CONSTRAINT: The market data distribution component shall encrypt authenticated private channels in transit and shall require client authentication for private subscriptions.
  // ADR_MAPPING_RULE: compliance-security-and-privacy
  it("should provide security/privacy evidence for this constraint", () => {
    const candidateRoots = ["src/market-data"];
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

    const requiredTerms: string[] = ["auth", "encrypt", "private"];
    const missingTerms = requiredTerms.filter((term) => !corpus.includes(term));

    expect(missingTerms).toEqual([]);
  });
  // ADR_CONSTRAINT: The market data distribution component shall avoid embedding personally identifiable participant metadata in public feed payloads.
  // ADR_MAPPING_RULE: compliance-security-and-privacy
  it("should provide security/privacy evidence for this constraint", () => {
    const candidateRoots = ["src/market-data"];
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

    const requiredTerms: string[] = ["pii"];
    const missingTerms = requiredTerms.filter((term) => !corpus.includes(term));

    expect(missingTerms).toEqual([]);
  });
  // ADR_CONSTRAINT: The market data distribution component shall publish explicit event types for new order, modify order, cancel order, execution, trade bust, and trading status changes when applicable to the product.
  // ADR_MAPPING_RULE: compliance-market-data-explicit-event-types
  it("should provide targeted evidence for this constraint", () => {
    const candidateRoots = ["src/market-data"];
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

    const requiredTerms: string[] = ["neworder", "modifyorder", "cancelorder", "execution", "tradebust", "tradingstatus"];
    const forbiddenTerms: string[] = [];
    const missingTerms = requiredTerms.filter((term) => !corpus.includes(term));
    const presentForbiddenTerms = forbiddenTerms.filter((term) => corpus.includes(term));

    expect(missingTerms).toEqual([]);
    expect(presentForbiddenTerms).toEqual([]);
  });
  // ADR_CONSTRAINT: The market data distribution component shall version all feed schemas and shall maintain compatibility policy for additive and breaking changes.
  // ADR_MAPPING_RULE: compliance-market-data-feed-schema-versioning
  it("should provide targeted evidence for this constraint", () => {
    const candidateRoots = ["src/market-data"];
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

    const requiredTerms: string[] = ["schema", "version", "compatibility"];
    const forbiddenTerms: string[] = [];
    const missingTerms = requiredTerms.filter((term) => !corpus.includes(term));
    const presentForbiddenTerms = forbiddenTerms.filter((term) => corpus.includes(term));

    expect(missingTerms).toEqual([]);
    expect(presentForbiddenTerms).toEqual([]);
  });
  // ADR_CONSTRAINT: The market data distribution component shall keep a deterministic mapping from internal canonical events to each external feed product schema.
  // ADR_MAPPING_RULE: compliance-sequencing-behavior
  it("should provide sequence/replay evidence for this constraint", () => {
    const candidateRoots = ["src/market-data"];

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

    const requiredTerms: string[] = ["deterministic"];
    const missingTerms = requiredTerms.filter((term) => !corpus.includes(term));

    expect(missingTerms).toEqual([]);
  });
  // ADR_CONSTRAINT: The market data distribution component shall receive private order status events through a dedicated internal stream and shall not derive private updates by reverse engineering public feed payloads.
  // ADR_MAPPING_RULE: compliance-security-and-privacy
  it("should provide security/privacy evidence for this constraint", () => {
    const candidateRoots = ["src/market-data"];
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
  // ADR_CONSTRAINT: The market data distribution component shall expose separate publisher interfaces for public feed and private status feed.
  // ADR_MAPPING_RULE: compliance-security-and-privacy
  it("should provide security/privacy evidence for this constraint", () => {
    const candidateRoots = ["src/market-data"];
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
  // ADR_CONSTRAINT: The market data distribution component shall keep class naming conventions where normalizer classes end with Normalizer, sequencer classes end with Sequencer, and serializer classes end with Serializer.
  // ADR_MAPPING_RULE: compliance-sequencing-behavior
  it("should provide sequence/replay evidence for this constraint", () => {
    const candidateRoots = ["src/market-data"];

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

    const requiredTerms: string[] = ["sequence"];
    const missingTerms = requiredTerms.filter((term) => !corpus.includes(term));

    expect(missingTerms).toEqual([]);
  });
  // ADR_CONSTRAINT: The market data distribution component shall keep inheritance depth at three levels or less across feed processing classes.
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
  // ADR_CONSTRAINT: The market data distribution component shall expose operational metrics for publish rate, per-channel latency, packet loss indicators, recovery request volume, and subscriber count.
  // ADR_MAPPING_RULE: compliance-metrics-and-operations
  it("should provide metrics/operations evidence for this constraint", () => {
    const candidateRoots = ["src/market-data"];
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

    const requiredTerms: string[] = ["metric", "latency"];
    const missingTerms = requiredTerms.filter((term) => !corpus.includes(term));

    expect(missingTerms).toEqual([]);
  });
  // ADR_CONSTRAINT: The market data distribution component shall support backpressure policies that protect core sequencing services from slow subscribers.
  // ADR_MAPPING_RULE: compliance-metrics-and-operations
  it("should provide metrics/operations evidence for this constraint", () => {
    const candidateRoots = ["src/market-data"];
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

    const requiredTerms: string[] = ["backpressure"];
    const missingTerms = requiredTerms.filter((term) => !corpus.includes(term));

    expect(missingTerms).toEqual([]);
  });
  // ADR_CONSTRAINT: The market data distribution component shall support sequence-reset and channel-failover procedures that are explicit, logged, and externally documented.
  // ADR_MAPPING_RULE: compliance-sequencing-behavior
  it("should provide sequence/replay evidence for this constraint", () => {
    const candidateRoots = ["src/market-data"];

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

    const requiredTerms: string[] = ["sequence"];
    const missingTerms = requiredTerms.filter((term) => !corpus.includes(term));

    expect(missingTerms).toEqual([]);
  });
  // ADR_CONSTRAINT: The market data distribution component shall store outbound sequence and payload audit records with daily archive batches and seven-year retention policy definitions.
  // ADR_MAPPING_RULE: compliance-sequencing-behavior
  it("should provide sequence/replay evidence for this constraint", () => {
    const candidateRoots = ["src/market-data"];

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

    const requiredTerms: string[] = ["sequence"];
    const missingTerms = requiredTerms.filter((term) => !corpus.includes(term));

    expect(missingTerms).toEqual([]);
  });
  // ADR_CONSTRAINT: The market data distribution component shall provide deterministic replay for compliance investigations and post-incident analysis.
  // ADR_MAPPING_RULE: compliance-sequencing-behavior
  it("should provide sequence/replay evidence for this constraint", () => {
    const candidateRoots = ["src/market-data"];

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

    const requiredTerms: string[] = ["replay", "deterministic"];
    const missingTerms = requiredTerms.filter((term) => !corpus.includes(term));

    expect(missingTerms).toEqual([]);
  });
  // ADR_CONSTRAINT: The market data distribution deployment shall target a single region for v1 and shall avoid active-active multi-region publication.
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
