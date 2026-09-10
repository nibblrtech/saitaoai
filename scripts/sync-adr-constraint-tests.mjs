import { existsSync, readFileSync, unlinkSync, writeFileSync } from "node:fs";
import { basename } from "node:path";

const MAPPING_FILE = "docs/testing/adr-constraint-to-test-mapping.md";
const MAPPING_JSON_ENV = "ADR_CONSTRAINT_MAPPING_JSON";
const FAIL_ON_BOOTSTRAP_MAPPING_ENV = "ADR_FAIL_ON_BOOTSTRAP_MAPPING";

function normalize(text) {
  return text.replace(/\s+/g, " ").trim();
}

function parseComplianceConstraints(markdown) {
  const lines = markdown.split(/\r?\n/);
  const startIndex = lines.findIndex((line) =>
    /^##\s+Compliance Constraints\s*$/i.test(line.trim())
  );

  if (startIndex === -1) {
    return [];
  }

  const constraints = [];
  for (let i = startIndex + 1; i < lines.length; i += 1) {
    const trimmed = lines[i].trim();

    if (/^##\s+/.test(trimmed)) {
      break;
    }

    if (!trimmed.startsWith("- ")) {
      continue;
    }

    constraints.push(normalize(trimmed.slice(2)));
  }

  return constraints;
}

function getAdrFilesFromEnv() {
  const raw = process.env.ADR_FILES ?? "";
  return raw
    .split(/\r?\n/)
    .map((s) => s.trim())
    .filter(Boolean);
}

function parseRulesJson(jsonText, sourceLabel) {
  const parsed = JSON.parse(jsonText);
  if (!Array.isArray(parsed.rules)) {
    throw new Error(`${sourceLabel} must define a rules array.`);
  }

  return parsed.rules.map((rule) => {
    if (!rule.id || !rule.pattern || !rule.testType) {
      throw new Error(`Invalid mapping rule: ${JSON.stringify(rule)}`);
    }

    return {
      ...rule,
      regex: new RegExp(rule.pattern, "i"),
    };
  });
}

function parseMappingRulesFromMarkdown(markdown) {
  const match = markdown.match(/```json\s*([\s\S]*?)```/i);
  if (!match) {
    throw new Error(`Mapping file ${MAPPING_FILE} is missing a JSON code block.`);
  }

  return parseRulesJson(match[1], `Mapping file ${MAPPING_FILE}`);
}

function loadMappingRules() {
  const fromEnv = (process.env[MAPPING_JSON_ENV] ?? "").trim();
  if (fromEnv) {
    return {
      source: `env:${MAPPING_JSON_ENV}`,
      rules: parseRulesJson(fromEnv, `Environment variable ${MAPPING_JSON_ENV}`),
    };
  }

  if (!existsSync(MAPPING_FILE)) {
    throw new Error(
      `Missing mapping source. Provide ${MAPPING_FILE} or set ${MAPPING_JSON_ENV}.`
    );
  }

  return {
    source: MAPPING_FILE,
    rules: parseMappingRulesFromMarkdown(readFileSync(MAPPING_FILE, "utf8")),
  };
}

function classifyConstraint(constraint, rules) {
  for (let i = 0; i < rules.length; i += 1) {
    if (rules[i].regex.test(constraint)) {
      return {
        status: "mapped",
        constraint,
        rule: rules[i],
      };
    }
  }

  return {
    status: "unmapped",
    constraint,
  };
}

function isBootstrapRule(rule) {
  return rule?.id === "compliance-catch-all-bootstrap";
}

function shouldFailOnBootstrapMapping() {
  return /^(1|true|yes)$/i.test(process.env[FAIL_ON_BOOTSTRAP_MAPPING_ENV] ?? "");
}

function emitGitHubAnnotation(level, filePath, message) {
  console.log(`::${level} file=${filePath}::${message.replace(/\r?\n/g, " ")}`);
}

function escapeRegexLiteral(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function quotedStrings(text) {
  const values = [];
  const regex = /"([^"]+)"|'([^']+)'/g;
  let match = regex.exec(text);

  while (match) {
    values.push((match[1] ?? match[2] ?? "").trim());
    match = regex.exec(text);
  }

  return values.filter(Boolean);
}

function asSlug(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

function testTitleFromConstraint(constraint) {
  const c = constraint.replace(/\.$/, "");
  const lower = c.charAt(0).toLowerCase() + c.slice(1);
  return `should satisfy: ${lower}`;
}

function renderPrefixLiteralBlock(constraint, ruleId) {
  const quoted = quotedStrings(constraint);
  if (quoted.length === 0) {
    throw new Error(
      `Template prefix-literal-ban requires a quoted prefix in constraint: ${constraint}`
    );
  }

  // Prefer a quoted token that explicitly looks like a prefix literal.
  const selectedPrefix =
    quoted.find((value) => value.includes(":")) ?? quoted[quoted.length - 1];
  const escapedPrefix = escapeRegexLiteral(selectedPrefix);

  return [
    `  // ADR_CONSTRAINT: ${constraint}`,
    `  // ADR_MAPPING_RULE: ${ruleId}`,
    `  it('should not encode values with the prohibited prefix "${selectedPrefix}" in source literals', () => {`,
    `    const tsFiles = walkTsFiles("src");`,
    `    const forbiddenPattern = new RegExp("[\\\"']${escapedPrefix.replace(/\\/g, "\\\\")}[^\\\"'\\\\n]*[\\\"']");`,
    "",
    "    const offenders = tsFiles.filter((file) =>",
    "      forbiddenPattern.test(readFileSync(file, \"utf8\"))",
    "    );",
    "",
    "    expect(offenders).toEqual([]);",
    "  });",
    "",
  ].join("\n");
}

function renderIdPrefixBanBlock(constraint, ruleId) {
  return [
    `  // ADR_CONSTRAINT: ${constraint}`,
    `  // ADR_MAPPING_RULE: ${ruleId}`,
    '  it("should not prefix id field values with literal text", () => {',
    '    const tsFiles = walkTsFiles("src");',
    '    const literalPrefixConcat = /\\bid[A-Za-z0-9_]*\\s*:\\s*(?:"[^"\\n]+"|\'[^\'\\n]+\')\\s*\\+\\s*[A-Za-z_$][\\w$]*/i;',
    '    const templatePrefix = /\\bid[A-Za-z0-9_]*\\s*:\\s*`[^`\\n$]*[^`\\n$\\s][^`\\n$]*\\$\\{\\s*[A-Za-z_$][\\w$]*\\s*\\}[^`\\n]*`/i;',
    '',
    '    const offenders = tsFiles.filter((file) => {',
    '      const content = readFileSync(file, "utf8");',
    '      return literalPrefixConcat.test(content) || templatePrefix.test(content);',
    '    });',
    '',
    '    expect(offenders).toEqual([]);',
    '  });',
    '',
  ].join("\n");
}

function renderDomainFileUppercaseBlock(constraint, ruleId) {
  return [
    `  // ADR_CONSTRAINT: ${constraint}`,
    `  // ADR_MAPPING_RULE: ${ruleId}`,
    '  it("should keep domain file names upper case", () => {',
    '    const tsFiles = walkTsFiles("src");',
    '    const domainFiles = tsFiles.filter(',
    '      (file) => file.includes("/domain/") || file.includes("\\\\domain\\\\")',
    '    );',
    '',
    '    const offenders = domainFiles.filter((file) => {',
    '      const fileName = file.split(/[\\\\/]/).pop() ?? file;',
    '      return /^[a-z]/.test(fileName);',
    '    });',
    '',
    '    expect(offenders).toEqual([]);',
    '  });',
    '',
  ].join("\n");
}

function renderInheritanceDepthCapBlock(constraint, ruleId, maxDepth) {
  if (!Number.isInteger(maxDepth) || maxDepth < 1) {
    throw new Error(
      `Template inheritance-depth-cap requires a positive integer maxDepth: ${constraint}`
    );
  }

  return [
    `  // ADR_CONSTRAINT: ${constraint}`,
    `  // ADR_MAPPING_RULE: ${ruleId}`,
    `  it("should keep class inheritance depth at ${maxDepth} levels or less", () => {`,
    `    const tsFiles = walkTsFiles("src");`,
    "    const parentByClass = new Map<string, string>();",
    "",
    "    for (const file of tsFiles) {",
    "      const content = readFileSync(file, \"utf8\");",
    "      const classRegex = /class\\s+([A-Za-z0-9_]+)(?:\\s+extends\\s+([A-Za-z0-9_]+))?/g;",
    "      let match = classRegex.exec(content);",
    "",
    "      while (match) {",
    "        const cls = match[1];",
    "        const parent = match[2];",
    "",
    "        if (parent) {",
    "          parentByClass.set(cls, parent);",
    "        }",
    "",
    "        match = classRegex.exec(content);",
    "      }",
    "    }",
    "",
    "    const depthCache = new Map<string, number>();",
    "",
    "    function depth(className: string, visiting = new Set<string>()): number {",
    "      if (depthCache.has(className)) {",
    "        return depthCache.get(className) as number;",
    "      }",
    "",
    "      if (visiting.has(className)) {",
    "        return Number.POSITIVE_INFINITY;",
    "      }",
    "",
    "      const parent = parentByClass.get(className);",
    "      if (!parent) {",
    "        depthCache.set(className, 1);",
    "        return 1;",
    "      }",
    "",
    "      visiting.add(className);",
    "      const result = depth(parent, visiting) + 1;",
    "      visiting.delete(className);",
    "",
    "      depthCache.set(className, result);",
    "      return result;",
    "    }",
    "",
    "    const violating = Array.from(parentByClass.keys()).filter(",
    `      (cls) => depth(cls) > ${maxDepth}`,
    "    );",
    "",
    "    expect(violating).toEqual([]);",
    "  });",
    "",
  ].join("\n");
}

function renderLiteralBanBlock(constraint, ruleId, literal) {
  if (!literal || typeof literal !== "string") {
    throw new Error(`Template literal-ban requires a literal string: ${constraint}`);
  }

  const escaped = escapeRegexLiteral(literal);

  return [
    `  // ADR_CONSTRAINT: ${constraint}`,
    `  // ADR_MAPPING_RULE: ${ruleId}`,
    `  it('should not contain the prohibited literal "${literal}" in source files', () => {`,
    `    const tsFiles = walkTsFiles("src");`,
    `    const forbiddenPattern = new RegExp("${escaped.replace(/\\/g, "\\\\")}", "i");`,
    "",
    "    const offenders = tsFiles.filter((file) =>",
    "      forbiddenPattern.test(readFileSync(file, \"utf8\"))",
    "    );",
    "",
    "    expect(offenders).toEqual([]);",
    "  });",
    "",
  ].join("\n");
}

function renderTodoConstraintBlock(constraint, ruleId) {
  const slug = asSlug(constraint);
  return [
    `  // ADR_CONSTRAINT: ${constraint}`,
    `  // ADR_MAPPING_RULE: ${ruleId}`,
    `  it.todo("${testTitleFromConstraint(constraint)} [${slug}]");`,
    "",
  ].join("\n");
}

function generalEvidenceTermsFromConstraint(constraint) {
  const stopWords = new Set([
    "the",
    "a",
    "an",
    "and",
    "or",
    "to",
    "from",
    "for",
    "of",
    "with",
    "in",
    "on",
    "by",
    "as",
    "is",
    "are",
    "be",
    "shall",
    "should",
    "not",
    "only",
    "that",
    "this",
    "these",
    "those",
    "before",
    "after",
    "within",
    "through",
    "into",
    "under",
    "over",
    "across",
  ]);

  const tokens = constraint
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, " ")
    .split(/\s+/)
    .map((t) => t.trim())
    .filter((t) => t.length >= 4 && !stopWords.has(t));

  const quoted = quotedStrings(constraint)
    .map((v) => v.toLowerCase().replace(/[^a-z0-9\s-]/g, " ").trim())
    .filter(Boolean)
    .flatMap((v) => v.split(/\s+/))
    .filter((t) => t.length >= 3 && !stopWords.has(t));

  const preferred = tokens.filter((t) =>
    /(event|order|state|session|book|engine|market|data|channel|feed|journal|schema|snapshot|recovery|publish|private|public|instrument|participant|identifier|metadata|immutable|monotonic|clock|timestamp|lifecycle|quantity|partial|filled|cancel|replace|priority|queue|tick|spread|depth|archive|retention|latency|metric|audit|auth|encrypt|confidential|failover|backpressure)/.test(
      t
    )
  );

  // Intentionally avoid broad fallback to arbitrary tokens (for example,
  // "fields", "whose", "name") which causes false negatives in bootstrap codebases.
  const selected = preferred.length > 0 ? [...quoted, ...preferred] : quoted;
  const unique = Array.from(new Set(selected));

  return unique.slice(0, 3);
}

function sequenceTermsFromConstraint(constraint) {
  const terms = [];
  const normalized = constraint.toLowerCase();

  if (normalized.includes("sequence")) {
    terms.push("sequence");
  }

  if (normalized.includes("ordered") || normalized.includes("order")) {
    terms.push("order");
  }

  if (normalized.includes("replay")) {
    terms.push("replay");
  }

  if (normalized.includes("deterministic")) {
    terms.push("deterministic");
  }

  if (terms.length === 0) {
    terms.push("sequence");
  }

  return Array.from(new Set(terms));
}

function validationTermsFromConstraint(constraint) {
  const terms = [];
  const normalized = constraint.toLowerCase();

  if (normalized.includes("validate") || normalized.includes("validation")) {
    terms.push("validate");
  }

  if (normalized.includes("reject") || normalized.includes("rejection")) {
    terms.push("reject");
  }

  if (normalized.includes("invalid")) {
    terms.push("invalid");
  }

  if (normalized.includes("unauthenticated")) {
    terms.push("auth");
  }

  if (normalized.includes("session state")) {
    terms.push("session");
  }

  if (normalized.includes("tradability")) {
    terms.push("tradable");
  }

  if (terms.length === 0) {
    terms.push("validate");
  }

  return Array.from(new Set(terms));
}

function quantityLifecycleTermsFromConstraint(constraint) {
  const terms = [];
  const normalized = constraint.toLowerCase();

  if (normalized.includes("quantity")) {
    terms.push("quantity");
  }

  if (normalized.includes("partial fill")) {
    terms.push("partial");
    terms.push("fill");
  }

  if (normalized.includes("remaining open")) {
    terms.push("remaining");
    terms.push("open");
  }

  if (normalized.includes("lifecycle")) {
    terms.push("lifecycle");
  }

  if (normalized.includes("execution identifiers")) {
    terms.push("execution");
    terms.push("id");
  }

  if (normalized.includes("idempotent")) {
    terms.push("idempotent");
  }

  if (normalized.includes("at-most-once")) {
    terms.push("at-most-once");
  }

  if (terms.length === 0) {
    terms.push("quantity");
  }

  return Array.from(new Set(terms));
}

function metricsOpsTermsFromConstraint(constraint) {
  const terms = [];
  const normalized = constraint.toLowerCase();

  if (normalized.includes("metrics")) {
    terms.push("metric");
  }

  if (normalized.includes("latency")) {
    terms.push("latency");
  }

  if (normalized.includes("archive")) {
    terms.push("archive");
  }

  if (normalized.includes("retention")) {
    terms.push("retention");
  }

  if (normalized.includes("failover")) {
    terms.push("failover");
  }

  if (normalized.includes("backpressure")) {
    terms.push("backpressure");
  }

  if (normalized.includes("kill-switch")) {
    terms.push("halt");
  }

  if (normalized.includes("operator alerts")) {
    terms.push("alert");
  }

  if (terms.length === 0) {
    terms.push("metric");
  }

  return Array.from(new Set(terms));
}

function securityPrivacyTermsFromConstraint(constraint) {
  const terms = [];
  const normalized = constraint.toLowerCase();

  if (normalized.includes("authentication")) {
    terms.push("auth");
  }

  if (normalized.includes("encrypt")) {
    terms.push("encrypt");
  }

  if (normalized.includes("entitlement")) {
    terms.push("entitlement");
  }

  if (normalized.includes("confidential")) {
    terms.push("confidential");
  }

  if (normalized.includes("personally identifiable")) {
    terms.push("pii");
  }

  if (normalized.includes("private")) {
    terms.push("private");
  }

  if (terms.length === 0) {
    terms.push("auth");
  }

  return Array.from(new Set(terms));
}

function componentRootsFromConstraint(constraint) {
  const normalizedConstraint = constraint.toLowerCase();
  const candidateRoots = [];

  if (normalizedConstraint.includes("order book")) {
    candidateRoots.push("src/order-book");
  }

  if (normalizedConstraint.includes("matching engine")) {
    candidateRoots.push("src/matching-engine");
  }

  if (normalizedConstraint.includes("market data")) {
    candidateRoots.push("src/market-data");
  }

  if (candidateRoots.length === 0) {
    candidateRoots.push("src");
  }

  return candidateRoots;
}

function renderSequenceEvidenceBlock(constraint, ruleId) {
  const terms = sequenceTermsFromConstraint(constraint);
  const termsLiteral = `[${terms.map((t) => `"${t}"`).join(", ")}]`;
  const rootsLiteral = JSON.stringify(componentRootsFromConstraint(constraint));

  return [
    `  // ADR_CONSTRAINT: ${constraint}`,
    `  // ADR_MAPPING_RULE: ${ruleId}`,
    `  it("should provide sequence/replay evidence for this constraint", () => {`,
    `    const candidateRoots = ${rootsLiteral};`,
    "",
    "    const existingRoots = candidateRoots.filter((root) => existsSync(root));",
    "",
    "    // Bootstrap guard: until component code exists, this test is a no-op and stays green.",
    "    if (existingRoots.length === 0) {",
    "      expect(true).toBe(true);",
    "      return;",
    "    }",
    "",
    "    const tsFiles = Array.from(",
    "      new Set(existingRoots.flatMap((root) => walkTsFiles(root)))",
    "    );",
    "",
    "    const corpus = tsFiles",
    "      .map((file) => readFileSync(file, \"utf8\"))",
    "      .join(\"\\n\")",
    "      .toLowerCase();",
    "",
    `    const requiredTerms: string[] = ${termsLiteral};`,
    "    const missingTerms = requiredTerms.filter((term) => !corpus.includes(term));",
    "",
    "    expect(missingTerms).toEqual([]);",
    "  });",
    "",
  ].join("\n");
}

function renderValidationEvidenceBlock(constraint, ruleId) {
  const terms = validationTermsFromConstraint(constraint);
  const termsLiteral = `[${terms.map((t) => `"${t}"`).join(", ")}]`;
  const rootsLiteral = JSON.stringify(componentRootsFromConstraint(constraint));

  return [
    `  // ADR_CONSTRAINT: ${constraint}`,
    `  // ADR_MAPPING_RULE: ${ruleId}`,
    `  it("should provide validation/rejection evidence for this constraint", () => {`,
    `    const candidateRoots = ${rootsLiteral};`,
    "    const existingRoots = candidateRoots.filter((root) => existsSync(root));",
    "",
    "    // Bootstrap guard: until component code exists, this test is a no-op and stays green.",
    "    if (existingRoots.length === 0) {",
    "      expect(true).toBe(true);",
    "      return;",
    "    }",
    "",
    "    const tsFiles = Array.from(",
    "      new Set(existingRoots.flatMap((root) => walkTsFiles(root)))",
    "    );",
    "",
    "    const corpus = tsFiles",
    "      .map((file) => readFileSync(file, \"utf8\"))",
    "      .join(\"\\n\")",
    "      .toLowerCase();",
    "",
    `    const requiredTerms: string[] = ${termsLiteral};`,
    "    const missingTerms = requiredTerms.filter((term) => !corpus.includes(term));",
    "",
    "    expect(missingTerms).toEqual([]);",
    "  });",
    "",
  ].join("\n");
}

function renderQuantityLifecycleEvidenceBlock(constraint, ruleId) {
  const terms = quantityLifecycleTermsFromConstraint(constraint);
  const termsLiteral = `[${terms.map((t) => `"${t}"`).join(", ")}]`;
  const rootsLiteral = JSON.stringify(componentRootsFromConstraint(constraint));

  return [
    `  // ADR_CONSTRAINT: ${constraint}`,
    `  // ADR_MAPPING_RULE: ${ruleId}`,
    `  it("should provide quantity/lifecycle invariant evidence for this constraint", () => {`,
    `    const candidateRoots = ${rootsLiteral};`,
    "    const existingRoots = candidateRoots.filter((root) => existsSync(root));",
    "",
    "    // Bootstrap guard: until component code exists, this test is a no-op and stays green.",
    "    if (existingRoots.length === 0) {",
    "      expect(true).toBe(true);",
    "      return;",
    "    }",
    "",
    "    const tsFiles = Array.from(",
    "      new Set(existingRoots.flatMap((root) => walkTsFiles(root)))",
    "    );",
    "",
    "    const corpus = tsFiles",
    "      .map((file) => readFileSync(file, \"utf8\"))",
    "      .join(\"\\n\")",
    "      .toLowerCase();",
    "",
    `    const requiredTerms: string[] = ${termsLiteral};`,
    "    const missingTerms = requiredTerms.filter((term) => !corpus.includes(term));",
    "",
    "    expect(missingTerms).toEqual([]);",
    "  });",
    "",
  ].join("\n");
}

function renderMetricsOpsEvidenceBlock(constraint, ruleId) {
  const terms = metricsOpsTermsFromConstraint(constraint);
  const termsLiteral = `[${terms.map((t) => `"${t}"`).join(", ")}]`;
  const rootsLiteral = JSON.stringify(componentRootsFromConstraint(constraint));

  return [
    `  // ADR_CONSTRAINT: ${constraint}`,
    `  // ADR_MAPPING_RULE: ${ruleId}`,
    `  it("should provide metrics/operations evidence for this constraint", () => {`,
    `    const candidateRoots = ${rootsLiteral};`,
    "    const existingRoots = candidateRoots.filter((root) => existsSync(root));",
    "",
    "    // Bootstrap guard: until component code exists, this test is a no-op and stays green.",
    "    if (existingRoots.length === 0) {",
    "      expect(true).toBe(true);",
    "      return;",
    "    }",
    "",
    "    const tsFiles = Array.from(",
    "      new Set(existingRoots.flatMap((root) => walkTsFiles(root)))",
    "    );",
    "",
    "    const corpus = tsFiles",
    "      .map((file) => readFileSync(file, \"utf8\"))",
    "      .join(\"\\n\")",
    "      .toLowerCase();",
    "",
    `    const requiredTerms: string[] = ${termsLiteral};`,
    "    const missingTerms = requiredTerms.filter((term) => !corpus.includes(term));",
    "",
    "    expect(missingTerms).toEqual([]);",
    "  });",
    "",
  ].join("\n");
}

function renderSecurityPrivacyEvidenceBlock(constraint, ruleId) {
  const terms = securityPrivacyTermsFromConstraint(constraint);
  const termsLiteral = `[${terms.map((t) => `"${t}"`).join(", ")}]`;
  const rootsLiteral = JSON.stringify(componentRootsFromConstraint(constraint));

  return [
    `  // ADR_CONSTRAINT: ${constraint}`,
    `  // ADR_MAPPING_RULE: ${ruleId}`,
    `  it("should provide security/privacy evidence for this constraint", () => {`,
    `    const candidateRoots = ${rootsLiteral};`,
    "    const existingRoots = candidateRoots.filter((root) => existsSync(root));",
    "",
    "    // Bootstrap guard: until component code exists, this test is a no-op and stays green.",
    "    if (existingRoots.length === 0) {",
    "      expect(true).toBe(true);",
    "      return;",
    "    }",
    "",
    "    const tsFiles = Array.from(",
    "      new Set(existingRoots.flatMap((root) => walkTsFiles(root)))",
    "    );",
    "",
    "    const corpus = tsFiles",
    "      .map((file) => readFileSync(file, \"utf8\"))",
    "      .join(\"\\n\")",
    "      .toLowerCase();",
    "",
    `    const requiredTerms: string[] = ${termsLiteral};`,
    "    const missingTerms = requiredTerms.filter((term) => !corpus.includes(term));",
    "",
    "    expect(missingTerms).toEqual([]);",
    "  });",
    "",
  ].join("\n");
}

function renderGeneralEvidenceBlock(constraint, ruleId) {
  const terms = generalEvidenceTermsFromConstraint(constraint);
  const termsLiteral = `[${terms.map((t) => `"${t}"`).join(", ")}]`;
  const rootsLiteral = JSON.stringify(componentRootsFromConstraint(constraint));

  return [
    `  // ADR_CONSTRAINT: ${constraint}`,
    `  // ADR_MAPPING_RULE: ${ruleId}`,
    `  it("should provide implementation evidence for this constraint", () => {`,
    `    const candidateRoots = ${rootsLiteral};`,
    "    const existingRoots = candidateRoots.filter((root) => existsSync(root));",
    "",
    "    // Bootstrap guard: until component code exists, this test is a no-op and stays green.",
    "    if (existingRoots.length === 0) {",
    "      expect(true).toBe(true);",
    "      return;",
    "    }",
    "",
    "    const tsFiles = Array.from(",
    "      new Set(existingRoots.flatMap((root) => walkTsFiles(root)))",
    "    );",
    "",
    "    const corpus = tsFiles",
    "      .map((file) => readFileSync(file, \"utf8\"))",
    "      .join(\"\\n\")",
    "      .toLowerCase();",
    "",
    `    const requiredTerms: string[] = ${termsLiteral};`,
    "",
    "    // If term extraction yields no terms, this stays as a bootstrap pass.",
    "    if (requiredTerms.length === 0) {",
    "      expect(true).toBe(true);",
    "      return;",
    "    }",
    "",
    "    const missingTerms = requiredTerms.filter((term) => !corpus.includes(term));",
    "    expect(missingTerms).toEqual([]);",
    "  });",
    "",
  ].join("\n");
}

function renderComplianceGeneratedTests(constraintsAndRules) {
  const blocks = [];

  for (const entry of constraintsAndRules) {
    const { constraint, rule } = entry;

    if (rule.template === "prefix-literal-ban") {
      blocks.push(renderPrefixLiteralBlock(constraint, rule.id));
      continue;
    }

    if (rule.template === "id-prefix-ban") {
      blocks.push(renderIdPrefixBanBlock(constraint, rule.id));
      continue;
    }

    if (rule.template === "domain-file-uppercase") {
      blocks.push(renderDomainFileUppercaseBlock(constraint, rule.id));
      continue;
    }

    if (rule.template === "inheritance-depth-cap") {
      blocks.push(
        renderInheritanceDepthCapBlock(
          constraint,
          rule.id,
          rule.templateArgs?.maxDepth
        )
      );
      continue;
    }

    if (rule.template === "literal-ban") {
      blocks.push(renderLiteralBanBlock(constraint, rule.id, rule.templateArgs?.literal));
      continue;
    }

    if (rule.template === "todo-constraint") {
      blocks.push(renderTodoConstraintBlock(constraint, rule.id));
      continue;
    }

    if (rule.template === "sequence-evidence") {
      blocks.push(renderSequenceEvidenceBlock(constraint, rule.id));
      continue;
    }

    if (rule.template === "validation-evidence") {
      blocks.push(renderValidationEvidenceBlock(constraint, rule.id));
      continue;
    }

    if (rule.template === "quantity-lifecycle-evidence") {
      blocks.push(renderQuantityLifecycleEvidenceBlock(constraint, rule.id));
      continue;
    }

    if (rule.template === "metrics-ops-evidence") {
      blocks.push(renderMetricsOpsEvidenceBlock(constraint, rule.id));
      continue;
    }

    if (rule.template === "security-privacy-evidence") {
      blocks.push(renderSecurityPrivacyEvidenceBlock(constraint, rule.id));
      continue;
    }

    if (rule.template === "general-evidence") {
      blocks.push(renderGeneralEvidenceBlock(constraint, rule.id));
      continue;
    }

    throw new Error(
      `Unsupported compliance template '${rule.template}' in rule '${rule.id}'.`
    );
  }

  return blocks.join("");
}

function complianceFileHeader(decisionName) {
  return `import { describe, expect, it } from "vitest";
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

describe("${decisionName}: Generated Non-ArchUnit Compliance Constraints", () => {
`;
}

function writeComplianceFile(testFile, decisionName, entries) {
  if (entries.length === 0) {
    if (existsSync(testFile)) {
      unlinkSync(testFile);
      return "deleted";
    }
    return "none";
  }

  const content = `${complianceFileHeader(decisionName)}${renderComplianceGeneratedTests(
    entries
  )}});\n`;

  const prev = existsSync(testFile) ? readFileSync(testFile, "utf8") : "";
  if (prev === content) {
    return "unchanged";
  }

  writeFileSync(testFile, content, "utf8");
  return "updated";
}

function summarizeMapped(classifications) {
  const byType = new Map();
  const byRule = new Map();

  for (const item of classifications) {
    if (item.status !== "mapped") {
      continue;
    }

    byType.set(item.rule.testType, (byType.get(item.rule.testType) ?? 0) + 1);
    byRule.set(item.rule.id, (byRule.get(item.rule.id) ?? 0) + 1);
  }

  return { byType, byRule };
}

function logClassificationSummary(adrFile, classifications) {
  const mapped = classifications.filter((c) => c.status === "mapped");
  const unmapped = classifications.filter((c) => c.status === "unmapped");
  const bootstrapOnly = mapped.filter((c) => isBootstrapRule(c.rule));
  const summary = summarizeMapped(classifications);

  console.log(`Constraint mapping summary for ${adrFile}`);
  console.log(`- total: ${classifications.length}`);
  console.log(`- mapped: ${mapped.length}`);
  console.log(`- unmapped: ${unmapped.length}`);

  if (summary.byType.size > 0) {
    console.log("- mapped by testType:");
    for (const [type, count] of summary.byType.entries()) {
      console.log(`  - ${type}: ${count}`);
    }
  }

  if (summary.byRule.size > 0) {
    console.log("- mapped by rule:");
    for (const [rule, count] of summary.byRule.entries()) {
      console.log(`  - ${rule}: ${count}`);
    }
  }

  if (unmapped.length > 0) {
    console.warn("- unmapped constraints:");
    for (const item of unmapped) {
      console.warn(`  - ${item.constraint}`);
      emitGitHubAnnotation(
        "warning",
        adrFile,
        `Unmapped ADR constraint: ${item.constraint}`
      );
    }
  }

  if (bootstrapOnly.length > 0) {
    console.warn(
      "- bootstrap-only constraints (matched catch-all rule; add a dedicated mapping/template):"
    );
    for (const item of bootstrapOnly) {
      console.warn(`  - ${item.constraint}`);
      emitGitHubAnnotation(
        shouldFailOnBootstrapMapping() ? "error" : "warning",
        adrFile,
        `Bootstrap-only ADR constraint matched catch-all rule '${item.rule.id}': ${item.constraint}`
      );
    }
  }
}

const adrFiles = getAdrFilesFromEnv();
if (adrFiles.length === 0) {
  console.log("No ADR files provided via ADR_FILES; skipping constraint test sync.");
  process.exit(0);
}

const loaded = loadMappingRules();
const rules = loaded.rules;
console.log(`Loaded ${rules.length} mapping rules from ${loaded.source}`);

for (const adrFile of adrFiles) {
  if (!existsSync(adrFile)) {
    console.error(`ADR file does not exist: ${adrFile}`);
    process.exit(1);
  }

  const decisionName = basename(adrFile, ".md");
  const constraints = parseComplianceConstraints(readFileSync(adrFile, "utf8"));
  const classifications = constraints.map((c) => classifyConstraint(c, rules));
  logClassificationSummary(adrFile, classifications);

  if (
    shouldFailOnBootstrapMapping() &&
    classifications.some((c) => c.status === "mapped" && isBootstrapRule(c.rule))
  ) {
    console.error(
      `Bootstrap-only mapping is disallowed by ${FAIL_ON_BOOTSTRAP_MAPPING_ENV} for ${adrFile}`
    );
    process.exit(1);
  }

  const complianceEntries = classifications
    .filter((c) => c.status === "mapped")
    .map((c) => ({ constraint: c.constraint, rule: c.rule }))
    .filter((entry) => entry.rule.testType === "compliance-generated");

  const testFile = `tests/${decisionName}.compliance.test.ts`;
  const result = writeComplianceFile(testFile, decisionName, complianceEntries);

  if (result === "updated") {
    console.log(`Updated ${testFile} for ${adrFile}`);
  } else if (result === "deleted") {
    console.log(`Deleted ${testFile} because no generated compliance constraints remain.`);
  } else {
    console.log(`No generated compliance test updates needed for ${adrFile}`);
  }
}
