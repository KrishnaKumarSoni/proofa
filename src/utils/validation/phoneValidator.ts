import { setupLogger } from '../logger';

const logger = setupLogger('phone-validator');

export class PhoneValidator {
    private static readonly PHONE_REGEX = /^\d{1,3}\d{10}$/;

    public static isValidPhoneNumber(phone: string): boolean {
        // Remove WhatsApp suffix if present
        const cleanPhone = phone.split('@')[0];
        
        const isValid = this.PHONE_REGEX.test(cleanPhone);
        logger.info(`Phone validation result: ${isValid}`, { phone: cleanPhone });
        
        return isValid;
    }
}