import React from 'react';
import { useApp } from '../context/AppContext.jsx';
import StoriesBar from '../components/StoriesBar.jsx';
import PostCard from '../components/PostCard.jsx';
import { assets } from '../assets/assets.js';
import { Image as ImageIcon, Sparkles, MessageSquare, Smile, Video } from 'lucide-react';

const Feed = () => {
    const { currentUser, posts, loading, setIsCreatePostOpen, setIsCreateStoryOpen } = useApp();

    const firstName = currentUser?.full_name?.split(' ')[0] || 'there';

    return (
        <div className="space-y-4">
            {/* Facebook-style Stories Tray */}
            <StoriesBar />

            {/* Facebook-style Create Post Card */}
            <div className="bg-white rounded-2xl p-4 border border-gray-200/80 shadow-xs">
                {/* Top: Avatar + Pill Input */}
                <div className="flex items-center gap-3">
                    <img
                        src={currentUser?.profile_picture || assets.sample_profile}
                        alt={currentUser?.full_name}
                        className="w-10 h-10 rounded-full object-cover border border-gray-200 shrink-0"
                    />
                    <div
                        onClick={() => setIsCreatePostOpen(true)}
                        className="flex-1 bg-[#F8F7FF] hover:bg-[#EDE9FE]/40 border border-gray-200 cursor-pointer rounded-full px-4 py-2.5 text-[15px] text-[#6B7280] transition-colors"
                    >
                        What's on your mind, {firstName}?
                    </div>
                </div>

                <div className="border-t border-gray-200/80 my-3" />

                {/* Bottom: Action Buttons */}
                <div className="flex items-center justify-between text-[14px] font-semibold text-[#6B7280]">
                    <button
                        onClick={() => setIsCreatePostOpen(true)}
                        className="flex-1 flex items-center justify-center gap-2 py-2 rounded-xl hover:bg-[#EDE9FE]/40 transition-colors cursor-pointer"
                    >
                        <ImageIcon className="w-6 h-6 text-[#EC4899]" />
                        <span>Photo/video</span>
                    </button>

                    <button
                        onClick={() => setIsCreateStoryOpen(true)}
                        className="flex-1 flex items-center justify-center gap-2 py-2 rounded-xl hover:bg-[#EDE9FE]/40 transition-colors cursor-pointer"
                    >
                        <Sparkles className="w-6 h-6 text-[#7C3AED]" />
                        <span>Story status</span>
                    </button>

                    <button
                        onClick={() => setIsCreatePostOpen(true)}
                        className="flex-1 flex items-center justify-center gap-2 py-2 rounded-xl hover:bg-[#EDE9FE]/40 transition-colors cursor-pointer hidden sm:flex"
                    >
                        <Smile className="w-6 h-6 text-[#F59E0B]" />
                        <span>Feeling/activity</span>
                    </button>
                </div>
            </div>

            {/* Posts Feed */}
            {loading ? (
                <div className="space-y-4">
                    {[1, 2].map((n) => (
                        <div key={n} className="bg-white rounded-2xl p-5 border border-gray-200/80 shadow-xs animate-pulse space-y-3">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-gray-200 rounded-full" />
                                <div className="space-y-1.5 flex-1">
                                    <div className="w-32 h-4 bg-gray-200 rounded" />
                                    <div className="w-20 h-3 bg-gray-200 rounded" />
                                </div>
                            </div>
                            <div className="w-full h-14 bg-gray-100 rounded" />
                            <div className="w-full h-64 bg-gray-100 rounded-xl" />
                        </div>
                    ))}
                </div>
            ) : posts.length > 0 ? (
                <div className="space-y-4">
                    {posts.map((post) => (
                        <PostCard key={post._id} post={post} />
                    ))}
                </div>
            ) : (
                <div className="bg-white rounded-2xl p-10 border border-gray-200/80 text-center shadow-xs">
                    <MessageSquare className="w-14 h-14 text-gray-300 mx-auto mb-3" />
                    <h3 className="text-lg font-bold text-gray-800">No Posts in Your Feed</h3>
                    <p className="text-[14px] text-gray-500 mt-1 mb-5">
                        Connect with friends, follow creators, or share your first post!
                    </p>
                    <button
                        onClick={() => setIsCreatePostOpen(true)}
                        className="bg-violet-600 hover:bg-violet-700 text-white font-bold text-[14px] px-5 py-2.5 rounded-xl transition-colors shadow-xs cursor-pointer"
                    >
                        Create Your First Post
                    </button>
                </div>
            )}
        </div>
    );
};

export default Feed;
