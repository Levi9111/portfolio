import { useEffect } from "react";
import { Fade } from "react-reveal";

// eslint-disable-next-line react/prop-types
const ScrollFadeIn = ({ children }) => {
  useEffect(() => {
    const handleScroll = () => {
      // const scrollTop = window.pageYOffset;
      // const windowHeight = window.innerHeight;
      // const scrollPosition = scrollTop + windowHeight;

      // const element = document.getElementById("scroll-fade-in");
      // const elementOffsetTop = element.offsetTop;
      // const elementHeight = element.offsetHeight;
      // const elementPosition = elementOffsetTop + elementHeight;

      // if (scrollPosition > elementPosition) {
      //   setVisible(true);
      // }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div id="scroll-fade-in">
      <Fade bottom cascade>
        {children}
      </Fade>
    </div>
  );
};

export default ScrollFadeIn;
