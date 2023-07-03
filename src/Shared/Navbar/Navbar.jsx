import { useState, useEffect } from "react";
import { FaBars } from "react-icons/fa";
import { Link as ScrollLink, animateScroll } from "react-scroll";
import logo from "../../assets/logo.png";
import "./Navbar.css";

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState(false);
  const [currentSection, setCurrentSection] = useState(""); // Track the current section

  const handleActive = () => {
    setActive(!active);
  };

  const handleSectionChange = (section) => {
    setCurrentSection(section);
  };

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset;
      if (scrollTop > 120) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Scroll to top when logo or navbar button is clicked
  const scrollToTop = () => {
    animateScroll.scrollToTop();
  };

  return (
    <section
      className={`navbar flex justify-between items-center px-3 py-4 ${
        scrolled ? "scrolled" : ""
      }`}
    >
      <div className="flex items-center" onClick={scrollToTop}>
        <img src={logo} alt="" className="h-6 w-6" />
        <h1 className="ml-2 font-bold text-xl">Shanjid Ahmad</h1>
      </div>

      <div className="text-lg space-x-3 hidden md:block ">
        <ScrollLink
          className={`link${currentSection === "home" ? " active" : ""}`}
          to="home"
          smooth={true}
          duration={500}
          offset={-50}
          spy={true} // Activate spy behavior to track the active section
          activeClass="active" // Set the class name for the active section
          onSetActive={() => handleSectionChange("home")}
        >
          Home
        </ScrollLink>
        <ScrollLink
          className={`link${currentSection === "about" ? " active" : ""}`}
          to="about"
          smooth={true}
          duration={500}
          offset={-50}
          spy={true}
          activeClass="active"
          onSetActive={() => handleSectionChange("about")}
        >
          About Me
        </ScrollLink>
        <ScrollLink
          className={`link${currentSection === "my-work" ? " active" : ""}`}
          to="my-work"
          smooth={true}
          duration={500}
          offset={-50}
          spy={true}
          activeClass="active"
          onSetActive={() => handleSectionChange("my-work")}
        >
          What I Use
        </ScrollLink>

        <ScrollLink
          className={`link${currentSection === "resume" ? " active" : ""}`}
          to="resume"
          smooth={true}
          duration={500}
          offset={-50}
          spy={true}
          activeClass="active"
          onSetActive={() => handleSectionChange("resume")}
        >
          Resume
        </ScrollLink>
        <ScrollLink
          className={`link${currentSection === "portfolio" ? " active" : ""}`}
          to="portfolio"
          smooth={true}
          duration={500}
          offset={-50}
          spy={true}
          activeClass="active"
          onSetActive={() => handleSectionChange("portfolio")}
        >
          Portfolio
        </ScrollLink>
        <ScrollLink
          className={`link${currentSection === "contact" ? " active" : ""}`}
          to="contact"
          smooth={true}
          duration={500}
          offset={-50}
          spy={true}
          activeClass="active"
          onSetActive={() => handleSectionChange("contact")}
        >
          Contact
        </ScrollLink>
      </div>

      {/* Responsive */}
      <div className="block md:hidden relative">
        <button onClick={handleActive}>
          <FaBars />
        </button>
        <div
          className={`flex flex-col absolute -right-3 ${
            active ? "mt-3" : "-mt-96"
          } space-y-3 px-4 py-3 bg-[#232323] w-screen`}
        >
          <ScrollLink
            className={`link${currentSection === "home" ? " active" : ""}`}
            to="home"
            smooth={true}
            duration={500}
            offset={-50}
            spy={true} // Activate spy behavior to track the active section
            activeClass="active" // Set the class name for the active section
            onSetActive={() => handleSectionChange("home")}
          >
            Home
          </ScrollLink>
          <ScrollLink
            className={`link${
              currentSection === "about" ? " active" : ""
            }, active-link`}
            to="about"
            smooth={true}
            duration={500}
            offset={-50}
            spy={true}
            activeClass="active"
            onSetActive={() => handleSectionChange("about")}
          >
            About Me
          </ScrollLink>
          <ScrollLink
            className={`link${
              currentSection === "my-work" ? " active" : ""
            }, active-link`}
            to="my-work"
            smooth={true}
            duration={500}
            offset={-50}
            spy={true}
            activeClass="active"
            onSetActive={() => handleSectionChange("my-work")}
          >
            What I Use
          </ScrollLink>

          <ScrollLink
            className={`link${
              currentSection === "resume" ? " active" : ""
            }, active-link`}
            to="resume"
            smooth={true}
            duration={500}
            offset={-50}
            spy={true}
            activeClass="active"
            onSetActive={() => handleSectionChange("resume")}
          >
            Resume
          </ScrollLink>
          <ScrollLink
            className={`link${
              currentSection === "portfolio" ? " active" : ""
            }, active-link`}
            to="portfolio"
            smooth={true}
            duration={500}
            offset={-50}
            spy={true}
            activeClass="active"
            onSetActive={() => handleSectionChange("portfolio")}
          >
            Portfolio
          </ScrollLink>
          <ScrollLink
            className={`link${
              currentSection === "contact" ? " active" : ""
            }, active-link`}
            to="contact"
            smooth={true}
            duration={500}
            offset={-50}
            spy={true}
            activeClass="active"
            onSetActive={() => handleSectionChange("contact")}
          >
            Contact
          </ScrollLink>
        </div>
      </div>
    </section>
  );
};

export default Navbar;
