import { NumberUtils } from '../src';

describe('NumberUtils', () => {
  it('should convert to base26', () => {
    const result = NumberUtils.toBase26(1);
    expect(result).toBeTruthy();
    expect(result).toBe('baaaaaaa');
    expect(() => {
      NumberUtils.toBase26(-1)
    }).toThrowError();
  });

  it('should convert from base26', () => {
    const result = NumberUtils.fromBase26('baaaaaaa');
    expect(result).toBe(1);
    expect(() => {
      NumberUtils.fromBase26('xyz')
    }).toThrowError();
  });

  it('should convert base-26 string to number correctly', () => {
    expect(NumberUtils.fromBase26('aaaaaaaa')).toBe(0);
    expect(NumberUtils.fromBase26('baaaaaaa')).toBe(1);
    expect(NumberUtils.fromBase26('caaaaaaa')).toBe(2);
    expect(NumberUtils.fromBase26('zaaaaaaa')).toBe(25);
    expect(NumberUtils.fromBase26('abaaaaaa')).toBe(26);
    expect(NumberUtils.fromBase26('bbaaaaaa')).toBe(27);
  });

  it('should throw an error for invalid base-26 format', () => {
    expect(() => NumberUtils.fromBase26('12345678')).toThrow('Invalid base-26 format.');
    expect(() => NumberUtils.fromBase26('aaaaaaa')).toThrow('Invalid base-26 format.');
  });

  it('should convert 0 to "aaaaaaaa"', () => {
    expect(NumberUtils.toBase26(0)).toBe('aaaaaaaa');
  });

  it('should convert 1 to "baaaaaaa"', () => {
    expect(NumberUtils.toBase26(1)).toBe('baaaaaaa');
  });

  it('should convert 25 to "zaaaaaaa"', () => {
    expect(NumberUtils.toBase26(25)).toBe('zaaaaaaa');
  });

  it('should convert 26 to "abaaaaaa"', () => {
    expect(NumberUtils.toBase26(26)).toBe('abaaaaaa');
  });

  it('should convert 208827064575 to "zzzzzzzz"', () => {
    expect(NumberUtils.toBase26(208827064575)).toBe('zzzzzzzz');
  });

  it('should throw an error for negative numbers', () => {
    expect(() => NumberUtils.toBase26(-1)).toThrow('A non-positive integer cannot be converted to base-26 format.');
  });

  it('should throw an error for numbers greater than 208827064575', () => {
    expect(() => NumberUtils.toBase26(208827064576)).toThrow('A positive integer bigger than 208827064575 cannot be converted to base-26 format.');
  });

});
