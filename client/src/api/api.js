import axios from 'axios';
import {
    dummyUserData,
    dummyPostsData,
    dummyStoriesData,
    dummyRecentMessagesData,
    dummyMessagesData,
    dummyConnectionsData,
    dummyFollowersData,
    dummyFollowingData,
    dummyPendingConnectionsData,
} from '../assets/assets.js';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const client = axios.create({
    baseURL: API_URL,
    timeout: 8000,
});

// Attach Authorization header helper
const getHeaders = (token, userId) => {
    const headers = {};
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }
    if (userId) {
        headers['x-user-id'] = userId;
    }
    return headers;
};

// In-memory demo state fallback when backend is offline
let demoPosts = [...dummyPostsData];
let demoStories = [...dummyStoriesData];
let demoMessages = [...dummyMessagesData];
let demoConnections = [...dummyConnectionsData];
let demoFollowers = [...dummyFollowersData];
let demoFollowing = [...dummyFollowingData];
let demoPendingReceived = [...dummyPendingConnectionsData];

export const api = {
    // Current User
    getCurrentUser: async (token, userId) => {
        try {
            const res = await client.get('/api/user/me', { headers: getHeaders(token, userId) });
            return res.data.user;
        } catch {
            return dummyUserData;
        }
    },

    // User Profile
    getUserProfile: async (id, token, userId) => {
        try {
            const res = await client.get(`/api/user/profile/${id}`, { headers: getHeaders(token, userId) });
            return res.data;
        } catch {
            const user = dummyConnectionsData.find(u => u._id === id) || dummyUserData;
            const posts = demoPosts.filter(p => p.user?._id === id);
            return {
                user,
                posts,
                connectionStatus: 'none',
                isFollowing: false,
            };
        }
    },

    // Update Profile
    updateProfile: async (data, token, userId) => {
        try {
            const res = await client.put('/api/user/update', data, { headers: getHeaders(token, userId) });
            return res.data;
        } catch {
            return { success: true, user: { ...dummyUserData, ...data } };
        }
    },

    // Posts & Feed
    getFeedPosts: async (token, userId) => {
        try {
            const res = await client.get('/api/post', { headers: getHeaders(token, userId) });
            return res.data.posts;
        } catch {
            return demoPosts;
        }
    },

    createPost: async (postData, token, userId) => {
        try {
            const isFormData = postData instanceof FormData;
            const res = await client.post('/api/post', postData, {
                headers: {
                    ...getHeaders(token, userId),
                    ...(isFormData ? { 'Content-Type': 'multipart/form-data' } : {}),
                }
            });
            return res.data.post;
        } catch {
            const newPost = {
                _id: `post_${Date.now()}`,
                user: dummyUserData,
                content: postData.content || (postData instanceof FormData ? postData.get('content') : ''),
                image_urls: postData.image_urls || [],
                post_type: (postData.image_urls?.length || postData?.image_url) ? 'text_with_image' : 'text',
                likes_count: [],
                comments: [],
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            };
            demoPosts = [newPost, ...demoPosts];
            return newPost;
        }
    },

    toggleLikePost: async (postId, token, userId) => {
        try {
            const res = await client.post(`/api/post/like/${postId}`, {}, { headers: getHeaders(token, userId) });
            return res.data;
        } catch {
            demoPosts = demoPosts.map(p => {
                if (p._id === postId) {
                    const isLiked = p.likes_count.includes(userId || dummyUserData._id);
                    const newLikes = isLiked
                        ? p.likes_count.filter(id => id !== (userId || dummyUserData._id))
                        : [...p.likes_count, userId || dummyUserData._id];
                    return { ...p, likes_count: newLikes };
                }
                return p;
            });
            const target = demoPosts.find(p => p._id === postId);
            return {
                isLiked: target?.likes_count?.includes(userId || dummyUserData._id),
                likesCount: target?.likes_count?.length || 0
            };
        }
    },

    addComment: async (postId, text, token, userId) => {
        try {
            const res = await client.post(`/api/post/comment/${postId}`, { text }, { headers: getHeaders(token, userId) });
            return res.data.comments;
        } catch {
            const comment = {
                _id: `comment_${Date.now()}`,
                user: dummyUserData,
                text,
                createdAt: new Date().toISOString()
            };
            demoPosts = demoPosts.map(p => {
                if (p._id === postId) {
                    return { ...p, comments: [...(p.comments || []), comment] };
                }
                return p;
            });
            return demoPosts.find(p => p._id === postId)?.comments || [];
        }
    },

    deletePost: async (postId, token, userId) => {
        try {
            await client.delete(`/api/post/${postId}`, { headers: getHeaders(token, userId) });
            return true;
        } catch {
            demoPosts = demoPosts.filter(p => p._id !== postId);
            return true;
        }
    },

    // Stories
    getStories: async (token, userId) => {
        try {
            const res = await client.get('/api/story', { headers: getHeaders(token, userId) });
            return res.data.stories;
        } catch {
            return demoStories;
        }
    },

    createStory: async (storyData, token, userId) => {
        try {
            const isFormData = storyData instanceof FormData;
            const res = await client.post('/api/story', storyData, {
                headers: {
                    ...getHeaders(token, userId),
                    ...(isFormData ? { 'Content-Type': 'multipart/form-data' } : {}),
                }
            });
            return res.data.story;
        } catch {
            const newStory = {
                _id: `story_${Date.now()}`,
                user: dummyUserData,
                content: storyData.content || (storyData instanceof FormData ? storyData.get('content') : ''),
                media_url: storyData.media_url || '',
                media_type: storyData.media_type || 'text',
                background_color: storyData.background_color || '#4f46e5',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            };
            demoStories = [newStory, ...demoStories];
            return newStory;
        }
    },

    // Social Connections
    getConnections: async (token, userId) => {
        try {
            const res = await client.get('/api/user/connections', { headers: getHeaders(token, userId) });
            return res.data;
        } catch {
            return {
                connections: demoConnections,
                followers: demoFollowers,
                following: demoFollowing,
                pendingReceived: demoPendingReceived,
                pendingSent: [],
            };
        }
    },

    sendConnectionRequest: async (targetId, token, userId) => {
        try {
            const res = await client.post(`/api/user/connect/${targetId}`, {}, { headers: getHeaders(token, userId) });
            return res.data;
        } catch {
            return { success: true, message: 'Request sent' };
        }
    },

    acceptConnectionRequest: async (senderId, token, userId) => {
        try {
            const res = await client.post(`/api/user/connect/accept/${senderId}`, {}, { headers: getHeaders(token, userId) });
            return res.data;
        } catch {
            const acceptedUser = demoPendingReceived.find(u => u._id === senderId);
            if (acceptedUser) {
                demoConnections.push(acceptedUser);
                demoPendingReceived = demoPendingReceived.filter(u => u._id !== senderId);
            }
            return { success: true };
        }
    },

    rejectConnectionRequest: async (senderId, token, userId) => {
        try {
            const res = await client.post(`/api/user/connect/reject/${senderId}`, {}, { headers: getHeaders(token, userId) });
            return res.data;
        } catch {
            demoPendingReceived = demoPendingReceived.filter(u => u._id !== senderId);
            demoConnections = demoConnections.filter(u => u._id !== senderId);
            return { success: true };
        }
    },

    followUser: async (targetId, token, userId) => {
        try {
            const res = await client.post(`/api/user/follow/${targetId}`, {}, { headers: getHeaders(token, userId) });
            return res.data;
        } catch {
            return { success: true };
        }
    },

    unfollowUser: async (targetId, token, userId) => {
        try {
            const res = await client.post(`/api/user/unfollow/${targetId}`, {}, { headers: getHeaders(token, userId) });
            return res.data;
        } catch {
            return { success: true };
        }
    },

    // Discover & Search
    discoverUsers: async (token, userId) => {
        try {
            const res = await client.get('/api/user/discover', { headers: getHeaders(token, userId) });
            return res.data.users;
        } catch {
            return dummyConnectionsData;
        }
    },

    searchUsers: async (query, token, userId) => {
        try {
            const res = await client.get(`/api/user/search?q=${encodeURIComponent(query)}`, {
                headers: getHeaders(token, userId)
            });
            return res.data.users;
        } catch {
            const q = query.toLowerCase();
            return dummyConnectionsData.filter(u =>
                u.full_name?.toLowerCase().includes(q) ||
                u.username?.toLowerCase().includes(q) ||
                u.bio?.toLowerCase().includes(q)
            );
        }
    },

    // Messaging & Real-Time
    getRecentChats: async (token, userId) => {
        try {
            const res = await client.get('/api/message/recent', { headers: getHeaders(token, userId) });
            return res.data.recentChats;
        } catch {
            return dummyRecentMessagesData.map(msg => ({
                partner: msg.from_user_id?._id === (userId || dummyUserData._id) ? msg.to_user_id : msg.from_user_id,
                lastMessage: msg,
                unreadCount: msg.seen ? 0 : 1,
            }));
        }
    },

    getMessagesBetweenUsers: async (partnerId, token, userId) => {
        try {
            const res = await client.get(`/api/message/${partnerId}`, { headers: getHeaders(token, userId) });
            return res.data.messages;
        } catch {
            return demoMessages;
        }
    },

    sendMessage: async (msgData, token, userId) => {
        try {
            const isFormData = msgData instanceof FormData;
            const res = await client.post('/api/message/send', msgData, {
                headers: {
                    ...getHeaders(token, userId),
                    ...(isFormData ? { 'Content-Type': 'multipart/form-data' } : {}),
                }
            });
            return res.data.message;
        } catch {
            const newMsg = {
                _id: `msg_${Date.now()}`,
                from_user_id: dummyUserData,
                to_user_id: msgData.to_user_id || (msgData instanceof FormData ? msgData.get('to_user_id') : ''),
                text: msgData.text || (msgData instanceof FormData ? msgData.get('text') : ''),
                message_type: msgData.media_url ? 'image' : 'text',
                media_url: msgData.media_url || '',
                seen: false,
                createdAt: new Date().toISOString(),
            };
            demoMessages = [...demoMessages, newMsg];
            return newMsg;
        }
    },

    markSeen: async (partnerId, token, userId) => {
        try {
            await client.put(`/api/message/seen/${partnerId}`, {}, { headers: getHeaders(token, userId) });
        } catch {
            demoMessages = demoMessages.map(m => ({ ...m, seen: true }));
        }
    },
};

export default api;

