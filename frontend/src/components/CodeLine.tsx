import { useState } from "react";

interface CodeLineProps {
  code: string;
  lineNumber: number;
  highlighted: boolean;
}

export const CodeLine = ({ code, lineNumber, highlighted }: CodeLineProps) => {
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
