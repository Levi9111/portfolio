import Header from "./components/Header";
import Hero from "./components/Hero";
import About from "./components/About";
import Projects from "./components/Projects";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import SpaceBackground from "./components/shared/SpaceBackground";

function App() {
  return (
    <>
      {/*
       * SpaceBackground sits fixed behind everything (z-index: 0).
       * All sections use transparent / semi-transparent backgrounds
       * so the star field bleeds through continuously.
       */}
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
        </main>
        <Footer />
      </div>
    </>
  );
}

export default App;
