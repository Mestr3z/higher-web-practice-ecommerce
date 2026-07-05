import { hasMinLength, isRequired, isValidEmail } from './validation';

describe('validation', () => {
  it('isValidEmail принимает корректный и отклоняет некорректный', () => {
    expect(isValidEmail('ivan@example.com')).toBe(true);
    expect(isValidEmail('ivan@example')).toBe(false);
    expect(isValidEmail('abc')).toBe(false);
    expect(isValidEmail('')).toBe(false);
  });

  it('isRequired считает пустую строку и пробелы невалидными', () => {
    expect(isRequired('текст')).toBe(true);
    expect(isRequired('   ')).toBe(false);
    expect(isRequired('')).toBe(false);
  });

  it('hasMinLength проверяет длину', () => {
    expect(hasMinLength('123456', 6)).toBe(true);
    expect(hasMinLength('123', 6)).toBe(false);
  });
});
