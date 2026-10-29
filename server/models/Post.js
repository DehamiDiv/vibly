import mongoose from 'mongoose';

const postSchema = new mongoose.Schema({
    user: { type: String, ref: 'User', required: true },
    content: { type: String, default: '' },
    image_urls: [{ type: String }],
    post_type: { 
        type: String, 
        enum: ['text', 'image', 'text_with_image'], 
        default: 'text' 
    },
    likes_count: [{ type: String, ref: 'User' }],
    comments: [
        {
            user: { type: String, ref: 'User', required: true },
            text: { type: String, required: true },
            createdAt: { type: Date, default: Date.now },
        }
    ],
}, { timestamps: true });

const Post = mongoose.models.Post || mongoose.model('Post', postSchema);

export default Post;

