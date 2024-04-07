import {
  Box,
  Typography,
  Table,
  TableCell,
  TableHead,
  TableRow,
  TableBody,
  TableContainer,
  Stack,
  Tooltip,
} from "@mui/material";
import { PathNote } from "../hooks/useAnalyzeProgram";
import InfoIcon from "@mui/icons-material/Info";

interface SummaryProps {
  note: PathNote | undefined;
}

const tooltipText = (
  <>
    <p>This panel displays summary information about the selected path.</p>
    <p>
      It will indicate if the given sequence of conditions in the path are
      satisfiable.
    </p>
    <p>
      If the path conditions are satisfiable, it will indicate which function
      parameter values are required to execute the path.
    </p>
    <p>
      Note that the application may indicate a parameter can be assigned to
      itself in a satisfying assignment. This indicates it does not matter what
      value the parameter is set to, the path of conditions will be satisfiable
      regardless. The same applies if a function parameter is not included in a
      satisfying assignment.
    </p>
  </>
);

export const Summary = ({ note }: SummaryProps) => {
  return (
    <Box
      sx={{
        border: 1,
        borderColor: "black",
        width: "100%",
        height: "100%",
        paddingLeft: 2,
        paddingRight: 2,
        backgroundColor: "#242424",
      }}
    >
      <Stack
        flexDirection={"row"}
        sx={{ textAlign: "center" }}
        alignItems="center"
        justifyContent="center"
      >
        <Typography variant="h6">Path Summary</Typography>
        <Tooltip placement="top" title={tooltipText} sx={{ marginLeft: 1 }}>
          <InfoIcon />
        </Tooltip>
      </Stack>
      {note ? (
        <>
          {note.error && <p>Could not run Z3 on this path</p>}
          {note?.isSatisfiable !== undefined && (
            <>
              {note.isSatisfiable ? (
                <p>Path is Satisfiable ✅</p>
              ) : (
                <>
                  <p>Path cannot be executed ❌</p>
                  <p>
                    The list of conditions along this path cannot be satisfied
                  </p>
                </>
              )}
              {note?.isSatisfiable && note.satisfyingAssignment && (
                <div style={{ marginTop: 10 }}>
                  <p>Satisfying Assignment:</p>
                  <TableContainer sx={{ border: "solid", marginTop: 2 }}>
                    <Table size="small" sx={{ color: "white" }}>
                      <TableHead>
                        <TableRow>
                          <TableCell sx={{ color: "white" }}>
                            <strong>Function Parameter</strong>
                          </TableCell>
                          <TableCell sx={{ color: "white" }}>
                            <strong>Value</strong>
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {Object.entries(note.satisfyingAssignment).map(
                          ([key, val], idx) => {
                            return (
                              <TableRow key={idx}>
                                <TableCell sx={{ color: "white" }}>
                                  {key}
                                </TableCell>
                                <TableCell sx={{ color: "white" }}>
                                  {val.toString()}
                                </TableCell>
                              </TableRow>
                            );
                          }
                        )}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </div>
              )}
            </>
          )}
        </>
      ) : (
        <></>
      )}
    </Box>
  );
};
