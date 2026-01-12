"use client";
import React from "react";

const Aboutme = () => {
  const principles = [
    {
      id: "01",
      title: "Scalability First",
      desc: "Systems designed for 10x growth, not just today's load.",
    },
    {
      id: "02",
      title: "User Centricity",
      desc: "Engineering serves the user. Latency is a UX bug.",
    },
    {
      id: "03",
      title: "Ownership",
      desc: "Full accountability from git commit to production monitoring.",
    },
  ];

  const specs = [
    { label: "Architecture", value: "Event-Driven, Microservices, Serverless" },
    { label: "Frontend", value: "Next.js 14, React, Tailwind, Framer Motion" },
    { label: "Backend", value: "Node.js, Postgres, Redis, Docker" },
    { label: "Focus", value: "0 to 1 Product Development" },
  ];

  return (
    <section className="bg-black text-white py-24 px-6 md:px-12 border-t border-neutral-900">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 pb-6 border-b border-neutral-800">
          <div>
            <h2 className="text-3xl md:text-5xl font-doto font-bold uppercase tracking-tight mb-2">
              System <span className="text-red-600">Specs</span>
            </h2>
            <p className="font-mono text-sm text-neutral-500">
              // ENGINEERING_MANIFESTO_V2.0
            </p>
          </div>
          <div className="mt-4 md:mt-0 font-mono text-xs text-right text-neutral-600">
            <p>ID: AFZAL-DEV</p>
            <p>STATUS: OPERATIONAL</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Left: The Narrative (System Description) */}
          <div className="space-y-12">
            <div>
              <h3 className="font-mono text-sm text-red-500 mb-4 tracking-widest uppercase">
                [01] System Description
              </h3>
              <p className="text-lg md:text-xl text-neutral-300 leading-relaxed font-light">
                I operate at the intersection of <strong className="text-white">scalable architecture</strong> and <strong className="text-white">product intuition</strong>.
                Unlike traditional engineers who focus solely on code syntax, I focus on system outputs: reliability, velocity, and user value.
                <br /><br />
                My process involves rigorous architectural planning (RFCs), clean code standards, and automated delivery pipelines to ensure that
                what I build is not just functional, but enduring.
              </p>
            </div>

            {/* Principles Grid */}
            <div>
              <h3 className="font-mono text-sm text-red-500 mb-6 tracking-widest uppercase">
                [02] Core Kernels
              </h3>
              <div className="grid grid-cols-1 gap-4">
                {principles.map((p) => (
                  <div key={p.id} className="border border-neutral-800 bg-neutral-900/50 p-6 flex items-start gap-4 hover:border-neutral-700 transition-colors">
                    <span className="font-doto text-2xl text-neutral-700">{p.id}</span>
                    <div>
                      <h4 className="font-bold text-white uppercase text-sm mb-1">{p.title}</h4>
                      <p className="text-neutral-400 text-sm font-light">{p.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Technical Specifications (Data Sheet) */}
          <div className="relative">
            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-neutral-800/20 to-transparent -z-10" />

            <h3 className="font-mono text-sm text-red-500 mb-6 tracking-widest uppercase">
              [03] Technical Parameters
            </h3>

            <div className="border-t border-neutral-800">
              {specs.map((spec, i) => (
                <div key={i} className="grid grid-cols-3 py-4 border-b border-neutral-800 items-baseline">
                  <span className="font-mono text-xs text-neutral-500 uppercase col-span-1">
                    {spec.label}
                  </span>
                  <span className="font-mono text-sm text-neutral-200 col-span-2">
                    {spec.value}
                  </span>
                </div>
              ))}
            </div>

            {/* Raw "Data" Graphic element */}
            <div className="mt-12 p-6 bg-neutral-900 border border-neutral-800 font-mono text-[10px] text-neutral-600 leading-tight overflow-hidden select-none opacity-50">
              010101 BUILD SUCCESS 402ms <br />
              DEPLOYING TO PRODUCT-V1... <br />
              OPTIMIZING BUNDLE SIZE... <br />
              &gt; 99.9% UPTIME GUARANTEED <br />
              &gt; SCALING PODS... <br />
              ...
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Aboutme;
