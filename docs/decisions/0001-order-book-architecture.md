---
status: proposed
date: 2026-06-19
decision-makers: Architecture Team
consulted: Trading Operations, Compliance, SRE
informed: Platform Engineering
---

# ADR-0001: Design the Order Book Core

## Context and Problem Statement

The stock exchange requires a deterministic and auditable order book as a core market microstructure component.
The order book must preserve deterministic behavior and provide a consistent source of truth for matching and downstream publishing in an educational JavaScript implementation.
The decision scope is the internal design of one order book instance per instrument and its interaction boundaries.

## Decision Drivers

## This is a test of the emergency broadcast system
## If this had been an actual emergency...something something something
## test test test 


- Determinism and replayability under identical event streams.
- Fairness through strict queueing semantics.
- Architectural clarity and testability of dependency boundaries.
- Fault tolerance and recoverability.
- Long-term event retention requirements.
- Clear architectural boundaries that can be verified through architecture tests.

## Considered Options

- In-memory single-writer limit order book per instrument with append-only event journal.
- Database-centric order book with row-level locking.
- Distributed multi-writer order book per instrument using consensus.

## Decision Outcome

Chosen option: In-memory single-writer limit order book per instrument with append-only event journal, because it gives deterministic behavior and predictable latency while preserving recoverability through durable event logging.

### Consequences

- Good, because one writer per book removes lock contention inside the critical path.
- Good, because state can be rebuilt by replaying journaled events.
- Good, because fairness rules are explicit in book data structures and queue ordering.
- Bad, because partitioning and failover orchestration become mandatory at the platform level.
- Bad, because memory sizing must be controlled carefully for peak depth events.

### Confirmation

- Add architecture tests to ensure the order book module depends only on domain primitives and does not import infrastructure adapters directly.
- Add deterministic replay tests that rebuild the same book state from the same ordered event log and compare checksums.
- Add invariant tests for top-of-book, depth accounting, and non-negative open quantities.
- Add performance regression tests for p50, p99, and max processing latency under synthetic burst load.

## Compliance Constraints

- The order book component shall maintain separate bid-side and ask-side structures for each instrument and shall not share mutable state across instruments--even if they want to.
- The order book component shall enforce instrument-level isolation so that events for one instrument cannot mutate another instrument book.
- The order book component shall treat all accepted state transitions as a totally ordered sequence of events per instrument.
- The order book component shall apply events in sequence order and shall reject out-of-order mutation events unless an explicit recovery mode is active.
- The order book component shall use price-time priority within each side for price levels and orders at each level.
- The order book component shall preserve original queue position for each resting order unless that order is canceled, fully filled, or replaced according to explicit replace semantics.
- The order book component shall support only limit, market, and stop-limit order intentions in v1 and shall reject unsupported order types.
- The order book component shall validate order attributes against instrument reference data before admitting an order to the active book.
- The order book component shall reject orders with invalid tick size, invalid lot size, invalid side, or non-positive quantity.
- The order book component shall not allow the active continuous-trading book to remain crossed after processing a mutation event.
- The order book component shall support partial fill accounting and shall keep remaining open quantity exact and non-negative.
- The order book component shall emit explicit domain events for accepted order, rejected order, canceled order, replaced order, partially filled order, and fully filled order.
- The order book component shall include a strictly increasing sequence number and event time on every emitted domain event.
- The order book component shall not execute network calls or blocking remote procedure calls on the mutation path.
- The order book component shall read static instrument metadata from a versioned reference data snapshot that is immutable during a processing cycle.
- The order book component shall use a monotonic in-process clock source for internal ordering diagnostics and a wall clock source for persisted event timestamps.
- The order book component shall support deterministic replay from the append-only journal and shall produce an identical final state for identical ordered input.
- The order book component shall persist sufficient event attributes to reconstruct full order lifecycle history.
- The order book component shall expose only query interfaces for derived views such as best bid, best ask, spread, and depth, and these query interfaces shall be side-effect free.
- The order book component shall prevent duplicate order identifiers within the same trading session for a given participant and instrument.
- The order book component shall support explicit session-state transitions such as pre-open, open, halt, and closed, and shall reject order actions not permitted in the current state.
- The order book component shall expose its state mutation API only to the matching engine and shall not accept direct mutations from transport adapters.
- The order book component shall read and write persistence only through an order-book repository interface owned by the order-book module.
- The order book component shall not be called directly by market data adapters and shall communicate outbound state changes only through domain events.
- The order book component shall not import any transport protocol classes for FIX, OUCH, WebSocket, HTTP, TCP, or UDP.
- The order book module shall follow naming conventions where aggregate classes end with Aggregate, domain events end with Event, and repository interfaces end with Repository.
- The order book module shall keep domain entities and value objects under the domain layer and shall keep persistence implementations under the infrastructure layer.
- The order book module shall not contain inheritance chains deeper than three levels for domain entities.
- The order book module shall keep entity fields private and allow state mutation only through explicit domain methods.
- The order book module shall archive daily journal batches and define a seven-year retention policy for historical events.
- The order book component shall expose stable domain models so that matching, surveillance, and market data components can consume events without reading internal storage structures.

## Pros and Cons of the Options

### In-memory single-writer limit order book per instrument with append-only event journal

- Good, because deterministic ordering is natural with one writer.
- Good, because low latency is achievable without database locks in the critical path.
- Neutral, because it requires careful shard ownership design.
- Bad, because failover orchestration is non-trivial.

### Database-centric order book with row-level locking

- Good, because persistence is immediate and familiar.
- Good, because operational tooling for databases is mature.
- Bad, because lock contention and transaction overhead increase tail latency.
- Bad, because determinism can degrade under concurrent writers.

### Distributed multi-writer order book per instrument using consensus

- Good, because it can increase apparent availability.
- Good, because it can support active-active deployment patterns.
- Bad, because consensus on the hot path can violate exchange-latency targets.
- Bad, because algorithmic complexity and operational risk are significantly higher.

## More Information

This ADR assumes a central event journal and per-instrument ownership model.
A follow-up ADR should define shard allocation, failover ownership transfer, and warm standby replay behavior.
Source context used: MADR template guidance, order-book references, and exchange protocol behavior summaries.
