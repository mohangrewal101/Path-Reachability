import * as ts from "typescript";
import { Context } from "./Context";
import { LineNumbers } from "./Types";

interface ConditionConstructorInterface {
  context: Context;
  negated: boolean;
}

export class Condition {
  vars: { [key: string]: string } = {};
  condition: ts.Expression;
  negated: boolean;
  lineNumbers: LineNumbers;

  constructor({ context, negated }: ConditionConstructorInterface) {
    this.vars = { ...context.getVars() };
    this.condition = context.getCondition();
    this.negated = negated;
    this.lineNumbers = context.getLineNumbers();
  }

  toString = (): string => {
    if (this.negated) {
      return "!(" + this.condition.getText() + ")";
    } else {
      return this.condition.getText();
    }
  };
}
