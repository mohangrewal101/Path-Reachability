import { CheckSatResult, init } from "z3-solver";
import { ConditionEvaluator } from "./ConditionEvaluator";
import { Context } from "./Contexts/Context";
import { Condition } from "./ProgramStatements/Condition";
import { CondLines, PathNote } from "./Types";

export class ContextToZ3 {
  lastLineNumber: number;

  constructor({ lastLineNumber }) {
    if (lastLineNumber) {
      this.lastLineNumber = lastLineNumber;
    }
  }

  async checkPaths(
    context: Context,
    paths: Condition[][]
  ): Promise<PathNote[]> {
    const { Context } = await init();
    let z3Context = Context("main");
    const notes: PathNote[] = [];
    let conditionEvaluator = new ConditionEvaluator(z3Context);
    for (let path of paths) {
      const pathNote: PathNote = {};
      let pathConditions = [];
      let pathParams: { [id: string]: any } = {};
      let condArray: CondLines[] = [];

      for (const condition of path) {
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
          if (conditionVariableType == "number") {
            if (!(paramKey in pathParams)) {
              pathParams[paramKey] = z3Context.Int.const(paramKey);
            }
          } else if (conditionVariableType == "boolean") {
            if (!(paramKey in pathParams)) {
              pathParams[paramKey] = z3Context.Bool.const(paramKey);
            }
          } else if (paramKey == "true") {
            pathParams[paramKey] = true;
          } else if (paramKey == "false") {
            pathParams[paramKey] = false;
          } else if (Number.isInteger(parseInt(paramKey))) {
            pathParams[paramKey] = parseInt(paramKey);
          } else {
            pathParams[paramKey] = paramKey;
          }
        }

        conditionEvaluator.setPathParams(pathParams);

        let conditionValue = conditionEvaluator.visitCondition(
          context,
          condition.condition
        );
        if (condition.negated) {
          pathConditions.push(z3Context.Not(conditionValue));
        } else {
          pathConditions.push(conditionValue);
        }
      }

      const solver = new z3Context.Solver();
      let combinedPath = z3Context.And(...pathConditions);

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
        const satisfyingAssignmentOutput = Object.entries(pathParams)
          .filter(([key, val]) => {
            return !(typeof val === "boolean" || typeof val === "number");
          })
          .map(([key, value]) => `${key}: ${solver.model().eval(value)}`)
          .join(", ");
        console.log(
          "Z3 Satisfying Assignment: [ " + satisfyingAssignmentOutput + " ]"
        );
        pathNote.isSatisfiable = true;
        pathNote.satisfyingAssignment = {};
        for (const [key, value] of Object.entries(pathParams)) {
          if (!(typeof value === "boolean" || typeof value === "number")) {
            pathNote.satisfyingAssignment[key] = solver
              .model()
              .eval(value)
              .toString();
          }
        }
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
    const matches = input.match(/(\w+)/g);
    return matches ? matches : [];
  }

  getAllLineNumbers = (condLineNumbers: number[][]): number[] => {
    const avoidLineNumbers: number[] = [];
    const allLineNumbers: number[] = [];

    condLineNumbers.forEach((set: number[]) => {
      for (let i: number = set[2]; i <= set[3]; i++) {
        avoidLineNumbers.push(i);
      }
    });

    for (let i: number = 0; i < this.lastLineNumber; i++) {
      if (!avoidLineNumbers.includes(i)) {
        allLineNumbers.push(i);
      }
    }

    // condLineNumbers.forEach((set: number[]) => {
    //   for (let i: number = set[0]; i <= set[1]; i++) {
    //     if (!avoidLineNumbers.includes(i)) {
    //       allLineNumbers.push(i);
    //     }
    //   }
    // });

    return allLineNumbers;
  };
}
