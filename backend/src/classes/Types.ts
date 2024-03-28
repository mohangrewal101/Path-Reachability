export interface Note {
  comment: string;
  startLine: number;
  endLine: number;
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
}
