"use client";
import React from "react";
import { experienceData } from "../data/experience";
import { motion } from "framer-motion";

const Experience: React.FC = () => {
  return (
    <section className="py-24 bg-neutral-950 text-neutral-400 font-mono text-sm border-t border-neutral-900">
      <div className="max-w-7xl mx-auto px-6">

        {/* Header */}
        <div className="mb-16 border-b border-dashed border-neutral-800 pb-8">
          <h2 className="text-3xl md:text-5xl text-white font-bold uppercase tracking-tight mb-2 font-doto">
            Kernel <span className="text-red-600">History</span>
          </h2>
          <p className="text-xs text-neutral-600">
              // RUNTIME_LOGS // CAREER_EXECUTION_TRACE
          </p>
        </div>

        <div className="relative border-l border-neutral-800 ml-3 md:ml-6 space-y-16">
          {experienceData.map((item, index) => (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              key={index}
              className="relative pl-8 md:pl-12 group"
            >
              {/* Timeline Node (Commit Dot) */}
              <div className="absolute -left-[5px] top-2 w-2.5 h-2.5 bg-neutral-950 border border-neutral-600 rounded-full group-hover:border-red-500 group-hover:bg-red-500 transition-colors duration-300" />

              {/* Header Line */}
              <div className="flex flex-col sm:flex-row sm:items-baseline gap-2 sm:gap-4 mb-4">
                <span className="text-red-500 font-bold">{item.title}</span>
                <span className="hidden sm:inline text-neutral-700">::</span>
                <span className="text-white font-bold uppercase">
                  {item.role} @ {item.company}
                </span>
              </div>

              {/* Description Block */}
              <div className="bg-neutral-900/30 border border-neutral-800/50 p-6 rounded-sm hover:border-neutral-700 transition-colors">
                <p className="mb-6 text-neutral-500 italic border-l-2 border-neutral-800 pl-4">
                  "{item.description}"
                </p>

                <div className="space-y-3">
                  {item.achievements.map((ach, i) => (
                    <div key={i} className="flex gap-3">
                      <span className="text-green-500 shrink-0">➜</span>
                      <span className="text-neutral-300">
                        {ach}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Connection Line (Gradient) */}
              {index !== experienceData.length - 1 && (
                <div className="absolute left-[-1px] top-4 bottom-[-64px] w-px bg-neutral-800 group-hover:bg-neutral-700" />
              )}
            </motion.div>
          ))}
        </div>

        {/* End of Log Marker */}
        <div className="mt-16 ml-3 md:ml-6 pl-8 md:pl-12 text-xs text-neutral-700">
          <span className="text-red-900">END_OF_TRACE</span> // AWAITING_NEXT_INSTRUCTION...
        </div>

      </div>
    </section>
  );
};

export default Experience;
