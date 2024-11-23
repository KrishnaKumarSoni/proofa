import winston from 'winston';

export const setupLogger = (service: string) => {
    return winston.createLogger({
        level: 'info',
        format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.json()
        ),
        defaultMeta: { service },
        transports: [
            new winston.transports.File({ filename: 'error.log', level: 'error' }),
            new winston.transports.File({ filename: 'combined.log' }),
            new winston.transports.Console({
                format: winston.format.simple()
            })
        ]
    });
};