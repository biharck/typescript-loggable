import { Logger, LogLevel } from '../src/typescript-loggable';

describe('typescript-loggable', () => {
    
    const logger = Logger.getInstance();

    it('should return false by default for showCaller', async () => {        
        expect(logger.showCaller).toBe(false);
    });

    it('should be able to change showCaller value to true', async () => {        
        logger.showCaller = true;
        expect(logger.showCaller).toBe(true);
    });

    it('should return info by default for logLevel', async () => {        
        expect(logger.logLevel).toBe(LogLevel.info);
    });

    it('should return logLevel as Info', async () => {
        expect(logger.isInfoEnabled()).toBe(true);
    });

    it('should be able to change logLevel to debug', async () => {        
        logger.logLevel = LogLevel.debug;
        expect(logger.logLevel).toBe(LogLevel.debug);
    });

    it('should return logLevel as Deugable', async () => {
        expect(logger.isDebugEnabled()).toBe(true);
    });

    it('should be able to change logLevel to Warning', async () => {        
        logger.logLevel = LogLevel.warn;
        expect(logger.logLevel).toBe(LogLevel.warn);
    });

    it('should return logLevel as Warn', async () => {
        expect(logger.isWarnEnabled()).toBe(true);
    });

    it('should be able to change logLevel to Error', async () => {        
        logger.logLevel = LogLevel.error;
        expect(logger.logLevel).toBe(LogLevel.error);
    });

    it('should return logLevel as Error', async () => {
        expect(logger.isErrorEnabled()).toBe(true);
    });

});
