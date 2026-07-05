import { makeProduct } from '../test/factories';
import { emptyFilters, filterProducts, getFacetValues } from './filterProducts';

const p1 = makeProduct({
  id: '1',
  price: 590,
  characteristics: {
    категория: 'Классические',
    стиль: 'Военный',
    густота: 'Низкая',
    закрученность: 'Низкая',
    харизма: '2',
  },
});
const p2 = makeProduct({
  id: '2',
  price: 3490,
  characteristics: {
    категория: 'Экзотические',
    стиль: 'Винтаж',
    густота: 'Высокая',
    закрученность: 'Высокая',
    харизма: '5',
  },
});
const p3 = makeProduct({
  id: '3',
  price: 1790,
  characteristics: {
    категория: 'Классические',
    стиль: 'Винтаж',
    густота: 'Средняя',
    закрученность: 'Средняя',
    харизма: '4',
  },
});
const all = [p1, p2, p3];

describe('filterProducts', () => {
  it('пустые фильтры возвращают всё', () => {
    expect(filterProducts(all, emptyFilters)).toHaveLength(3);
  });

  it('фильтр по категории', () => {
    expect(
      filterProducts(all, { ...emptyFilters, category: 'Классические' }).map((p) => p.id),
    ).toEqual(['1', '3']);
  });

  it('фильтр по стилю (мультивыбор)', () => {
    expect(
      filterProducts(all, { ...emptyFilters, styles: ['Винтаж'] }).map((p) => p.id),
    ).toEqual(['2', '3']);
  });

  it('диапазон цены', () => {
    expect(
      filterProducts(all, {
        ...emptyFilters,
        priceMin: 1000,
        priceMax: 2000,
      }).map((p) => p.id),
    ).toEqual(['3']);
  });

  it('тумблер "повышает харизму" (>= 4)', () => {
    expect(
      filterProducts(all, { ...emptyFilters, boostsCharisma: true }).map((p) => p.id),
    ).toEqual(['2', '3']);
  });

  it('тумблер "требует укладки воском" (закрученность != Низкая)', () => {
    expect(
      filterProducts(all, { ...emptyFilters, needsWax: true }).map((p) => p.id),
    ).toEqual(['2', '3']);
  });

  it('комбинация фильтров', () => {
    expect(
      filterProducts(all, {
        ...emptyFilters,
        category: 'Классические',
        styles: ['Винтаж'],
      }).map((p) => p.id),
    ).toEqual(['3']);
  });

  it('getFacetValues возвращает уникальные значения', () => {
    expect(getFacetValues(all, 'категория')).toEqual(['Классические', 'Экзотические']);
  });
});
