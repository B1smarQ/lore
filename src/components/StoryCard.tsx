import React, { useEffect, useRef } from 'react';
import { Story } from '../types';
import { generateGradientCSS } from '../utils/gradientGenerator';
import ChaoticText from './ChaoticText';
import GlitchEffects from './GlitchEffects';

interface StoryCardProps {
    story: Story;
    onClick: () => void;
}

const StoryCard: React.FC<StoryCardProps> = ({ story, onClick }) => {
    // Generate gradient based on story title + ID for better uniqueness
    const gradientSeed = `${story.title}-${story.id}`;
    const gradientCSS = generateGradientCSS(gradientSeed);

    // Debug: Log the gradient for each story
    console.log(`Story "${story.title}" (ID: ${story.id}) gradient:`, gradientCSS);

    const excerpt = story.excerpt ?? 'Open to read the full story.';

    const rootRef = useRef<HTMLDivElement>(null);
    const rafRef = useRef<number | null>(null);

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
        <div
            ref={rootRef}
            onClick={onClick}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className="group relative w-screen h-screen flex-shrink-0 bg-black overflow-hidden cursor-pointer"
        >
            {/* Gradient background */}
            <div
                className="absolute inset-0 opacity-30 group-hover:opacity-40 transition-opacity duration-500"
                style={{ background: gradientCSS }}
            />

            {/* Large background pattern */}
            <div className="absolute inset-0 opacity-5">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-white blur-3xl animate-pulse-slow" style={{ transform: 'translate(calc((var(--mx, 0.5) - 0.5) * 40px), calc((var(--my, 0.5) - 0.5) * 40px))' }} />
                <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-white blur-3xl animate-float" style={{ transform: 'translate(calc((var(--mx, 0.5) - 0.5) * -30px), calc((var(--my, 0.5) - 0.5) * -30px))' }} />
            </div>

            {/* Random color splashes - larger and more prominent */}
            <div className="absolute top-20 right-20 w-8 h-8 rounded-full bg-gradient-to-r from-pink-500 to-violet-500 animate-pulse-slow opacity-60" style={{ transform: 'translate(calc((var(--mx, 0.5) - 0.5) * 20px), calc((var(--my, 0.5) - 0.5) * 20px))' }} />
            <div className="absolute bottom-32 left-20 w-6 h-6 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 animate-float opacity-70" style={{ transform: 'translate(calc((var(--mx, 0.5) - 0.5) * -16px), calc((var(--my, 0.5) - 0.5) * 16px))' }} />
            <div className="absolute top-1/2 right-1/3 w-4 h-4 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 animate-pulse opacity-50" style={{ transform: 'translate(calc((var(--mx, 0.5) - 0.5) * 14px), calc((var(--my, 0.5) - 0.5) * -14px))' }} />
            <div className="absolute top-1/3 left-1/2 w-5 h-5 rounded-full bg-gradient-to-r from-green-400 to-emerald-500 animate-float opacity-60" style={{ animationDelay: '2s', transform: 'translate(calc((var(--mx, 0.5) - 0.5) * -12px), calc((var(--my, 0.5) - 0.5) * 12px))' }} />



            {/* Modern content layout */}
            <div className="relative h-full flex flex-col justify-center p-6 sm:p-10 md:p-12 z-10">
                <div className="mx-auto w-full max-w-4xl">
                    <div className="backdrop-blur-md bg-white/5 border border-white/10 rounded-2xl p-6 sm:p-10 shadow-2xl"
                        style={{
                            transform: 'perspective(1000px) rotateY(calc((var(--mx, 0.5) - 0.5) * 8deg)) rotateX(calc((0.5 - var(--my, 0.5)) * 6deg))',
                            willChange: 'transform',
                            transition: 'transform 0.06s ease'
                        }}
                    >
                        {/* Episode number */}
                        <div className="mb-4 sm:mb-6">
                            <span className="text-xs sm:text-sm font-mono text-gray-500 tracking-wider">
                                EPISODE {String(story.id).padStart(2, '0')}
                            </span>
                        </div>

                        {/* Title */}
                        <GlitchEffects intensity="low" isActive={true}>
                            <h3 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-light text-white mb-4 sm:mb-6 leading-tight tracking-tight">
                                <ChaoticText glitchChance={0.05} chaosLevel="low">
                                    {story.title}
                                </ChaoticText>
                            </h3>
                        </GlitchEffects>

                        {/* Excerpt */}
                        <p className="text-gray-300 text-base sm:text-lg leading-relaxed mb-6 sm:mb-8 max-w-3xl font-light">
                            {excerpt}
                        </p>

                        {/* Tags */}
                        <div className="flex flex-wrap gap-2 sm:gap-3 mb-6 sm:mb-8">
                            {story.tags.map((tag, index) => (
                                <span
                                    key={index}
                                    className="px-3 py-1.5 text-xs font-mono text-gray-300 bg-white/5 border border-white/10 rounded-md hover:bg-white/10 hover:border-white/20 transition-all duration-300"
                                >
                                    {tag.toUpperCase()}
                                </span>
                            ))}
                        </div>
                        {/* CTA */}
                        <div className="flex items-center gap-4">
                            <button
                                type="button"
                                aria-label={`Read ${story.title}`}
                                className="px-4 py-2 rounded-md bg-white/10 border border-white/15 hover:bg-white/15 hover:border-white/25 transition-colors"
                            >
                                Read story
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Hover effect overlay */}
            <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(400px circle at calc(var(--mx, 0.5) * 100%) calc(var(--my, 0.5) * 100%), rgba(255,255,255,0.08), transparent 60%)', mixBlendMode: 'screen' }} />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        </div>
    );
};

export default StoryCard;