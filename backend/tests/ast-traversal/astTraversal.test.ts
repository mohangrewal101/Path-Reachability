/// <reference types="jest" />

import { ProgramAnalyzer } from "../../src/classes/ProgramAnalyzer";
import * as ts from "typescript";
import {
  ContextPathsEvaluator,
  ContextPathsVisitorContext,
} from "../../src/classes/Evaluators/ContextEvaluator";
import { ProgramStatementProcessor } from "../../src/classes/ProgramStatements/ProgramStatementProcessor";
import { Context } from "../../src/classes/Contexts/Context";
import * as fs from "fs";
import * as path from "path";

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
  const context = new Context({});

  analyzer.visitNode(context, sampleFile);

  const contextEvaluator = new ContextPathsEvaluator();
  const visitorContext = new ContextPathsVisitorContext();
  contextEvaluator.visit(visitorContext, context);

  const programStatementLists = visitorContext.getChildPaths();
  const programStatementProcessor = new ProgramStatementProcessor();
  const conditionLists = programStatementProcessor.processProgramStatementLists(
    programStatementLists
  );

  const vars = context.getVars();
  const paths = conditionLists;

  return { vars, paths };
}

describe("ProgramAnalyzer", () => {
  test("reachable - testProgram1", async () => {
    const file = "../sample-inputs/reachable/testProgram1.ts";
    const context = getTestContext(file);
    let vars = context.vars;
    let paths = context.paths;
    expect(vars).toEqual({ a: "boolean", b: "boolean", c: "boolean" });
    expect(paths.length).toEqual(8);
  });

  test("reachable - boolSimple", async () => {
    const file = "../sample-inputs/reachable/boolSimple.ts";
    const context = getTestContext(file);
    let vars = context.vars;
    let paths = context.paths;
    expect(vars).toEqual({ a: "boolean" });
    expect(paths.length).toEqual(2);
  });
  test("reachable - boolSunny", async () => {
    const file = "../sample-inputs/reachable/boolSunny.ts";
    const context = getTestContext(file);
    let vars = context.vars;
    let paths = context.paths;
    expect(vars).toEqual({
      isSunny: "boolean",
      isWeekday: "boolean",
      isSummer: "boolean",
    });
    expect(paths.length).toEqual(2);
  });
  test("reachable - boolWeekend", async () => {
    const file = "../sample-inputs/reachable/boolWeekend.ts";
    const context = getTestContext(file);
    let vars = context.vars;
    let paths = context.paths;
    expect(vars).toEqual({
      isWeekend: "boolean",
      isHoliday: "boolean",
    });
    expect(paths.length).toEqual(5);
  });
  test("reachable - calculateGrade", async () => {
    const file = "../sample-inputs/reachable/calculateGrade.ts";
    const context = getTestContext(file);
    let vars = context.vars;
    let paths = context.paths;
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
    let vars = context.vars;
    let paths = context.paths;
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
    let vars = context.vars;
    let paths = context.paths;
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
  test("reachable - compareToNum", async () => {
    const file = "../sample-inputs/reachable/compareToNum.ts";
    const context = getTestContext(file);
    let vars = context.vars;
    let paths = context.paths;
    console.log("Vars: ", vars);
    console.log("Paths: ", paths);
    expect(true);
    expect(vars).toEqual({
      a: "number",
      b: "number",
    });
    expect(paths.length).toEqual(6);
  });

  test("unreachable - boolDeadNestedBlock", async () => {
    const file = "../sample-inputs/unreachable/boolDeadNestedBlock.ts";
    const context = getTestContext(file);
    let vars = context.vars;
    let paths = context.paths;
    expect(vars).toEqual({ a: "boolean" });
    expect(paths.length).toEqual(3);
  });

  test("unreachable - boolTwoVarContradiction", async () => {
    const file = "../sample-inputs/unreachable/boolTwoVarContradiction.ts";
    const context = getTestContext(file);
    let vars = context.vars;
    let paths = context.paths;
    expect(vars).toEqual({ a: "boolean", b: "boolean" });
    expect(paths.length).toEqual(3);
  });

  test("unreachable - numContradiction", async () => {
    const file = "../sample-inputs/unreachable/numContradiction.ts";
    const context = getTestContext(file);
    let vars = context.vars;
    let paths = context.paths;
    expect(vars).toEqual({ num1: "number", num2: "number" });
    expect(paths.length).toEqual(4);
  });

  test("unreachable - numCompareToConst", async () => {
    const file = "../sample-inputs/unreachable/numCompareToConst.ts";
    const context = getTestContext(file);
    let vars = context.vars;
    let paths = context.paths;
    expect(vars).toEqual({ num: "number" });
    expect(paths.length).toEqual(3);
  });
});
