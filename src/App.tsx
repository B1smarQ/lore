import { useState, useEffect, useRef } from 'react';
import { stories } from './data/stories';
import { branchStoryMap } from './data/branchStories';
import StoryCard from './components/StoryCard';
import StoryModal from './components/StoryModal';
import BranchSelection from './components/BranchSelection';
import FloatingElements from './components/FloatingElements';
// import OnboardingOverlay from './components/OnboardingOverlay';
// import EdgePreviews from './components/EdgePreviews';
import RealityManager from './components/RealityManager';
import { ArrowLeft } from 'lucide-react';
import { Story } from './types';

function App() {
    const [selectedStory, setSelectedStory] = useState<Story | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentStoryIndex, setCurrentStoryIndex] = useState(0);
    const [currentView, setCurrentView] = useState<'main' | 'branch-selection' | 'branch-story'>('main');
    const [selectedBranch, setSelectedBranch] = useState<string | null>(null);
    const [branchStoryIndex, setBranchStoryIndex] = useState(0);
    const dotsContainerRef = useRef<HTMLDivElement>(null);
    const mainScrollContainerRef = useRef<HTMLDivElement>(null);
    const branchScrollContainerRef = useRef<HTMLDivElement>(null);
    const scrollTimeoutRef = useRef<number | null>(null);

    // Dynamic ref that points to the current scroll container
    const scrollContainerRef = {
        get current() {
            const container = currentView === 'main' ? mainScrollContainerRef.current : branchScrollContainerRef.current;
            if (!container) {
                console.log('⚠️ REF WARNING:', {
                    view: currentView,
                    hasMainRef: !!mainScrollContainerRef.current,
                    hasBranchRef: !!branchScrollContainerRef.current
                });
            }
            return container;
        }
    };
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

    const handleBranchSelect = (branchId: string) => {
        setSelectedBranch(branchId);
        setBranchStoryIndex(0);
        setCurrentView('branch-story');

        // Reset scroll position when entering branch
        setTimeout(() => {
            if (scrollContainerRef.current) {
                scrollContainerRef.current.scrollLeft = 0;
                targetScrollLeftRef.current = 0;
                currentScrollLeftRef.current = 0;
            }
        }, 100);
    };

    const handleBackToMain = () => {
        setCurrentView('main');
        setSelectedBranch(null);
        setBranchStoryIndex(0);

        // Reset scroll position when returning to main
        setTimeout(() => {
            if (scrollContainerRef.current) {
                const containerWidth = scrollContainerRef.current.clientWidth;
                const targetPosition = currentStoryIndex * containerWidth;
                scrollContainerRef.current.scrollLeft = targetPosition;
                targetScrollLeftRef.current = targetPosition;
                currentScrollLeftRef.current = targetPosition;
            }
        }, 50);
    };
    const handleEdgeNavigation = (direction: 'prev' | 'next') => {
        if (currentView === 'main') {
            if (!scrollContainerRef.current) return;

            const containerWidth = scrollContainerRef.current.clientWidth;
            let newIndex;

            if (direction === 'prev') {
                newIndex = Math.max(0, currentStoryIndex - 1);
            } else {
                // If we're at story 11 (index 10) and going next, show branch selection
                if (currentStoryIndex === 10) {
                    setCurrentView('branch-selection');
                    return;
                }
                newIndex = Math.min(stories.length - 1, currentStoryIndex + 1);
            }

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
        } else if (currentView === 'branch-story' && selectedBranch && scrollContainerRef.current) {
            const branchStories = branchStoryMap[selectedBranch as keyof typeof branchStoryMap];
            const containerWidth = scrollContainerRef.current.clientWidth;

            if (direction === 'prev') {
                if (branchStoryIndex > 0) {
                    const newIndex = branchStoryIndex - 1;
                    const snapTarget = newIndex * containerWidth;

                    // Animate to new position
                    snapStartTimeRef.current = Date.now();
                    snapStartPositionRef.current = scrollContainerRef.current.scrollLeft;
                    targetScrollLeftRef.current = snapTarget;
                    currentScrollLeftRef.current = snapStartPositionRef.current;
                    isSnappingRef.current = true;
                    isAnimatingRef.current = true;
                    snapDurationRef.current = 600;

                    smoothScroll();
                    setBranchStoryIndex(newIndex);
                } else {
                    // Go back to branch selection
                    setCurrentView('branch-selection');
                }
            } else {
                if (branchStoryIndex < branchStories.length - 1) {
                    const newIndex = branchStoryIndex + 1;
                    const snapTarget = newIndex * containerWidth;

                    // Animate to new position
                    snapStartTimeRef.current = Date.now();
                    snapStartPositionRef.current = scrollContainerRef.current.scrollLeft;
                    targetScrollLeftRef.current = snapTarget;
                    currentScrollLeftRef.current = snapStartPositionRef.current;
                    isSnappingRef.current = true;
                    isAnimatingRef.current = true;
                    snapDurationRef.current = 600;

                    smoothScroll();
                    setBranchStoryIndex(newIndex);
                }
            }
        }
    };

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
            // Don't update state during animations to prevent interference
            if (isAnimatingRef.current || isSnappingRef.current) {

                return;
            }

            if (scrollContainerRef.current) {
                const containerWidth = scrollContainerRef.current.clientWidth;
                const newIndex = Math.round(scrollContainerRef.current.scrollLeft / containerWidth);



                if (currentView === 'main') {
                    if (newIndex !== currentStoryIndex && newIndex >= 0 && newIndex < stories.length) {
                        setCurrentStoryIndex(newIndex);
                        scrollDotsToActive(newIndex);
                    }
                } else if (currentView === 'branch-story' && selectedBranch) {
                    const branchStories = branchStoryMap[selectedBranch as keyof typeof branchStoryMap];
                    if (newIndex !== branchStoryIndex && newIndex >= 0 && newIndex < branchStories.length) {
                        setBranchStoryIndex(newIndex);
                    }
                }
            }
        };

        // Only attach scroll listener for main and branch-story views
        if (currentView === 'main' || currentView === 'branch-story') {
            const container = scrollContainerRef.current;
            if (container) {
                container.addEventListener('scroll', updateCurrentIndex);
                return () => container.removeEventListener('scroll', updateCurrentIndex);
            }
        }
    }, [currentStoryIndex, branchStoryIndex, currentView, selectedBranch]);

    // Handle view transitions - only clean up animations when switching views
    useEffect(() => {
        if (currentView === 'main') {
            // Clean up any ongoing animations when view changes
            if (isAnimatingRef.current) {
                console.log('🧹 VIEW CHANGE: Cleaning up animations');
                isAnimatingRef.current = false;
                isSnappingRef.current = false;
                if (animationFrameRef.current) {
                    cancelAnimationFrame(animationFrameRef.current);
                    animationFrameRef.current = null;
                }
            }
        }
    }, [currentView]);

    // Easing function for smooth snapping
    const easeOutCubic = (t: number): number => {
        return 1 - Math.pow(1 - t, 3);
    };

    const smoothScroll = () => {
        const container = scrollContainerRef.current;

        if (!container) {
            console.log('❌ SMOOTH SCROLL: No container available');
            isAnimatingRef.current = false;
            isSnappingRef.current = false;
            return;
        }

        const distance = Math.abs(targetScrollLeftRef.current - currentScrollLeftRef.current);
        console.log('🎬 SMOOTH SCROLL:', {
            target: targetScrollLeftRef.current,
            current: currentScrollLeftRef.current,
            distance,
            isSnapping: isSnappingRef.current,
            containerScrollLeft: container.scrollLeft
        });

        if (distance > 1) {
            if (isSnappingRef.current) {
                // Smooth snapping animation
                const now = Date.now();
                const elapsed = now - snapStartTimeRef.current;
                const progress = Math.min(elapsed / snapDurationRef.current, 1);
                const easedProgress = easeOutCubic(progress);

                currentScrollLeftRef.current = snapStartPositionRef.current + (targetScrollLeftRef.current - snapStartPositionRef.current) * easedProgress;

                console.log('📍 ANIMATION FRAME:', {
                    progress: (progress * 100).toFixed(1) + '%',
                    scrollLeft: currentScrollLeftRef.current.toFixed(1),
                    target: targetScrollLeftRef.current
                });

                container.scrollLeft = currentScrollLeftRef.current;

                if (progress < 1) {
                    animationFrameRef.current = requestAnimationFrame(smoothScroll);
                } else {
                    console.log('✅ ANIMATION COMPLETE');
                    // Clean up animation state
                    isAnimatingRef.current = false;
                    isSnappingRef.current = false;
                    if (animationFrameRef.current) {
                        cancelAnimationFrame(animationFrameRef.current);
                        animationFrameRef.current = null;
                    }
                    container.scrollLeft = targetScrollLeftRef.current;

                    // Don't update state after keyboard navigation - it's already updated
                    // This prevents double state updates that could cause issues
                }
            } else {
                // Regular wheel scrolling - more responsive
                currentScrollLeftRef.current += (targetScrollLeftRef.current - currentScrollLeftRef.current) * 0.15;
                container.scrollLeft = currentScrollLeftRef.current;
                animationFrameRef.current = requestAnimationFrame(smoothScroll);
            }
        } else {
            console.log('🏁 ANIMATION FINISHED - Distance too small');
            // Clean up animation state
            isAnimatingRef.current = false;
            isSnappingRef.current = false;
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
                animationFrameRef.current = null;
            }
            container.scrollLeft = targetScrollLeftRef.current;
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
            if (!isModalOpen) {
                // Only prevent default for main and branch-story views
                // Allow natural scrolling for branch-selection
                if (currentView !== 'branch-selection') {
                    e.preventDefault();
                    e.stopPropagation();
                }

                if (currentView === 'main' && scrollContainerRef.current) {

                    // Prevent wheel scrolling if already animating (with timeout safety)
                    if (isAnimatingRef.current) {


                        // Safety mechanism: if animation has been running too long, force reset
                        const animationAge = Date.now() - snapStartTimeRef.current;
                        if (animationAge > 2000) { // 2 seconds max

                            isAnimatingRef.current = false;
                            isSnappingRef.current = false;
                            if (animationFrameRef.current) {
                                cancelAnimationFrame(animationFrameRef.current);
                                animationFrameRef.current = null;
                            }
                        } else {
                            return;
                        }
                    }

                    const containerWidth = scrollContainerRef.current.clientWidth;
                    const currentIndex = currentStoryIndex;

                    // Determine scroll direction and target story
                    let targetIndex = currentIndex;
                    if (e.deltaY > 0) {
                        // Scrolling right/forward
                        if (currentIndex === 10) {
                            // At story 11, go to branch selection

                            setCurrentView('branch-selection');
                            return;
                        } else if (currentIndex < stories.length - 1) {
                            targetIndex = currentIndex + 1;
                        }
                    } else if (e.deltaY < 0) {
                        // Scrolling left/backward
                        if (currentIndex > 0) {
                            targetIndex = currentIndex - 1;
                        }
                    }



                    // Only animate if we're moving to a different story
                    if (targetIndex !== currentIndex) {
                        const snapTarget = targetIndex * containerWidth;



                        // Don't update state immediately - wait for animation to complete
                        // setCurrentStoryIndex(targetIndex);

                        // Start smooth animation


                        snapStartTimeRef.current = Date.now();
                        snapStartPositionRef.current = scrollContainerRef.current.scrollLeft;
                        targetScrollLeftRef.current = snapTarget;
                        currentScrollLeftRef.current = snapStartPositionRef.current;
                        isSnappingRef.current = true;
                        isAnimatingRef.current = true;
                        snapDurationRef.current = 600;

                        smoothScroll();
                    } else {

                    }
                } else if (currentView === 'branch-selection') {
                    // Let branch selection handle its own scrolling naturally
                    // No wheel event interference - users can scroll through branches normally
                    return;
                } else if (currentView === 'branch-story' && selectedBranch && scrollContainerRef.current) {
                    // Prevent wheel scrolling if already animating
                    if (isAnimatingRef.current) return;

                    const containerWidth = scrollContainerRef.current.clientWidth;
                    // Use actual scroll position instead of state for more accurate navigation
                    const actualIndex = Math.round(scrollContainerRef.current.scrollLeft / containerWidth);
                    const branchStories = branchStoryMap[selectedBranch as keyof typeof branchStoryMap];

                    console.log('🌿 BRANCH NAVIGATION:', {
                        actualScrollIndex: actualIndex,
                        stateIndex: branchStoryIndex,
                        scrollLeft: scrollContainerRef.current.scrollLeft,
                        containerWidth,
                        direction: e.deltaY > 0 ? 'forward' : 'backward'
                    });

                    // Determine scroll direction and target story
                    let targetIndex = actualIndex;
                    if (e.deltaY > 0) {
                        // Scrolling right/forward
                        if (actualIndex < branchStories.length - 1) {
                            targetIndex = actualIndex + 1;
                        }
                    } else if (e.deltaY < 0) {
                        // Scrolling left/backward
                        if (actualIndex === 0) {
                            // At beginning, go back to branch selection
                            console.log('🔙 RETURNING TO BRANCH SELECTION');
                            setCurrentView('branch-selection');
                            return;
                        } else if (actualIndex > 0) {
                            targetIndex = actualIndex - 1;
                        }
                    }

                    // Only animate if we're moving to a different story
                    if (targetIndex !== actualIndex) {
                        const snapTarget = targetIndex * containerWidth;

                        console.log('🎬 BRANCH ANIMATION:', {
                            from: actualIndex,
                            to: targetIndex,
                            fromPos: scrollContainerRef.current.scrollLeft,
                            toPos: snapTarget
                        });

                        // Don't update state immediately - wait for animation to complete
                        // setBranchStoryIndex(targetIndex);

                        // Start smooth animation
                        snapStartTimeRef.current = Date.now();
                        snapStartPositionRef.current = scrollContainerRef.current.scrollLeft;
                        targetScrollLeftRef.current = snapTarget;
                        currentScrollLeftRef.current = snapStartPositionRef.current;
                        isSnappingRef.current = true;
                        isAnimatingRef.current = true;
                        snapDurationRef.current = 600;

                        smoothScroll();
                    }
                }
            }
        };

        const handleKeyDown = (e: KeyboardEvent) => {
            if (!isModalOpen) {
                if (currentView === 'main' && scrollContainerRef.current) {
                    const containerWidth = scrollContainerRef.current.clientWidth;
                    // Use state index instead of calculated index for more reliable behavior
                    const currentIndex = currentStoryIndex;

                    if (e.key === 'ArrowLeft' && currentIndex > 0) {
                        e.preventDefault();
                        const newIndex = currentIndex - 1;
                        const snapTarget = newIndex * containerWidth;

                        console.log('⌨️ KEYBOARD LEFT:', { currentIndex, newIndex, snapTarget });

                        // Stop any existing animation
                        if (isAnimatingRef.current && animationFrameRef.current) {
                            cancelAnimationFrame(animationFrameRef.current);
                            animationFrameRef.current = null;
                        }

                        // Update state immediately
                        setCurrentStoryIndex(newIndex);

                        // Start new animation with a small delay to ensure state is updated
                        setTimeout(() => {
                            if (scrollContainerRef.current) {
                                snapStartTimeRef.current = Date.now();
                                snapStartPositionRef.current = scrollContainerRef.current.scrollLeft;
                                targetScrollLeftRef.current = snapTarget;
                                currentScrollLeftRef.current = snapStartPositionRef.current;
                                isSnappingRef.current = true;
                                isAnimatingRef.current = true;
                                snapDurationRef.current = 600;

                                console.log('🚀 STARTING ANIMATION:', {
                                    startTime: snapStartTimeRef.current,
                                    startPos: snapStartPositionRef.current,
                                    target: targetScrollLeftRef.current,
                                    duration: snapDurationRef.current
                                });

                                smoothScroll();
                            }
                        }, 10);
                    } else if (e.key === 'ArrowRight') {
                        e.preventDefault();
                        if (currentIndex === 10) {
                            // At story 11, go to branch selection
                            setCurrentView('branch-selection');
                        } else if (currentIndex < stories.length - 1) {
                            const newIndex = currentIndex + 1;
                            const snapTarget = newIndex * containerWidth;

                            console.log('⌨️ KEYBOARD RIGHT:', { currentIndex, newIndex, snapTarget });

                            // Stop any existing animation
                            if (isAnimatingRef.current && animationFrameRef.current) {
                                cancelAnimationFrame(animationFrameRef.current);
                                animationFrameRef.current = null;
                            }

                            // Update state immediately
                            setCurrentStoryIndex(newIndex);

                            // Start new animation with a small delay to ensure state is updated
                            setTimeout(() => {
                                if (scrollContainerRef.current) {
                                    snapStartTimeRef.current = Date.now();
                                    snapStartPositionRef.current = scrollContainerRef.current.scrollLeft;
                                    targetScrollLeftRef.current = snapTarget;
                                    currentScrollLeftRef.current = snapStartPositionRef.current;
                                    isSnappingRef.current = true;
                                    isAnimatingRef.current = true;
                                    snapDurationRef.current = 600;

                                    console.log('🚀 STARTING ANIMATION:', {
                                        startTime: snapStartTimeRef.current,
                                        startPos: snapStartPositionRef.current,
                                        target: targetScrollLeftRef.current,
                                        duration: snapDurationRef.current
                                    });

                                    smoothScroll();
                                }
                            }, 10);
                        }
                    }
                } else if (currentView === 'branch-selection') {
                    // No keyboard shortcuts - users must use the back button
                    // This prevents accidental navigation and makes the UI more predictable
                    return;
                } else if (currentView === 'branch-story' && selectedBranch && scrollContainerRef.current) {
                    const containerWidth = scrollContainerRef.current.clientWidth;
                    const branchStories = branchStoryMap[selectedBranch as keyof typeof branchStoryMap];
                    const currentIndex = branchStoryIndex;

                    if (e.key === 'ArrowLeft') {
                        e.preventDefault();
                        if (currentIndex > 0) {
                            const newIndex = currentIndex - 1;
                            const snapTarget = newIndex * containerWidth;

                            console.log('⌨️ BRANCH KEYBOARD LEFT:', { currentIndex, newIndex, snapTarget });

                            // Stop any existing animation
                            if (isAnimatingRef.current && animationFrameRef.current) {
                                cancelAnimationFrame(animationFrameRef.current);
                                animationFrameRef.current = null;
                            }

                            // Update state immediately
                            setBranchStoryIndex(newIndex);

                            // Start new animation with a small delay to ensure state is updated
                            setTimeout(() => {
                                if (scrollContainerRef.current) {
                                    snapStartTimeRef.current = Date.now();
                                    snapStartPositionRef.current = scrollContainerRef.current.scrollLeft;
                                    targetScrollLeftRef.current = snapTarget;
                                    currentScrollLeftRef.current = snapStartPositionRef.current;
                                    isSnappingRef.current = true;
                                    isAnimatingRef.current = true;
                                    snapDurationRef.current = 600;

                                    console.log('🚀 BRANCH LEFT STARTING ANIMATION:', {
                                        startTime: snapStartTimeRef.current,
                                        startPos: snapStartPositionRef.current,
                                        target: targetScrollLeftRef.current,
                                        duration: snapDurationRef.current
                                    });

                                    smoothScroll();
                                }
                            }, 10);
                        } else {
                            // Go back to branch selection
                            setCurrentView('branch-selection');
                        }
                    } else if (e.key === 'ArrowRight') {
                        e.preventDefault();
                        if (currentIndex < branchStories.length - 1) {
                            const newIndex = currentIndex + 1;
                            const snapTarget = newIndex * containerWidth;

                            console.log('⌨️ BRANCH KEYBOARD RIGHT:', { currentIndex, newIndex, snapTarget });

                            // Stop any existing animation
                            if (isAnimatingRef.current && animationFrameRef.current) {
                                cancelAnimationFrame(animationFrameRef.current);
                                animationFrameRef.current = null;
                            }

                            // Update state immediately
                            setBranchStoryIndex(newIndex);

                            // Start new animation with a small delay to ensure state is updated
                            setTimeout(() => {
                                if (scrollContainerRef.current) {
                                    snapStartTimeRef.current = Date.now();
                                    snapStartPositionRef.current = scrollContainerRef.current.scrollLeft;
                                    targetScrollLeftRef.current = snapTarget;
                                    currentScrollLeftRef.current = snapStartPositionRef.current;
                                    isSnappingRef.current = true;
                                    isAnimatingRef.current = true;
                                    snapDurationRef.current = 600;

                                    console.log('🚀 BRANCH RIGHT STARTING ANIMATION:', {
                                        startTime: snapStartTimeRef.current,
                                        startPos: snapStartPositionRef.current,
                                        target: targetScrollLeftRef.current,
                                        duration: snapDurationRef.current
                                    });

                                    smoothScroll();
                                }
                            }, 10);
                        }
                    } else if (e.key === 'Escape') {
                        e.preventDefault();
                        setCurrentView('branch-selection');
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
    }, [isModalOpen, currentView, currentStoryIndex]);

    // Cleanup effect for component unmount
    useEffect(() => {
        return () => {

            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }
            if (scrollTimeoutRef.current) {
                clearTimeout(scrollTimeoutRef.current);
            }
        };
    }, []);

    return (
        <RealityManager chaosLevel="medium">
            <div className={`h-screen relative ${currentView === 'branch-selection' ? 'overflow-y-auto' : 'overflow-hidden'}`}>
                <div className="absolute inset-0 bg-[#08090a]" />
                <FloatingElements />

                <header className="absolute left-0 right-0 top-0 z-30 border-b border-white/10 bg-[#08090a]/80 px-5 py-4 backdrop-blur-xl sm:px-8">
                    <div className="mx-auto flex max-w-7xl items-center justify-between gap-5">
                        <div className="flex min-w-0 items-center gap-4">
                            <h1 className="text-base font-semibold tracking-normal text-zinc-50 sm:text-lg">
                                Chaos Lore
                            </h1>
                            <div className="hidden h-5 w-px bg-white/10 sm:block" />
                            <span className="hidden truncate text-sm text-zinc-400 sm:inline">
                                {currentView === 'main' && 'Dimensional Stories'}
                                {currentView === 'branch-selection' && 'Reality Fractures'}
                                {currentView === 'branch-story' && selectedBranch && `${selectedBranch.charAt(0).toUpperCase() + selectedBranch.slice(1)} Dimension`}
                            </span>
                        </div>

                        <div className="flex-shrink-0 font-mono text-xs tracking-[0.18em] text-zinc-400">
                            {currentView === 'main' && (
                                <div className="flex items-center gap-3">
                                    <div className="h-1.5 w-1.5 rounded-full bg-teal-300" />
                                    <span>{String(currentStoryIndex + 1).padStart(2, '0')} / {String(stories.length).padStart(2, '0')}</span>
                                </div>
                            )}
                            {currentView === 'branch-selection' && (
                                <div className="flex items-center gap-3">
                                    <div className="h-1.5 w-1.5 rounded-full bg-amber-300" />
                                    <span>CHOOSE PATH</span>
                                </div>
                            )}
                            {currentView === 'branch-story' && selectedBranch && (
                                <div className="flex items-center gap-3">
                                    <div className="h-1.5 w-1.5 rounded-full bg-teal-300" />
                                    <span>{String(branchStoryIndex + 1).padStart(2, '0')} / {String(branchStoryMap[selectedBranch as keyof typeof branchStoryMap].length).padStart(2, '0')}</span>
                                </div>
                            )}
                        </div>
                    </div>
                </header>

                {/* Main Content */}
                <main className="relative z-10 h-full">
                    {currentView === 'main' && (
                        <div
                            ref={mainScrollContainerRef}
                            className="flex h-full overflow-x-auto scrollbar-hide horizontal-scroll"
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
                    )}

                    {currentView === 'branch-selection' && (
                        <BranchSelection
                            onBranchSelect={handleBranchSelect}
                            onBack={handleBackToMain}
                        />
                    )}

                    {currentView === 'branch-story' && selectedBranch && (
                        <>
                            <div
                                ref={branchScrollContainerRef}
                                className="flex h-full overflow-x-auto scrollbar-hide horizontal-scroll"
                                onTouchStart={handleTouchStart}
                                onTouchMove={handleTouchMove}
                                onTouchEnd={handleTouchEnd}
                            >
                                {branchStoryMap[selectedBranch as keyof typeof branchStoryMap].map((story, index) => (
                                    <div key={story.id} className="story-container story-blend" data-story-index={index}>
                                        <StoryCard
                                            story={story}
                                            onClick={() => handleStoryClick(story)}
                                        />
                                    </div>
                                ))}
                            </div>

                            {/* Back to branch selection button */}
                            <div className="absolute top-20 sm:top-24 left-6 z-40">
                                <button
                                    onClick={() => setCurrentView('branch-selection')}
                                    className="inline-flex h-11 items-center gap-3 rounded-full border border-white/10 bg-[#101113]/80 px-4 text-sm text-zinc-300 backdrop-blur-xl transition hover:border-white/20 hover:bg-white/[0.08] hover:text-white focus:outline-none focus:ring-2 focus:ring-white/25"
                                >
                                    <ArrowLeft size={17} />
                                    Choose different path
                                </button>
                            </div>
                        </>
                    )}

                    {/* Edge previews removed for cleaner look */}

                    {/* Modern navigation */}
                    {currentView !== 'branch-selection' && (
                        <div className="pointer-events-auto absolute bottom-5 left-1/2 z-30 w-full -translate-x-1/2 px-4 sm:bottom-7">
                            <div className="mx-auto flex w-full max-w-3xl items-center justify-center gap-5 rounded-full border border-white/10 bg-[#101113]/80 px-4 py-3 backdrop-blur-xl">
                                {/* Progress bar */}
                                <div className="hidden items-center gap-4 sm:flex">
                                    <div className="relative h-px w-36 bg-white/10 sm:w-52">
                                        <div
                                            className="absolute left-0 top-0 h-full bg-zinc-100 transition-all duration-500 ease-out"
                                            style={{
                                                width: currentView === 'main'
                                                    ? `${((currentStoryIndex + 1) / stories.length) * 100}%`
                                                    : selectedBranch
                                                        ? `${((branchStoryIndex + 1) / branchStoryMap[selectedBranch as keyof typeof branchStoryMap].length) * 100}%`
                                                        : '0%'
                                            }}
                                        />
                                    </div>
                                    <span className="font-mono text-xs text-zinc-500">
                                        {currentView === 'main' && `${String(currentStoryIndex + 1).padStart(2, '0')}/${String(stories.length).padStart(2, '0')}`}
                                        {currentView === 'branch-story' && selectedBranch && `${String(branchStoryIndex + 1).padStart(2, '0')}/${String(branchStoryMap[selectedBranch as keyof typeof branchStoryMap].length).padStart(2, '0')}`}
                                    </span>
                                </div>

                                {/* Dots container */}
                                <div className="relative mx-auto max-w-[72vw] sm:max-w-sm md:max-w-md">
                                    <div
                                        ref={dotsContainerRef}
                                        className="dots-container relative flex items-center gap-2 overflow-x-auto scrollbar-hide px-2 py-2"
                                    >
                                        {/* Gradient fades */}
                                        <div className="dots-fade-left absolute left-0 top-0 h-full w-6" style={{ background: 'linear-gradient(to right, rgba(16,17,19,0.95), transparent)' }} />
                                        <div className="dots-fade-right absolute right-0 top-0 h-full w-6" style={{ background: 'linear-gradient(to left, rgba(16,17,19,0.95), transparent)' }} />

                                        {currentView === 'main' && stories.map((_, index) => (
                                            <button
                                                key={index}
                                                className={`navigation-dot h-2.5 w-2.5 flex-shrink-0 cursor-pointer rounded-full border transition-all duration-300 ${index === currentStoryIndex
                                                    ? index === 10
                                                        ? 'scale-125 border-amber-300 bg-amber-300'
                                                        : 'scale-125 border-zinc-100 bg-zinc-100'
                                                    : index === 10
                                                        ? 'border-amber-300/30 bg-amber-300/20 hover:border-amber-300/70'
                                                        : 'border-white/15 bg-white/10 hover:border-white/40'
                                                    }`}
                                                aria-label={`Go to episode ${String(index + 1).padStart(2, '0')}: ${stories[index].title}${index === 10 ? ' (Reality Fractures Available)' : ''}`}
                                                title={`Go to ${stories[index].title}${index === 10 ? ' (Reality Fractures Available)' : ''}`}
                                                onClick={() => {
                                                    console.log('🔘 DOT CLICKED:', index);
                                                    if (scrollContainerRef.current) {
                                                        const containerWidth = scrollContainerRef.current.clientWidth;
                                                        const snapTarget = index * containerWidth;
                                                        const currentPos = scrollContainerRef.current.scrollLeft;

                                                        console.log('📍 SCROLL INFO:', {
                                                            currentPos,
                                                            snapTarget,
                                                            containerWidth,
                                                            difference: Math.abs(snapTarget - currentPos)
                                                        });

                                                        // If we're already at the target, don't animate
                                                        if (Math.abs(snapTarget - currentPos) < 10) {
                                                            console.log('✅ Already at target position');
                                                            setCurrentStoryIndex(index);
                                                            return;
                                                        }

                                                        // Update state immediately
                                                        setCurrentStoryIndex(index);

                                                        // Try direct scroll first to test
                                                        console.log('🚀 DIRECT SCROLL TEST');
                                                        scrollContainerRef.current.scrollTo({
                                                            left: snapTarget,
                                                            behavior: 'smooth'
                                                        });
                                                    } else {
                                                        console.log('❌ NO SCROLL CONTAINER');
                                                    }
                                                }}
                                            />
                                        ))}

                                        {/* Enhanced branch indicator dot */}
                                        {currentView === 'main' && (
                                            <button
                                                className="navigation-dot h-2.5 w-2.5 flex-shrink-0 cursor-pointer rounded-full border border-amber-300 bg-amber-300 transition-all duration-300 hover:scale-125"
                                                aria-label="Access reality fractures"
                                                title="Click to access reality fractures"
                                                onClick={() => setCurrentView('branch-selection')}
                                            />
                                        )}

                                        {currentView === 'branch-story' && selectedBranch && branchStoryMap[selectedBranch as keyof typeof branchStoryMap].map((_, index) => (
                                            <button
                                                key={index}
                                                className={`navigation-dot h-2.5 w-2.5 flex-shrink-0 cursor-pointer rounded-full border transition-all duration-300 ${index === branchStoryIndex
                                                    ? 'scale-125 border-zinc-100 bg-zinc-100'
                                                    : 'border-white/15 bg-white/10 hover:border-white/40'
                                                    }`}
                                                aria-label={`Go to dimensional story ${String(index + 1).padStart(2, '0')}`}
                                                onClick={() => {
                                                    if (scrollContainerRef.current) {
                                                        const containerWidth = scrollContainerRef.current.clientWidth;
                                                        const snapTarget = index * containerWidth;

                                                        // Cancel any existing animation
                                                        if (animationFrameRef.current) {
                                                            cancelAnimationFrame(animationFrameRef.current);
                                                        }

                                                        // Update state immediately
                                                        setBranchStoryIndex(index);

                                                        // Initialize smooth snap animation
                                                        snapStartTimeRef.current = Date.now();
                                                        snapStartPositionRef.current = scrollContainerRef.current.scrollLeft;
                                                        targetScrollLeftRef.current = snapTarget;
                                                        currentScrollLeftRef.current = snapStartPositionRef.current;
                                                        isSnappingRef.current = true;
                                                        isAnimatingRef.current = true;
                                                        snapDurationRef.current = 600;

                                                        smoothScroll();
                                                    }
                                                }}
                                            />
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Navigation hints - hidden for branch-selection to prevent overlap */}
                    {currentView !== 'branch-selection' && (
                        <div className="pointer-events-none absolute bottom-20 left-1/2 z-30 -translate-x-1/2 sm:bottom-24">
                            <p className="px-4 text-center text-xs text-zinc-500 sm:text-sm">
                                {currentView === 'main' && (
                                    <>
                                        <span className="hidden sm:inline">Use mouse wheel or arrow keys · after story 11, choose your path</span>
                                        <span className="sm:hidden">Swipe or tap dots · story 11 unlocks paths</span>
                                    </>
                                )}
                                {currentView === 'branch-story' && (
                                    <>
                                        <span className="hidden sm:inline">Use arrow keys to navigate · press Esc to return to path selection</span>
                                        <span className="sm:hidden">Swipe to navigate</span>
                                    </>
                                )}
                            </p>
                        </div>
                    )}
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
