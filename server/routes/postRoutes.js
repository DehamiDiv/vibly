import express from 'express';
import {
    createPost,
    getFeedPosts,
    toggleLikePost,
    addComment,
    deletePost,
} from '../controllers/postController.js';
import { requireAuth, optionalAuth } from '../middlewares/auth.js';
import { upload } from '../configs/multer.js';

const router = express.Router();

router.post('/', requireAuth, upload.array('images', 5), createPost);
router.get('/', optionalAuth, getFeedPosts);
router.post('/like/:id', requireAuth, toggleLikePost);
router.post('/comment/:id', requireAuth, addComment);
router.delete('/:id', requireAuth, deletePost);

export default router;

