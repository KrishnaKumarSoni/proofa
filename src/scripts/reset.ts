import fs from 'fs';
import path from 'path';
import { setupLogger } from '../utils/logger';

const logger = setupLogger('reset-script');

async function resetWhatsAppSession() {
    const authPath = path.join(process.cwd(), '.wwebjs_auth');
    
    try {
        if (fs.existsSync(authPath)) {
            fs.rmSync(authPath, { recursive: true, force: true });
            logger.info('WhatsApp session cleared successfully');
        }
    } catch (error) {
        logger.error('Error clearing WhatsApp session', error);
        throw error;
    }
}

resetWhatsAppSession().catch(console.error); 