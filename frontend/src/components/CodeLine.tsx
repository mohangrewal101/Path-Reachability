import { useState } from "react";

interface CodeLineProps {
  code: string;
  lineNumber: number;
  highlighted: boolean;
  onLineNumberClick: (number) => void;
}

export const CodeLine = ({
  code,
  lineNumber,
  highlighted,
  onLineNumberClick: handleLineNumberClick,
}: CodeLineProps) => {
  const [hovering, setHovering] = useState<boolean>(false);

  const handleOnMouseOver = () => {
    setHovering(true);
  };

  const handleOnMouseLeave = () => {
    setHovering(false);
  };

  return (
    <pre>
      <p
        onMouseOver={handleOnMouseOver}
        onMouseLeave={handleOnMouseLeave}
        onClick={() => handleLineNumberClick(lineNumber)}
        style={{
          backgroundColor:
            highlighted && hovering
              ? "#387ADF"
              : highlighted
              ? "#2e1717"
              : undefined,
          margin: 0,
        }}
      >
        {code}
      </p>
    </pre>
  );
};
