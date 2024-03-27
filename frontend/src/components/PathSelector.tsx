import { Box, Typography } from "@mui/material";
import { PathNote } from "../hooks/useAnalyzeProgram";
import { useState } from "react";

interface PathSelectorItemProps {
  idx: number;
  note: PathNote;
  onClick: (note: PathNote) => void;
}

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
      <p>{idx}</p>
    </div>
  );
};

interface PathSelectorProps {
  notes: PathNote[];
  onSelect: (note: PathNote) => void;
}

export const PathSelector = ({ notes, onSelect }: PathSelectorProps) => {
  const handlePathClick = (note) => {
    onSelect(note);
  };
  return (
    <Box
      sx={{
        border: "solid",
        borderColor: "black",
        borderWidth: "1px",
        height: "100%",
      }}
    >
      <>
        <Typography variant="h6">Available Paths</Typography>
        {notes.map((note, idx) => {
          return (
            <PathSelectorItem
              key={idx}
              note={note}
              idx={idx}
              onClick={handlePathClick}
            />
          );
        })}
      </>
    </Box>
  );
};
