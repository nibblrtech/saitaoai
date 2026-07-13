---
status: proposed
date: 2026-06-19
decision-makers: Architecture Team
consulted: Trading Operations, Compliance, SRE
informed: Platform Engineering
---

# ADR-0003: Design the Market Data Distribution System

## Context and Problem Statement
## some more changes

The exchange needs a market data distribution system that publishes executions, order status updates, and order book changes to internal and external consumers with low latency and strong consistency guarantees.
The distribution design must support feed products, snapshot and recovery flows, and operational resilience while keeping transport adapters isolated from core sequencing logic.
The decision scope covers internal feed plant behavior from event intake to client delivery.

## Decision Drivers

- Predictable publish behavior suitable for an educational implementation.
- Ordered and recoverable dissemination.
- Clear distinction between public market data and participant-private order updates.
- Simple entitlement behavior for internal-only v1.
- Backward-compatible feed evolution and operational observability.

## Considered Options

- Sequenced event distribution with incremental multicast-style streams plus on-demand snapshot and gap-recovery channels.
- Pure point-to-point request-response distribution over synchronous APIs.
- Brokered generic pub-sub platform as the primary exchange distribution fabric.

## Decision Outcome

Chosen option: Sequenced event distribution with incremental multicast-style streams plus on-demand snapshot and gap-recovery channels, because this pattern is standard in exchange environments and balances low latency with recoverability.

### Consequences

- Good, because incremental streams minimize bandwidth and latency for high-volume updates.
- Good, because snapshots and replay channels provide deterministic client recovery.
- Good, because productized feeds can be versioned independently while sharing core sequencing.
- Bad, because subscriber integration complexity is higher than simple request-response APIs.
- Bad, because operations must manage sequence gaps, replay windows, and entitlement states carefully.

### Confirmation

- Add architecture tests that enforce feed normalization and sequencing logic in domain/application layers, with transport adapters isolated in infrastructure.
- Add conformance tests for ordered delivery, snapshot-plus-incremental reconstruction, and gap-recovery correctness.
- Add entitlement tests to ensure unauthorized symbols, products, or participant-private channels are never distributed.
- Add load tests for peak open and close intervals with loss simulation and subscriber reconnect storms.

## Compliance Constraints

- The market data distribution component shall consume only canonical domain events emitted by the matching engine and order book components.
- The market data distribution component shall assign or preserve a strictly increasing sequence number per feed channel.
- The market data distribution component shall never publish an incremental message without a sequence identifier.
- The market data distribution component shall provide a snapshot mechanism that allows a client to reconstruct current state before applying incrementals.
- The market data distribution component shall provide a gap-recovery mechanism that allows a client to request missing sequences within a configured retention window.
- The market data distribution component shall publish incremental updates in sequence order and shall not reorder events within a channel.
- The market data distribution component shall detect internal sequence gaps before publication and shall trigger operator alerts when gaps occur.
- The market data distribution component shall preserve event-time and publish-time metadata for latency measurement and audit.
- The market data distribution component shall separate public market data channels from participant-private order status channels.
- The market data distribution component shall enforce at least channel-level entitlement checks before allowing subscription.
- The market data distribution component shall encrypt authenticated private channels in transit and shall require client authentication for private subscriptions.
- The market data distribution component shall avoid embedding personally identifiable participant metadata in public feed payloads.
- The market data distribution component shall publish explicit event types for new order, modify order, cancel order, execution, trade bust, and trading status changes when applicable to the product.
- The market data distribution component shall version all feed schemas and shall maintain compatibility policy for additive and breaking changes.
- The market data distribution component shall keep a deterministic mapping from internal canonical events to each external feed product schema.
- The market data distribution component shall not mutate matching outcomes and shall treat matching and order-book events as immutable input.
- The market data distribution component shall not call back into matching or order-book services synchronously from the outbound publish path.
- The market data distribution component shall receive private order status events through a dedicated internal stream and shall not derive private updates by reverse engineering public feed payloads.
- The market data distribution component shall expose separate publisher interfaces for public feed and private status feed.
- The market data distribution component shall isolate transport concerns such as UDP, TCP, WebSocket, and FIX sessions from feed normalization and sequencing logic.
- The market data distribution component shall use adapter classes to implement transport protocols and shall prevent domain classes from importing adapter packages.
- The market data distribution component shall keep class naming conventions where normalizer classes end with Normalizer, sequencer classes end with Sequencer, and serializer classes end with Serializer.
- The market data distribution component shall keep inheritance depth at three levels or less across feed processing classes.
- The market data distribution component shall expose operational metrics for publish rate, per-channel latency, packet loss indicators, recovery request volume, and subscriber count.
- The market data distribution component shall support backpressure policies that protect core sequencing services from slow subscribers.
- The market data distribution component shall support sequence-reset and channel-failover procedures that are explicit, logged, and externally documented.
- The market data distribution component shall store outbound sequence and payload audit records with daily archive batches and seven-year retention policy definitions.
- The market data distribution component shall provide deterministic replay for compliance investigations and post-incident analysis.
- The market data distribution deployment shall target a single region for v1 and shall avoid active-active multi-region publication.

## Pros and Cons of the Options

### Sequenced event distribution with incremental multicast-style streams plus on-demand snapshot and gap-recovery channels

- Good, because this model fits high-throughput exchange dissemination.
- Good, because recovery is explicit and testable.
- Neutral, because clients must implement sequence and recovery handling.
- Bad, because infrastructure and observability demands are significant.

### Pure point-to-point request-response distribution over synchronous APIs

- Good, because it is easy for clients to consume.
- Good, because authorization can be straightforward per request.
- Bad, because it scales poorly for high-frequency fan-out.
- Bad, because latency and throughput characteristics are inferior for exchange-grade feeds.

### Brokered generic pub-sub platform as the primary exchange distribution fabric

- Good, because managed brokers can reduce implementation effort.
- Good, because many ecosystem tools are available.
- Bad, because deterministic sequence and ultra-low-latency guarantees may be difficult to achieve.
- Bad, because broker semantics may not align with exchange feed and recovery contracts.

## More Information

This ADR covers architecture patterns, not the commercial product definition of feed tiers.
A later ADR should define feed catalog, retention windows, and external interface contracts for each subscriber class.
Source context used: MADR template guidance, market-data dissemination references, and exchange protocol behavior summaries.