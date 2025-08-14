import React, { useState, useEffect, useRef } from 'react';

interface GlitchEffectsProps {
    intensity?: 'low' | 'medium' | 'high';
    isActive?: boolean;
    children: React.ReactNode;
}

const GlitchEffects: React.FC<GlitchEffectsProps> = ({
    intensity = 'medium',
    isActive = true,
    children
}) => {
    const [isGlitching, setIsGlitching] = useState(false);
    const [glitchType, setGlitchType] = useState<'rgb' | 'static' | 'distort' | 'invert'>('rgb');
    const containerRef = useRef<HTMLDivElement>(null);

    // Random glitch triggers
    useEffect(() => {
        if (!isActive) return;

        const glitchIntervals = {
            low: 8000,    // Every 8 seconds
            medium: 5000, // Every 5 seconds  
            high: 2000    // Every 2 seconds
        };

        const interval = setInterval(() => {
            // Random chance to glitch (30% for low, 50% for medium, 80% for high)
            const glitchChance = {
                low: 0.3,
                medium: 0.5,
                high: 0.8
            };

            if (Math.random() < glitchChance[intensity]) {
                triggerGlitch();
            }
        }, glitchIntervals[intensity]);

        return () => clearInterval(interval);
    }, [intensity, isActive]);

    const triggerGlitch = () => {
        const glitchTypes: Array<'rgb' | 'static' | 'distort' | 'invert'> = ['rgb', 'static', 'distort', 'invert'];
        const randomType = glitchTypes[Math.floor(Math.random() * glitchTypes.length)];

        setGlitchType(randomType);
        setIsGlitching(true);

        // Glitch duration varies by intensity
        const duration = {
            low: 150,
            medium: 300,
            high: 500
        };

        setTimeout(() => {
            setIsGlitching(false);
        }, duration[intensity]);
    };

    const getGlitchClasses = () => {
        if (!isGlitching) return '';

        const baseClasses = 'transition-none';

        switch (glitchType) {
            case 'rgb':
                return `${baseClasses} glitch-rgb`;
            case 'static':
                return `${baseClasses} glitch-static`;
            case 'distort':
                return `${baseClasses} glitch-distort`;
            case 'invert':
                return `${baseClasses} glitch-invert`;
            default:
                return baseClasses;
        }
    };

    return (
        <div
            ref={containerRef}
            className={`relative ${getGlitchClasses()}`}
            style={{
                filter: isGlitching && glitchType === 'static' ? 'contrast(1000%) brightness(200%)' : undefined
            }}
        >
            {children}

            {/* RGB Split Effect Overlay */}
            {isGlitching && glitchType === 'rgb' && (
                <>
                    <div className="absolute inset-0 opacity-70 mix-blend-screen animate-glitch-rgb-r bg-red-500/20" />
                    <div className="absolute inset-0 opacity-70 mix-blend-screen animate-glitch-rgb-g bg-green-500/20" />
                    <div className="absolute inset-0 opacity-70 mix-blend-screen animate-glitch-rgb-b bg-blue-500/20" />
                </>
            )}

            {/* Static Noise Overlay */}
            {isGlitching && glitchType === 'static' && (
                <div className="absolute inset-0 opacity-30 animate-glitch-static bg-noise pointer-events-none" />
            )}

            {/* Distortion Lines */}
            {isGlitching && glitchType === 'distort' && (
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-1/4 left-0 right-0 h-0.5 bg-white/80 animate-glitch-line-1" />
                    <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-cyan-400/80 animate-glitch-line-2" />
                    <div className="absolute top-3/4 left-0 right-0 h-0.5 bg-red-400/80 animate-glitch-line-3" />
                </div>
            )}
        </div>
    );
};

export default GlitchEffects;