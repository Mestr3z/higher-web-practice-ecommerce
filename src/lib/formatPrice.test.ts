import { formatPrice } from './formatPrice';

const normalize = (value: string) => value.replace(/[\u00a0\u202f]/g, ' ');

describe('formatPrice', () => {
  it('форматирует тысячи с разделителем и знаком рубля', () => {
    expect(normalize(formatPrice(5590))).toBe('5 590 ₽');
  });

  it('работает с нулём', () => {
    expect(normalize(formatPrice(0))).toBe('0 ₽');
  });
});
