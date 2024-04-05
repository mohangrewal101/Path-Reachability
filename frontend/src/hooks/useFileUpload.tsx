import { useState } from "react";

export const useFileUpload = () => {
  const [fileContents, setFileContents] = useState<string>("");

  const uploadFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value === "" || e.target === undefined) return;
    const fileReader = new FileReader();
    fileReader.onload = async (file: any) => {
      setFileContents(file.target.result);
      e.target.files = null;
      e.target.value = "";
    };
    if (e.target.files) {
      fileReader.readAsText(e?.target?.files[0]);
    }
  };

  return { uploadFile, fileContents };
};
