import { Message } from 'whatsapp-web.js';
import { setupLogger } from './logger';

const logger = setupLogger('command-parser');

export enum CommandType {
    MENU = 'menu',
    START = 'start',
    STATUS = 'status',
    HELP = 'help',
    RESET = 'reset',
    UNKNOWN = 'unknown'
}

export class CommandParser {
    private static readonly COMMANDS = {
        menu: ['menu', 'm'],
        start: ['start', 'begin', '1'],
        status: ['status', 'check', '2'],
        help: ['help', 'h', '3'],
        reset: ['reset', 'restart', 'clear']
    };

    public static parse(message: Message): CommandType {
        const content = message.body.toLowerCase().trim();

        for (const [command, aliases] of Object.entries(this.COMMANDS)) {
            if (aliases.includes(content)) {
                logger.info(`Command parsed: ${command}`);
                return command as CommandType;
            }
        }

        logger.info('Unknown command received');
        return CommandType.UNKNOWN;
    }
} 