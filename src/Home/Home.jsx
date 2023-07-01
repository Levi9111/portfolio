import "./Home.css";
import Typewriter from "typewriter-effect";

const Home = () => {
  return (
    <section className="home">
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
        <button className="btn">Hire Me</button>
      </div>
    </section>
  );
};

export default Home;
