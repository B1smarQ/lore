import React, { useState, useEffect, useRef } from 'react';

interface ChaoticTextProps {
    children: string;
    className?: string;
    glitchChance?: number; // 0-1, probability of glitching
    chaosLevel?: 'low' | 'medium' | 'high';
}

const ChaoticText: React.FC<ChaoticTextProps> = ({
    children,
    className = '',
    glitchChance = 0.1,
    chaosLevel = 'medium'
}) => {
    const [displayText, setDisplayText] = useState(children);
    const [isGlitching, setIsGlitching] = useState(false);
    const originalText = useRef(children);

    // Chaotic characters for glitch effects
    const chaosChars = '!@#$%^&*()_+-=[]{}|;:,.<>?~`';
    const glitchChars = '█▓▒░▄▀▐▌▬▲►◄↕‼¶§▬↨↑↓→←∟↔▲▼';
    const realityChars = '∞∆∇∈∋∪∩⊂⊃⊆⊇⊕⊗⊙⊥⊰⊱⋄⋅⋆⋇⋈⋉⋊⋋⋌⋍⋎⋏';

    useEffect(() => {
        originalText.current = children;
        setDisplayText(children);
    }, [children]);

    useEffect(() => {
        const chaosIntervals = {
            low: 3000,
            medium: 2000,
            high: 1000
        };

        const interval = setInterval(() => {
            if (Math.random() < glitchChance) {
                triggerChaos();
            }
        }, chaosIntervals[chaosLevel]);

        return () => clearInterval(interval);
    }, [glitchChance, chaosLevel]);

    const triggerChaos = () => {
        setIsGlitching(true);

        const glitchTypes = ['scramble', 'replace', 'corrupt', 'reality-break'];
        const glitchType = glitchTypes[Math.floor(Math.random() * glitchTypes.length)];

        let glitchedText = originalText.current;

        switch (glitchType) {
            case 'scramble':
                glitchedText = scrambleText(originalText.current);
                break;
            case 'replace':
                glitchedText = replaceRandomChars(originalText.current, chaosChars);
                break;
            case 'corrupt':
                glitchedText = corruptText(originalText.current);
                break;
            case 'reality-break':
                glitchedText = realityBreakText(originalText.current);
                break;
        }

        setDisplayText(glitchedText);

        // Restore original text after glitch
        const restoreDelay = {
            low: 100,
            medium: 200,
            high: 400
        };

        setTimeout(() => {
            setDisplayText(originalText.current);
            setIsGlitching(false);
        }, restoreDelay[chaosLevel]);
    };

    const scrambleText = (text: string): string => {
        const chars = text.split('');
        for (let i = chars.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [chars[i], chars[j]] = [chars[j], chars[i]];
        }
        return chars.join('');
    };

    const replaceRandomChars = (text: string, replacementChars: string): string => {
        return text.split('').map(char => {
            if (char !== ' ' && Math.random() < 0.3) {
                return replacementChars[Math.floor(Math.random() * replacementChars.length)];
            }
            return char;
        }).join('');
    };

    const corruptText = (text: string): string => {
        return text.split('').map(char => {
            if (char !== ' ' && Math.random() < 0.4) {
                return glitchChars[Math.floor(Math.random() * glitchChars.length)];
            }
            return char;
        }).join('');
    };

    const realityBreakText = (text: string): string => {
        const words = text.split(' ');
        return words.map(word => {
            if (Math.random() < 0.5) {
                return realityChars[Math.floor(Math.random() * realityChars.length)].repeat(word.length);
            }
            return word;
        }).join(' ');
    };

    return (
        <span
            className={`${className} ${isGlitching ? 'animate-text-glitch' : ''}`}
            style={{
                textShadow: isGlitching ? '2px 0 #ff0000, -2px 0 #00ffff' : undefined,
                filter: isGlitching ? 'hue-rotate(90deg)' : undefined
            }}
        >
            {displayText}
        </span>
    );
};

export default ChaoticText;