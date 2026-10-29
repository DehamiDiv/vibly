import React from 'react';
import { useApp } from '../context/AppContext.jsx';
import { assets } from '../assets/assets.js';
import { Plus } from 'lucide-react';

const StoriesBar = () => {
    const { currentUser, stories, setIsCreateStoryOpen, setActiveStoryIndex } = useApp();

    return (
        <section className="mb-4">
            <div className="flex items-center gap-2.5 overflow-x-auto no-scrollbar py-1">
                {/* Facebook-style Card 1: Create Story */}
                <div
                    onClick={() => setIsCreateStoryOpen(true)}
                    className="w-28 sm:w-32 h-48 sm:h-52 bg-white rounded-2xl overflow-hidden shadow-xs hover:shadow-md border border-gray-200/80 cursor-pointer shrink-0 transition-transform duration-200 hover:scale-[1.02] flex flex-col justify-between relative group select-none"
                >
                    <div className="h-[70%] w-full overflow-hidden bg-gray-100">
                        <img
                            src={currentUser?.profile_picture || assets.sample_profile}
                            alt="Create story"
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                    </div>
                    {/* Floating Add Button */}
                    <div className="absolute top-[62%] left-1/2 -translate-x-1/2 w-9 h-9 bg-gradient-to-tr from-[#7C3AED] to-[#EC4899] text-white rounded-full flex items-center justify-center border-4 border-white shadow-md transition-transform group-hover:scale-110">
                        <Plus className="w-5 h-5 stroke-[3]" />
                    </div>
                    <div className="h-[30%] bg-white flex items-end justify-center pb-2.5 pt-3 px-1">
                        <span className="text-[13px] font-bold text-[#1E1B4B] leading-tight text-center">
                            Create story
                        </span>
                    </div>
                </div>

                {/* Facebook-style Story Cards */}
                {stories.map((story, index) => {
                    const backgroundStyle = story.media_url
                        ? { backgroundImage: `url(${story.media_url})`, backgroundSize: 'cover', backgroundPosition: 'center' }
                        : { backgroundColor: story.background_color || '#7C3AED' };

                    return (
                        <div
                            key={story._id || index}
                            onClick={() => setActiveStoryIndex(index)}
                            className="w-28 sm:w-32 h-48 sm:h-52 rounded-2xl overflow-hidden shadow-xs hover:shadow-md cursor-pointer shrink-0 transition-transform duration-200 hover:scale-[1.02] relative p-3 flex flex-col justify-between group select-none border border-gray-200/60"
                            style={backgroundStyle}
                        >
                            {/* Author Avatar with Vibrant Instagram/Threads-like Gradient Ring */}
                            <div className="relative z-10 w-10 h-10 rounded-full p-[2.5px] bg-gradient-to-tr from-[#F59E0B] via-[#EC4899] to-[#7C3AED] shadow-sm shrink-0">
                                <div className="w-full h-full rounded-full overflow-hidden border-2 border-white">
                                    <img
                                        src={story.user?.profile_picture || assets.sample_profile}
                                        alt={story.user?.full_name}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            </div>

                            {/* Text preview for text-only stories */}
                            {!story.media_url && story.content && (
                                <p className="relative z-10 text-white text-xs font-semibold line-clamp-3 text-center my-auto drop-shadow-sm px-1">
                                    {story.content}
                                </p>
                            )}

                            {/* Bottom Dark Gradient & Author Name */}
                            <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/80 via-black/30 to-transparent pointer-events-none" />
                            <p className="relative z-10 text-[13px] font-bold text-white drop-shadow-md truncate">
                                {story.user?.full_name?.split(' ')[0] || story.user?.username || 'Member'}
                            </p>
                        </div>
                    );
                })}
            </div>
        </section>
    );
};

export default StoriesBar;
