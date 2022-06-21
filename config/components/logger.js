const { createLogger, format, transports } = require('winston');
const { combine, timestamp, label, printf, colorize } = format;

const myFormat = printf(({ level, message, timestamp }) => {
    return `[${level}] ${timestamp} ${message}`;
});


const logger = createLogger({
    level: 'info',
    format: combine(
        colorize(),
        timestamp({format: 'DD-MM-YYYY HH:mm'}),
        myFormat,
    ),
    transports: [new transports.Console(),
        new transports.File({ filename: 'log/error.log', level: 'error' }),
    ],
});

module.exports = logger;