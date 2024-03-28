export interface Notes {
  pathNotes: PathNote[];
}

export interface PathNote {
  error?: boolean;
  isSatisfiable?: boolean;
  satisfyingAssignment?: { [key: string]: number | boolean };
  lineNumbers?: number[];
}

export interface LineNumbers {
  thenStartLine: number;
  thenEndLine: number;
  elseStartLine: number | undefined;
  elseEndLine: number | undefined;
}

export interface CondLines {
  conditionString: string;
  startLine: number;
  endLine: number;
  startLineRemoval: number;
  endLineRemoval: number;
}
