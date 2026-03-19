import React, { useState, useEffect } from "react";
import ProjectsDesktop from "./shared/Projects/ProjectsDesktop";
import ProjectsMobile from "./shared/Projects/ProjectsMobile";

const BREAKPOINT = 1100; // px — matches ProjectsDesktop's layout threshold

const Projects: React.FC = () => {
  const [isDesktop, setIsDesktop] = useState<boolean | null>(null);

  useEffect(() => {
    const mq = window.matchMedia(`(min-width: ${BREAKPOINT + 1}px)`);
    setIsDesktop(mq.matches);

    const handler = (e: MediaQueryListEvent) => setIsDesktop(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  // Avoid flash of wrong layout on first paint
  if (isDesktop === null) return null;

  return isDesktop ? <ProjectsDesktop /> : <ProjectsMobile />;
};

export default Projects;
