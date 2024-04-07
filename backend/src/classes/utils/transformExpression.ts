import { ts, Project } from "ts-morph";
import * as ts2 from "typescript";

export const transformExpression = (
  currentExpression: ts.Node,
  expressionMap: Map<string, ts.Node>
): ts.Node => {
  const expressionString = currentExpression.getFullText();
  const project = new Project();

  // Create source file from text
  let sourceFileText = "";

  expressionMap.forEach((val, key) => {
    sourceFileText += `let ${key} = ${val.getText()};\n`;
  });

  sourceFileText += expressionString;

  const sourceFile = project.createSourceFile("tmp.ts", sourceFileText);

  const map: Map<string, ts.Node> = new Map();

  sourceFile.transform((traversal) => {
    const node = traversal.visitChildren();

    if (ts.isVariableDeclarationList(node)) {
      node.declarations.forEach((declaration) => {
        if (declaration.name) {
          map.set(declaration.name.getText(), declaration.initializer);
        }
      });
    } else if (ts.isIdentifier(node)) {
      if (map.has(node.getText())) {
        let replacement = map.get(node.getText());
        if (ts.isNumericLiteral(replacement)) {
          return traversal.factory.createNumericLiteral(replacement.getText());
        } else if (ts.isExpression(replacement)) {
          return traversal.factory.createParenthesizedExpression(replacement);
        } else {
          return replacement;
        }
      }
    }

    return node;
  });

  const sourceFile2 = ts2.createSourceFile(
    "tmp2.ts",
    sourceFile.getFullText(),
    ts.ScriptTarget.ES2020,
    true
  );

  let returnVal: ts.Node =
    sourceFile2.statements[sourceFile2.statements.length - 1];

  if (ts.isExpressionStatement(returnVal)) {
    returnVal = returnVal.expression;
  }

  return returnVal;
};
