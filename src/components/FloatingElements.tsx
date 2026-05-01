import React from 'react';

const FloatingElements: React.FC = () => {
    return (
        <div className="pointer-events-none fixed inset-0 overflow-hidden">
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.035)_1px,transparent_1px)] bg-[size:64px_64px]" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.42)_72%,rgba(0,0,0,0.75)_100%)]" />
            <div className="absolute left-0 top-0 h-full w-px bg-white/10" />
            <div className="absolute right-0 top-0 h-full w-px bg-white/10" />
        </div>
    );
};

export default FloatingElements;
