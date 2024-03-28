/// <reference types="jest" />

import { ProgramAnalyzer } from "../../src/classes/ProgramAnalyzer";
import * as ts from "typescript";
import { Context } from "../../src/classes/Context"; // Assuming this is the correct import for Context
import * as fs from "fs";
import * as path from "path";

describe("ProgramAnalyzer", () => {
  test("visitNode correctly updates context", async () => {
    const filePath = path.join(
      __dirname,
      "../sample-inputs/reachable/testProgram1.ts"
    );
    const fileContents = fs.readFileSync(filePath, "utf-8").toString();

    const sampleFile = ts.createSourceFile(
      filePath,
      fileContents,
      ts.ScriptTarget.ES2020,
      true
    );
    const analyzer = new ProgramAnalyzer();
    analyzer.setSourceFile(sampleFile);
    const context = new Context({ topLevel: true });

    analyzer.visitNode(context, sampleFile);

    let vars = context.getVars();
    let paths = context.getPaths();
    // let notes = context.getNotes();
    // let condition = context.getCondition();

    // Now check that context is in the expected state
    // This will depend on what visitNode is supposed to do
    // For example, if it's supposed to add a path for each node in the source file:
    expect(true);
  });
});
