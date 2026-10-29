import React, { useState } from 'react';
import { useApp } from '../context/AppContext.jsx';
import { X, User, MapPin, FileText, Camera } from 'lucide-react';

const EditProfileModal = () => {
    const { currentUser, isEditProfileOpen, setIsEditProfileOpen, handleUpdateProfile } = useApp();

    const [fullName, setFullName] = useState(currentUser?.full_name || '');
    const [bio, setBio] = useState(currentUser?.bio || '');
    const [location, setLocation] = useState(currentUser?.location || '');
    const [profilePic, setProfilePic] = useState(currentUser?.profile_picture || '');
    const [coverPhoto, setCoverPhoto] = useState(currentUser?.cover_photo || '');
    const [isSaving, setIsSaving] = useState(false);

    if (!isEditProfileOpen) return null;

    const handleProfilePicFile = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setProfilePic(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleCoverPhotoFile = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setCoverPhoto(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            await handleUpdateProfile({
                full_name: fullName,
                bio,
                location,
                profile_picture: profilePic,
                cover_photo: coverPhoto,
            });
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div 
            onClick={() => setIsEditProfileOpen(false)}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
        >
            <div 
                onClick={(e) => e.stopPropagation()} 
                className="bg-white w-full max-w-md rounded-2xl p-6 shadow-2xl border border-gray-100 max-h-[90vh] overflow-y-auto no-scrollbar"
            >
                {/* Header */}
                <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                    <h3 className="font-bold text-[#1E1B4B]">Edit Profile</h3>
                    <button
                        onClick={() => setIsEditProfileOpen(false)}
                        className="p-1.5 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4 my-4">
                    {/* Cover & Avatar previews */}
                    <div className="relative mb-6">
                        <div className="h-28 rounded-xl bg-gray-100 overflow-hidden relative group">
                            {coverPhoto ? (
                                <img src={coverPhoto} alt="Cover" className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full bg-gradient-to-r from-violet-500 to-purple-600" />
                            )}
                            <label className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer text-white text-xs font-medium gap-1.5">
                                <Camera className="w-4 h-4" />
                                <span>Change Cover</span>
                                <input type="file" accept="image/*" onChange={handleCoverPhotoFile} className="hidden" />
                            </label>
                        </div>

                        <div className="absolute -bottom-5 left-4">
                            <div className="relative group">
                                <img
                                    src={profilePic || currentUser?.profile_picture}
                                    alt="Avatar"
                                    className="w-16 h-16 rounded-full object-cover border-4 border-white shadow-md"
                                />
                                <label className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer text-white">
                                    <Camera className="w-4 h-4" />
                                    <input type="file" accept="image/*" onChange={handleProfilePicFile} className="hidden" />
                                </label>
                            </div>
                        </div>
                    </div>

                    <div className="pt-2 space-y-3.5">
                        {/* Full Name */}
                        <div>
                            <label className="block text-xs font-semibold text-gray-700 mb-1">
                                Full Name
                            </label>
                            <div className="relative">
                                <User className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                                <input
                                    type="text"
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                    required
                                    className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-9 pr-3 py-2 text-xs focus:outline-none focus:border-violet-500"
                                />
                            </div>
                        </div>

                        {/* Bio */}
                        <div>
                            <label className="block text-xs font-semibold text-gray-700 mb-1">
                                Bio
                            </label>
                            <div className="relative">
                                <FileText className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                                <textarea
                                    value={bio}
                                    onChange={(e) => setBio(e.target.value)}
                                    rows={3}
                                    placeholder="Write a brief bio about yourself..."
                                    className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-9 pr-3 py-2 text-xs focus:outline-none focus:border-violet-500 resize-none"
                                />
                            </div>
                        </div>

                        {/* Location */}
                        <div>
                            <label className="block text-xs font-semibold text-gray-700 mb-1">
                                Location
                            </label>
                            <div className="relative">
                                <MapPin className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                                <input
                                    type="text"
                                    value={location}
                                    onChange={(e) => setLocation(e.target.value)}
                                    placeholder="e.g. San Francisco, CA"
                                    className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-9 pr-3 py-2 text-xs focus:outline-none focus:border-violet-500"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="pt-3 border-t border-gray-100 flex gap-2">
                        <button
                            type="button"
                            onClick={() => setIsEditProfileOpen(false)}
                            className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-2.5 rounded-xl text-xs transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSaving}
                            className="flex-1 bg-gradient-to-r from-[#7C3AED] to-[#EC4899] hover:opacity-95 text-white font-bold py-2.5 rounded-xl text-xs transition-all shadow-md shadow-[#7C3AED]/20 disabled:opacity-50 cursor-pointer"
                        >
                            {isSaving ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditProfileModal;

