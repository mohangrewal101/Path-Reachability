import { useState } from "react";

export interface Note {
  comment: string;
  startLine: number;
  endLine: number;
}

export const useAnalyzeProgram = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [notes, setNotes] = useState<Note[]>([]);

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
        setNotes(data);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return { notes, loading, analyzeProgram };
};
