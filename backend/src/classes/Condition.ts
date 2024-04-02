import * as ts from "typescript";
import { CustomContext } from "./CustomContext";
import { LineNumbers } from "./Types";

interface ConditionConstructorInterface {
  context: CustomContext;
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
