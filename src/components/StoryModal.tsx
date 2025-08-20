import React, { useEffect, useRef, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { X } from 'lucide-react';
import { Story } from '../types';
import { generateGradientCSS } from '../utils/gradientGenerator';

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
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/70 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal */}
            <div ref={dialogRef} className="relative w-full max-w-4xl max-h-[90vh] rounded-2xl border border-white/10 shadow-[0_10px_40px_rgba(0,0,0,0.6)] overflow-hidden backdrop-blur-lg bg-white/5">
                {/* Header */}
                <div
                    className="relative p-6"
                    style={{ background: generateGradientCSS(`${story.title}-${story.id}`) }}
                >
                    <div className="absolute inset-0 bg-black/50" />
                    <div className="relative flex items-start md:items-center justify-between">
                        <div className="hidden md:block">
                            <h2 className="text-2xl md:text-3xl font-semibold text-white mb-2">{story.title}</h2>
                            <div className="flex flex-wrap gap-2">
                                {story.tags.map((tag, index) => (
                                    <span
                                        key={index}
                                        className="px-3 py-1 text-xs md:text-sm bg-white/15 text-white/90 rounded-full border border-white/20 backdrop-blur-sm"
                                    >
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 text-white/80 hover:text-white hover:bg-white/20 rounded-full transition-all duration-200 border border-white/10"
                            aria-label="Close"
                            ref={closeButtonRef}
                        >
                            <X size={24} />
                        </button>
                    </div>
                    {/* Decorative gradient sheen */}
                    <div className="pointer-events-none absolute inset-0" style={{ background: 'radial-gradient(600px circle at 30% -20%, rgba(255,255,255,0.25), transparent 60%)' }} />
                </div>

                {/* Content */}
                <div className="px-6 pt-6 pb-20 max-h-[60vh] overflow-y-auto scroll-smooth">
                    <div className="prose prose-invert max-w-none markdown-content">
                        {isLongForm && (
                            <div className="mb-5">
                                <p className="text-sm text-white/70 mb-2">Select a chapter to begin:</p>
                                <div className="flex flex-wrap gap-2">
                                    {(story.chapters || []).map(ch => (
                                        <button
                                            key={ch.id}
                                            onClick={() => setSelectedChapterId(ch.id)}
                                            className={`px-3 py-1.5 rounded-md border text-xs md:text-sm transition-colors ${selectedChapterId === ch.id ? 'bg-white/15 border-white/30 text-white' : 'bg-white/5 border-white/15 text-white/80 hover:bg-white/10'}`}
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
                                    <h1 className="text-3xl md:text-4xl font-semibold text-white mb-6 pb-2 border-b border-white/10">
                                        {children}
                                    </h1>
                                ),
                                h2: ({ children }) => (
                                    <h2 className="text-2xl font-semibold text-gray-100 mt-8 mb-4">
                                        {children}
                                    </h2>
                                ),
                                h3: ({ children }) => (
                                    <h3 className="text-xl font-medium text-gray-200 mt-6 mb-3">
                                        {children}
                                    </h3>
                                ),
                                p: ({ children }) => (
                                    <p className="text-gray-300 leading-relaxed mb-4">
                                        {children}
                                    </p>
                                ),
                                strong: ({ children }) => (
                                    <strong className="text-white font-semibold">
                                        {children}
                                    </strong>
                                ),
                                em: ({ children }) => (
                                    <em className="text-gray-200 italic">
                                        {children}
                                    </em>
                                ),
                                ul: ({ children }) => (
                                    <ul className="list-disc list-outside ml-6 text-gray-300 mb-4 space-y-2">
                                        {children}
                                    </ul>
                                ),
                                ol: ({ children }) => (
                                    <ol className="list-decimal list-outside ml-6 text-gray-300 mb-4 space-y-2">
                                        {children}
                                    </ol>
                                ),
                                li: ({ children }) => (
                                    <li className="text-gray-300 leading-relaxed pl-1">
                                        {children}
                                    </li>
                                ),
                                blockquote: ({ children }) => (
                                    <blockquote className="border-l-4 border-white/20 pl-4 italic text-gray-400 my-4">
                                        {children}
                                    </blockquote>
                                ),
                            }}
                        >
                            {getDisplayedContent() || (isLongForm ? '*Please choose a chapter above.*' : '')}
                        </ReactMarkdown>
                    </div>
                </div>

                {/* Sticky action bar */}
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 via-black/30 to-transparent">
                    <div className="flex justify-end gap-3">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 rounded-md bg-white/10 border border-white/15 text-white hover:bg-white/15 hover:border-white/25 transition-colors"
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