import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext.jsx';
import { assets } from '../assets/assets.js';
import { 
    ThumbsUp, 
    MessageCircle, 
    Share2, 
    Trash2, 
    Send, 
    CheckCircle2, 
    Globe, 
    MoreHorizontal,
    Heart
} from 'lucide-react';

const PostCard = ({ post }) => {
    const { currentUser, handleLikePost, handleAddComment, handleDeletePost } = useApp();
    const navigate = useNavigate();

    const [showComments, setShowComments] = useState(false);
    const [commentText, setCommentText] = useState('');
    const [copied, setCopied] = useState(false);

    const isLiked = post.likes_count?.includes(currentUser?._id);
    const likesCount = post.likes_count?.length || 0;
    const commentsCount = post.comments?.length || 0;
    const isOwner = post.user?._id === currentUser?._id;

    const formatTime = (isoString) => {
        if (!isoString) return 'Just now';
        const diffMs = Date.now() - new Date(isoString).getTime();
        const diffMins = Math.floor(diffMs / (1000 * 60));
        if (diffMins < 1) return 'Just now';
        if (diffMins < 60) return `${diffMins}m`;
        const diffHours = Math.floor(diffMins / 60);
        if (diffHours < 24) return `${diffHours}h`;
        const diffDays = Math.floor(diffHours / 24);
        return `${diffDays}d`;
    };

    const renderContentWithHashtags = (text) => {
        if (!text) return null;
        const words = text.split(/(\s+)/);
        return words.map((word, idx) => {
            if (word.startsWith('#')) {
                const tag = word.replace(/[^a-zA-Z0-9#_]/g, '');
                return (
                    <span
                        key={idx}
                        onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/discover?q=${encodeURIComponent(tag.replace('#', ''))}`);
                        }}
                        className="text-violet-600 font-semibold hover:underline cursor-pointer"
                    >
                        {word}
                    </span>
                );
            }
            return word;
        });
    };

    const onCommentSubmit = async (e) => {
        e.preventDefault();
        if (!commentText.trim()) return;
        await handleAddComment(post._id, commentText);
        setCommentText('');
    };

    const handleShare = () => {
        if (navigator.clipboard) {
            navigator.clipboard.writeText(window.location.origin);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    const isShortText = post.content && post.content.length < 90 && (!post.image_urls || post.image_urls.length === 0);

    return (
        <article className="bg-white rounded-2xl border border-gray-200/80 shadow-xs mb-4 overflow-hidden">
            {/* Header: Author Info */}
            <div className="p-4 flex items-center justify-between">
                <div 
                    onClick={() => navigate(`/profile/${post.user?._id}`)} 
                    className="flex items-center gap-3 cursor-pointer group"
                >
                    <img
                        src={post.user?.profile_picture || assets.sample_profile}
                        alt={post.user?.full_name}
                        className="w-10 h-10 rounded-full object-cover border border-gray-200"
                    />
                    <div>
                        <div className="flex items-center gap-1.5">
                            <h3 className="text-[15px] font-bold text-[#1E1B4B] group-hover:text-[#7C3AED] transition-colors">
                                {post.user?.full_name || 'Vibly Member'}
                            </h3>
                            {post.user?.is_verified && (
                                <CheckCircle2 className="w-4 h-4 text-[#7C3AED] fill-[#7C3AED]/20" />
                            )}
                        </div>
                        <div className="flex items-center gap-1.5 text-[13px] text-[#6B7280]">
                            <span>{formatTime(post.createdAt)}</span>
                            <span>·</span>
                            <Globe className="w-3.5 h-3.5 text-[#6B7280]" />
                        </div>
                    </div>
                </div>

                {isOwner && (
                    <button
                        onClick={() => handleDeletePost(post._id)}
                        className="p-2 text-[#6B7280] hover:text-red-600 hover:bg-red-50 rounded-full transition-colors cursor-pointer"
                        title="Delete Post"
                    >
                        <Trash2 className="w-4.5 h-4.5" />
                    </button>
                )}
            </div>

            {/* Post Content */}
            {post.content && (
                <div className={`px-4 pb-3 whitespace-pre-line leading-relaxed text-[#1E1B4B] ${
                    isShortText ? 'text-[20px] font-medium py-2' : 'text-[15px]'
                }`}>
                    {renderContentWithHashtags(post.content)}
                </div>
            )}

            {/* Post Media (ImageKit Optimized Images) */}
            {post.image_urls && post.image_urls.length > 0 && (
                <div className={`grid gap-1 bg-gray-100 ${post.image_urls.length > 1 ? 'grid-cols-2' : 'grid-cols-1'}`}>
                    {post.image_urls.map((imgUrl, i) => (
                        <div key={i} className="overflow-hidden bg-black flex items-center justify-center max-h-[500px]">
                            <img
                                src={imgUrl}
                                alt="Post attachment"
                                className="w-full h-full object-contain max-h-[500px] cursor-pointer hover:opacity-95 transition-opacity"
                                loading="lazy"
                            />
                        </div>
                    ))}
                </div>
            )}

            {/* Facebook-style Reactions Summary Bar */}
            <div className="px-4 py-2.5 flex items-center justify-between text-[14px] text-gray-500">
                {/* Like & Heart badge */}
                <div className="flex items-center gap-1.5">
                    {likesCount > 0 ? (
                        <>
                            <div className="flex items-center -space-x-1">
                                <span className="w-5 h-5 rounded-full bg-[#7C3AED] flex items-center justify-center text-white text-[10px] shadow-xs">
                                    👍
                                </span>
                                <span className="w-5 h-5 rounded-full bg-[#EC4899] flex items-center justify-center text-white text-[10px] shadow-xs">
                                    ❤️
                                </span>
                            </div>
                            <span className="font-medium text-[#1E1B4B] text-[14px]">
                                {likesCount}
                            </span>
                        </>
                    ) : (
                        <span className="text-[13px] text-[#6B7280]">Be the first to react</span>
                    )}
                </div>

                {/* Comments & Shares count */}
                <div className="flex items-center gap-3 text-[14px] text-[#6B7280]">
                    {commentsCount > 0 && (
                        <button
                            onClick={() => setShowComments(!showComments)}
                            className="hover:underline cursor-pointer"
                        >
                            {commentsCount} comments
                        </button>
                    )}
                </div>
            </div>

            <div className="border-t border-gray-100 mx-3" />

            {/* Trendy 3-Action Buttons Bar */}
            <div className="px-2 py-1 flex items-center justify-between text-[14px] font-semibold text-[#6B7280]">
                {/* Like Button */}
                <button
                    onClick={() => handleLikePost(post._id)}
                    className={`flex-1 py-2 rounded-xl flex items-center justify-center gap-2 transition-colors cursor-pointer ${
                        isLiked 
                            ? 'text-[#7C3AED] font-bold bg-[#7C3AED]/10' 
                            : 'hover:bg-[#EDE9FE]/40 text-[#6B7280]'
                    }`}
                >
                    <ThumbsUp className={`w-5 h-5 ${isLiked ? 'fill-[#7C3AED] stroke-[#7C3AED]' : ''}`} />
                    <span>Like</span>
                </button>

                {/* Comment Button */}
                <button
                    onClick={() => setShowComments(!showComments)}
                    className="flex-1 py-2 rounded-xl flex items-center justify-center gap-2 hover:bg-[#EDE9FE]/40 text-[#6B7280] transition-colors cursor-pointer"
                >
                    <MessageCircle className="w-5 h-5" />
                    <span>Comment</span>
                </button>

                {/* Share Button */}
                <button
                    onClick={handleShare}
                    className="flex-1 py-2 rounded-xl flex items-center justify-center gap-2 hover:bg-[#EDE9FE]/40 text-[#6B7280] transition-colors cursor-pointer"
                >
                    <Share2 className="w-5 h-5" />
                    <span>{copied ? 'Copied!' : 'Share'}</span>
                </button>
            </div>

            {/* Facebook-style Comments Drawer */}
            {showComments && (
                <div className="p-4 border-t border-gray-100 bg-gray-50/70 space-y-3">
                    {/* Add Comment Input Form */}
                    <form onSubmit={onCommentSubmit} className="flex items-center gap-2.5">
                        <img
                            src={currentUser?.profile_picture || assets.sample_profile}
                            alt="You"
                            className="w-9 h-9 rounded-full object-cover shrink-0"
                        />
                        <div className="flex-1 bg-[#F8F7FF] hover:bg-[#EDE9FE]/30 focus-within:bg-white border border-gray-200 focus-within:border-[#7C3AED] rounded-full px-4 py-2 flex items-center transition-all">
                            <input
                                type="text"
                                value={commentText}
                                onChange={(e) => setCommentText(e.target.value)}
                                placeholder="Write a comment..."
                                className="w-full bg-transparent text-[14px] text-[#1E1B4B] outline-none placeholder-[#6B7280]"
                            />
                            <button
                                type="submit"
                                disabled={!commentText.trim()}
                                className="text-[#7C3AED] hover:text-[#EC4899] disabled:opacity-30 p-1 cursor-pointer transition-colors"
                            >
                                <Send className="w-4 h-4" />
                            </button>
                        </div>
                    </form>

                    {/* Existing Comments List */}
                    <div className="space-y-2.5 pt-1 max-h-72 overflow-y-auto no-scrollbar">
                        {post.comments && post.comments.length > 0 ? (
                            post.comments.map((comment, i) => (
                                <div key={i} className="flex gap-2.5 items-start">
                                    <img
                                        src={comment.user?.profile_picture || assets.sample_profile}
                                        alt={comment.user?.full_name}
                                        className="w-8 h-8 rounded-full object-cover shrink-0 mt-1 ring-1 ring-gray-200"
                                    />
                                    <div>
                                        <div className="bg-[#F8F7FF] px-3.5 py-2 rounded-2xl inline-block max-w-md border border-gray-100">
                                            <p className="text-[13px] font-bold text-[#1E1B4B] leading-tight">
                                                {comment.user?.full_name || 'Vibly Member'}
                                            </p>
                                            <p className="text-[14px] text-[#1E1B4B] mt-0.5 leading-snug">
                                                {comment.text}
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-3 text-[12px] text-[#6B7280] pl-3 pt-0.5">
                                            <span>{formatTime(comment.createdAt)}</span>
                                            <button className="font-semibold hover:text-[#7C3AED] cursor-pointer">Like</button>
                                            <button className="font-semibold hover:text-[#7C3AED] cursor-pointer">Reply</button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-[13px] text-[#6B7280] text-center py-2">
                                No comments yet. Be the first to comment!
                            </p>
                        )}
                    </div>
                </div>
            )}
        </article>
    );
};

export default PostCard;
