"use client"
import React from 'react'
import { motion } from 'framer-motion';

import { HeroParallax } from './ui/HeroParallax'
// import { section } from 'framer-motion/client';


const Projects = () => {
   const projects = [
    {
      title: "porrtfolio1",
    link: "",
      thumbnail:
      "/images/imran23.jpg",
    },
    {
      title: "VAMOZ",
      link: "https://vamoz-final.vercel.app/",
      thumbnail:
        "/images/vamoz.jpg"
    },
    {
      title: "netflix",
      link: "https://netflix-clone-afzal.vercel.app/",
      thumbnail:
        "/images/netflixinside.jpg",
    },
    {
      title: "LOGIN",
      link: "https://netflix-clone-afzal.vercel.app/",
      thumbnail:
      "/images/netflixfront.jpg",
    },
  
    {
      title: "portfolio2",
    link: "/",
      thumbnail:
      "/images/imran1.jpg",
    },
    {
      title: "portfolio3",
    link: "",
      thumbnail:
      "/images/imran2.jpg",
    },
    {
      title: "potfolio4",
      link: "https://afsalasif.github.io/mysite/",
      thumbnail:
      "/images/afsal.jpg",   
     },
    {
      title: "homegym",
    link: "",
      thumbnail:
      "/images/homegym.jpg",
    },
    {
      title: "rp royality",
    link: "https://rproyality.com/",
      thumbnail:
      "/images/rproyality.jpg",
    },
    {
      title: "cyybersecurity",
      link: "",
      thumbnail:
      "/images/cybersecurity.jpg",   
     },
    
    
  ];
  return (
   < section>
    <div className='hidden md:block'>
      <HeroParallax products={projects} />
    </div>
    
    <div className="bg-black py-12 px-6 md:hidden ">
    <h2 className="text-4xl font-extrabold text-center text-gray-800 mb-12">
        My Projects
      </h2>

      {/* List Layout for Projects */}
      <div className="space-y-8">
        {projects.map((project, index) => (
          <motion.div
            key={index}
            className="relative group overflow-hidden rounded-lg"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.2 }}
          >
            {/* Project Image with smaller size wrapped in anchor tag */}
            <a href={project.link} target="_blank" rel="noopener noreferrer">
              <motion.img
                src={project.thumbnail}
                alt={project.title}
                className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-110"
              />
            </a>

            {/* Overlay with Project Title */}
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <motion.h3
                className="text-2xl font-bold text-center px-4 py-2"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
              >
                {project.title}
              </motion.h3>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
   </section>
   
  )
}

export default Projects





