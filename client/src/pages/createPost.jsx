import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext.jsx';
import { assets } from '../assets/assets.js';
import { Image as ImageIcon, X, Hash, ArrowLeft } from 'lucide-react';

const SUGGESTED_TAGS = ['#Vibly', '#tech', '#webdev', '#coding', '#networking'];

const CreatePost = () => {
    const { currentUser, handleCreatePost } = useApp();
    const navigate = useNavigate();

    const [content, setContent] = useState('');
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [previews, setPreviews] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

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
            navigate('/');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm">
            <div className="flex items-center gap-3 pb-4 border-b border-gray-100 mb-4">
                <button
                    onClick={() => navigate(-1)}
                    className="p-1.5 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
                >
                    <ArrowLeft className="w-5 h-5" />
                </button>
                <h2 className="text-lg font-bold text-[#1E1B4B]">Create Post</h2>
            </div>

            {/* Author */}
            <div className="flex items-center gap-3 mb-4">
                <img
                    src={currentUser?.profile_picture || assets.sample_profile}
                    alt={currentUser?.full_name}
                    className="w-11 h-11 rounded-full object-cover ring-2 ring-[#7C3AED]/30"
                />
                <div>
                    <h4 className="text-sm font-semibold text-[#1E1B4B]">{currentUser?.full_name}</h4>
                    <p className="text-xs text-[#6B7280]">@{currentUser?.username}</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="What do you want to share today? Use #hashtags..."
                    rows={5}
                    className="w-full bg-[#F8F7FF] border border-gray-200 rounded-2xl p-4 text-sm text-[#1E1B4B] placeholder-[#6B7280] focus:outline-none focus:border-[#7C3AED] focus:bg-white resize-none"
                />

                {/* Hashtag chips */}
                <div className="flex flex-wrap items-center gap-1.5">
                    <span className="text-[11px] text-[#6B7280] flex items-center gap-0.5">
                        <Hash className="w-3 h-3" /> Popular:
                    </span>
                    {SUGGESTED_TAGS.map((tag) => (
                        <button
                            key={tag}
                            type="button"
                            onClick={() => insertHashtag(tag)}
                            className="text-[11px] text-[#7C3AED] bg-[#7C3AED]/10 hover:bg-[#7C3AED]/20 px-2.5 py-0.5 rounded-lg transition-colors font-medium cursor-pointer"
                        >
                            {tag}
                        </button>
                    ))}
                </div>

                {/* Previews */}
                {previews.length > 0 && (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {previews.map((src, i) => (
                            <div key={i} className="relative rounded-xl overflow-hidden h-32 bg-gray-100 border">
                                <img src={src} alt="Upload preview" className="w-full h-full object-cover" />
                                <button
                                    type="button"
                                    onClick={() => removeFile(i)}
                                    className="absolute top-1 right-1 bg-black/60 text-white p-1 rounded-full"
                                >
                                    <X className="w-3.5 h-3.5" />
                                </button>
                            </div>
                        ))}
                    </div>
                )}

                <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
                    <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-[#EC4899] bg-[#EC4899]/10 hover:bg-[#EC4899]/20 px-4 py-2.5 rounded-xl transition-colors">
                        <ImageIcon className="w-4 h-4" />
                        <span>Add Media (ImageKit)</span>
                        <input
                            type="file"
                            multiple
                            accept="image/*"
                            onChange={handleFileChange}
                            className="hidden"
                        />
                    </label>

                    <button
                        type="submit"
                        disabled={isSubmitting || (!content.trim() && selectedFiles.length === 0)}
                        className="bg-gradient-to-r from-[#7C3AED] to-[#EC4899] hover:opacity-95 disabled:opacity-50 text-white font-bold px-6 py-2.5 rounded-xl text-xs transition-all shadow-md shadow-[#7C3AED]/20 cursor-pointer"
                    >
                        {isSubmitting ? 'Publishing...' : 'Publish Post'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CreatePost;
