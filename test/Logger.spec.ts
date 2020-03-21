import { Logger } from '../src/typescript-loggable';

describe('typescript-loggable', () => {

    const logger = new Logger();

    it('should return logLevel as Info', async () => {
        expect(logger.isInfoEnabled()).toBe(true);
    });
});
