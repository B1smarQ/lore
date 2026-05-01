import React from 'react';
import { ArrowLeft, ArrowRight, GitBranch } from 'lucide-react';
import { generateGradientCSS } from '../utils/gradientGenerator';

interface BranchOption {
    id: string;
    title: string;
    description: string;
    tags: string[];
}

interface BranchSelectionProps {
    onBranchSelect: (branchId: string) => void;
    onBack?: () => void;
}

const branches: BranchOption[] = [
    {
        id: 'martinus',
        title: 'The Aokishiro Chronicles',
        description: 'A fox-eared commander learns that true leadership means making the hard choices while keeping your humanity intact, even when reality itself is negotiable.',
        tags: ['Military', 'Dimensional', 'Mystery']
    },
    {
        id: 'museum',
        title: 'The Museum Curator',
        description: 'The Jester trades performance for preservation, becoming curator of unfinished stories while learning the art of institutional restraint.',
        tags: ['Museum', 'A New Beggining', 'Art']
    },
    {
        id: 'yorozuki',
        title: 'The Myriad Moon',
        description: "Under a moon that's too big for the sky, the Jester becomes Bis Yorozuki - the myriad moon that shines on countless stories, offering encores instead of opening acts.",
        tags: ['Moon', 'A New Beginning', 'Comedy']
    }
];

const BranchSelection: React.FC<BranchSelectionProps> = ({ onBranchSelect, onBack }) => {
    return (
        <section className="relative min-h-screen w-full px-5 pb-16 pt-28 sm:px-8 lg:px-12">
            <div className="mx-auto w-full max-w-6xl">
                <div className="mb-12 grid gap-8 border-b border-white/10 pb-10 md:grid-cols-[0.8fr_1.2fr] md:items-end">
                    <div className="flex items-center gap-3 text-xs uppercase tracking-[0.28em] text-zinc-500">
                        <GitBranch size={16} className="text-teal-300" />
                        <span>Branch point</span>
                    </div>

                    <div className="space-y-4">
                        <h1 className="text-4xl font-semibold leading-tight text-zinc-50 sm:text-5xl lg:text-6xl">
                            Reality Fractures
                        </h1>
                        <p className="max-w-3xl text-base leading-8 text-zinc-300 sm:text-lg">
                            The narrative splits into parallel paths. Choose the thread you want to follow next.
                        </p>
                    </div>
                </div>

                <div className="grid gap-4">
                    {branches.map((branch, index) => (
                        <button
                            key={branch.id}
                            onClick={() => onBranchSelect(branch.id)}
                            className="group relative overflow-hidden rounded-lg border border-white/10 bg-white/[0.03] p-5 text-left transition hover:-translate-y-0.5 hover:border-white/20 hover:bg-white/[0.06] focus:outline-none focus:ring-2 focus:ring-white/25 sm:p-6"
                        >
                            <div
                                className="absolute inset-x-0 top-0 h-px opacity-70"
                                style={{ background: generateGradientCSS(`${branch.title}-${branch.id}`) }}
                            />

                            <div className="grid gap-6 md:grid-cols-[12rem_1fr_auto] md:items-center">
                                <div className="space-y-2">
                                    <div className="font-mono text-sm text-zinc-300">{String(index + 1).padStart(2, '0')}</div>
                                    <div className="text-xs uppercase tracking-[0.22em] text-zinc-500">Path</div>
                                </div>

                                <div className="min-w-0 space-y-4">
                                    <h2 className="text-2xl font-semibold leading-tight text-zinc-50 sm:text-3xl">
                                        {branch.title}
                                    </h2>
                                    <p className="max-w-3xl text-sm leading-7 text-zinc-400 sm:text-base">
                                        {branch.description}
                                    </p>
                                    <div className="flex flex-wrap gap-2">
                                        {branch.tags.map((tag) => (
                                            <span key={tag} className="rounded-full border border-white/10 px-3 py-1 text-xs uppercase tracking-[0.16em] text-zinc-500">
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                <div className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/10 text-zinc-400 transition group-hover:border-zinc-100 group-hover:bg-zinc-100 group-hover:text-zinc-950">
                                    <ArrowRight size={18} />
                                </div>
                            </div>
                        </button>
                    ))}
                </div>

                {onBack && (
                    <div className="mt-10">
                        <button
                            onClick={onBack}
                            className="inline-flex h-11 items-center gap-3 rounded-full border border-white/10 bg-white/[0.03] px-4 text-sm text-zinc-300 transition hover:border-white/20 hover:bg-white/[0.06] hover:text-white focus:outline-none focus:ring-2 focus:ring-white/25"
                        >
                            <ArrowLeft size={17} />
                            Return to stories
                        </button>
                    </div>
                )}
            </div>
        </section>
    );
};

export default BranchSelection;
