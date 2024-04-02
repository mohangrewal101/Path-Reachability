import * as ts from "typescript";
import { Context } from "./Context";

interface ContextConditionalInterface {
  context: Context;
}

/**
 * Context child class used for capturing data relevant to conditional
 * statements when traversing the TypeScript AST.
 */
export class ContextConditional extends Context {
  private trueChildren: Context[] = [];
  private falseChildren: Context[] = [];
  private condition: ts.Expression;
  private visitingTrue: boolean = true;

  constructor({ context }: ContextConditionalInterface) {
    super({ context });
  }

  addChild = (context: Context) => {
    if (this.visitingTrue) {
      this.trueChildren.push(context);
    } else {
      this.falseChildren.push(context);
    }
  };

  getTrueChildren = (): Context[] => {
    return this.trueChildren;
  };

  getFalseChildren = (): Context[] => {
    return this.falseChildren;
  };

  setCondition = (condition: ts.Expression) => {
    this.condition = condition;
  };

  getCondition = () => {
    return this.condition;
  };

  setVisitingTrue = () => {
    this.visitingTrue = true;
  };

  setVisitingFalse = () => {
    this.visitingTrue = false;
  };
}
