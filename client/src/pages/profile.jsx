import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext.jsx';
import { api } from '../api/api.js';
import PostCard from '../components/PostCard.jsx';
import { assets } from '../assets/assets.js';
import { 
    MapPin, 
    Calendar, 
    Edit3, 
    UserPlus, 
    UserCheck, 
    MessageCircle, 
    CheckCircle2, 
    Image as ImageIcon, 
    FileText,
    Check
} from 'lucide-react';

const Profile = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { 
        currentUser, 
        setIsEditProfileOpen, 
        handleSendConnection, 
        handleFollowToggle,
        setActiveChatPartner 
    } = useApp();

    const isOwnProfile = !id || id === currentUser?._id;
    const targetUserId = id || currentUser?._id;

    const [profileUser, setProfileUser] = useState(isOwnProfile ? currentUser : null);
    const [userPosts, setUserPosts] = useState([]);
    const [connectionStatus, setConnectionStatus] = useState('none');
    const [isFollowing, setIsFollowing] = useState(false);
    const [activeTab, setActiveTab] = useState('posts'); // 'posts' | 'media'
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchProfile = async () => {
            setIsLoading(true);
            try {
                if (isOwnProfile) {
                    setProfileUser(currentUser);
                    const res = await api.getUserProfile(currentUser?._id);
                    setUserPosts(res.posts || []);
                } else {
                    const res = await api.getUserProfile(targetUserId);
                    setProfileUser(res.user);
                    setUserPosts(res.posts || []);
                    setConnectionStatus(res.connectionStatus || 'none');
                    setIsFollowing(res.isFollowing || false);
                }
            } finally {
                setIsLoading(false);
            }
        };

        fetchProfile();
    }, [id, currentUser, isOwnProfile, targetUserId]);

    const onConnectClick = async () => {
        if (connectionStatus !== 'none') return;
        await handleSendConnection(profileUser._id);
        setConnectionStatus('pending');
    };

    const onFollowClick = async () => {
        await handleFollowToggle(profileUser._id, isFollowing);
        setIsFollowing(!isFollowing);
    };

    const onMessageClick = () => {
        setActiveChatPartner(profileUser);
        navigate('/messages');
    };

    if (isLoading || !profileUser) {
        return (
            <div className="bg-white rounded-3xl p-6 border border-gray-100 animate-pulse space-y-4">
                <div className="h-44 bg-gray-200 rounded-2xl" />
                <div className="flex gap-4 items-end -mt-12 px-4">
                    <div className="w-24 h-24 bg-gray-300 rounded-full border-4 border-white" />
                </div>
                <div className="h-6 w-44 bg-gray-200 rounded mt-4" />
                <div className="h-4 w-64 bg-gray-100 rounded" />
            </div>
        );
    }

    const mediaPosts = userPosts.filter((p) => p.image_urls && p.image_urls.length > 0);

    return (
        <div className="space-y-5">
            {/* Profile Header Card */}
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                {/* Cover Photo */}
                <div className="h-44 sm:h-52 bg-gradient-to-r from-[#7C3AED] via-[#EC4899] to-[#F59E0B] relative">
                    {profileUser.cover_photo && (
                        <img
                            src={profileUser.cover_photo}
                            alt="Cover"
                            className="w-full h-full object-cover"
                        />
                    )}
                </div>

                {/* Profile Details Container */}
                <div className="px-6 pb-6 pt-0 relative">
                    <div className="flex flex-col sm:flex-row sm:items-end justify-between -mt-14 mb-4 gap-4">
                        {/* Avatar */}
                        <div className="relative inline-block">
                            <img
                                src={profileUser.profile_picture || assets.sample_profile}
                                alt={profileUser.full_name}
                                className="w-28 h-28 rounded-full object-cover border-4 border-white shadow-md bg-white ring-2 ring-[#7C3AED]/20"
                            />
                            {profileUser.is_verified && (
                                <div className="absolute bottom-1 right-1 bg-white p-1 rounded-full shadow-sm">
                                    <CheckCircle2 className="w-5 h-5 text-[#7C3AED] fill-[#7C3AED]/20" />
                                </div>
                            )}
                        </div>

                        {/* Profile Action Buttons */}
                        <div className="flex items-center gap-2">
                            {isOwnProfile ? (
                                <button
                                    onClick={() => setIsEditProfileOpen(true)}
                                    className="flex items-center gap-1.5 bg-[#EDE9FE]/50 hover:bg-[#EDE9FE] text-[#7C3AED] text-xs font-bold px-4 py-2.5 rounded-xl transition-colors cursor-pointer"
                                >
                                    <Edit3 className="w-4 h-4" />
                                    <span>Edit Profile</span>
                                </button>
                            ) : (
                                <>
                                    {/* Connect */}
                                    <button
                                        onClick={onConnectClick}
                                        disabled={connectionStatus !== 'none'}
                                        className={`flex items-center gap-1.5 text-xs font-bold px-4 py-2.5 rounded-xl transition-all shadow-sm cursor-pointer ${
                                            connectionStatus === 'accepted'
                                                ? 'bg-gray-100 text-[#6B7280]'
                                                : connectionStatus === 'pending'
                                                ? 'bg-[#7C3AED]/10 text-[#7C3AED]'
                                                : 'bg-gradient-to-r from-[#7C3AED] to-[#EC4899] text-white hover:opacity-95'
                                        }`}
                                    >
                                        {connectionStatus === 'accepted' ? (
                                            <>
                                                <Check className="w-4 h-4" /> Friends
                                            </>
                                        ) : connectionStatus === 'pending' ? (
                                            <>
                                                <Check className="w-4 h-4" /> Requested
                                            </>
                                        ) : (
                                            <>
                                                <UserPlus className="w-4 h-4" /> Add Friend
                                            </>
                                        )}
                                    </button>

                                    {/* Follow */}
                                    <button
                                        onClick={onFollowClick}
                                        className="text-xs font-semibold px-4 py-2.5 rounded-xl border border-gray-200 text-[#1E1B4B] hover:bg-gray-50 transition-colors cursor-pointer"
                                    >
                                        {isFollowing ? 'Following' : 'Follow'}
                                    </button>

                                    {/* Message */}
                                    <button
                                        onClick={onMessageClick}
                                        className="p-2.5 text-[#7C3AED] bg-[#7C3AED]/10 hover:bg-[#7C3AED]/20 rounded-xl transition-colors cursor-pointer"
                                        title="Message"
                                    >
                                        <MessageCircle className="w-4 h-4" />
                                    </button>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Name & Bio */}
                    <div className="space-y-2.5">
                        <div>
                            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1E1B4B] leading-tight">
                                {profileUser.full_name}
                            </h2>
                            <p className="text-[15px] text-[#6B7280]">
                                @{profileUser.username}
                            </p>
                        </div>

                        {profileUser.bio && (
                            <p className="text-[15px] text-[#1E1B4B]/90 whitespace-pre-line leading-relaxed max-w-xl">
                                {profileUser.bio}
                            </p>
                        )}

                        <div className="flex flex-wrap items-center gap-4 text-[14px] text-[#6B7280] pt-2">
                            {profileUser.location && (
                                <div className="flex items-center gap-1.5">
                                    <MapPin className="w-4 h-4 text-[#6B7280]" />
                                    <span>{profileUser.location}</span>
                                </div>
                            )}
                            <div className="flex items-center gap-1.5">
                                <Calendar className="w-4 h-4 text-[#6B7280]" />
                                <span>Joined {new Date(profileUser.createdAt || Date.now()).toLocaleDateString([], { month: 'short', year: 'numeric' })}</span>
                            </div>
                        </div>
                    </div>

                    {/* Counts Row */}
                    <div className="flex items-center gap-6 pt-5 mt-5 border-t border-gray-100 text-[15px]">
                        <div>
                            <span className="font-bold text-[#1E1B4B]">{userPosts.length}</span>{' '}
                            <span className="text-[#6B7280]">Posts</span>
                        </div>
                        <div>
                            <span className="font-bold text-[#1E1B4B]">{profileUser.followers?.length || 0}</span>{' '}
                            <span className="text-[#6B7280]">Followers</span>
                        </div>
                        <div>
                            <span className="font-bold text-[#1E1B4B]">{profileUser.following?.length || 0}</span>{' '}
                            <span className="text-[#6B7280]">Following</span>
                        </div>
                        <div>
                            <span className="font-bold text-[#1E1B4B]">{profileUser.connections?.length || 0}</span>{' '}
                            <span className="text-[#6B7280]">Friends</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Profile Tabs */}
            <div className="flex bg-white p-1 rounded-2xl border border-gray-200/80 shadow-xs">
                <button
                    onClick={() => setActiveTab('posts')}
                    className={`flex-1 py-3 text-[15px] font-bold rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer ${
                        activeTab === 'posts'
                            ? 'bg-gradient-to-r from-[#7C3AED] to-[#EC4899] text-white shadow-xs'
                            : 'text-[#6B7280] hover:text-[#1E1B4B] hover:bg-[#EDE9FE]/30'
                    }`}
                >
                    <FileText className="w-4 h-4" />
                    <span>Posts ({userPosts.length})</span>
                </button>
                <button
                    onClick={() => setActiveTab('media')}
                    className={`flex-1 py-3 text-[15px] font-bold rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer ${
                        activeTab === 'media'
                            ? 'bg-gradient-to-r from-[#7C3AED] to-[#EC4899] text-white shadow-xs'
                            : 'text-[#6B7280] hover:text-[#1E1B4B] hover:bg-[#EDE9FE]/30'
                    }`}
                >
                    <ImageIcon className="w-4 h-4" />
                    <span>Photos & Media ({mediaPosts.length})</span>
                </button>
            </div>

            {/* Tab Content: Posts */}
            {activeTab === 'posts' && (
                <div className="space-y-4">
                    {userPosts.length > 0 ? (
                        userPosts.map((post) => (
                            <PostCard key={post._id} post={post} />
                        ))
                    ) : (
                        <div className="bg-white rounded-2xl p-8 border border-gray-100 text-center text-gray-400">
                            <p className="text-xs">No posts shared yet.</p>
                        </div>
                    )}
                </div>
            )}

            {/* Tab Content: Media Gallery */}
            {activeTab === 'media' && (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {mediaPosts.length > 0 ? (
                        mediaPosts.flatMap((post) =>
                            (post.image_urls || []).map((imgUrl, i) => (
                                <div key={`${post._id}_${i}`} className="h-44 rounded-2xl overflow-hidden bg-gray-100 border border-gray-200">
                                    <img src={imgUrl} alt="Media" className="w-full h-full object-cover hover:scale-105 transition-transform" />
                                </div>
                            ))
                        )
                    ) : (
                        <div className="col-span-full bg-white rounded-2xl p-8 border border-gray-100 text-center text-gray-400">
                            <p className="text-xs">No media uploaded yet.</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default Profile;
