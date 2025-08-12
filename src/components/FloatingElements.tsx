import React from 'react';

const FloatingElements: React.FC = () => {
    return (
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
            {/* Random floating color splashes */}
            <div className="absolute top-1/4 left-1/4 w-4 h-4 rounded-full bg-gradient-to-r from-red-500 to-pink-500 opacity-30 animate-float" />
            <div className="absolute top-1/3 right-1/4 w-3 h-3 rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 opacity-40 animate-pulse-slow" />
            <div className="absolute bottom-1/4 left-1/3 w-2 h-2 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 opacity-50 animate-float" style={{ animationDelay: '2s' }} />
            <div className="absolute top-1/2 right-1/3 w-5 h-5 rounded-full bg-gradient-to-r from-green-400 to-emerald-500 opacity-20 animate-pulse-slow" style={{ animationDelay: '1s' }} />
            <div className="absolute bottom-1/3 right-1/4 w-3 h-3 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 opacity-35 animate-float" style={{ animationDelay: '3s' }} />

            {/* Larger ambient elements */}
            <div className="absolute top-10 left-10 w-32 h-32 rounded-full bg-gradient-to-r from-purple-500/10 to-pink-500/10 blur-xl animate-pulse-slow" />
            <div className="absolute bottom-20 right-20 w-40 h-40 rounded-full bg-gradient-to-r from-cyan-500/10 to-blue-500/10 blur-xl animate-float" />
            <div className="absolute top-1/2 left-20 w-24 h-24 rounded-full bg-gradient-to-r from-green-500/10 to-emerald-500/10 blur-xl animate-pulse-slow" style={{ animationDelay: '2s' }} />
        </div>
    );
};

export default FloatingElements;