import { Context } from "./Context";
import * as ts from "typescript";

interface ConditionConstructorInterface {
  context: Context;
  negated: boolean;
}

export class Condition {
  vars: { [key: string]: string } = {};
  condition: ts.Expression;
  negated: boolean;

  constructor({ context, negated }: ConditionConstructorInterface) {
    this.vars = { ...context.getVars() };
    this.condition = context.getCondition();
    this.negated = negated;
  }

  toString = (): string => {
    if (this.negated) {
      return "!(" + this.condition.getText() + ")";
    } else {
      return this.condition.getText();
    }
  };
}
