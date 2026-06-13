import { describe, it } from "vitest";
import { modules, project } from "@nielspeter/ts-archunit";

const p = project("tsconfig.json");

describe("Architecture rules", () => {
  it("domain layer should only import domain and shared modules", () => {
    modules(p)
      .that()
      .resideInFolder("**/src/domain/**")
      .should()
      .onlyImportFrom("**/src/domain/**", "**/src/shared/**")
      .rule({
        id: "layer/domain-isolation",
        because: "Domain should not depend on infrastructure concerns",
        suggestion: "Move infrastructure imports behind an application or adapter boundary"
      })
      .check();
  });
});
