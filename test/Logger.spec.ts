jest.mock('winston');

import { parseLogLevel, LogLevel, Logger } from '../src/typescript-loggable';
import * as Winston from 'winston';

describe('typescript-loggable', () => {


    const mockChild = jest.fn();
    (Winston as any).Logger = {
        child: mockChild
    };
    (Winston as any).createLogger = jest.fn();
    const mockCreateLogger = Winston.createLogger as jest.Mock;

    beforeAll(() => {
        mockCreateLogger.mockReturnValue((Winston as any).Logger);
    });

    describe('parseLogLevel()', () => {
        it('should parse log levels correctly', async () => {
            expect(parseLogLevel('debug')).toEqual(LogLevel.debug);
            expect(parseLogLevel('info')).toEqual(LogLevel.info);
            expect(parseLogLevel('warn')).toEqual(LogLevel.warn);
            expect(parseLogLevel('error')).toEqual(LogLevel.error);
        });
        it('should return info as default level', async () => {
            expect(parseLogLevel('invalid')).toEqual(LogLevel.info);
            expect(parseLogLevel(undefined)).toEqual(LogLevel.info);
        });
    });

    describe('configureMainLogger()', () => {

        const mockFormatCombine = jest.fn();
        const mockFormatTimestamp = jest.fn();
        const mockFormatMs = jest.fn();
        const mockFormatJson = jest.fn();
        const mockPrintf = jest.fn();

        (Winston as any).format = {
            combine: mockFormatCombine,
            timestamp: mockFormatTimestamp,
            ms: mockFormatMs,
            json: mockFormatJson,
            printf: mockPrintf
        };

        (Winston as any).transports = {
            Console: jest.fn(),
        };

        beforeEach(() => {
            mockCreateLogger.mockClear();
            mockFormatCombine.mockClear();
            mockFormatTimestamp.mockClear();
            mockFormatMs.mockClear();
            mockFormatJson.mockClear();
            mockPrintf.mockClear();
        });

        it('should configure the mainLogger correctly', async () => {
            const config = {
                level: LogLevel.debug,
                showCaller: true,
            };
            mockFormatCombine.mockReturnValue('combine result');
            mockFormatMs.mockReturnValue('ms result');
            mockFormatTimestamp.mockReturnValue('timestamp result');
            mockFormatJson.mockReturnValue('json result');

            Logger.configureMainLogger(config);
            expect(mockCreateLogger).toBeCalledWith(expect.objectContaining({
                format: 'combine result',
                level: 'debug',
                transports: expect.arrayContaining([expect.any(Winston.transports.Console)])
            }));
            expect(mockFormatTimestamp).toBeCalledWith({
                format: 'YYYY-MM-DDTHH:mm:ss.SSSZZ'
            });
            expect(mockFormatCombine).toBeCalledWith('timestamp result', 'ms result', 'json result');
            expect(mockFormatTimestamp).toBeCalledTimes(1);
            expect(mockFormatMs).toBeCalledTimes(1);
            expect(mockFormatJson).toBeCalledTimes(1);
        });

        it('should configure the mainLogger with custom format', async () => {
            const format = 'formatter';
            const config = {
                level: LogLevel.debug,
                showCaller: true,
                format: format
            };
            mockFormatCombine.mockReturnValue('combine result');
            mockFormatMs.mockReturnValue('ms result');
            mockFormatTimestamp.mockReturnValue('timestamp result');
            mockPrintf.mockReturnValue('printf result');

            Logger.configureMainLogger(config as any);

            expect(mockCreateLogger).toBeCalledWith(expect.objectContaining({
                format: 'combine result',
                level: 'debug',
                transports: expect.arrayContaining([expect.any(Winston.transports.Console)])
            }));
            expect(mockFormatTimestamp).toBeCalledWith({
                format: 'YYYY-MM-DDTHH:mm:ss.SSSZZ'
            });
            expect(mockFormatCombine).toBeCalledWith('timestamp result', 'ms result', 'printf result');
            expect(mockFormatTimestamp).toBeCalledTimes(1);
            expect(mockFormatMs).toBeCalledTimes(1);
            expect(mockPrintf).toBeCalledTimes(1);
            expect(mockPrintf).toBeCalledWith(format);
        });

        it('should configure the mainLogger with custom options', async () => {
            const loggerOptions = 'options';
            const config = {
                loggerOptions: loggerOptions
            };
            Logger.configureMainLogger(config as any);

            expect(mockCreateLogger).toBeCalledWith(config.loggerOptions);
        });
    });

    describe('configure()', () => {
        const logger = new Logger();

        beforeEach(() => {
            mockChild.mockClear();
        });

        it('should configure the logger correctly', async () => {
            const config = {
                level: LogLevel.debug,
                showCaller: true,
                extra: { a: 'object' }
            };
            const childLogger: any = {};
            mockChild.mockReturnValue(childLogger);

            logger.configure(config);

            expect(mockChild).toBeCalledWith(config.extra);
            expect(childLogger.level).toEqual('debug');
        });

        it('should configure the logger with the default values', async () => {
            const config = {};
            const childLogger: any = {};
            mockChild.mockReturnValue(childLogger);

            logger.configure(config);

            expect(mockChild).toBeCalledWith({});
            expect(childLogger.level).toEqual('info');
        });
    });

    describe('log levels()', () => {
        const logger = new Logger();

        beforeEach(() => {
            mockChild.mockClear();
        });

        it('works correctly for LogLevel.debug', async () => {
            const config = {
                level: LogLevel.debug
            };
            const childLogger: any = {};
            mockChild.mockReturnValue(childLogger);

            logger.configure(config);

            expect(logger.isDebugEnabled()).toBeTruthy();
        });

        it('works correctly for LogLevel.info', async () => {
            const config = {
                level: LogLevel.info
            };
            const childLogger: any = {};
            mockChild.mockReturnValue(childLogger);

            logger.configure(config);

            expect(logger.isDebugEnabled()).toBeFalsy();
            expect(logger.isInfoEnabled()).toBeTruthy();
        });

        it('works correctly for LogLevel.warn', async () => {
            const config = {
                level: LogLevel.warn
            };
            const childLogger: any = {};
            mockChild.mockReturnValue(childLogger);

            logger.configure(config);

            expect(logger.isInfoEnabled()).toBeFalsy();
            expect(logger.isWarnEnabled()).toBeTruthy();
        });

        it('works correctly for LogLevel.error', async () => {
            const config = {
                level: LogLevel.error
            };
            const childLogger: any = {};
            mockChild.mockReturnValue(childLogger);

            logger.configure(config);

            expect(logger.isWarnEnabled()).toBeFalsy();
            expect(logger.isErrorEnabled()).toBeTruthy();
        });
    });

    describe('log functions()', () => {
        const logger = new Logger();
        const mockDebug = jest.fn();
        const mockInfo = jest.fn();
        const mockWarn = jest.fn();
        const mockError = jest.fn();

        beforeAll(() => {
            const config = {};
            const childLogger: any = {
                debug: mockDebug,
                info: mockInfo,
                warn: mockWarn,
                error: mockError
            };
            mockChild.mockReturnValue(childLogger);

            logger.configure(config);

        });

        beforeEach(() => {
            mockChild.mockClear();
            mockDebug.mockClear();
            mockInfo.mockClear();
            mockWarn.mockClear();
            mockError.mockClear();
        });

        it('works correctly for debug', async () => {
            logger.debug('log message', { meta: 'object' });
            expect(mockDebug).toBeCalledWith('log message', { meta: 'object' });
        });

        it('works correctly for info', async () => {
            logger.info('log message', { meta: 'object' });
            expect(mockInfo).toBeCalledWith('log message', { meta: 'object' });
        });

        it('works correctly for warn', async () => {
            logger.warn('log message', { meta: 'object' });
            expect(mockWarn).toBeCalledWith('log message', { meta: 'object' });
        });

        it('works correctly for error', async () => {
            logger.error('log message', { meta: 'object' });
            expect(mockError).toBeCalledWith('log message', { meta: 'object' });
        });
    });

    describe('showCaller', () => {
        const logger = new Logger();
        const mockInfo = jest.fn();

        beforeAll(() => {
            Logger.configureMainLogger({
                showCaller: true
            });
            const config = {};
            const childLogger: any = {
                info: mockInfo
            };
            mockChild.mockReturnValue(childLogger);

            logger.configure(config);

        });

        beforeEach(() => {
            mockChild.mockClear();
            mockInfo.mockClear();
        });

        it('works correctly when providing meta ifno', async () => {
            logger.info('log message', { meta: 'object' });
            expect(mockInfo).toBeCalledWith('log message', {
                meta: 'object',
                caller: expect.stringContaining('/test/Logger.spec.ts')
            });
        });

        it('works correctly when without meta ifno', async () => {
            logger.info('log message');
            expect(mockInfo).toBeCalledWith('log message', {
                caller: expect.stringContaining('/test/Logger.spec.ts')
            });
        });
    });
});
