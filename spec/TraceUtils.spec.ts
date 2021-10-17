import {TraceUtils} from '../src';

describe('TraceUtils', () => {
    it('should use TraceUtils.log', () => {
        TraceUtils.format('json');
        TraceUtils.log('Stage1', 'Process is being started');
        TraceUtils.log('Stage2', 'Application is being started');
        TraceUtils.error(new Error('Process error'));
    });
});