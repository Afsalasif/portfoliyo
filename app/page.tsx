import Landing from "./components/Landing";
import Aboutme from "./components/Aboutme";
import Projects from "./components/Projects";
import SystemAnalysis from "./components/SystemAnalysis";
import Experience from "./components/Experience";
import Connect from "./components/Connect";

export default function Home() {
  return (
    <main className="relative">
      <Landing />
      <Aboutme />
      <Projects />
      <SystemAnalysis />
      <Experience />
      <Connect />
    </main>
  );
}