import "./MutedText.css";

// eslint-disable-next-line react/prop-types
const MutedText = ({ children }) => {
  return <h2 className="muted-text uppercase">{children}</h2>;
};

export default MutedText;
