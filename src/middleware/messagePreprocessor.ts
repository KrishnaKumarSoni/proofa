import { Message } from 'whatsapp-web.js';
import { setupLogger } from '../utils/logger';

const logger = setupLogger('message-preprocessor');

export class MessagePreprocessor {
    public static process(message: Message): Message {
        try {
            // Remove extra whitespace
            message.body = message.body.trim();
            
            // Convert mentions to standard format
            if (message.mentionedIds?.length > 0) {
                message.body = this.standardizeMentions(message);
            }

            // Handle media messages
            if (message.hasMedia) {
                logger.info('Media message detected', { type: message.type });
            }

            return message;
        } catch (error) {
            logger.error('Error preprocessing message', error);
            return message;
        }
    }

    private static standardizeMentions(message: Message): string {
        let body = message.body;
        message.mentionedIds?.forEach(id => {
            body = body.replace(`@${id}`, `@user`);
        });
        return body;
    }
} 