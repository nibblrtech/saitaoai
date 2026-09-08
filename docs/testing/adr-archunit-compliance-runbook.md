# ADR Test Maintenance Runbook

## Purpose

This runbook explains how ADR compliance constraints are translated into tests and maintained automatically.

It covers:

1. How the system works end-to-end.
2. How to install it for all repositories in a GitHub organization.
3. How to grow and maintain mapping coverage for general compliance.

## 1) How The System Works

### High-level flow

On every push to main/master, the workflow runs and processes all ADR files under docs/decisions.

The workflow file is:

- .github/workflows/adr-archunit-test-generation.yml

Pipeline stages:

1. Collect ADR files from docs/decisions.
2. Ask Copilot to generate/update ADR architecture tests and companion compliance tests.
3. Run deterministic sync for mapping-driven compliance tests.
4. Verify constraint-to-test marker coverage.
5. Run npm test so all tests execute in one suite.
6. Open a PR automatically when test files changed.

### Inputs

1. ADR markdown files:
   - docs/decisions/*.md
2. Mapping library:
   - Preferred: organization Actions variable ADR_CONSTRAINT_MAPPING_JSON
   - Fallback: docs/testing/adr-constraint-to-test-mapping.md

### Constraint routing model

Rules are evaluated in order with first-match-wins semantics.

Each rule maps a constraint to one test strategy:

1. archunit
   - Constraint should be represented in tests/<adr-name>.test.ts
2. compliance-generated
   - Constraint should be represented in tests/<adr-name>.compliance.test.ts

### Marker contract

Every generated or maintained test must carry an exact marker comment:

- ADR_CONSTRAINT: <exact constraint text>

Optional trace marker in generated compliance tests:

- ADR_MAPPING_RULE: <rule-id>

These markers are used by coverage verification.

### Deterministic components

1. scripts/sync-adr-constraint-tests.mjs
   - Loads mapping rules from org variable or local mapping file.
   - Parses each ADR Compliance Constraints section.
   - Classifies constraints and logs a summary by test type and rule.
   - Generates or updates compliance tests for mapped compliance-generated rules.
   - Removes stale generated compliance tests when no mapped generated constraints remain.

2. scripts/verify-adr-constraint-coverage.mjs
   - Rebuilds expected mapped coverage from ADR + mapping rules.
   - Verifies mapped constraints have matching markers in target test files.
   - Verifies stale markers are removed after ADR or mapping changes.
   - Logs unmapped constraints without failing for unmappability.
   - Fails on mapped coverage drift (missing or stale mapped markers).

### Execution model

All tests run together through npm test in CI.

This means:

1. ArchUnit tests and non-ArchUnit compliance tests execute in the same run.
2. Compliance failures block CI like any other test failure.

## 2) Organization-wide GitHub Installation

### Recommended architecture

Use a shared mapping library at the organization level plus a standard workflow copied into each repository.

Why:

1. Shared logic avoids duplicated per-repo mapping drift.
2. Repositories can still extend locally when needed.

### Prerequisites

1. GitHub Actions enabled for the organization and repositories.
2. Repositories use Node and have npm ci and npm test available.
3. Each repo contains:
   - docs/decisions/
   - tests/
   - .github/workflows/adr-archunit-test-generation.yml
   - scripts/sync-adr-constraint-tests.mjs
   - scripts/verify-adr-constraint-coverage.mjs

### Step-by-step org rollout

1. Create org-level Actions variable:
   - Name: ADR_CONSTRAINT_MAPPING_JSON
   - Value: JSON object with rules array used by the mapping scripts.

2. Ensure each target repository has workflow and scripts:
   - .github/workflows/adr-archunit-test-generation.yml
   - scripts/sync-adr-constraint-tests.mjs
   - scripts/verify-adr-constraint-coverage.mjs

3. Ensure each repository has a fallback mapping file:
   - docs/testing/adr-constraint-to-test-mapping.md

4. Ensure the workflow has required permissions and secrets:
   - contents: write
   - pull-requests: write
   - copilot-requests: write
   - Repository or org secret PERSONAL_ACCESS_TOKEN for create-pull-request step

5. Merge workflow into main/master.

6. Validate first run:
   - Confirm mapping summary logs appear for each ADR.
   - Confirm generated compliance test files are created or updated.
   - Confirm coverage verification reports mapped coverage status.
   - Confirm npm test runs all suites.

### Shared mapping JSON template

Use this minimal structure in ADR_CONSTRAINT_MAPPING_JSON:

```json
{
  "rules": [
    {
      "id": "archunit-example",
      "pattern": "shall not import",
      "testType": "archunit"
    },
    {
      "id": "compliance-example",
      "pattern": "inheritance depth",
      "testType": "compliance-generated",
      "template": "inheritance-depth-cap",
      "templateArgs": {
        "maxDepth": 3
      }
    },
    {
      "id": "bootstrap-catch-all",
      "pattern": ".+",
      "testType": "compliance-generated",
      "template": "todo-constraint"
    }
  ]
}
```

## 3) Build And Maintain The System For General Compliance

### Governance loop

Use this loop continuously:

1. Add or update ADR constraints.
2. Run workflow.
3. Review mapping summary logs.
4. Promote frequent unmapped or todo constraint shapes into deterministic templates.
5. Keep reducing catch-all usage over time.

### Mapping maturity model

1. Bootstrap phase
   - Catch-all todo mapping is acceptable.
   - Goal is visibility and inventory.

2. Expansion phase
   - Add targeted patterns and deterministic templates for recurring rules.
   - Convert todos into executable assertions where feasible.

3. Steady-state phase
   - Unmapped constraints become rare.
   - Most constraints map to deterministic executable checks.

### Change management rules

1. Keep patterns specific enough to avoid accidental overmatching.
2. Keep first-match order intentional and documented.
3. Add one rule at a time and run sync + verify across all ADRs.
4. Require PR review for mapping-library changes.
5. Record rationale in commit/PR text when remapping an existing constraint class.

### Standard maintenance commands

Run these locally when changing mappings or ADRs:

```bash
ADR_FILES="$(printf '%s\n' docs/decisions/*.md)" node scripts/sync-adr-constraint-tests.mjs
ADR_FILES="$(printf '%s\n' docs/decisions/*.md)" node scripts/verify-adr-constraint-coverage.mjs
npm test
```

### Operational signals to monitor

1. Count of constraints mapped by catch-all rule.
2. Count of todo compliance tests.
3. Number of mapped coverage mismatches.
4. Frequency of generated file churn.

These metrics indicate where mapping-library investment is needed.

### Troubleshooting

1. No mapping summary appears
   - Check ADR_FILES env in workflow step.
   - Confirm docs/decisions contains .md files.

2. Coverage mismatch failures
   - Compare expected mapped constraints to ADR_CONSTRAINT markers in corresponding test files.
   - Re-run sync script and inspect generated diffs.

3. Mapping source not found
   - Ensure org variable ADR_CONSTRAINT_MAPPING_JSON exists, or
   - Ensure docs/testing/adr-constraint-to-test-mapping.md exists and has valid JSON block.

4. PR not created by workflow
   - Ensure PERSONAL_ACCESS_TOKEN is present and has repo scope needed by create-pull-request action.

## Recommended Policy

1. Keep unmappable constraints as warnings only during bootstrap and expansion.
2. Keep mapped coverage strict and failing on drift.
3. Periodically harden the policy by reducing catch-all todo usage.
4. Treat mapping-library edits as compliance-control changes.
