import { Link } from "react-scroll";
import "./Footer.css";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <section className="footer">
      Copyright &copy; {currentYear}.{" "}
      <span>
        <Link to="home" smooth={true} duration={500}>
          &nbsp;Shanjid.&nbsp;
        </Link>
      </span>
      All Right Reserved.
    </section>
  );
};

export default Footer;
