type FormattedAsciiProps = {
  style: string;
  children?: React.ReactNode;
};

const FormattedAscii = ({ style, children}: FormattedAsciiProps) => {
  let formatted = ""
  switch (style) {
    case "bw":
      formatted = children ? children.toString() : "invalid input"
      break
    case "color":
      break
    case "rgb":
      break
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