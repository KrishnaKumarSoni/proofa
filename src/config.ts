import dotenv from 'dotenv';
dotenv.config();

export default {
    claudeApiKey: process.env.CLAUDE_API_KEY,
    sessionTimeout: parseInt(process.env.SESSION_TIMEOUT || '1800000'),
    sessionValidity: parseInt(process.env.SESSION_VALIDITY || '86400000'),
    maxRetries: parseInt(process.env.MAX_RETRIES || '3'),
    retryDelay: parseInt(process.env.RETRY_DELAY || '5000')
};