import { Context } from "./Context";
import * as ts from "typescript";

interface ContextAssignmentInterFace {
  context: Context;
}

/**
 * Context child class used for capturing data relevant to conditional
 * statements when traversing the TypeScript AST.
 */
export class ContextAssignment extends Context {
  private expression: ts.Expression;
  private varName: string;

  constructor({ context }: ContextAssignmentInterFace) {
    super({ context });
  }

  setExpression = (expression: ts.Expression) => {
    this.expression = expression;
  };

  getExpression = (): ts.Expression => {
    return this.expression;
  };

  setVarName = (varName: string) => {
    this.varName = varName;
  };

  getVarName = (): string => {
    return this.varName;
  };
}
