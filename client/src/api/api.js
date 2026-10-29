import axios from 'axios';

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

export const api = {
    // Current User
    getCurrentUser: async (token, userId) => {
        try {
            const res = await client.get('/api/user/me', { headers: getHeaders(token, userId) });
            return res.data.user;
        } catch {
            return null;
        }
    },

    // User Profile
    getUserProfile: async (id, token, userId) => {
        try {
            const res = await client.get(`/api/user/profile/${id}`, { headers: getHeaders(token, userId) });
            return res.data;
        } catch {
            return null;
        }
    },

    // Update Profile
    updateProfile: async (data, token, userId) => {
        try {
            const res = await client.put('/api/user/update', data, { headers: getHeaders(token, userId) });
            return res.data;
        } catch {
            return null;
        }
    },

    // Posts & Feed
    getFeedPosts: async (token, userId) => {
        try {
            const res = await client.get('/api/post', { headers: getHeaders(token, userId) });
            return res.data.posts;
        } catch {
            return [];
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
            return null;
        }
    },

    toggleLikePost: async (postId, token, userId) => {
        try {
            const res = await client.post(`/api/post/like/${postId}`, {}, { headers: getHeaders(token, userId) });
            return res.data;
        } catch {
            return { isLiked: false, likesCount: 0 };
        }
    },

    addComment: async (postId, text, token, userId) => {
        try {
            const res = await client.post(`/api/post/comment/${postId}`, { text }, { headers: getHeaders(token, userId) });
            return res.data.comments;
        } catch {
            return [];
        }
    },

    deletePost: async (postId, token, userId) => {
        try {
            await client.delete(`/api/post/${postId}`, { headers: getHeaders(token, userId) });
            return true;
        } catch {
            return false;
        }
    },

    // Stories
    getStories: async (token, userId) => {
        try {
            const res = await client.get('/api/story', { headers: getHeaders(token, userId) });
            return res.data.stories;
        } catch {
            return [];
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
            return null;
        }
    },

    // Social Connections
    getConnections: async (token, userId) => {
        try {
            const res = await client.get('/api/user/connections', { headers: getHeaders(token, userId) });
            return res.data;
        } catch {
            return {
                connections: [],
                followers: [],
                following: [],
                pendingReceived: [],
                pendingSent: [],
            };
        }
    },

    sendConnectionRequest: async (targetId, token, userId) => {
        try {
            const res = await client.post(`/api/user/connect/${targetId}`, {}, { headers: getHeaders(token, userId) });
            return res.data;
        } catch {
            return null;
        }
    },

    acceptConnectionRequest: async (senderId, token, userId) => {
        try {
            const res = await client.post(`/api/user/connect/accept/${senderId}`, {}, { headers: getHeaders(token, userId) });
            return res.data;
        } catch {
            return null;
        }
    },

    rejectConnectionRequest: async (senderId, token, userId) => {
        try {
            const res = await client.post(`/api/user/connect/reject/${senderId}`, {}, { headers: getHeaders(token, userId) });
            return res.data;
        } catch {
            return null;
        }
    },

    followUser: async (targetId, token, userId) => {
        try {
            const res = await client.post(`/api/user/follow/${targetId}`, {}, { headers: getHeaders(token, userId) });
            return res.data;
        } catch {
            return null;
        }
    },

    unfollowUser: async (targetId, token, userId) => {
        try {
            const res = await client.post(`/api/user/unfollow/${targetId}`, {}, { headers: getHeaders(token, userId) });
            return res.data;
        } catch {
            return null;
        }
    },

    // Discover & Search
    discoverUsers: async (token, userId) => {
        try {
            const res = await client.get('/api/user/discover', { headers: getHeaders(token, userId) });
            return res.data.users;
        } catch {
            return [];
        }
    },

    searchUsers: async (query, token, userId) => {
        try {
            const res = await client.get(`/api/user/search?q=${encodeURIComponent(query)}`, {
                headers: getHeaders(token, userId)
            });
            return res.data.users;
        } catch {
            return [];
        }
    },

    // Messaging & Real-Time
    getRecentChats: async (token, userId) => {
        try {
            const res = await client.get('/api/message/recent', { headers: getHeaders(token, userId) });
            return res.data.recentChats;
        } catch {
            return [];
        }
    },

    getMessagesBetweenUsers: async (partnerId, token, userId) => {
        try {
            const res = await client.get(`/api/message/${partnerId}`, { headers: getHeaders(token, userId) });
            return res.data.messages;
        } catch {
            return [];
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
            return null;
        }
    },

    markSeen: async (partnerId, token, userId) => {
        try {
            await client.put(`/api/message/seen/${partnerId}`, {}, { headers: getHeaders(token, userId) });
        } catch {
            // Silent fail
        }
    },
};

export default api;
