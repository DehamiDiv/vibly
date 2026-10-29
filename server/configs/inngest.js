import { Inngest } from 'inngest';
import dotenv from 'dotenv';
dotenv.config();

export const inngest = new Inngest({
    id: 'vibly-app',
    eventKey: process.env.INNGEST_EVENT_KEY || 'inngest-local-dev-key',
    isDev: process.env.NODE_ENV !== 'production'
});

