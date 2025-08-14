import React, { useState, useCallback, useRef } from 'react';
import RealityCrack from './RealityCrack';

interface RealityManagerProps {
    children: React.ReactNode;
    chaosLevel?: 'low' | 'medium' | 'high';
}

interface CrackInstance {
    id: number;
    x: number;
    y: number;
}

const RealityManager: React.FC<RealityManagerProps> = ({ children, chaosLevel = 'medium' }) => {
    const [cracks, setCracks] = useState<CrackInstance[]>([]);
    const [isScreenShaking, setIsScreenShaking] = useState(false);
    const crackIdCounter = useRef(0);

    const createRealityCrack = useCallback((x: number, y: number) => {
        const newCrack: CrackInstance = {
            id: crackIdCounter.current++,
            x,
            y
        };

        setCracks(prev => [...prev, newCrack]);

        // Trigger screen shake for high chaos
        if (chaosLevel === 'high') {
            setIsScreenShaking(true);
            setTimeout(() => setIsScreenShaking(false), 500);
        }
    }, [chaosLevel]);

    const removeCrack = useCallback((id: number) => {
        setCracks(prev => prev.filter(crack => crack.id !== id));
    }, []);

    const handleClick = useCallback(() => {
        // Random chance to create reality crack on click
        const crackChance = {
            low: 0.1,
            medium: 0.2,
            high: 0.4
        };

        if (Math.random() < crackChance[chaosLevel]) {
            //createRealityCrack(e.clientX, e.clientY);
        }
    }, [chaosLevel, createRealityCrack]);

    return (
        <div
            className={`relative ${isScreenShaking ? 'screen-shake' : ''}`}
            onClick={handleClick}
        >
            {children}

            {/* Reality Cracks */}
            {cracks.map(crack => (
                <RealityCrack
                    key={crack.id}
                    x={crack.x}
                    y={crack.y}
                    onComplete={() => removeCrack(crack.id)}
                />
            ))}
        </div>
    );
};

export default RealityManager;