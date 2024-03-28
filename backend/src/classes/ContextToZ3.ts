import { CheckSatResult, init } from "z3-solver";
import { Condition } from "./Condition";
import { CondLines } from "./Types";
import { PathNote } from "./Types";
import { removeAllListeners } from "process";

export class ContextToZ3 {
  async checkPaths(paths: Condition[][]): Promise<PathNote[]> {
    const { Context } = await init();
    const { Solver, Bool, Not, And, Int, LT, GE, GT, LE, Eq } = Context("main");
    const notes: PathNote[] = [];
    for (let path of paths) {
      const pathNote: PathNote = {};
      let pathConditions = [];
      let pathParams: { [id: string]: any } = {};
      let satisfyingAssignment: { [id: string]: any } = {};
      let condArray: CondLines[] = [];

      path.forEach((condition) => {
        let conditionString = condition.toString();
        let extractedContent = this.extractContent(conditionString);
        let startLine: number;
        let endLine: number;
        let startLineRemoval: number;
        let endLineRemoval: number;
        if (conditionString.includes("!")) {
          startLine = condition.lineNumbers.elseStartLine;
          endLine = condition.lineNumbers.elseEndLine;
          startLineRemoval = condition.lineNumbers.thenStartLine;
          endLineRemoval = condition.lineNumbers.thenEndLine;
        } else {
          startLine = condition.lineNumbers.thenStartLine;
          endLine = condition.lineNumbers.thenEndLine;
          startLineRemoval = condition.lineNumbers.elseStartLine;
          endLineRemoval = condition.lineNumbers.elseEndLine;
        }
        condArray.push({
          conditionString,
          startLine,
          endLine,
          startLineRemoval,
          endLineRemoval,
        });
        for (let paramKey of extractedContent) {
          let conditionVariableType = condition.vars[paramKey];
          switch (conditionVariableType) {
            case "number": {
              if (!(paramKey in pathParams)) {
                pathParams[paramKey] = Int.const(paramKey);
              }
              break;
            }
            case "boolean": {
              if (!(paramKey in pathParams)) {
                pathParams[paramKey] = Bool.const(paramKey);
              }

              satisfyingAssignment[paramKey] = !conditionString.includes("!");
              break;
            }
          }
        }
        let conditionStringSplit = conditionString.match(
          /\s*([a-zA-Z0-9_]+|==|!=|<=|>=|[\!\>\<\=\&\|])\s*/g
        );

        let left: any, right: any;
        let conditionValue = null;
        let conditionOperator = "";
        //TODO: Make it so more complex conditions can be used ie (b == a) &&/|| (c > d)
        if (conditionStringSplit.length >= 3) {
          if (conditionStringSplit[0].trim() == "!") {
            left = pathParams[conditionStringSplit[1].trim()];
            conditionOperator = conditionStringSplit[2].trim();
            right = pathParams[conditionStringSplit[3].trim()];
          } else {
            left = pathParams[conditionStringSplit[0].trim()];
            conditionOperator = conditionStringSplit[1].trim();
            right = pathParams[conditionStringSplit[2].trim()];
          }
        } else if (conditionStringSplit.length == 2) {
          // This must be a negated bool
          conditionValue = pathParams[conditionStringSplit[1].trim()];
        } else if (conditionStringSplit.length == 1) {
          // This must be a bool
          conditionValue = pathParams[conditionStringSplit[0].trim()];
        }

        //Checks the length of the condition to see if it has multiple values
        if (conditionStringSplit.length >= 3) {
          switch (conditionOperator) {
            case ">":
              conditionValue = GT(left, right);
              break;
            case ">=":
              conditionValue = GE(left, right);
              break;
            case "<":
              conditionValue = LT(left, right);
              break;
            case "<=":
              conditionValue = LE(left, right);
              break;
            case "==":
              conditionValue = Eq(left, right);
              break;
            case "!=":
              conditionValue = Not(Eq(left, right));
              break;
            default:
              console.error(
                `Unsupported operator: ${conditionStringSplit[1].trim()}`
              );
              break;
          }
        }

        //Check if condition starts with a NOT value
        if (conditionStringSplit[0].trim() == "!") {
          conditionValue = Not(conditionValue);
        }

        pathConditions.push(conditionValue);
      });

      const solver = new Solver();
      let combinedPath = And(...pathConditions);

      console.log("Path: [ " + pathConditions.join(", "), "]");
      const condLineNumbers: number[][] = [];
      condArray.forEach((cond) => {
        console.log(
          "Condition: " +
            cond.conditionString +
            " Start: " +
            cond.startLine +
            " End: " +
            cond.endLine
        );
        condLineNumbers.push([
          cond.startLine,
          cond.endLine,
          cond.startLineRemoval,
          cond.endLineRemoval,
        ]);
      });

      solver.add(combinedPath);

      const result: CheckSatResult = await solver.check();

      if (result === "sat") {
        console.log("Z3: Path is Satisfiable");
        const satisfyingAssignmentOutput = Object.entries(satisfyingAssignment)
          .map(([key, value]) => `${key}: ${value}`)
          .join(", ");
        console.log(
          "Z3 Satisfying Assignment: [ " + satisfyingAssignmentOutput + " ]"
        );
        pathNote.isSatisfiable = true;
        pathNote.satisfyingAssignment = { ...satisfyingAssignment };
        pathNote.lineNumbers = this.getAllLineNumbers(condLineNumbers);
      } else if (result === "unsat") {
        console.log("Z3: Path is Unsatisfiable");
        pathNote.isSatisfiable = false;
        pathNote.lineNumbers = this.getAllLineNumbers(condLineNumbers);
      } else {
        console.log("Z3: Unknown"); // The solver couldn't determine satisfiability
        pathNote.error = true;
      }
      notes.push(pathNote);
    }
    return notes;
  }

  // Used ChatGPT to get a method to extract content from brackets.
  extractContent(input: string): string[] {
    const matches = input.match(
      /\((.*?)\)|!(\w+)|(\w+\s*(?:>\s*|==\s*|!=\s*|<\s*)\w+)|(\w+)/
    );
    if (matches) {
      if (matches[1]) {
        return matches[1]
          .split(/\s*>\s*|\s*==\s*|\s*!=\s*|\s*<\s*/)
          .filter(Boolean);
      } else if (matches[2]) {
        return ["!" + matches[2]];
      } else if (matches[3]) {
        return matches[3]
          .split(/\s*>\s*|\s*==\s*|\s*!=\s*|\s*<\s*/)
          .filter(Boolean);
      } else if (matches[4]) {
        return [matches[4]];
      }
    }
    return [];
  }

  getAllLineNumbers = (condLineNumbers: number[][]): number[] => {
    const avoidLineNumbers: number[] = [];
    const allLineNumbers: number[] = [];

    condLineNumbers.forEach((set: number[]) => {
      for (let i: number = set[2]; i <= set[3]; i++) {
        avoidLineNumbers.push(i);
      }
    });

    condLineNumbers.forEach((set: number[]) => {
      for (let i: number = set[0]; i <= set[1]; i++) {
        if (!avoidLineNumbers.includes(i)) {
          allLineNumbers.push(i);
        }
      }
    });

    return allLineNumbers;
  };
}
