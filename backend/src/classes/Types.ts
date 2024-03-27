export interface Notes {
  pathNotes: PathNote[];
  s;
}

export interface PathNote {
  error?: boolean;
  isSatisfiable?: boolean;
  satisfyingAssignment?: { [key: string]: number | boolean };
  lineNumbers?: number[];
}
