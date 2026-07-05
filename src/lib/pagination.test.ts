import { getPageNumbers } from './pagination';

describe('getPageNumbers', () => {
  it('одна страница', () => {
    expect(getPageNumbers(1, 1)).toEqual([1]);
  });

  it('мало страниц — без многоточий', () => {
    expect(getPageNumbers(1, 3)).toEqual([1, 2, 3]);
  });

  it('текущая в начале — многоточие справа', () => {
    expect(getPageNumbers(1, 10)).toEqual([1, 2, 'ellipsis', 10]);
  });

  it('текущая в середине — многоточия с обеих сторон', () => {
    expect(getPageNumbers(5, 10)).toEqual([1, 'ellipsis', 4, 5, 6, 'ellipsis', 10]);
  });

  it('текущая в конце — многоточие слева', () => {
    expect(getPageNumbers(10, 10)).toEqual([1, 'ellipsis', 9, 10]);
  });
});
