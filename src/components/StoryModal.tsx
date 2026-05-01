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
    const dialogRef = useRef<HTMLDivElement>(null);
    const closeButtonRef = useRef<HTMLButtonElement>(null);
    const [selectedChapterId, setSelectedChapterId] = useState<string | undefined>(undefined);

    useEffect(() => {
        setSelectedChapterId(story?.chapters?.[0]?.id);
    }, [story?.id, story?.chapters]);

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
        closeButtonRef.current?.focus();
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, onClose]);

    if (!isOpen || !story) return null;

    const chapters = story.chapters || [];
    const hasChapters = chapters.length > 0;
    const selectedChapter = chapters.find((chapter) => chapter.id === selectedChapterId);
    const displayedContent = hasChapters
        ? selectedChapter?.content || '*Choose a chapter to begin.*'
        : story.content || '';

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-3 backdrop-blur-md sm:p-6" role="dialog" aria-modal="true" aria-label={story.title}>
            <button className="absolute inset-0 cursor-default" aria-label="Close story dialog" onClick={onClose} />

            <div ref={dialogRef} className="relative flex max-h-[92vh] w-full max-w-5xl flex-col overflow-hidden rounded-lg border border-white/10 bg-[#101113] shadow-2xl shadow-black/60">
                <div
                    className="h-1 w-full opacity-80"
                    style={{ background: generateGradientCSS(`${story.title}-${story.id}`) }}
                />

                <header className="flex items-start justify-between gap-4 border-b border-white/10 px-5 py-5 sm:px-7">
                    <div className="min-w-0 space-y-3">
                        <div className="flex items-center gap-3 text-xs uppercase tracking-[0.24em] text-zinc-500">
                            <span className="font-mono text-zinc-300">{String(story.id).padStart(2, '0')}</span>
                            <span className="h-px w-10 bg-white/15" />
                            <span>Reading view</span>
                        </div>
                        <h2 className="text-2xl font-semibold leading-tight text-zinc-50 sm:text-3xl">
                            {story.title}
                        </h2>
                        <div className="flex flex-wrap gap-2">
                            {story.tags.map((tag) => (
                                <span key={tag} className="rounded-full border border-white/10 px-3 py-1 text-xs uppercase tracking-[0.16em] text-zinc-400">
                                    {tag}
                                </span>
                            ))}
                        </div>
                    </div>

                    <button
                        onClick={onClose}
                        className="inline-flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/[0.03] text-zinc-300 transition hover:bg-white/10 hover:text-white focus:outline-none focus:ring-2 focus:ring-white/30"
                        aria-label="Close"
                        ref={closeButtonRef}
                    >
                        <X size={20} />
                    </button>
                </header>

                {hasChapters && (
                    <nav className="flex-shrink-0 border-b border-white/10 px-5 py-4 sm:px-7" aria-label="Chapters">
                        <div className="max-h-36 overflow-y-auto pr-2">
                            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
                            {chapters.map((chapter) => (
                                <button
                                    key={chapter.id}
                                    onClick={() => setSelectedChapterId(chapter.id)}
                                    className={`min-h-10 rounded-md border px-3 py-2 text-left text-sm leading-5 transition focus:outline-none focus:ring-2 focus:ring-white/25 ${selectedChapterId === chapter.id
                                        ? 'border-zinc-100 bg-zinc-100 text-zinc-950'
                                        : 'border-white/10 bg-white/[0.03] text-zinc-400 hover:border-white/20 hover:text-zinc-100'
                                        }`}
                                    title={chapter.title}
                                >
                                    {chapter.title}
                                </button>
                            ))}
                            </div>
                        </div>
                    </nav>
                )}

                <div className="overflow-y-auto px-5 py-6 sm:px-7 sm:py-8">
                    <div className="prose prose-invert max-w-none markdown-content prose-headings:tracking-normal prose-headings:text-zinc-50 prose-p:text-zinc-300 prose-strong:text-zinc-100 prose-a:text-teal-300 prose-blockquote:border-l-teal-300/40 prose-blockquote:text-zinc-300 prose-code:text-zinc-100">
                        <ReactMarkdown>
                            {displayedContent}
                        </ReactMarkdown>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StoryModal;
