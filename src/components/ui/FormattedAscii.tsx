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
  let formatted: React.ReactNode = "";
  switch (style) {
    case "bw":
      formatted = children ? children.toString() : "invalid input"
      break
      //<span className='color[rgb:()]'>character</span>
    case "color":
      console.log("children type:", typeof children);
      console.log("children:", children);
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
        <div className='bg-black'>
          <pre className="text-white">
            {r}
          </pre>
          <pre className="absolute top-0 left-0 mix-blend-overlay" style={{ color: 'rgba(0, 0, 255, 0.5)' }}>
            {b}
          </pre>
          <pre className="absolute top-0 left-0 mix-blend-overlay" style={{ color: 'rgba(0, 255, 0, 0.5)' }}>
            {g}
          </pre>
          <pre className="absolute top-0 left-0 mix-blend-overlay" style={{ color: 'rgba(255, 0, 0, 0.5)' }}>
            {r}
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