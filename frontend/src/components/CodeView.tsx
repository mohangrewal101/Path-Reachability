import { Box } from "@mui/material";
import { CodeLine } from "./CodeLine";
import { Note } from "../hooks/useAnalyzeProgram";

interface CodeViewProps {
  fileContents: string;
  notes: Note[];
  setNote: (Note) => void;
}

export const CodeView = ({ fileContents, notes, setNote }: CodeViewProps) => {
  const fileSplit = fileContents.split("\n");

  const handleLineNumberClick = (lineNumber: number) => {
    for (const item of notes) {
      if (lineNumber >= item.startLine && lineNumber <= item.endLine) {
        setNote(item);
      }
    }
  };

  return (
    <>
      <Box
        sx={{
          textAlign: "left",
          flexDirection: "column",
          border: 1,
          borderColor: "black",
          overflow: "hidden",
          width: "100%",
        }}
      >
        {fileSplit.map((line, index) => {
          let highlighted = false;
          for (const item of notes) {
            if (index >= item.startLine && index <= item.endLine)
              highlighted = true;
          }
          return (
            <CodeLine
              key={index}
              code={line}
              lineNumber={index}
              highlighted={highlighted}
              onLineNumberClick={handleLineNumberClick}
            />
          );
        })}
      </Box>
    </>
  );
};
