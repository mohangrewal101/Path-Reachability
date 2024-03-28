import ts from "typescript";
import { LineNumbers } from "../Types";

export const getLineNumbers = (
  sourceFile: ts.SourceFile,
  node: ts.IfStatement
): LineNumbers => {
  const getLineNumber = (pos?: number) =>
    pos !== undefined
      ? sourceFile.getLineAndCharacterOfPosition(pos).line
      : undefined;

  const thenStartLine = getLineNumber(node.thenStatement.getStart());
  const thenEndLine = getLineNumber(node.thenStatement.getEnd());
  const elseStartLine = getLineNumber(node.elseStatement?.getStart());
  const elseEndLine = getLineNumber(node.elseStatement?.getEnd());
  console.log(
    "thenStart: ",
    thenStartLine,
    "thenEnd: ",
    thenEndLine,
    "elseStart: ",
    elseStartLine,
    "elseEnd: ",
    elseEndLine
  );
  const lineNumbers: LineNumbers = {
    thenStartLine,
    thenEndLine,
    elseStartLine,
    elseEndLine,
  };

  return lineNumbers;
};
