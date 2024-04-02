/// <reference types="jest" />

import { ProgramAnalyzer } from "../../src/classes/ProgramAnalyzer";
import * as ts from "typescript";
import { CustomContext } from "../../src/classes/CustomContext"; // Assuming this is the correct import for CustomContext
import * as fs from "fs";
import * as path from "path";

describe("ProgramAnalyzer", () => {
  test("reachable - testProgram1", async () => {
    const file = "../sample-inputs/reachable/testProgram1.ts";
    const context = getTestContext(file);
    let vars = context.getVars();
    let paths = context.getPaths();
    expect(vars).toEqual({ a: "boolean", b: "boolean", c: "boolean" });
    expect(paths.length).toEqual(8);
    expect(false);
  });
  test("unreachable - boolSimpleContradiction", async () => {
    const file = "../sample-inputs/unreachable/boolSimpleContradiction.ts";
    const context = getTestContext(file);
    let vars = context.getVars();
    let paths = context.getPaths();
    expect(vars).toEqual({ a: "boolean" });
    expect(paths.length).toEqual(3);
  });
  test("reachable - boolSimple", async () => {
    const file = "../sample-inputs/reachable/boolSimple.ts";
    const context = getTestContext(file);
    let vars = context.getVars();
    let paths = context.getPaths();
    expect(vars).toEqual({ a: "boolean" });
    expect(paths.length).toEqual(2);
  });
  test("reachable - boolSunny", async () => {
    const file = "../sample-inputs/reachable/boolSunny.ts";
    const context = getTestContext(file);
    let vars = context.getVars();
    let paths = context.getPaths();
    expect(vars).toEqual({
      isSunny: "boolean",
      isWeekday: "boolean",
      isSummer: "boolean",
    });
    expect(paths.length).toEqual(2);
  });
  test("reachable - boolsWeekend", async () => {
    const file = "../sample-inputs/reachable/boolsWeekend.ts";
    const context = getTestContext(file);
    let vars = context.getVars();
    let paths = context.getPaths();
    expect(vars).toEqual({
      isWeekend: "boolean",
      isHoliday: "boolean",
    });
    expect(paths.length).toEqual(3);
  });
  test("reachable - calculateGrade", async () => {
    const file = "../sample-inputs/reachable/calculateGrade.ts";
    const context = getTestContext(file);
    let vars = context.getVars();
    let paths = context.getPaths();
    expect(vars).toEqual({
      score: "number",
      total: "number",
      cheated: "boolean",
      percentage: "number",
      grade: "string",
    });
    expect(paths.length).toEqual(10);
  });

  test("reachable - hasLicense", async () => {
    const file = "../sample-inputs/reachable/hasLicense.ts";
    const context = getTestContext(file);
    let vars = context.getVars();
    let paths = context.getPaths();
    expect(vars).toEqual({
      age: "number",
      hasLicense: "boolean",
      allowedToDrive: "boolean",
    });
    expect(paths.length).toEqual(2);
  });

  test("reachable - simpleCompare", async () => {
    const file = "../sample-inputs/reachable/simpleCompare.ts";
    const context = getTestContext(file);
    let vars = context.getVars();
    let paths = context.getPaths();
    console.log("paths: ", paths);
    expect(vars).toEqual({
      a: "number",
      b: "number",
      c: "number",
    });

    // TODO: This test if failing because the paths are nested inside the context. So there are 6 paths, but they appear nested.
    //      Need to figure out how to flatten the paths and see if this logic needs to be applied elsewhere.
    expect(paths.length).toEqual(6);
  });
});

function getTestContext(file: string) {
  const filePath = path.join(__dirname, file);
  const fileContents = fs.readFileSync(filePath, "utf-8").toString();

  const sampleFile = ts.createSourceFile(
    filePath,
    fileContents,
    ts.ScriptTarget.ES2020,
    true
  );
  const analyzer = new ProgramAnalyzer();
  analyzer.setSourceFile(sampleFile);
  const context = new CustomContext({ topLevel: true });

  analyzer.visitNode(context, sampleFile);
  return context;
}
