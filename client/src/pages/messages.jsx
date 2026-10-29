import React, { useState } from 'react';
import { useApp } from '../context/AppContext.jsx';
import ChatBox from './chatBox.jsx';
import { assets } from '../assets/assets.js';
import { Search, MessageSquarePlus, CheckCircle2 } from 'lucide-react';

const Messages = () => {
    const { recentChats, activeChatPartner, setActiveChatPartner } = useApp();
    const [searchQuery, setSearchQuery] = useState('');

    const filteredChats = recentChats.filter((chat) => {
        const name = chat.partner?.full_name || '';
        const username = chat.partner?.username || '';
        const q = searchQuery.toLowerCase();
        return name.toLowerCase().includes(q) || username.toLowerCase().includes(q);
    });

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 h-[calc(100vh-130px)] min-h-[550px]">
            {/* Left Thread List (Hidden on mobile when chat is active) */}
            <div className={`bg-white rounded-2xl border border-gray-100 p-4 shadow-sm flex flex-col h-full ${
                activeChatPartner ? 'hidden md:flex' : 'flex'
            }`}>
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-2xl font-bold text-[#1E1B4B]">Chats</h2>
                    <span className="text-xs bg-[#7C3AED]/10 text-[#7C3AED] font-bold px-2.5 py-0.5 rounded-full">
                        {recentChats.length} active
                    </span>
                </div>

                {/* Search */}
                <div className="relative mb-3">
                    <Search className="w-4 h-4 text-[#6B7280] absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search Messenger"
                        className="w-full bg-[#F8F7FF] hover:bg-[#EDE9FE]/30 focus:bg-white border border-gray-200 focus:border-[#7C3AED] rounded-full pl-10 pr-3 py-2 text-[14px] text-[#1E1B4B] outline-none transition-colors placeholder-[#6B7280]"
                    />
                </div>

                {/* Conversation List */}
                <div className="flex-1 overflow-y-auto space-y-1 no-scrollbar">
                    {filteredChats.length > 0 ? (
                        filteredChats.map((chat, idx) => {
                            const isSelected = activeChatPartner?._id === chat.partner?._id;
                            return (
                                <div
                                    key={chat.partner?._id || idx}
                                    onClick={() => setActiveChatPartner(chat.partner)}
                                    className={`flex items-center gap-3 p-3 rounded-2xl cursor-pointer transition-colors ${
                                        isSelected
                                            ? 'bg-gradient-to-r from-[#7C3AED]/15 to-[#EC4899]/10 border border-[#7C3AED]/30'
                                            : 'hover:bg-[#EDE9FE]/30'
                                    }`}
                                >
                                    <div className="relative shrink-0">
                                        <img
                                            src={chat.partner?.profile_picture || assets.sample_profile}
                                            alt={chat.partner?.full_name}
                                            className="w-12 h-12 rounded-full object-cover ring-1 ring-gray-200"
                                        />
                                        <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-white" />
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-1 truncate">
                                                <h4 className="text-[15px] font-bold text-[#1E1B4B] truncate">
                                                    {chat.partner?.full_name || 'Member'}
                                                </h4>
                                                {chat.partner?.is_verified && (
                                                    <CheckCircle2 className="w-3.5 h-3.5 text-[#7C3AED] fill-[#7C3AED]/20 shrink-0" />
                                                )}
                                            </div>
                                            <span className="text-[12px] text-[#6B7280]">
                                                {chat.lastMessage?.createdAt
                                                    ? new Date(chat.lastMessage.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                                                    : ''}
                                            </span>
                                        </div>

                                        <div className="flex items-center justify-between mt-0.5">
                                            <p className="text-[13px] text-[#6B7280] truncate">
                                                {chat.lastMessage?.text || (chat.lastMessage?.media_url ? '📷 Image attachment' : 'Start chatting')}
                                            </p>
                                            {chat.unreadCount > 0 && (
                                                <span className="bg-[#EC4899] text-white text-[11px] font-bold px-2 py-0.5 rounded-full">
                                                    {chat.unreadCount}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <div className="text-center py-10 text-gray-400">
                            <MessageSquarePlus className="w-10 h-10 mx-auto mb-2 text-gray-300" />
                            <p className="text-xs font-medium">No conversations found</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Right Chat Panel */}
            <div className={`md:col-span-2 h-full ${
                !activeChatPartner ? 'hidden md:block' : 'block'
            }`}>
                <ChatBox
                    partner={activeChatPartner || recentChats[0]?.partner}
                    onBack={() => setActiveChatPartner(null)}
                />
            </div>
        </div>
    );
};

export default Messages;
