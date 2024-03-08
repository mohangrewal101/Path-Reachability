import * as ts from "typescript";
import { ProgramAnalyzer } from "../classes/ProgramAnalyzer";

const analyzeProgram = async (data: any) => {
  console.log("program data:");
  console.log(data.program);

  const sourceFile = ts.createSourceFile(
    "file",
    data.program,
    ts.ScriptTarget.ES2020,
    true
  );

  const programAnalyzer = new ProgramAnalyzer();
  const analyzerNotes = await programAnalyzer.analyze(sourceFile);
  console.log(analyzerNotes);
  return analyzerNotes;
};

export const programAnalyzerService = {
  analyzeProgram,
};
