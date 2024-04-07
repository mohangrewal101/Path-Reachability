import { Context } from "../Contexts/Context";
import { ContextAssignment } from "../Contexts/ContextAssignment";
import { ContextConditional } from "../Contexts/ContextConditional";
import { Condition } from "../ProgramStatements/Condition";
import { ProgramStatement } from "../ProgramStatements/ProgramStatement";
import { VariableAssignment } from "../ProgramStatements/VariableAssignment";

/**
 * Helper class used for maintaining the list of program paths while traversing the Context n-ary tree.
 */
export class ContextPathsVisitorContext {
  currentChildPaths: ProgramStatement[][] = [[]];

  getChildPaths = (): ProgramStatement[][] => {
    return this.currentChildPaths;
  };

  addToAllPaths = (context: ProgramStatement) => {
    if (this.currentChildPaths.length === 0) {
      this.currentChildPaths.push([context]);
    } else {
      this.currentChildPaths.forEach((path) => {
        path.push(context);
      });
    }
  };

  addBranch = (
    contextLeft: ContextPathsVisitorContext,
    contextRight: ContextPathsVisitorContext
  ) => {
    const resultingPaths = [];

    this.currentChildPaths.forEach((path) => {
      contextLeft.getChildPaths().forEach((left) => {
        resultingPaths.push([...path, ...left]);
      });

      contextRight.getChildPaths().forEach((right) => {
        resultingPaths.push([...path, ...right]);
      });
    });

    this.currentChildPaths = [...resultingPaths];
  };
}

/**
 * Evaluator class used for traversing the Context n-ary tree.
 */
export class ContextPathsEvaluator {
  private jumpTable: {
    [key: string]: (context: ContextPathsVisitorContext, node: Context) => void;
  };

  constructor() {
    this.jumpTable = {
      Context: this.visitContext,
      ContextConditional: this.visitContextConditional,
      ContextAssignment: this.visitContextVariableAssignment,
    };
  }

  visit = (context: ContextPathsVisitorContext, node: Context) => {
    const nodeType: string = node.constructor.name;
    const fn = this.jumpTable[nodeType];
    if (fn) {
      fn(context, node);
    } else {
      throw new Error("Unknown Node Type");
    }
  };

  visitContext = (context: ContextPathsVisitorContext, node: Context) => {
    console.log("Visiting context");
    node.getChildren().forEach((child) => {
      this.visit(context, child);
    });
  };

  visitContextConditional = (
    context: ContextPathsVisitorContext,
    node: ContextConditional
  ) => {
    console.log("Visiting Context Conditional");
    const contextLeft = new ContextPathsVisitorContext();
    const contextRight = new ContextPathsVisitorContext();

    contextLeft.addToAllPaths(new Condition({ context: node, negated: false }));
    contextRight.addToAllPaths(new Condition({ context: node, negated: true }));

    node.getTrueChildren().forEach((child) => {
      this.visit(contextLeft, child);
    });

    node.getFalseChildren().forEach((child) => {
      this.visit(contextRight, child);
    });

    context.addBranch(contextLeft, contextRight);
  };

  // TODO: Expand this class to visit additional Context children class types (i.e. Variable Declarations and Variable Assignments)
  // visit methods for these classes probably only need to call the addToAllPaths method of the ContextPathsVisitorContext
  visitContextVariableAssignment = (
    context: ContextPathsVisitorContext,
    node: ContextAssignment
  ) => {
    console.log("Visiting Context Variable Assignment");
    context.addToAllPaths(
      new VariableAssignment({
        variableName: node.getVarName(),
        assignment: node.getExpression(),
      })
    );
    node.getChildren().forEach((child) => {
      this.visit(context, child);
    });
  };
}
