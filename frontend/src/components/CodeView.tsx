import { Box } from "@mui/material";
import { CodeLine } from "./CodeLine";
import { PathNote } from "../hooks/useAnalyzeProgram";

interface CodeViewProps {
  fileContents: string;
  note: PathNote;
}

export const CodeView = ({ fileContents, note }: CodeViewProps) => {
  const fileSplit = fileContents.split("\n");

  return (
    <>
      <Box
        sx={{
          textAlign: "left",
          flexDirection: "column",
          border: 1,
          borderColor: "black",
          overflow: "scroll",
          width: "100%",
          height: "100%",
          maxHeight: "500px",
        }}
      >
        {fileSplit.map((line, index) => {
          let highlighted = false;

          if (note.lineNumbers && index in note.lineNumbers) highlighted = true;

          return (
            <CodeLine
              key={index}
              code={line}
              lineNumber={index}
              highlighted={highlighted}
            />
          );
        })}
      </Box>
    </>
  );
};
