import ts from "typescript";

export const getLineNumbers = (
  sourceFile: ts.SourceFile,
  node: ts.IfStatement
): { startLine: number; endLine: number } => {
  const start = node.expression.getStart(sourceFile);
  const startLine = sourceFile?.getLineAndCharacterOfPosition(start).line || 0;
  const statementEnd = node.thenStatement.getEnd();

  const endLine =
    sourceFile?.getLineAndCharacterOfPosition(statementEnd).line || 0;
  return { startLine, endLine };
};
