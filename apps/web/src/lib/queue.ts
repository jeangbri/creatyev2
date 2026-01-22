import { Queue } from 'bullmq';
import IORedis from 'ioredis';

// Singleton Ref for Redis to prevent multiple connections in Dev (Hot Reload)
const globalForRedis = global as unknown as { redisConnection: IORedis };

const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';

// Prevent connection during build if possible, or just accept localhost (which will fail to connect but shouldn't crash build unless used)
const connection =
    globalForRedis.redisConnection ||
    new IORedis(redisUrl, {
        maxRetriesPerRequest: null,
        // Lazy connect to avoid immediate connection errors during build if Redis is missing
        lazyConnect: true
    });

if (process.env.NODE_ENV !== 'production') globalForRedis.redisConnection = connection;

export const instagramQueue = new Queue('instagram-events', {
    connection: connection,
    defaultJobOptions: {
        attempts: 3,
        backoff: {
            type: 'exponential',
            delay: 1000,
        },
        removeOnComplete: true,
        removeOnFail: false
    }
} as any); // Cast to any to bypass strict type checks causing build failures
