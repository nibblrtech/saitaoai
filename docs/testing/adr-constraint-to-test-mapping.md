# ADR Constraint to Test Mapping

This document defines deterministic routing from ADR compliance constraints to test implementation style.

Rules are evaluated in order.

- First matching rule wins.
- If zero rules match, scripts log the unmapped constraint.
- testType values:
  - archunit: Constraint must be covered in tests/<decision>.test.ts.
  - compliance-generated: Constraint is auto-generated into tests/<decision>.compliance.test.ts.

Shared library usage across repos:
- The scripts can load mapping JSON from environment variable ADR_CONSTRAINT_MAPPING_JSON.
- Use an organization-level Actions variable with that name to share one mapping library across repositories.
- Local file fallback remains available for repository-specific extensions.

```json
{
  "rules": [
    {
      "id": "archunit-transport-import-ban",
      "pattern": "shall not import.*(FIX|OUCH|WebSocket|HTTP|TCP|UDP|transport|adapter)|shall isolate transport concerns.*(FIX|WebSocket|TCP|UDP)",
      "testType": "archunit"
    },
    {
      "id": "archunit-no-direct-adapter-coupling",
      "pattern": "shall not be called directly by .*adapters|shall not accept direct mutations from transport adapters",
      "testType": "archunit"
    },
    {
      "id": "archunit-repository-boundary",
      "pattern": "read and write persistence only through .*repository interface",
      "testType": "archunit"
    },
    {
      "id": "archunit-naming-conventions",
      "pattern": "shall follow naming conventions where",
      "testType": "archunit"
    },
    {
      "id": "archunit-layer-placement",
      "pattern": "keep domain entities and value objects under the domain layer",
      "testType": "archunit"
    },
    {
      "id": "archunit-stable-domain-models",
      "pattern": "shall expose stable domain models",
      "testType": "archunit"
    },
    {
      "id": "archunit-domain-port-only-call",
      "pattern": "shall call .* only through .* (interface|port)",
      "testType": "archunit"
    },
    {
      "id": "archunit-no-direct-repository-impl",
      "pattern": "shall not call .* repository implementations directly",
      "testType": "archunit"
    },
    {
      "id": "archunit-no-sync-downstream-calls",
      "pattern": "shall not call .* adapters synchronously on the .* path",
      "testType": "archunit"
    },
    {
      "id": "archunit-no-callback-into-core",
      "pattern": "shall not call back into .* synchronously",
      "testType": "archunit"
    },
    {
      "id": "archunit-immutable-upstream-input",
      "pattern": "shall not mutate .* and shall treat .* as immutable input",
      "testType": "archunit"
    },
    {
      "id": "compliance-inheritance-depth-cap",
      "pattern": "(inheritance depth at three levels or less|not contain inheritance chains deeper than three levels)",
      "testType": "compliance-generated",
      "template": "inheritance-depth-cap",
      "templateArgs": {
        "maxDepth": 3
      }
    },
    {
      "id": "compliance-avoid-active-active",
      "pattern": "avoid active-active",
      "testType": "compliance-generated",
      "template": "literal-ban",
      "templateArgs": {
        "literal": "active-active"
      }
    },
    {
      "id": "compliance-prefix-literal-ban",
      "pattern": "\\bfield\\b.*\\bshould not have prefix\\b.*[\"'].*[\"']",
      "testType": "compliance-generated",
      "template": "prefix-literal-ban"
    },
    {
      "id": "compliance-sequencing-behavior",
      "pattern": "(sequence|ordered|replay|deterministic)",
      "testType": "compliance-generated",
      "template": "sequence-evidence"
    },
    {
      "id": "compliance-validation-and-rejection",
      "pattern": "(validate|reject|invalid|unauthenticated|tradability|session state)",
      "testType": "compliance-generated",
      "template": "validation-evidence"
    },
    {
      "id": "compliance-quantity-and-lifecycle-invariants",
      "pattern": "(quantity|partial fill|remaining open|lifecycle|execution identifiers|idempotent|at-most-once)",
      "testType": "compliance-generated",
      "template": "quantity-lifecycle-evidence"
    },
    {
      "id": "compliance-metrics-and-operations",
      "pattern": "(metrics|latency|archive|retention|failover|backpressure|kill-switch|operator alerts)",
      "testType": "compliance-generated",
      "template": "todo-constraint"
    },
    {
      "id": "compliance-security-and-privacy",
      "pattern": "(authentication|encrypt|entitlement|confidential|personally identifiable|private)",
      "testType": "compliance-generated",
      "template": "todo-constraint"
    },
    {
      "id": "compliance-catch-all-bootstrap",
      "pattern": ".+",
      "testType": "compliance-generated",
      "template": "todo-constraint"
    }
  ]
}
```

When adding new constraint styles, add a new rule with a precise pattern and the intended testType.
