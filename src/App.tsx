import { useState, useEffect, useRef } from 'react';
import { stories } from './data/stories';
import StoryCard from './components/StoryCard';
import StoryModal from './components/StoryModal';
import FloatingElements from './components/FloatingElements';
// import OnboardingOverlay from './components/OnboardingOverlay';
// import EdgePreviews from './components/EdgePreviews';
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

    // const handleOnboardingComplete = () => {
    //     setShowOnboarding(false);
    //     localStorage.setItem('chaos-lore-onboarding-seen', 'true');
    // };

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

                if (!isAnimatingRef.current) {
                    currentScrollLeftRef.current = scrollContainerRef.current.scrollLeft;
                    targetScrollLeftRef.current = currentScrollLeftRef.current;
                }

                setIsScrolling(true);

                const scrollAmount = e.deltaY * 1.5;
                targetScrollLeftRef.current = Math.max(0, Math.min(
                    targetScrollLeftRef.current + scrollAmount,
                    scrollContainerRef.current.scrollWidth - scrollContainerRef.current.clientWidth
                ));

                if (!isAnimatingRef.current) {
                    isAnimatingRef.current = true;
                    smoothScroll();
                }

                if (scrollTimeoutRef.current) {
                    clearTimeout(scrollTimeoutRef.current);
                }

                scrollTimeoutRef.current = window.setTimeout(() => {
                    setIsScrolling(false);
                    if (scrollContainerRef.current) {
                        const containerWidth = scrollContainerRef.current.clientWidth;
                        const currentIndex = Math.round(scrollContainerRef.current.scrollLeft / containerWidth);
                        const snapTarget = currentIndex * containerWidth;

                        if (Math.abs(scrollContainerRef.current.scrollLeft - snapTarget) > 5) {
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
                }, 400);
            }
        };

        const handleKeyDown = (e: KeyboardEvent) => {
            if (!isModalOpen && scrollContainerRef.current) {
                const containerWidth = scrollContainerRef.current.clientWidth;
                const currentIndex = Math.round(scrollContainerRef.current.scrollLeft / containerWidth);

                if (e.key === 'ArrowLeft' && currentIndex > 0) {
                    e.preventDefault();
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

        const container = scrollContainerRef.current;
        const body = document.body;
        const html = document.documentElement;

        if (container) {
            container.addEventListener('wheel', handleWheel, { passive: false });
        }
        body.addEventListener('wheel', handleWheel, { passive: false });
        html.addEventListener('wheel', handleWheel, { passive: false });
        document.addEventListener('wheel', handleWheel, { passive: false });
        document.addEventListener('keydown', handleKeyDown);

        return () => {
            if (container) {
                container.removeEventListener('wheel', handleWheel as EventListener);
            }
            body.removeEventListener('wheel', handleWheel as EventListener);
            html.removeEventListener('wheel', handleWheel as EventListener);
            document.removeEventListener('wheel', handleWheel as EventListener);
            document.removeEventListener('keydown', handleKeyDown as EventListener);

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
            <div className="h-screen bg-black relative overflow-hidden">
                {/* Ambient floating elements for subtle depth */}
                <FloatingElements />
                {/* Subtle background pattern */}
                <div className="absolute inset-0 opacity-5">
                    <div className="absolute inset-0" style={{
                        backgroundImage: `radial-gradient(circle at 25% 25%, #ffffff 1px, transparent 1px),
                                         radial-gradient(circle at 75% 75%, #ffffff 1px, transparent 1px)`,
                        backgroundSize: '50px 50px'
                    }} />
                </div>

                {/* Onboarding removed for minimal UI */}

                {/* Modern header */}
                <header className="absolute top-0 left-0 right-0 z-30 p-6 sm:p-8">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <GlitchEffects intensity="low" isActive={!showOnboarding}>
                                <h1 className="text-xl sm:text-2xl font-light tracking-wide text-white">
                                    CHAOS LORE
                                </h1>
                            </GlitchEffects>
                            <div className="hidden sm:block w-px h-6 bg-gray-600" />
                            <span className="hidden sm:inline text-sm text-gray-400 font-light">
                                Stories of the Unbound
                            </span>
                        </div>

                        {/* Episode counter */}
                        <div className="text-sm text-gray-400 font-mono">
                            {String(currentStoryIndex + 1).padStart(2, '0')} / {String(stories.length).padStart(2, '0')}
                        </div>
                    </div>
                </header>

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

                    {/* Edge previews removed for cleaner look */}

                    {/* Modern navigation */}
                    <div className="absolute bottom-6 sm:bottom-8 left-1/2 transform -translate-x-1/2 z-30 pointer-events-auto w-full px-4">
                        <div className="flex items-center justify-center space-x-6 w-full">
                            {/* Progress bar */}
                            <div className="hidden sm:flex items-center space-x-4">
                                <div className="w-32 sm:w-48 h-px bg-white/20 relative">
                                    <div
                                        className="absolute left-0 top-0 h-full bg-white transition-all duration-500 ease-out"
                                        style={{ width: `${((currentStoryIndex + 1) / stories.length) * 100}%` }}
                                    />
                                </div>
                                <span className="text-xs font-mono text-gray-400">
                                    {String(currentStoryIndex + 1).padStart(2, '0')}/{String(stories.length).padStart(2, '0')}
                                </span>
                            </div>

                            {/* Dots container */}
                            <div className="max-w-[75vw] sm:max-w-sm md:max-w-md relative mx-auto">
                                <div
                                    ref={dotsContainerRef}
                                    className="dots-container relative flex gap-2 overflow-x-auto scrollbar-hide px-2 py-2"
                                >
                                    {/* Gradient fades */}
                                    <div className="dots-fade-left absolute left-0 top-0 h-full w-6" style={{ background: 'linear-gradient(to right, rgba(0,0,0,0.6), transparent)' }} />
                                    <div className="dots-fade-right absolute right-0 top-0 h-full w-6" style={{ background: 'linear-gradient(to left, rgba(0,0,0,0.6), transparent)' }} />
                                    {stories.map((_, index) => (
                                        <button
                                            key={index}
                                            className={`navigation-dot flex-shrink-0 w-2 h-2 cursor-pointer transition-all duration-300 ${index === currentStoryIndex
                                                ? 'bg-white scale-150'
                                                : 'bg-white/30 hover:bg-white/60'
                                                }`}
                                            aria-label={`Go to episode ${String(index + 1).padStart(2, '0')}: ${stories[index].title}`}
                                            title={`Go to ${stories[index].title}`}
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
                                <span className="hidden sm:inline">Use mouse wheel or click dots</span>
                                <span className="sm:hidden">Swipe or tap dots</span>
                            </p>
                        </div>
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