import { Worker } from 'bullmq';
import { resumeWorkflowFromJob } from './lib/instagram-service';
import IORedis from 'ioredis';

const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';

const connection = new IORedis(redisUrl, {
    maxRetriesPerRequest: null,
});

console.log(`[Worker] Starting... Connecting to ${redisUrl}`);

const worker = new Worker('instagram-events', async (job) => {
    console.log(`[Worker] Processing job ${job.name} (${job.id})`);
    if (job.name === 'resumeWorkflow') {
        try {
            await resumeWorkflowFromJob(job.data);
            console.log(`[Worker] Job ${job.id} done.`);
        } catch (error) {
            console.error(`[Worker] Job ${job.id} failed:`, error);
            throw error;
        }
    }
}, {
    connection: connection as any,
    concurrency: 5
});

worker.on('ready', () => {
    console.log('[Worker] Ready and waiting for jobs...');
});

worker.on('error', (err) => {
    console.error('[Worker] Error:', err);
});
