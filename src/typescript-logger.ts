import { AutoWired, Singleton } from 'typescript-ioc';
import { inspect } from 'util';
import * as Winston from 'winston';

export enum LogLevel {
    error, warn, info, debug
}
@Singleton
@AutoWired
export class Logger {
    private level: LogLevel;
    public winston: Winston.Logger;

    constructor() {
        this.logLevel = LogLevel.info;
    }

    public get logLevel() {
        return this.level;
    }

    public set logLevel(level: LogLevel) {
        if (level !== this.level) {
            this.level = level;
            this.winston = this.instantiateLogger();
        }
    }

    public isDebugEnabled(): boolean {
        return this.level === LogLevel.debug;
    }

    public isInfoEnabled(): boolean {
        return this.level >= LogLevel.info;
    }

    public isWarnEnabled(): boolean {
        return this.level >= LogLevel.warn;
    }

    public isErrorEnabled(): boolean {
        return this.level >= LogLevel.error;
    }

    public debug(message: string, ...meta: Array<any>) {
        this.winston.debug(message, meta);
    }

    public info(message: string, ...meta: Array<any>) {
        this.winston.info(message, meta);
    }

    public warn(message: string, ...meta: Array<any>) {
        this.winston.warn(message, meta);
    }

    public error(message: string, ...meta: Array<any>) {
        this.winston.error(message, meta);
    }

    public inspectObject(object: any) {
        inspect(object, { colors: true, depth: 15 });
    }

    private instantiateLogger() {
        const logFormatter = Winston.format.printf(info => {
            return `${info.timestamp} ${info.level}: ${info.message} (${info.ms})`;
        });
        const options: Winston.LoggerOptions = {
            format: Winston.format.combine(
                Winston.format.timestamp({
                    format: 'YYYY-MM-DD HH:mm:ss'
                }),
                Winston.format.ms(),
                logFormatter
            ),
            level: LogLevel[this.level],
            transports: [
                new Winston.transports.Console()
            ]
        };
        return Winston.createLogger(options);
    }
}
