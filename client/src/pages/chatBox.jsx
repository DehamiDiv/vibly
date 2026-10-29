import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext.jsx';
import { api } from '../api/api.js';
import { assets } from '../assets/assets.js';
import { Send, Image as ImageIcon, CheckCheck, Check, X, ArrowLeft, CheckCircle2 } from 'lucide-react';

const ChatBox = ({ partner, onBack }) => {
    const { currentUser, chatMessages, setChatMessages } = useApp();
    const navigate = useNavigate();

    const [text, setText] = useState('');
    const [mediaFile, setMediaFile] = useState(null);
    const [mediaPreview, setMediaPreview] = useState('');
    const [isSending, setIsSending] = useState(false);
    const messagesEndRef = useRef(null);

    const partnerId = partner?._id;

    // Load message history when partner changes
    useEffect(() => {
        if (!partnerId) return;

        const loadMessages = async () => {
            const msgs = await api.getMessagesBetweenUsers(partnerId, null, currentUser?._id);
            setChatMessages(msgs || []);
            await api.markSeen(partnerId, null, currentUser?._id);
        };

        loadMessages();
    }, [partnerId, currentUser?._id, setChatMessages]);

    // Scroll to bottom on new messages
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [chatMessages]);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setMediaFile(file);
            setMediaPreview(URL.createObjectURL(file));
        }
    };

    const handleSend = async (e) => {
        e.preventDefault();
        if (!text.trim() && !mediaFile) return;

        setIsSending(true);
        try {
            let sentMsg;
            if (mediaFile) {
                const formData = new FormData();
                formData.append('to_user_id', partnerId);
                formData.append('text', text);
                formData.append('image', mediaFile);
                sentMsg = await api.sendMessage(formData, null, currentUser?._id);
            } else {
                sentMsg = await api.sendMessage({
                    to_user_id: partnerId,
                    text: text.trim(),
                }, null, currentUser?._id);
            }

            setChatMessages((prev) => [...prev, sentMsg]);
            setText('');
            setMediaFile(null);
            setMediaPreview('');
        } finally {
            setIsSending(false);
        }
    };

    if (!partner) {
        return (
            <div className="h-full flex flex-col items-center justify-center p-8 text-center text-gray-400">
                <p className="text-sm font-medium">Select a conversation or start a new chat</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            {/* Conversation Header */}
            <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-white z-10">
                <div className="flex items-center gap-3">
                    {onBack && (
                        <button
                            onClick={onBack}
                            className="p-1.5 text-gray-400 hover:text-gray-600 rounded-lg md:hidden"
                        >
                            <ArrowLeft className="w-5 h-5" />
                        </button>
                    )}
                    <div 
                        onClick={() => navigate(`/profile/${partner._id}`)} 
                        className="flex items-center gap-2.5 cursor-pointer"
                    >
                        <img
                            src={partner.profile_picture || assets.sample_profile}
                            alt={partner.full_name}
                            className="w-10 h-10 rounded-full object-cover border border-gray-200"
                        />
                        <div>
                            <div className="flex items-center gap-1.5">
                                <h3 className="text-[16px] font-bold text-[#1E1B4B] hover:text-[#7C3AED] transition-colors">
                                    {partner.full_name}
                                </h3>
                                {partner.is_verified && (
                                    <CheckCircle2 className="w-4 h-4 text-[#7C3AED] fill-[#7C3AED]/20" />
                                )}
                            </div>
                            <p className="text-[12px] text-emerald-600 font-semibold">Active now</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Messages Scroll Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#F8F7FF]">
                {chatMessages.map((msg, idx) => {
                    const fromId = msg.from_user_id?._id || msg.from_user_id;
                    const isMe = fromId === currentUser?._id;

                    return (
                        <div
                            key={msg._id || idx}
                            className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                        >
                            <div
                                className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-[15px] shadow-xs ${
                                    isMe
                                        ? 'bg-gradient-to-r from-[#7C3AED] to-[#EC4899] text-white rounded-tr-none shadow-md shadow-[#7C3AED]/15'
                                        : 'bg-white text-[#1E1B4B] border border-gray-200/80 rounded-tl-none'
                                }`}
                            >
                                {/* Media Attachment (ImageKit) */}
                                {msg.media_url && (
                                    <div className="mb-2 rounded-xl overflow-hidden max-w-xs">
                                        <img
                                            src={msg.media_url}
                                            alt="Attachment"
                                            className="w-full h-auto object-cover max-h-60 rounded-xl"
                                        />
                                    </div>
                                )}

                                {msg.text && <p className="leading-relaxed whitespace-pre-wrap">{msg.text}</p>}

                                {/* Message Timestamp & Status */}
                                <div className={`flex items-center justify-end gap-1 mt-1 text-[11px] ${
                                    isMe ? 'text-white/80' : 'text-[#6B7280]'
                                }`}>
                                    <span>
                                        {msg.createdAt
                                            ? new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                                            : 'Just now'}
                                    </span>
                                    {isMe && (
                                        msg.seen ? (
                                            <CheckCheck className="w-3.5 h-3.5 text-white" />
                                        ) : (
                                            <Check className="w-3.5 h-3.5 text-white/80" />
                                        )
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })}
                <div ref={messagesEndRef} />
            </div>

            {/* Media Upload Preview Bar */}
            {mediaPreview && (
                <div className="px-4 py-2 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <img src={mediaPreview} alt="Preview" className="w-10 h-10 object-cover rounded-lg border" />
                        <span className="text-xs text-gray-500">Image attached</span>
                    </div>
                    <button
                        onClick={() => {
                            setMediaFile(null);
                            setMediaPreview('');
                        }}
                        className="p-1 text-gray-400 hover:text-gray-600"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>
            )}

            {/* Input Composer */}
            <form onSubmit={handleSend} className="p-3 bg-white border-t border-gray-100 flex items-center gap-2">
                <label className="p-2 text-[#6B7280] hover:text-[#EC4899] hover:bg-[#EDE9FE]/40 rounded-xl cursor-pointer transition-colors">
                    <ImageIcon className="w-5 h-5" />
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                    />
                </label>

                <input
                    type="text"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1 bg-[#F8F7FF] hover:bg-[#EDE9FE]/30 focus:bg-white border border-gray-200 focus:border-[#7C3AED] rounded-full px-4 py-2.5 text-[15px] text-[#1E1B4B] focus:outline-none transition-colors placeholder-[#6B7280]"
                />

                <button
                    type="submit"
                    disabled={isSending || (!text.trim() && !mediaFile)}
                    className="p-2.5 bg-gradient-to-r from-[#7C3AED] to-[#EC4899] hover:opacity-95 disabled:opacity-40 text-white rounded-full transition-all shadow-md shadow-[#7C3AED]/20 cursor-pointer"
                >
                    <Send className="w-4.5 h-4.5" />
                </button>
            </form>
        </div>
    );
};

export default ChatBox;
