import { Project } from "ts-morph";

export class TypescriptValidator {
  checkProgramIsValidTypescript = (source: string): string[] => {
    const project = new Project({
      compilerOptions: {
        noImplicitAny: true,
      },
    });
    project.createSourceFile("temp.ts", source);

    let result = [];

    try {
      const diagnostics = project.getPreEmitDiagnostics();
      result = diagnostics.map((diagnostic) => {
        return `Line ${diagnostic.getLineNumber()}: ${diagnostic.getMessageText()}`;
      });
    } catch (err) {
      console.log("something went wrong getting diagnostics");
    }

    return result;
  };
}
