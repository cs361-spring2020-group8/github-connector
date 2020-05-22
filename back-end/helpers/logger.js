const { createLogger, format, transports } = require('winston');
const { printf, combine, timestamp, prettyPrint, json, colorize } = format;

class Logger {
  constructor() {
    if (!!Logger.instance) {
      return Logger.instance;
    }

    this._logger = createLogger({
      level: 'info',
      format: combine(
        colorize(),
        timestamp(),
        prettyPrint(),
        json(),
        // https://github.com/winstonjs/winston/issues/1135#issuecomment-343980350
        printf((msg) => {
          const { timestamp, level, message, ...args } = msg;
          const ts = timestamp.slice(0, 19).replace('T', ' ');
          return `${ts} [${level}]: ${message} ${Object.keys(args).length ? JSON.stringify(args, null, 2) : ''}`;
        })
      ),
      transports: [
        new transports.Console()
      ],
    });
    Logger.instance = this;

    return this;
  }

  info(msg) {
    this._logger.info(msg);
  }

  warn(msg) {
    this._logger.warn(msg);
  }

  error(msg) {
    this._logger.warn(msg)
  }
}

const loggerInstance = new Logger();
Object.freeze(loggerInstance);

module.exports = loggerInstance;
