import { createLogger, format, transports } from 'winston';

const logger = createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: format.combine(
    format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    format.errors({ stack: true }),
    format.splat(),
    format.json()
  ),
  defaultMeta: { service: 'sms-notification-service' },
  transports: [
    new transports.Console({
      format: format.combine(
        format.colorize(),
        format.printf(({ timestamp, level, message, ...rest }) => {
          const meta = Object.keys(rest).length ?
            `\n${JSON.stringify(rest, null, 2)}` : '';
          return `${timestamp} ${level}: ${message}${meta}`;
        })
      )
    })
  ]
});

export default logger;