import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";
import { execSync } from "node:child_process";

const MAPPING_FILE = "docs/testing/adr-constraint-to-test-mapping.md";
const MAPPING_JSON_ENV = "ADR_CONSTRAINT_MAPPING_JSON";
const NEEDS_FILE_ENV = "ADR_NEEDS_MAPPING_FILE";
const BASE_SHA_ENV = "ADR_BASE_SHA";
const ONLY_NEW_ENV = "ADR_ONLY_NEW_CONSTRAINTS";
const FAIL_ON_NEEDS_ENV = "ADR_FAIL_ON_NEEDS_MAPPING";
const CATCH_ALL_RULE_ID_ENV = "ADR_CATCH_ALL_RULE_ID";

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

function boolFromEnv(name) {
  return /^(1|true|yes)$/i.test(process.env[name] ?? "");
}

function readConstraintsAtRef(baseSha, adrFile) {
  if (!baseSha) {
    return [];
  }

  try {
    const content = execSync(`git show ${baseSha}:${adrFile}`, {
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
    });
    return parseComplianceConstraints(content);
  } catch {
    // File may not exist at base ref (new ADR), treat as no prior constraints.
    return [];
  }
}

function emitGitHubAnnotation(level, filePath, message) {
  console.log(`::${level} file=${filePath}::${message.replace(/\r?\n/g, " ")}`);
}

const adrFiles = getAdrFilesFromEnv();
if (adrFiles.length === 0) {
  console.log("No ADR files provided via ADR_FILES; skipping new-constraint mapping check.");
  process.exit(0);
}

const loaded = loadMappingRules();
const rules = loaded.rules;
const onlyNew = boolFromEnv(ONLY_NEW_ENV);
const failOnNeeds = boolFromEnv(FAIL_ON_NEEDS_ENV);
const catchAllRuleId = process.env[CATCH_ALL_RULE_ID_ENV] || "compliance-catch-all-bootstrap";
const baseSha = (process.env[BASE_SHA_ENV] ?? "").trim();

console.log(`Loaded ${rules.length} mapping rules from ${loaded.source}`);
if (onlyNew) {
  console.log(`Checking only newly introduced constraints using base ref: ${baseSha || "<none>"}`);
}

const needs = [];

for (const adrFile of adrFiles) {
  if (!existsSync(adrFile)) {
    console.error(`ADR file does not exist: ${adrFile}`);
    process.exit(1);
  }

  const currentConstraints = parseComplianceConstraints(readFileSync(adrFile, "utf8"));
  const baseConstraints = onlyNew ? readConstraintsAtRef(baseSha, adrFile) : [];
  const baseSet = new Set(baseConstraints);
  const targetConstraints = onlyNew
    ? currentConstraints.filter((c) => !baseSet.has(c))
    : currentConstraints;

  for (const constraint of targetConstraints) {
    const classification = classifyConstraint(constraint, rules);

    if (classification.status === "unmapped") {
      needs.push({
        adrFile,
        constraint,
        reason: "unmapped",
      });
      continue;
    }

    if (classification.rule.id === catchAllRuleId) {
      needs.push({
        adrFile,
        constraint,
        reason: "catch-all",
        matchedRuleId: classification.rule.id,
      });
    }
  }
}

for (const item of needs) {
  const reasonLabel =
    item.reason === "unmapped"
      ? "has no mapping rule"
      : `matched fallback rule '${item.matchedRuleId}'`;
  emitGitHubAnnotation(
    failOnNeeds ? "error" : "warning",
    item.adrFile,
    `New ADR constraint needs dedicated test mapping (${reasonLabel}): ${item.constraint}`
  );
}

const outFile = process.env[NEEDS_FILE_ENV] || ".tmp/adr-needs-mapping.json";
mkdirSync(dirname(outFile), { recursive: true });
writeFileSync(outFile, JSON.stringify(needs, null, 2));

console.log(`New constraints needing dedicated test mapping: ${needs.length}`);
console.log(`Wrote detail file: ${outFile}`);

if (failOnNeeds && needs.length > 0) {
  process.exit(2);
}
