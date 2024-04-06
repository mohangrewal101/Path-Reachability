import { useState } from "react";

export interface PathNote {
  error?: boolean;
  isSatisfiable?: boolean;
  satisfyingAssignment?: { [key: string]: number | boolean };
  lineNumbers?: number[];
}

export const useAnalyzeProgram = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [notes, setNotes] = useState<PathNote[]>([]);
  const [error, setError] = useState<boolean>(false);
  const [errorString, setErrorString] = useState<string>("");

  const analyzeProgram = (program: string) => {
    setLoading(true);
    setError(false);
    setErrorString("");
    fetch("http://localhost:3000/analyzeProgram", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        program,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.error) {
          throw new Error(data.error);
        }
        console.log(data);
        setNotes([...data]);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err.message);
        setLoading(false);
        setError(true);
        setErrorString(err.message);
      });
  };

  return { notes, loading, error, errorString, analyzeProgram };
};
