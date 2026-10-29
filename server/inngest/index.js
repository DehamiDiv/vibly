import { inngest } from '../configs/inngest.js';
import User from '../models/User.js';
import Story from '../models/Story.js';
import { sendNotificationEmail } from '../configs/nodemailer.js';

// Sync Clerk user creation with MongoDB
export const syncUserCreation = inngest.createFunction(
    { id: 'sync-user-creation' },
    { event: 'clerk/user.created' },
    async ({ event }) => {
        const { id, first_name, last_name, email_addresses, image_url, username } = event.data;

        const email = email_addresses?.[0]?.email_address || '';
        const full_name = [first_name, last_name].filter(Boolean).join(' ') || username || 'User';
        const userUsername = username || email.split('@')[0] || `user_${Date.now()}`;

        const userData = {
            _id: id,
            email,
            full_name,
            username: userUsername,
            profile_picture: image_url || '',
        };

        await User.findByIdAndUpdate(id, userData, { upsert: true, new: true });
        console.log(`[Inngest] Synced new user creation: ${id} (${userUsername})`);
        return { success: true, userId: id };
    }
);

// Sync Clerk user updation with MongoDB
export const syncUserUpdation = inngest.createFunction(
    { id: 'sync-user-updation' },
    { event: 'clerk/user.updated' },
    async ({ event }) => {
        const { id, first_name, last_name, email_addresses, image_url, username } = event.data;

        const email = email_addresses?.[0]?.email_address;
        const full_name = [first_name, last_name].filter(Boolean).join(' ');

        const updateData = {};
        if (email) updateData.email = email;
        if (full_name) updateData.full_name = full_name;
        if (username) updateData.username = username;
        if (image_url) updateData.profile_picture = image_url;

        await User.findByIdAndUpdate(id, updateData);
        console.log(`[Inngest] Synced user update: ${id}`);
        return { success: true, userId: id };
    }
);

// Sync Clerk user deletion with MongoDB
export const syncUserDeletion = inngest.createFunction(
    { id: 'sync-user-deletion' },
    { event: 'clerk/user.deleted' },
    async ({ event }) => {
        const { id } = event.data;
        await User.findByIdAndDelete(id);
        console.log(`[Inngest] Synced user deletion: ${id}`);
        return { success: true, userId: id };
    }
);

// Periodic story cleanup background job
export const deleteExpiredStories = inngest.createFunction(
    { id: 'delete-expired-stories' },
    { cron: '0 * * * *' }, // Runs every hour
    async () => {
        const cutoff = new Date(Date.now() - 24 * 60 * 60 * 1000);
        const result = await Story.deleteMany({ createdAt: { $lt: cutoff } });
        console.log(`[Inngest] Cleaned up ${result.deletedCount} expired stories`);
        return { deletedCount: result.deletedCount };
    }
);

// Background notification job when a connection request is sent
export const sendConnectionNotification = inngest.createFunction(
    { id: 'send-connection-notification' },
    { event: 'app/connection.request' },
    async ({ event }) => {
        const { senderId, receiverId } = event.data;

        const sender = await User.findById(senderId);
        const receiver = await User.findById(receiverId);

        if (sender && receiver && receiver.email) {
            await sendNotificationEmail({
                to: receiver.email,
                subject: `${sender.full_name} sent you a connection request on Vibly!`,
                html: `
                    <div style="font-family: sans-serif; padding: 20px;">
                        <h2>New Connection Request</h2>
                        <p><strong>${sender.full_name}</strong> (@${sender.username}) wants to connect with you on Vibly.</p>
                        <p><a href="http://localhost:5173/connections" style="background:#7c3aed; color:white; padding: 10px 18px; border-radius: 6px; text-decoration: none;">View Request</a></p>
                    </div>
                `
            });
        }

        return { success: true };
    }
);

export const inngestFunctions = [
    syncUserCreation,
    syncUserUpdation,
    syncUserDeletion,
    deleteExpiredStories,
    sendConnectionNotification
];

