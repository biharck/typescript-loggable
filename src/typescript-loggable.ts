'use strict';

import { inspect } from 'util';
import * as Winston from 'winston';
const parentModule = require('parent-module');

export enum LogLevel {
    error, warn, info, debug
}
export class Logger {
    
    private level: LogLevel;
    public winston: Winston.Logger;
    private loggerOptions: Winston.LoggerOptions;

    constructor(loggerOptions?: Winston.LoggerOptions) {
        this.loggerOptions = loggerOptions;
        this.logLevel = LogLevel.info;        
    }

    public get logLevel() {
        return this.level;
    }

    public set logLevel(level: LogLevel) {
        if (level !== this.level) {
            this.level = level;
            this.winston = this.instantiateLogger(this.loggerOptions);
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

    public debug(message: string, ...meta: any[]) {
        meta.push({caller: parentModule()});
        this.winston.debug(message, ...meta);
    }

    public info(message: string, ...meta: any[]) {
        meta.push({caller: parentModule()});
        this.winston.info(message, ...meta);
    }

    public warn(message: string, ...meta: any[]) {
        meta.push({caller: parentModule()});
        this.winston.warn(message, ...meta);
    }

    public error(message: string, ...meta: any[]) {
        meta.push({caller: parentModule()});
        this.winston.error(message, ...meta);
    }

    public inspectObject(object: any) {
        inspect(object, { colors: true, depth: 15 });
    }

    private instantiateLogger(loggerOptions: Winston.LoggerOptions) {
        
        const options: Winston.LoggerOptions = loggerOptions || {
            format: Winston.format.combine(
                Winston.format.timestamp({
                    format: 'YYYY-MM-DD HH:mm:ss'
                }),
                Winston.format.ms(),
                Winston.format.printf(info => {
                    const caller = info.caller ? `@${info.caller}` : '';
                    return `${info.timestamp} ${info.level}: ${info.message} ${caller} (${info.ms}) `;
                })
            ),
            level: LogLevel[this.level],
            transports: [
                new Winston.transports.Console()
            ]
        };
        return Winston.createLogger(options);
    }
}
