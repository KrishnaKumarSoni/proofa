import { setupLogger } from '../../utils/logger';

const logger = setupLogger('message-queue');

type QueueTask = () => Promise<void>;

export class MessageQueue {
    private queue: QueueTask[] = [];
    private processing: boolean = false;

    public async enqueue(task: QueueTask): Promise<void> {
        this.queue.push(task);
        logger.info('Task added to queue', { queueLength: this.queue.length });
        
        if (!this.processing) {
            await this.processQueue();
        }
    }

    private async processQueue(): Promise<void> {
        if (this.processing || this.queue.length === 0) {
            return;
        }

        this.processing = true;

        try {
            while (this.queue.length > 0) {
                const task = this.queue.shift();
                if (task) {
                    await task();
                }
            }
        } catch (error) {
            logger.error('Error processing queue', error);
        } finally {
            this.processing = false;
        }
    }
}