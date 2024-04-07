import "./App.css";
import { useEffect, useState } from "react";
import { useFileUpload } from "../hooks/useFileUpload";
import { useAnalyzeProgram } from "../hooks/useAnalyzeProgram";
import { CodeView } from "../components/CodeView";
import { Container, Grid, Typography, Box } from "@mui/material";
import { Summary } from "../components/Summary";
import { PathNote } from "../hooks/useAnalyzeProgram";
import { PathSelector } from "../components/PathSelector";
import { CircularProgress } from "@mui/material";

function App() {
  const [pathNote, setPathNote] = useState<PathNote>({});
  const { fileContents, uploadFile } = useFileUpload();
  const { loading, analyzeProgram, notes, error, errorString } =
    useAnalyzeProgram();

  useEffect(() => {
    if (fileContents !== "") {
      analyzeProgram(fileContents);
      setPathNote({});
    }
  }, [fileContents]);

  return (
    <>
      <Typography variant="h2">MountainPath</Typography>
      <div style={{ marginTop: 20 }}></div>
      {!loading && (
        <input onChange={uploadFile} type="file" id="myFile" name="filename" />
      )}
      {fileContents &&
        (loading ? (
          <div style={{ marginTop: 20 }}>
            <Typography variant="body1">Program is being analyzed</Typography>
            <CircularProgress sx={{ marginTop: 4 }} />
          </div>
        ) : error ? (
          <Box sx={{ paddingX: 30 }}>
            <Typography sx={{ marginTop: 5, color: "red" }} variant="h6">
              {errorString}
            </Typography>
          </Box>
        ) : (
          <Container sx={{ width: "100vw", padding: 0, margin: 0 }}>
            <Grid container sx={{ marginTop: 5, width: "100%" }} spacing={1}>
              <Grid item xs={12} md={2} lg={2}>
                <PathSelector
                  notes={notes}
                  onSelect={(note) => setPathNote({ ...note })}
                />
              </Grid>
              <Grid item xs={12} md={6} lg={6}>
                <CodeView fileContents={fileContents} note={pathNote} />
              </Grid>
              <Grid item xs={12} md={4} lg={4}>
                <Summary note={pathNote} />
              </Grid>
            </Grid>
          </Container>
        ))}
    </>
  );
}

export default App;
