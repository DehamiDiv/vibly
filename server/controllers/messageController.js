import Message from '../models/Message.js';
import User from '../models/User.js';
import { uploadToImageKit } from '../configs/imagekit.js';

// Map of active Server-Sent Events connections: userId -> Set of Response objects
export const sseClients = new Map();

// Helper to push real-time event to connected user clients
export const sendSSEMessage = (userId, eventType, data) => {
    const clients = sseClients.get(userId.toString());
    if (clients) {
        const payload = `event: ${eventType}\ndata: ${JSON.stringify(data)}\n\n`;
        clients.forEach((client) => {
            try {
                client.write(payload);
            } catch (err) {
                console.warn('Error sending SSE message to client:', err.message);
            }
        });
    }
};

// SSE stream endpoint
export const connectSSE = (req, res) => {
    const { userId } = req.params;

    res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
        'Access-Control-Allow-Origin': '*',
    });

    res.write('event: connected\ndata: {"status":"connected"}\n\n');

    if (!sseClients.has(userId)) {
        sseClients.set(userId, new Set());
    }
    sseClients.get(userId).add(res);

    // Heartbeat to keep connection alive
    const intervalId = setInterval(() => {
        res.write('event: ping\ndata: {}\n\n');
    }, 30000);

    req.on('close', () => {
        clearInterval(intervalId);
        const userClients = sseClients.get(userId);
        if (userClients) {
            userClients.delete(res);
            if (userClients.size === 0) {
                sseClients.delete(userId);
            }
        }
    });
};

// Send a message (text or image)
export const sendMessage = async (req, res) => {
    try {
        const fromUserId = req.auth.userId;
        const { to_user_id, text } = req.body;
        const file = req.file;

        let mediaUrl = req.body.media_url || '';
        let messageType = 'text';

        if (file) {
            const uploadRes = await uploadToImageKit(
                file.buffer,
                `msg_${fromUserId}_${Date.now()}_${file.originalname}`,
                'messages'
            );
            if (uploadRes?.url) {
                mediaUrl = uploadRes.url;
                messageType = 'image';
            }
        } else if (mediaUrl) {
            messageType = 'image';
        }

        const message = await Message.create({
            from_user_id: fromUserId,
            to_user_id,
            text: text || '',
            message_type: messageType,
            media_url: mediaUrl,
            seen: false,
        });

        const populatedMessage = await Message.findById(message._id)
            .populate('from_user_id', '_id full_name username profile_picture is_verified')
            .populate('to_user_id', '_id full_name username profile_picture is_verified');

        // Broadcast to recipient via SSE
        sendSSEMessage(to_user_id, 'new_message', populatedMessage);
        // Also echo to sender for multi-device sync
        sendSSEMessage(fromUserId, 'new_message', populatedMessage);

        res.status(201).json({ success: true, message: populatedMessage });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get recent chats/threads list
export const getRecentChats = async (req, res) => {
    try {
        const currentUserId = req.auth.userId;

        // Find all messages involving current user
        const messages = await Message.find({
            $or: [{ from_user_id: currentUserId }, { to_user_id: currentUserId }]
        })
        .sort({ createdAt: -1 })
        .populate('from_user_id', '_id full_name username profile_picture is_verified')
        .populate('to_user_id', '_id full_name username profile_picture is_verified');

        const chatMap = new Map();

        messages.forEach((msg) => {
            const fromId = msg.from_user_id?._id?.toString() || msg.from_user_id?.toString();
            const toId = msg.to_user_id?._id?.toString() || msg.to_user_id?.toString();

            const partner = fromId === currentUserId ? msg.to_user_id : msg.from_user_id;
            const partnerId = partner?._id?.toString() || partner?.toString();

            if (!partnerId) return;

            if (!chatMap.has(partnerId)) {
                chatMap.set(partnerId, {
                    partner,
                    lastMessage: msg,
                    unreadCount: (!msg.seen && toId === currentUserId) ? 1 : 0
                });
            } else {
                if (!msg.seen && toId === currentUserId) {
                    const current = chatMap.get(partnerId);
                    current.unreadCount += 1;
                }
            }
        });

        const recentChats = Array.from(chatMap.values());
        res.json({ success: true, recentChats });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get message conversation history with another user
export const getMessagesBetweenUsers = async (req, res) => {
    try {
        const currentUserId = req.auth.userId;
        const { userId: partnerId } = req.params;

        const messages = await Message.find({
            $or: [
                { from_user_id: currentUserId, to_user_id: partnerId },
                { from_user_id: partnerId, to_user_id: currentUserId },
            ]
        })
        .sort({ createdAt: 1 })
        .populate('from_user_id', '_id full_name username profile_picture is_verified')
        .populate('to_user_id', '_id full_name username profile_picture is_verified');

        res.json({ success: true, messages });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Mark conversation messages as seen
export const markMessagesAsSeen = async (req, res) => {
    try {
        const currentUserId = req.auth.userId;
        const { userId: senderId } = req.params;

        await Message.updateMany(
            { from_user_id: senderId, to_user_id: currentUserId, seen: false },
            { $set: { seen: true } }
        );

        // Notify original sender that their messages were seen
        sendSSEMessage(senderId, 'messages_seen', { seenBy: currentUserId });

        res.json({ success: true, message: 'Messages marked as seen' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

