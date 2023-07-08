import "./Home.css";
import Typewriter from "typewriter-effect";
import resume from "../../assets/resume/my-resume.pdf";
import { HiChevronDown } from "react-icons/hi";
import { motion } from "framer-motion";

const Home = () => {
  const handleResumeDownload = () => {
    const link = document.createElement("a");
    link.href = resume;
    link.download = "Shanjid Ahmad's Resume.pdf";
    link.click();
  };

  const handleScrollToAbout = () => {
    const aboutSection = document.getElementById("about");
    aboutSection.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section id="home">
      <h2 className="md:text-xl text-md">Hello</h2>
      <div className="typeweitter md:text-4xl text-xl font-bold my-12">
        <Typewriter
          options={{
            strings: [
              "I am Shanjid Ahmad.",
              "Welcome to my website.",
              "I'm a MERN Stack Developer",
              "Creating beautiful and functional user interfaces.",
              "Building websites with love and passion.",
            ],
            autoStart: true,
            loop: true,
          }}
        />
      </div>
      <p className="font-bold text-2xl">Based in Chandpur,Bangladesh</p>

      <div className="btn-container">
        <button className="btn" onClick={handleResumeDownload}>
          My Resume
        </button>
      </div>

      <div className="">
        <motion.div
          animate={{
            y: [0, 24, 0],
          }}
          transition={{
            duration: 1.2,
            repeat: "infinity",
            repeatType: "loop",
          }}
        >
          <button className="mt-12" onClick={handleScrollToAbout}>
            <HiChevronDown className="h-12 w-12" />
          </button>
        </motion.div>
      </div>
    </section>
  );
};

export default Home;
