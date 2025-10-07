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
            className="group relative w-screen h-screen flex-shrink-0 overflow-hidden cursor-pointer animate-card-materialize"
        >
            {/* Subtle mystical background */}
            <div className="absolute inset-0">
                {/* Base gradient with story-specific colors - much more subtle */}
                <div
                    className="absolute inset-0 opacity-15 group-hover:opacity-25 transition-opacity duration-700"
                    style={{ background: gradientCSS }}
                />

                {/* Enhanced mystical energy orbs */}
                <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-gradient-to-r from-purple-500/6 to-pink-500/6 blur-3xl animate-energy-orb group-hover:animate-energy-pulse" style={{ transform: 'translate(calc((var(--mx, 0.5) - 0.5) * 40px), calc((var(--my, 0.5) - 0.5) * 40px))' }} />
                <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-gradient-to-r from-cyan-500/5 to-blue-500/5 blur-3xl animate-mystical-float group-hover:animate-energy-pulse" style={{ transform: 'translate(calc((var(--mx, 0.5) - 0.5) * -30px), calc((var(--my, 0.5) - 0.5) * -30px))', animationDelay: '2s' }} />
                <div className="absolute top-1/2 left-1/2 w-64 h-64 rounded-full bg-gradient-to-r from-violet-500/4 to-indigo-500/4 blur-2xl animate-energy-pulse" style={{ transform: 'translate(calc((var(--mx, 0.5) - 0.5) * 20px), calc((var(--my, 0.5) - 0.5) * 20px))', animationDelay: '4s' }} />

                {/* Additional floating energy orbs */}
                <div className="absolute top-1/3 right-1/3 w-32 h-32 rounded-full bg-gradient-to-r from-pink-500/3 to-purple-500/3 blur-xl animate-mystical-float" style={{ animationDelay: '1s', animationDuration: '8s' }} />
                <div className="absolute bottom-1/3 left-1/3 w-48 h-48 rounded-full bg-gradient-to-r from-cyan-500/2 to-violet-500/2 blur-2xl animate-energy-orb" style={{ animationDelay: '3s' }} />

                {/* Enhanced floating mystical particles */}
                <div className="absolute inset-0 opacity-30">
                    <div className="absolute top-20 right-20 w-2 h-2 rounded-full bg-gradient-to-r from-pink-400/80 to-violet-400/80 animate-particle-drift" style={{ '--drift-x': '25px', '--drift-y': '-35px', transform: 'translate(calc((var(--mx, 0.5) - 0.5) * 15px), calc((var(--my, 0.5) - 0.5) * 15px))' } as React.CSSProperties} />
                    <div className="absolute bottom-32 left-20 w-1.5 h-1.5 rounded-full bg-gradient-to-r from-cyan-400/80 to-blue-400/80 animate-particle-drift" style={{ '--drift-x': '-20px', '--drift-y': '-40px', animationDelay: '2s', transform: 'translate(calc((var(--mx, 0.5) - 0.5) * -12px), calc((var(--my, 0.5) - 0.5) * 12px))' } as React.CSSProperties} />
                    <div className="absolute top-1/2 right-1/3 w-1 h-1 rounded-full bg-gradient-to-r from-purple-400/80 to-pink-400/80 animate-particle-drift" style={{ '--drift-x': '15px', '--drift-y': '-25px', animationDelay: '4s', transform: 'translate(calc((var(--mx, 0.5) - 0.5) * 10px), calc((var(--my, 0.5) - 0.5) * -10px))' } as React.CSSProperties} />
                    <div className="absolute top-1/3 left-1/2 w-1.5 h-1.5 rounded-full bg-gradient-to-r from-violet-400/80 to-indigo-400/80 animate-particle-drift" style={{ '--drift-x': '-18px', '--drift-y': '-30px', animationDelay: '6s', transform: 'translate(calc((var(--mx, 0.5) - 0.5) * -8px), calc((var(--my, 0.5) - 0.5) * 8px))' } as React.CSSProperties} />

                    {/* Additional particles for more mystical atmosphere */}
                    <div className="absolute top-16 left-1/4 w-0.5 h-0.5 rounded-full bg-gradient-to-r from-cyan-300/70 to-purple-300/70 animate-particle-drift" style={{ '--drift-x': '30px', '--drift-y': '-45px', animationDelay: '1s' } as React.CSSProperties} />
                    <div className="absolute bottom-20 right-1/4 w-1 h-1 rounded-full bg-gradient-to-r from-pink-300/70 to-violet-300/70 animate-particle-drift" style={{ '--drift-x': '-25px', '--drift-y': '-35px', animationDelay: '3s' } as React.CSSProperties} />
                    <div className="absolute top-3/4 left-16 w-0.5 h-0.5 rounded-full bg-gradient-to-r from-indigo-300/70 to-cyan-300/70 animate-particle-drift" style={{ '--drift-x': '20px', '--drift-y': '-40px', animationDelay: '5s' } as React.CSSProperties} />
                </div>

                {/* Dimensional grid overlay */}
                <div className="absolute inset-0 opacity-5" style={{
                    backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.6) 1px, transparent 0)`,
                    backgroundSize: '80px 80px'
                }} />
            </div>

            {/* Mystical content layout */}
            <div className="relative h-full flex flex-col justify-center p-6 sm:p-10 md:p-12 z-10" style={{ paddingTop: '2rem', paddingBottom: '2rem' }}>
                <div className="mx-auto w-full max-w-5xl">
                    <div className="backdrop-blur-sm bg-gradient-to-br from-white/10 via-white/5 to-white/10 border border-white/20 rounded-3xl p-8 sm:p-12 shadow-2xl group-hover:animate-mystical-glow group-hover:border-white/40 transition-all duration-700"
                        style={{
                            transform: 'perspective(1200px) rotateY(calc((var(--mx, 0.5) - 0.5) * 12deg)) rotateX(calc((0.5 - var(--my, 0.5)) * 10deg))',
                            willChange: 'transform',
                            transition: 'transform 0.1s ease-out'
                        }}
                    >
                        {/* Enhanced episode number with mystical styling */}
                        <div className="flex items-center gap-4 mb-6 sm:mb-8">
                            <div className="relative w-12 h-12 rounded-full bg-gradient-to-r from-purple-500/20 to-cyan-500/20 border border-white/30 flex items-center justify-center group-hover:from-purple-500/40 group-hover:to-cyan-500/40 transition-all duration-500 animate-energy-pulse">
                                {/* Reality ripple effect */}
                                <div className="absolute inset-0 rounded-full border border-purple-400/30 group-hover:animate-reality-ripple" />
                                <span className="text-white font-mono text-lg relative z-10">
                                    {String(story.id).padStart(2, '0')}
                                </span>
                            </div>
                            <div className="flex-1 h-px bg-gradient-to-r from-white/30 via-white/10 to-transparent relative overflow-hidden">
                                {/* Animated energy flow */}
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-400/50 to-transparent animate-text-shimmer" />
                            </div>
                            <span className="text-xs font-mono text-gray-400 tracking-widest animate-pulse">
                                DIMENSIONAL STORY
                            </span>
                        </div>

                        {/* Enhanced title with gradient text and shimmer */}
                        <GlitchEffects intensity="medium" isActive={true}>
                            <div className="mb-6 sm:mb-8 py-4 relative">
                                {/* Background glow effect */}
                                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-cyan-500/10 blur-xl rounded-2xl group-hover:from-purple-500/20 group-hover:via-pink-500/20 group-hover:to-cyan-500/20 transition-all duration-700" />

                                <h3 className="relative text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-thin text-transparent bg-clip-text leading-loose tracking-wide transition-all duration-500"
                                    style={{
                                        lineHeight: '1.4',
                                        background: 'linear-gradient(90deg, #d8b4fe, #f9a8d4, #67e8f9, #d8b4fe)',
                                        backgroundSize: '200% 100%',
                                        WebkitBackgroundClip: 'text',
                                        backgroundClip: 'text'
                                    }}>
                                    <div className="group-hover:animate-text-shimmer">
                                        <ChaoticText glitchChance={0.08} chaosLevel="medium">
                                            {story.title}
                                        </ChaoticText>
                                    </div>
                                </h3>
                            </div>
                        </GlitchEffects>

                        {/* Enhanced excerpt */}
                        <p className="text-gray-200 text-lg sm:text-xl leading-relaxed mb-8 sm:mb-10 max-w-4xl font-light group-hover:text-gray-100 transition-colors duration-500">
                            {excerpt}
                        </p>

                        {/* Enhanced tags with mystical styling and animations */}
                        <div className="flex flex-wrap gap-3 sm:gap-4 mb-8 sm:mb-10">
                            {story.tags.map((tag, index) => (
                                <span
                                    key={index}
                                    className="relative px-4 py-2 text-sm font-mono text-gray-300 bg-white/10 border border-white/20 rounded-full backdrop-blur-sm hover:bg-white/20 hover:text-white hover:border-white/40 transition-all duration-300 group-hover:bg-white/15 animate-mystical-float overflow-hidden"
                                    style={{
                                        animationDelay: `${index * 0.2}s`,
                                        animationDuration: '4s'
                                    }}
                                >
                                    {/* Shimmer effect on hover */}
                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                                    <span className="relative z-10">{tag.toUpperCase()}</span>
                                </span>
                            ))}
                        </div>

                        {/* Enhanced CTA with mystical styling and animations */}
                        <div className="flex items-center justify-between">
                            <button
                                type="button"
                                aria-label={`Read ${story.title}`}
                                className="relative px-8 py-4 rounded-full bg-gradient-to-r from-purple-500/20 to-cyan-500/20 border border-white/30 hover:from-purple-500/40 hover:to-cyan-500/40 hover:border-white/50 transition-all duration-300 text-white font-light tracking-wide backdrop-blur-sm group-hover:shadow-lg group-hover:shadow-purple-500/20 animate-energy-pulse overflow-hidden"
                            >
                                {/* Ripple effect on hover */}
                                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-400/30 to-cyan-400/30 scale-0 group-hover:scale-100 transition-transform duration-500" />

                                {/* Energy particles around button */}
                                <div className="absolute -top-1 -left-1 w-2 h-2 bg-purple-400 rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-ping" />
                                <div className="absolute -bottom-1 -right-1 w-1.5 h-1.5 bg-cyan-400 rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-ping" style={{ animationDelay: '0.2s' }} />

                                <span className="relative z-10">Enter This Reality</span>
                            </button>

                            {story.id === "11" ? (
                                <div className="flex items-center gap-3 px-6 py-3 rounded-full bg-gradient-to-r from-purple-600/30 to-pink-600/30 border border-purple-400/50 backdrop-blur-sm">
                                    <div className="w-2 h-2 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 animate-pulse" />
                                    <span className="text-sm font-mono text-purple-200 tracking-wide">REALITY FRACTURES AHEAD</span>
                                    <div className="text-purple-300">→</div>
                                </div>
                            ) : (
                                <div className="text-gray-500 text-sm font-mono tracking-wide">
                                    → DIMENSIONAL SHIFT
                                </div>
                            )}
                        </div>

                        {/* Enhanced mystical corner accents with animations */}
                        <div className="absolute top-6 left-6 w-8 h-8 border-l-2 border-t-2 border-purple-400/50 opacity-0 group-hover:opacity-100 transition-all duration-500 group-hover:animate-energy-pulse" />
                        <div className="absolute top-6 right-6 w-8 h-8 border-r-2 border-t-2 border-cyan-400/50 opacity-0 group-hover:opacity-100 transition-all duration-500 group-hover:animate-energy-pulse" style={{ animationDelay: '0.1s' }} />
                        <div className="absolute bottom-6 left-6 w-8 h-8 border-l-2 border-b-2 border-pink-400/50 opacity-0 group-hover:opacity-100 transition-all duration-500 group-hover:animate-energy-pulse" style={{ animationDelay: '0.2s' }} />
                        <div className="absolute bottom-6 right-6 w-8 h-8 border-r-2 border-b-2 border-violet-400/50 opacity-0 group-hover:opacity-100 transition-all duration-500 group-hover:animate-energy-pulse" style={{ animationDelay: '0.3s' }} />

                        {/* Additional mystical elements */}
                        <div className="absolute top-1/2 left-0 w-1 h-8 bg-gradient-to-b from-transparent via-purple-400/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 animate-mystical-float" />
                        <div className="absolute top-1/2 right-0 w-1 h-8 bg-gradient-to-b from-transparent via-cyan-400/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 animate-mystical-float" style={{ animationDelay: '1s' }} />
                        <div className="absolute top-0 left-1/2 w-8 h-1 bg-gradient-to-r from-transparent via-pink-400/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 animate-mystical-float" style={{ animationDelay: '0.5s' }} />
                        <div className="absolute bottom-0 left-1/2 w-8 h-1 bg-gradient-to-r from-transparent via-violet-400/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 animate-mystical-float" style={{ animationDelay: '1.5s' }} />
                    </div>
                </div>
            </div>

            {/* Enhanced mystical hover effects */}
            <div className="absolute inset-0 pointer-events-none" style={{
                background: 'radial-gradient(500px circle at calc(var(--mx, 0.5) * 100%) calc(var(--my, 0.5) * 100%), rgba(147, 51, 234, 0.15), rgba(59, 130, 246, 0.1), transparent 70%)',
                mixBlendMode: 'screen'
            }} />
            <div className="absolute inset-0 bg-gradient-to-t from-purple-900/20 via-transparent to-blue-900/20 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

            {/* Enhanced floating particles on hover */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-3 h-3 bg-purple-400 rounded-full animate-particle-drift" style={{ '--drift-x': '40px', '--drift-y': '-50px' } as React.CSSProperties} />
                <div className="absolute top-3/4 right-1/4 w-2 h-2 bg-cyan-400 rounded-full animate-particle-drift" style={{ '--drift-x': '-35px', '--drift-y': '-45px', animationDelay: '0.5s' } as React.CSSProperties} />
                <div className="absolute bottom-1/4 left-3/4 w-2.5 h-2.5 bg-pink-400 rounded-full animate-particle-drift" style={{ '--drift-x': '30px', '--drift-y': '-40px', animationDelay: '1s' } as React.CSSProperties} />
                <div className="absolute top-1/2 right-1/2 w-1.5 h-1.5 bg-violet-400 rounded-full animate-particle-drift" style={{ '--drift-x': '-25px', '--drift-y': '-35px', animationDelay: '1.5s' } as React.CSSProperties} />
                <div className="absolute bottom-1/3 right-1/3 w-2 h-2 bg-indigo-400 rounded-full animate-particle-drift" style={{ '--drift-x': '45px', '--drift-y': '-55px', animationDelay: '2s' } as React.CSSProperties} />

                {/* Reality ripples */}
                <div className="absolute top-1/3 left-1/2 w-16 h-16 border border-purple-400/30 rounded-full animate-reality-ripple" />
                <div className="absolute bottom-1/2 right-1/3 w-12 h-12 border border-cyan-400/30 rounded-full animate-reality-ripple" style={{ animationDelay: '0.8s' }} />
            </div>
        </div>
    );
};

export default StoryCard;