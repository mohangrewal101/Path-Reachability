export interface Notes {
  pathNotes: PathNote[];
}

export interface PathNote {
  error?: boolean;
  isSatisfiable?: boolean;
  satisfyingAssignment?: { [key: string]: number | boolean };
  lineNumbers?: number[];
}
