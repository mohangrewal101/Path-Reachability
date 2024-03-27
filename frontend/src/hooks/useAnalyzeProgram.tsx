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

  const analyzeProgram = (program: string) => {
    setLoading(true);
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
        console.log(data);
        setNotes([...data]);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return { notes, loading, analyzeProgram };
};
