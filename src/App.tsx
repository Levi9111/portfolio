import Header from "./components/Header";
import Hero from "./components/Hero";
import About from "./components/About";
import Projects from "./components/Projects";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import SpaceBackground from "./components/shared/SpaceBackground";

function App() {
  return (
    <div className="overflow-x-hidden">
      <SpaceBackground />

      <div
        style={{ position: "relative", zIndex: 1 }}
        className="min-h-screen transition-colors"
      >
        <Header />
        <main>
          <Hero />
          <About />
          <Projects />
          <Contact />
          {/* <RocketLaunch /> */}
        </main>
        <Footer />
      </div>
    </div>
  );
}

export default App;
