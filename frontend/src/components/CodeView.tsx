import { Box, Stack, Tooltip, Typography } from "@mui/material";
import { CodeLine } from "./CodeLine";
import { PathNote } from "../hooks/useAnalyzeProgram";
import InfoIcon from "@mui/icons-material/Info";

interface CodeViewProps {
  fileContents: string;
  note: PathNote;
}

const tooltipText = `This panel displays the uploaded code. When a path is selected, the lines that are executed as part of that path are highlighted in red.`;

export const CodeView = ({ fileContents, note }: CodeViewProps) => {
  const fileSplit = fileContents.split("\n");

  return (
    <>
      <Box
        sx={{
          flexDirection: "column",
          border: 1,
          borderColor: "black",
          width: "100%",
          height: "100%",
          maxHeight: "500px",
        }}
      >
        <Stack
          flexDirection={"row"}
          sx={{ textAlign: "center" }}
          alignItems="center"
          justifyContent="center"
        >
          <Typography variant="h6">Code View</Typography>
          <Tooltip placement="top" title={tooltipText} sx={{ marginLeft: 1 }}>
            <InfoIcon />
          </Tooltip>
        </Stack>
        <Box
          sx={{
            textAlign: "left",
            overflow: "auto",
            maxHeight: "467px",
          }}
        >
          {fileSplit.map((line, index) => {
            let highlighted = false;

            if (note.lineNumbers && note.lineNumbers.includes(index))
              highlighted = true;

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
      </Box>
    </>
  );
};
