import { TraceLogger, TraceUtils } from "../utils";

describe('ApplicationService', () => {
    it('should create new logger', () => {
        const logger = TraceUtils.newLogger();
        expect(logger).toBeTruthy();
        logger.level('verbose');
        const spy = spyOn(console, 'log');
        logger.verbose('test verbose');
        expect(spy).toHaveBeenCalled();
        spy.calls.reset();
        TraceUtils.verbose('test verbose');
        expect(spy).not.toHaveBeenCalled();
    });
});
