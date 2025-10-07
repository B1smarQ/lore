import React, { useEffect, useRef, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { X } from 'lucide-react';
import { Story } from '../types';
import { generateGradientCSS } from '../utils/gradientGenerator';
import ChaoticText from './ChaoticText';
import GlitchEffects from './GlitchEffects';

interface StoryModalProps {
    story: Story | null;
    isOpen: boolean;
    onClose: () => void;
}

const StoryModal: React.FC<StoryModalProps> = ({ story, isOpen, onClose }) => {
    if (!isOpen || !story) return null;

    const dialogRef = useRef<HTMLDivElement>(null);
    const closeButtonRef = useRef<HTMLButtonElement>(null);

    const hasChapters = (story.chapters?.length ?? 0) > 0;
    const isLongForm = hasChapters; // Only treat as long-form when chapters exist
    const [selectedChapterId, setSelectedChapterId] = useState<string | undefined>(undefined);

    const getDisplayedContent = (): string => {
        if (!isLongForm) return story.content || '';
        const chapters = story.chapters || [];
        const selected = chapters.find(c => c.id === selectedChapterId);
        return selected ? selected.content : '';
    };



    // Trap focus and handle ESC to close
    useEffect(() => {
        if (!isOpen) return;

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                e.preventDefault();
                onClose();
            }

            if (e.key === 'Tab' && dialogRef.current) {
                const focusable = dialogRef.current.querySelectorAll<HTMLElement>(
                    'a[href], button, textarea, input, select, [tabindex]:not([tabindex="-1"])'
                );
                const first = focusable[0];
                const last = focusable[focusable.length - 1];
                if (!first || !last) return;

                if (e.shiftKey && document.activeElement === first) {
                    e.preventDefault();
                    last.focus();
                } else if (!e.shiftKey && document.activeElement === last) {
                    e.preventDefault();
                    first.focus();
                }
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        // Focus the close button initially
        closeButtonRef.current?.focus();
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, onClose]);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-label={story.title}>
            {/* Mystical Backdrop */}
            <div
                className="absolute inset-0 backdrop-blur-sm"
                onClick={onClose}
                style={{
                    background: 'radial-gradient(circle at 30% 20%, rgba(147, 51, 234, 0.15) 0%, rgba(79, 70, 229, 0.1) 25%, rgba(6, 182, 212, 0.08) 50%, transparent 70%)'
                }}
            />

            {/* Floating Energy Orbs */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                {[...Array(6)].map((_, i) => (
                    <div
                        key={i}
                        className="absolute rounded-full opacity-10 animate-pulse"
                        style={{
                            width: `${Math.random() * 40 + 15}px`,
                            height: `${Math.random() * 40 + 15}px`,
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            background: `radial-gradient(circle, ${i % 2 === 0 ? 'rgba(147, 51, 234, 0.3)' : 'rgba(6, 182, 212, 0.3)'} 0%, transparent 70%)`,
                            animationDelay: `${Math.random() * 3}s`,
                            animationDuration: `${3 + Math.random() * 2}s`
                        }}
                    />
                ))}
            </div>

            {/* Dimensional Grid Pattern */}
            <div
                className="absolute inset-0 pointer-events-none opacity-5"
                style={{
                    backgroundImage: `
                        linear-gradient(rgba(147, 51, 234, 0.15) 1px, transparent 1px),
                        linear-gradient(90deg, rgba(147, 51, 234, 0.15) 1px, transparent 1px),
                        linear-gradient(rgba(6, 182, 212, 0.1) 1px, transparent 1px),
                        linear-gradient(90deg, rgba(6, 182, 212, 0.1) 1px, transparent 1px)
                    `,
                    backgroundSize: '60px 60px, 60px 60px, 20px 20px, 20px 20px',
                    backgroundPosition: '0 0, 0 0, 0 0, 0 0'
                }}
            />

            {/* Mystical Particles */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                {[...Array(8)].map((_, i) => (
                    <div
                        key={i}
                        className="absolute w-0.5 h-0.5 bg-cyan-400 rounded-full opacity-20 animate-ping"
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            animationDelay: `${Math.random() * 4}s`,
                            animationDuration: `${2 + Math.random() * 3}s`
                        }}
                    />
                ))}
            </div>

            {/* Modal */}
            <div ref={dialogRef} className="relative w-full max-w-4xl max-h-[90vh] rounded-2xl border border-purple-500/20 shadow-[0_0_30px_rgba(147,51,234,0.15),0_0_60px_rgba(6,182,212,0.1)] overflow-hidden backdrop-blur-xl bg-gradient-to-br from-purple-900/10 via-indigo-900/8 to-cyan-900/10">
                <GlitchEffects>
                    <div></div>
                </GlitchEffects>
                {/* Mystical Header */}
                <div className="relative p-6 border-b border-purple-500/20">
                    {/* Mystical Background */}
                    <div
                        className="absolute inset-0"
                        style={{
                            background: `
                                linear-gradient(135deg, rgba(147, 51, 234, 0.08) 0%, rgba(79, 70, 229, 0.06) 50%, rgba(6, 182, 212, 0.04) 100%),
                                ${generateGradientCSS(`${story.title}-${story.id}`)}
                            `
                        }}
                    />

                    {/* Dark overlay for better readability */}
                    <div className="absolute inset-0 bg-black/60" />

                    {/* Energy Ripples */}
                    <div className="absolute inset-0 overflow-hidden">
                        {[...Array(2)].map((_, i) => (
                            <div
                                key={i}
                                className="absolute rounded-full border border-purple-400/5 animate-ping"
                                style={{
                                    width: `${80 + i * 40}px`,
                                    height: `${80 + i * 40}px`,
                                    left: '20%',
                                    top: '50%',
                                    transform: 'translate(-50%, -50%)',
                                    animationDelay: `${i * 0.8}s`,
                                    animationDuration: '4s'
                                }}
                            />
                        ))}
                    </div>

                    <div className="relative flex items-start md:items-center justify-between">
                        <div className="hidden md:block">
                            <div
                                className="text-2xl md:text-3xl font-bold mb-3"
                                style={{
                                    color: '#ffffff',
                                    textShadow: '0 0 15px rgba(147, 51, 234, 0.6), 0 0 30px rgba(6, 182, 212, 0.3), 2px 2px 4px rgba(0, 0, 0, 0.9)'
                                }}
                            >
                                <ChaoticText className="">
                                    {story.title}
                                </ChaoticText>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {story.tags.map((tag, index) => (
                                    <span
                                        key={index}
                                        className="px-3 py-1.5 text-xs md:text-sm rounded-full border backdrop-blur-sm transition-all duration-300 hover:scale-105"
                                        style={{
                                            background: 'linear-gradient(135deg, rgba(147, 51, 234, 0.1), rgba(6, 182, 212, 0.1))',
                                            borderColor: 'rgba(147, 51, 234, 0.25)',
                                            color: '#c084fc',
                                            boxShadow: '0 0 5px rgba(147, 51, 234, 0.2)'
                                        }}
                                    >
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 rounded-full transition-all duration-300 border hover:scale-110"
                            style={{
                                background: 'linear-gradient(135deg, rgba(147, 51, 234, 0.1), rgba(6, 182, 212, 0.1))',
                                borderColor: 'rgba(147, 51, 234, 0.25)',
                                color: '#c084fc',
                                boxShadow: '0 0 8px rgba(147, 51, 234, 0.2)'
                            }}
                            aria-label="Close"
                            ref={closeButtonRef}
                        >
                            <X size={24} />
                        </button>
                    </div>

                    {/* Mystical Sheen */}
                    <div
                        className="pointer-events-none absolute inset-0"
                        style={{
                            background: 'radial-gradient(600px circle at 30% -20%, rgba(147, 51, 234, 0.08), transparent 60%)'
                        }}
                    />
                </div>

                {/* Mystical Content */}
                <div className="px-6 pt-6 pb-20 max-h-[60vh] overflow-y-auto scroll-smooth">
                    {/* Floating Particles in Content Area */}
                    <div className="absolute inset-0 pointer-events-none overflow-hidden">
                        {[...Array(5)].map((_, i) => (
                            <div
                                key={i}
                                className="absolute w-0.5 h-0.5 bg-purple-400 rounded-full opacity-15 animate-pulse"
                                style={{
                                    left: `${Math.random() * 100}%`,
                                    top: `${Math.random() * 100}%`,
                                    animationDelay: `${Math.random() * 3}s`,
                                    animationDuration: `${2 + Math.random() * 2}s`,
                                    boxShadow: '0 0 2px rgba(147, 51, 234, 0.3)'
                                }}
                            />
                        ))}
                    </div>

                    <div className="prose prose-invert max-w-none markdown-content relative">
                        {isLongForm && (
                            <div className="mb-6 p-4 rounded-xl border border-purple-500/15 backdrop-blur-sm" style={{
                                background: 'linear-gradient(135deg, rgba(147, 51, 234, 0.05), rgba(6, 182, 212, 0.03))'
                            }}>
                                <p className="text-sm mb-3" style={{ color: '#9ca3af' }}>Select a chapter to begin:</p>
                                <div className="flex flex-wrap gap-2">
                                    {(story.chapters || []).map(ch => (
                                        <button
                                            key={ch.id}
                                            onClick={() => setSelectedChapterId(ch.id)}
                                            className={`px-3 py-2 rounded-lg border text-xs md:text-sm transition-all duration-300 hover:scale-105 ${selectedChapterId === ch.id
                                                ? 'border-purple-400/50 text-white shadow-lg'
                                                : 'border-purple-500/20 hover:border-purple-400/40'
                                                }`}
                                            style={{
                                                background: selectedChapterId === ch.id
                                                    ? 'linear-gradient(135deg, rgba(147, 51, 234, 0.15), rgba(6, 182, 212, 0.1))'
                                                    : 'linear-gradient(135deg, rgba(147, 51, 234, 0.05), rgba(6, 182, 212, 0.03))',
                                                color: selectedChapterId === ch.id ? '#ffffff' : '#9ca3af',
                                                boxShadow: selectedChapterId === ch.id ? '0 0 8px rgba(147, 51, 234, 0.2)' : 'none'
                                            }}
                                        >
                                            {ch.title}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                        <ReactMarkdown
                            components={{
                                h1: ({ children }) => (
                                    <h1
                                        className="text-3xl md:text-4xl font-bold mb-6"
                                        style={{
                                            background: 'linear-gradient(135deg, #c084fc, #a78bfa, #06b6d4)',
                                            WebkitBackgroundClip: 'text',
                                            WebkitTextFillColor: 'transparent',
                                            backgroundClip: 'text',
                                            textShadow: '0 0 10px rgba(147, 51, 234, 0.3)'
                                        }}
                                    >
                                        {children}
                                    </h1>
                                ),
                                h2: ({ children }) => (
                                    <h2
                                        className="text-2xl font-semibold mt-8 mb-4"
                                        style={{
                                            background: 'linear-gradient(135deg, #9ca3af, #06b6d4)',
                                            WebkitBackgroundClip: 'text',
                                            WebkitTextFillColor: 'transparent',
                                            backgroundClip: 'text'
                                        }}
                                    >
                                        {children}
                                    </h2>
                                ),
                                h3: ({ children }) => (
                                    <h3
                                        className="text-xl font-medium mt-6 mb-3"
                                        style={{ color: '#9ca3af' }}
                                    >
                                        {children}
                                    </h3>
                                ),
                                p: ({ children }) => (
                                    <p
                                        className="leading-relaxed mb-4"
                                        style={{
                                            color: '#d1d5db',
                                            lineHeight: '1.8'
                                        }}
                                    >
                                        {children}
                                    </p>
                                ),
                                strong: ({ children }) => (
                                    <strong
                                        className="font-semibold"
                                        style={{
                                            background: 'linear-gradient(135deg, #c084fc, #9ca3af)',
                                            WebkitBackgroundClip: 'text',
                                            WebkitTextFillColor: 'transparent',
                                            backgroundClip: 'text'
                                        }}
                                    >
                                        {children}
                                    </strong>
                                ),
                                em: ({ children }) => (
                                    <em
                                        className="italic"
                                        style={{ color: '#9ca3af' }}
                                    >
                                        {children}
                                    </em>
                                ),
                                ul: ({ children }) => (
                                    <ul
                                        className="list-disc list-outside ml-6 mb-4 space-y-2"
                                        style={{ color: '#d1d5db' }}
                                    >
                                        {children}
                                    </ul>
                                ),
                                ol: ({ children }) => (
                                    <ol
                                        className="list-decimal list-outside ml-6 mb-4 space-y-2"
                                        style={{ color: '#d1d5db' }}
                                    >
                                        {children}
                                    </ol>
                                ),
                                li: ({ children }) => (
                                    <li
                                        className="leading-relaxed pl-1"
                                        style={{ color: '#d1d5db' }}
                                    >
                                        {children}
                                    </li>
                                ),
                                blockquote: ({ children }) => (
                                    <blockquote
                                        className="border-l-4 pl-4 italic my-4 p-3 rounded-r-lg backdrop-blur-sm"
                                        style={{
                                            borderColor: 'rgba(147, 51, 234, 0.25)',
                                            background: 'linear-gradient(135deg, rgba(147, 51, 234, 0.05), rgba(6, 182, 212, 0.03))',
                                            color: '#9ca3af'
                                        }}
                                    >
                                        {children}
                                    </blockquote>
                                ),
                            }}
                        >
                            {getDisplayedContent() || (isLongForm ? '*Please choose a chapter above.*' : '')}
                        </ReactMarkdown>
                    </div>
                </div>

                {/* Mystical Action Bar */}
                <div
                    className="absolute bottom-0 left-0 right-0 p-4 border-t border-purple-500/20"
                    style={{
                        background: 'linear-gradient(to top, rgba(0, 0, 0, 0.8) 0%, rgba(147, 51, 234, 0.1) 50%, transparent 100%)'
                    }}
                >
                    <div className="flex justify-end gap-3">
                        <button
                            onClick={onClose}
                            className="px-6 py-2 rounded-lg border transition-all duration-300 hover:scale-105"
                            style={{
                                background: 'linear-gradient(135deg, rgba(147, 51, 234, 0.1), rgba(6, 182, 212, 0.1))',
                                borderColor: 'rgba(147, 51, 234, 0.25)',
                                color: '#c084fc',
                                boxShadow: '0 0 8px rgba(147, 51, 234, 0.2)'
                            }}
                        >
                            Close
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StoryModal;