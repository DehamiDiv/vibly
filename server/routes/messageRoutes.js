import express from 'express';
import {
    connectSSE,
    sendMessage,
    getRecentChats,
    getMessagesBetweenUsers,
    markMessagesAsSeen,
} from '../controllers/messageController.js';
import { requireAuth } from '../middlewares/auth.js';
import { upload } from '../configs/multer.js';

const router = express.Router();

// Real-time SSE endpoint
router.get('/sse/:userId', connectSSE);

// Messaging CRUD
router.post('/send', requireAuth, upload.single('image'), sendMessage);
router.get('/recent', requireAuth, getRecentChats);
router.get('/:userId', requireAuth, getMessagesBetweenUsers);
router.put('/seen/:userId', requireAuth, markMessagesAsSeen);

export default router;

