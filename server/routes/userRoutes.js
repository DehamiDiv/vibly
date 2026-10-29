import express from 'express';
import {
    getCurrentUser,
    getUserProfile,
    updateUserProfile,
    followUser,
    unfollowUser,
    sendConnectionRequest,
    acceptConnectionRequest,
    rejectConnectionRequest,
    getConnections,
    discoverUsers,
    searchUsers,
} from '../controllers/userController.js';
import { requireAuth, optionalAuth } from '../middlewares/auth.js';

const router = express.Router();

router.get('/me', requireAuth, getCurrentUser);
router.get('/profile/:id', optionalAuth, getUserProfile);
router.put('/update', requireAuth, updateUserProfile);

// Social connections & follow
router.post('/follow/:id', requireAuth, followUser);
router.post('/unfollow/:id', requireAuth, unfollowUser);
router.post('/connect/:id', requireAuth, sendConnectionRequest);
router.post('/connect/accept/:id', requireAuth, acceptConnectionRequest);
router.post('/connect/reject/:id', requireAuth, rejectConnectionRequest);
router.get('/connections', requireAuth, getConnections);

// Discovery & Search
router.get('/discover', optionalAuth, discoverUsers);
router.get('/search', optionalAuth, searchUsers);

export default router;

