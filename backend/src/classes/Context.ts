import * as ts from "typescript";
import { Condition } from "./Condition";
import { Note } from "./Types";

interface ContextConstructorInterface {
  context?: Context;
  topLevel?: boolean;
}

export class Context {
  private topLevel = false;
  private vars: { [key: string]: string } = {};
  private trueBlock: number[] = [];
  private falseBlock: number[] = [];
  private trueChild: Context;
  private falseChild: Context;
  private condition: ts.Expression;
  private notes: Note[];
  private contextNodes: Context[] = [];
  private startLine: number;
  private endLine: number;

  constructor({ context, topLevel }: ContextConstructorInterface) {
    if (context) {
      this.vars = { ...context.getVars() };
    }
    if (topLevel) {
      this.topLevel = true;
    }
  }

  getNotes = () => {
    return this.notes;
  };

  addVar = (name: string, type: string) => {
    this.vars[name] = type;
  };

  getVars = () => {
    return this.vars;
  };

  setTrueChild = (context: Context) => {
    this.trueChild = context;
  };

  setFalseChild = (context: Context) => {
    this.falseChild = context;
  };

  getTrueChild = (): Context => {
    return this.trueChild;
  };

  getFalseChild = (): Context => {
    return this.falseChild;
  };

  isTopLevel = () => {
    return this.topLevel;
  };

  print = () => {
    console.log("Start Line: ", this.startLine);

    if (this.topLevel) {
      console.log("top level node - subnode count: ", this.contextNodes.length);
      this.contextNodes.forEach((node) => {
        node.print();
      });
      return;
    }

    if (this.condition) {
      console.log("Condition: ", this.condition.getText());
    }

    console.log("Vars: ", this.getVars());
    console.log("Notes: ", this.getNotes());
    console.log("Path: ", this.getPaths());

    if (this.trueChild) {
      this.trueChild.print();
    }

    if (this.falseChild) {
      this.falseChild.print();
    }
  };

  addTopLevelNode = (context: Context) => {
    this.contextNodes.push(context);
  };

  setCondition = (condition: ts.Expression) => {
    this.condition = condition;
  };

  setStartLine = (line: number) => {
    this.startLine = line;
  };

  setEndLine = (line: number) => {
    this.endLine = line;
  };

  getCondition = () => {
    return this.condition;
  };

  // Get all the possible paths through the program
  getPaths = (): Condition[][] => {
    let paths: Condition[][] = [];
    if (this.topLevel) {
      let pathParts: Condition[][][] = [];
      this.contextNodes.forEach((node) => {
        pathParts.push(node.getPaths());
      });
      return this.getCombinations(pathParts);
    }

    if (this.condition) {
      const truePaths = this.trueChild.getPaths();
      if (truePaths) {
        truePaths.forEach((path) => {
          paths.push([
            new Condition({ context: this, negated: false }),
            ...path,
          ]);
        });
      } else {
        paths.push([new Condition({ context: this, negated: false })]);
      }

      const falsePaths = this.falseChild?.getPaths();
      if (falsePaths) {
        falsePaths?.forEach((path) => {
          paths.push([
            new Condition({ context: this, negated: true }),
            ...path,
          ]);
        });
      } else {
        paths.push([new Condition({ context: this, negated: true })]);
      }

      return paths;
    }
  };

  // Given a list of string lists, get the different combinations
  // of each of the lists
  getCombinations = (pathParts: Condition[][][]): Condition[][] => {
    if (pathParts.length === 1) {
      return pathParts[0];
    }

    const paths: Condition[][] = [];
    if (pathParts.length == 2) {
      pathParts[0].forEach((parentPath) => {
        pathParts[1].forEach((childPath) => {
          const pathItem = [...parentPath, ...childPath];
          paths.push(pathItem);
        });
      });
      return paths;
    }

    const otherParts = this.getCombinations(pathParts.slice(1));
    pathParts[0].forEach((parentPath) => {
      otherParts.forEach((childPath) => {
        paths.push([...parentPath, ...childPath]);
      });
    });

    return paths;
  };
}
