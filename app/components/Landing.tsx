"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import { FaLinkedin, FaGithub, FaEnvelope, FaTwitter } from "react-icons/fa";
import { StarsBackground } from "./ui/StarsBackground";
import { ShootingStars } from "./ui/ShootingStars";

// Main Landing Component
function Landing() {
  const socialLinks = [
    {
      id: 1,
      icon: <FaLinkedin />,
      name: "LinkedIn",
      url: "https://www.linkedin.com/in/mohamed-afzal-na-731664172/", // Replace with your actual LinkedIn URL
    },
    {
      id: 2,
      icon: <FaGithub />,
      name: "GitHub",
      url: "https://github.com/Afsalasif", // Replace with your actual GitHub username
    },
    {
      id: 3,
      icon: <FaEnvelope />,
      name: "Email",
      url: "mailto:mohammedafzalna@gmail.com",
    },
  ];

  return (
    <div className="relative">
      {/* Fixed Stars Background */}
      <div className="fixed inset-0 bg-black -z-20 ">
        <StarsBackground />
        <ShootingStars />
      </div>

      {/* Hero Section Only */}
      <section className="min-h-screen flex flex-col justify-center items-center text-white relative z-10 px-4">
        {/* Header */}
        <div className="absolute top-6 left-6 text-xs md:text-sm font-light tracking-wider">
          Mohamed Afzal NA
        </div>

        {/* Desktop Social Icons - Right Side (now relative to hero, not fixed) */}
        <div className="hidden md:flex absolute right-8 top-1/2 transform -translate-y-1/2 z-20">
          <div className="flex flex-col space-y-4">
            {socialLinks.map((link) => (
              <a
                key={link.id}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 bg-white/5 backdrop-blur-sm border border-white/10 rounded-full hover:bg-white/10 transition-all duration-300 hover:scale-110 text-lg"
                title={link.name}
              >
                {link.icon}
              </a>
            ))}
          </div>
          {/* Vertical Line */}
          <div className="w-px h-16 bg-gradient-to-b from-white/20 to-transparent mx-auto mt-6"></div>
        </div>

        {/* Main Content Container */}
        <div className="text-center space-y-8 max-w-4xl mx-auto">
          {/* Main Title */}
          <div className="space-y-2">
            <h1 className="text-3xl md:text-5xl lg:text-8xl font-doto uppercase tracking-tight leading-tight">
              Building Products
            </h1>
            <h2 className="text-2xl md:text-4xl lg:text-6xl font-doto uppercase tracking-tight">
              <span className="text-red-500">From 0 to 1</span>
            </h2>
          </div>

          {/* Subtitle */}
          <p className="text-sm md:text-base text-white/60 font-light tracking-wide font-mono mb-8">
            &lt; Builder /&gt;  •  [ Analyst ]  •  &#123; Creator &#125;
          </p>

          {/* Portal Link */}
          <a
            href="/art"
            className="inline-block px-6 py-2 border border-white/20 rounded-full text-white/40 text-xs font-mono uppercase tracking-widest hover:text-white hover:border-white/50 hover:bg-white/5 transition-all duration-500 mb-12"
          >
            ↻ See the other side
          </a>

          {/* Mobile Social Icons - Bottom Center */}
          <div className="md:hidden pt-12">
            <div className="flex justify-center space-x-6">
              {socialLinks.map((link) => (
                <a
                  key={link.id}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 bg-white/5 backdrop-blur-sm border border-white/10 rounded-full hover:bg-white/10 transition-all duration-300 text-base"
                  title={link.name}
                >
                  {link.icon}
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Landing;
