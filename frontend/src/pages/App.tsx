import "./App.css";
import { useEffect, useState } from "react";
import { useFileUpload } from "../hooks/useFileUpload";
import { useAnalyzeProgram } from "../hooks/useAnalyzeProgram";
import { CodeView } from "../components/CodeView";
import { Grid } from "@mui/material";
import { Summary } from "../components/Summary";
import { PathNote } from "../hooks/useAnalyzeProgram";
import { PathSelector } from "../components/PathSelector";

function App() {
  const [pathNote, setPathNote] = useState<PathNote>({});
  const { fileContents, uploadFile } = useFileUpload();
  const { loading, analyzeProgram, notes } = useAnalyzeProgram();

  useEffect(() => {
    if (fileContents !== "") {
      analyzeProgram(fileContents);
    }
  }, [fileContents]);

  return (
    <>
      <h1>Program Analyzer</h1>
      <input onChange={uploadFile} type="file" id="myFile" name="filename" />
      {fileContents &&
        (loading ? (
          <h3>Program is being analyzed</h3>
        ) : (
          <Grid container sx={{ marginTop: 5, width: "100%" }} spacing={1}>
            <Grid item xs={12} md={2} lg={2}>
              <PathSelector notes={notes} onSelect={setPathNote} />
            </Grid>
            <Grid item xs={12} md={5} lg={5}>
              <CodeView fileContents={fileContents} note={pathNote} />
            </Grid>
            <Grid item xs={12} md={5} lg={5}>
              <Summary note={pathNote} />
            </Grid>
          </Grid>
        ))}
    </>
  );
}

export default App;
