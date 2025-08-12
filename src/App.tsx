import React, { useState, useEffect, useRef } from 'react';
import { stories } from './data/stories';
import StoryCard from './components/StoryCard';
import StoryModal from './components/StoryModal';
import FloatingElements from './components/FloatingElements';
import { Story } from './types';

function App() {
    const [selectedStory, setSelectedStory] = useState<Story | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isScrolling, setIsScrolling] = useState(false);
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const scrollTimeoutRef = useRef<number | null>(null);
    const animationFrameRef = useRef<number | null>(null);

    // Animation state refs
    const targetScrollLeftRef = useRef(0);
    const currentScrollLeftRef = useRef(0);
    const isAnimatingRef = useRef(false);
    const isSnappingRef = useRef(false);
    const snapStartTimeRef = useRef(0);
    const snapStartPositionRef = useRef(0);
    const snapDurationRef = useRef(800);

    const handleStoryClick = (story: Story) => {
        setSelectedStory(story);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedStory(null);
    };

    // Easing function for smooth snapping
    const easeOutCubic = (t: number): number => {
        return 1 - Math.pow(1 - t, 3);
    };

    const smoothScroll = () => {
        if (scrollContainerRef.current && Math.abs(targetScrollLeftRef.current - currentScrollLeftRef.current) > 1) {
            if (isSnappingRef.current) {
                // Smooth snapping animation
                const elapsed = Date.now() - snapStartTimeRef.current;
                const progress = Math.min(elapsed / snapDurationRef.current, 1);
                const easedProgress = easeOutCubic(progress);

                currentScrollLeftRef.current = snapStartPositionRef.current + (targetScrollLeftRef.current - snapStartPositionRef.current) * easedProgress;
                scrollContainerRef.current.scrollLeft = currentScrollLeftRef.current;

                if (progress < 1) {
                    animationFrameRef.current = requestAnimationFrame(smoothScroll);
                } else {
                    isAnimatingRef.current = false;
                    isSnappingRef.current = false;
                    scrollContainerRef.current.scrollLeft = targetScrollLeftRef.current;
                }
            } else {
                // Regular wheel scrolling - more responsive
                currentScrollLeftRef.current += (targetScrollLeftRef.current - currentScrollLeftRef.current) * 0.15;
                scrollContainerRef.current.scrollLeft = currentScrollLeftRef.current;
                animationFrameRef.current = requestAnimationFrame(smoothScroll);
            }
        } else {
            isAnimatingRef.current = false;
            isSnappingRef.current = false;
            if (scrollContainerRef.current) {
                scrollContainerRef.current.scrollLeft = targetScrollLeftRef.current;
            }
        }
    };

    // Handle horizontal scroll with mouse wheel and keyboard
    useEffect(() => {

        const handleWheel = (e: WheelEvent) => {
            if (scrollContainerRef.current && !isModalOpen) {
                e.preventDefault();
                e.stopPropagation();

                // Initialize if not set
                if (!isAnimatingRef.current) {
                    currentScrollLeftRef.current = scrollContainerRef.current.scrollLeft;
                    targetScrollLeftRef.current = currentScrollLeftRef.current;
                }

                // Temporarily disable snap scrolling
                setIsScrolling(true);

                // Convert vertical scroll to horizontal scroll with smoother increment
                const scrollAmount = e.deltaY * 1.5; // Reduced for smoother scrolling
                targetScrollLeftRef.current = Math.max(0, Math.min(
                    targetScrollLeftRef.current + scrollAmount,
                    scrollContainerRef.current.scrollWidth - scrollContainerRef.current.clientWidth
                ));

                // Start smooth animation if not already running
                if (!isAnimatingRef.current) {
                    isAnimatingRef.current = true;
                    smoothScroll();
                }

                // Clear existing timeout
                if (scrollTimeoutRef.current) {
                    clearTimeout(scrollTimeoutRef.current);
                }

                // Re-enable snap scrolling after scrolling stops
                scrollTimeoutRef.current = window.setTimeout(() => {
                    setIsScrolling(false);
                    // Snap to nearest episode with smooth animation
                    if (scrollContainerRef.current) {
                        const containerWidth = scrollContainerRef.current.clientWidth;
                        const currentIndex = Math.round(scrollContainerRef.current.scrollLeft / containerWidth);
                        const snapTarget = currentIndex * containerWidth;

                        // Only snap if we're not already at the target
                        if (Math.abs(scrollContainerRef.current.scrollLeft - snapTarget) > 5) {
                            // Initialize smooth snap animation
                            snapStartTimeRef.current = Date.now();
                            snapStartPositionRef.current = scrollContainerRef.current.scrollLeft;
                            targetScrollLeftRef.current = snapTarget;
                            isSnappingRef.current = true;

                            if (!isAnimatingRef.current) {
                                isAnimatingRef.current = true;
                                currentScrollLeftRef.current = snapStartPositionRef.current;
                                smoothScroll();
                            }
                        }
                    }
                }, 400); // Slightly longer timeout for better feel
            }
        };

        const handleKeyDown = (e: KeyboardEvent) => {
            if (!isModalOpen && scrollContainerRef.current) {
                const containerWidth = scrollContainerRef.current.clientWidth;
                const currentIndex = Math.round(scrollContainerRef.current.scrollLeft / containerWidth);

                if (e.key === 'ArrowLeft' && currentIndex > 0) {
                    e.preventDefault();
                    // Use smooth snap animation for keyboard navigation
                    const snapTarget = (currentIndex - 1) * containerWidth;
                    snapStartTimeRef.current = Date.now();
                    snapStartPositionRef.current = scrollContainerRef.current.scrollLeft;
                    targetScrollLeftRef.current = snapTarget;
                    isSnappingRef.current = true;

                    if (!isAnimatingRef.current) {
                        isAnimatingRef.current = true;
                        currentScrollLeftRef.current = snapStartPositionRef.current;
                        smoothScroll();
                    }
                } else if (e.key === 'ArrowRight' && currentIndex < stories.length - 1) {
                    e.preventDefault();
                    // Use smooth snap animation for keyboard navigation
                    const snapTarget = (currentIndex + 1) * containerWidth;
                    snapStartTimeRef.current = Date.now();
                    snapStartPositionRef.current = scrollContainerRef.current.scrollLeft;
                    targetScrollLeftRef.current = snapTarget;
                    isSnappingRef.current = true;

                    if (!isAnimatingRef.current) {
                        isAnimatingRef.current = true;
                        currentScrollLeftRef.current = snapStartPositionRef.current;
                        smoothScroll();
                    }
                }
            }
        };

        // Try multiple approaches to capture wheel events
        const container = scrollContainerRef.current;
        const body = document.body;
        const html = document.documentElement;

        if (container) {
            // Add to container first
            container.addEventListener('wheel', handleWheel, { passive: false });
        }

        // Add to body and document as fallback
        body.addEventListener('wheel', handleWheel, { passive: false });
        html.addEventListener('wheel', handleWheel, { passive: false });
        document.addEventListener('wheel', handleWheel, { passive: false });
        document.addEventListener('keydown', handleKeyDown);

        return () => {
            if (container) {
                container.removeEventListener('wheel', handleWheel);
            }
            body.removeEventListener('wheel', handleWheel);
            html.removeEventListener('wheel', handleWheel);
            document.removeEventListener('wheel', handleWheel);
            document.removeEventListener('keydown', handleKeyDown);

            // Clear timeout and animation frame on cleanup
            if (scrollTimeoutRef.current) {
                clearTimeout(scrollTimeoutRef.current);
            }
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }
        };
    }, [isModalOpen]);

    return (
        <div className="h-screen bg-gray-900 relative overflow-hidden">
            <FloatingElements />

            {/* Minimal header - top left corner only */}
            <div className="absolute top-6 left-6 z-30 pointer-events-none">
                <h1 className="text-2xl font-bold">
                    <span className="chaos-gradient bg-clip-text text-transparent">
                        Chaos Lore
                    </span>
                </h1>
            </div>

            {/* Stories Section - Full screen episodes */}
            <main className="relative z-10 h-full">
                <div
                    ref={scrollContainerRef}
                    className="flex h-full overflow-x-auto scrollbar-hide horizontal-scroll"
                    style={{ scrollBehavior: 'auto' }}
                >
                    {stories.map((story, index) => (
                        <div key={story.id} className="story-container story-blend" data-story-index={index}>
                            <StoryCard
                                story={story}
                                onClick={() => handleStoryClick(story)}
                            />
                        </div>
                    ))}
                </div>

                {/* Navigation dots */}
                <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-3 z-30 pointer-events-auto">
                    {stories.map((_, index) => (
                        <button
                            key={index}
                            className="w-4 h-4 rounded-full bg-white/30 hover:bg-white/60 transition-colors duration-300 cursor-pointer border border-white/20 hover:border-white/40"
                            onClick={() => {
                                if (scrollContainerRef.current) {
                                    const containerWidth = scrollContainerRef.current.clientWidth;
                                    const snapTarget = index * containerWidth;



                                    // Cancel any existing animation
                                    if (animationFrameRef.current) {
                                        cancelAnimationFrame(animationFrameRef.current);
                                    }

                                    // Initialize smooth snap animation using the main system
                                    snapStartTimeRef.current = Date.now();
                                    snapStartPositionRef.current = scrollContainerRef.current.scrollLeft;
                                    targetScrollLeftRef.current = snapTarget;
                                    currentScrollLeftRef.current = snapStartPositionRef.current;
                                    isSnappingRef.current = true;
                                    isAnimatingRef.current = true;
                                    snapDurationRef.current = 600; // Faster for direct navigation

                                    smoothScroll();
                                }
                            }}
                        />
                    ))}
                </div>

                {/* Scroll hint */}
                <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 z-30 pointer-events-none">
                    <p className="text-white/60 text-sm text-center">
                        Use mouse wheel or click dots to explore episodes
                    </p>
                </div>
            </main>

            {/* Story Modal */}
            <StoryModal
                story={selectedStory}
                isOpen={isModalOpen}
                onClose={handleCloseModal}
            />
        </div>
    );
}

export default App;