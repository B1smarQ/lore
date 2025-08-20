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
            {/* Left Edge Preview - responsive */}
            {prevStory && (
                <div className="fixed left-0 top-0 h-full w-10 sm:w-16 md:w-24 z-10 pointer-events-none">
                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-black/20 to-transparent" />

                    {/* Preview content */}
                    <div className="absolute inset-0 opacity-20 hover:opacity-40 transition-opacity duration-300">
                        <div
                            className="h-full opacity-40"
                            style={{ background: generateGradientCSS(`${prevStory.title}-${prevStory.id}`) }}
                        />
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="text-white text-center px-1 sm:px-2">
                                <div className="text-xs opacity-60 mb-1 hidden sm:block">Previous</div>
                                <div className="text-xs sm:text-sm font-medium leading-tight">
                                    <span className="block sm:hidden">←</span>
                                    <span className="hidden sm:block">
                                        {prevStory.title.length > 20 ? `${prevStory.title.substring(0, 20)}...` : prevStory.title}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Navigation button */}
                    <button
                        onClick={() => onNavigate('prev')}
                        className="absolute left-1 sm:left-2 md:left-3 top-1/2 transform -translate-y-1/2 w-8 sm:w-9 md:w-10 h-8 sm:h-9 md:h-10 bg-black/40 hover:bg-black/60 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 pointer-events-auto group z-20"
                    >
                        <ChevronLeft className="w-4 sm:w-5 md:w-6 h-4 sm:h-5 md:h-6 text-white group-hover:text-white/80" />
                    </button>

                    {/* Animated hint */}
                    <div className="absolute left-1 sm:left-2 top-1/2 transform -translate-y-1/2 pointer-events-none">
                        <div className="w-0.5 sm:w-1 h-4 sm:h-6 md:h-8 bg-white/20 rounded animate-pulse" />
                    </div>
                </div>
            )}

            {/* Right Edge Preview - responsive */}
            {nextStory && (
                <div className="fixed right-0 top-0 h-full w-10 sm:w-16 md:w-24 z-10 pointer-events-none">
                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-l from-black/40 via-black/20 to-transparent" />

                    {/* Preview content */}
                    <div className="absolute inset-0 opacity-20 hover:opacity-40 transition-opacity duration-300">
                        <div
                            className="h-full opacity-40"
                            style={{ background: generateGradientCSS(`${nextStory.title}-${nextStory.id}`) }}
                        />
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="text-white text-center px-1 sm:px-2">
                                <div className="text-xs opacity-60 mb-1 hidden sm:block">Next</div>
                                <div className="text-xs sm:text-sm font-medium leading-tight">
                                    <span className="block sm:hidden">→</span>
                                    <span className="hidden sm:block">
                                        {nextStory.title.length > 20 ? `${nextStory.title.substring(0, 20)}...` : nextStory.title}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Navigation button */}
                    <button
                        onClick={() => onNavigate('next')}
                        className="absolute right-1 sm:right-2 md:right-3 top-1/2 transform -translate-y-1/2 w-8 sm:w-9 md:w-10 h-8 sm:h-9 md:h-10 bg-black/40 hover:bg-black/60 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 pointer-events-auto group z-20"
                    >
                        <ChevronRight className="w-4 sm:w-5 md:w-6 h-4 sm:h-5 md:h-6 text-white group-hover:text-white/80" />
                    </button>

                    {/* Animated hint */}
                    <div className="absolute right-1 sm:right-2 top-1/2 transform -translate-y-1/2 pointer-events-none">
                        <div className="w-0.5 sm:w-1 h-4 sm:h-6 md:h-8 bg-white/20 rounded animate-pulse" style={{ animationDelay: '0.5s' }} />
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