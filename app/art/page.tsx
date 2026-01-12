"use client";
import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { FaArrowLeft } from "react-icons/fa";

export default function ArtPage() {
    const artPieces = [
        { id: 1, title: "Abstract Geometry", type: "Digital Art", color: "bg-red-900", aspect: "aspect-[3/4]" },
        { id: 2, title: "Neon Cyberpunk", type: "3D Render", color: "bg-blue-900", aspect: "aspect-square" },
        { id: 3, title: "Minimal UI Study", type: "Interface Design", color: "bg-neutral-800", aspect: "aspect-[4/3]" },
        { id: 4, title: "Glitch Series", type: "Generative Art", color: "bg-purple-900", aspect: "aspect-[3/4]" },
        { id: 5, title: "Void Space", type: "Concept Art", color: "bg-emerald-900", aspect: "aspect-square" },
        { id: 6, title: "Typographic Chaos", type: "Typography", color: "bg-orange-800", aspect: "aspect-[16/9]" },
    ];

    return (
        <div className="min-h-screen bg-[#0a0a0a] selection:bg-pink-500 selection:text-white">
            {/* Minimal Navigation - Icon Only */}
            <nav className="fixed top-0 left-0 w-full z-50 p-8 flex justify-between items-center mix-blend-difference">
                <Link
                    href="/"
                    className="group w-10 h-10 flex items-center justify-center rounded-full border border-neutral-800 text-white hover:bg-white hover:text-black transition-all duration-300"
                >
                    <FaArrowLeft className="text-sm" />
                </Link>
            </nav>

            {/* Gallery - Full Screen, No Text */}
            <main className="px-4 md:px-8 py-32 max-w-[1800px] mx-auto">
                <div className="columns-1 md:columns-2 lg:columns-3 gap-8 space-y-8">
                    {artPieces.map((piece, i) => (
                        <motion.div
                            key={piece.id}
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 1, delay: i * 0.1, ease: "easeOut" }}
                            className="break-inside-avoid relative group cursor-none"
                        >
                            <div className={`w-full ${piece.aspect} ${piece.color} relative overflow-hidden rounded-sm grayscale group-hover:grayscale-0 transition-all duration-700`}>
                                {/* Placeholder Visuals */}
                                <div className="absolute inset-0 opacity-40 mix-blend-soft-light bg-[radial-gradient(circle_at_top_right,_white_0%,_transparent_50%)]" />
                                <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-500" />

                                {/* Interactive Shine Effect */}
                                <div className="absolute inset-0 translate-y-full group-hover:translate-y-[-100%] transition-transform duration-[1.5s] bg-gradient-to-t from-transparent via-white/10 to-transparent" />
                            </div>
                        </motion.div>
                    ))}
                </div>
            </main>
        </div>
    );
}
