import { useState, useEffect, useRef } from 'react';
import { stories } from './data/stories';
import StoryCard from './components/StoryCard';
import StoryModal from './components/StoryModal';
import FloatingElements from './components/FloatingElements';
import OnboardingOverlay from './components/OnboardingOverlay';
import EdgePreviews from './components/EdgePreviews';
import RealityManager from './components/RealityManager';
import GlitchEffects from './components/GlitchEffects';
import { Story } from './types';

function App() {
    const [selectedStory, setSelectedStory] = useState<Story | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [_, setIsScrolling] = useState(false);
    const [showOnboarding, setShowOnboarding] = useState(true);
    const [currentStoryIndex, setCurrentStoryIndex] = useState(0);
    const dotsContainerRef = useRef<HTMLDivElement>(null);
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

    const handleOnboardingComplete = () => {
        setShowOnboarding(false);
        // Store in localStorage to not show again
        localStorage.setItem('chaos-lore-onboarding-seen', 'true');
    };

    const handleEdgeNavigation = (direction: 'prev' | 'next') => {
        if (!scrollContainerRef.current) return;

        const containerWidth = scrollContainerRef.current.clientWidth;
        const newIndex = direction === 'prev'
            ? Math.max(0, currentStoryIndex - 1)
            : Math.min(stories.length - 1, currentStoryIndex + 1);

        if (newIndex !== currentStoryIndex) {
            // Use the smooth snap animation
            snapStartTimeRef.current = Date.now();
            snapStartPositionRef.current = scrollContainerRef.current.scrollLeft;
            targetScrollLeftRef.current = newIndex * containerWidth;
            currentScrollLeftRef.current = snapStartPositionRef.current;
            isSnappingRef.current = true;
            isAnimatingRef.current = true;
            snapDurationRef.current = 600;

            smoothScroll();
            setCurrentStoryIndex(newIndex);
        }
    };

    // Check if user has seen onboarding before
    useEffect(() => {
        const hasSeenOnboarding = localStorage.getItem('chaos-lore-onboarding-seen');
        if (hasSeenOnboarding) {
            setShowOnboarding(false);
        }
    }, []);

    // Function to scroll dots container to keep active dot visible
    const scrollDotsToActive = (index: number) => {
        if (dotsContainerRef.current) {
            const dotWidth = 16; // Approximate width including gap
            const containerWidth = dotsContainerRef.current.clientWidth;
            const scrollLeft = dotsContainerRef.current.scrollLeft;
            const dotPosition = index * dotWidth;

            // Check if dot is outside visible area
            if (dotPosition < scrollLeft || dotPosition > scrollLeft + containerWidth - dotWidth) {
                dotsContainerRef.current.scrollTo({
                    left: Math.max(0, dotPosition - containerWidth / 2),
                    behavior: 'smooth'
                });
            }
        }
    };

    // Track current story index based on scroll position
    useEffect(() => {
        const updateCurrentIndex = () => {
            if (scrollContainerRef.current) {
                const containerWidth = scrollContainerRef.current.clientWidth;
                const newIndex = Math.round(scrollContainerRef.current.scrollLeft / containerWidth);
                if (newIndex !== currentStoryIndex && newIndex >= 0 && newIndex < stories.length) {
                    setCurrentStoryIndex(newIndex);
                    scrollDotsToActive(newIndex);
                }
            }
        };

        const container = scrollContainerRef.current;
        if (container) {
            container.addEventListener('scroll', updateCurrentIndex);
            return () => container.removeEventListener('scroll', updateCurrentIndex);
        }
    }, [currentStoryIndex]);

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

    // Touch handling for mobile swipe
    const touchStartRef = useRef<{ x: number; y: number } | null>(null);
    const touchEndRef = useRef<{ x: number; y: number } | null>(null);

    const handleTouchStart = (e: React.TouchEvent) => {
        touchStartRef.current = {
            x: e.touches[0].clientX,
            y: e.touches[0].clientY
        };
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        touchEndRef.current = {
            x: e.touches[0].clientX,
            y: e.touches[0].clientY
        };
    };

    const handleTouchEnd = () => {
        if (!touchStartRef.current || !touchEndRef.current) return;

        const deltaX = touchStartRef.current.x - touchEndRef.current.x;
        const deltaY = touchStartRef.current.y - touchEndRef.current.y;

        // Only handle horizontal swipes (ignore vertical scrolling)
        if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 50) {
            if (deltaX > 0 && currentStoryIndex < stories.length - 1) {
                // Swipe left - go to next story
                handleEdgeNavigation('next');
            } else if (deltaX < 0 && currentStoryIndex > 0) {
                // Swipe right - go to previous story
                handleEdgeNavigation('prev');
            }
        }

        touchStartRef.current = null;
        touchEndRef.current = null;
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
        <RealityManager chaosLevel="medium">
            <div className="h-screen bg-gray-900 relative overflow-hidden">
                <FloatingElements />

                {/* Onboarding Overlay */}
                <OnboardingOverlay
                    isVisible={showOnboarding}
                    onComplete={handleOnboardingComplete}
                />

                {/* Edge Previews */}
                {!showOnboarding && !isModalOpen && (
                    <EdgePreviews
                        currentIndex={currentStoryIndex}
                        stories={stories}
                        onNavigate={handleEdgeNavigation}
                    />
                )}

                {/* Responsive header */}
                <div className="absolute top-4 sm:top-6 left-4 sm:left-6 z-30 pointer-events-none">
                    <GlitchEffects intensity="low" isActive={!showOnboarding}>
                        <h1 className="text-lg sm:text-xl md:text-2xl font-bold">
                            <span className="chaos-gradient bg-clip-text text-transparent">
                                <span className="hidden sm:inline">Chaos Lore</span>
                                <span className="sm:hidden">Chaos</span>
                            </span>
                        </h1>
                    </GlitchEffects>
                </div>

                {/* Stories Section - Full screen episodes */}
                <main className="relative z-10 h-full">
                    <div
                        ref={scrollContainerRef}
                        className="flex h-full overflow-x-auto scrollbar-hide horizontal-scroll"
                        style={{ scrollBehavior: 'auto' }}
                        onTouchStart={handleTouchStart}
                        onTouchMove={handleTouchMove}
                        onTouchEnd={handleTouchEnd}
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

                    {/* Navigation dots - scrollable */}
                    <div className="absolute bottom-4 sm:bottom-6 md:bottom-8 left-1/2 transform -translate-x-1/2 z-30 pointer-events-auto">
                        <div className="max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl">
                            <div
                                ref={dotsContainerRef}
                                className="dots-container flex gap-3 sm:gap-4 overflow-x-auto scrollbar-hide px-4 py-2 -mx-4"
                            >
                                {stories.map((_, index) => (
                                    <button
                                        key={index}
                                        className={`navigation-dot flex-shrink-0 w-3 sm:w-4 h-3 sm:h-4 rounded-full cursor-pointer ${index === currentStoryIndex
                                            ? 'bg-white scale-125'
                                            : 'bg-white/30 hover:bg-white/60'
                                            }`}
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
                        </div>


                    </div>

                    {/* Scroll hint - responsive */}
                    <div className="absolute bottom-16 sm:bottom-20 left-1/2 transform -translate-x-1/2 z-30 pointer-events-none">
                        <p className="text-white/60 text-xs sm:text-sm text-center px-4">
                            <span className="hidden sm:inline">Use mouse wheel or click dots to explore episodes</span>
                            <span className="sm:hidden">Swipe or tap dots to explore</span>
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
        </RealityManager>
    );
}

export default App;