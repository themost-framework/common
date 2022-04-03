import {NumberUtils} from '../src';

describe('NumberUtils', () => {
  it('should convert to base26', () => {
    const object = {};
    const result = NumberUtils.toBase26(1);
    expect(result).toBeTruthy();
    expect(result).toBe('baaaaaaa');
    expect(() => {
      NumberUtils.toBase26(-1)
    }).toThrowError();
  });

  it('should convert from base26', () => {
    const object = {};
    const result = NumberUtils.fromBase26('baaaaaaa');
    expect(result).toBe(1);
    expect(() => {
      NumberUtils.fromBase26('xyz')
    }).toThrowError();
  });
});
