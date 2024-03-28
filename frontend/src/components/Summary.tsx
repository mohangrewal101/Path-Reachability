import { Box } from "@mui/material";
import { PathNote } from "../hooks/useAnalyzeProgram";

interface SummaryProps {
  note: PathNote | undefined;
}

export const Summary = ({ note }: SummaryProps) => {
  console.log(note);
  return (
    <Box
      sx={{ border: 1, borderColor: "black", width: "100%", height: "100%" }}
    >
      {note?.error && <p>Could not run Z3 on this path</p>}
      {note?.isSatisfiable !== undefined && (
        <>
          <p>Is Satisfiable: {note.isSatisfiable.toString()}</p>
          {note?.isSatisfiable && (
            <>
              <p>Satisfying Assignment:</p>
              <p>{JSON.stringify(note.satisfyingAssignment)}</p>
            </>
          )}
        </>
      )}
    </Box>
  );
};
