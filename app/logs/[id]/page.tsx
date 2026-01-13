import React from "react";
import { analysisData } from "../../data/analysis";
import Link from "next/link";
import { notFound } from "next/navigation";

export function generateStaticParams() {
    return analysisData.map((item) => ({
        id: item.id,
    }));
}

export default async function LogDetail({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const log = analysisData.find((item) => item.id === id);

    if (!log) {
        notFound();
    }

    return (
        <div className="min-h-screen bg-[#050505] text-neutral-300 font-mono selection:bg-red-900 selection:text-white">
            {/* Navigation Header */}
            <nav className="border-b border-neutral-900 sticky top-0 bg-[#050505]/90 backdrop-blur-sm z-50">
                <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                    <Link href="/" className="text-xs text-neutral-500 hover:text-white transition-colors">
                        &larr; RETURN_TO_TERMINAL
                    </Link>
                    <div className="text-xs text-neutral-700">
                        SECURE_CONNECTION // {log.id}
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-6 py-24">
                <header className="mb-16 pb-8 border-b border-dashed border-neutral-800">
                    <div className="flex gap-4 mb-6">
                        <span className={`text-xs px-2 py-1 border border-neutral-800 ${log.category === 'AUDIT' ? 'text-orange-500 bg-orange-950/10' :
                            log.category === 'ARCHITECTURE' ? 'text-blue-500 bg-blue-950/10' : 'text-green-500 bg-green-950/10'
                            }`}>
                            {log.category}
                        </span>
                        <span className="text-xs px-2 py-1 border border-neutral-800 text-neutral-500">
                            {log.status}
                        </span>
                    </div>
                    <h1 className="text-3xl md:text-5xl font-bold text-white mb-6 font-doto uppercase tracking-tight">
                        {log.title}
                    </h1>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-neutral-500">
                        <div>
                            <p className="mb-1 uppercase tracking-widest text-neutral-700">System Target</p>
                            <p className="text-neutral-300">{log.systemType}</p>
                        </div>
                        <div>
                            <p className="mb-1 uppercase tracking-widest text-neutral-700">Primary Objective</p>
                            <p className="text-neutral-300">{log.objective}</p>
                        </div>
                    </div>
                </header>

                {/* Content Body - Block Renderer */}
                <article className="space-y-8">
                    {log.contentBlocks && log.contentBlocks.map((block, index) => {
                        switch (block.type) {
                            case 'header':
                                return (
                                    <h3 key={index} className={`font-doto font-bold text-white mb-4 mt-8 ${block.level === 2 ? 'text-2xl' :
                                        block.level === 3 ? 'text-xl' :
                                            'text-lg'
                                        }`}>
                                        {block.text}
                                    </h3>
                                );
                            case 'paragraph':
                                return (
                                    <p key={index} className="text-neutral-400 leading-relaxed text-sm md:text-base">
                                        {block.text}
                                    </p>
                                );
                            case 'list':
                                return (
                                    <ul key={index} className="list-none space-y-2 border-l-2 border-neutral-800 pl-4 py-2 my-4">
                                        {block.items.map((item, i) => (
                                            <li key={i} className="text-neutral-400 text-sm flex gap-3">
                                                <span className="text-red-500 shrink-0">::</span>
                                                {item}
                                            </li>
                                        ))}
                                    </ul>
                                );
                            case 'code':
                                return (
                                    <div key={index} className="my-6">
                                        {block.caption && <p className="text-[10px] uppercase font-mono text-neutral-500 mb-2 tracking-widest">{block.caption}</p>}
                                        <div className="bg-[#0A0A0A] border border-neutral-800 p-4 rounded overflow-x-auto relative group">
                                            <div className="absolute top-2 right-2 flex gap-1.5">
                                                <div className="w-2.5 h-2.5 rounded-full bg-neutral-800" />
                                                <div className="w-2.5 h-2.5 rounded-full bg-neutral-800" />
                                                <div className="w-2.5 h-2.5 rounded-full bg-neutral-800" />
                                            </div>
                                            <pre className="text-xs md:text-sm font-mono leading-relaxed text-neutral-300">
                                                <code>{block.code}</code>
                                            </pre>
                                        </div>
                                    </div>
                                );
                            case 'table':
                                return (
                                    <div key={index} className="my-6 overflow-x-auto">
                                        <table className="w-full border-collapse border border-neutral-800 text-xs md:text-sm">
                                            <thead>
                                                <tr className="bg-neutral-900/50">
                                                    {block.headers.map((header, i) => (
                                                        <th key={i} className="border border-neutral-800 px-4 py-3 text-left text-white font-bold uppercase tracking-wider">
                                                            {header}
                                                        </th>
                                                    ))}
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {block.rows.map((row, rowIndex) => (
                                                    <tr key={rowIndex} className="hover:bg-neutral-900/30 transition-colors">
                                                        {row.map((cell, cellIndex) => (
                                                            <td key={cellIndex} className="border border-neutral-800 px-4 py-3 text-neutral-400">
                                                                {cell}
                                                            </td>
                                                        ))}
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                );
                            default:
                                return null;
                        }
                    })}
                </article>

                {/* Footer */}
                <footer className="mt-24 pt-12 border-t border-neutral-900 text-center">
                    <p className="text-xs text-neutral-700 mb-8">
            // END_OF_FILE
                    </p>
                    <Link href="/" className="inline-block px-8 py-3 border border-neutral-800 hover:bg-white hover:text-black transition-all text-xs uppercase tracking-widest">
                        Close File
                    </Link>
                </footer>
            </main>
        </div>
    );
}
