import { describe, it } from "vitest";
import { modules, classes, project } from "@nielspeter/ts-archunit";

const p = project("tsconfig.json");

describe("ADR-0001: Order Book Architecture – Compliance Constraints", () => {
  it("order book domain layer should not import infrastructure layer directly", () => {
    modules(p)
      .that()
      .resideInFolder("**/src/order-book/domain/**")
      .should()
      .notImportFrom("**/src/order-book/infrastructure/**")
      .rule({
        id: "order-book/domain-no-infrastructure-import",
        because:
          "The order book component shall read and write persistence only through an order-book repository interface owned by the order-book module",
        suggestion:
          "Depend on the Repository interface defined in domain rather than the infrastructure implementation",
      })
      .check();
  });

  it("order book modules should not import transport protocol packages", () => {
    modules(p)
      .that()
      .resideInFolder("**/src/order-book/**")
      .should()
      .notImportFrom(
        "**/transport/**",
        "**/adapters/fix/**",
        "**/adapters/ouch/**",
        "**/adapters/websocket/**",
        "**/adapters/http/**",
        "**/adapters/tcp/**",
        "**/adapters/udp/**"
      )
      .rule({
        id: "order-book/no-transport-imports",
        because:
          "The order book component shall not import any transport protocol classes for FIX, OUCH, WebSocket, HTTP, TCP, or UDP",
        suggestion:
          "Remove transport protocol imports; communicate outbound state changes only through domain events",
      })
      .check();
  });

  it("order book should not be imported directly by market data modules", () => {
    modules(p)
      .that()
      .resideInFolder("**/src/market-data/**")
      .should()
      .notImportFrom("**/src/order-book/domain/**", "**/src/order-book/infrastructure/**")
      .rule({
        id: "order-book/no-direct-market-data-coupling",
        because:
          "The order book component shall not be called directly by market data adapters and shall communicate outbound state changes only through domain events",
        suggestion:
          "Have market data adapters subscribe to domain events on the event bus rather than importing order book modules directly",
      })
      .check();
  });

  it("Aggregate classes should reside in the order book domain layer", () => {
    classes(p)
      .that()
      .haveNameEndingWith("Aggregate")
      .resideInFolder("**/src/order-book/**")
      .should()
      .resideInFolder("**/src/order-book/domain/**")
      .rule({
        id: "order-book/aggregates-in-domain",
        because:
          "The order book module shall follow naming conventions where aggregate classes end with Aggregate and keep domain entities under the domain layer",
        suggestion: "Move aggregate classes into src/order-book/domain/",
      })
      .check();
  });

  it("domain Event classes should reside in the order book domain layer", () => {
    classes(p)
      .that()
      .haveNameEndingWith("Event")
      .resideInFolder("**/src/order-book/**")
      .should()
      .resideInFolder("**/src/order-book/domain/**")
      .rule({
        id: "order-book/events-in-domain",
        because:
          "The order book module shall follow naming conventions where domain events end with Event and shall keep them under the domain layer",
        suggestion: "Move domain event classes into src/order-book/domain/",
      })
      .check();
  });

  it("Repository interfaces should reside in the order book domain layer", () => {
    classes(p)
      .that()
      .haveNameEndingWith("Repository")
      .resideInFolder("**/src/order-book/**")
      .should()
      .resideInFolder("**/src/order-book/domain/**")
      .rule({
        id: "order-book/repository-interfaces-in-domain",
        because:
          "The order book module shall keep domain entities and value objects under the domain layer; repository interfaces are domain-owned contracts and implementations belong in infrastructure",
        suggestion:
          "Place the Repository interface in src/order-book/domain/ and the concrete implementation in src/order-book/infrastructure/",
      })
      .check();
  });

  it("order book infrastructure should not be imported from outside the order book module", () => {
    modules(p)
      .that()
      .notImportFrom("**/src/order-book/**")
      .resideInFolder("**/src/**")
      .should()
      .notImportFrom("**/src/order-book/infrastructure/**")
      .rule({
        id: "order-book/infrastructure-not-externally-visible",
        because:
          "The order book component shall expose stable domain models so that matching, surveillance, and market data components can consume events without reading internal storage structures",
        suggestion:
          "External modules must only depend on the order book domain interfaces, not the infrastructure implementations",
      })
      .check();
  });
});
