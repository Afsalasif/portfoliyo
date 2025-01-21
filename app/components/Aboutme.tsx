import Image from "next/image";
import React from "react";
import { ContainerScroll } from "./ui/ContainerScroll";
import { StarsBackground } from "./ui/StarsBackground";
import {
  TextRevealCard,
  TextRevealCardDescription,
  TextRevealCardTitle,
} from "./ui/TextRevealCard";
import { FaGithub, FaReact, FaNodeJs, FaJava, FaGitAlt, FaPython } from "react-icons/fa";
import { DiJavascript1,DiMongodb } from "react-icons/di";
import { SiNextdotjs } from "react-icons/si";
import { AnimatedTooltip } from "./ui/AnimatedTooltip";

const Aboutme = () => {
  const icons = [
    {
      id: 1,
      icon: <FaGithub />,
      name: "GitHub",
    },
    {
      id: 2,
      icon: <FaReact />,
      name: "React",
    },
    {
      id: 3,
      icon: <FaNodeJs />,
      name: "Node.js",
    },
    {
      id: 4,
      icon: <FaJava />,
      name: "Java",
    },
    // {
    //   id: 5,
    //   icon: <DiCplusplus />,
    //   name: "C++",
    // },
    {
      id: 6,
      icon: <FaPython />,
      name: "Python",
    },
    {
      id: 7,
      icon: <DiJavascript1 />,
      name: "JavaScript",
    },
    {
      id: 8,
      icon: <DiMongodb />,
      name: "MongoDB",
    },
    {
      id: 9,
      icon: <SiNextdotjs />,
      name: "Next.js",
    },
    {
      id: 10,
      icon: <FaGitAlt />,
      name: "Git",
    },
  ];
  return (
    <section className="flex flex-col items-center bg-gray-100 text-gray-800 px-6 py-12 md:py-16">
    <h1 className="text-3xl md:text-4xl font-bold uppercase tracking-widest mb-4 text-center">
      what i do
    </h1>
    <p className="text-sm font-light md:text-xl text-justify max-w-2xl mb-8">
      I specialize in creating sleek, modern, and user-friendly web
      applications that prioritize both functionality and design. On the
      frontend, I bring ideas to life with responsive interfaces, intuitive
      user experiences, and cutting-edge technologies. On the backend, I build
      robust, scalable systems that ensure seamless performance and
      reliability.
    </p>
  
    {/* Skills Section */}
    <div className="flex flex-wrap justify-center gap-4 mb-8">
      {/* Uncomment and adjust icon sections here */}
      <div className="flex flex-row items-center justify-center  md:w-auto">
        <AnimatedTooltip items={icons} />
      </div>
    </div>
  
    {/* Connect Button */}
  </section>
  );
};

export default Aboutme;
