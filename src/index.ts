import dotenv from 'dotenv';
import { WhatsAppClient } from './services/whatsapp/client';
import { MessageHandler } from './services/whatsapp/messageHandler';
import { setupLogger } from './utils/logger';
import QRCode from 'qrcode-terminal';

dotenv.config();
const logger = setupLogger('main');

async function main() {
    try {
        const whatsapp = WhatsAppClient.getInstance();
        const messageHandler = new MessageHandler(whatsapp.getClient());

        whatsapp.on('qr', (qr) => {
            QRCode.generate(qr, { small: true });
            logger.info('QR Code generated. Please scan with WhatsApp.');
        });

        whatsapp.on('ready', () => {
            logger.info('WhatsApp client is ready and connected.');
        });

        whatsapp.on('message', async (message) => {
            await messageHandler.handleMessage(message);
        });

        whatsapp.initialize();
    } catch (error) {
        logger.error('Application error:', error);
        process.exit(1);
    }
}

main();