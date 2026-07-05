import { makeProduct } from '../test/factories';
import { searchProducts } from './searchProducts';

const predsedatel = makeProduct({ id: '1', name: 'Председатель' });
const gentleman = makeProduct({ id: '2', name: 'Джентльмен' });
const detective = makeProduct({ id: '3', name: 'Детектив' });
const all = [predsedatel, gentleman, detective];

describe('searchProducts', () => {
  it('находит по части названия без учёта регистра', () => {
    expect(searchProducts(all, 'пред').map((p) => p.id)).toEqual(['1']);
    expect(searchProducts(all, 'ДЖЕНТ').map((p) => p.id)).toEqual(['2']);
  });

  it('пустой запрос возвращает все товары', () => {
    expect(searchProducts(all, '')).toHaveLength(3);
    expect(searchProducts(all, '   ')).toHaveLength(3);
  });

  it('возвращает пусто, если ничего не совпало', () => {
    expect(searchProducts(all, 'ффф')).toEqual([]);
  });
});
