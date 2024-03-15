import "./App.css";
import { useEffect, useState } from "react";
import { useFileUpload } from "../hooks/useFileUpload";
import { useAnalyzeProgram } from "../hooks/useAnalyzeProgram";
import { CodeView } from "../components/CodeView";
import { Grid } from "@mui/material";
import { Summary } from "../components/Summary";
import { Note } from "../hooks/useAnalyzeProgram";

function App() {
  const [note, setNote] = useState<Note>();

  const { fileContents, uploadFile } = useFileUpload();
  const { loading, analyzeProgram, notes } = useAnalyzeProgram();

  useEffect(() => {
    if (fileContents !== "") {
      analyzeProgram(fileContents);
    }
  }, [fileContents]);

  return (
    <>
      <h1>Hello</h1>
      <input onChange={uploadFile} type="file" id="myFile" name="filename" />
      {loading && <h3>Program is being analyzed</h3>}
      {fileContents && (
        <Grid container sx={{ marginTop: 5, width: "1280px" }} spacing={1}>
          <Grid item xs={12} md={6} lg={6}>
            <CodeView
              fileContents={fileContents}
              notes={notes}
              setNote={setNote}
            />
          </Grid>
          <Grid item xs={12} md={6} lg={6}>
            <Summary note={note} />
          </Grid>
        </Grid>
      )}
    </>
  );
}

export default App;
