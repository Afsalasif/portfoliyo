"use client";
import React, { useState } from "react";
import { analysisData } from "../data/analysis";
import { motion, AnimatePresence } from "framer-motion";

const SystemAnalysis = () => {
    const [selectedCase, setSelectedCase] = useState<string | null>(null);

    return (
        <section className="bg-[#050505] text-neutral-400 py-12 sm:py-16 md:py-24 px-3 sm:px-4 md:px-6 border-t border-neutral-900 font-mono text-xs sm:text-sm">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8 sm:mb-10 md:mb-12 border-b border-dashed border-neutral-800 pb-3 sm:pb-4 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-3 sm:gap-0">
                    <div>
                        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-white font-bold uppercase tracking-tight mb-1 sm:mb-2 font-doto">
                            Engineering <span className="text-red-600">Logs</span>
                        </h2>
                        <p className="text-[10px] sm:text-xs text-neutral-600">
                            // CASE_STUDIES // AUDITS // ARCHITECTURE
                        </p>
                    </div>
                    <div className="text-[10px] sm:text-xs text-left sm:text-right">
                        <p>ACCESS_LEVEL: <span className="text-yellow-500">ROOT</span></p>
                        <p className="hidden sm:block">LOG_STATUS: DECRYPTED</p>
                    </div>
                </div>

                {/* Log List */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
                    <div className="lg:col-span-1 border border-neutral-800 bg-black/50 h-[400px] sm:h-[500px] md:h-[600px] flex flex-col">
                        <p className="text-[10px] sm:text-xs text-neutral-600 p-3 sm:p-4 border-b border-neutral-800 uppercase tracking-widest bg-neutral-900/30 shrink-0">
                            [ DIRECTORY_ROOT ]
                        </p>

                        {/* Scrollable Container */}
                        <div className="overflow-y-auto flex-1 scrollbar-thin scrollbar-track-neutral-900 scrollbar-thumb-neutral-700 hover:scrollbar-thumb-neutral-600">
                            {analysisData.map((item) => (
                                <button
                                    key={item.id}
                                    onClick={() => setSelectedCase(item.id)}
                                    className={`w-full text-left p-3 sm:p-4 border-b border-neutral-900 transition-all duration-300 ${selectedCase === item.id
                                        ? "bg-neutral-900 border-l-2 border-l-red-500 text-white"
                                        : "bg-transparent border-l-2 border-l-transparent hover:bg-neutral-900/30 hover:border-l-neutral-700"
                                        }`}
                                >
                                    <div className="flex justify-between items-center mb-1">
                                        <span className="text-[9px] sm:text-[10px] text-neutral-500">{item.id}</span>
                                        <div className="flex gap-1.5 sm:gap-2">
                                            <span className={`text-[9px] sm:text-[10px] font-bold ${item.category === 'AUDIT' ? 'text-orange-500' :
                                                item.category === 'ARCHITECTURE' ? 'text-blue-500' : 'text-green-500'
                                                }`}>
                                                [{item.category.substring(0, 4)}]
                                            </span>
                                        </div>
                                    </div>
                                    <div className="font-bold truncate text-[11px] sm:text-xs">{item.title}</div>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Case Detail View (Mock Console) */}
                    <div className="lg:col-span-2 bg-black border border-neutral-800 p-4 sm:p-5 md:p-6 h-[400px] sm:h-[500px] md:h-[600px] relative overflow-hidden flex flex-col">

                        {/* Scanlines Effect */}
                        <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-10 pointer-events-none bg-[length:100%_4px,6px_100%]" />

                        <AnimatePresence mode="wait">
                            {selectedCase ? (
                                (() => {
                                    const activeItem = analysisData.find(i => i.id === selectedCase);
                                    if (!activeItem) return null;
                                    return (
                                        <motion.div
                                            key={activeItem.id}
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: -20 }}
                                            className="relative z-20 space-y-4 sm:space-y-5 md:space-y-6 overflow-y-auto h-full pr-1 sm:pr-2 scrollbar-thin scrollbar-thumb-neutral-800"
                                        >
                                            <div className="border-b border-neutral-800 pb-3 sm:pb-4 flex flex-col sm:flex-row justify-between items-start gap-2 sm:gap-0">
                                                <div>
                                                    <h3 className="text-base sm:text-lg md:text-xl text-white font-bold mb-1">{activeItem.title}</h3>
                                                    <p className="text-[10px] sm:text-xs text-yellow-600">TARGET: {activeItem.systemType}</p>
                                                </div>
                                                <span className={`text-[9px] sm:text-[10px] px-2 py-1 bg-neutral-900 border border-neutral-800 whitespace-nowrap ${activeItem.category === 'AUDIT' ? 'text-orange-500' :
                                                    activeItem.category === 'ARCHITECTURE' ? 'text-blue-500' : 'text-green-500'
                                                    }`}>
                                                    TYPE: {activeItem.category}
                                                </span>
                                            </div>

                                            <div>
                                                <h4 className="text-[10px] sm:text-xs text-neutral-500 uppercase mb-2">&gt; Objective</h4>
                                                <p className="text-[11px] sm:text-xs md:text-sm text-neutral-300 bg-neutral-900/50 p-2.5 sm:p-3 border-l-2 border-yellow-600 leading-relaxed">
                                                    {activeItem.objective}
                                                </p>
                                            </div>

                                            <div>
                                                <h4 className="text-[10px] sm:text-xs text-neutral-500 uppercase mb-2">&gt; Methodology</h4>
                                                <ul className="space-y-1">
                                                    {activeItem.methodology.map((m, i) => (
                                                        <li key={i} className="flex items-start gap-2 text-[11px] sm:text-xs md:text-sm text-neutral-400">
                                                            <span className="text-neutral-700 mt-0.5">➜</span> 
                                                            <span className="flex-1">{m}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>

                                            <div>
                                                <h4 className="text-[10px] sm:text-xs text-neutral-500 uppercase mb-2">&gt; Findings</h4>
                                                <p className="text-[11px] sm:text-xs md:text-sm text-neutral-300 leading-relaxed">
                                                    {activeItem.findings}
                                                </p>
                                            </div>

                                            <div className="pt-6 sm:pt-8 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-3 border-t border-neutral-900 mt-6 sm:mt-8">
                                                <div className="text-[9px] sm:text-[10px] text-neutral-700 font-mono">
                                                    END_OF_LOG // {activeItem.id}
                                                </div>
                                                <a
                                                    href={`/logs/${activeItem.id}`}
                                                    className="text-[10px] sm:text-xs bg-neutral-900 border border-neutral-800 px-3 sm:px-4 py-1.5 sm:py-2 hover:bg-neutral-800 hover:text-white transition-colors text-neutral-400 font-mono w-full sm:w-auto text-center"
                                                >
                                                    [ READ_FULL_ENTRY ] &rarr;
                                                </a>
                                            </div>
                                        </motion.div>
                                    )
                                })()
                            ) : (
                                <div className="h-full flex flex-col items-center justify-center text-neutral-700 relative z-20">
                                    <div className="w-12 sm:w-14 md:w-16 h-12 sm:h-14 md:h-16 border-2 border-neutral-800 rounded-full flex items-center justify-center mb-3 sm:mb-4 animate-pulse text-lg sm:text-xl">
                                        !
                                    </div>
                                    <p className="text-[10px] sm:text-xs md:text-sm text-center px-4">SELECT_CASE_FILE_TO_DECRYPT</p>
                                </div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default SystemAnalysis;