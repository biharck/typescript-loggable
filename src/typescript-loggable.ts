import * as Winston from 'winston';
import callsites from 'callsites';

export enum LogLevel {
    error, warn, info, debug
}
export class Logger {

    private static instance: Logger;    
    private level: LogLevel;
    public winston: Winston.Logger;
    private caller: boolean;
    
    private constructor() {
        this.logLevel = LogLevel.info;   
    }

    public static getInstance(): Logger {
        if (!Logger.instance) {
            Logger.instance = new Logger();            
        }

        return Logger.instance;
    }

    public get logLevel() {
        return this.level;
    }

    public get showCaller(){
        return this.caller;
    }

    public set logLevel(level: LogLevel) {
        if (level !== this.level) {
            this.level = level;
            this.showCaller = false;
            this.winston = this.instantiateLogger(this.loggerOptions);
        }
    }

    public set loggerOptions(options: Winston.LoggerOptions){
        this.winston = this.instantiateLogger(options);
    }

    public set showCaller(caller: boolean){
        this.caller = caller;
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
        this.fillCaller(meta);
        this.winston.debug(message, ...meta);
    }

    public info(message: string, ...meta: Array<any>) {
        this.fillCaller(meta);
        this.winston.info(message, ...meta);
    }

    public warn(message: string, ...meta: Array<any>) {
        this.fillCaller(meta);
        this.winston.warn(message, ...meta);
    }

    public error(message: string, ...meta: Array<any>) {
        this.fillCaller(meta);
        this.winston.error(message, ...meta);
    }

    private fillCaller(meta: Array<any>) {
        if (this.caller){
            const stacks = callsites();
            if(stacks)
                meta.push({ caller: stacks[2].getFileName() });
        }            
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
