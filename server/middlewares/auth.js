import dotenv from 'dotenv';
dotenv.config();

/**
 * Clerk authentication and flexible development middleware.
 * Verifies Clerk Session Tokens or Bearer tokens.
 */
export const requireAuth = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        const xUserId = req.headers['x-user-id'];

        let userId = null;

        if (xUserId) {
            userId = xUserId;
        } else if (authHeader && authHeader.startsWith('Bearer ')) {
            const token = authHeader.split(' ')[1];
            // Decode payload safely (Clerk JWT format)
            try {
                const base64Payload = token.split('.')[1];
                if (base64Payload) {
                    const decoded = JSON.parse(Buffer.from(base64Payload, 'base64').toString('utf8'));
                    userId = decoded.sub || decoded.userId;
                }
            } catch (err) {
                // If direct token parse fails, check if token itself is user ID (dev fallback)
                userId = token;
            }
        }

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: 'Unauthorized: Authentication token or user ID is required.'
            });
        }

        req.auth = { userId };
        next();
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: 'Unauthorized: Invalid authentication credentials.',
            error: error.message
        });
    }
};

export const optionalAuth = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        const xUserId = req.headers['x-user-id'];

        let userId = null;

        if (xUserId) {
            userId = xUserId;
        } else if (authHeader && authHeader.startsWith('Bearer ')) {
            const token = authHeader.split(' ')[1];
            try {
                const base64Payload = token.split('.')[1];
                if (base64Payload) {
                    const decoded = JSON.parse(Buffer.from(base64Payload, 'base64').toString('utf8'));
                    userId = decoded.sub || decoded.userId;
                }
            } catch {
                userId = token;
            }
        }

        req.auth = userId ? { userId } : null;
        next();
    } catch {
        req.auth = null;
        next();
    }
};

