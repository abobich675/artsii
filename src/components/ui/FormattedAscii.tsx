import React from 'react';

type ColoredChar = {
  char: string;
  color: string;
};

type RGBLayers = {
  red: string[][];
  green: string[][];
  blue: string[][];
};

type FormattedAsciiProps = {
  style: string;
  children?: string | ColoredChar[][] | RGBLayers;
  // children?: React.ReactNode;
};

const FormattedAscii = ({ style, children}: FormattedAsciiProps) => {
  console.log(children)
  let formatted: React.ReactNode = "";
  switch (style) {
    case "bw":
      formatted = children ? children.toString() : "invalid input"
      break
    case "color":
      if (Array.isArray(children)) {
        const rows: React.ReactNode[] = [];
        (children as ColoredChar[][]).forEach((row, rowIndex) => {
          row.forEach((charData, j) => {
            rows.push(
              <span key={`${rowIndex}-${j}`} style={{ color: charData.color }}>
                {charData.char}
              </span>
            );
          });
          if (rowIndex < children.length - 1) {
            rows.push('\n');
          }
        });
        formatted = rows;
      }
      break
      
    case "rgb":
      if (!children || typeof children != "string") {
        return "invalid input"
      }
      const r_end = children.length / 3
      const g_end = children.length / 3 * 2
      const r = children.slice(0, r_end);
      const g = children.slice(r_end, g_end);
      const b = children.slice(g_end, children.length);

      formatted = (
        <div className='bg-white'>
          <pre className="text-white">
            {r}
          </pre>
          <pre className="absolute top-0 left-0 mix-blend-difference" style={{ color: 'rgba(255, 0, 0, 1)' }}>
            {r}
          </pre>
          <pre className="absolute top-0 left-0 mix-blend-difference" style={{ color: 'rgba(0, 0, 255, 1)' }}>
            {b}
          </pre>
          <pre className="absolute top-0 left-0 mix-blend-difference" style={{ color: 'rgba(0, 255, 0, 1)' }}>
            {g}
          </pre>
        </div>
      );
      return <>{formatted}</>;

    default:
      formatted = "invalid type"
      break
  }

  return (
    <pre>
        {formatted}
    </pre>
  );
}

export default FormattedAscii