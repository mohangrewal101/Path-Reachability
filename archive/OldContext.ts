// import { Note } from "./Types";

// export class Context {
//   private variables: { [key: string]: boolean } = {};
//   private notes: Note[] = [];
//   private returnFound: boolean = false;
//   constructor(context?: Context) {
//     if (context) {
//       this.variables = { ...context.variables };
//       this.returnFound = context.returnFound;
//     }
//   }

//   hasVariable = (varName: string): boolean => {
//     return Object.prototype.hasOwnProperty.call(this.variables, varName);
//   };

//   variableInitialized = (varName: string): boolean => {
//     return this.variables[varName];
//   };

//   hasReturnFound = (): boolean => {
//     return this.returnFound;
//   };

//   setReturnFound = (returnFound: boolean) => {
//     this.returnFound = returnFound;
//   };

//   addNote = (note: Note) => {
//     this.notes.push(note);
//   };

//   addNotesList = (notes: Note[]) => {
//     this.notes.push(...notes);
//   };

//   getNotes = (): Note[] => {
//     return this.notes;
//   };
// }
