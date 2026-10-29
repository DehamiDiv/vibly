import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext.jsx';
import { assets } from '../assets/assets.js';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

const StoryViewerModal = () => {
    const { stories, activeStoryIndex, setActiveStoryIndex } = useApp();
    const [progress, setProgress] = useState(0);

    const currentStory = activeStoryIndex !== null ? stories[activeStoryIndex] : null;

    // Timer effect to auto-advance
    useEffect(() => {
        if (activeStoryIndex === null || !currentStory) return;

        setProgress(0);
        const intervalTime = 50; // update progress every 50ms
        const totalDuration = 5000; // 5 seconds per story
        const increment = (intervalTime / totalDuration) * 100;

        const timer = setInterval(() => {
            setProgress((prev) => {
                if (prev >= 100) {
                    // Advance to next story or close
                    if (activeStoryIndex < stories.length - 1) {
                        setActiveStoryIndex(activeStoryIndex + 1);
                    } else {
                        setActiveStoryIndex(null);
                    }
                    return 0;
                }
                return prev + increment;
            });
        }, intervalTime);

        return () => clearInterval(timer);
    }, [activeStoryIndex, stories.length, setActiveStoryIndex, currentStory]);

    if (activeStoryIndex === null || !currentStory) return null;

    const handlePrev = (e) => {
        e.stopPropagation();
        if (activeStoryIndex > 0) {
            setActiveStoryIndex(activeStoryIndex - 1);
            setProgress(0);
        }
    };

    const handleNext = (e) => {
        e.stopPropagation();
        if (activeStoryIndex < stories.length - 1) {
            setActiveStoryIndex(activeStoryIndex + 1);
            setProgress(0);
        } else {
            setActiveStoryIndex(null);
        }
    };

    return (
        <div 
            onClick={() => setActiveStoryIndex(null)}
            className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 select-none"
        >
            <div 
                onClick={(e) => e.stopPropagation()} 
                className="relative w-full max-w-sm h-[80vh] max-h-[700px] rounded-2xl overflow-hidden shadow-2xl flex flex-col justify-between"
                style={{
                    backgroundColor: currentStory.media_url ? '#000' : (currentStory.background_color || '#4f46e5')
                }}
            >
                {/* Background Media */}
                {currentStory.media_url && (
                    <div className="absolute inset-0">
                        {currentStory.media_type === 'video' ? (
                            <video
                                src={currentStory.media_url}
                                autoPlay
                                loop
                                playsInline
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <img
                                src={currentStory.media_url}
                                alt="Story"
                                className="w-full h-full object-cover"
                            />
                        )}
                        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/60" />
                    </div>
                )}

                {/* Top Overlay: Progress Bars & Author */}
                <div className="relative z-10 p-4">
                    {/* Progress indicators for all stories */}
                    <div className="flex gap-1.5 mb-3">
                        {stories.map((_, i) => (
                            <div key={i} className="h-1 flex-1 bg-white/30 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-white transition-all ease-linear"
                                    style={{
                                        width: i < activeStoryIndex ? '100%' : (i === activeStoryIndex ? `${progress}%` : '0%')
                                    }}
                                />
                            </div>
                        ))}
                    </div>

                    {/* Author Header */}
                    <div className="flex items-center justify-between text-white">
                        <div className="flex items-center gap-2.5">
                            <img
                                src={currentStory.user?.profile_picture || assets.sample_profile}
                                alt={currentStory.user?.full_name}
                                className="w-9 h-9 rounded-full object-cover border border-white/40"
                            />
                            <div>
                                <p className="text-xs font-semibold leading-tight drop-shadow">
                                    {currentStory.user?.full_name || 'Vibly Member'}
                                </p>
                                <p className="text-[10px] text-white/80 drop-shadow">
                                    @{currentStory.user?.username || 'user'}
                                </p>
                            </div>
                        </div>

                        <button
                            onClick={() => setActiveStoryIndex(null)}
                            className="p-1.5 rounded-full bg-black/40 hover:bg-black/60 text-white transition-colors"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                {/* Center Content for Text Story */}
                {(!currentStory.media_url || currentStory.media_type === 'text') && (
                    <div className="relative z-10 px-8 flex items-center justify-center flex-1 text-center">
                        <p className="text-white text-lg font-medium drop-shadow-md leading-relaxed whitespace-pre-wrap">
                            {currentStory.content}
                        </p>
                    </div>
                )}

                {/* Bottom Caption for Media Stories */}
                {currentStory.media_url && currentStory.content && (
                    <div className="relative z-10 p-4 text-white text-xs drop-shadow text-center">
                        <p className="bg-black/40 backdrop-blur-sm px-3 py-2 rounded-xl inline-block">
                            {currentStory.content}
                        </p>
                    </div>
                )}

                {/* Prev / Next Click Overlays */}
                <button
                    onClick={handlePrev}
                    disabled={activeStoryIndex === 0}
                    className="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/30 hover:bg-black/50 text-white disabled:opacity-0 transition-opacity z-20"
                >
                    <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                    onClick={handleNext}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/30 hover:bg-black/50 text-white transition-opacity z-20"
                >
                    <ChevronRight className="w-5 h-5" />
                </button>
            </div>
        </div>
    );
};

export default StoryViewerModal;

