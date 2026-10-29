import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useClerk } from '@clerk/clerk-react';
import { assets, menuItemsData } from '../assets/assets.js';
import { useApp } from '../context/AppContext.jsx';
import { PlusCircle, LogOut, Bookmark, Clock, Users, MessageCircle, Home, Search, User } from 'lucide-react';

const Sidebar = () => {
    const { currentUser, recentChats, setIsCreatePostOpen } = useApp();
    const navigate = useNavigate();

    let clerk = null;
    try {
        clerk = useClerk();
    } catch {
        clerk = null;
    }

    const unreadMessagesCount = recentChats.reduce((acc, chat) => acc + (chat.unreadCount || 0), 0);

    const handleSignOut = async () => {
        if (clerk?.signOut) {
            await clerk.signOut();
        }
        navigate('/login');
    };

    const navItems = [
        { to: '/', label: 'Feeds', icon: Home, color: 'text-[#7C3AED]' },
        { to: '/connections', label: 'Friends & Connections', icon: Users, color: 'text-[#EC4899]' },
        { to: '/messages', label: 'Messenger', icon: MessageCircle, color: 'text-[#7C3AED]', badge: unreadMessagesCount },
        { to: '/discover', label: 'Discover & Search', icon: Search, color: 'text-[#F59E0B]' },
        { to: '/profile', label: 'Your Profile', icon: User, color: 'text-[#7C3AED]' },
    ];

    return (
        <aside className="w-68 xl:w-76 p-3 flex flex-col justify-between sticky top-[60px] h-[calc(100vh-60px)] overflow-y-auto no-scrollbar shrink-0 select-none">
            <div className="space-y-1">
                {/* Current User Profile Link */}
                <div 
                    onClick={() => navigate('/profile')} 
                    className="flex items-center gap-3.5 p-2.5 rounded-xl hover:bg-[#EDE9FE]/50 cursor-pointer transition-colors"
                >
                    <img
                        src={currentUser?.profile_picture || assets.sample_profile}
                        alt={currentUser?.full_name}
                        className="w-10 h-10 rounded-full object-cover ring-2 ring-[#7C3AED]/30"
                    />
                    <div className="truncate">
                        <p className="text-[15px] font-bold text-[#1E1B4B] truncate">
                            {currentUser?.full_name}
                        </p>
                        <p className="text-[13px] text-[#6B7280] truncate">
                            @{currentUser?.username}
                        </p>
                    </div>
                </div>

                <div className="border-t border-gray-200/60 my-2" />

                {/* Navigation Links */}
                <nav className="space-y-1">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        return (
                            <NavLink
                                key={item.to}
                                to={item.to}
                                end={item.to === '/'}
                                className={({ isActive }) =>
                                    `flex items-center justify-between px-3 py-2.5 rounded-xl text-[15px] font-semibold transition-colors ${
                                        isActive
                                            ? 'bg-gradient-to-r from-[#7C3AED]/15 to-[#EC4899]/10 text-[#7C3AED] shadow-xs'
                                            : 'text-[#1E1B4B] hover:bg-[#EDE9FE]/40'
                                    }`
                                }
                            >
                                <div className="flex items-center gap-3.5">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${item.color}`}>
                                        <Icon className="w-6 h-6" />
                                    </div>
                                    <span>{item.label}</span>
                                </div>
                                {item.badge > 0 && (
                                    <span className="bg-[#EC4899] text-white text-xs font-bold px-2 py-0.5 rounded-full">
                                        {item.badge}
                                    </span>
                                )}
                            </NavLink>
                        );
                    })}
                </nav>

                <div className="border-t border-gray-200/60 my-3" />

                {/* Create Post Action Button */}
                <div className="px-1">
                    <button
                        onClick={() => setIsCreatePostOpen(true)}
                        className="w-full flex items-center justify-center gap-2.5 bg-gradient-to-r from-[#7C3AED] to-[#EC4899] hover:opacity-95 text-white font-bold py-2.5 px-4 rounded-xl shadow-md transition-all cursor-pointer text-[15px] hover:shadow-lg"
                    >
                        <PlusCircle className="w-5 h-5" />
                        <span>Create New Post</span>
                    </button>
                </div>
            </div>

            {/* Bottom Meta & Sign Out */}
            <div className="pt-4 border-t border-gray-200/60 mt-4 space-y-2">
                <button
                    onClick={handleSignOut}
                    className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-[14px] font-semibold text-[#6B7280] hover:bg-red-50 hover:text-red-600 transition-colors cursor-pointer"
                >
                    <LogOut className="w-5 h-5" />
                    <span>Log Out</span>
                </button>
                <p className="text-[12px] text-[#6B7280] px-3">
                    Vibly © 2026 · Privacy · Terms · GreatStack
                </p>
            </div>
        </aside>
    );
};

export default Sidebar;
