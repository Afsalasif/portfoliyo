// import Image from "next/image";
import Landing from "./components/Landing";
import Experience from "./components/Experience";
// import Layout from "./components/Layout";
import Projects from "./components/Projects";
import { StarsBackground } from "./components/ui/StarsBackground";
import Aboutme from "./components/Aboutme";
import Connect from "./components/Connect";

export default function Home() {
  return (
    <div>
 <Landing />
 <Aboutme />
 <Projects />
 <Experience />
 <Connect />
 <StarsBackground />
    </div>
    
  
  );
}
