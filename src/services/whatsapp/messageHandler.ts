import { Message, Buttons, List, Client } from 'whatsapp-web.js';
import { SessionManager } from '../../utils/sessionManager';
import { MessageQueue } from '../../utils/queue/messageQueue';
import { CommandParser, CommandType } from '../../utils/commandParser';
import { PhoneValidator } from '../../utils/validation/phoneValidator';
import { setupLogger } from '../../utils/logger';
import { MessagePreprocessor } from '../../middleware/messagePreprocessor';

const logger = setupLogger('message-handler');

export class MessageHandler {
    private sessionManager: SessionManager;
    private messageQueue: MessageQueue;
    private client: Client;
    private readonly commands = {
        menu: async (message: any) => {
            const menuText = 
                '🚚 *EPOD System Menu*\n\n' +
                '1. 📷 Submit EPOD\n' +
                '2. 📍 Share Location\n' +
                '3. ❓ Help\n' +
                '4. 📋 Status';
            
            await message.reply(menuText);
        },
        // Add other commands here
    };

    constructor(client: Client) {
        this.client = client;
        this.sessionManager = new SessionManager();
        this.messageQueue = new MessageQueue();
    }

    public async handleMessage(message: Message): Promise<void> {
        try {
            await this.messageQueue.enqueue(async () => {
                // Preprocess message
                message = MessagePreprocessor.process(message);
                
                const phone = message.from;
                const isValidSession = await this.sessionManager.validateSession(phone);

                if (!isValidSession) {
                    await this.handleNewSession(message);
                    return;
                }

                await this.processMessage(message);
            });
        } catch (error) {
            logger.error('Error handling message', error);
            throw error;
        }
    }

    private async handleNewSession(message: Message): Promise<void> {
        try {
            const phone = message.from;
            
            if (!PhoneValidator.isValidPhoneNumber(phone)) {
                await message.reply('Invalid phone number format. Please contact support.');
                return;
            }

            await this.sessionManager.createSession(phone);

            // Using proper Buttons class implementation
            const buttonsMessage = new Buttons(
                'Welcome to EPOD System! 📦\nPlease select an option:',
                [
                    { body: '▶️ Start Delivery' },  // Removed custom IDs
                    { body: '📊 Check Status' },
                    { body: '❓ Help' }
                ],
                'EPOD System',
                'Select an option to continue'
            );

            await this.client.sendMessage(message.from, buttonsMessage);
            
        } catch (error) {
            logger.error('Error handling new session', error);
            throw error;
        }
    }

    private async processMessage(message: Message): Promise<void> {
        try {
            const command = this.parseCommand(message.body.toLowerCase());
            const validCommand = command as keyof typeof this.commands;
            if (validCommand in this.commands) {
                await this.commands[validCommand](message);
            } else {
                await message.reply('Type "menu" to see available options.');
            }
        } catch (error) {
            logger.error('Error processing message', error);
            await message.reply('Error occurred. Type "menu" to start over.');
        }
    }

    private parseCommand(command: string): string {
        const commands = {
            menu: 'menu',
            // Add other commands here
        } as Record<string, string>;

        return commands[command] || 'menu';
    }
}