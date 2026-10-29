import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext.jsx';
import { assets } from '../assets/assets.js';
import { Users, UserCheck, Clock, UserPlus, Check, X, MessageCircle, CheckCircle2 } from 'lucide-react';

const Connections = () => {
    const {
        connectionsData,
        handleAcceptConnection,
        handleRejectConnection,
        handleFollowToggle,
        setActiveChatPartner,
    } = useApp();
    const navigate = useNavigate();

    const [activeTab, setActiveTab] = useState('connections'); // 'connections' | 'pending' | 'followers' | 'following'

    const {
        connections = [],
        followers = [],
        following = [],
        pendingReceived = [],
        pendingSent = [],
    } = connectionsData || {};

    const onMessageUser = (user) => {
        setActiveChatPartner(user);
        navigate('/messages');
    };

    return (
        <div className="space-y-5">
            {/* Page Header */}
            <div className="bg-white rounded-2xl p-5 border border-gray-200/80 shadow-xs flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-[#1E1B4B]">Friends & Network</h2>
                    <p className="text-[14px] text-[#6B7280] mt-0.5">Manage your friends, connection requests, and followers.</p>
                </div>
                <div className="flex items-center gap-1.5 text-[14px] font-bold bg-[#7C3AED]/10 text-[#7C3AED] px-3.5 py-1.5 rounded-xl">
                    <Users className="w-4.5 h-4.5" />
                    <span>{connections.length} Friends</span>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex bg-white p-1.5 rounded-2xl border border-gray-200/80 shadow-xs overflow-x-auto no-scrollbar gap-1">
                <button
                    onClick={() => setActiveTab('connections')}
                    className={`flex-1 min-w-[120px] py-2.5 px-3 rounded-xl text-[14px] font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                        activeTab === 'connections'
                            ? 'bg-gradient-to-r from-[#7C3AED] to-[#EC4899] text-white shadow-xs'
                            : 'text-[#6B7280] hover:text-[#1E1B4B] hover:bg-[#EDE9FE]/30'
                    }`}
                >
                    <UserCheck className="w-4 h-4" />
                    <span>All Friends ({connections.length})</span>
                </button>

                <button
                    onClick={() => setActiveTab('pending')}
                    className={`flex-1 min-w-[120px] py-2.5 px-3 rounded-xl text-[14px] font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                        activeTab === 'pending'
                            ? 'bg-gradient-to-r from-[#7C3AED] to-[#EC4899] text-white shadow-xs'
                            : 'text-[#6B7280] hover:text-[#1E1B4B] hover:bg-[#EDE9FE]/30'
                    }`}
                >
                    <Clock className="w-4 h-4" />
                    <span>Requests ({pendingReceived.length})</span>
                </button>

                <button
                    onClick={() => setActiveTab('followers')}
                    className={`flex-1 min-w-[120px] py-2.5 px-3 rounded-xl text-[14px] font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                        activeTab === 'followers'
                            ? 'bg-gradient-to-r from-[#7C3AED] to-[#EC4899] text-white shadow-xs'
                            : 'text-[#6B7280] hover:text-[#1E1B4B] hover:bg-[#EDE9FE]/30'
                    }`}
                >
                    <span>Followers ({followers.length})</span>
                </button>

                <button
                    onClick={() => setActiveTab('following')}
                    className={`flex-1 min-w-[120px] py-2.5 px-3 rounded-xl text-[14px] font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                        activeTab === 'following'
                            ? 'bg-gradient-to-r from-[#7C3AED] to-[#EC4899] text-white shadow-xs'
                            : 'text-[#6B7280] hover:text-[#1E1B4B] hover:bg-[#EDE9FE]/30'
                    }`}
                >
                    <span>Following ({following.length})</span>
                </button>
            </div>

            {/* Tab 1: Mutual Connections */}
            {activeTab === 'connections' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {connections.length > 0 ? (
                        connections.map((user) => (
                            <div key={user._id} className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm flex items-center justify-between gap-3">
                                <div 
                                    onClick={() => navigate(`/profile/${user._id}`)}
                                    className="flex items-center gap-3 cursor-pointer min-w-0"
                                >
                                    <img
                                        src={user.profile_picture || assets.sample_profile}
                                        alt={user.full_name}
                                        className="w-11 h-11 rounded-full object-cover border border-violet-50"
                                    />
                                    <div className="truncate">
                                        <div className="flex items-center gap-1">
                                            <h4 className="text-xs font-bold text-gray-900 truncate">{user.full_name}</h4>
                                            {user.is_verified && <CheckCircle2 className="w-3 h-3 text-violet-600 fill-violet-100" />}
                                        </div>
                                        <p className="text-[11px] text-gray-400 truncate">@{user.username}</p>
                                    </div>
                                </div>

                                <button
                                    onClick={() => onMessageUser(user)}
                                    className="p-2 rounded-xl bg-violet-50 hover:bg-violet-100 text-violet-600 transition-colors"
                                    title="Message"
                                >
                                    <MessageCircle className="w-4 h-4" />
                                </button>
                            </div>
                        ))
                    ) : (
                        <div className="col-span-full bg-white rounded-2xl p-8 border border-gray-100 text-center text-gray-400">
                            <Users className="w-10 h-10 mx-auto mb-2 text-gray-300" />
                            <p className="text-xs font-semibold text-gray-700">No connections yet</p>
                            <p className="text-[11px] text-gray-400 mt-1">Explore Discover to find and connect with peers!</p>
                        </div>
                    )}
                </div>
            )}

            {/* Tab 2: Pending Requests */}
            {activeTab === 'pending' && (
                <div className="space-y-6">
                    {/* Received Requests */}
                    <div>
                        <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Received Requests</h3>
                        {pendingReceived.length > 0 ? (
                            <div className="space-y-3">
                                {pendingReceived.map((user) => (
                                    <div key={user._id} className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm flex items-center justify-between gap-3">
                                        <div 
                                            onClick={() => navigate(`/profile/${user._id}`)}
                                            className="flex items-center gap-3 cursor-pointer min-w-0"
                                        >
                                            <img
                                                src={user.profile_picture || assets.sample_profile}
                                                alt={user.full_name}
                                                className="w-11 h-11 rounded-full object-cover border border-violet-50"
                                            />
                                            <div className="truncate">
                                                <h4 className="text-xs font-bold text-gray-900 truncate">{user.full_name}</h4>
                                                <p className="text-[11px] text-gray-400 truncate">@{user.username}</p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => handleAcceptConnection(user._id)}
                                                className="flex items-center gap-1 bg-violet-600 hover:bg-violet-700 text-white text-xs font-semibold px-3 py-1.5 rounded-xl transition-all shadow-sm"
                                            >
                                                <Check className="w-3.5 h-3.5" />
                                                <span>Accept</span>
                                            </button>
                                            <button
                                                onClick={() => handleRejectConnection(user._id)}
                                                className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                                                title="Decline"
                                            >
                                                <X className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-xs text-gray-400 bg-white p-6 rounded-2xl border border-gray-100 text-center">
                                No incoming friend or connection requests.
                            </p>
                        )}
                    </div>
                </div>
            )}

            {/* Tab 3: Followers */}
            {activeTab === 'followers' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {followers.length > 0 ? (
                        followers.map((user) => (
                            <div key={user._id} className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm flex items-center justify-between gap-3">
                                <div 
                                    onClick={() => navigate(`/profile/${user._id}`)}
                                    className="flex items-center gap-3 cursor-pointer min-w-0"
                                >
                                    <img
                                        src={user.profile_picture || assets.sample_profile}
                                        alt={user.full_name}
                                        className="w-11 h-11 rounded-full object-cover border border-violet-50"
                                    />
                                    <div className="truncate">
                                        <h4 className="text-xs font-bold text-gray-900 truncate">{user.full_name}</h4>
                                        <p className="text-[11px] text-gray-400 truncate">@{user.username}</p>
                                    </div>
                                </div>

                                <button
                                    onClick={() => handleFollowToggle(user._id, false)}
                                    className="text-xs font-semibold text-violet-600 bg-violet-50 hover:bg-violet-100 px-3 py-1.5 rounded-xl transition-colors"
                                >
                                    Follow Back
                                </button>
                            </div>
                        ))
                    ) : (
                        <div className="col-span-full bg-white rounded-2xl p-8 border border-gray-100 text-center text-gray-400">
                            <p className="text-xs">No followers yet.</p>
                        </div>
                    )}
                </div>
            )}

            {/* Tab 4: Following */}
            {activeTab === 'following' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {following.length > 0 ? (
                        following.map((user) => (
                            <div key={user._id} className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm flex items-center justify-between gap-3">
                                <div 
                                    onClick={() => navigate(`/profile/${user._id}`)}
                                    className="flex items-center gap-3 cursor-pointer min-w-0"
                                >
                                    <img
                                        src={user.profile_picture || assets.sample_profile}
                                        alt={user.full_name}
                                        className="w-11 h-11 rounded-full object-cover border border-violet-50"
                                    />
                                    <div className="truncate">
                                        <h4 className="text-xs font-bold text-gray-900 truncate">{user.full_name}</h4>
                                        <p className="text-[11px] text-gray-400 truncate">@{user.username}</p>
                                    </div>
                                </div>

                                <button
                                    onClick={() => handleFollowToggle(user._id, true)}
                                    className="text-xs font-semibold text-gray-600 bg-gray-100 hover:bg-red-50 hover:text-red-600 px-3 py-1.5 rounded-xl transition-colors"
                                >
                                    Following
                                </button>
                            </div>
                        ))
                    ) : (
                        <div className="col-span-full bg-white rounded-2xl p-8 border border-gray-100 text-center text-gray-400">
                            <p className="text-xs">You are not following anyone yet.</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default Connections;
