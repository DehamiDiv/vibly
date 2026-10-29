import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { assets } from '../assets/assets.js';
import { useApp } from '../context/AppContext.jsx';
import { UserPlus, Sparkles, TrendingUp, Check, Search, MoreHorizontal } from 'lucide-react';

const RightSidebar = () => {
    const { currentUser, connectionsData, handleSendConnection, setActiveChatPartner } = useApp();
    const navigate = useNavigate();
    const [sentRequests, setSentRequests] = useState(new Set());

    const contacts = [
        {
            _id: 'user_2',
            full_name: 'Richard Hendricks',
            username: 'richard_h',
            profile_picture: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200',
            online: true,
        },
        {
            _id: 'user_3',
            full_name: 'Alexa James',
            username: 'alexa_j',
            profile_picture: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=200',
            online: true,
        },
    ];

    const onConnectClick = async (userId) => {
        await handleSendConnection(userId);
        setSentRequests((prev) => new Set(prev).add(userId));
    };

    const onContactClick = (user) => {
        setActiveChatPartner(user);
        navigate('/messages');
    };

    return (
        <aside className="w-72 xl:w-80 p-3 space-y-5 hidden lg:block sticky top-[60px] h-[calc(100vh-60px)] overflow-y-auto no-scrollbar shrink-0 select-none">
            {/* Sponsored Section (Facebook style) */}
            <div className="border-b border-gray-200/70 pb-4">
                <h4 className="text-[14px] font-bold text-[#6B7280] uppercase tracking-wider mb-3">
                    Sponsored
                </h4>
                <a
                    href="https://greatstack.dev"
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-3 p-2 rounded-xl hover:bg-[#EDE9FE]/40 transition-colors group cursor-pointer"
                >
                    <img
                        src={assets.sponsored_img}
                        alt="Sponsored content"
                        className="w-24 h-24 object-cover rounded-xl shrink-0"
                    />
                    <div className="truncate">
                        <h5 className="text-[14px] font-bold text-[#1E1B4B] group-hover:text-[#7C3AED] transition-colors truncate">
                            GreatStack Dev Courses
                        </h5>
                        <p className="text-[12px] text-[#6B7280] truncate mt-0.5">
                            greatstack.dev
                        </p>
                        <p className="text-[13px] text-[#6B7280] line-clamp-2 mt-1 leading-snug">
                            Master Full Stack MERN & modern AI-powered applications.
                        </p>
                    </div>
                </a>
            </div>

            {/* Suggested People / Who to follow */}
            <div className="border-b border-gray-200/70 pb-4">
                <div className="flex items-center justify-between mb-3 px-1">
                    <h4 className="text-[14px] font-bold text-[#6B7280] uppercase tracking-wider">
                        Suggested For You
                    </h4>
                    <button
                        onClick={() => navigate('/discover')}
                        className="text-[13px] font-bold text-[#7C3AED] hover:text-[#EC4899] transition-colors cursor-pointer"
                    >
                        See all
                    </button>
                </div>

                <div className="space-y-2">
                    {contacts.map((user) => {
                        const isSent = sentRequests.has(user._id);
                        return (
                            <div key={user._id} className="flex items-center justify-between p-2 rounded-xl hover:bg-[#EDE9FE]/40 transition-colors">
                                <div 
                                    onClick={() => navigate(`/profile/${user._id}`)} 
                                    className="flex items-center gap-3 cursor-pointer min-w-0"
                                >
                                    <img
                                        src={user.profile_picture}
                                        alt={user.full_name}
                                        className="w-10 h-10 rounded-full object-cover shrink-0 ring-1 ring-gray-200"
                                    />
                                    <div className="truncate">
                                        <p className="text-[14px] font-bold text-[#1E1B4B] truncate hover:text-[#7C3AED] transition-colors">
                                            {user.full_name}
                                        </p>
                                        <p className="text-[12px] text-[#6B7280] truncate">
                                            @{user.username}
                                        </p>
                                    </div>
                                </div>

                                <button
                                    onClick={() => onConnectClick(user._id)}
                                    disabled={isSent}
                                    className={`px-3 py-1.5 rounded-lg text-[13px] font-semibold flex items-center gap-1 transition-colors cursor-pointer shrink-0 ${
                                        isSent
                                            ? 'bg-gray-200 text-[#6B7280]'
                                            : 'bg-gradient-to-r from-[#7C3AED]/15 to-[#EC4899]/15 text-[#7C3AED] hover:from-[#7C3AED]/25 hover:to-[#EC4899]/25'
                                    }`}
                                >
                                    {isSent ? (
                                        <>
                                            <Check className="w-3.5 h-3.5" /> Sent
                                        </>
                                    ) : (
                                        <>
                                            <UserPlus className="w-3.5 h-3.5" /> Add
                                        </>
                                    )}
                                </button>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Contacts / Online Friends (Facebook style) */}
            <div>
                <div className="flex items-center justify-between mb-2 px-1 text-[#6B7280]">
                    <h4 className="text-[14px] font-bold uppercase tracking-wider">
                        Contacts
                    </h4>
                    <div className="flex items-center gap-1">
                        <button className="p-1 hover:bg-[#EDE9FE]/50 rounded-full text-[#6B7280]" title="Search contacts">
                            <Search className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                <div className="space-y-1">
                    {contacts.map((contact) => (
                        <div
                            key={contact._id}
                            onClick={() => onContactClick(contact)}
                            className="flex items-center gap-3 p-2 rounded-xl hover:bg-[#EDE9FE]/40 cursor-pointer transition-colors group"
                        >
                            <div className="relative shrink-0">
                                <img
                                    src={contact.profile_picture}
                                    alt={contact.full_name}
                                    className="w-9 h-9 rounded-full object-cover ring-1 ring-gray-200"
                                />
                                <span className="w-3 h-3 bg-emerald-500 border-2 border-white rounded-full absolute bottom-0 right-0" />
                            </div>
                            <span className="text-[14px] font-semibold text-[#1E1B4B] group-hover:text-[#7C3AED] transition-colors truncate">
                                {contact.full_name}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </aside>
    );
};

export default RightSidebar;
