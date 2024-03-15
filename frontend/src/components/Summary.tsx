import { Box } from "@mui/material";
import { Note } from "../hooks/useAnalyzeProgram";

interface SummaryProps {
  note: Note | undefined;
}

export const Summary = ({ note }: SummaryProps) => {
  return (
    <Box sx={{ border: 1, borderColor: "black", width: "100%" }}>
      {!note && "Click a highlighted line to get started"}
      {note && <p>Line Number: {note.startLine}</p>}
      {note && <p>{note.comment}</p>}
    </Box>
  );
};
