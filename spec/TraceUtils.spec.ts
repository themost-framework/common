import { TraceUtils } from "../utils";

describe('ApplicationService', () => {
    it('should create new logger', () => {
        const logger = TraceUtils.newLogger();
        expect(logger).toBeTruthy();
        logger.level('verbose');
        logger.verbose('test verbose');
    });
});
