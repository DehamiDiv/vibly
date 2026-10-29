import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext.jsx';
import { assets } from '../assets/assets.js';
import { UserPlus, UserCheck, CheckCircle2, MessageCircle, MapPin, Check } from 'lucide-react';

const UserCard = ({ user, initialConnectionStatus = 'none', initialIsFollowing = false }) => {
    const { currentUser, handleSendConnection, handleFollowToggle, setActiveChatPartner } = useApp();
    const navigate = useNavigate();

    const [connStatus, setConnStatus] = useState(initialConnectionStatus);
    const [isFollowing, setIsFollowing] = useState(initialIsFollowing);
    const [isLoading, setIsLoading] = useState(false);

    const isSelf = user?._id === currentUser?._id;

    const onConnectClick = async () => {
        if (connStatus !== 'none') return;
        setIsLoading(true);
        try {
            await handleSendConnection(user._id);
            setConnStatus('pending');
        } finally {
            setIsLoading(false);
        }
    };

    const onFollowClick = async () => {
        setIsLoading(true);
        try {
            await handleFollowToggle(user._id, isFollowing);
            setIsFollowing(!isFollowing);
        } finally {
            setIsLoading(false);
        }
    };

    const onMessageClick = () => {
        setActiveChatPartner(user);
        navigate('/messages');
    };

    return (
        <div className="bg-white rounded-2xl border border-gray-200/80 p-4 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between">
            <div>
                {/* Header with Avatar & Details */}
                <div 
                    onClick={() => navigate(`/profile/${user._id}`)} 
                    className="flex items-center gap-3.5 cursor-pointer group mb-3"
                >
                    <img
                        src={user.profile_picture || assets.sample_profile}
                        alt={user.full_name}
                        className="w-13 h-13 rounded-full object-cover border border-gray-200 shrink-0"
                    />
                    <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                            <h4 className="text-[16px] font-bold text-[#1E1B4B] group-hover:text-[#7C3AED] transition-colors truncate">
                                {user.full_name}
                            </h4>
                            {user.is_verified && (
                                <CheckCircle2 className="w-4 h-4 text-[#7C3AED] fill-[#7C3AED]/20 shrink-0" />
                            )}
                        </div>
                        <p className="text-[13px] text-[#6B7280] truncate">
                            @{user.username}
                        </p>
                    </div>
                </div>

                {/* Bio & Location */}
                {user.bio && (
                    <p className="text-[14px] text-[#1E1B4B]/90 line-clamp-2 mb-3 leading-snug">
                        {user.bio}
                    </p>
                )}

                {user.location && (
                    <div className="flex items-center gap-1 text-[13px] text-[#6B7280] mb-4">
                        <MapPin className="w-3.5 h-3.5 text-[#6B7280]" />
                        <span>{user.location}</span>
                    </div>
                )}
            </div>

            {/* Action Buttons */}
            {!isSelf && (
                <div className="pt-3 border-t border-gray-100 flex items-center gap-2">
                    {/* Add Friend / Connect Button */}
                    <button
                        onClick={onConnectClick}
                        disabled={isLoading || connStatus !== 'none'}
                        className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-[14px] font-bold transition-all cursor-pointer ${
                            connStatus === 'accepted'
                                ? 'bg-gray-100 text-[#6B7280] cursor-default'
                                : connStatus === 'pending'
                                ? 'bg-[#7C3AED]/10 text-[#7C3AED]'
                                : 'bg-gradient-to-r from-[#7C3AED] to-[#EC4899] hover:opacity-95 text-white shadow-xs'
                        }`}
                    >
                        {connStatus === 'accepted' ? (
                            <>
                                <Check className="w-4 h-4" /> Friends
                            </>
                        ) : connStatus === 'pending' ? (
                            <>
                                <Check className="w-4 h-4" /> Requested
                            </>
                        ) : (
                            <>
                                <UserPlus className="w-4 h-4" /> Add Friend
                            </>
                        )}
                    </button>

                    {/* Follow Toggle */}
                    <button
                        onClick={onFollowClick}
                        disabled={isLoading}
                        className={`py-2 px-3 rounded-xl text-[14px] font-semibold border transition-colors cursor-pointer ${
                            isFollowing
                                ? 'bg-gray-100 border-transparent text-gray-700'
                                : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-100'
                        }`}
                    >
                        {isFollowing ? 'Following' : 'Follow'}
                    </button>

                    {/* Message Shortcut */}
                    <button
                        onClick={onMessageClick}
                        className="p-2 rounded-xl text-gray-600 hover:bg-gray-100 border border-gray-200 transition-colors cursor-pointer"
                        title="Message"
                    >
                        <MessageCircle className="w-5 h-5" />
                    </button>
                </div>
            )}
        </div>
    );
};

export default UserCard;
