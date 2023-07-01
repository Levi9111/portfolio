import SectionTitle from "../../Utils/SectionTitle/SectionTitle";
import "./About.css";

const About = () => {
  return (
    <section id="about">
      <div className="heading">
        <SectionTitle
          heading="About me"
          subHeading="Know Me More"
        ></SectionTitle>

        <div className="about-container">
          <div className="about-description">
            <h3>
              I&rsquo;m <span>Shanjid Ahmad.</span> A React Developer
            </h3>
            <p>
              As a beginner MERN stack developer, I am passionate about creating
              web applications using the MERN (MongoDB, Express.js, React,
              Node.js) stack. I have a strong foundation in JavaScript and have
              gained hands-on experience with front-end development using React,
              building dynamic user interfaces and implementing client-side
              logic. I am familiar with server-side development using Node.js
              and Express.js, enabling me to build robust and scalable back-end
              solutions. Working with MongoDB, I have gained proficiency in
              designing and implementing databases to store and manage data
              efficiently. With my continuous learning mindset and
              problem-solving skills, I strive to stay up-to-date with the
              latest trends and best practices in web development. I am eager to
              collaborate on projects, contribute to the development process,
              and enhance my skills as a full-stack developer.
            </p>
          </div>
          <div className="about-contact">
            <p>
              <span>Name:</span> Shanjid Ahmad
            </p>
            <p>
              <span>Email:</span>{" "}
              <span className="email">shanjidahmad502@gmail.com</span>
            </p>
            <p>
              <span>Age:</span> 28
            </p>
            <p>
              <span>From:</span> Chadpur,Bangladesh
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
