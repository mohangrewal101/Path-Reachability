import { ProgramAnalyzer } from "../../src/classes/ProgramAnalyzer";
import * as ts from "typescript";
import { Context } from "./Context"; // Assuming this is the correct import for Context

describe("ProgramAnalyzer", () => {
  test("visitNode correctly updates context", async () => {
    const fileName = "../sample-inputs/reachable/boolsSunny.js";

    const mockSourceFile = ts.createSourceFile(
      fileName,
      readFileSync(fileName).toString(),
      ts.ScriptTarget.ES2020,
      true
    );
    const analyzer = new ProgramAnalyzer(mockSourceFile);
    const context = new Context({ topLevel: true });

    analyzer.visitNode(context, mockSourceFile);

    // Now check that context is in the expected state
    // This will depend on what visitNode is supposed to do
    // For example, if it's supposed to add a path for each node in the source file:
    expect(context.getPaths().length).toBe(mockSourceFile.nodes.length);
  });
});
