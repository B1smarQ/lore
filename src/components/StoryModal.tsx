import React from 'react';
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

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative w-full max-w-4xl max-h-[90vh] bg-gray-900 rounded-2xl border border-gray-700 shadow-2xl overflow-hidden">
                {/* Header */}
                <div
                    className="relative p-6"
                    style={{ background: generateGradientCSS(`${story.title}-${story.id}`) }}
                >
                    <div className="absolute inset-0 bg-black/40" />
                    <div className="relative flex items-center justify-between">
                        <div>
                            <h2 className="text-2xl font-bold text-white mb-2">{story.title}</h2>
                            <div className="flex flex-wrap gap-2">
                                {story.tags.map((tag, index) => (
                                    <span
                                        key={index}
                                        className="px-3 py-1 text-sm bg-white/20 text-white rounded-full backdrop-blur-sm"
                                    >
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 text-white/80 hover:text-white hover:bg-white/20 rounded-full transition-all duration-200"
                        >
                            <X size={24} />
                        </button>
                    </div>

                    {/* Decorative elements */}
                    <div className="absolute top-4 right-20 w-2 h-2 rounded-full bg-white/30 animate-pulse" />
                    <div className="absolute bottom-4 left-20 w-1 h-1 rounded-full bg-white/40 animate-float" />
                </div>

                {/* Content */}
                <div className="p-6 max-h-[60vh] overflow-y-auto">
                    <div className="prose prose-invert prose-lg max-w-none markdown-content">
                        <ReactMarkdown
                            components={{
                                h1: ({ children }) => (
                                    <h1 className="text-3xl font-bold text-white mb-6 pb-2 border-b border-gray-700">
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
                                    <blockquote className="border-l-4 border-gray-600 pl-4 italic text-gray-400 my-4">
                                        {children}
                                    </blockquote>
                                ),
                            }}
                        >
                            {story.content}
                        </ReactMarkdown>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StoryModal;