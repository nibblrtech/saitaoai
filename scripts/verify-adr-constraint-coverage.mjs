import { existsSync, readFileSync } from "node:fs";
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

  return parsed.rules.map((rule) => ({
    ...rule,
    regex: new RegExp(rule.pattern, "i"),
  }));
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

function parseMarkers(content) {
  const pattern = /ADR_CONSTRAINT:\s*(.+)$/gm;
  const markers = [];
  let match = pattern.exec(content);

  while (match) {
    markers.push(normalize(match[1]));
    match = pattern.exec(content);
  }

  return markers;
}

function readMarkers(filePath) {
  if (!existsSync(filePath)) {
    return [];
  }

  return parseMarkers(readFileSync(filePath, "utf8"));
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

function logMappingSummary(adrFile, classifications) {
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
    console.warn("- currently unmapped constraints:");
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
  console.log("No ADR files provided via ADR_FILES; skipping coverage verification.");
  process.exit(0);
}

const loaded = loadMappingRules();
const rules = loaded.rules;
console.log(`Loaded ${rules.length} mapping rules from ${loaded.source}`);

let hasFailure = false;

for (const adrFile of adrFiles) {
  if (!existsSync(adrFile)) {
    console.error(`ADR file does not exist: ${adrFile}`);
    hasFailure = true;
    continue;
  }

  const decisionName = basename(adrFile, ".md");
  const archFile = `tests/${decisionName}.test.ts`;
  const complianceFile = `tests/${decisionName}.compliance.test.ts`;

  const constraints = parseComplianceConstraints(readFileSync(adrFile, "utf8"));
  const classifications = constraints.map((c) => classifyConstraint(c, rules));
  logMappingSummary(adrFile, classifications);

  if (
    shouldFailOnBootstrapMapping() &&
    classifications.some((c) => c.status === "mapped" && isBootstrapRule(c.rule))
  ) {
    hasFailure = true;
    console.error(
      `Bootstrap-only mapping is disallowed by ${FAIL_ON_BOOTSTRAP_MAPPING_ENV} for ${adrFile}`
    );
  }

  const expectedArch = new Set(
    classifications
      .filter((c) => c.status === "mapped" && c.rule.testType === "archunit")
      .map((c) => c.constraint)
  );

  const expectedCompliance = new Set(
    classifications
      .filter(
        (c) => c.status === "mapped" && c.rule.testType === "compliance-generated"
      )
      .map((c) => c.constraint)
  );

  const actualArch = new Set(readMarkers(archFile));
  const actualCompliance = new Set(readMarkers(complianceFile));

  const missingArch = [...expectedArch].filter((c) => !actualArch.has(c));
  const missingCompliance = [...expectedCompliance].filter(
    (c) => !actualCompliance.has(c)
  );

  const misplacedArch = [...actualArch].filter((c) => expectedCompliance.has(c));
  const misplacedCompliance = [...actualCompliance].filter((c) => expectedArch.has(c));

  // Truly stale means the marker is not expected in either target file.
  const staleArch = [...actualArch].filter(
    (c) => !expectedArch.has(c) && !expectedCompliance.has(c)
  );
  const staleCompliance = [...actualCompliance].filter(
    (c) => !expectedCompliance.has(c) && !expectedArch.has(c)
  );

  if (
    missingArch.length > 0 ||
    missingCompliance.length > 0 ||
    staleArch.length > 0 ||
    staleCompliance.length > 0
  ) {
    hasFailure = true;
    console.error(`Constraint coverage mismatch for ${adrFile}`);

    if (missingArch.length > 0) {
      console.error(`Missing markers in ${archFile}:`);
      for (const c of missingArch) {
        console.error(`- ${c}`);
      }
    }

    if (missingCompliance.length > 0) {
      console.error(`Missing markers in ${complianceFile}:`);
      for (const c of missingCompliance) {
        console.error(`- ${c}`);
      }
    }

    if (staleArch.length > 0) {
      console.error(`Stale markers in ${archFile} (constraint removed or remapped):`);
      for (const c of staleArch) {
        console.error(`- ${c}`);
      }
    }

    if (staleCompliance.length > 0) {
      console.error(`Stale markers in ${complianceFile} (constraint removed or remapped):`);
      for (const c of staleCompliance) {
        console.error(`- ${c}`);
      }
    }
  } else {
    if (misplacedArch.length > 0) {
      console.warn(
        `Misplaced markers in ${archFile} (expected in ${complianceFile}, non-fatal):`
      );
      for (const c of misplacedArch) {
        console.warn(`- ${c}`);
      }
    }

    if (misplacedCompliance.length > 0) {
      console.warn(
        `Misplaced markers in ${complianceFile} (expected in ${archFile}, non-fatal):`
      );
      for (const c of misplacedCompliance) {
        console.warn(`- ${c}`);
      }
    }

    console.log(
      `Constraint coverage check passed for ${adrFile}: all mapped constraints are covered and synchronized.`
    );
  }
}

if (hasFailure) {
  process.exit(1);
}
