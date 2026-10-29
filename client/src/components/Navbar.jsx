import React, { useState } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { assets } from '../assets/assets.js';
import { useApp } from '../context/AppContext.jsx';
import { Search, Plus, MessageCircle, Home, Users, Compass, Bell } from 'lucide-react';

const Navbar = () => {
    const { currentUser, setIsCreatePostOpen, recentChats } = useApp();
    const [searchQuery, setSearchQuery] = useState('');
    const navigate = useNavigate();
    const location = useLocation();

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/discover?q=${encodeURIComponent(searchQuery.trim())}`);
        }
    };

    const unreadCount = recentChats.reduce((acc, c) => acc + (c.unreadCount || 0), 0);

    const centerNavItems = [
        { to: '/', label: 'Feed', icon: Home },
        { to: '/connections', label: 'Friends', icon: Users },
        { to: '/messages', label: 'Messages', icon: MessageCircle, badge: unreadCount },
        { to: '/discover', label: 'Discover', icon: Compass },
    ];

    return (
        <header className="bg-white border-b border-gray-200 sticky top-0 z-40 px-4 h-15 flex items-center justify-between shadow-xs">
            {/* Left: Branding & Search */}
            <div className="flex items-center gap-3">
                <div 
                    onClick={() => navigate('/')} 
                    className="flex items-center gap-2 cursor-pointer shrink-0"
                >
                    <img src={assets.logo} alt="Vibly" className="w-10 h-10 hover:opacity-95 transition-opacity" />
                    <span className="font-extrabold text-2xl tracking-tight bg-gradient-to-r from-[#7C3AED] via-[#EC4899] to-[#F59E0B] bg-clip-text text-transparent hidden sm:inline">
                        Vibly
                    </span>
                </div>

                <form onSubmit={handleSearchSubmit} className="relative hidden md:block">
                    <Search className="w-4.5 h-4.5 text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search Vibly"
                        className="bg-[#F8F7FF] hover:bg-[#ede9fe]/40 focus:bg-white border border-gray-200 focus:border-[#7C3AED] rounded-full pl-10 pr-4 py-2 text-[15px] text-[#1E1B4B] w-56 lg:w-64 focus:w-80 transition-all duration-200 outline-none placeholder-[#6B7280]"
                    />
                </form>
            </div>

            {/* Center: Facebook-style Tab Navigation (Desktop) */}
            <nav className="hidden sm:flex items-center gap-1 sm:gap-2 h-full">
                {centerNavItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = location.pathname === item.to || (item.to === '/' && location.pathname === '');
                    return (
                        <NavLink
                            key={item.to}
                            to={item.to}
                            end={item.to === '/'}
                            className={`relative px-6 md:px-8 h-full flex items-center justify-center transition-colors group ${
                                isActive ? 'text-[#7C3AED]' : 'text-[#6B7280] hover:bg-[#F8F7FF] hover:text-[#1E1B4B] rounded-xl my-1'
                            }`}
                        >
                            <Icon className="w-6 h-6 transition-transform group-hover:scale-105" />
                            {item.badge > 0 && (
                                <span className="absolute top-2.5 right-4 bg-[#EC4899] text-white text-[11px] font-bold px-1.5 py-0.2 rounded-full min-w-4 text-center">
                                    {item.badge}
                                </span>
                            )}
                            {isActive && (
                                <span className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[#7C3AED] to-[#EC4899] rounded-t-md" />
                            )}
                        </NavLink>
                    );
                })}
            </nav>

            {/* Right: Actions & User Avatar */}
            <div className="flex items-center gap-2.5">
                {/* Create Post Button */}
                <button
                    onClick={() => setIsCreatePostOpen(true)}
                    className="w-10 h-10 bg-[#e4e6eb] hover:bg-[#d8dadf] text-gray-800 rounded-full flex items-center justify-center transition-colors cursor-pointer"
                    title="Create Post"
                >
                    <Plus className="w-5 h-5 stroke-[2.5]" />
                </button>

                {/* Messages shortcut */}
                <button
                    onClick={() => navigate('/messages')}
                    className="w-10 h-10 bg-[#e4e6eb] hover:bg-[#d8dadf] text-gray-800 rounded-full flex items-center justify-center relative transition-colors cursor-pointer"
                    title="Messenger"
                >
                    <MessageCircle className="w-5 h-5" />
                    {unreadCount > 0 && (
                        <span className="absolute -top-1 -right-1 bg-rose-600 text-white text-[11px] font-bold px-1.5 py-0.5 rounded-full border-2 border-white min-w-5 text-center">
                            {unreadCount}
                        </span>
                    )}
                </button>

                {/* Profile Pill */}
                <div 
                    onClick={() => navigate('/profile')} 
                    className="flex items-center gap-2 p-1 pr-3 rounded-full hover:bg-[#F8F7FF] cursor-pointer transition-colors"
                >
                    <img
                        src={currentUser?.profile_picture || assets.sample_profile}
                        alt="Profile"
                        className="w-9 h-9 rounded-full object-cover border border-gray-200"
                    />
                    <span className="text-[14px] font-bold text-gray-800 hidden xl:inline">
                        {currentUser?.full_name?.split(' ')[0]}
                    </span>
                </div>
            </div>
        </header>
    );
};

export default Navbar;
