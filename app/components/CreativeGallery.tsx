"use client";
import React from "react";
import { motion } from "framer-motion";

const CreativeGallery = () => {
    const artPieces = [
        { id: 1, title: "Abstract Geometry", type: "Digital Art", color: "bg-red-900" },
        { id: 2, title: "Neon Cyberpunk", type: "3D Render", color: "bg-blue-900" },
        { id: 3, title: "Minimal UI Study", type: "Interface Design", color: "bg-neutral-800" },
        { id: 4, title: "Glitch Series", type: "Generative Art", color: "bg-purple-900" },
    ];

    return (
        <section className="bg-neutral-950 py-24 border-t border-neutral-900 overflow-hidden">
            <div className="max-w-7xl mx-auto px-6">
                <div className="mb-16 flex items-center gap-4">
                    <div className="h-px bg-neutral-800 flex-1" />
                    <h2 className="text-sm font-mono text-neutral-500 uppercase tracking-[0.3em]">
                        The Creative Studio
                    </h2>
                    <div className="h-px bg-neutral-800 flex-1" />
                </div>

                {/* Gallery Grid - Intentionally different layout (Masonry-ish) */}
                <div className="columns-1 md:columns-2 lg:columns-4 gap-4 space-y-4">
                    {artPieces.map((piece, i) => (
                        <motion.div
                            key={piece.id}
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5, delay: i * 0.1 }}
                            className="break-inside-avoid relative group cursor-pointer"
                        >
                            {/* Placeholder Art Block */}
                            <div className={`w-full ${i % 2 === 0 ? 'h-64' : 'h-80'} ${piece.color} bg-opacity-20 rounded-lg border border-neutral-800 backdrop-blur-sm overflow-hidden relative`}>
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                                    <p className="text-white font-bold">{piece.title}</p>
                                    <p className="text-[10px] text-neutral-400 uppercase tracking-widest">{piece.type}</p>
                                </div>

                                {/* Abstract Visuals for Placeholder */}
                                <div className="absolute inset-0 flex items-center justify-center opacity-30 group-hover:scale-110 transition-transform duration-700">
                                    <div className={`w-20 h-20 rounded-full blur-3xl ${piece.color} mix-blend-screen`} />
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default CreativeGallery;
