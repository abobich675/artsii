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
    case "color":
      if (Array.isArray(children)) {
        formatted = (children as ColoredChar[][]).map((row, i) => (
          <React.Fragment key={i}>
            {row.map((charData, j) => (
              <span key={j} style={{ color: charData.color }}>
                {charData.char}
              </span>
            ))}
            {'\n'}
          </React.Fragment>
        ));
      } else {
        formatted = "invalid input"
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