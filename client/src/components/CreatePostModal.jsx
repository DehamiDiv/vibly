import React, { useState } from 'react';
import { useApp } from '../context/AppContext.jsx';
import { assets } from '../assets/assets.js';
import { X, Image as ImageIcon, Sparkles, Hash, Globe, Smile } from 'lucide-react';

const SUGGESTED_TAGS = ['#Vibly', '#tech', '#webdev', '#coding', '#networking'];

const CreatePostModal = () => {
    const { currentUser, isCreatePostOpen, setIsCreatePostOpen, handleCreatePost } = useApp();
    const [content, setContent] = useState('');
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [previews, setPreviews] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    if (!isCreatePostOpen) return null;

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        if (files.length > 0) {
            setSelectedFiles((prev) => [...prev, ...files]);
            const newPreviews = files.map((f) => URL.createObjectURL(f));
            setPreviews((prev) => [...prev, ...newPreviews]);
        }
    };

    const removeFile = (index) => {
        setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
        setPreviews((prev) => prev.filter((_, i) => i !== index));
    };

    const insertHashtag = (tag) => {
        setContent((prev) => `${prev} ${tag}`.trim());
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!content.trim() && selectedFiles.length === 0) return;

        setIsSubmitting(true);
        try {
            if (selectedFiles.length > 0) {
                const formData = new FormData();
                formData.append('content', content);
                selectedFiles.forEach((file) => {
                    formData.append('images', file);
                });
                await handleCreatePost(formData);
            } else {
                await handleCreatePost({ content, image_urls: [] });
            }
            setContent('');
            setSelectedFiles([]);
            setPreviews([]);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div 
            onClick={() => setIsCreatePostOpen(false)}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 select-none"
        >
            <div 
                onClick={(e) => e.stopPropagation()} 
                className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-gray-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150"
            >
                {/* Facebook-style Modal Header */}
                <div className="relative py-3.5 px-4 border-b border-gray-200 flex items-center justify-center">
                    <h3 className="font-extrabold text-[18px] text-[#1E1B4B] text-center">
                        Create post
                    </h3>
                    <button
                        onClick={() => setIsCreatePostOpen(false)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-[#6B7280] transition-colors cursor-pointer"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="p-4 space-y-4">
                    {/* Author & Audience Selector */}
                    <div className="flex items-center gap-3">
                        <img
                            src={currentUser?.profile_picture || assets.sample_profile}
                            alt={currentUser?.full_name}
                            className="w-11 h-11 rounded-full object-cover ring-2 ring-[#7C3AED]/30 shrink-0"
                        />
                        <div>
                            <p className="text-[15px] font-bold text-[#1E1B4B] leading-tight">
                                {currentUser?.full_name}
                            </p>
                            <div className="inline-flex items-center gap-1 bg-[#F8F7FF] border border-gray-200 px-2 py-0.5 rounded-md text-[12px] font-semibold text-[#6B7280] mt-0.5">
                                <Globe className="w-3.5 h-3.5" />
                                <span>Public</span>
                            </div>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Textarea */}
                        <textarea
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            placeholder={`What's on your mind, ${currentUser?.full_name?.split(' ')[0]}?`}
                            rows={selectedFiles.length > 0 ? 3 : 5}
                            className="w-full text-[17px] text-[#1E1B4B] placeholder-[#6B7280] focus:outline-none resize-none leading-relaxed"
                            autoFocus
                        />

                        {/* Hashtag Quick Chips */}
                        <div className="flex flex-wrap items-center gap-1.5 pt-1">
                            {SUGGESTED_TAGS.map((tag) => (
                                <button
                                    key={tag}
                                    type="button"
                                    onClick={() => insertHashtag(tag)}
                                    className="text-[13px] text-[#7C3AED] bg-[#7C3AED]/10 hover:bg-[#7C3AED]/20 font-semibold px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
                                >
                                    {tag}
                                </button>
                            ))}
                        </div>

                        {/* Media Preview Grid */}
                        {previews.length > 0 && (
                            <div className="grid grid-cols-2 gap-2 max-h-60 overflow-y-auto no-scrollbar p-1 bg-gray-50 rounded-xl border border-gray-200">
                                {previews.map((src, i) => (
                                    <div key={i} className="relative rounded-lg overflow-hidden h-32 bg-black flex items-center justify-center">
                                        <img src={src} alt="Preview" className="w-full h-full object-cover" />
                                        <button
                                            type="button"
                                            onClick={() => removeFile(i)}
                                            className="absolute top-1.5 right-1.5 w-7 h-7 bg-black/70 hover:bg-black text-white rounded-full flex items-center justify-center transition-colors cursor-pointer"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* "Add to your post" toolbar (Facebook style) */}
                        <div className="p-3 border border-gray-300 rounded-xl flex items-center justify-between shadow-xs">
                            <span className="text-[14px] font-bold text-[#1E1B4B]">
                                Add to your post
                            </span>

                            <div className="flex items-center gap-1">
                                <label className="w-9 h-9 hover:bg-[#EDE9FE]/50 rounded-full flex items-center justify-center cursor-pointer transition-colors" title="Photo/video">
                                    <ImageIcon className="w-6 h-6 text-[#EC4899]" />
                                    <input
                                        type="file"
                                        multiple
                                        accept="image/*"
                                        onChange={handleFileChange}
                                        className="hidden"
                                    />
                                </label>

                                <button type="button" className="w-9 h-9 hover:bg-[#EDE9FE]/50 rounded-full flex items-center justify-center cursor-pointer transition-colors" title="Feeling">
                                    <Smile className="w-6 h-6 text-[#F59E0B]" />
                                </button>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={isSubmitting || (!content.trim() && selectedFiles.length === 0)}
                            className="w-full bg-gradient-to-r from-[#7C3AED] to-[#EC4899] hover:opacity-95 disabled:opacity-40 text-white font-bold py-2.5 rounded-xl text-[15px] transition-all shadow-md shadow-[#7C3AED]/20 cursor-pointer"
                        >
                            {isSubmitting ? 'Posting...' : 'Post'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default CreatePostModal;
