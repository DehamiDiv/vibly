import Story from '../models/Story.js';
import { uploadToImageKit } from '../configs/imagekit.js';

// Create a new story
export const createStory = async (req, res) => {
    try {
        const userId = req.auth.userId;
        const { content, media_type, background_color } = req.body;
        const file = req.file;

        let mediaUrl = req.body.media_url || '';

        if (file) {
            const uploadRes = await uploadToImageKit(
                file.buffer,
                `story_${userId}_${Date.now()}_${file.originalname}`,
                'stories'
            );
            if (uploadRes?.url) {
                mediaUrl = uploadRes.url;
            }
        }

        const story = await Story.create({
            user: userId,
            content: content || '',
            media_url: mediaUrl,
            media_type: media_type || (mediaUrl ? 'image' : 'text'),
            background_color: background_color || '#4f46e5',
        });

        const populatedStory = await Story.findById(story._id)
            .populate('user', '_id full_name username profile_picture is_verified');

        res.status(201).json({ success: true, story: populatedStory });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get all active stories (from the last 24 hours)
export const getStories = async (req, res) => {
    try {
        const last24h = new Date(Date.now() - 24 * 60 * 60 * 1000);

        const stories = await Story.find({ createdAt: { $gte: last24h } })
            .sort({ createdAt: -1 })
            .populate('user', '_id full_name username profile_picture is_verified');

        res.json({ success: true, stories });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Delete a story
export const deleteStory = async (req, res) => {
    try {
        const userId = req.auth.userId;
        const { id } = req.params;

        const story = await Story.findById(id);
        if (!story) {
            return res.status(404).json({ success: false, message: 'Story not found' });
        }

        if (story.user.toString() !== userId) {
            return res.status(403).json({ success: false, message: 'Not authorized to delete this story' });
        }

        await Story.findByIdAndDelete(id);
        res.json({ success: true, message: 'Story deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

