import * as Winston from 'winston';
import callsites from 'callsites';

export enum LogLevel {
    error, warn, info, debug
}

export const parseLogLevel = (level: string) => {
    let logLevel: LogLevel;
    switch (level) {
        case 'error':
            logLevel = LogLevel.error;
            break;
        case 'warn':
            logLevel = LogLevel.warn;
            break;
        case 'debug':
            logLevel = LogLevel.debug;
            break;
        default:
            logLevel = LogLevel.info;
    }
    return logLevel;
};

export interface LogConfig {
    level?: LogLevel;
    showCaller?: boolean;
    extra?: object;
}

export interface MainLogConfig {
    level?: LogLevel;
    showCaller?: boolean;
    loggerOptions?: Winston.LoggerOptions;
    format?: (logInfo: any) => string;
}

export class Logger {
    private static mainLoggerConfig: MainLogConfig = {
        level: LogLevel.info,
        showCaller: true
    };
    private static mainLogger: Winston.Logger = Logger.instantiateMainLogger();

    private config: LogConfig;
    private logger: Winston.Logger;

    constructor() {
        this.config = Logger.mainLoggerConfig;
        this.logger = Logger.mainLogger;
    }

    public static configureMainLogger(config: MainLogConfig) {
        this.mainLoggerConfig = config;
        Logger.mainLogger = Logger.instantiateMainLogger();
    }

    public configure(config: LogConfig) {
        this.config = {
            level: config.level || Logger.mainLoggerConfig.level,
            showCaller: config.showCaller !== undefined ? config.showCaller : Logger.mainLoggerConfig.showCaller,
            extra: config.extra
        };
        this.logger = this.createChildLogger();
    }

    public isDebugEnabled(): boolean {
        return this.config.level === LogLevel.debug;
    }

    public isInfoEnabled(): boolean {
        return this.config.level >= LogLevel.info;
    }

    public isWarnEnabled(): boolean {
        return this.config.level >= LogLevel.warn;
    }

    public isErrorEnabled(): boolean {
        return this.config.level >= LogLevel.error;
    }

    public debug(message: string, meta?: any) {
        this.logger.debug(message, this.fillCaller(meta));
    }

    public info(message: string, meta?: any) {
        this.logger.info(message, this.fillCaller(meta));
    }

    public warn(message: string, meta?: any) {
        this.logger.warn(message, this.fillCaller(meta));
    }

    public error(message: string, meta?: any) {
        this.logger.error(message, this.fillCaller(meta));
    }

    private fillCaller(meta: any) {
        if (this.config.showCaller) {
            const stacks = callsites();
            if (stacks) {
                if (!meta) {
                    meta = {};
                }
                meta.caller = stacks[2].getFileName();
            }
        }
        return meta;
    }

    private createChildLogger() {
        const childLogger = Logger.mainLogger.child(this.config.extra || {});
        childLogger.level = LogLevel[this.config.level || LogLevel.info];
        return childLogger;
    }

    private static instantiateMainLogger() {
        const options: Winston.LoggerOptions = Logger.mainLoggerConfig.loggerOptions || {
            format: Winston.format.combine(
                Winston.format.timestamp({
                    format: 'YYYY-MM-DD HH:mm:ss'
                }),
                Winston.format.ms(),
                (Logger.mainLoggerConfig.format ? Winston.format.printf(Logger.mainLoggerConfig.format) : Winston.format.json())
            ),
            level: LogLevel[Logger.mainLoggerConfig.level || LogLevel.info],
            transports: [
                new Winston.transports.Console()
            ]
        };
        return Winston.createLogger(options);
    }
}
