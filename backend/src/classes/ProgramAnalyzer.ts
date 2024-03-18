import * as ts from "typescript";
import { SyntaxKind } from "typescript";
import { Context } from "./Context";
import { Note } from "./Types";
import { Condition } from "./Condition";

const LOGGING = true;
const WARNING = true;

const log = (...args: any[]) => {
  if (LOGGING) {
    console.log(...args);
  }
};

const warn = (...args: any[]) => {
  if (WARNING) {
    console.warn(...args);
  }
};

export class ProgramAnalyzer {
  jumpTable: any;
  sourceFile: ts.SourceFile | undefined;
  constructor() {
    this.jumpTable = {
      [SyntaxKind.ArrowFunction]: this.visitArrowFunction,
      [SyntaxKind.BinaryExpression]: this.visitBinaryExpression,
      [SyntaxKind.Block]: this.visitBlock,
      [SyntaxKind.ClassDeclaration]: this.visitClassDeclaration,
      [SyntaxKind.ConditionalExpression]: this.visitConditionalExpression,
      [SyntaxKind.EqualsToken]: this.visitEqualsToken,
      [SyntaxKind.ExpressionStatement]: this.visitExpressionStatement,
      [SyntaxKind.FirstStatement]: this.visitFirstStatement,
      [SyntaxKind.FunctionDeclaration]: this.visitFunctionDeclaration,
      [SyntaxKind.GreaterThanToken]: this.visitGreaterThanToken,
      [SyntaxKind.GreaterThanEqualsToken]: this.visitEqualsGreaterThanToken,
      [SyntaxKind.Identifier]: this.visitIdentifier,
      [SyntaxKind.IfStatement]: this.visitIfStatement,
      [SyntaxKind.LessThanToken]: this.visitLessThanToken,
      [SyntaxKind.LessThanEqualsToken]: this.visitLessThanEqualsToken,
      [SyntaxKind.NumericLiteral]: this.visitNumericLiteral,
      [SyntaxKind.Parameter]: this.visitParameter,
      [SyntaxKind.PropertyAccessExpression]: this.visitPropertyAccessExpression,
      [SyntaxKind.PropertyDeclaration]: this.visitPropertyDeclaration,
      [SyntaxKind.StringLiteral]: this.visitStringLiteral,
      [SyntaxKind.SourceFile]: this.visitSourceFile,
      [SyntaxKind.SyntaxList]: this.visitSyntaxList,
      [SyntaxKind.ThisKeyword]: this.visitThisKeyword,
      [SyntaxKind.VariableDeclaration]: this.visitVariableDeclaration,
      [SyntaxKind.VariableDeclarationList]: this.visitVariableDeclarationList,
      [SyntaxKind.ReturnStatement]: this.visitReturnStatement,
    };
  }

  analyze = (sourceFile: ts.SourceFile) => {
    this.sourceFile = sourceFile;
    return new Promise<Note[]>((resolve) => {
      const context = new Context({ topLevel: true });
      this.visitNode(context, sourceFile);
      console.log("=========");
      console.log("GETTING PATHS");
      console.log("=========");
      context.getPaths().forEach((path) => {
        let pathArr = [];
        path.forEach((condition) => {
          pathArr.push(condition.toString());
        });
        console.log("[ " + pathArr.join(", "), "]");
      });
      resolve(context.getNotes());
    });
  };

  visitNode = (context: Context, node: ts.Node) => {
    if (Object.prototype.hasOwnProperty.call(this.jumpTable, node.kind)) {
      const visitFn = this.jumpTable[node.kind];
      visitFn(context, node);
    } else {
      warn(
        "found an unspecified node: ",
        node.getText(),
        ", ",
        ts.SyntaxKind[node.kind]
      );
    }
  };

  visitExpressionStatement = (
    context: Context,
    node: ts.ExpressionStatement
  ) => {
    log("visiting expression statement: ", node.getText());
    node.expression.getChildren().forEach((child) => {
      this.visitNode(context, child);
    });
  };

  visitClassDeclaration = (context: Context, node: ts.ClassDeclaration) => {
    log("Visiting class declaration: ", node.getText());

    node.members.forEach((member) => {
      this.visitNode(context, member);
    });
  };

  visitPropertyDeclaration = (
    context: Context,
    node: ts.PropertyDeclaration
  ) => {
    log("Visiting property declaration: ", node.getText());

    if (node.initializer) {
      this.visitNode(context, node.initializer);
    }
  };

  visitSourceFile = (context: Context, node: ts.SourceFile) => {
    node.statements.forEach((node: ts.Statement) => {
      this.visitNode(context, node);
    });
  };

  visitIfStatement = (context: Context, node: ts.IfStatement) => {
    log("found an if statement");

    let currContext: Context;
    if (context.isTopLevel()) {
      currContext = new Context({ context });
      context.addTopLevelNode(currContext);
    } else {
      currContext = context;
    }

    const trueChild = new Context({ context: currContext });
    currContext.setTrueChild(trueChild);
    currContext.setCondition(node.expression);

    this.visitNode(currContext, node.expression);
    this.visitNode(trueChild, node.thenStatement);
    if (node.elseStatement) {
      const falseChild = new Context({ context: currContext });
      currContext.setFalseChild(falseChild);
      this.visitNode(falseChild, node.elseStatement);
    }
  };

  visitConditionalExpression = (
    context: Context,
    node: ts.ConditionalExpression
  ) => {
    log("Found a conditional expression: ", node.getText());
  };

  visitBinaryExpression = (context: Context, node: ts.BinaryExpression) => {
    log("Found a binary expression: ", node.getText());
    this.visitNode(context, node.left);
    this.visitNode(context, node.operatorToken);
    this.visitNode(context, node.right);
  };

  visitEqualsGreaterThanToken = (
    context: Context,
    node: ts.EqualsGreaterThanToken
  ) => {
    log("Found a greater than equals token: ", node.getText());
  };

  visitParameter = (context: Context, node: ts.ParameterDeclaration) => {
    log("Found a parameter: ", node.name.getText(), ": ", node.type.getText());
    context.addVar(node.name.getText(), node.type.getText());
  };

  visitIdentifier = (context: Context, node: ts.Identifier) => {
    log("Found an identifier: ", node.getText());
  };

  visitStringLiteral = (context: Context, node: ts.StringLiteral) => {
    log("Found a string literal: ", node.getText());
  };

  visitFirstLiteralToken = (context: Context, node: ts.LiteralToken) => {
    log("Found a first literal token: ", node.getText());
  };

  visitVariableDeclarationList = (
    context: Context,
    node: ts.VariableDeclarationList
  ) => {
    log("Found a variable declaration list: ", node.getText());
    node.declarations.forEach((node) => {
      this.visitNode(context, node);
    });
  };

  visitVariableDeclaration = (
    context: Context,
    node: ts.VariableDeclaration
  ) => {
    log("Found variable declaration: ", node.getText());
    this.visitNode(context, node.name);

    if (node.initializer) {
      this.visitNode(context, node.initializer);
    }
  };

  visitGreaterThanToken = (context: Context, node: ts.Node) => {
    log("Found greater than token: ", node.getText());
  };

  visitLessThanToken = (context: Context, node: ts.Node) => {
    log("Found less than token: ", node.getText());
  };

  visitNumericLiteral = (context: Context, node: ts.NumericLiteral) => {
    log("Found a numeric literal: ", node.getText());
  };

  visitArrowFunction = (context: Context, node: ts.ArrowFunction) => {
    log("Found an arrow function: ", node.getText());
    node.parameters.forEach((child) => {
      this.visitNode(context, child);
    });
    this.visitNode(context, node.body);
  };

  visitFirstStatement = (context: Context, node: ts.Statement) => {
    log("Visiting first statement: ", node.getText());
    node.getChildren().forEach((node) => {
      this.visitNode(context, node);
    });
  };

  visitEqualsToken = (context: Context, node: ts.EqualsToken) => {
    log("Visiting equals token: ", node.getText());
  };

  visitBlock = (context: Context, node: ts.Block) => {
    log("Visiting block");
    node.getChildren().forEach((child) => {
      this.visitNode(context, child);
    });
  };

  visitSyntaxList = (context: Context, node: ts.SyntaxList) => {
    log("visiting syntax list: ", node.getText());
    node.getChildren().forEach((child) => {
      this.visitNode(context, child);
    });
  };

  visitFunctionDeclaration = (
    context: Context,
    node: ts.FunctionDeclaration
  ) => {
    log("Visiting function declaration");
    log("add new test here");
    node.parameters.forEach((child) => {
      this.visitNode(context, child);
    });

    if (node.body) {
      this.visitNode(context, node.body);
    }
  };

  visitLessThanEqualsToken = (context: Context, node: ts.Node) => {
    log("Visiting less than equals token: ", node.getText());
  };

  visitPropertyAccessExpression = (
    context: Context,
    node: ts.PropertyAccessExpression
  ) => {
    log("Visiting property access expression: ", node.getText());

    this.visitNode(context, node.expression);
    this.visitNode(context, node.name);
  };

  visitReturnStatement = (context: Context, node: ts.Node) => {
    log("Visiting return statement: ", node.getText());
  };

  visitThisKeyword = (context: Context, node: ts.Node) => {
    log("Visiting ThisKeyword: ", node.getText());
  };
}
