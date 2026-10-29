import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useUser, useAuth } from '@clerk/clerk-react';
import { api } from '../api/api.js';
import { dummyUserData } from '../assets/assets.js';

export const AppContext = createContext(null);

export const AppProvider = ({ children }) => {
    // Clerk user hook (if ClerkProvider is configured)
    let clerkUser = null;
    let getToken = null;
    try {
        const userHook = useUser();
        clerkUser = userHook?.user;
        const authHook = useAuth();
        getToken = authHook?.getToken;
    } catch {
        // Clerk may not have keys configured yet
        clerkUser = null;
        getToken = null;
    }

    const [currentUser, setCurrentUser] = useState(dummyUserData);
    const [posts, setPosts] = useState([]);
    const [stories, setStories] = useState([]);
    const [connectionsData, setConnectionsData] = useState({
        connections: [],
        followers: [],
        following: [],
        pendingReceived: [],
        pendingSent: [],
    });
    const [recentChats, setRecentChats] = useState([]);
    const [activeChatPartner, setActiveChatPartner] = useState(null);
    const [chatMessages, setChatMessages] = useState([]);

    // Modals
    const [isCreatePostOpen, setIsCreatePostOpen] = useState(false);
    const [isCreateStoryOpen, setIsCreateStoryOpen] = useState(false);
    const [activeStoryIndex, setActiveStoryIndex] = useState(null);
    const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
    const [loading, setLoading] = useState(true);

    const getAuthToken = useCallback(async () => {
        if (getToken) {
            try {
                return await getToken();
            } catch {
                return null;
            }
        }
        return null;
    }, [getToken]);

    // Initialize Current User
    useEffect(() => {
        const initUser = async () => {
            const token = await getAuthToken();
            const userId = clerkUser?.id || dummyUserData._id;

            if (clerkUser) {
                const updatedUser = {
                    ...dummyUserData,
                    _id: clerkUser.id,
                    email: clerkUser.primaryEmailAddress?.emailAddress || dummyUserData.email,
                    full_name: clerkUser.fullName || dummyUserData.full_name,
                    username: clerkUser.username || clerkUser.primaryEmailAddress?.emailAddress?.split('@')[0] || dummyUserData.username,
                    profile_picture: clerkUser.imageUrl || dummyUserData.profile_picture,
                };
                setCurrentUser(updatedUser);
            } else {
                const user = await api.getCurrentUser(token, userId);
                setCurrentUser(user);
            }
        };

        initUser();
    }, [clerkUser, getAuthToken]);

    // Load Initial Data
    const loadData = useCallback(async () => {
        setLoading(true);
        const token = await getAuthToken();
        const userId = currentUser?._id;

        const [fetchedPosts, fetchedStories, fetchedConns, fetchedChats] = await Promise.all([
            api.getFeedPosts(token, userId),
            api.getStories(token, userId),
            api.getConnections(token, userId),
            api.getRecentChats(token, userId),
        ]);

        setPosts(fetchedPosts || []);
        setStories(fetchedStories || []);
        setConnectionsData(fetchedConns || { connections: [], followers: [], following: [], pendingReceived: [], pendingSent: [] });
        setRecentChats(fetchedChats || []);
        setLoading(false);
    }, [getAuthToken, currentUser?._id]);

    useEffect(() => {
        loadData();
    }, [loadData]);

    // SSE Real-Time Messaging Listener
    useEffect(() => {
        if (!currentUser?._id) return;

        const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
        let eventSource = null;

        try {
            eventSource = new EventSource(`${API_URL}/api/message/sse/${currentUser._id}`);

            eventSource.addEventListener('new_message', (e) => {
                const newMsg = JSON.parse(e.data);
                // Update active chat if viewing
                setChatMessages((prev) => {
                    if (prev.some(m => m._id === newMsg._id)) return prev;
                    return [...prev, newMsg];
                });

                // Update recent chats list
                setRecentChats((prev) => {
                    const fromId = newMsg.from_user_id?._id || newMsg.from_user_id;
                    const partner = fromId === currentUser._id ? newMsg.to_user_id : newMsg.from_user_id;
                    const partnerId = partner?._id || partner;

                    const existing = prev.filter(c => (c.partner?._id || c.partner) !== partnerId);
                    return [
                        {
                            partner,
                            lastMessage: newMsg,
                            unreadCount: (fromId !== currentUser._id) ? 1 : 0
                        },
                        ...existing
                    ];
                });
            });

            eventSource.addEventListener('messages_seen', () => {
                setChatMessages((prev) => prev.map(m => ({ ...m, seen: true })));
            });
        } catch (err) {
            console.log('SSE connection skipped in offline mode:', err.message);
        }

        return () => {
            if (eventSource) {
                eventSource.close();
            }
        };
    }, [currentUser?._id]);

    // Post Actions
    const handleLikePost = async (postId) => {
        const token = await getAuthToken();
        const res = await api.toggleLikePost(postId, token, currentUser?._id);
        setPosts((prev) =>
            prev.map((p) => {
                if (p._id === postId) {
                    const isLiked = p.likes_count.includes(currentUser?._id);
                    const newLikes = isLiked
                        ? p.likes_count.filter((id) => id !== currentUser?._id)
                        : [...p.likes_count, currentUser?._id];
                    return { ...p, likes_count: res.likes || newLikes };
                }
                return p;
            })
        );
    };

    const handleAddComment = async (postId, text) => {
        const token = await getAuthToken();
        const updatedComments = await api.addComment(postId, text, token, currentUser?._id);
        setPosts((prev) =>
            prev.map((p) => (p._id === postId ? { ...p, comments: updatedComments } : p))
        );
    };

    const handleCreatePost = async (postData) => {
        const token = await getAuthToken();
        const newPost = await api.createPost(postData, token, currentUser?._id);
        setPosts((prev) => [newPost, ...prev]);
        setIsCreatePostOpen(false);
    };

    const handleDeletePost = async (postId) => {
        const token = await getAuthToken();
        await api.deletePost(postId, token, currentUser?._id);
        setPosts((prev) => prev.filter((p) => p._id !== postId));
    };

    // Story Actions
    const handleCreateStory = async (storyData) => {
        const token = await getAuthToken();
        const newStory = await api.createStory(storyData, token, currentUser?._id);
        setStories((prev) => [newStory, ...prev]);
        setIsCreateStoryOpen(false);
    };

    // Connections Actions
    const handleSendConnection = async (targetId) => {
        const token = await getAuthToken();
        await api.sendConnectionRequest(targetId, token, currentUser?._id);
    };

    const handleAcceptConnection = async (senderId) => {
        const token = await getAuthToken();
        await api.acceptConnectionRequest(senderId, token, currentUser?._id);
        const conns = await api.getConnections(token, currentUser?._id);
        setConnectionsData(conns);
    };

    const handleRejectConnection = async (senderId) => {
        const token = await getAuthToken();
        await api.rejectConnectionRequest(senderId, token, currentUser?._id);
        const conns = await api.getConnections(token, currentUser?._id);
        setConnectionsData(conns);
    };

    const handleFollowToggle = async (targetId, isFollowing) => {
        const token = await getAuthToken();
        if (isFollowing) {
            await api.unfollowUser(targetId, token, currentUser?._id);
        } else {
            await api.followUser(targetId, token, currentUser?._id);
        }
        const conns = await api.getConnections(token, currentUser?._id);
        setConnectionsData(conns);
    };

    // Profile Actions
    const handleUpdateProfile = async (updateData) => {
        const token = await getAuthToken();
        const res = await api.updateProfile(updateData, token, currentUser?._id);
        if (res.user) {
            setCurrentUser(res.user);
        }
        setIsEditProfileOpen(false);
    };

    return (
        <AppContext.Provider
            value={{
                currentUser,
                setCurrentUser,
                posts,
                setPosts,
                stories,
                connectionsData,
                setConnectionsData,
                recentChats,
                setRecentChats,
                activeChatPartner,
                setActiveChatPartner,
                chatMessages,
                setChatMessages,
                loading,
                loadData,
                handleLikePost,
                handleAddComment,
                handleCreatePost,
                handleDeletePost,
                handleCreateStory,
                handleSendConnection,
                handleAcceptConnection,
                handleRejectConnection,
                handleFollowToggle,
                handleUpdateProfile,
                // Modals
                isCreatePostOpen,
                setIsCreatePostOpen,
                isCreateStoryOpen,
                setIsCreateStoryOpen,
                activeStoryIndex,
                setActiveStoryIndex,
                isEditProfileOpen,
                setIsEditProfileOpen,
            }}
        >
            {children}
        </AppContext.Provider>
    );
};

export const useApp = () => useContext(AppContext);

