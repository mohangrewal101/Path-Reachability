import * as ts from "typescript";
import { Condition } from "../ProgramStatements/Condition";
import { LineNumbers } from "../Types";

interface ContextConstructorInterface {
  context?: Context;
}

/**
 * Context class for traversing the TypeScript AST.
 * This class should only be used as the top level context.
 */
export class Context {
  private vars: { [key: string]: string } = {};
  private children: Context[] = [];
  private conditionLineNumbers: LineNumbers;

  constructor({ context }: ContextConstructorInterface) {
    if (context) {
      this.vars = { ...context.getVars() };
    }
  }

  addVar = (name: string, type: string) => {
    this.vars[name] = type;
  };

  getVars = () => {
    return this.vars;
  };

  addChild = (context: Context) => {
    this.children.push(context);
  };

  getChildren = () => {
    return this.children;
  };

  setLineNumbers = (lineNumbers: LineNumbers) => {
    this.conditionLineNumbers = lineNumbers;
  };

  getLineNumbers = (): LineNumbers => {
    return this.conditionLineNumbers;
  };
}
