import { Condition } from "./Condition";
import { ProgramStatement } from "./ProgramStatement";

/**
 * Helper class to process lists of ProgramStatement classes into lists of Conditional classes.
 */
export class ProgramStatementProcessor {
  private jumpTable: {
    [key: string]: (arg0: ProgramStatement) => Condition | undefined;
  } = {};
  constructor() {
    this.jumpTable = {
      Condition: this.processCondition,
    };
  }

  processProgramStatementLists = (
    programStatementLists: ProgramStatement[][]
  ): Condition[][] => {
    const conditionLists: Condition[][] = [];
    programStatementLists.forEach((programStatementList) => {
      const conditionList =
        this.processProgramStatementList(programStatementList);
      conditionLists.push(conditionList);
    });
    return conditionLists;
  };

  processProgramStatementList = (
    programStatements: ProgramStatement[]
  ): Condition[] => {
    const variableAssignment = {};
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
    return condition;
  };

  // TODO: Complete this class by processing other types of ProgramStatements (i.e. variable declarations, variable assignments)
}
