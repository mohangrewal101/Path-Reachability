import * as ts from "typescript";
import { LineNumbers } from "../Types";
import { ContextConditional } from "../Contexts/ContextConditional";
import { ProgramStatement } from "./ProgramStatement";

interface ConditionConstructorInterface {
  context: ContextConditional;
  negated: boolean;
}

/**
 * Condition program statement class, representing a conditional statement in a TypeScript program.
 */
export class Condition extends ProgramStatement {
  vars: { [key: string]: string } = {};
  condition: ts.Expression;
  negated: boolean;
  lineNumbers: LineNumbers;

  constructor({ context, negated }: ConditionConstructorInterface) {
    super();
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
