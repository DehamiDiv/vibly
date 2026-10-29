import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { serve } from 'inngest/express';
import { Webhook } from 'svix';

import connectDB from './configs/db.js';
import { inngest } from './configs/inngest.js';
import { inngestFunctions } from './inngest/index.js';
import { getAuthParameters } from './configs/imagekit.js';

import userRoutes from './routes/userRoutes.js';
import postRoutes from './routes/postRoutes.js';
import storyRoutes from './routes/storyRoutes.js';
import messageRoutes from './routes/messageRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to Database
connectDB();

// Global Middlewares
app.use(cors({
    origin: '*',
    credentials: true,
}));

// Clerk Webhooks handler requires raw body verification with Svix
app.post(
    '/api/webhooks/clerk',
    express.raw({ type: 'application/json' }),
    async (req, res) => {
        try {
            const webhookSecret = process.env.CLERK_WEBHOOK_SECRET;
            if (!webhookSecret) {
                console.warn('⚠️ CLERK_WEBHOOK_SECRET is not configured');
                return res.status(200).json({ received: true, note: 'Webhook received but secret not configured' });
            }

            const payload = req.body.toString('utf8');
            const svixHeaders = {
                'svix-id': req.headers['svix-id'],
                'svix-timestamp': req.headers['svix-timestamp'],
                'svix-signature': req.headers['svix-signature'],
            };

            const wh = new Webhook(webhookSecret);
            const evt = wh.verify(payload, svixHeaders);

            // Forward the webhook event to Inngest for background handling
            await inngest.send({
                name: `clerk/${evt.type}`,
                data: evt.data,
            });

            res.status(200).json({ success: true, event: evt.type });
        } catch (err) {
            console.error('Clerk webhook verification failed:', err.message);
            res.status(400).json({ success: false, message: err.message });
        }
    }
);

// Standard JSON parsers for remaining endpoints
app.use(express.json({ limit: '15mb' }));
app.use(express.urlencoded({ extended: true, limit: '15mb' }));

// Inngest Background Jobs & Workflow Endpoint
app.use(
    '/api/inngest',
    serve({
        client: inngest,
        functions: inngestFunctions,
    })
);

// ImageKit Authentication Parameters (for secure client-side direct uploads)
app.get('/api/imagekit/auth', (req, res) => {
    try {
        const authParams = getAuthParameters();
        res.json(authParams);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Modular Feature Routes
app.use('/api/user', userRoutes);
app.use('/api/post', postRoutes);
app.use('/api/story', storyRoutes);
app.use('/api/message', messageRoutes);

// Root health check
app.get('/', (req, res) => {
    res.json({
        name: 'Vibly API Server',
        status: 'online',
        version: '1.0.0',
        features: [
            'Clerk Authentication & Webhooks',
            'Inngest Background Jobs',
            'ImageKit Media Storage & Optimization',
            'Real-Time Messaging with SSE',
            'Posts, Stories & Social Connections'
        ]
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Server Error:', err.stack);
    res.status(500).json({
        success: false,
        message: err.message || 'Internal Server Error',
    });
});

app.listen(PORT, () => {
    console.log(`🚀 Vibly server running on port http://localhost:${PORT}`);
    console.log(`⚡ Inngest serve endpoint ready at http://localhost:${PORT}/api/inngest`);
});

