// import { Condition } from "../ProgramStatements/Condition";

// const reassignVariables = (paths: Condition[][]) => {
//   for (let path of paths) {
//     path.forEach((condition: Condition) => {
//       console.log("Vars for :", condition.condition.getText(), condition.);
//     });
//   }
// };

// export default reassignVariables

// import { Condition } from "./Condition";
// import { ProgramStatement } from "./ProgramStatement";
// import { VariableAssignment } from "./VariableAssignment";
// import { VariableDeclaration } from "./VariableDeclaration";

// /**
//  * Helper class to process lists of ProgramStatement classes into lists of Conditional classes.
//  */
// export class ProgramStatementProcessor {
//   private jumpTable: {
//     [key: string]: (arg0: ProgramStatement) => Condition | VariableAssignment | VariableDeclaration | undefined;
//   } = {};

//   constructor() {
//     this.jumpTable = {
//       Condition: this.processCondition,
//       VariableAssignment: this.processVariableAssignment,
//       VariableDeclaration: this.processVariableDeclaration,
//     };
//   }

//   processProgramStatementLists = (programStatementLists: ProgramStatement[][]): (Condition | VariableAssignment | VariableDeclaration)[][] => {
//     const processedLists: (Condition | VariableAssignment | VariableDeclaration)[][] = [];

//     programStatementLists.forEach((programStatementList) => {
//       const processedList = this.processProgramStatementList(programStatementList);
//       processedLists.push(processedList);
//     });

//     return processedLists;
//   };

//   processProgramStatementList = (programStatements: ProgramStatement[]): (Condition | VariableAssignment | VariableDeclaration)[] => {
//     const processedStatements: (Condition | VariableAssignment | VariableDeclaration)[] = [];

//     programStatements.forEach((statement) => {
//       const fn = this.jumpTable[statement.constructor.name];
//       const res = fn(statement);
//       if (res !== undefined) {
//         processedStatements.push(res);
//       }
//     });

//     return processedStatements;
//   };

//   processCondition = (condition: Condition): Condition => {
//     return condition;
//   };

//   processVariableAssignment = (variableAssignment: VariableAssignment): VariableAssignment => {
//     return variableAssignment;
//   };

//   processVariableDeclaration = (variableDeclaration: VariableDeclaration): VariableDeclaration => {
//     return variableDeclaration;
//   };
// }

// import { Context } from "../Contexts/Context";
// import { ContextConditional } from "../Contexts/ContextConditional";
// import { ContextVariableAssignment } from "../Contexts/ContextVariableAssignment";
// import { ContextVariableDeclaration } from "../Contexts/ContextVariableDeclaration";
// import { Condition } from "../ProgramStatements/Condition";
// import { ProgramStatement } from "../ProgramStatements/ProgramStatement";
// import { VariableAssignment } from "../ProgramStatements/VariableAssignment";
// import { VariableDeclaration } from "../ProgramStatements/VariableDeclaration";

// /**
//  * Helper class used for maintaining the list of program paths while traversing the Context n-ary tree.
//  */
// export class ContextPathsVisitorContext {
//   currentChildPaths: ProgramStatement[][] = [[]];

//   getChildPaths = (): ProgramStatement[][] => {
//     return this.currentChildPaths;
//   };

//   addToAllPaths = (context: ProgramStatement) => {
//     if (this.currentChildPaths.length === 0) {
//       this.currentChildPaths.push([context]);
//     } else {
//       this.currentChildPaths.forEach((path) => {
//         path.push(context);
//       });
//     }
//   };

//   addBranch = (contextLeft: ContextPathsVisitorContext, contextRight: ContextPathsVisitorContext) => {
//     const resultingPaths = [];

//     this.currentChildPaths.forEach((path) => {
//       contextLeft.getChildPaths().forEach((left) => {
//         resultingPaths.push([...path, ...left]);
//       });

//       contextRight.getChildPaths().forEach((right) => {
//         resultingPaths.push([...path, ...right]);
//       });
//     });

//     this.currentChildPaths = [...resultingPaths];
//   };
// }

// /**
//  * Evaluator class used for traversing the Context n-ary tree.
//  */
// export class ContextPathsEvaluator {
//   private jumpTable: {
//     [key: string]: (context: ContextPathsVisitorContext, node: Context) => void;
//   };

//   constructor() {
//     this.jumpTable = {
//       Context: this.visitContext,
//       ContextConditional: this.visitContextConditional,
//       ContextVariableAssignment: this.visitContextVariableAssignment,
//       ContextVariableDeclaration: this.visitContextVariableDeclaration,
//     };
//   }

//   visit = (context: ContextPathsVisitorContext, node: Context) => {
//     const nodeType: string = node.constructor.name;
//     const fn = this.jumpTable[nodeType];
//     if (fn) {
//       fn(context, node);
//     } else {
//       throw new Error("Unknown Node Type");
//     }
//   };

//   visitContext = (context: ContextPathsVisitorContext, node: Context) => {
//     console.log("Visiting context");
//     node.getChildren().forEach((child) => {
//       this.visit(context, child);
//     });
//   };

//   visitContextConditional = (context: ContextPathsVisitorContext, node: ContextConditional) => {
//     console.log("Visiting Context Conditional");
//     const contextLeft = new ContextPathsVisitorContext();
//     const contextRight = new ContextPathsVisitorContext();

//     contextLeft.addToAllPaths(new Condition({ context: node, negated: false }));
//     contextRight.addToAllPaths(new Condition({ context: node, negated: true }));

//     node.getTrueChildren().forEach((child) => {
//       this.visit(contextLeft, child);
//     });

//     node.getFalseChildren().forEach((child) => {
//       this.visit(contextRight, child);
//     });

//     context.addBranch(contextLeft, contextRight);
//   };

//   visitContextVariableAssignment = (context: ContextPathsVisitorContext, node: ContextVariableAssignment) => {
//     console.log("Visiting Context Variable Assignment");
//     context.addToAllPaths(new VariableAssignment(node));
//     node.getChildren().forEach((child) => {
//       this.visit(context, child);
//     });
//   };

//   visitContextVariableDeclaration = (context: ContextPathsVisitorContext, node: ContextVariableDeclaration) => {
//     console.log("Visiting Context Variable Declaration");
//     context.addToAllPaths(new VariableDeclaration(node));
//     node.getChildren().forEach((child) => {
//       this.visit(context, child);
//     });
//   };
// }