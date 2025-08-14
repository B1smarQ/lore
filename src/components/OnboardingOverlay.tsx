import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Mouse, Keyboard } from 'lucide-react';

interface OnboardingOverlayProps {
    isVisible: boolean;
    onComplete: () => void;
}

const OnboardingOverlay: React.FC<OnboardingOverlayProps> = ({ isVisible, onComplete }) => {
    const [step, setStep] = useState(0);
    const [isAnimating, setIsAnimating] = useState(false);

    const steps = [
        {
            title: "Welcome to Chaos Lore",
            subtitle: "Stories of the Unbound",
            description: "Experience tales that bend reality itself",
            icon: null,
            animation: "fade-in"
        },
        {
            title: "Navigate the Stories",
            subtitle: "Multiple ways to explore",
            description: "Use your mouse wheel to scroll horizontally",
            icon: <Mouse className="w-12 h-12 text-white animate-pulse" />,
            animation: "wheel-demo"
        },
        {
            title: "Or Use Arrow Keys",
            subtitle: "Keyboard navigation",
            description: "Press ← → arrow keys to jump between episodes",
            icon: <Keyboard className="w-12 h-12 text-white animate-bounce" />,
            animation: "keyboard-demo"
        },
        {
            title: "Ready to Begin?",
            subtitle: "The chaos awaits",
            description: "Click anywhere to start your journey",
            icon: null,
            animation: "final"
        }
    ];

    useEffect(() => {
        if (!isVisible) return;

        const timer = setTimeout(() => {
            if (step < steps.length - 1) {
                setIsAnimating(true);
                setTimeout(() => {
                    setStep(step + 1);
                    setIsAnimating(false);
                }, 300);
            }
        }, step === 0 ? 2000 : 3000); // First step shorter

        return () => clearTimeout(timer);
    }, [step, isVisible]);

    const handleSkip = () => {
        setIsAnimating(true);
        setTimeout(onComplete, 300);
    };

    const handleComplete = () => {
        setIsAnimating(true);
        setTimeout(onComplete, 300);
    };

    if (!isVisible) return null;

    const currentStep = steps[step];

    return (
        <div className={`fixed inset-0 z-50 flex items-center justify-center transition-all duration-500 ${isAnimating ? 'opacity-0' : 'opacity-100'
            }`}>
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/90 backdrop-blur-sm" />

            {/* Animated background elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-32 h-32 rounded-full bg-gradient-to-r from-purple-500/20 to-pink-500/20 blur-xl animate-float" />
                <div className="absolute bottom-1/4 right-1/4 w-24 h-24 rounded-full bg-gradient-to-r from-cyan-500/20 to-blue-500/20 blur-xl animate-pulse-slow" />
                <div className="absolute top-1/2 right-1/3 w-16 h-16 rounded-full bg-gradient-to-r from-green-500/20 to-emerald-500/20 blur-xl animate-float" style={{ animationDelay: '2s' }} />
            </div>

            {/* Content */}
            <div className="relative text-center max-w-2xl px-8">
                {/* Step indicator */}
                <div className="flex justify-center gap-2 mb-8">
                    {steps.map((_, index) => (
                        <div
                            key={index}
                            className={`w-2 h-2 rounded-full transition-all duration-300 ${index === step ? 'bg-white w-8' : 'bg-white/30'
                                }`}
                        />
                    ))}
                </div>

                {/* Icon */}
                {currentStep.icon && (
                    <div className="flex justify-center mb-6">
                        {currentStep.icon}
                    </div>
                )}

                {/* Text content */}
                <h1 className="text-4xl font-bold text-white mb-4">
                    <span className="chaos-gradient bg-clip-text text-transparent">
                        {currentStep.title}
                    </span>
                </h1>

                <h2 className="text-xl text-gray-300 mb-6">
                    {currentStep.subtitle}
                </h2>

                <p className="text-gray-400 text-lg mb-8 leading-relaxed">
                    {currentStep.description}
                </p>

                {/* Navigation demo animations */}
                {currentStep.animation === 'wheel-demo' && (
                    <div className="flex justify-center items-center gap-4 mb-8">
                        <ChevronLeft className="w-8 h-8 text-white/60 animate-pulse" />
                        <div className="text-white/80 text-sm">Scroll horizontally</div>
                        <ChevronRight className="w-8 h-8 text-white/60 animate-pulse" />
                    </div>
                )}

                {currentStep.animation === 'keyboard-demo' && (
                    <div className="flex justify-center items-center gap-4 mb-8">
                        <div className="flex gap-2">
                            <div className="px-3 py-2 bg-white/10 rounded border border-white/20 text-white text-sm animate-pulse">←</div>
                            <div className="px-3 py-2 bg-white/10 rounded border border-white/20 text-white text-sm animate-pulse" style={{ animationDelay: '0.5s' }}>→</div>
                        </div>
                    </div>
                )}

                {/* Action buttons */}
                <div className="flex justify-center gap-4">
                    {step < steps.length - 1 ? (
                        <button
                            onClick={handleSkip}
                            className="px-6 py-3 text-white/60 hover:text-white transition-colors duration-300"
                        >
                            Skip Tutorial
                        </button>
                    ) : (
                        <button
                            onClick={handleComplete}
                            className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-300 transform hover:scale-105"
                        >
                            Begin Journey
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default OnboardingOverlay;