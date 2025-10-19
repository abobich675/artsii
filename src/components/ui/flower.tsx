const Flower = () => {
    const ascii =
      `
          ,_('--,
            (.--; ,--')_,
                | ;--.)
            .-. |.| .-.
                \\|\\|/ .-.
            .-.\`\\|/|/\`_
              \`\\|/|/\` '
        \`^s\`^^\`^\`\`^\`\`^\`\`^\`\`^\`\`
      `
  return (
    <pre>
        {ascii}
    </pre>
  );
}

export default Flower