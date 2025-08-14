import React, { useState, useEffect } from 'react';

interface RealityCrackProps {
    x: number;
    y: number;
    onComplete?: () => void;
}

const RealityCrack: React.FC<RealityCrackProps> = ({ x, y, onComplete }) => {
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(false);
            onComplete?.();
        }, 2000);

        return () => clearTimeout(timer);
    }, [onComplete]);

    if (!isVisible) return null;

    return (
        <div
            className="fixed pointer-events-none z-50"
            style={{ left: x - 50, top: y - 50 }}
        >
            {/* Main crack */}
            <svg
                width="100"
                height="100"
                viewBox="0 0 100 100"
                className="animate-reality-crack"
            >
                <defs>
                    <filter id="glow">
                        <feGaussianBlur stdDeviation="2" result="coloredBlur" />
                        <feMerge>
                            <feMergeNode in="coloredBlur" />
                            <feMergeNode in="SourceGraphic" />
                        </feMerge>
                    </filter>
                </defs>

                {/* Crack lines */}
                <path
                    d="M50,20 L45,35 L52,50 L48,65 L50,80 M45,35 L30,40 M52,50 L70,45 M48,65 L35,70"
                    stroke="rgba(255,255,255,0.8)"
                    strokeWidth="1"
                    fill="none"
                    filter="url(#glow)"
                    className="animate-crack-draw"
                />
                <path
                    d="M50,20 L45,35 L52,50 L48,65 L50,80 M45,35 L30,40 M52,50 L70,45 M48,65 L35,70"
                    stroke="rgba(0,255,255,0.6)"
                    strokeWidth="0.5"
                    fill="none"
                    className="animate-crack-draw"
                    style={{ animationDelay: '0.1s' }}
                />
            </svg>

            {/* Particle effects */}
            <div className="absolute inset-0">
                {[...Array(8)].map((_, i) => (
                    <div
                        key={i}
                        className="absolute w-1 h-1 bg-white rounded-full animate-crack-particle"
                        style={{
                            left: `${45 + Math.random() * 10}%`,
                            top: `${45 + Math.random() * 10}%`,
                            animationDelay: `${i * 0.1}s`,
                            animationDuration: `${1 + Math.random()}s`
                        }}
                    />
                ))}
            </div>

            {/* Reality distortion ripple */}
            <div className="absolute inset-0 rounded-full border border-white/30 animate-reality-ripple" />
            <div className="absolute inset-2 rounded-full border border-cyan-400/20 animate-reality-ripple" style={{ animationDelay: '0.2s' }} />
            <div className="absolute inset-4 rounded-full border border-purple-400/20 animate-reality-ripple" style={{ animationDelay: '0.4s' }} />
        </div>
    );
};

export default RealityCrack;