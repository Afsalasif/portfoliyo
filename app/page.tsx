import Landing from "./components/Landing";
import Experience from "./components/Experience";
import Projects from "./components/Projects";
import Aboutme from "./components/Aboutme";
import Connect from "./components/Connect";
import SystemAnalysis from "./components/SystemAnalysis";
// import CreativeGallery from "./components/CreativeGallery";

export default function Home() {
  return (
    <div>
      <Landing />
      <Aboutme />
      <Projects />
      <SystemAnalysis />
      {/* <CreativeGallery /> */}
      <Experience />
      <Connect />
    </div>
  );
}
