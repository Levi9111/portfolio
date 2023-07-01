import "./SectionTitle.css";

// eslint-disable-next-line react/prop-types
const SectionTitle = ({ heading, subHeading }) => {
  return (
    <div className="relative">
      <h2 className="muted-text uppercase">{heading}</h2>
      <div className="sub-heading">
        <h3>{subHeading}</h3>
        <span />
      </div>
    </div>
  );
};

export default SectionTitle;
