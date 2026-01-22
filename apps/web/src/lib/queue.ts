import { Queue } from 'bullmq';
import IORedis from 'ioredis';

// Use same Redis URL
const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';

const connection = new IORedis(redisUrl, {
    maxRetriesPerRequest: null,
});

export const instagramQueue = new Queue('instagram-events', {
    connection,
    defaultJobOptions: {
        attempts: 3,
        backoff: {
            type: 'exponential',
            delay: 1000,
        },
        removeOnComplete: true,
        removeOnFail: false
    }
});
