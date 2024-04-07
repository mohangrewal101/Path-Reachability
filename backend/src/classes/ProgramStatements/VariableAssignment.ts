import { ContextAssignment } from "../Contexts/ContextAssignment";
import { ProgramStatement } from "./ProgramStatement";
import * as ts from "typescript";

interface ContextAssignmentInterface {
  variableName: string;
  assignment: ts.Expression;
}

/**
 * Condition program statement class, representing a conditional statement in a TypeScript program.
 */
export class VariableAssignment extends ProgramStatement {
  variableName: string;
  assignment: ts.Expression;

  constructor({ variableName, assignment }: ContextAssignmentInterface) {
    super();
    this.variableName = variableName;
    this.assignment = assignment;
  }
}
