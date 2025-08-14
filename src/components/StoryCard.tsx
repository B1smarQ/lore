import React from 'react';
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

    return (
        <div
            onClick={onClick}
            className="group relative w-screen h-screen flex-shrink-0 bg-gray-800 overflow-hidden cursor-pointer transform transition-all duration-500 hover:scale-[1.02]"
            style={{
                background: `linear-gradient(90deg, 
                    rgba(31, 41, 55, 0.8) 0%, 
                    rgb(31, 41, 55) 5%, 
                    rgb(31, 41, 55) 95%, 
                    rgba(31, 41, 55, 0.8) 100%)`
            }}
        >
            {/* Gradient background */}
            <div
                className="absolute inset-0 opacity-30 group-hover:opacity-40 transition-opacity duration-500"
                style={{ background: gradientCSS }}
            />

            {/* Large background pattern */}
            <div className="absolute inset-0 opacity-5">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-white blur-3xl animate-pulse-slow" />
                <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-white blur-3xl animate-float" />
            </div>

            {/* Random color splashes - larger and more prominent */}
            <div className="absolute top-20 right-20 w-8 h-8 rounded-full bg-gradient-to-r from-pink-500 to-violet-500 animate-pulse-slow opacity-60" />
            <div className="absolute bottom-32 left-20 w-6 h-6 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 animate-float opacity-70" />
            <div className="absolute top-1/2 right-1/3 w-4 h-4 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 animate-pulse opacity-50" />
            <div className="absolute top-1/3 left-1/2 w-5 h-5 rounded-full bg-gradient-to-r from-green-400 to-emerald-500 animate-float opacity-60" style={{ animationDelay: '2s' }} />

            {/* Episode indicator - top right corner */}
            <div className="absolute top-8 right-8 px-4 py-2 bg-black/40 backdrop-blur-sm rounded-full border border-white/20">
                <span className="text-white/80 text-sm font-medium">Episode {story.id}</span>
            </div>

            {/* Content - fully centered */}
            <div className="relative h-full flex items-center justify-center p-16">
                <div className="text-center max-w-4xl">
                    <GlitchEffects intensity="medium" isActive={true}>
                        <h3 className="text-5xl font-bold text-white mb-6 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-gray-300 transition-all duration-500 leading-tight">
                            <ChaoticText glitchChance={0.15} chaosLevel="medium">
                                {story.title}
                            </ChaoticText>
                        </h3>
                    </GlitchEffects>
                    <p className="text-gray-200 text-lg leading-relaxed mb-8 max-w-2xl mx-auto">
                        {story.excerpt}
                    </p>

                    <div className="flex flex-wrap gap-3 justify-center mb-8">
                        {story.tags.map((tag, index) => (
                            <span
                                key={index}
                                className="px-4 py-2 text-sm bg-white/10 text-white rounded-full border border-white/20 backdrop-blur-sm group-hover:bg-white/20 group-hover:border-white/30 transition-all duration-300"
                            >
                                {tag}
                            </span>
                        ))}
                    </div>

                    {/* Click to read indicator */}
                    <div className="opacity-60 group-hover:opacity-100 transition-opacity duration-300">
                        <p className="text-white/80 text-base">Click to read the story</p>
                        <div className="mt-3 w-10 h-10 mx-auto border-2 border-white/40 rounded-full flex items-center justify-center animate-pulse">
                            <div className="w-0 h-0 border-l-4 border-l-white/60 border-t-2 border-t-transparent border-b-2 border-b-transparent ml-1"></div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Hover effect overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        </div>
    );
};

export default StoryCard;