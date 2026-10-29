import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useApp } from '../context/AppContext.jsx';
import { api } from '../api/api.js';
import UserCard from '../components/UserCard.jsx';
import { Search, Compass, Users } from 'lucide-react';

const CATEGORIES = ['All', 'Developers', 'Designers', 'Founders', 'Tech'];

const Discover = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const queryParam = searchParams.get('q') || '';

    const [query, setQuery] = useState(queryParam);
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [users, setUsers] = useState([]);
    const [isSearching, setIsSearching] = useState(false);

    useEffect(() => {
        setQuery(queryParam);
    }, [queryParam]);

    useEffect(() => {
        const fetchUsers = async () => {
            setIsSearching(true);
            try {
                if (query.trim()) {
                    const searchResults = await api.searchUsers(query);
                    setUsers(searchResults || []);
                } else {
                    const discoverResults = await api.discoverUsers();
                    setUsers(discoverResults || []);
                }
            } finally {
                setIsSearching(false);
            }
        };

        const debounce = setTimeout(fetchUsers, 300);
        return () => clearTimeout(debounce);
    }, [query]);

    const handleCategoryClick = (cat) => {
        setSelectedCategory(cat);
        if (cat === 'All') {
            setQuery('');
            setSearchParams({});
        } else {
            setQuery(cat);
            setSearchParams({ q: cat });
        }
    };

    return (
        <div className="space-y-5">
            {/* Header Banner */}
            <div className="bg-gradient-to-r from-[#7C3AED] via-[#EC4899] to-[#F59E0B] rounded-3xl p-6 sm:p-8 text-white shadow-xl shadow-[#7C3AED]/20 relative overflow-hidden">
                <div className="relative z-10 max-w-lg">
                    <div className="flex items-center gap-2 mb-2">
                        <Compass className="w-5 h-5 text-white/90" />
                        <span className="text-xs uppercase font-extrabold tracking-wider text-white/90">
                            Discover
                        </span>
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-extrabold mb-2">
                        Find & Connect with Creators
                    </h2>
                    <p className="text-[15px] text-white/90 leading-relaxed">
                        Explore engineers, founders, and designers sharing real-world insights and updates on Vibly.
                    </p>

                    {/* Search Bar */}
                    <div className="relative mt-5">
                        <Search className="w-5 h-5 text-[#6B7280] absolute left-4 top-1/2 -translate-y-1/2" />
                        <input
                            type="text"
                            value={query}
                            onChange={(e) => {
                                setQuery(e.target.value);
                                setSearchParams(e.target.value ? { q: e.target.value } : {});
                            }}
                            placeholder="Search by name, handle, role, or interest..."
                            className="w-full bg-white text-[#1E1B4B] rounded-full pl-12 pr-4 py-3.5 text-[15px] placeholder-[#6B7280] focus:outline-none shadow-md"
                        />
                    </div>
                </div>
            </div>

            {/* Category Pills */}
            <div className="flex gap-2 overflow-x-auto no-scrollbar py-1">
                {CATEGORIES.map((cat) => (
                    <button
                        key={cat}
                        onClick={() => handleCategoryClick(cat)}
                        className={`text-[14px] font-bold px-4 py-2 rounded-full transition-all shrink-0 cursor-pointer ${
                            selectedCategory === cat
                                ? 'bg-gradient-to-r from-[#7C3AED] to-[#EC4899] text-white shadow-xs'
                                : 'bg-white text-[#6B7280] border border-gray-200 hover:text-[#1E1B4B] hover:bg-[#EDE9FE]/30'
                        }`}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            {/* Users Grid */}
            {isSearching ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[1, 2, 3, 4, 5, 6].map((n) => (
                        <div key={n} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm animate-pulse space-y-3">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 bg-gray-200 rounded-full" />
                                <div className="space-y-1.5 flex-1">
                                    <div className="w-24 h-3 bg-gray-200 rounded" />
                                    <div className="w-16 h-2.5 bg-gray-200 rounded" />
                                </div>
                            </div>
                            <div className="w-full h-8 bg-gray-100 rounded" />
                        </div>
                    ))}
                </div>
            ) : users.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {users.map((user) => (
                        <UserCard key={user._id} user={user} />
                    ))}
                </div>
            ) : (
                <div className="bg-white rounded-2xl p-10 border border-gray-100 text-center text-gray-400">
                    <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <h3 className="text-sm font-bold text-gray-700">No users found</h3>
                    <p className="text-xs text-gray-400 mt-1">
                        Try searching for a different keyword or username.
                    </p>
                </div>
            )}
        </div>
    );
};

export default Discover;
