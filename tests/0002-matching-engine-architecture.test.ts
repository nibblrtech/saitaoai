import { describe, it } from "vitest";
import { modules, classes, project } from "@nielspeter/ts-archunit";

const p = project("tsconfig.json");

describe("ADR-0002: Matching Engine Architecture – Compliance Constraints", () => {
  // ADR_CONSTRAINT: The matching engine component shall call the order book only through a domain-defined order book port interface.
  // ADR_CONSTRAINT: The matching engine component shall not call order book repository implementations directly.
  it("matching engine domain layer should not import infrastructure layer directly", () => {
    modules(p)
      .that()
      .resideInFolder("**/src/matching-engine/domain/**")
      .should()
      .notImportFrom("**/src/matching-engine/infrastructure/**")
      .rule({
        id: "matching-engine/domain-no-infrastructure-import",
        because:
          "The matching engine module shall keep orchestration classes in the application layer and matching rules in pure domain services",
        suggestion:
          "Move infrastructure concerns to the application or infrastructure layer; keep domain services pure",
      })
      .check();
  });

  // ADR_CONSTRAINT: The matching engine component shall not import client protocol codecs for FIX, OUCH, WebSocket, REST, or persistence frameworks in core matching classes.
  it("matching engine core classes should not import transport protocol packages", () => {
    modules(p)
      .that()
      .resideInFolder("**/src/matching-engine/domain/**")
      .should()
      .notImportFrom(
        "**/transport/**",
        "**/adapters/fix/**",
        "**/adapters/ouch/**",
        "**/adapters/websocket/**",
        "**/adapters/rest/**",
        "**/adapters/http/**"
      )
      .rule({
        id: "matching-engine/no-transport-imports-in-core",
        because:
          "The matching engine component shall not import client protocol codecs for FIX, OUCH, WebSocket, REST, or persistence frameworks in core matching classes",
        suggestion:
          "Keep transport protocol handling in adapter classes within the infrastructure layer",
      })
      .check();
  });

  // ADR_CONSTRAINT: The matching engine component shall not call market data publisher APIs directly from matching logic and shall publish only domain events to an internal event bus.
  it("matching engine should not call market data publisher APIs directly from matching logic", () => {
    modules(p)
      .that()
      .resideInFolder("**/src/matching-engine/domain/**")
      .should()
      .notImportFrom("**/src/market-data/**")
      .rule({
        id: "matching-engine/no-direct-market-data-calls",
        because:
          "The matching engine component shall not call market data publisher APIs directly from matching logic and shall publish only domain events to an internal event bus",
        suggestion:
          "Publish domain events to an event bus; let market data adapters subscribe to those events",
      })
      .check();
  });

  // ADR_CONSTRAINT: The matching engine component shall not call clearing, settlement, or reporting adapters synchronously on the matching path.
  it("matching engine application layer should not import from market data or clearing adapters", () => {
    modules(p)
      .that()
      .resideInFolder("**/src/matching-engine/application/**")
      .should()
      .notImportFrom("**/src/clearing/**", "**/src/settlement/**", "**/src/reporting/**")
      .rule({
        id: "matching-engine/no-synchronous-adapter-calls-on-matching-path",
        because:
          "The matching engine component shall not call clearing, settlement, or reporting adapters synchronously on the matching path",
        suggestion:
          "Use asynchronous domain events or an outbox pattern to notify downstream systems",
      })
      .check();
  });

  // ADR_CONSTRAINT: The matching engine module shall follow naming conventions where command classes end with Command, use-case handlers end with Handler, and emitted event classes end with Event.
  it("Command classes should reside in the matching engine application layer", () => {
    classes(p)
      .that()
      .haveNameEndingWith("Command")
      .resideInFolder("**/src/matching-engine/**")
      .should()
      .resideInFolder("**/src/matching-engine/application/**")
      .rule({
        id: "matching-engine/commands-in-application-layer",
        because:
          "The matching engine module shall follow naming conventions where command classes end with Command and orchestration classes reside in the application layer",
        suggestion: "Move Command classes into src/matching-engine/application/",
      })
      .check();
  });

  // ADR_CONSTRAINT: The matching engine module shall follow naming conventions where command classes end with Command, use-case handlers end with Handler, and emitted event classes end with Event.
  it("Handler classes should reside in the matching engine application layer", () => {
    classes(p)
      .that()
      .haveNameEndingWith("Handler")
      .resideInFolder("**/src/matching-engine/**")
      .should()
      .resideInFolder("**/src/matching-engine/application/**")
      .rule({
        id: "matching-engine/handlers-in-application-layer",
        because:
          "The matching engine module shall follow naming conventions where use-case handlers end with Handler and reside in the application layer",
        suggestion: "Move Handler classes into src/matching-engine/application/",
      })
      .check();
  });

  // ADR_CONSTRAINT: The matching engine module shall follow naming conventions where command classes end with Command, use-case handlers end with Handler, and emitted event classes end with Event.
  it("domain Event classes should reside in the matching engine domain layer", () => {
    classes(p)
      .that()
      .haveNameEndingWith("Event")
      .resideInFolder("**/src/matching-engine/**")
      .should()
      .resideInFolder("**/src/matching-engine/domain/**")
      .rule({
        id: "matching-engine/events-in-domain",
        because:
          "The matching engine module shall follow naming conventions where emitted event classes end with Event and domain events reside in the domain layer",
        suggestion: "Move Event classes into src/matching-engine/domain/",
      })
      .check();
  });

  // ADR_CONSTRAINT: The matching engine module shall not inherit domain service classes from infrastructure base classes.
  it("matching engine domain service files should not import from infrastructure layer", () => {
    modules(p)
      .that()
      .resideInFolder("**/src/matching-engine/domain/**")
      .should()
      .notImportFrom("**/src/matching-engine/infrastructure/**")
      .rule({
        id: "matching-engine/domain-services-no-infrastructure-inheritance",
        because:
          "The matching engine module shall not inherit domain service classes from infrastructure base classes",
        suggestion:
          "Use composition and dependency injection instead of inheriting from infrastructure base classes",
      })
      .check();
  });
});
