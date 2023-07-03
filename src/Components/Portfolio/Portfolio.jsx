import SectionTitle from "../../Utils/SectionTitle/SectionTitle";
import "./Portfoliio.css";
import gymso from "../../assets/projects/gymsoFitness.png";
import career from "../../assets/projects/workWithLevi.png";
import eatery from "../../assets/projects/eateryItaliano.png";
import lingo from "../../assets/projects/lingoCamp.png";
import { Link } from "react-router-dom";

const Portfolio = () => {
  return (
    <section id="portfolio">
      <SectionTitle heading="Portfolio" subHeading="My Work"></SectionTitle>
      <div className="portfolio-container grid md:grid-cols-2 gap-8">
        <div className="portfolio-contents ">
          <Link to="http://gymso-fitness-levi.surge.sh/">
            <img src={gymso} alt="" />
          </Link>
          <div className="content-texts">
            <p>
              {" "}
              <span>Technologies:</span> HTML, Vanilla CSS, SASS
            </p>
            <Link
              to="https://github.com/Levi9111/gymso-fitness"
              className="link"
            >
              Github
            </Link>
          </div>
        </div>
        <div className="portfolio-contents">
          <Link to="http://gorgeous-smoke.surge.sh/">
            <img src={career} alt="" />
          </Link>
          <div className="content-texts">
            <p>
              {" "}
              <span>Technologies:</span> React, React Router Dom, Rechart js
            </p>
            <Link to="https://github.com/Levi9111/career-hub" className="link">
              Github
            </Link>
          </div>
        </div>
        <div className="portfolio-contents">
          <Link to="https://eatery-italiano.web.app">
            <img src={eatery} alt="" />
          </Link>
          <div className="content-texts">
            <p>
              {" "}
              <span>Technologies:</span> React, React Router Dom, Rechart lazy
              loading, React Tostify, Firebase, Daisy UI, Tailwind,Node, Express
            </p>
            <Link
              to="https://github.com/Levi9111/eatery-italiano"
              className="link"
            >
              Client
            </Link>
            <Link
              to="https://github.com/Levi9111/eatery-server"
              className="link"
            >
              Server
            </Link>
          </div>
        </div>
        <div className="portfolio-contents">
          <Link to="https://lingocamp-4fdac.web.app/">
            <img src={lingo} alt="" />
          </Link>
          <div className="content-texts">
            <p>
              {" "}
              <span>Technologies:</span> React, React Router Dom, React Query,
              Axios, React Hook Form, Firebase, Daisy UI, Tailwind, Node,
              Express, JSON Web Token
            </p>
            <Link
              to="https://github.com/Levi9111/Lingo-Camp-language-club"
              className="link"
            >
              Client
            </Link>
            <Link
              to="https://github.com/Levi9111/lingo-camp-server"
              className="link"
            >
              Server
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Portfolio;
