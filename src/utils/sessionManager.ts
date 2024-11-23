import { Session } from '../types/session';
import { setupLogger } from './logger';
import crypto from 'crypto';

const logger = setupLogger('session-manager');

export class SessionManager {
    private sessions: Map<string, Session>;
    private readonly SESSION_VALIDITY = 24 * 60 * 60 * 1000; // 24 hours
    private readonly INACTIVITY_TIMEOUT = 30 * 60 * 1000;    // 30 minutes
    private cleanupInterval!: NodeJS.Timeout;

    constructor() {
        this.sessions = new Map();
        this.startCleanupScheduler();
    }

    public async createSession(phone: string): Promise<Session> {
        const token = crypto.randomBytes(32).toString('hex');
        const now = Date.now();
        
        const session: Session = {
            id: crypto.randomUUID(),
            phone,
            token,
            createdAt: now,
            lastActive: now
        };

        this.sessions.set(phone, session);
        logger.info('Session created', { phone });
        return session;
    }

    public async validateSession(phone: string): Promise<boolean> {
        const session = this.sessions.get(phone);
        if (!session) return false;

        const now = Date.now();
        const sessionAge = now - session.createdAt;
        const inactivityPeriod = now - session.lastActive;

        if (sessionAge > this.SESSION_VALIDITY || inactivityPeriod > this.INACTIVITY_TIMEOUT) {
            await this.removeSession(phone);
            return false;
        }

        session.lastActive = now;
        this.sessions.set(phone, session);
        return true;
    }

    public async removeSession(phone: string): Promise<void> {
        this.sessions.delete(phone);
        logger.info('Session removed', { phone });
    }

    private startCleanupScheduler(): void {
        this.cleanupInterval = setInterval(() => {
            const now = Date.now();
            this.sessions.forEach((session, phone) => {
                const sessionAge = now - session.createdAt;
                const inactivityPeriod = now - session.lastActive;

                if (sessionAge > this.SESSION_VALIDITY || inactivityPeriod > this.INACTIVITY_TIMEOUT) {
                    this.removeSession(phone);
                }
            });
        }, 5 * 60 * 1000); // Run cleanup every 5 minutes
    }

    public stopCleanupScheduler(): void {
        if (this.cleanupInterval) {
            clearInterval(this.cleanupInterval);
        }
    }
}