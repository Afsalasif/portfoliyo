"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { projectsData, projectCategories, ProjectCategory } from "../data/projects";

const ITEMS_PER_PAGE = 6;

const Projects = () => {
  const [activeCategory, setActiveCategory] = useState<ProjectCategory>("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [expandedId, setExpandedId] = useState<number | null>(null);

  // Reset page when category changes
  useEffect(() => {
    setCurrentPage(1);
  }, [activeCategory]);

  // Sort by Year Descending
  const sortedProjects = activeCategory === "All"
    ? [...projectsData].sort((a, b) => Number(b.year) - Number(a.year))
    : projectsData.filter((p) => p.category === activeCategory).sort((a, b) => Number(b.year) - Number(a.year));

  // Pagination Logic
  const totalPages = Math.ceil(sortedProjects.length / ITEMS_PER_PAGE);
  const paginatedProjects = sortedProjects.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      // Optional: Scroll to top of grid
      const gridElement = document.getElementById("project-grid");
      if (gridElement) gridElement.scrollIntoView({ behavior: 'smooth' });
    }
  }

  return (
    <section className="py-24 bg-black text-white min-h-screen border-t border-neutral-900" id="project-registry">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Registry Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 pb-6 border-b border-neutral-800">
          <div>
            <h2 className="text-3xl md:text-5xl font-doto font-bold uppercase tracking-tight mb-2">
              Deployed <span className="text-red-600">Modules</span>
            </h2>
            <p className="font-mono text-sm text-neutral-500">
              // SYSTEM_REGISTRY_V1.X
            </p>
          </div>
          <div className="font-mono text-xs text-neutral-600 text-right mt-6 md:mt-0">
            <p>TOTAL_MODULES: {projectsData.length.toString().padStart(2, '0')}</p>
            <p>SYSTEM_STATUS: <span className="text-green-500">NOMINAL</span></p>
          </div>
        </div>

        {/* Filters - Tab Style */}
        <div className="flex flex-wrap gap-2 mb-12">
          {projectCategories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-4 py-1.5 font-mono text-xs border transition-all duration-300 uppercase tracking-wider ${activeCategory === category
                ? "bg-neutral-800 text-white border-neutral-600"
                : "bg-black text-neutral-500 border-neutral-800 hover:border-neutral-700 hover:text-neutral-300"
                }`}
            >
              [{category}]
            </button>
          ))}
        </div>

        {/* Grid - System Cards */}
        <motion.div layout id="project-grid" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 min-h-[600px]">
          <AnimatePresence mode="popLayout">
            {paginatedProjects.map((project) => (
              <motion.div
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                key={project.id}
                className="group bg-neutral-950 border border-neutral-900 hover:border-neutral-700 transition-colors duration-300 flex flex-col h-[550px]"
                onHoverStart={() => setExpandedId(project.id)}
                onHoverEnd={() => setExpandedId(null)}
              >
                {/* Card Header: Stats Line */}
                <div className="flex justify-between items-center px-4 py-3 border-b border-neutral-900 bg-neutral-900/30">
                  <span className="font-mono text-[10px] text-neutral-500">ID: {project.id.toString().padStart(3, '0')}</span>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[10px] text-red-500 font-bold">{project.year}</span>
                    <span className="text-neutral-700">|</span>
                    <span className="font-mono text-[10px] text-neutral-500 uppercase">{project.category}</span>
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)] animate-pulse" />
                  </div>
                </div>


                {/* Content Body */}
                <div className="p-5 flex-1 flex flex-col relative overflow-hidden">
                  {/* Standard View */}
                  <div className="absolute inset-5 bg-neutral-950 transition-opacity duration-300 group-hover:opacity-0 pointer-events-none">
                    <h3 className="text-xl font-bold text-white font-doto mb-2 pointer-events-auto">{project.title}</h3>
                    <p className="text-xs text-red-500 font-mono mb-4">{project.metrics}</p>
                    <p className="text-sm text-neutral-400 font-light leading-relaxed line-clamp-3">
                      {project.description}
                    </p>
                  </div>

                  {/* Deep Dive View (Revealed on Hover) */}
                  <div className="flex-1 flex flex-col justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-75">
                    <div>
                      <h3 className="text-xl font-bold text-white font-doto mb-4">{project.title}</h3>

                      <div className="mb-4">
                        <p className="text-[10px] text-neutral-500 font-mono uppercase mb-1">Architecture</p>
                        <p className="text-xs text-neutral-300 font-mono border-l-2 border-neutral-800 pl-2">
                          {project.architectureSnippet || "Standard MVC Architecture"}
                        </p>
                      </div>

                      {project.keyChallenge && (
                        <div className="mb-4">
                          <p className="text-[10px] text-neutral-500 font-mono uppercase mb-1">Core Challenge</p>
                          <p className="text-xs text-neutral-300 border-l-2 border-red-900/50 pl-2">
                            {project.keyChallenge}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Stack & Link */}
                    <div>
                      <div className="flex flex-wrap gap-1 mb-4">
                        {project.techStack.slice(0, 4).map(tech => (
                          <span key={tech} className="text-[10px] font-mono text-neutral-500 border border-neutral-800 px-1.5 py-0.5">
                            {tech}
                          </span>
                        ))}
                      </div>

                      <div className="space-y-2">
                        <Link href={`/projects/${project.id}`} className="block w-full text-center py-2 border border-neutral-800 bg-neutral-800 text-neutral-300 text-xs font-mono hover:bg-white hover:text-black transition-colors">
                          [ VIEW_BLUEPRINT ]
                        </Link>
                        {project.link && (
                          <a href={project.link} target="_blank" rel="noopener noreferrer" className="block w-full text-center py-2 border border-neutral-800 bg-neutral-900/50 text-xs font-mono hover:bg-white hover:text-black transition-colors">
                            INITIALIZE_VIEW &rarr;
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex justify-between items-center mt-16 border-t border-neutral-900 pt-8 font-mono text-xs">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className={`flex items-center gap-2 px-4 py-2 border border-neutral-800 transition-colors ${currentPage === 1 ? 'opacity-50 cursor-not-allowed text-neutral-600' : 'hover:bg-neutral-800 hover:text-white text-neutral-400'}`}
            >
              &larr; [ PREV_BLOCK ]
            </button>

            <div className="text-neutral-600">
              PAGE_INDEX: {currentPage.toString().padStart(2, '0')} / {totalPages.toString().padStart(2, '0')}
            </div>

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`flex items-center gap-2 px-4 py-2 border border-neutral-800 transition-colors ${currentPage === totalPages ? 'opacity-50 cursor-not-allowed text-neutral-600' : 'hover:bg-neutral-800 hover:text-white text-neutral-400'}`}
            >
              [ NEXT_BLOCK ] &rarr;
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default Projects;
