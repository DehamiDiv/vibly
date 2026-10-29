import Post from '../models/Post.js';
import User from '../models/User.js';
import { uploadToImageKit } from '../configs/imagekit.js';

// Create a new post (supports text, multiple images)
export const createPost = async (req, res) => {
    try {
        const userId = req.auth.userId;
        const { content } = req.body;
        const files = req.files || [];

        const imageUrls = [];

        // Upload images to ImageKit if provided
        for (const file of files) {
            const uploadRes = await uploadToImageKit(
                file.buffer,
                `${userId}_${Date.now()}_${file.originalname}`,
                'posts'
            );
            if (uploadRes && uploadRes.url) {
                imageUrls.push(uploadRes.url);
            }
        }

        // Support direct image_urls sent in JSON body
        if (req.body.image_urls) {
            const extraUrls = Array.isArray(req.body.image_urls) ? req.body.image_urls : [req.body.image_urls];
            imageUrls.push(...extraUrls);
        }

        let postType = 'text';
        if (imageUrls.length > 0 && content) {
            postType = 'text_with_image';
        } else if (imageUrls.length > 0) {
            postType = 'image';
        }

        const post = await Post.create({
            user: userId,
            content: content || '',
            image_urls: imageUrls,
            post_type: postType,
            likes_count: [],
            comments: [],
        });

        const populatedPost = await Post.findById(post._id)
            .populate('user', '_id full_name username profile_picture is_verified');

        res.status(201).json({ success: true, post: populatedPost });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get feed posts (sorted newest first)
export const getFeedPosts = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const skip = (page - 1) * limit;

        const posts = await Post.find()
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .populate('user', '_id full_name username profile_picture is_verified')
            .populate('comments.user', '_id full_name username profile_picture is_verified');

        const total = await Post.countDocuments();

        res.json({
            success: true,
            posts,
            pagination: {
                total,
                page,
                pages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Toggle like / unlike on a post
export const toggleLikePost = async (req, res) => {
    try {
        const userId = req.auth.userId;
        const { id } = req.params;

        const post = await Post.findById(id);
        if (!post) {
            return res.status(404).json({ success: false, message: 'Post not found' });
        }

        const isLiked = post.likes_count.includes(userId);
        if (isLiked) {
            post.likes_count.pull(userId);
        } else {
            post.likes_count.push(userId);
        }

        await post.save();

        res.json({
            success: true,
            isLiked: !isLiked,
            likesCount: post.likes_count.length,
            likes: post.likes_count
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Add a comment to a post
export const addComment = async (req, res) => {
    try {
        const userId = req.auth.userId;
        const { id } = req.params;
        const { text } = req.body;

        if (!text || text.trim() === '') {
            return res.status(400).json({ success: false, message: 'Comment text cannot be empty' });
        }

        const post = await Post.findById(id);
        if (!post) {
            return res.status(404).json({ success: false, message: 'Post not found' });
        }

        post.comments.push({
            user: userId,
            text: text.trim(),
            createdAt: new Date()
        });

        await post.save();

        const updatedPost = await Post.findById(id)
            .populate('comments.user', '_id full_name username profile_picture is_verified');

        res.json({
            success: true,
            comments: updatedPost.comments
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Delete post (only owner)
export const deletePost = async (req, res) => {
    try {
        const userId = req.auth.userId;
        const { id } = req.params;

        const post = await Post.findById(id);
        if (!post) {
            return res.status(404).json({ success: false, message: 'Post not found' });
        }

        if (post.user.toString() !== userId) {
            return res.status(403).json({ success: false, message: 'Not authorized to delete this post' });
        }

        await Post.findByIdAndDelete(id);
        res.json({ success: true, message: 'Post deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

