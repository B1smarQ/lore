import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Story } from '../types';
import { generateGradientCSS } from '../utils/gradientGenerator';

interface EdgePreviewsProps {
    currentIndex: number;
    stories: Story[];
    onNavigate: (direction: 'prev' | 'next') => void;
}

const EdgePreviews: React.FC<EdgePreviewsProps> = ({ currentIndex, stories, onNavigate }) => {
    const prevStory = currentIndex > 0 ? stories[currentIndex - 1] : null;
    const nextStory = currentIndex < stories.length - 1 ? stories[currentIndex + 1] : null;

    return (
        <>
            {/* Left Edge Preview */}
            {prevStory && (
                <div className="fixed left-0 top-0 h-full w-32 z-20 pointer-events-none">
                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent" />

                    {/* Preview content */}
                    <div className="absolute inset-0 opacity-30 hover:opacity-60 transition-opacity duration-300">
                        <div
                            className="h-full opacity-40"
                            style={{ background: generateGradientCSS(`${prevStory.title}-${prevStory.id}`) }}
                        />
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="text-white text-center px-2">
                                <div className="text-xs opacity-60 mb-1">Previous</div>
                                <div className="text-sm font-medium leading-tight">{prevStory.title}</div>
                            </div>
                        </div>
                    </div>

                    {/* Navigation button */}
                    <button
                        onClick={() => onNavigate('prev')}
                        className="absolute left-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-black/40 hover:bg-black/60 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 pointer-events-auto group"
                    >
                        <ChevronLeft className="w-6 h-6 text-white group-hover:text-white/80" />
                    </button>

                    {/* Animated hint */}
                    <div className="absolute left-2 top-1/2 transform -translate-y-1/2 pointer-events-none">
                        <div className="w-1 h-8 bg-white/20 rounded animate-pulse" />
                    </div>
                </div>
            )}

            {/* Right Edge Preview */}
            {nextStory && (
                <div className="fixed right-0 top-0 h-full w-32 z-20 pointer-events-none">
                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-l from-black/60 via-black/30 to-transparent" />

                    {/* Preview content */}
                    <div className="absolute inset-0 opacity-30 hover:opacity-60 transition-opacity duration-300">
                        <div
                            className="h-full opacity-40"
                            style={{ background: generateGradientCSS(`${nextStory.title}-${nextStory.id}`) }}
                        />
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="text-white text-center px-2">
                                <div className="text-xs opacity-60 mb-1">Next</div>
                                <div className="text-sm font-medium leading-tight">{nextStory.title}</div>
                            </div>
                        </div>
                    </div>

                    {/* Navigation button */}
                    <button
                        onClick={() => onNavigate('next')}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-black/40 hover:bg-black/60 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 pointer-events-auto group"
                    >
                        <ChevronRight className="w-6 h-6 text-white group-hover:text-white/80" />
                    </button>

                    {/* Animated hint */}
                    <div className="absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none">
                        <div className="w-1 h-8 bg-white/20 rounded animate-pulse" style={{ animationDelay: '0.5s' }} />
                    </div>
                </div>
            )}

            {/* Bottom hint for first-time users */}
            <div className="fixed bottom-32 left-1/2 transform -translate-x-1/2 z-20 pointer-events-none">
                <div className="bg-black/40 backdrop-blur-sm rounded-full px-4 py-2 text-white/60 text-sm animate-pulse">
                    ← Scroll or use arrows to navigate →
                </div>
            </div>
        </>
    );
};

export default EdgePreviews;