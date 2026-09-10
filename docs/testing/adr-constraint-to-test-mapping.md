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
      "pattern": "\\bfields?\\b.*\\bshould not have prefix\\b.*[\"'].*[\"']",
      "testType": "compliance-generated",
      "template": "prefix-literal-ban"
    },
    {
      "id": "compliance-id-prefix-ban",
      "pattern": "\\bfields?\\b.*\\bstarts with\\b.*[\"']id[\"'].*\\b(should not have|cannot be|must not be)\\b.*\\bprefix(?:ed)?\\b",
      "testType": "compliance-generated",
      "template": "id-prefix-ban"
    },
    {
      "id": "compliance-domain-file-uppercase",
      "pattern": "(domain\\s+entity\\s+files?|domain\\s+files?)\\s+(?:should|shall|must)\\s+be\\s+upper\\s*case",
      "testType": "compliance-generated",
      "template": "domain-file-uppercase"
    },
    {
      "id": "compliance-domain-entity-created-at",
      "pattern": "domain\\s+entities?\\s+(?:must|shall|should)\\s+have\\s+a\\s+createdat\\s+attribute",
      "testType": "compliance-generated",
      "template": "domain-entity-created-at"
    },
    {
      "id": "compliance-domain-entity-updated-at",
      "pattern": "domain\\s+entities?\\s+(?:must|shall|should)\\s+have\\s+a\\s+updatedat\\s+attribute",
      "testType": "compliance-generated",
      "template": "domain-entity-updated-at"
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
      "template": "metrics-ops-evidence"
    },
    {
      "id": "compliance-security-and-privacy",
      "pattern": "(authentication|encrypt|entitlement|confidential|personally identifiable|private)",
      "testType": "compliance-generated",
      "template": "security-privacy-evidence"
    },
    {
      "id": "archunit-order-book-instrument-isolation",
      "pattern": "maintain separate bid-side and ask-side structures for each instrument and shall not share mutable state across instruments|enforce instrument-level isolation so that events for one instrument cannot mutate another instrument book",
      "testType": "archunit"
    },
    {
      "id": "archunit-order-book-no-mutation-path-network-calls",
      "pattern": "network calls or blocking remote procedure calls on the mutation path",
      "testType": "archunit"
    },
    {
      "id": "archunit-order-book-clock-source-separation",
      "pattern": "monotonic in-process clock source.*wall clock source",
      "testType": "archunit"
    },
    {
      "id": "archunit-order-book-query-interfaces-side-effect-free",
      "pattern": "query interfaces for derived views such as best bid",
      "testType": "archunit"
    },
    {
      "id": "archunit-matching-engine-no-auction-v1",
      "pattern": "not implement auction matching logic in v1",
      "testType": "archunit"
    },
    {
      "id": "archunit-matching-engine-no-direct-market-data-calls",
      "pattern": "market data publisher APIs directly from matching logic",
      "testType": "archunit"
    },
    {
      "id": "archunit-matching-engine-orchestration-vs-domain-services",
      "pattern": "orchestration classes in the application layer and shall keep matching rules in pure domain services",
      "testType": "archunit"
    },
    {
      "id": "archunit-matching-engine-no-infrastructure-inheritance",
      "pattern": "not inherit domain service classes from infrastructure base classes",
      "testType": "archunit"
    },
    {
      "id": "archunit-market-data-canonical-events-only",
      "pattern": "canonical domain events emitted by the matching engine and order book components",
      "testType": "archunit"
    },
    {
      "id": "archunit-market-data-adapter-classes-transport",
      "pattern": "adapter classes to implement transport protocols and shall prevent domain classes from importing adapter packages",
      "testType": "archunit"
    },
    {
      "id": "compliance-price-time-priority",
      "pattern": "price-time priority",
      "testType": "compliance-generated",
      "template": "price-time-priority-evidence"
    },
    {
      "id": "compliance-order-book-queue-position",
      "pattern": "preserve original queue position for each resting order",
      "testType": "compliance-generated",
      "template": "queue-position-evidence"
    },
    {
      "id": "compliance-order-book-not-crossed",
      "pattern": "remain crossed after processing a mutation event",
      "testType": "compliance-generated",
      "template": "book-not-crossed-evidence"
    },
    {
      "id": "compliance-order-book-reference-data-snapshot",
      "pattern": "versioned reference data snapshot",
      "testType": "compliance-generated",
      "template": "reference-data-snapshot-evidence"
    },
    {
      "id": "compliance-order-book-duplicate-order-ids",
      "pattern": "duplicate order identifiers within the same trading session",
      "testType": "compliance-generated",
      "template": "duplicate-order-id-evidence"
    },
    {
      "id": "compliance-matching-policy-versioning",
      "pattern": "documented matching policy and shall not change policy at runtime",
      "testType": "compliance-generated",
      "template": "matching-policy-versioning-evidence"
    },
    {
      "id": "compliance-matching-engine-journal-before-ack",
      "pattern": "append-only execution and order-event journal before acknowledging",
      "testType": "compliance-generated",
      "template": "journal-before-ack-evidence"
    },
    {
      "id": "compliance-matching-engine-authoritative-timestamps",
      "pattern": "authoritative event timestamps within the engine boundary",
      "testType": "compliance-generated",
      "template": "authoritative-timestamp-evidence"
    },
    {
      "id": "compliance-matching-engine-trading-halt",
      "pattern": "configured trading-halt state from market-control inputs",
      "testType": "compliance-generated",
      "template": "trading-halt-evidence"
    },
    {
      "id": "compliance-event-schema-versioning",
      "pattern": "backward-compatible event schema evolution|version all feed schemas and shall maintain compatibility policy",
      "testType": "compliance-generated",
      "template": "event-schema-versioning-evidence"
    },
    {
      "id": "compliance-market-data-snapshot-reconstruction",
      "pattern": "snapshot mechanism that allows a client to reconstruct",
      "testType": "compliance-generated",
      "template": "snapshot-reconstruction-evidence"
    },
    {
      "id": "compliance-market-data-explicit-event-types",
      "pattern": "explicit event types for new order, modify order, cancel order, execution, trade bust",
      "testType": "compliance-generated",
      "template": "explicit-event-types-evidence"
    },
    {
      "id": "compliance-catch-all-bootstrap",
      "pattern": ".+",
      "testType": "compliance-generated",
      "template": "general-evidence"
    }
  ]
}
```

When adding new constraint styles, add a new rule with a precise pattern and the intended testType.
