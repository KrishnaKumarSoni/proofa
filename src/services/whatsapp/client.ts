import { Client, LocalAuth } from 'whatsapp-web.js';
import { EventEmitter } from 'events';
import { setupLogger } from '../../utils/logger';

const logger = setupLogger('whatsapp-client');

export class WhatsAppClient extends EventEmitter {
    private client: Client;
    private static instance: WhatsAppClient | null = null;

    private constructor() {
        super();
        this.client = new Client({
            authStrategy: new LocalAuth(),
            puppeteer: {
                headless: true,
                args: [
                    '--no-sandbox',
                    '--disable-setuid-sandbox',
                    '--disable-dev-shm-usage',
                    '--disable-accelerated-2d-canvas',
                    '--no-first-run',
                    '--disable-gpu'
                ],
                timeout: 60000
            }
        });

        this.setupEventListeners();
    }

    private setupEventListeners() {
        this.client.on('qr', (qr) => this.emit('qr', qr));
        this.client.on('ready', () => {
            logger.info('WhatsApp client is ready');
            this.emit('ready');
        });
        this.client.on('message', (msg) => {
            logger.info(`Message received from ${msg.from}`);
            this.emit('message', msg);
        });
        this.client.on('disconnected', (reason) => {
            logger.warn('Client disconnected', { reason });
            this.emit('disconnected', reason);
        });
    }

    public static getInstance(): WhatsAppClient {
        if (!WhatsAppClient.instance) {
            WhatsAppClient.instance = new WhatsAppClient();
        }
        return WhatsAppClient.instance;
    }

    public async initialize(): Promise<void> {
        try {
            await this.client.initialize();
        } catch (error) {
            logger.error('Failed to initialize WhatsApp client', error);
            throw error;
        }
    }

    public async logout(): Promise<void> {
        try {
            await this.client.logout();
            await this.client.destroy();
            WhatsAppClient.instance = null;
            logger.info('WhatsApp client logged out successfully');
        } catch (error) {
            logger.error('Error during logout', error);
            throw error;
        }
    }

    public getClient(): Client {
        return this.client;
    }
}