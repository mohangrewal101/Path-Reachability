import ts from "typescript";
import { ContextConditional } from "../Contexts/ContextConditional";
import { Condition } from "./Condition";
import { ProgramStatement } from "./ProgramStatement";
import { VariableAssignment } from "./VariableAssignment";
import { ContextToZ3 } from "../ContextToZ3";
import { transformExpression } from "../utils/transformExpression";

/**
 * Helper class to process lists of ProgramStatement classes into lists of Conditional classes.
 */
export class ProgramStatementProcessor {
  private jumpTable: {
    [key: string]: (arg0: ProgramStatement) => Condition | undefined;
  } = {};
  private vars: Map<string, ts.Node>;
  private reassignmentHelper: ReassignmentHelper;

  constructor() {
    this.jumpTable = {
      Condition: this.processCondition,
      VariableAssignment: this.processVariableAssignment,
    };
    this.vars = new Map();
    this.reassignmentHelper = new ReassignmentHelper();
  }

  resetVars = () => {
    this.vars = new Map();
  };

  processProgramStatementLists = (
    programStatementLists: ProgramStatement[][]
  ): Condition[][] => {
    const conditionLists: Condition[][] = [];
    programStatementLists.forEach((programStatementList, idx) => {
      console.log("\nStatement: ", idx);
      const conditionList =
        this.processProgramStatementList(programStatementList);
      conditionLists.push(conditionList);
    });
    return conditionLists;
  };

  processProgramStatementList = (
    programStatements: ProgramStatement[]
  ): Condition[] => {
    console.log("Processing Program Statements: ");
    this.resetVars();
    const conditions: Condition[] = [];
    programStatements.forEach((statement) => {
      const fn = this.jumpTable[statement.constructor.name];
      const res = fn(statement);
      if (res !== undefined) {
        conditions.push(res);
      }
    });

    return conditions;
  };

  processCondition = (condition: Condition): Condition => {
    console.log("processing condition: ", condition.condition.getText());
    const updatedCondition = transformExpression(
      condition.condition,
      this.vars
    );
    console.log("updated condition: ", updatedCondition.getText());

    const newContitionContext = new ContextConditional({} as any);
    let newCondition = new Condition({
      context: newContitionContext,
      negated: condition.negated,
    });
    newCondition.vars = condition.vars;
    newCondition.lineNumbers = condition.lineNumbers;
    newCondition.negated = condition.negated;
    newCondition.condition = updatedCondition;

    return newCondition;
  };

  processVariableAssignment = (variableAssignment: VariableAssignment) => {
    console.log(
      "processing assignment: ",
      variableAssignment.variableName,
      ":",
      variableAssignment.assignment.getText()
    );
    const updatedExpression = transformExpression(
      variableAssignment.assignment,
      this.vars
    );

    this.vars.set(variableAssignment.variableName, updatedExpression);

    console.log("current variable assignments: ");
    for (let [k, v] of this.vars) {
      console.log(k, ":", v.getText());
    }
    return undefined;
  };
}

export class ReassignmentHelper {
  reassignVars(
    condition: Condition,
    vars: { [key: string]: string }
  ): Condition {
    const contextToZ3 = new ContextToZ3({ lastLineNumber: 0 });
    const params = contextToZ3.extractContent(condition.condition.getText());
    let newParams = [];
    params.forEach((param) => {
      let tempParamName = param;
      while (vars[tempParamName]) {
        tempParamName = vars[tempParamName];
      }
      newParams.push(tempParamName);
    });
    const expressionString = newParams.join(" == ");
    const newContitionContext = new ContextConditional({} as any);
    let newCondition = new Condition({
      context: newContitionContext,
      negated: condition.negated,
    });
    newCondition.vars = condition.vars;
    newCondition.lineNumbers = condition.lineNumbers;
    newCondition.negated = condition.negated;

    const newExpression = this.generateNewExpression(expressionString);
    newCondition.condition = newExpression;

    return newCondition;
  }

  generateNewExpression(expressionString: string): ts.Expression {
    const sourceFile = ts.createSourceFile(
      "tempFile.ts",
      expressionString,
      ts.ScriptTarget.Latest,
      true
    );

    // Find the first expression statement in the source file
    const expressionStatement = sourceFile
      .statements[0] as ts.ExpressionStatement;
    return expressionStatement.expression as ts.Expression;
  }
}
