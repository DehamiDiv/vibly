import React, { useState } from 'react';
import { useApp } from '../context/AppContext.jsx';
import { X, Image as ImageIcon, Type, Sparkles } from 'lucide-react';

const COLORS = [
    '#7C3AED', // Primary Violet
    '#EC4899', // Secondary Pink
    '#F59E0B', // Accent Amber
    '#1E1B4B', // Deep navy
    '#059669', // Emerald
    '#2563eb', // Blue
];

const CreateStoryModal = () => {
    const { isCreateStoryOpen, setIsCreateStoryOpen, handleCreateStory } = useApp();
    const [storyType, setStoryType] = useState('text'); // 'text' | 'media'
    const [content, setContent] = useState('');
    const [bgColor, setBgColor] = useState(COLORS[0]);
    const [mediaFile, setMediaFile] = useState(null);
    const [mediaPreview, setMediaPreview] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    if (!isCreateStoryOpen) return null;

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setMediaFile(file);
            setMediaPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (storyType === 'text' && !content.trim()) return;
        if (storyType === 'media' && !mediaFile && !mediaPreview) return;

        setIsSubmitting(true);
        try {
            if (storyType === 'media' && mediaFile) {
                const formData = new FormData();
                formData.append('media', mediaFile);
                formData.append('content', content);
                formData.append('media_type', mediaFile.type.startsWith('video') ? 'video' : 'image');
                formData.append('background_color', bgColor);
                await handleCreateStory(formData);
            } else {
                await handleCreateStory({
                    content,
                    media_type: 'text',
                    background_color: bgColor,
                    media_url: '',
                });
            }
            setContent('');
            setMediaFile(null);
            setMediaPreview('');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div 
            onClick={() => setIsCreateStoryOpen(false)}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
        >
            <div 
                onClick={(e) => e.stopPropagation()} 
                className="bg-white w-full max-w-md rounded-2xl p-6 shadow-2xl border border-gray-100 animate-in fade-in zoom-in-95 duration-150"
            >
                {/* Header */}
                <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                    <div className="flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-[#7C3AED]" />
                        <h3 className="font-bold text-[#1E1B4B]">Add to Story</h3>
                    </div>
                    <button
                        onClick={() => setIsCreateStoryOpen(false)}
                        className="p-1.5 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>

                {/* Story Type Tabs */}
                <div className="flex gap-2 my-4 p-1 bg-gray-100 rounded-xl">
                    <button
                        type="button"
                        onClick={() => setStoryType('text')}
                        className={`flex-1 flex items-center justify-center gap-2 py-2 text-xs font-semibold rounded-lg transition-all ${
                            storyType === 'text'
                                ? 'bg-white text-[#7C3AED] shadow-sm'
                                : 'text-gray-600 hover:text-gray-900'
                        }`}
                    >
                        <Type className="w-4 h-4" />
                        Text Story
                    </button>
                    <button
                        type="button"
                        onClick={() => setStoryType('media')}
                        className={`flex-1 flex items-center justify-center gap-2 py-2 text-xs font-semibold rounded-lg transition-all ${
                            storyType === 'media'
                                ? 'bg-white text-[#7C3AED] shadow-sm'
                                : 'text-gray-600 hover:text-gray-900'
                        }`}
                    >
                        <ImageIcon className="w-4 h-4" />
                        Photo / Video
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Text Story Preview & Input */}
                    {storyType === 'text' ? (
                        <>
                            <div
                                className="w-full h-44 rounded-xl flex items-center justify-center p-4 transition-colors shadow-inner"
                                style={{ backgroundColor: bgColor }}
                            >
                                <textarea
                                    value={content}
                                    onChange={(e) => setContent(e.target.value)}
                                    placeholder="Type your story status here..."
                                    className="w-full h-full bg-transparent text-white placeholder-white/70 text-center font-medium focus:outline-none resize-none text-base"
                                />
                            </div>

                            {/* Color Selector */}
                            <div>
                                <label className="block text-xs font-semibold text-[#6B7280] mb-2">
                                    Background Color
                                </label>
                                <div className="flex gap-2">
                                    {COLORS.map((c) => (
                                        <button
                                            key={c}
                                            type="button"
                                            onClick={() => setBgColor(c)}
                                            className={`w-7 h-7 rounded-full transition-transform ${
                                                bgColor === c ? 'ring-2 ring-[#7C3AED] ring-offset-2 scale-110' : ''
                                            }`}
                                            style={{ backgroundColor: c }}
                                        />
                                    ))}
                                </div>
                            </div>
                        </>
                    ) : (
                        /* Media Story Input */
                        <>
                            <div className="border-2 border-dashed border-gray-200 rounded-xl p-4 text-center hover:border-indigo-400 transition-colors">
                                {mediaPreview ? (
                                    <div className="relative max-h-52 overflow-hidden rounded-lg">
                                        <img
                                            src={mediaPreview}
                                            alt="Preview"
                                            className="w-full h-52 object-cover"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setMediaFile(null);
                                                setMediaPreview('');
                                            }}
                                            className="absolute top-2 right-2 bg-black/60 text-white p-1 rounded-full"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    </div>
                                ) : (
                                    <label className="cursor-pointer block py-6">
                                        <ImageIcon className="w-10 h-10 text-gray-400 mx-auto mb-2" />
                                        <p className="text-xs font-semibold text-gray-700">
                                            Click to upload image or video
                                        </p>
                                        <p className="text-[11px] text-gray-400 mt-1">
                                            Supports JPG, PNG, MP4 up to 10MB
                                        </p>
                                        <input
                                            type="file"
                                            accept="image/*,video/*"
                                            onChange={handleFileChange}
                                            className="hidden"
                                        />
                                    </label>
                                )}
                            </div>

                            <input
                                type="text"
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                placeholder="Add an optional caption..."
                                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-violet-500"
                            />
                        </>
                    )}

                    {/* Submit Button */}
                    <div className="pt-2">
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full bg-gradient-to-r from-[#7C3AED] to-[#EC4899] hover:opacity-95 disabled:opacity-50 text-white font-bold py-2.5 rounded-xl text-xs transition-all shadow-md shadow-[#7C3AED]/20 cursor-pointer"
                        >
                            {isSubmitting ? 'Uploading to ImageKit & Sharing...' : 'Share to Story (24h)'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateStoryModal;

