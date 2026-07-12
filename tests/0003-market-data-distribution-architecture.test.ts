import { describe, it } from "vitest";
import { modules, classes, project } from "@nielspeter/ts-archunit";

const p = project("tsconfig.json");

describe("ADR-0003: Market Data Distribution Architecture – Compliance Constraints", () => {
  it("market data domain layer should not import infrastructure or transport adapter packages", () => {
    modules(p)
      .that()
      .resideInFolder("**/src/market-data/domain/**")
      .should()
      .notImportFrom(
        "**/src/market-data/infrastructure/**",
        "**/transport/**",
        "**/adapters/udp/**",
        "**/adapters/tcp/**",
        "**/adapters/websocket/**",
        "**/adapters/fix/**"
      )
      .rule({
        id: "market-data/domain-no-transport-imports",
        because:
          "The market data distribution component shall isolate transport concerns such as UDP, TCP, WebSocket, and FIX sessions from feed normalization and sequencing logic",
        suggestion:
          "Keep transport protocol handling in adapter classes under the infrastructure layer; domain classes must not depend on them",
      })
      .check();
  });

  it("market data domain and application layers should not call back into matching or order book synchronously", () => {
    modules(p)
      .that()
      .resideInFolder("**/src/market-data/domain/**")
      .should()
      .notImportFrom("**/src/matching-engine/**", "**/src/order-book/**")
      .rule({
        id: "market-data/no-callback-into-matching-or-order-book",
        because:
          "The market data distribution component shall not call back into matching or order-book services synchronously from the outbound publish path",
        suggestion:
          "Market data should consume immutable domain events from the event bus rather than calling matching or order book services directly",
      })
      .check();
  });

  it("market data distribution should not mutate matching or order book events", () => {
    modules(p)
      .that()
      .resideInFolder("**/src/market-data/**")
      .should()
      .notImportFrom(
        "**/src/matching-engine/infrastructure/**",
        "**/src/order-book/infrastructure/**"
      )
      .rule({
        id: "market-data/no-matching-infrastructure-coupling",
        because:
          "The market data distribution component shall not mutate matching outcomes and shall treat matching and order-book events as immutable input",
        suggestion:
          "Consume only domain events (not infrastructure internals) from the matching engine and order book",
      })
      .check();
  });

  it("Normalizer classes should reside in market data domain or application layers", () => {
    classes(p)
      .that()
      .haveNameEndingWith("Normalizer")
      .resideInFolder("**/src/market-data/**")
      .should()
      .resideInFolder("**/src/market-data/domain/**", "**/src/market-data/application/**")
      .rule({
        id: "market-data/normalizers-in-domain-or-application",
        because:
          "The market data distribution component shall keep class naming conventions where normalizer classes end with Normalizer and feed normalization logic is kept in domain or application layers",
        suggestion:
          "Move Normalizer classes into src/market-data/domain/ or src/market-data/application/",
      })
      .check();
  });

  it("Sequencer classes should reside in market data domain or application layers", () => {
    classes(p)
      .that()
      .haveNameEndingWith("Sequencer")
      .resideInFolder("**/src/market-data/**")
      .should()
      .resideInFolder("**/src/market-data/domain/**", "**/src/market-data/application/**")
      .rule({
        id: "market-data/sequencers-in-domain-or-application",
        because:
          "The market data distribution component shall keep class naming conventions where sequencer classes end with Sequencer and sequencing logic is kept in domain or application layers",
        suggestion:
          "Move Sequencer classes into src/market-data/domain/ or src/market-data/application/",
      })
      .check();
  });

  it("Serializer classes should reside in market data infrastructure layer", () => {
    classes(p)
      .that()
      .haveNameEndingWith("Serializer")
      .resideInFolder("**/src/market-data/**")
      .should()
      .resideInFolder("**/src/market-data/infrastructure/**")
      .rule({
        id: "market-data/serializers-in-infrastructure",
        because:
          "The market data distribution component shall keep class naming conventions where serializer classes end with Serializer and transport serialization belongs to the infrastructure/adapter layer",
        suggestion:
          "Move Serializer classes into src/market-data/infrastructure/",
      })
      .check();
  });

  it("market data domain and application layers should not import transport adapter implementations", () => {
    modules(p)
      .that()
      .resideInFolder(
        "**/src/market-data/domain/**",
        "**/src/market-data/application/**"
      )
      .should()
      .notImportFrom("**/src/market-data/infrastructure/**")
      .rule({
        id: "market-data/no-infrastructure-import-in-domain-or-application",
        because:
          "The market data distribution component shall use adapter classes to implement transport protocols and shall prevent domain classes from importing adapter packages",
        suggestion:
          "Depend on domain interfaces rather than infrastructure implementations; inject adapters via dependency injection",
      })
      .check();
  });
});
