import React, { useEffect, useRef } from 'react';
import { ArrowRight, BookOpen } from 'lucide-react';
import { Story } from '../types';
import { generateGradientCSS } from '../utils/gradientGenerator';

interface StoryCardProps {
    story: Story;
    onClick: () => void;
}

const StoryCard: React.FC<StoryCardProps> = ({ story, onClick }) => {
    const excerpt = story.excerpt ?? 'Open to read the full story.';
    const rootRef = useRef<HTMLDivElement>(null);
    const rafRef = useRef<number | null>(null);
    const accent = generateGradientCSS(`${story.title}-${story.id}`);

    const setMouseVars = (x: number, y: number) => {
        if (!rootRef.current) return;
        rootRef.current.style.setProperty('--mx', String(x));
        rootRef.current.style.setProperty('--my', String(y));
    };

    useEffect(() => {
        setMouseVars(0.5, 0.5);
        return () => {
            if (rafRef.current) cancelAnimationFrame(rafRef.current);
        };
    }, []);

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!rootRef.current) return;
        const rect = rootRef.current.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width;
        const y = (e.clientY - rect.top) / rect.height;
        if (rafRef.current) cancelAnimationFrame(rafRef.current);
        rafRef.current = requestAnimationFrame(() => setMouseVars(x, y));
    };

    const handleMouseLeave = () => {
        if (rafRef.current) cancelAnimationFrame(rafRef.current);
        rafRef.current = requestAnimationFrame(() => setMouseVars(0.5, 0.5));
    };

    return (
        <section
            ref={rootRef}
            onClick={onClick}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className="group relative flex h-screen w-screen flex-shrink-0 cursor-pointer items-center overflow-hidden px-5 py-24 sm:px-10 lg:px-16"
        >
            <div
                className="pointer-events-none absolute inset-x-0 top-0 h-px opacity-70"
                style={{ background: accent }}
            />
            <div
                className="pointer-events-none absolute inset-0 opacity-[0.07] transition-opacity duration-500 group-hover:opacity-[0.12]"
                style={{ background: accent }}
            />
            <div
                className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                style={{
                    background: 'radial-gradient(640px circle at calc(var(--mx, 0.5) * 100%) calc(var(--my, 0.5) * 100%), rgba(255,255,255,0.10), transparent 58%)'
                }}
            />

            <article
                className="relative mx-auto grid w-full max-w-6xl gap-10 border-y border-white/10 py-10 transition-colors duration-300 group-hover:border-white/20 md:grid-cols-[0.85fr_1.15fr] md:items-end md:py-16"
                style={{
                    transform: 'translate3d(calc((var(--mx, 0.5) - 0.5) * 10px), calc((var(--my, 0.5) - 0.5) * 6px), 0)',
                    transition: 'transform 120ms ease-out'
                }}
            >
                <div className="space-y-6">
                    <div className="flex items-center gap-3 text-xs uppercase tracking-[0.28em] text-zinc-500">
                        <span className="font-mono text-zinc-300">{String(story.id).padStart(2, '0')}</span>
                        <span className="h-px w-12 bg-white/15" />
                        <span>Story</span>
                    </div>

                    <div className="flex flex-wrap gap-2">
                        {story.tags.map((tag) => (
                            <span
                                key={tag}
                                className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-xs uppercase tracking-[0.18em] text-zinc-400"
                            >
                                {tag}
                            </span>
                        ))}
                    </div>
                </div>

                <div className="space-y-8">
                    <h2 className="max-w-4xl text-4xl font-semibold leading-[1.05] tracking-normal text-zinc-50 sm:text-5xl lg:text-6xl">
                        {story.title}
                    </h2>

                    <p className="max-w-3xl text-base leading-8 text-zinc-300 sm:text-lg">
                        {excerpt}
                    </p>

                    <div className="flex flex-wrap items-center gap-4">
                        <button
                            type="button"
                            aria-label={`Read ${story.title}`}
                            className="inline-flex h-12 items-center gap-3 rounded-full border border-white/15 bg-zinc-50 px-5 text-sm font-medium text-zinc-950 transition hover:bg-white focus:outline-none focus:ring-2 focus:ring-white/40"
                        >
                            <BookOpen size={17} />
                            Read story
                        </button>

                        <div className="inline-flex items-center gap-2 text-sm text-zinc-500 transition-colors group-hover:text-zinc-300">
                            <span>{story.id === '11' ? 'Paths unlock after this chapter' : 'Continue the sequence'}</span>
                            <ArrowRight size={16} />
                        </div>
                    </div>
                </div>
            </article>
        </section>
    );
};

export default StoryCard;
