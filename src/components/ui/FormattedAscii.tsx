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
  let formatted: React.ReactNode = "invalid input";
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
      }
      break
      
    case "rgb":
      if (children && typeof children === 'object' && 'red' in children) {
        const layers = children as RGBLayers;
        formatted = (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
            <div>
              <h3 style={{ color: '#f00', margin: '0 0 10px 0' }}>Red Layer</h3>
              <pre>
                {layers.red.map((row, i) => (
                  <React.Fragment key={i}>
                    {row.map((char, j) => (
                      <span key={j} style={{ color: 'rgb(255, 0, 0)' }}>
                        {char}
                      </span>
                    ))}
                    {'\n'}
                  </React.Fragment>
                ))}
              </pre>
            </div>

            <div>
              <h3 style={{ color: '#0f0', margin: '0 0 10px 0' }}>Green Layer</h3>
              <pre>
                {layers.green.map((row, i) => (
                  <React.Fragment key={i}>
                    {row.map((char, j) => (
                      <span key={j} style={{ color: 'rgb(0, 255, 0)' }}>
                        {char}
                      </span>
                    ))}
                    {'\n'}
                  </React.Fragment>
                ))}
              </pre>
            </div>

            <div>
              <h3 style={{ color: '#00f', margin: '0 0 10px 0' }}>Blue Layer</h3>
              <pre>
                {layers.blue.map((row, i) => (
                  <React.Fragment key={i}>
                    {row.map((char, j) => (
                      <span key={j} style={{ color: 'rgb(0, 0, 255)' }}>
                        {char}
                      </span>
                    ))}
                    {'\n'}
                  </React.Fragment>
                ))}
              </pre>
            </div>
          </div>
        );
      }
      break

    default:
      formatted = "invalid type"
      break
  }


  if (style === "rgb") {
    return <>{formatted}</>;
  }

  return (
    <pre>
        {formatted}
    </pre>
  );
}

export default FormattedAscii