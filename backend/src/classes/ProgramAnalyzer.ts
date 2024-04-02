import * as ts from "typescript";
import { SyntaxKind } from "typescript";
import { CustomContext } from "./CustomContext";
import { ContextToZ3 } from "./ContextToZ3";
import { LineNumbers } from "./Types";
import { getLineNumbers } from "./utils/utils";
import { PathNote } from "./Types";

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

  // setter for this.sourceFile used for testing
  setSourceFile(sourceFile: ts.SourceFile) {
    this.sourceFile = sourceFile;
  }

  analyze = (sourceFile: ts.SourceFile) => {
    this.sourceFile = sourceFile;
    return new Promise<PathNote[]>((resolve, reject) => {
      const context = new CustomContext({ topLevel: true });
      this.visitNode(context, sourceFile);
      console.log("=========");
      console.log("GETTING PATHS");
      console.log("=========");
      context.getPaths().forEach((path) => {
        let pathArr = [];
        path.forEach((condition) => {
          pathArr.push(condition.toString());
          console.log("condition vars: ", condition.vars);
        });
        console.log("[ " + pathArr.join(", "), "]");
      });

      console.log("=========");
      // console.log("context: ", context);
      context.print();
      console.log("=========");

      console.log("Z3 Check");
      const contextToZ3Converter = new ContextToZ3();
      contextToZ3Converter
        .checkPaths(context, context.getPaths())
        .then((notes) => {
          resolve(notes);
        })
        .catch((error) => {
          console.error("Error during analysis: ", error);
          reject(error);
        });
    });
  };

  visitNode = (context: CustomContext, node: ts.Node) => {
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
    context: CustomContext,
    node: ts.ExpressionStatement
  ) => {
    log("visiting expression statement: ", node.getText());
    node.expression.getChildren().forEach((child) => {
      this.visitNode(context, child);
    });
  };

  visitClassDeclaration = (context: CustomContext, node: ts.ClassDeclaration) => {
    log("Visiting class declaration: ", node.getText());

    node.members.forEach((member) => {
      this.visitNode(context, member);
    });
  };

  visitPropertyDeclaration = (
    context: CustomContext,
    node: ts.PropertyDeclaration
  ) => {
    log("Visiting property declaration: ", node.getText());

    if (node.initializer) {
      this.visitNode(context, node.initializer);
    }
  };

  visitSourceFile = (context: CustomContext, node: ts.SourceFile) => {
    node.statements.forEach((node: ts.Statement) => {
      this.visitNode(context, node);
    });
  };

  visitIfStatement = (context: CustomContext, node: ts.IfStatement) => {
    log("found an if statement");

    let currContext: CustomContext;
    if (context.isTopLevel()) {
      currContext = new CustomContext({ context });
      context.addTopLevelNode(currContext);
    } else {
      currContext = context;
    }

    const trueChild = new CustomContext({ context: currContext });
    currContext.setTrueChild(trueChild);
    currContext.setCondition(node.expression);

    // get start and end line numbers for if statement
    const conditionLineNumbers: LineNumbers = getLineNumbers(
      this.sourceFile,
      node
    );

    currContext.setLineNumbers(conditionLineNumbers);

    this.visitNode(currContext, node.expression);
    this.visitNode(trueChild, node.thenStatement);

    if (node.elseStatement) {
      const falseChild = new CustomContext({ context: currContext });
      currContext.setFalseChild(falseChild);
      this.visitNode(falseChild, node.elseStatement);
    }
  };

  visitConditionalExpression = (
    context: CustomContext,
    node: ts.ConditionalExpression
  ) => {
    log("Found a conditional expression: ", node.getText());
  };

  visitBinaryExpression = (context: CustomContext, node: ts.BinaryExpression) => {
    log("Found a binary expression: ", node.getText());
    this.visitNode(context, node.left);
    this.visitNode(context, node.operatorToken);
    this.visitNode(context, node.right);
  };

  visitEqualsGreaterThanToken = (
    context: CustomContext,
    node: ts.EqualsGreaterThanToken
  ) => {
    log("Found a greater than equals token: ", node.getText());
  };

  visitParameter = (context: CustomContext, node: ts.ParameterDeclaration) => {
    log("Found a parameter: ", node.name.getText(), ": ", node.type.getText());
    context.addVar(node.name.getText(), node.type.getText());
  };

  visitIdentifier = (context: CustomContext, node: ts.Identifier) => {
    log("Found an identifier: ", node.getText());
  };

  visitStringLiteral = (context: CustomContext, node: ts.StringLiteral) => {
    log("Found a string literal: ", node.getText());
  };

  visitFirstLiteralToken = (context: CustomContext, node: ts.LiteralToken) => {
    log("Found a first literal token: ", node.getText());
  };

  visitVariableDeclarationList = (
    context: CustomContext,
    node: ts.VariableDeclarationList
  ) => {
    log("Found a variable declaration list: ", node.getText());
    node.declarations.forEach((node) => {
      this.visitNode(context, node);
    });
  };

  visitVariableDeclaration = (
    context: CustomContext,
    node: ts.VariableDeclaration
  ) => {
    log("Found variable declaration: ", node.getText());
    if (node.type) {
      context.addVar(node.name.getText(), node.type?.getText());
    }

    this.visitNode(context, node.name);

    if (node.initializer) {
      this.visitNode(context, node.initializer);
    }
  };

  visitGreaterThanToken = (context: CustomContext, node: ts.Node) => {
    log("Found greater than token: ", node.getText());
  };

  visitLessThanToken = (context: CustomContext, node: ts.Node) => {
    log("Found less than token: ", node.getText());
  };

  visitNumericLiteral = (context: CustomContext, node: ts.NumericLiteral) => {
    log("Found a numeric literal: ", node.getText());
  };

  visitArrowFunction = (context: CustomContext, node: ts.ArrowFunction) => {
    log("Found an arrow function: ", node.getText());
    node.parameters.forEach((child) => {
      this.visitNode(context, child);
    });
    this.visitNode(context, node.body);
  };

  visitFirstStatement = (context: CustomContext, node: ts.Statement) => {
    log("Visiting first statement: ", node.getText());
    node.getChildren().forEach((node) => {
      this.visitNode(context, node);
    });
  };

  visitEqualsToken = (context: CustomContext, node: ts.EqualsToken) => {
    log("Visiting equals token: ", node.getText());
  };

  visitBlock = (context: CustomContext, node: ts.Block) => {
    log("Visiting block");

    node.getChildren().forEach((child) => {
      this.visitNode(context, child);
    });
  };

  visitSyntaxList = (context: CustomContext, node: ts.SyntaxList) => {
    log("visiting syntax list: ", node.getText());
    node.getChildren().forEach((child) => {
      this.visitNode(context, child);
    });
  };

  visitFunctionDeclaration = (
    context: CustomContext,
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

  visitLessThanEqualsToken = (context: CustomContext, node: ts.Node) => {
    log("Visiting less than equals token: ", node.getText());
  };

  visitPropertyAccessExpression = (
    context: CustomContext,
    node: ts.PropertyAccessExpression
  ) => {
    log("Visiting property access expression: ", node.getText());

    this.visitNode(context, node.expression);
    this.visitNode(context, node.name);
  };

  visitReturnStatement = (context: CustomContext, node: ts.Node) => {
    log("Visiting return statement: ", node.getText());
  };

  visitThisKeyword = (context: CustomContext, node: ts.Node) => {
    log("Visiting ThisKeyword: ", node.getText());
  };
}
