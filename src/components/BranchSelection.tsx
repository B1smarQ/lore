import React from 'react';
import { generateGradientCSS } from '../utils/gradientGenerator';
import GlitchEffects from './GlitchEffects';
import ChaoticText from './ChaoticText';

interface BranchOption {
    id: string;
    title: string;
    description: string;
    tags: string[];
}

interface BranchSelectionProps {
    onBranchSelect: (branchId: string) => void;
    onBack?: () => void;
}

const branches: BranchOption[] = [
    {
        id: 'martinus',
        title: 'The Aokishiro Chronicles',
        description: 'A fox-eared commander learns that true leadership means making the hard choices while keeping your humanity intact, even when reality itself is negotiable.',
        tags: ['Military', 'Dimensional', 'Mystery']
    },
    {
        id: "museum",
        title: "The Museum Curator",
        description: "The Jester trades performance for preservation, becoming curator of unfinished stories while learning the art of institutional restraint.",
        tags: ['Museum', 'A New Beggining', 'Art']
    }

];

const BranchSelection: React.FC<BranchSelectionProps> = ({ onBranchSelect, onBack }) => {
    return (
        <div className="w-full h-full relative">
            {/* Subtle mystical background */}
            <div className="fixed inset-0">
                {/* Base gradient - much more subtle */}
                <div className="absolute inset-0 bg-gradient-to-br from-purple-900/8 via-black to-blue-900/8" />

                {/* Floating energy orbs - reduced opacity */}
                <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-gradient-to-r from-purple-500/5 to-pink-500/5 blur-3xl animate-pulse-slow" />
                <div className="absolute bottom-1/3 right-1/4 w-80 h-80 rounded-full bg-gradient-to-r from-cyan-500/3 to-blue-500/3 blur-3xl animate-float" />
                <div className="absolute top-1/2 left-1/2 w-64 h-64 rounded-full bg-gradient-to-r from-violet-500/2 to-indigo-500/2 blur-2xl animate-pulse" />

                {/* Mystical particles - much more subtle */}
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-10 left-10 w-1 h-1 bg-white/40 rounded-full animate-ping" style={{ animationDelay: '0s' }} />
                    <div className="absolute top-32 right-20 w-0.5 h-0.5 bg-purple-400/40 rounded-full animate-ping" style={{ animationDelay: '1s' }} />
                    <div className="absolute bottom-40 left-1/3 w-1 h-1 bg-cyan-400/40 rounded-full animate-ping" style={{ animationDelay: '2s' }} />
                    <div className="absolute top-1/2 right-1/3 w-0.5 h-0.5 bg-pink-400/40 rounded-full animate-ping" style={{ animationDelay: '3s' }} />
                    <div className="absolute bottom-20 right-10 w-0.5 h-0.5 bg-violet-400/40 rounded-full animate-ping" style={{ animationDelay: '4s' }} />
                </div>

                {/* Dimensional grid - barely visible */}
                <div className="absolute inset-0 opacity-2" style={{
                    backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.2) 1px, transparent 0)`,
                    backgroundSize: '120px 120px'
                }} />
            </div>

            {/* Content container */}
            <div className="relative z-10 w-full max-w-6xl mx-auto p-6 pt-32 pb-16">
                {/* Mystical header */}
                <div className="text-center mb-16">
                    <div className="relative inline-block mb-8">
                        <GlitchEffects intensity="medium" isActive={true}>
                            <h1 className="text-5xl md:text-7xl lg:text-8xl font-thin text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 tracking-wider">
                                <ChaoticText glitchChance={0.05} chaosLevel="medium">
                                    REALITY FRACTURES
                                </ChaoticText>
                            </h1>
                        </GlitchEffects>

                        {/* Decorative corner brackets */}
                        <div className="absolute -top-6 -left-6 w-12 h-12 border-l-2 border-t-2 border-purple-400/60 animate-pulse" />
                        <div className="absolute -top-6 -right-6 w-12 h-12 border-r-2 border-t-2 border-cyan-400/60 animate-pulse" style={{ animationDelay: '0.5s' }} />
                        <div className="absolute -bottom-6 -left-6 w-12 h-12 border-l-2 border-b-2 border-pink-400/60 animate-pulse" style={{ animationDelay: '1s' }} />
                        <div className="absolute -bottom-6 -right-6 w-12 h-12 border-r-2 border-b-2 border-violet-400/60 animate-pulse" style={{ animationDelay: '1.5s' }} />
                    </div>

                    <div className="space-y-4 mb-8">
                        <p className="text-gray-200 text-xl md:text-2xl leading-relaxed max-w-4xl mx-auto px-4">
                            The narrative splits into infinite dimensions. Each path leads to a different truth.
                        </p>
                        <p className="text-purple-300 text-lg md:text-xl font-light">
                            Choose wisely, for some doors cannot be unopened.
                        </p>
                    </div>

                    {/* Animated scroll indicator */}
                    <div className="hidden sm:flex items-center justify-center gap-3 text-gray-400 text-sm">
                        <div className="w-5 h-8 border-2 border-gray-400 rounded-full flex items-end justify-center pb-2">
                            <div className="w-1 h-3 bg-gradient-to-t from-purple-400 to-cyan-400 rounded-full animate-bounce" />
                        </div>
                        <span className="font-light tracking-wide">Scroll to explore all dimensions</span>
                    </div>
                </div>

                {/* Mystical branch paths */}
                <div className="space-y-12">
                    {branches.map((branch, index) => (
                        <div
                            key={branch.id}
                            onClick={() => onBranchSelect(branch.id)}
                            className="group relative cursor-pointer"
                        >
                            {/* Dimensional portal effect */}
                            <div className="relative backdrop-blur-sm bg-gradient-to-r from-white/5 via-white/10 to-white/5 border border-white/20 rounded-3xl p-8 md:p-12 shadow-2xl transform transition-all duration-500 hover:scale-[1.02] hover:shadow-purple-500/20">

                                {/* Animated background gradient */}
                                <div
                                    className="absolute inset-0 opacity-20 group-hover:opacity-40 transition-opacity duration-700"
                                    style={{ background: generateGradientCSS(`${branch.title}-${branch.id}`) }}
                                />

                                {/* Mystical border glow */}
                                <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-purple-500/0 via-purple-500/20 to-purple-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                                {/* Content */}
                                <div className="relative z-10">
                                    {/* Path number with mystical styling */}
                                    <div className="flex items-center gap-4 mb-6">
                                        <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-500/20 to-cyan-500/20 border border-white/30 flex items-center justify-center">
                                            <span className="text-white font-mono text-lg">
                                                {String(index + 1).padStart(2, '0')}
                                            </span>
                                        </div>
                                        <div className="flex-1 h-px bg-gradient-to-r from-white/30 via-white/10 to-transparent" />
                                        <span className="text-xs font-mono text-gray-400 tracking-widest">
                                            DIMENSIONAL PATH
                                        </span>
                                    </div>

                                    {/* Title with enhanced styling */}
                                    <div className="mb-6 py-3">
                                        <h3 className="text-3xl md:text-4xl font-light text-white leading-loose group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-purple-300 group-hover:to-cyan-300 transition-all duration-500" style={{ lineHeight: '1.4' }}>
                                            <ChaoticText glitchChance={0.02} chaosLevel="low">
                                                {branch.title}
                                            </ChaoticText>
                                        </h3>
                                    </div>

                                    {/* Description with better typography */}
                                    <p className="text-gray-300 text-lg md:text-xl leading-relaxed mb-8 group-hover:text-gray-200 transition-colors duration-300">
                                        {branch.description}
                                    </p>

                                    {/* Enhanced tags */}
                                    <div className="flex flex-wrap gap-3 mb-8">
                                        {branch.tags.map((tag, tagIndex) => (
                                            <span
                                                key={tagIndex}
                                                className="px-4 py-2 text-sm font-mono text-gray-300 bg-white/10 border border-white/20 rounded-full backdrop-blur-sm group-hover:bg-white/20 group-hover:text-white transition-all duration-300"
                                            >
                                                {tag.toUpperCase()}
                                            </span>
                                        ))}
                                    </div>

                                    {/* Enhanced CTA */}
                                    <div className="flex items-center justify-between">
                                        <button
                                            type="button"
                                            className="px-8 py-4 rounded-full bg-gradient-to-r from-purple-500/20 to-cyan-500/20 border border-white/30 hover:from-purple-500/40 hover:to-cyan-500/40 hover:border-white/50 transition-all duration-300 text-white font-light tracking-wide backdrop-blur-sm"
                                        >
                                            Enter This Dimension
                                        </button>

                                        <div className="text-gray-500 text-sm font-mono">
                                            → REALITY SHIFT
                                        </div>
                                    </div>
                                </div>

                                {/* Mystical corner accents */}
                                <div className="absolute top-4 left-4 w-6 h-6 border-l-2 border-t-2 border-purple-400/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                <div className="absolute top-4 right-4 w-6 h-6 border-r-2 border-t-2 border-cyan-400/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                <div className="absolute bottom-4 left-4 w-6 h-6 border-l-2 border-b-2 border-pink-400/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                <div className="absolute bottom-4 right-4 w-6 h-6 border-r-2 border-b-2 border-violet-400/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                                {/* Floating particles on hover */}
                                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                                    <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-purple-400 rounded-full animate-ping" />
                                    <div className="absolute top-3/4 right-1/4 w-1 h-1 bg-cyan-400 rounded-full animate-ping" style={{ animationDelay: '0.5s' }} />
                                    <div className="absolute bottom-1/4 left-3/4 w-1.5 h-1.5 bg-pink-400 rounded-full animate-ping" style={{ animationDelay: '1s' }} />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Enhanced back button */}
                {onBack && (
                    <div className="text-center mt-16 pt-8 border-t border-white/10">
                        <button
                            onClick={onBack}
                            className="group px-8 py-4 rounded-full bg-gradient-to-r from-white/5 to-white/10 border border-white/20 hover:from-white/10 hover:to-white/20 hover:border-white/40 transition-all duration-300 text-gray-300 hover:text-white backdrop-blur-sm"
                        >
                            <span className="flex items-center gap-3">
                                <div className="w-6 h-6 border-l-2 border-b-2 border-current transform rotate-45 group-hover:-translate-x-1 transition-transform duration-300" />
                                <span className="font-light tracking-wide">Return to the Garden of Stories</span>
                            </span>
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default BranchSelection;