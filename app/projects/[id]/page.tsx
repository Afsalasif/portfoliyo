import React from "react";
import { projectsData } from "../../data/projects";
import Link from "next/link";
import { notFound } from "next/navigation";

export function generateStaticParams() {
    return projectsData.map((project) => ({
        id: String(project.id),
    }));
}

export default function ProjectDetail({ params }: { params: { id: string } }) {
    const project = projectsData.find((p) => String(p.id) === params.id);

    if (!project) {
        notFound();
    }

    return (
        <div className="min-h-screen bg-[#050505] text-neutral-300 font-mono selection:bg-red-900 selection:text-white">
            {/* Navigation Header */}
            <nav className="border-b border-neutral-900 sticky top-0 bg-[#050505]/90 backdrop-blur-sm z-50">
                <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                    <Link href="/" className="text-xs text-neutral-500 hover:text-white transition-colors">
                        &larr; RETURN_TO_SYSTEM
                    </Link>
                    <div className="text-xs text-neutral-700">
                        PROJECT_ID // {project.id}
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-6 py-24">
                <header className="mb-16 pb-8 border-b border-dashed border-neutral-800">
                    <div className="flex gap-4 mb-6">
                        <span className="text-xs px-2 py-1 border border-neutral-800 text-blue-500 bg-blue-950/10">
                            {project.category}
                        </span>
                        <span className="text-xs px-2 py-1 border border-neutral-800 text-neutral-500">
                            {project.metrics}
                        </span>
                    </div>
                    <h1 className="text-3xl md:text-5xl font-bold text-white mb-6 font-doto uppercase tracking-tight">
                        {project.title}
                    </h1>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-xs text-neutral-500">
                        <div>
                            <p className="mb-2 uppercase tracking-widest text-neutral-700">Technology Stack</p>
                            <div className="flex flex-wrap gap-2">
                                {project.techStack.map(tech => (
                                    <span key={tech} className="bg-neutral-900 text-neutral-300 px-2 py-1 rounded-sm border border-neutral-800">
                                        {tech}
                                    </span>
                                ))}
                            </div>
                        </div>
                        <div>
                            <p className="mb-2 uppercase tracking-widest text-neutral-700">Deployment Status</p>
                            <div className="flex flex-col gap-2">
                                {project.link ? (
                                    <a href={project.link} target="_blank" rel="noopener noreferrer" className="text-red-500 hover:text-white transition-colors underline decoration-dotted">
                                        [ LIVE_DEPLOYMENT_ACTIVE ] ↗
                                    </a>
                                ) : (
                                    <span className="text-neutral-600">[ INTERNAL_PROTOTYPE ]</span>
                                )}
                                {project.githubLink && (
                                    <a href={project.githubLink} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:text-white transition-colors underline decoration-dotted flex items-center gap-1">
                                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                            <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                                        </svg>
                                        [ SOURCE_CODE_REPOSITORY ] ↗
                                    </a>
                                )}
                            </div>
                        </div>
                    </div>
                </header>

                {/* Description */}
                <div className="mb-16">
                    <h3 className="text-xl font-bold text-white mb-4 font-doto">System Overview</h3>
                    <p className="text-neutral-400 leading-relaxed text-sm md:text-base max-w-2xl">
                        {project.description}
                    </p>
                </div>

                {/* Role */}
                {project.role && (
                    <div className="mb-16">
                        <h3 className="text-xl font-bold text-white mb-4 font-doto">Role & Responsibility</h3>
                        <p className="text-neutral-400 leading-relaxed text-sm md:text-base max-w-2xl">
                            {project.role}
                        </p>
                    </div>
                )}

                {/* Impact */}
                {project.impact && project.impact.length > 0 && (
                    <div className="mb-16">
                        <h3 className="text-xl font-bold text-white mb-4 font-doto">Impact & Achievements</h3>
                        <ul className="space-y-3 text-neutral-400 text-sm md:text-base max-w-2xl">
                            {project.impact.map((item, index) => (
                                <li key={index} className="flex items-start gap-3">
                                    <span className="text-red-500 mt-1">▸</span>
                                    <span className="leading-relaxed">{item}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {/* Content Body - Block Renderer */}
                {project.contentBlocks && project.contentBlocks.length > 0 && (
                    <article className="space-y-8 border-t border-neutral-900 pt-16">
                        <div className="mb-8">
                            <p className="text-xs text-neutral-600 uppercase tracking-widest">Technical Specifications</p>
                        </div>

                        {project.contentBlocks.map((block, index) => {
                            switch (block.type) {
                                case 'header':
                                    return (
                                        <h3 key={index} className={`font-doto font-bold text-white mb-4 mt-8 ${block.level === 2 ? 'text-2xl' : 'text-xl'}`}>
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
                                default:
                                    return null;
                            }
                        })}
                    </article>
                )}


                {/* Footer */}
                <footer className="mt-24 pt-12 border-t border-neutral-900 text-center">
                    <p className="text-xs text-neutral-700 mb-8">
            // END_OF_SPECIFICATION
                    </p>
                    <Link href="/" className="inline-block px-8 py-3 border border-neutral-800 hover:bg-white hover:text-black transition-all text-xs uppercase tracking-widest">
                        Close Blueprint
                    </Link>
                </footer>
            </main>
        </div>
    );
}
