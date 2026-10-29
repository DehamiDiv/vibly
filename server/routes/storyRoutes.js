import express from 'express';
import {
    createStory,
    getStories,
    deleteStory,
} from '../controllers/storyController.js';
import { requireAuth, optionalAuth } from '../middlewares/auth.js';
import { upload } from '../configs/multer.js';

const router = express.Router();

router.post('/', requireAuth, upload.single('media'), createStory);
router.get('/', optionalAuth, getStories);
router.delete('/:id', requireAuth, deleteStory);

export default router;

