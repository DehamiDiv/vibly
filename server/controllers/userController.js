import User from '../models/User.js';
import Post from '../models/Post.js';
import Connection from '../models/Connection.js';
import { inngest } from '../configs/inngest.js';
import { uploadToImageKit } from '../configs/imagekit.js';

// Get or sync current authenticated user
export const getCurrentUser = async (req, res) => {
    try {
        const userId = req.auth.userId;
        let user = await User.findById(userId);

        if (!user) {
            // Auto-provision if user exists in Clerk but not yet synced
            user = await User.create({
                _id: userId,
                email: req.body.email || `${userId}@pingup.local`,
                full_name: req.body.full_name || 'PingUp Member',
                username: req.body.username || `user_${userId.slice(-6)}`,
                profile_picture: req.body.profile_picture || '',
            });
        }

        res.json({ success: true, user });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get profile of any user by ID
export const getUserProfile = async (req, res) => {
    try {
        const { id } = req.params;
        const currentUserId = req.auth?.userId;

        const user = await User.findById(id)
            .populate('followers', '_id full_name username profile_picture is_verified')
            .populate('following', '_id full_name username profile_picture is_verified')
            .populate('connections', '_id full_name username profile_picture is_verified');

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        const posts = await Post.find({ user: id })
            .sort({ createdAt: -1 })
            .populate('user', '_id full_name username profile_picture is_verified')
            .populate('comments.user', '_id full_name username profile_picture');

        // Check connection status relative to the requesting user
        let connectionStatus = 'none'; // 'none' | 'pending' | 'accepted' | 'received'
        if (currentUserId && currentUserId !== id) {
            const connection = await Connection.findOne({
                $or: [
                    { sender: currentUserId, receiver: id },
                    { sender: id, receiver: currentUserId }
                ]
            });

            if (connection) {
                if (connection.status === 'accepted') {
                    connectionStatus = 'accepted';
                } else if (connection.sender === currentUserId) {
                    connectionStatus = 'pending';
                } else {
                    connectionStatus = 'received';
                }
            }
        }

        const isFollowing = currentUserId ? user.followers.some(f => f._id.toString() === currentUserId) : false;

        res.json({
            success: true,
            user,
            posts,
            connectionStatus,
            isFollowing,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Update profile (name, bio, location, pictures)
export const updateUserProfile = async (req, res) => {
    try {
        const userId = req.auth.userId;
        const { full_name, bio, location, profile_picture, cover_photo } = req.body;

        const updateFields = {};
        if (full_name !== undefined) updateFields.full_name = full_name;
        if (bio !== undefined) updateFields.bio = bio;
        if (location !== undefined) updateFields.location = location;
        if (profile_picture !== undefined) updateFields.profile_picture = profile_picture;
        if (cover_photo !== undefined) updateFields.cover_photo = cover_photo;

        const user = await User.findByIdAndUpdate(userId, updateFields, { new: true });
        res.json({ success: true, message: 'Profile updated successfully', user });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Follow a user
export const followUser = async (req, res) => {
    try {
        const currentUserId = req.auth.userId;
        const { id: targetUserId } = req.params;

        if (currentUserId === targetUserId) {
            return res.status(400).json({ success: false, message: 'You cannot follow yourself' });
        }

        await User.findByIdAndUpdate(currentUserId, { $addToSet: { following: targetUserId } });
        await User.findByIdAndUpdate(targetUserId, { $addToSet: { followers: currentUserId } });

        res.json({ success: true, message: 'User followed successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Unfollow a user
export const unfollowUser = async (req, res) => {
    try {
        const currentUserId = req.auth.userId;
        const { id: targetUserId } = req.params;

        await User.findByIdAndUpdate(currentUserId, { $pull: { following: targetUserId } });
        await User.findByIdAndUpdate(targetUserId, { $pull: { followers: currentUserId } });

        res.json({ success: true, message: 'User unfollowed successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Send a friend/connection request
export const sendConnectionRequest = async (req, res) => {
    try {
        const currentUserId = req.auth.userId;
        const { id: targetUserId } = req.params;

        if (currentUserId === targetUserId) {
            return res.status(400).json({ success: false, message: 'Cannot connect with yourself' });
        }

        const existing = await Connection.findOne({
            $or: [
                { sender: currentUserId, receiver: targetUserId },
                { sender: targetUserId, receiver: currentUserId }
            ]
        });

        if (existing) {
            return res.status(400).json({ success: false, message: `Request already exists (${existing.status})` });
        }

        const connection = await Connection.create({
            sender: currentUserId,
            receiver: targetUserId,
            status: 'pending'
        });

        // Trigger background job via Inngest to notify the receiver
        try {
            await inngest.send({
                name: 'app/connection.request',
                data: {
                    senderId: currentUserId,
                    receiverId: targetUserId
                }
            });
        } catch (inngestErr) {
            console.warn('Inngest notification trigger warning:', inngestErr.message);
        }

        res.json({ success: true, message: 'Connection request sent', connection });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Accept a connection request
export const acceptConnectionRequest = async (req, res) => {
    try {
        const currentUserId = req.auth.userId;
        const { id: senderUserId } = req.params;

        const connection = await Connection.findOneAndUpdate(
            { sender: senderUserId, receiver: currentUserId, status: 'pending' },
            { status: 'accepted' },
            { new: true }
        );

        if (!connection) {
            return res.status(404).json({ success: false, message: 'Connection request not found' });
        }

        // Add both to each other's connections list
        await User.findByIdAndUpdate(currentUserId, { $addToSet: { connections: senderUserId } });
        await User.findByIdAndUpdate(senderUserId, { $addToSet: { connections: currentUserId } });

        res.json({ success: true, message: 'Connection request accepted', connection });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Reject or cancel a connection request
export const rejectConnectionRequest = async (req, res) => {
    try {
        const currentUserId = req.auth.userId;
        const { id: otherUserId } = req.params;

        await Connection.findOneAndDelete({
            $or: [
                { sender: otherUserId, receiver: currentUserId },
                { sender: currentUserId, receiver: otherUserId }
            ]
        });

        // Also remove from connections array if already connected
        await User.findByIdAndUpdate(currentUserId, { $pull: { connections: otherUserId } });
        await User.findByIdAndUpdate(otherUserId, { $pull: { connections: currentUserId } });

        res.json({ success: true, message: 'Connection request rejected / removed' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get current user's connections, followers, following & pending requests
export const getConnections = async (req, res) => {
    try {
        const currentUserId = req.auth.userId;

        const user = await User.findById(currentUserId)
            .populate('connections', '_id full_name username bio profile_picture location is_verified')
            .populate('followers', '_id full_name username bio profile_picture location is_verified')
            .populate('following', '_id full_name username bio profile_picture location is_verified');

        const pendingReceived = await Connection.find({
            receiver: currentUserId,
            status: 'pending'
        }).populate('sender', '_id full_name username bio profile_picture location is_verified');

        const pendingSent = await Connection.find({
            sender: currentUserId,
            status: 'pending'
        }).populate('receiver', '_id full_name username bio profile_picture location is_verified');

        res.json({
            success: true,
            connections: user?.connections || [],
            followers: user?.followers || [],
            following: user?.following || [],
            pendingReceived: pendingReceived.map(c => c.sender).filter(Boolean),
            pendingSent: pendingSent.map(c => c.receiver).filter(Boolean),
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Discover & suggested users
export const discoverUsers = async (req, res) => {
    try {
        const currentUserId = req.auth?.userId;

        const filter = {};
        if (currentUserId) {
            filter._id = { $ne: currentUserId };
        }

        const users = await User.find(filter)
            .limit(20)
            .select('_id full_name username bio profile_picture cover_photo location followers connections is_verified');

        res.json({ success: true, users });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Search users by name, username, or bio
export const searchUsers = async (req, res) => {
    try {
        const { q } = req.query;
        if (!q || q.trim() === '') {
            return res.json({ success: true, users: [] });
        }

        const regex = new RegExp(q.trim(), 'i');
        const users = await User.find({
            $or: [
                { full_name: regex },
                { username: regex },
                { bio: regex }
            ]
        })
        .limit(20)
        .select('_id full_name username bio profile_picture location followers connections is_verified');

        res.json({ success: true, users });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

