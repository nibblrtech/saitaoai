---
status: proposed
date: 2026-06-19
decision-makers: Architecture Team
consulted: Trading Operations, Compliance, SRE
informed: Platform Engineering
---

# ADR-0002: Design the Matching Engine

## Context and Problem Statement
## some change to a doc
## and some additional changes to a doc
## and again

The stock exchange needs a matching engine that executes incoming orders fairly, deterministically, and at high throughput.
The engine must coordinate pre-trade validations, session state, execution generation, and downstream event publication while preserving clear architecture boundaries in an educational JavaScript implementation.
The decision scope is matching logic and orchestration boundaries around order acceptance, matching, and execution output.

## Decision Drivers

- Fairness and market integrity.
- Deterministic matching and reproducible outcomes.
- Throughput goals appropriate for a mock exchange implementation.
- Strong observability and lifecycle traceability.
- Explicit boundaries between domain matching and integration adapters.

## Considered Options

- Price-time priority continuous matching under a single-writer event loop per instrument shard.
- Pro-rata matching as the primary algorithm.
- Hybrid multi-algorithm runtime selection per incoming order.

## Decision Outcome

Chosen option: Price-time priority continuous matching under a single-writer event loop per instrument shard, because it is transparent, widely understood by participants, and deterministic under realistic educational load.

### Consequences

- Good, because fairness rules are simple to explain and verify.
- Good, because event-loop ownership per shard limits contention.
- Good, because continuous-only behavior reduces implementation complexity for v1.
- Bad, because a strict single-writer model requires robust shard assignment and failover design.
- Bad, because advanced product types may later need additional matching policy variants.

### Confirmation

- Add architecture tests that enforce no direct dependency from matching domain logic to transport adapters and databases.
- Add deterministic simulation tests where repeated runs of identical order streams produce byte-identical execution sequences.
- Add property tests for price-time precedence, partial fills, and cancel-replace semantics.
- Add chaos and fault-injection tests that verify no duplicate executions are emitted during failover and recovery.

## Compliance Constraints

- The matching engine component shall process order events in a single-threaded logical sequence per instrument shard.
- The matching engine component shall apply a documented matching policy and shall not change policy at runtime without explicit configuration versioning.
- The matching engine component shall enforce price-time priority for continuous trading.
- The matching engine component shall not implement auction matching logic in v1.
- The matching engine component shall consume only validated order-intent events from the order entry gateway and shall reject malformed or unauthenticated inputs.
- The matching engine component shall perform final in-engine validations for session state and instrument tradability before matching.
- The matching engine component shall support only limit, market, and stop-limit order types in v1 and shall reject unsupported order types.
- The matching engine component shall emit execution events with immutable execution identifiers and strict per-instrument sequence numbers.
- The matching engine component shall guarantee idempotent behavior for retried inbound messages by deduplicating on a stable client order identity and session scope.
- The matching engine component shall guarantee at-most-once execution creation for each matched quantity slice.
- The matching engine component shall guarantee that the sum of all execution quantities for an order never exceeds its accepted quantity.
- The matching engine component shall guarantee that canceled quantity plus executed quantity plus remaining open quantity equals accepted quantity for every live order lifecycle.
- The matching engine component shall emit state transitions for all order lifecycle events required by client drop-copy and market data downstream systems.
- The matching engine component shall persist an append-only execution and order-event journal before acknowledging final acceptance outcomes to external clients.
- The matching engine component shall assign authoritative event timestamps within the engine boundary and shall not trust client-supplied timestamps for sequencing.
- The matching engine component shall call the order book only through a domain-defined order book port interface.
- The matching engine component shall not call order book repository implementations directly.
- The matching engine component shall not call market data publisher APIs directly from matching logic and shall publish only domain events to an internal event bus.
- The matching engine component shall not call clearing, settlement, or reporting adapters synchronously on the matching path.
- The matching engine component shall include operator kill-switch hooks to halt matching per instrument or per market segment.
- The matching engine component shall apply configured trading-halt state from market-control inputs before accepting aggressive matches.
- The matching engine component shall expose metrics for input rate, match rate, rejection rate, queue depth, and tail latency per shard.
- The matching engine component shall expose deterministic replay tooling that can regenerate execution tapes for a selected time range and shard.
- The matching engine component shall isolate participant-specific confidential data from public market data payload generation.
- The matching engine component shall support backward-compatible event schema evolution through explicit versioned event contracts.
- The matching engine component shall not import client protocol codecs for FIX, OUCH, WebSocket, REST, or persistence frameworks in core matching classes.
- The matching engine module shall follow naming conventions where command classes end with Command, use-case handlers end with Handler, and emitted event classes end with Event.
- The matching engine module shall keep orchestration classes in the application layer and shall keep matching rules in pure domain services.
- The matching engine module shall not inherit domain service classes from infrastructure base classes.
- The matching engine module shall keep class inheritance depth at three levels or less.
- The matching engine module shall archive daily journal batches and define a seven-year retention policy for execution and lifecycle events.
- The matching engine deployment shall target a single region for v1 and shall avoid active-active write topology.

## Pros and Cons of the Options

### Price-time priority continuous matching under a single-writer event loop per instrument shard

- Good, because behavior is transparent to participants.
- Good, because deterministic sequencing is straightforward.
- Neutral, because product-specific advanced rules are deferred.
- Bad, because horizontal scale requires careful shard management.

### Pro-rata matching as the primary algorithm

- Good, because it can encourage larger displayed size at best levels in some markets.
- Good, because it is common for selected derivatives venues.
- Bad, because fairness perception for smaller orders can be weaker for equity venues.
- Bad, because queue-position semantics are less intuitive for retail and many institutional participants.

### Hybrid multi-algorithm runtime selection per incoming order

- Good, because it maximizes flexibility.
- Good, because it can support diverse product behavior in one engine.
- Bad, because runtime complexity can increase operational and compliance risk.
- Bad, because verifying deterministic behavior and fairness becomes harder.

## More Information

This ADR intentionally chooses a default equity-style matching policy.
A later ADR can introduce per-product algorithm families with strict governance and compatibility constraints.
Source context used: MADR template guidance, exchange matching algorithm references, and market microstructure practices.