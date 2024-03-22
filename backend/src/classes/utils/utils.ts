import ts from "typescript";

export const getLineNumbers = (
  sourceFile: ts.SourceFile,
  node: ts.IfStatement
): {
  thenStart: number;
  thenEnd: number;
  elseStart: number;
  elseEnd: number;
} => {
  const getLineNumber = (pos?: number) =>
    pos !== undefined
      ? sourceFile.getLineAndCharacterOfPosition(pos).line
      : undefined;

  const thenStart = getLineNumber(node.thenStatement.getStart());
  const thenEnd = getLineNumber(node.thenStatement.getEnd());
  const elseStart = getLineNumber(node.elseStatement?.getStart());
  const elseEnd = getLineNumber(node.elseStatement?.getEnd());
  console.log(
    "thenStart: ",
    thenStart,
    "thenEnd: ",
    thenEnd,
    "elseStart: ",
    elseStart,
    "elseEnd: ",
    elseEnd
  );

  return { thenStart, thenEnd, elseStart, elseEnd };
};
