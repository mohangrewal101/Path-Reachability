import {
  Box,
  Checkbox,
  FormControlLabel,
  Tooltip,
  Typography,
} from "@mui/material";
import { PathNote } from "../hooks/useAnalyzeProgram";
import { useState } from "react";
import InfoIcon from "@mui/icons-material/Info";

interface PathSelectorItemProps {
  idx: number;
  note: PathNote;
  onClick: (note: PathNote) => void;
}

const tooltipText = (
  <>
    <p>This panel lists all available paths through the given program.</p>
    <p>
      Click one of the options to highlight the lines executed and the function
      arguments required to execute the path.
    </p>
    <p>
      Unclick the Show Unsat checkbox to remove impossible paths from the list.
    </p>
    <p></p>
  </>
);

const PathSelectorItem = ({ idx, note, onClick }: PathSelectorItemProps) => {
  const [mouseOver, setMouseOver] = useState<boolean>(false);
  return (
    <div
      onMouseEnter={() => setMouseOver(true)}
      onMouseLeave={() => setMouseOver(false)}
      onClick={() => onClick(note)}
      style={{
        width: "100%",
        backgroundColor: mouseOver ? "blue" : undefined,
        cursor: "pointer",
      }}
    >
      <p style={{ color: note.isSatisfiable === true ? "green" : "red" }}>
        {idx}
      </p>
    </div>
  );
};

interface PathSelectorProps {
  notes: PathNote[];
  onSelect: (note: PathNote) => void;
}

export const PathSelector = ({ notes, onSelect }: PathSelectorProps) => {
  const [showUnsat, setShowUnsat] = useState(true);
  const handlePathClick = (note: PathNote) => {
    console.log("clicking: ", note);
    onSelect(note);
  };
  return (
    <Box
      sx={{
        border: "solid",
        borderColor: "black",
        borderWidth: "1px",
        maxHeight: "500px",
        overflow: "hidden",
        height: "100%",
      }}
    >
      <>
        <Typography variant="h6">
          Available Paths
          <Tooltip placement="top" title={tooltipText} sx={{ marginLeft: 1 }}>
            <InfoIcon />
          </Tooltip>
        </Typography>
        <FormControlLabel
          control={
            <Checkbox
              checked={showUnsat}
              onChange={() => setShowUnsat(!showUnsat)}
            />
          }
          label="Show Unsat"
        />
        <Box
          sx={{
            height: "85%",
            // maxHeight: "427px",
            overflowY: "scroll",
            scrollbarGutter: "auto",
          }}
        >
          {notes
            .filter((note) => {
              if (showUnsat) {
                return true;
              } else {
                return note?.isSatisfiable;
              }
            })
            .map((note, idx) => {
              return (
                <PathSelectorItem
                  key={idx}
                  note={note}
                  idx={idx}
                  onClick={handlePathClick}
                />
              );
            })}
        </Box>
      </>
    </Box>
  );
};
